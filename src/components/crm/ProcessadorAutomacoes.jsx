import React, { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

// Este componente verifica e processa automações pendentes
export default function ProcessadorAutomacoes() {
  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list(),
    refetchInterval: 60000, // Verifica a cada minuto
  });

  const { data: automacoes = [] } = useQuery({
    queryKey: ['automacoes'],
    queryFn: () => base44.entities.Automacao.list(),
    refetchInterval: 60000,
  });

  const { data: historico = [] } = useQuery({
    queryKey: ['historico'],
    queryFn: () => base44.entities.HistoricoStatus.list(),
    refetchInterval: 60000,
  });

  const { data: lembretesEnviados = [] } = useQuery({
    queryKey: ['lembretes'],
    queryFn: () => base44.entities.LembreteEnviado.list(),
    refetchInterval: 60000,
  });

  const { data: configs = [] } = useQuery({
    queryKey: ['configs'],
    queryFn: () => base44.entities.ConfigCRM.list(),
  });

  useEffect(() => {
    if (!leads.length || !automacoes.length) return;

    const verificarAutomacoes = async () => {
      const automacoesAtivas = automacoes.filter(a => a.ativo);
      
      for (const lead of leads) {
        for (const automacao of automacoesAtivas) {
          // Verificar se lead está no status correto
          if (lead.status !== automacao.status_gatilho) continue;

          // Buscar última mudança de status para este lead
          const ultimaMudanca = historico
            .filter(h => h.lead_id === lead.id && h.status === automacao.status_gatilho)
            .sort((a, b) => new Date(b.data_mudanca) - new Date(a.data_mudanca))[0];

          if (!ultimaMudanca) continue;

          // Calcular diferença de dias
          const dataAtual = new Date();
          const dataMudanca = new Date(ultimaMudanca.data_mudanca);
          const diffDias = Math.floor((dataAtual - dataMudanca) / (1000 * 60 * 60 * 24));

          // Verificar se já passou o tempo necessário
          if (diffDias < automacao.dias_apos) continue;

          // Verificar se já foi enviado lembrete para esta automação e lead
          const jaEnviado = lembretesEnviados.some(
            l => l.lead_id === lead.id && l.automacao_id === automacao.id
          );

          if (jaEnviado) continue;

          // Obter mensagem
          let mensagem = '';
          if (automacao.usar_script === 'personalizado') {
            mensagem = automacao.mensagem_personalizada;
          } else {
            const chaveScript = automacao.usar_script === 'whatsapp' 
              ? 'script_whatsapp' 
              : 'script_sagrada_familia';
            const scriptConfig = configs.find(c => c.chave === chaveScript);
            mensagem = scriptConfig?.valor || 'Script não configurado';
          }

          // Personalizar mensagem com dados do lead
          mensagem = mensagem
            .replace(/\{nome\}/g, lead.nome_completo || 'Cliente')
            .replace(/\{empresa\}/g, lead.nome_completo || 'sua empresa')
            .replace(/\{telefone\}/g, lead.telefone || '');

          // Enviar lembrete
          try {
            if (automacao.tipo_mensagem === 'email' && lead.email) {
              await base44.integrations.Core.SendEmail({
                to: lead.email,
                subject: automacao.assunto_email || `Follow-up - ${lead.nome_completo}`,
                body: mensagem
              });
            } else if (automacao.tipo_mensagem === 'whatsapp' && lead.telefone) {
              // Para WhatsApp, apenas registramos - o vendedor abrirá manualmente
              const telefone = lead.telefone.replace(/\D/g, '');
              console.log(`WhatsApp pendente para: ${telefone}`);
            }

            // Registrar lembrete enviado
            await base44.entities.LembreteEnviado.create({
              lead_id: lead.id,
              automacao_id: automacao.id,
              data_envio: new Date().toISOString(),
              tipo: automacao.tipo_mensagem,
              sucesso: true,
              mensagem: mensagem
            });

          } catch (error) {
            console.error('Erro ao enviar lembrete:', error);
            await base44.entities.LembreteEnviado.create({
              lead_id: lead.id,
              automacao_id: automacao.id,
              data_envio: new Date().toISOString(),
              tipo: automacao.tipo_mensagem,
              sucesso: false,
              mensagem: error.message
            });
          }
        }
      }
    };

    verificarAutomacoes();
  }, [leads, automacoes, historico, lembretesEnviados, configs]);

  return null; // Componente invisível
}