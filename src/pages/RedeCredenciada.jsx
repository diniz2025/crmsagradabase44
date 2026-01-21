import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Hospital, 
  Building2, 
  FlaskConical, 
  Stethoscope,
  Ambulance,
  Activity,
  MapPin,
  Phone,
  Clock,
  Search,
  Plus,
  MessageCircle,
  Upload
} from "lucide-react";
import { motion } from "framer-motion";
import EstabelecimentoModal from "../components/rede/EstabelecimentoModal";
import ImportarRedeModal from "../components/rede/ImportarRedeModal";

const tipoLabels = {
  hospital: "Hospital",
  clinica: "Clínica",
  laboratorio: "Laboratório",
  pronto_socorro: "Pronto Socorro",
  diagnostico: "Diagnóstico por Imagem",
  especialidade: "Clínica Especializada"
};

const tipoIcons = {
  hospital: Hospital,
  clinica: Building2,
  laboratorio: FlaskConical,
  pronto_socorro: Ambulance,
  diagnostico: Activity,
  especialidade: Stethoscope
};

const tipoColors = {
  hospital: "bg-red-100 text-red-800",
  clinica: "bg-blue-100 text-blue-800",
  laboratorio: "bg-green-100 text-green-800",
  pronto_socorro: "bg-orange-100 text-orange-800",
  diagnostico: "bg-purple-100 text-purple-800",
  especialidade: "bg-teal-100 text-teal-800"
};

export default function RedeCredenciada() {
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [cidadeFiltro, setCidadeFiltro] = useState("");
  const [bairroFiltro, setBairroFiltro] = useState("");
  const [especialidadeFiltro, setEspecialidadeFiltro] = useState("");
  const [atendimento24hFiltro, setAtendimento24hFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEstabelecimento, setEditingEstabelecimento] = useState(null);
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  React.useEffect(() => {
    base44.auth.me().then(user => setUsuarioAtual(user)).catch(() => {});
  }, []);

  const { data: estabelecimentos = [], refetch } = useQuery({
    queryKey: ['estabelecimentos'],
    queryFn: () => base44.entities.EstabelecimentoCredenciado.list('-created_date', 500),
    initialData: [],
  });

  const isAdmin = usuarioAtual?.role === 'admin';

  const cidades = [...new Set(estabelecimentos.map(e => e.cidade))].sort();
  const bairros = [...new Set(estabelecimentos.map(e => e.bairro).filter(Boolean))].sort();
  
  const todasEspecialidades = [...new Set(
    estabelecimentos
      .map(e => e.especialidades || '')
      .flatMap(esp => esp.split(',').map(s => s.trim()))
      .filter(Boolean)
  )].sort();

  const estabelecimentosFiltrados = estabelecimentos
    .filter(e => !tipoFiltro || e.tipo === tipoFiltro)
    .filter(e => !cidadeFiltro || e.cidade === cidadeFiltro)
    .filter(e => !bairroFiltro || e.bairro === bairroFiltro)
    .filter(e => !especialidadeFiltro || (e.especialidades || '').toLowerCase().includes(especialidadeFiltro.toLowerCase()))
    .filter(e => !atendimento24hFiltro || (atendimento24hFiltro === 'sim' ? e.atendimento_24h : !e.atendimento_24h))
    .filter(e => !busca || 
      e.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (e.especialidades || '').toLowerCase().includes(busca.toLowerCase()) ||
      (e.bairro || '').toLowerCase().includes(busca.toLowerCase()) ||
      (e.endereco || '').toLowerCase().includes(busca.toLowerCase())
    );

  const estabelecimentosPorTipo = {};
  estabelecimentosFiltrados.forEach(est => {
    if (!estabelecimentosPorTipo[est.tipo]) {
      estabelecimentosPorTipo[est.tipo] = [];
    }
    estabelecimentosPorTipo[est.tipo].push(est);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Rede Credenciada</h1>
              <p className="text-lg text-white/90">
                Plano de Saúde Sagrada Família - Encontre os melhores estabelecimentos de saúde
              </p>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowImportModal(true)}
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importar PDF
                </Button>
                <Button
                  onClick={() => {
                    setEditingEstabelecimento(null);
                    setShowModal(true);
                  }}
                  className="bg-[#FF6B35] hover:bg-[#E85A28]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Busca Principal */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por nome, especialidade, bairro ou endereço..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-12 h-14 text-lg border-2 border-[#4DBABC] focus:border-[#FF6B35]"
            />
          </div>
        </div>

        {/* Filtros Avançados */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#4DBABC]" />
            Filtros Avançados
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="px-4 py-2 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBABC] focus:border-transparent"
            >
              <option value="">Todos os tipos</option>
              {Object.entries(tipoLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <select
              value={cidadeFiltro}
              onChange={(e) => setCidadeFiltro(e.target.value)}
              className="px-4 py-2 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBABC] focus:border-transparent"
            >
              <option value="">Todas as cidades</option>
              {cidades.map(cidade => (
                <option key={cidade} value={cidade}>{cidade}</option>
              ))}
            </select>

            <select
              value={bairroFiltro}
              onChange={(e) => setBairroFiltro(e.target.value)}
              className="px-4 py-2 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBABC] focus:border-transparent"
            >
              <option value="">Todos os bairros</option>
              {bairros.map(bairro => (
                <option key={bairro} value={bairro}>{bairro}</option>
              ))}
            </select>

            <select
              value={especialidadeFiltro}
              onChange={(e) => setEspecialidadeFiltro(e.target.value)}
              className="px-4 py-2 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBABC] focus:border-transparent"
            >
              <option value="">Todas especialidades</option>
              {todasEspecialidades.map(esp => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>

            <select
              value={atendimento24hFiltro}
              onChange={(e) => setAtendimento24hFiltro(e.target.value)}
              className="px-4 py-2 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBABC] focus:border-transparent"
            >
              <option value="">Atendimento (todos)</option>
              <option value="sim">Apenas 24h</option>
              <option value="nao">Horário comercial</option>
            </select>
          </div>
          
          {(busca || tipoFiltro || cidadeFiltro || bairroFiltro || especialidadeFiltro || atendimento24hFiltro) && (
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setBusca("");
                  setTipoFiltro("");
                  setCidadeFiltro("");
                  setBairroFiltro("");
                  setEspecialidadeFiltro("");
                  setAtendimento24hFiltro("");
                }}
                className="text-sm"
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>

        <div className="mb-6 flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-sm">
            Total: {estabelecimentosFiltrados.length} estabelecimentos
          </Badge>
        </div>

        {Object.entries(estabelecimentosPorTipo).length === 0 ? (
          <div className="text-center py-12">
            <Hospital className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhum estabelecimento encontrado</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(estabelecimentosPorTipo).map(([tipo, estabelecimentos]) => {
              const Icon = tipoIcons[tipo];
              return (
                <div key={tipo}>
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className="w-6 h-6 text-[#4DBABC]" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      {tipoLabels[tipo]}
                    </h2>
                    <Badge className={tipoColors[tipo]}>
                      {estabelecimentos.length}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {estabelecimentos.map((est) => (
                      <EstabelecimentoCard
                        key={est.id}
                        estabelecimento={est}
                        isAdmin={isAdmin}
                        isExpanded={expandedCard === est.id}
                        onToggle={() => setExpandedCard(expandedCard === est.id ? null : est.id)}
                        onEdit={() => {
                          setEditingEstabelecimento(est);
                          setShowModal(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <EstabelecimentoModal
          estabelecimento={editingEstabelecimento}
          onClose={() => {
            setShowModal(false);
            setEditingEstabelecimento(null);
          }}
          onSave={() => {
            refetch();
            setShowModal(false);
            setEditingEstabelecimento(null);
          }}
        />
      )}

      {showImportModal && (
        <ImportarRedeModal
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
}

function EstabelecimentoCard({ estabelecimento, isAdmin, isExpanded, onToggle, onEdit }) {
  const Icon = tipoIcons[estabelecimento.tipo];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Snippet - Informações Principais */}
        <div 
          className="cursor-pointer"
          onClick={onToggle}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between mb-2">
              <Badge className={tipoColors[estabelecimento.tipo]}>
                <Icon className="w-3 h-3 mr-1" />
                {tipoLabels[estabelecimento.tipo]}
              </Badge>
              <div className="flex gap-1">
                {estabelecimento.atendimento_24h && (
                  <Badge className="bg-green-500 text-white">24h</Badge>
                )}
              </div>
            </div>
            <CardTitle className="text-lg leading-tight">{estabelecimento.nome}</CardTitle>
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Snippet Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5 text-[#4DBABC] flex-shrink-0" />
                <p className="line-clamp-1">
                  {estabelecimento.bairro && `${estabelecimento.bairro} - `}{estabelecimento.cidade}/{estabelecimento.estado}
                </p>
              </div>
              
              {estabelecimento.especialidades && (
                <div className="flex items-start gap-2 text-gray-600">
                  <Stethoscope className="w-4 h-4 mt-0.5 text-[#4DBABC] flex-shrink-0" />
                  <p className="line-clamp-2">{estabelecimento.especialidades}</p>
                </div>
              )}
              
              {estabelecimento.telefone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-[#4DBABC] flex-shrink-0" />
                  <p>{estabelecimento.telefone}</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t">
              <p className="text-xs text-[#4DBABC] font-semibold flex items-center gap-1">
                {isExpanded ? '▼ Clique para ocultar detalhes' : '▶ Clique para ver detalhes completos'}
              </p>
            </div>
          </CardContent>
        </div>

        {/* Detalhes Completos - Expansível */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0 border-t bg-gray-50">
              <div className="space-y-3 pt-4">
                <div className="text-sm">
                  <span className="font-semibold text-gray-700">Endereço Completo:</span>
                  <div className="flex items-start gap-2 mt-2 text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 text-[#4DBABC] flex-shrink-0" />
                    <div>
                      <p>{estabelecimento.endereco}</p>
                      <p>{estabelecimento.bairro && `${estabelecimento.bairro} - `}{estabelecimento.cidade}/{estabelecimento.estado}</p>
                      {estabelecimento.cep && <p>CEP: {estabelecimento.cep}</p>}
                    </div>
                  </div>
                </div>

                {estabelecimento.whatsapp && (
                  <div className="text-sm">
                    <span className="font-semibold text-gray-700">Contato WhatsApp:</span>
                    <div className="flex items-center gap-2 mt-2">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <a
                        href={`https://wa.me/55${estabelecimento.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {estabelecimento.whatsapp}
                      </a>
                    </div>
                  </div>
                )}

                {estabelecimento.horario_funcionamento && (
                  <div className="text-sm">
                    <span className="font-semibold text-gray-700">Horário:</span>
                    <div className="flex items-start gap-2 mt-2 text-gray-600">
                      <Clock className="w-4 h-4 mt-0.5 text-[#4DBABC]" />
                      <p>{estabelecimento.horario_funcionamento}</p>
                    </div>
                  </div>
                )}

                {estabelecimento.observacoes && (
                  <div className="text-sm bg-blue-100 p-3 rounded-lg">
                    <span className="font-semibold text-gray-700">Informações Adicionais:</span>
                    <p className="text-gray-700 mt-1">{estabelecimento.observacoes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {estabelecimento.telefone && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:${estabelecimento.telefone}`;
                      }}
                      className="bg-[#4DBABC] hover:bg-[#45B1B3] text-white flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Ligar
                    </Button>
                  )}
                  
                  {estabelecimento.whatsapp && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://wa.me/55${estabelecimento.whatsapp.replace(/\D/g, '')}`, '_blank');
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                </div>

                {isAdmin && (
                  <Button 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }} 
                    className="w-full mt-2"
                  >
                    Editar Estabelecimento
                  </Button>
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}