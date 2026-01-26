import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

/**
 * Componente para importar a rede credenciada completa usando IA
 * 
 * Compliance: 
 * - Dados públicos de estabelecimentos de saúde
 * - Não contém dados pessoais sensíveis
 * - Auditoria via created_by automático
 */
export default function ImportarRedeCompleta({ onComplete }) {
  const [status, setStatus] = useState("idle"); // idle, processing, success, error
  const [progresso, setProgresso] = useState(0);
  const [totalCriados, setTotalCriados] = useState(0);
  const [erros, setErros] = useState([]);
  const [detalhes, setDetalhes] = useState("");

  const URL_ARQUIVO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691644e4652cae53371d6050/29a32a450_rede-credenciada-sagrada-familia.txt";

  const processarImportacao = async () => {
    setStatus("processing");
    setProgresso(10);
    setDetalhes("Baixando arquivo da rede credenciada...");

    try {
      // Usar IA para extrair dados estruturados do arquivo
      setProgresso(30);
      setDetalhes("Processando arquivo com IA para extrair estabelecimentos...");

      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um assistente especializado em extrair dados de estabelecimentos de saúde.

Analise o arquivo de rede credenciada e extraia TODOS os estabelecimentos em formato JSON estruturado.

Para cada estabelecimento, extraia:
- nome (string): nome completo do estabelecimento
- tipo (string): classifique como "hospital", "clinica", "laboratorio", "pronto_socorro", "diagnostico" ou "especialidade"
- endereco (string): endereço completo
- bairro (string): bairro (se disponível)
- cidade (string): cidade
- estado (string): estado (padrão "SP")
- cep (string): CEP formatado
- telefone (string): telefone principal
- whatsapp (string ou null): WhatsApp se mencionado
- especialidades (string): todas especialidades separadas por vírgula
- atendimento_24h (boolean): true se mencionar 24h ou pronto socorro
- observacoes (string ou null): horário de funcionamento ou outras observações

Critérios de classificação:
- tipo "hospital": se contém "HOSPITAL" no nome ou serviços hospitalares completos
- tipo "pronto_socorro": se é especificamente P.S ou Pronto Socorro
- tipo "laboratorio": se é laboratório de análises clínicas
- tipo "clinica": clínicas médicas, consultórios, centros médicos
- tipo "diagnostico": se foca em exames de imagem e diagnósticos
- tipo "especialidade": clínicas especializadas (oftalmologia, fisioterapia, etc)

IMPORTANTE: 
- Extraia TODOS os estabelecimentos do arquivo
- Mantenha formatação consistente
- CEP sem pontos ou hífens
- Telefone no formato (11) XXXXX-XXXX
- Consolide informações duplicadas do mesmo estabelecimento

Retorne um array JSON com TODOS os estabelecimentos encontrados.`,
        add_context_from_internet: false,
        file_urls: [URL_ARQUIVO],
        response_json_schema: {
          type: "object",
          properties: {
            estabelecimentos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  nome: { type: "string" },
                  tipo: { type: "string", enum: ["hospital", "clinica", "laboratorio", "pronto_socorro", "diagnostico", "especialidade"] },
                  endereco: { type: "string" },
                  bairro: { type: "string" },
                  cidade: { type: "string" },
                  estado: { type: "string" },
                  cep: { type: "string" },
                  telefone: { type: "string" },
                  whatsapp: { type: ["string", "null"] },
                  especialidades: { type: "string" },
                  atendimento_24h: { type: "boolean" },
                  observacoes: { type: ["string", "null"] }
                },
                required: ["nome", "tipo", "cidade"]
              }
            }
          },
          required: ["estabelecimentos"]
        }
      });

      const estabelecimentos = resultado.estabelecimentos || [];
      
      if (estabelecimentos.length === 0) {
        throw new Error("Nenhum estabelecimento foi extraído do arquivo");
      }

      setProgresso(60);
      setDetalhes(`${estabelecimentos.length} estabelecimentos identificados. Criando registros...`);

      // Criar estabelecimentos em lotes de 50 (para evitar timeout)
      const BATCH_SIZE = 50;
      let criados = 0;
      const errosImportacao = [];

      for (let i = 0; i < estabelecimentos.length; i += BATCH_SIZE) {
        const lote = estabelecimentos.slice(i, i + BATCH_SIZE);
        
        try {
          await base44.entities.EstabelecimentoCredenciado.bulkCreate(lote);
          criados += lote.length;
          
          const progressoAtual = 60 + (criados / estabelecimentos.length) * 35;
          setProgresso(progressoAtual);
          setTotalCriados(criados);
          setDetalhes(`${criados}/${estabelecimentos.length} estabelecimentos criados...`);
        } catch (error) {
          console.error(`Erro no lote ${i}-${i + BATCH_SIZE}:`, error);
          errosImportacao.push(`Lote ${i}-${i + BATCH_SIZE}: ${error.message}`);
        }
      }

      setProgresso(100);
      setStatus("success");
      setTotalCriados(criados);
      setDetalhes(`Importação concluída! ${criados} estabelecimentos adicionados à rede credenciada.`);
      
      if (errosImportacao.length > 0) {
        setErros(errosImportacao);
      }

      // Notificar conclusão
      if (onComplete) {
        setTimeout(() => onComplete(), 2000);
      }

    } catch (error) {
      console.error("Erro na importação:", error);
      setStatus("error");
      setDetalhes(`Erro: ${error.message}`);
      setErros([error.message]);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Importar Rede Credenciada Completa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "idle" && (
          <>
            <p className="text-sm text-gray-600">
              Este processo irá usar inteligência artificial para extrair e importar todos os estabelecimentos 
              da rede credenciada do Plano Sagrada Família.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-blue-900 mb-2">O que será importado:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Hospitais e Pronto Socorros</li>
                <li>• Clínicas Médicas e Especializadas</li>
                <li>• Laboratórios de Análises Clínicas</li>
                <li>• Centros de Diagnóstico por Imagem</li>
                <li>• Dados completos: endereço, telefone, especialidades, horários</li>
              </ul>
            </div>
            <Button 
              onClick={processarImportacao}
              className="w-full bg-[#4DBABC] hover:bg-[#45B1B3]"
              size="lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              Iniciar Importação
            </Button>
          </>
        )}

        {status === "processing" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#4DBABC]" />
              <span className="text-sm font-medium">{detalhes}</span>
            </div>
            <Progress value={progresso} className="h-2" />
            {totalCriados > 0 && (
              <p className="text-sm text-gray-600 text-center">
                {totalCriados} estabelecimentos criados
              </p>
            )}
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
              <div className="flex-1">
                <p className="font-semibold">{detalhes}</p>
                <p className="text-sm mt-1">A rede credenciada foi atualizada com sucesso.</p>
              </div>
            </div>
            {erros.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-yellow-900 mb-2">
                  Alguns lotes apresentaram erros:
                </p>
                <ul className="text-xs text-yellow-800 space-y-1">
                  {erros.map((erro, idx) => (
                    <li key={idx}>• {erro}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-red-700 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Erro na importação</p>
                <p className="text-sm mt-1">{detalhes}</p>
              </div>
            </div>
            <Button 
              onClick={processarImportacao}
              variant="outline"
              className="w-full"
            >
              Tentar Novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}