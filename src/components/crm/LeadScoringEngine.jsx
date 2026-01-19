import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LeadScoringEngine() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const queryClient = useQueryClient();

  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list(),
  });

  const { data: historico = [] } = useQuery({
    queryKey: ['historico'],
    queryFn: () => base44.entities.HistoricoStatus.list(),
  });

  const calculateScores = async () => {
    setIsCalculating(true);
    setProgress({ current: 0, total: leads.length });

    try {
      // Coletar padrões de leads convertidos (Fechado) para aprendizado
      const leadsConvertidos = leads.filter(l => l.status === 'Fechado');
      const leadsDescartados = leads.filter(l => l.status === 'Descartado');

      // Analisar padrões de conversão
      const padroes = {
        tipos_sucesso: leadsConvertidos.map(l => l.tipo_estabelecimento).filter(Boolean),
        cidades_sucesso: leadsConvertidos.map(l => l.cidade).filter(Boolean),
        tamanhos_sucesso: leadsConvertidos.map(l => l.numero_funcionarios).filter(Boolean),
        total_convertidos: leadsConvertidos.length,
        total_descartados: leadsDescartados.length
      };

      // Calcular score para cada lead
      for (let i = 0; i < leads.length; i++) {
        const lead = leads[i];
        setProgress({ current: i + 1, total: leads.length });

        // Buscar histórico do lead
        const historicoLead = historico.filter(h => h.lead_id === lead.id);
        const diasNoFunil = historicoLead.length > 0
          ? Math.floor((new Date() - new Date(historicoLead[0].data_mudanca)) / (1000 * 60 * 60 * 24))
          : 0;

        // Preparar contexto para IA
        const contexto = `
Analise este lead e atribua um score de 0-100 baseado na probabilidade de conversão.

DADOS DO LEAD:
- Nome: ${lead.nome_completo}
- Tipo: ${lead.tipo_estabelecimento || 'não informado'}
- Cidade: ${lead.cidade || 'não informada'}
- Funcionários: ${lead.numero_funcionarios || 'não informado'}
- Status atual: ${lead.status}
- Dias no funil: ${diasNoFunil}
- Tem CNPJ: ${lead.cnpj ? 'sim' : 'não'}
- Tem email: ${lead.email ? 'sim' : 'não'}
- Tem telefone: ${lead.telefone ? 'sim' : 'não'}
- Mudanças de status: ${historicoLead.length}

PADRÕES DE CONVERSÃO HISTÓRICOS:
- Taxa de conversão geral: ${padroes.total_convertidos} de ${leads.length} leads (${Math.round(padroes.total_convertidos / leads.length * 100)}%)
- Tipos que mais convertem: ${padroes.tipos_sucesso.slice(0, 3).join(', ')}
- Cidades que mais convertem: ${padroes.cidades_sucesso.slice(0, 3).join(', ')}
- Tamanhos que mais convertem: ${padroes.tamanhos_sucesso.slice(0, 3).join(', ')}

CRITÉRIOS DE SCORING:
- Completude de dados (30 pontos): CNPJ, email, telefone, tipo
- Perfil target (25 pontos): correspondência com padrões históricos
- Engajamento (25 pontos): mudanças de status, tempo no funil
- Status atual (20 pontos): Lead=60, Qualificado=80, Proposta=90, Fechado=100, Descartado=0

Considere que leads em "Proposta" já demonstraram alto interesse.
Leads descartados devem ter score 0.
Leads fechados devem ter score 100.
`;

        try {
          const resultado = await base44.integrations.Core.InvokeLLM({
            prompt: contexto,
            response_json_schema: {
              type: "object",
              properties: {
                score: { type: "integer", minimum: 0, maximum: 100 },
                justificativa: { type: "string" }
              },
              required: ["score"]
            }
          });

          // Atualizar lead com o score
          await base44.entities.Lead.update(lead.id, {
            score: resultado.score,
            ultima_atualizacao_score: new Date().toISOString()
          });

        } catch (error) {
          console.error(`Erro ao calcular score do lead ${lead.id}:`, error);
        }

        // Pequeno delay para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      queryClient.invalidateQueries(['leads']);
      alert('Scores calculados com sucesso!');
    } catch (error) {
      console.error('Erro ao calcular scores:', error);
      alert('Erro ao calcular scores. Tente novamente.');
    } finally {
      setIsCalculating(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  const leadsComScore = leads.filter(l => l.score !== undefined && l.score !== null);
  const scoreMedia = leadsComScore.length > 0
    ? Math.round(leadsComScore.reduce((sum, l) => sum + l.score, 0) / leadsComScore.length)
    : 0;

  return (
    <Card className="shadow-lg border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Lead Scoring com IA
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Sistema de pontuação inteligente que analisa dados e aprende com conversões históricas.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm">
                  <strong>Score Médio:</strong> {scoreMedia}
                </span>
              </div>
              <div className="text-sm">
                <strong>{leadsComScore.length}</strong> de <strong>{leads.length}</strong> leads com score
              </div>
            </div>
          </div>

          <Button
            onClick={calculateScores}
            disabled={isCalculating || leads.length === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isCalculating ? 'animate-spin' : ''}`} />
            {isCalculating ? 'Calculando...' : 'Recalcular Scores'}
          </Button>
        </div>

        {isCalculating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Processando leads...</span>
              <span>{progress.current} / {progress.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t space-y-2">
          <h4 className="font-semibold text-sm">Como funciona:</h4>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>Analisa completude de dados (CNPJ, email, telefone)</li>
            <li>Compara com padrões de leads convertidos anteriormente</li>
            <li>Considera engajamento e progressão no funil</li>
            <li>Aprende com histórico de conversões e descartados</li>
            <li>Score de 0-100: quanto maior, maior a chance de conversão</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}