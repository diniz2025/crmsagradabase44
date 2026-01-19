import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  BarChart3,
  TrendingUp,
  Kanban, 
  Settings,
  Plus,
  Download,
  Upload,
  Trash2,
  MessageCircle,
  Building2,
  Package,
  BookOpen
} from "lucide-react";
import LeadsTable from "../components/crm/LeadsTable";
import PipelineKanban from "../components/crm/PipelineKanban";
import KPICards from "../components/crm/KPICards";
import DashboardDetalhado from "../components/crm/DashboardDetalhado";
import ConfigCRM from "../components/crm/ConfigCRM";
import LeadModal from "../components/crm/LeadModal";
import AutomacoesConfig from "../components/crm/AutomacoesConfig";
import ProcessadorAutomacoes from "../components/crm/ProcessadorAutomacoes";
import LeadScoringEngine from "../components/crm/LeadScoringEngine";
import ChatbotVendedor from "../components/crm/ChatbotVendedor";
import GestaoCorretoras from "../components/crm/GestaoCorretoras";
import DistribuicaoLotes from "../components/crm/DistribuicaoLotes";
import ManualVendedor from "../components/crm/ManualVendedor";
import GuiaEscalabilidade from "../components/crm/GuiaEscalabilidade";

export default function CRM() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroVendedor, setFiltroVendedor] = useState("");
  const [filtroCorretora, setFiltroCorretora] = useState("");
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  // Pega o usuário atual
  React.useEffect(() => {
    base44.auth.me().then(user => setUsuarioAtual(user)).catch(() => {});
  }, []);

  // Busca vendedores e corretoras primeiro
  const { data: vendedores = [] } = useQuery({
    queryKey: ['vendedores'],
    queryFn: () => base44.entities.Vendedor.list('-created_date', 500),
    initialData: [],
    staleTime: 300000, // 5 minutos de cache
  });

  const { data: corretoras = [] } = useQuery({
    queryKey: ['corretoras'],
    queryFn: () => base44.entities.Corretora.list(),
    initialData: [],
    staleTime: 300000, // 5 minutos de cache
  });

  // Verifica permissões
  const isAdmin = usuarioAtual?.email === 'cristino@example.com' || usuarioAtual?.email === 'vanessa@example.com';
  const meuVendedor = vendedores.find(v => v.email === usuarioAtual?.email);
  const isSupervisor = meuVendedor?.tipo === 'supervisor';
  const minhaCorretoraId = meuVendedor?.corretora_id;

  // Query otimizada com filtro no servidor e limite
  const { data: leads = [], isLoading, refetch, error } = useQuery({
    queryKey: ['leads', filtroStatus, filtroCorretora, minhaCorretoraId, meuVendedor?.nome],
    queryFn: async () => {
      const query = {};
      
      // Aplica filtros no servidor para reduzir dados trafegados
      if (!isAdmin) {
        if (isSupervisor && minhaCorretoraId) {
          query.corretora_id = minhaCorretoraId;
        } else if (meuVendedor) {
          query.vendedor = meuVendedor.nome;
        }
      }
      
      if (filtroStatus) query.status = filtroStatus;
      if (filtroCorretora && isAdmin) query.corretora_id = filtroCorretora;
      
      return base44.entities.Lead.filter(query, '-updated_date', 1000);
    },
    initialData: [],
    staleTime: 30000, // Cache de 30s
    refetchInterval: 60000, // Auto-refresh a cada 60s
    enabled: vendedores.length > 0, // Só executa após carregar vendedores
  });

  const { data: historico = [] } = useQuery({
    queryKey: ['historico'],
    queryFn: () => base44.entities.HistoricoStatus.list('-data_mudanca', 5000),
    initialData: [],
    staleTime: 60000,
  });

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowModal(true);
  };

  const handleNew = () => {
    setEditingLead(null);
    setShowModal(true);
  };

  const handleExport = () => {
    const headers = ['nome_completo','cnpj','cidade','telefone','email','contato','status','vendedor','observacoes'];
    const lines = [headers.join(',')].concat(
      leads.map(e => headers.map(h => `"${(e[h]||'').toString().replace(/"/g,'""')}"`).join(','))
    );
    const blob = new Blob([lines.join('\n')], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'leads_export.csv';
    a.click();
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(Boolean);
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const newLeads = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const lead = {
          nome_completo: values[headers.indexOf('nome_completo')] || values[0] || '',
          cnpj: values[headers.indexOf('cnpj')] || '',
          cidade: values[headers.indexOf('cidade')] || '',
          telefone: values[headers.indexOf('telefone')] || values[headers.indexOf('fone')] || '',
          email: values[headers.indexOf('email')] || '',
          contato: values[headers.indexOf('contato')] || '',
          status: 'Lead',
          vendedor: vendedores[0]?.nome || ''
        };
        newLeads.push(lead);
      }
      
      await base44.entities.Lead.bulkCreate(newLeads);
      refetch();
      alert(`${newLeads.length} leads importados com sucesso!`);
    } catch (error) {
      alert('Erro ao importar CSV. Verifique o formato do arquivo.');
    }
    
    e.target.value = '';
  };

  const handleClearAll = async () => {
    if (!isAdmin) {
      alert('Apenas administradores podem limpar a base');
      return;
    }
    
    if (!confirm('Tem certeza que deseja excluir TODOS os leads? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      // Deleta em lotes de 100 para evitar timeout
      const BATCH_SIZE = 100;
      for (let i = 0; i < leads.length; i += BATCH_SIZE) {
        const batch = leads.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(lead => base44.entities.Lead.delete(lead.id)));
      }
      refetch();
      alert('Base limpa com sucesso');
    } catch (error) {
      alert('Erro ao limpar base: ' + error.message);
    }
  };

  // Filtragem otimizada - apenas busca e vendedor (status e corretora já filtrados no servidor)
  const filteredLeads = React.useMemo(() => {
    return leads.filter(lead => {
      const searchMatch = filtro === '' || 
        (lead.nome_completo || '').toLowerCase().includes(filtro.toLowerCase()) ||
        (lead.cidade || '').toLowerCase().includes(filtro.toLowerCase()) ||
        (lead.telefone || '').toLowerCase().includes(filtro.toLowerCase());
      
      const vendedorMatch = !filtroVendedor || lead.vendedor === filtroVendedor;
      
      return searchMatch && vendedorMatch;
    });
  }, [leads, filtro, filtroVendedor]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProcessadorAutomacoes />
      <div className="bg-gradient-to-r from-blue-900 to-green-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">CRM Sagrada Família</h1>
              <p className="text-blue-100">Gestão completa de leads e vendas</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleNew} className="bg-amber-500 hover:bg-amber-600">
                <Plus className="w-4 h-4 mr-2" />
                Novo Lead
              </Button>
              <Button onClick={handleExport} variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30 text-white">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 border-white/30 text-white cursor-pointer"
                onClick={() => document.getElementById('csv-upload').click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar CSV
              </Button>
              <input 
                id="csv-upload"
                type="file" 
                accept=".csv" 
                onChange={handleImport} 
                className="hidden" 
              />
              {isAdmin && leads.length > 0 && (
                <Button onClick={handleClearAll} variant="outline" className="bg-red-500/20 hover:bg-red-500/30 border-red-300 text-white">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Base
                </Button>
              )}
              {error && (
                <div className="text-red-300 text-sm">
                  Erro ao carregar dados
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-white rounded-xl shadow-lg mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-6 pt-6">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="tabela" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Tabela
                </TabsTrigger>
                <TabsTrigger value="kanban" className="flex items-center gap-2">
                  <Kanban className="w-4 h-4" />
                  Pipeline
                </TabsTrigger>
                <TabsTrigger value="config" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configurações
                </TabsTrigger>
                <TabsTrigger value="chatbot" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Assistente IA
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Manual
                </TabsTrigger>
                {(isAdmin || isSupervisor) && (
                  <>
                    <TabsTrigger value="corretoras" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Corretoras
                    </TabsTrigger>
                    <TabsTrigger value="lotes" className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Distribuir Lotes
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="p-6">
              <DashboardDetalhado 
                leads={filteredLeads}
                vendedores={vendedores}
                corretoras={corretoras}
                historico={historico}
              />
            </TabsContent>

            <TabsContent value="tabela" className="p-6">
              <div className="mb-6 flex gap-4">
                <Input
                  placeholder="Buscar por nome, cidade ou telefone..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="max-w-md"
                />
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos os status</option>
                  <option value="Lead">Lead</option>
                  <option value="Qualificado">Qualificado</option>
                  <option value="Proposta">Proposta</option>
                  <option value="Fechado">Fechado</option>
                  <option value="Descartado">Descartado</option>
                </select>
                <select
                  value={filtroVendedor}
                  onChange={(e) => setFiltroVendedor(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos vendedores</option>
                  {vendedores.filter(v => v.tipo === 'vendedor').map(v => (
                    <option key={v.id} value={v.nome}>{v.nome}</option>
                  ))}
                </select>
                {isAdmin && (
                  <select
                    value={filtroCorretora}
                    onChange={(e) => setFiltroCorretora(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas corretoras</option>
                    {corretoras.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                )}
              </div>

              <LeadsTable 
                leads={filteredLeads}
                isLoading={isLoading}
                onEdit={handleEdit}
                vendedores={vendedores}
                onRefetch={refetch}
              />
            </TabsContent>

            <TabsContent value="kanban" className="p-6">
              <PipelineKanban 
                leads={filteredLeads}
                onRefetch={refetch}
                onEdit={handleEdit}
              />
            </TabsContent>

            <TabsContent value="config" className="p-6 space-y-6">
              {isAdmin && <GuiaEscalabilidade />}
              <LeadScoringEngine />
              <ConfigCRM vendedores={vendedores} />
              <AutomacoesConfig />
            </TabsContent>

            <TabsContent value="chatbot" className="p-6">
              <ChatbotVendedor />
            </TabsContent>

            <TabsContent value="manual" className="p-6">
              <ManualVendedor />
            </TabsContent>

            {(isAdmin || isSupervisor) && (
              <>
                <TabsContent value="corretoras" className="p-6">
                  <GestaoCorretoras />
                </TabsContent>

                <TabsContent value="lotes" className="p-6">
                  <DistribuicaoLotes usuarioEmail={usuarioAtual?.email} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>

      {showModal && (
        <LeadModal
          lead={editingLead}
          vendedores={vendedores}
          onClose={() => {
            setShowModal(false);
            setEditingLead(null);
          }}
          onSave={() => {
            refetch();
            setShowModal(false);
            setEditingLead(null);
          }}
        />
      )}
    </div>
  );
}