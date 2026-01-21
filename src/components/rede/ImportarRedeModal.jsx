import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ImportarRedeModal({ onClose }) {
  const [arquivo, setArquivo] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, uploading, extracting, importing, success, error
  const [mensagem, setMensagem] = useState("");
  const [totalImportados, setTotalImportados] = useState(0);

  const queryClient = useQueryClient();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setArquivo(file);
      setStatus("idle");
      setMensagem("");
    } else {
      setMensagem("Por favor, selecione um arquivo PDF válido");
      setStatus("error");
    }
  };

  const processarImportacao = async () => {
    if (!arquivo) {
      setMensagem("Selecione um arquivo PDF");
      setStatus("error");
      return;
    }

    try {
      // 1. Upload do arquivo
      setStatus("uploading");
      setMensagem("Enviando arquivo...");
      
      const uploadResult = await base44.integrations.Core.UploadFile({ file: arquivo });
      const fileUrl = uploadResult.file_url;

      // 2. Extrair dados do PDF
      setStatus("extracting");
      setMensagem("Extraindo dados do PDF... Isso pode levar alguns minutos para arquivos grandes.");

      // Schema dos estabelecimentos que queremos extrair
      const jsonSchema = {
        type: "object",
        properties: {
          estabelecimentos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                nome: { type: "string" },
                tipo: { type: "string" },
                especialidades: { type: "string" },
                endereco: { type: "string" },
                bairro: { type: "string" },
                cidade: { type: "string" },
                estado: { type: "string" },
                cep: { type: "string" },
                telefone: { type: "string" },
                whatsapp: { type: "string" },
                horario_funcionamento: { type: "string" },
                atendimento_24h: { type: "boolean" },
                observacoes: { type: "string" }
              },
              required: ["nome", "tipo", "cidade"]
            }
          }
        }
      };

      const extractResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url: fileUrl,
        json_schema: jsonSchema
      });

      if (extractResult.status === "error") {
        throw new Error(extractResult.details || "Erro ao extrair dados do PDF");
      }

      const estabelecimentos = extractResult.output?.estabelecimentos || [];
      
      if (estabelecimentos.length === 0) {
        throw new Error("Nenhum estabelecimento encontrado no PDF");
      }

      // 3. Importar em lotes
      setStatus("importing");
      setMensagem(`Importando ${estabelecimentos.length} estabelecimentos...`);

      // Limpar dados existentes (opcional - comentado para segurança)
      // await base44.entities.EstabelecimentoCredenciado.filter({}).then(items => 
      //   items.forEach(item => base44.entities.EstabelecimentoCredenciado.delete(item.id))
      // );

      // Importar em lotes de 50
      const loteSize = 50;
      let importados = 0;

      for (let i = 0; i < estabelecimentos.length; i += loteSize) {
        const lote = estabelecimentos.slice(i, i + loteSize);
        
        // Normalizar dados do lote
        const loteNormalizado = lote.map(est => ({
          nome: est.nome || "",
          tipo: est.tipo || "clinica",
          especialidades: est.especialidades || "",
          endereco: est.endereco || "",
          bairro: est.bairro || "",
          cidade: est.cidade || "Osasco",
          estado: est.estado || "SP",
          cep: est.cep || "",
          telefone: est.telefone || "",
          whatsapp: est.whatsapp || "",
          horario_funcionamento: est.horario_funcionamento || "",
          atendimento_24h: est.atendimento_24h || false,
          observacoes: est.observacoes || ""
        }));

        await base44.entities.EstabelecimentoCredenciado.bulkCreate(loteNormalizado);
        importados += lote.length;
        setTotalImportados(importados);
        setMensagem(`Importados ${importados} de ${estabelecimentos.length} estabelecimentos...`);
        
        // Pequeno delay entre lotes
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Sucesso
      setStatus("success");
      setMensagem(`Importação concluída! ${importados} estabelecimentos importados com sucesso.`);
      setTotalImportados(importados);
      
      // Atualizar lista
      queryClient.invalidateQueries({ queryKey: ['estabelecimentos'] });

    } catch (error) {
      console.error("Erro na importação:", error);
      setStatus("error");
      setMensagem(error.message || "Erro ao processar importação");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Importar Rede Credenciada
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Upload de arquivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo PDF da Rede Credenciada
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#4DBABC] transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
                disabled={status !== "idle" && status !== "error"}
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  {arquivo ? arquivo.name : "Clique para selecionar o PDF"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Suporta arquivos grandes (até 10MB+)
                </p>
              </label>
            </div>
          </div>

          {/* Status da importação */}
          {status !== "idle" && (
            <div className={`p-4 rounded-lg border ${
              status === "success" ? "bg-green-50 border-green-200" :
              status === "error" ? "bg-red-50 border-red-200" :
              "bg-blue-50 border-blue-200"
            }`}>
              <div className="flex items-start gap-3">
                {status === "success" && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                {status === "error" && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                {(status === "uploading" || status === "extracting" || status === "importing") && (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    status === "success" ? "text-green-800" :
                    status === "error" ? "text-red-800" :
                    "text-blue-800"
                  }`}>
                    {mensagem}
                  </p>
                  {totalImportados > 0 && status === "importing" && (
                    <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${(totalImportados / 100) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instruções */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-2">
              <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Instruções:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>O PDF deve conter a lista de estabelecimentos credenciados</li>
                  <li>O sistema irá extrair automaticamente os dados usando IA</li>
                  <li>A importação pode levar alguns minutos para arquivos grandes</li>
                  <li>Os estabelecimentos serão adicionados à base existente</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={status === "uploading" || status === "extracting" || status === "importing"}
            >
              {status === "success" ? "Fechar" : "Cancelar"}
            </Button>
            <Button
              onClick={processarImportacao}
              disabled={!arquivo || status === "uploading" || status === "extracting" || status === "importing" || status === "success"}
              className="bg-[#4DBABC] hover:bg-[#45B1B3]"
            >
              {status === "uploading" || status === "extracting" || status === "importing" 
                ? "Processando..." 
                : "Importar Rede"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}