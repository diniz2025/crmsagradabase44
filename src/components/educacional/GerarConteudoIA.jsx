import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand2, Loader2, X, CheckCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Gerador de Conteúdo Educacional via IA
 * 
 * Utiliza InvokeLLM para criar artigos, dicas e guias sobre:
 * - Saúde ocupacional no setor de alimentação
 * - Prevenção de doenças
 * - Uso eficaz da rede credenciada
 * - Bem-estar dos colaboradores
 */
export default function GerarConteudoIA({ onClose }) {
  const [tema, setTema] = useState("");
  const [categoria, setCategoria] = useState("prevencao_doencas");
  const [tipo, setTipo] = useState("artigo");
  const [palavrasChave, setPalavrasChave] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [conteudoGerado, setConteudoGerado] = useState(null);

  const queryClient = useQueryClient();

  const categoriasLabels = {
    prevencao_doencas: "Prevenção de Doenças",
    saude_ocupacional: "Saúde Ocupacional",
    guia_rede_credenciada: "Guia Rede Credenciada",
    bem_estar: "Bem-Estar",
    nutricao: "Nutrição",
    seguranca_trabalho: "Segurança no Trabalho",
    faq: "Perguntas Frequentes"
  };

  const tiposLabels = {
    artigo: "Artigo Completo",
    dica: "Dica Rápida",
    faq: "FAQ",
    guia: "Guia Prático"
  };

  // Sugestões de temas por categoria
  const sugestoesTemas = {
    prevencao_doencas: [
      "Como prevenir queimaduras na cozinha",
      "Prevenção de problemas respiratórios em ambientes de cozinha",
      "Cuidados com cortes e ferimentos no trabalho"
    ],
    saude_ocupacional: [
      "Importância do plano de saúde para colaboradores de restaurantes",
      "Benefícios da saúde ocupacional no setor de alimentação",
      "Como o plano de saúde aumenta a produtividade"
    ],
    guia_rede_credenciada: [
      "Como usar sua rede credenciada de forma eficaz",
      "Passo a passo para agendar consultas",
      "Principais serviços disponíveis na rede"
    ],
    bem_estar: [
      "Gestão do estresse em ambientes de alta demanda",
      "Importância do sono para profissionais de cozinha",
      "Exercícios rápidos para fazer durante o expediente"
    ],
    nutricao: [
      "Alimentação saudável para quem trabalha em restaurantes",
      "Hidratação adequada em ambientes quentes",
      "Lanches saudáveis para turnos longos"
    ],
    seguranca_trabalho: [
      "Uso correto de EPIs na cozinha",
      "Prevenção de acidentes com equipamentos",
      "Ergonomia para profissionais de cozinha"
    ]
  };

  const gerarConteudo = async () => {
    if (!tema.trim()) {
      alert("Por favor, insira um tema");
      return;
    }

    setIsGenerating(true);

    try {
      // Prompt para a IA - contexto específico para o setor de alimentação
      const prompt = `Você é um especialista em saúde ocupacional e bem-estar no setor de alimentação (bares, restaurantes, lanchonetes).

Gere um conteúdo educacional do tipo "${tiposLabels[tipo]}" sobre o tema: "${tema}"

Categoria: ${categoriasLabels[categoria]}
${palavrasChave ? `Palavras-chave a incluir: ${palavrasChave}` : ''}

Requisitos:
- Use linguagem clara e acessível para trabalhadores do setor de alimentação
- Seja prático e aplicável no dia a dia
- Inclua exemplos reais quando possível
- Foque em prevenção e bem-estar
- Se for FAQ, formate em perguntas e respostas
- Use Markdown para formatação (títulos, listas, negrito)
- Tamanho: ${tipo === 'dica' ? '200-300 palavras' : tipo === 'faq' ? '5-8 perguntas' : '500-800 palavras'}

${categoria === 'guia_rede_credenciada' ? 'Mencione que o Plano Sagrada Família tem rede credenciada em Osasco e região.' : ''}
${categoria === 'saude_ocupacional' ? 'Destaque os benefícios do Plano de Saúde Sagrada Família para empresas do setor.' : ''}`;

      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            titulo: { type: "string" },
            resumo: { type: "string" },
            conteudo: { type: "string" },
            tags: { type: "string" },
            imagem_sugerida: { type: "string" }
          }
        }
      });

      setConteudoGerado(resultado);
    } catch (error) {
      console.error("Erro ao gerar conteúdo:", error);
      alert("Erro ao gerar conteúdo. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const salvarMutation = useMutation({
    mutationFn: async () => {
      const slug = conteudoGerado.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      await base44.entities.ConteudoEducacional.create({
        titulo: conteudoGerado.titulo,
        slug: slug,
        categoria: categoria,
        tipo: tipo,
        resumo: conteudoGerado.resumo,
        conteudo: conteudoGerado.conteudo,
        tags: conteudoGerado.tags || palavrasChave,
        imagem_url: "", // Pode ser adicionado posteriormente
        publicado: true,
        destaque: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conteudos'] });
      alert("Conteúdo salvo com sucesso!");
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl bg-white p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-[#4DBABC]" />
            Gerar Conteúdo com IA
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!conteudoGerado ? (
          <div className="space-y-4">
            <div>
              <Label>Categoria</Label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
              >
                {Object.entries(categoriasLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Tipo de Conteúdo</Label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
              >
                {Object.entries(tiposLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Tema / Assunto</Label>
              <Input
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ex: Como prevenir queimaduras na cozinha"
                className="mt-1"
              />
              {sugestoesTemas[categoria] && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Sugestões:</p>
                  <div className="flex flex-wrap gap-2">
                    {sugestoesTemas[categoria].map((sugestao, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTema(sugestao)}
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"
                      >
                        {sugestao}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label>Palavras-chave (opcional)</Label>
              <Input
                value={palavrasChave}
                onChange={(e) => setPalavrasChave(e.target.value)}
                placeholder="Ex: saúde, prevenção, segurança"
                className="mt-1"
              />
            </div>

            <Button
              onClick={gerarConteudo}
              disabled={isGenerating || !tema.trim()}
              className="w-full bg-[#4DBABC] hover:bg-[#45B1B3]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando conteúdo...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Gerar Conteúdo
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Conteúdo gerado com sucesso!</span>
            </div>

            <div>
              <Label>Título</Label>
              <Input
                value={conteudoGerado.titulo}
                onChange={(e) => setConteudoGerado({...conteudoGerado, titulo: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Resumo</Label>
              <Textarea
                value={conteudoGerado.resumo}
                onChange={(e) => setConteudoGerado({...conteudoGerado, resumo: e.target.value})}
                rows={2}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Conteúdo (Markdown)</Label>
              <Textarea
                value={conteudoGerado.conteudo}
                onChange={(e) => setConteudoGerado({...conteudoGerado, conteudo: e.target.value})}
                rows={15}
                className="mt-1 font-mono text-sm"
              />
            </div>

            <div>
              <Label>Tags</Label>
              <Input
                value={conteudoGerado.tags}
                onChange={(e) => setConteudoGerado({...conteudoGerado, tags: e.target.value})}
                placeholder="Ex: saúde, prevenção, segurança"
                className="mt-1"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setConteudoGerado(null)}
                className="flex-1"
              >
                Gerar Novamente
              </Button>
              <Button
                onClick={() => salvarMutation.mutate()}
                disabled={salvarMutation.isPending}
                className="flex-1 bg-[#4DBABC] hover:bg-[#45B1B3]"
              >
                {salvarMutation.isPending ? "Salvando..." : "Salvar Conteúdo"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}