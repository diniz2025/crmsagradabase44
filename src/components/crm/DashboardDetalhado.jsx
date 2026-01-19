import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, Users, Building2, Clock, Target, 
  DollarSign, Calendar, Filter
} from "lucide-react";
import { format, subDays, isAfter, isBefore, startOfDay, parseISO } from "date-fns";

export default function DashboardDetalhado({ leads, vendedores, corretoras, historico = [] }) {
  const [periodo, setPeriodo] = useState("30");
  const [vendedorFiltro, setVendedorFiltro] = useState("todos");
  const [corretoraFiltro, setCorretoraFiltro] = useState("todos");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const CORES = {
    Lead: "#3B82F6",
    Qualificado: "#F59E0B",
    Proposta: "#8B5CF6",
    Fechado: "#10B981",
    Descartado: "#6B7280"
  };

  // Filtrar leads por período e filtros
  const leadsFiltrados = useMemo(() => {
    const agora = new Date();
    let dataLimite;

    if (periodo !== "custom") {
      dataLimite = subDays(agora, parseInt(periodo));
    }

    return leads.filter(lead => {
      // Filtro de período
      const leadDate = lead.created_date ? parseISO(lead.created_date) : null;
      if (periodo === "custom") {
        if (dataInicio && leadDate && isBefore(leadDate, startOfDay(new Date(dataInicio)))) return false;
        if (dataFim && leadDate && isAfter(leadDate, startOfDay(new Date(dataFim)))) return false;
      } else if (leadDate && isBefore(leadDate, dataLimite)) {
        return false;
      }

      // Filtro de vendedor
      if (vendedorFiltro !== "todos" && lead.vendedor !== vendedorFiltro) return false;

      // Filtro de corretora
      if (corretoraFiltro !== "todos" && lead.corretora_id !== corretoraFiltro) return false;

      return true;
    });
  }, [leads, periodo, vendedorFiltro, corretoraFiltro, dataInicio, dataFim]);

  // Métricas principais
  const metricas = useMemo(() => {
    const total = leadsFiltrados.length;
    const fechados = leadsFiltrados.filter(l => l.status === "Fechado").length;
    const novosLeads = leadsFiltrados.filter(l => l.status === "Lead").length;
    const taxaConversao = total > 0 ? ((fechados / total) * 100).toFixed(1) : 0;
    
    // Calcular tempo médio no funil
    const leadsComTempo = historico
      .filter(h => h.status === "Fechado")
      .map(h => {
        const lead = leads.find(l => l.id === h.lead_id);
        if (!lead || !lead.created_date) return null;
        const inicio = parseISO(lead.created_date);
        const fim = parseISO(h.data_mudanca);
        return (fim - inicio) / (1000 * 60 * 60 * 24); // dias
      })
      .filter(t => t !== null);
    
    const tempoMedio = leadsComTempo.length > 0 
      ? (leadsComTempo.reduce((a, b) => a + b, 0) / leadsComTempo.length).toFixed(1)
      : 0;

    // Valor total (considerando R$ 235,09 por lead fechado)
    const valorTotal = fechados * 235.09;

    return {
      total,
      fechados,
      novosLeads,
      taxaConversao,
      tempoMedio,
      valorTotal
    };
  }, [leadsFiltrados, historico, leads]);

  // Dados para gráfico de status
  const dadosStatus = useMemo(() => {
    const statusCount = {};
    leadsFiltrados.forEach(lead => {
      statusCount[lead.status] = (statusCount[lead.status] || 0) + 1;
    });
    return Object.keys(statusCount).map(status => ({
      name: status,
      value: statusCount[status]
    }));
  }, [leadsFiltrados]);

  // Dados para gráfico por vendedor
  const dadosVendedor = useMemo(() => {
    const vendedorStats = {};
    leadsFiltrados.forEach(lead => {
      const vendedor = lead.vendedor || "Sem vendedor";
      if (!vendedorStats[vendedor]) {
        vendedorStats[vendedor] = { Lead: 0, Qualificado: 0, Proposta: 0, Fechado: 0, Descartado: 0 };
      }
      vendedorStats[vendedor][lead.status]++;
    });
    
    return Object.keys(vendedorStats).map(vendedor => ({
      vendedor,
      ...vendedorStats[vendedor],
      total: Object.values(vendedorStats[vendedor]).reduce((a, b) => a + b, 0)
    })).sort((a, b) => b.Fechado - a.Fechado).slice(0, 10);
  }, [leadsFiltrados]);

  // Dados para gráfico por corretora
  const dadosCorretora = useMemo(() => {
    const corretoraStats = {};
    leadsFiltrados.forEach(lead => {
      const corretoraId = lead.corretora_id || "Sem corretora";
      const corretoraNome = corretoras.find(c => c.id === corretoraId)?.nome || corretoraId;
      if (!corretoraStats[corretoraNome]) {
        corretoraStats[corretoraNome] = { total: 0, fechados: 0 };
      }
      corretoraStats[corretoraNome].total++;
      if (lead.status === "Fechado") corretoraStats[corretoraNome].fechados++;
    });
    
    return Object.keys(corretoraStats).map(corretora => ({
      corretora,
      total: corretoraStats[corretora].total,
      fechados: corretoraStats[corretora].fechados,
      conversao: ((corretoraStats[corretora].fechados / corretoraStats[corretora].total) * 100).toFixed(1)
    })).sort((a, b) => b.fechados - a.fechados);
  }, [leadsFiltrados, corretoras]);

  // Dados para gráfico de evolução temporal
  const dadosEvolucao = useMemo(() => {
    const dias = {};
    leadsFiltrados.forEach(lead => {
      if (!lead.created_date) return;
      const dia = format(parseISO(lead.created_date), 'dd/MM');
      dias[dia] = (dias[dia] || 0) + 1;
    });
    
    return Object.keys(dias).slice(-30).map(dia => ({
      dia,
      leads: dias[dia]
    }));
  }, [leadsFiltrados]);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
            Filtros do Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="15">Últimos 15 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="60">Últimos 60 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {periodo === "custom" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Data Início</label>
                  <Input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Data Fim</label>
                  <Input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Vendedor</label>
              <Select value={vendedorFiltro} onValueChange={setVendedorFiltro}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {vendedores.filter(v => v.tipo === 'vendedor').map(v => (
                    <SelectItem key={v.id} value={v.nome}>{v.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Corretora</label>
              <Select value={corretoraFiltro} onValueChange={setCorretoraFiltro}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  {corretoras.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Métricas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold text-blue-700">{metricas.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Fechados</p>
                <p className="text-2xl font-bold text-green-700">{metricas.fechados}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Taxa Conversão</p>
                <p className="text-2xl font-bold text-purple-700">{metricas.taxaConversao}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Novos Leads</p>
                <p className="text-2xl font-bold text-orange-700">{metricas.novosLeads}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tempo Médio</p>
                <p className="text-2xl font-bold text-yellow-700">{metricas.tempoMedio}d</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Valor Total</p>
                <p className="text-xl font-bold text-emerald-700">
                  R$ {metricas.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Distribuição por Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evolução de Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evolução de Novos Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosEvolucao}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="leads" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Desempenho por Vendedor */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Top 10 Vendedores - Desempenho</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={dadosVendedor}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vendedor" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Lead" stackId="a" fill={CORES.Lead} />
                <Bar dataKey="Qualificado" stackId="a" fill={CORES.Qualificado} />
                <Bar dataKey="Proposta" stackId="a" fill={CORES.Proposta} />
                <Bar dataKey="Fechado" stackId="a" fill={CORES.Fechado} />
                <Bar dataKey="Descartado" stackId="a" fill={CORES.Descartado} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Desempenho por Corretora */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Desempenho por Corretora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dadosCorretora.map((corretora, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">{corretora.corretora}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {corretora.conversao}% conversão
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total: </span>
                      <span className="font-bold">{corretora.total}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Fechados: </span>
                      <span className="font-bold text-green-600">{corretora.fechados}</span>
                    </div>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${corretora.conversao}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}