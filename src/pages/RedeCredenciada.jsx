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
  MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";
import EstabelecimentoModal from "../components/rede/EstabelecimentoModal";

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
  const [showModal, setShowModal] = useState(false);
  const [editingEstabelecimento, setEditingEstabelecimento] = useState(null);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

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

  const estabelecimentosFiltrados = estabelecimentos
    .filter(e => !tipoFiltro || e.tipo === tipoFiltro)
    .filter(e => !cidadeFiltro || e.cidade === cidadeFiltro)
    .filter(e => !busca || 
      e.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (e.especialidades || '').toLowerCase().includes(busca.toLowerCase()) ||
      (e.bairro || '').toLowerCase().includes(busca.toLowerCase())
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
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="px-4 py-2 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBABC] focus:border-transparent"
          >
            <option value="">Todos os tipos</option>
            {Object.entries(tipoLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={cidadeFiltro}
            onChange={(e) => setCidadeFiltro(e.target.value)}
            className="px-4 py-2 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBABC] focus:border-transparent"
          >
            <option value="">Todas as cidades</option>
            {cidades.map(cidade => (
              <option key={cidade} value={cidade}>{cidade}</option>
            ))}
          </select>
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
    </div>
  );
}

function EstabelecimentoCard({ estabelecimento, isAdmin, onEdit }) {
  const Icon = tipoIcons[estabelecimento.tipo];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge className={tipoColors[estabelecimento.tipo]}>
              <Icon className="w-3 h-3 mr-1" />
              {tipoLabels[estabelecimento.tipo]}
            </Badge>
            {estabelecimento.atendimento_24h && (
              <Badge className="bg-green-500 text-white">24h</Badge>
            )}
          </div>
          <CardTitle className="text-lg">{estabelecimento.nome}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {estabelecimento.especialidades && (
            <div className="text-sm">
              <span className="font-semibold text-gray-700">Especialidades:</span>
              <p className="text-gray-600 mt-1">{estabelecimento.especialidades}</p>
            </div>
          )}

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-[#4DBABC] flex-shrink-0" />
              <div>
                <p>{estabelecimento.endereco}</p>
                <p>{estabelecimento.bairro && `${estabelecimento.bairro} - `}{estabelecimento.cidade}/{estabelecimento.estado}</p>
                {estabelecimento.cep && <p>CEP: {estabelecimento.cep}</p>}
              </div>
            </div>

            {estabelecimento.telefone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#4DBABC]" />
                <a href={`tel:${estabelecimento.telefone}`} className="hover:text-[#4DBABC]">
                  {estabelecimento.telefone}
                </a>
              </div>
            )}

            {estabelecimento.whatsapp && (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <a
                  href={`https://wa.me/55${estabelecimento.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-600"
                >
                  WhatsApp: {estabelecimento.whatsapp}
                </a>
              </div>
            )}

            {estabelecimento.horario_funcionamento && (
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-[#4DBABC]" />
                <p>{estabelecimento.horario_funcionamento}</p>
              </div>
            )}
          </div>

          {estabelecimento.observacoes && (
            <div className="text-sm bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-700">{estabelecimento.observacoes}</p>
            </div>
          )}

          {isAdmin && (
            <Button variant="outline" onClick={onEdit} className="w-full mt-4">
              Editar
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}