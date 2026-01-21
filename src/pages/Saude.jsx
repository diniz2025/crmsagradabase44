import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  FileText,
  Search,
  Plus,
  TrendingUp,
  Heart,
  Shield,
  Users,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import GerarConteudoIA from "../components/educacional/GerarConteudoIA";

const categoriasLabels = {
  prevencao_doencas: { label: "Prevenção de Doenças", icon: Shield, color: "bg-red-100 text-red-800" },
  saude_ocupacional: { label: "Saúde Ocupacional", icon: Users, color: "bg-blue-100 text-blue-800" },
  guia_rede_credenciada: { label: "Guia Rede Credenciada", icon: Heart, color: "bg-purple-100 text-purple-800" },
  bem_estar: { label: "Bem-Estar", icon: Activity, color: "bg-green-100 text-green-800" },
  nutricao: { label: "Nutrição", icon: Heart, color: "bg-orange-100 text-orange-800" },
  seguranca_trabalho: { label: "Segurança no Trabalho", icon: Shield, color: "bg-yellow-100 text-yellow-800" },
  faq: { label: "FAQ", icon: HelpCircle, color: "bg-gray-100 text-gray-800" }
};

const tiposIcons = {
  artigo: BookOpen,
  dica: Lightbulb,
  faq: HelpCircle,
  guia: FileText
};

export default function SaudeBemEstar() {
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [showGerarModal, setShowGerarModal] = useState(false);
  const [expandedContent, setExpandedContent] = useState(null);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => setUsuarioAtual(user)).catch(() => {});
  }, []);

  const { data: conteudos = [], refetch } = useQuery({
    queryKey: ['conteudos'],
    queryFn: () => base44.entities.ConteudoEducacional.filter({ publicado: true }, '-created_date', 100),
    initialData: [],
  });

  const isAdmin = usuarioAtual?.role === 'admin';

  const conteudosFiltrados = conteudos
    .filter(c => !categoriaFiltro || c.categoria === categoriaFiltro)
    .filter(c => !tipoFiltro || c.tipo === tipoFiltro)
    .filter(c => !busca || 
      c.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      c.resumo?.toLowerCase().includes(busca.toLowerCase()) ||
      c.tags?.toLowerCase().includes(busca.toLowerCase())
    );

  const conteudosDestaque = conteudosFiltrados.filter(c => c.destaque);
  const outrosConteudos = conteudosFiltrados.filter(c => !c.destaque);

  // Incrementar visualizações quando expandir
  const handleExpand = async (conteudo) => {
    if (expandedContent?.id === conteudo.id) {
      setExpandedContent(null);
    } else {
      setExpandedContent(conteudo);
      // Incrementar visualizações
      await base44.entities.ConteudoEducacional.update(conteudo.id, {
        visualizacoes: (conteudo.visualizacoes || 0) + 1
      });
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Saúde e Bem-Estar</h1>
              <p className="text-lg text-white/90">
                Conteúdo educacional para você e sua equipe
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() => setShowGerarModal(true)}
                className="bg-[#FF6B35] hover:bg-[#E85A28]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Gerar Conteúdo
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Busca e Filtros */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por título, tags ou conteúdo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todas as categorias</option>
              {Object.entries(categoriasLabels).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todos os tipos</option>
              <option value="artigo">Artigos</option>
              <option value="dica">Dicas</option>
              <option value="faq">FAQs</option>
              <option value="guia">Guias</option>
            </select>

            {(busca || categoriaFiltro || tipoFiltro) && (
              <Button
                variant="outline"
                onClick={() => {
                  setBusca("");
                  setCategoriaFiltro("");
                  setTipoFiltro("");
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-[#4DBABC]" />
              <div className="text-2xl font-bold">{conteudos.length}</div>
              <div className="text-sm text-gray-600">Conteúdos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">
                {conteudos.reduce((acc, c) => acc + (c.visualizacoes || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Visualizações</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold">
                {conteudos.filter(c => c.tipo === 'dica').length}
              </div>
              <div className="text-sm text-gray-600">Dicas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">
                {conteudos.filter(c => c.tipo === 'faq').length}
              </div>
              <div className="text-sm text-gray-600">FAQs</div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdos em Destaque */}
        {conteudosDestaque.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#FF6B35]" />
              Em Destaque
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {conteudosDestaque.map((conteudo) => (
                <ConteudoCard
                  key={conteudo.id}
                  conteudo={conteudo}
                  isExpanded={expandedContent?.id === conteudo.id}
                  onToggle={() => handleExpand(conteudo)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Todos os Conteúdos */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {categoriaFiltro ? categoriasLabels[categoriaFiltro].label : "Todos os Conteúdos"}
          </h2>
          
          {outrosConteudos.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Nenhum conteúdo encontrado</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outrosConteudos.map((conteudo) => (
                <ConteudoCard
                  key={conteudo.id}
                  conteudo={conteudo}
                  isExpanded={expandedContent?.id === conteudo.id}
                  onToggle={() => handleExpand(conteudo)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showGerarModal && (
        <GerarConteudoIA
          onClose={() => {
            setShowGerarModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}

function ConteudoCard({ conteudo, isExpanded, onToggle }) {
  const categoria = categoriasLabels[conteudo.categoria];
  const TipoIcon = tiposIcons[conteudo.tipo];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={onToggle}>
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge className={categoria.color}>
              <categoria.icon className="w-3 h-3 mr-1" />
              {categoria.label}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <TipoIcon className="w-3 h-3" />
              {conteudo.visualizacoes || 0} views
            </div>
          </div>
          <CardTitle className="text-lg leading-tight">{conteudo.titulo}</CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{conteudo.resumo}</p>
          
          {conteudo.tags && (
            <div className="flex flex-wrap gap-1 mb-3">
              {conteudo.tags.split(',').slice(0, 3).map((tag, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          <p className="text-xs text-[#4DBABC] font-semibold">
            {isExpanded ? '▼ Clique para fechar' : '▶ Clique para ler'}
          </p>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t"
            >
              <ReactMarkdown
                className="prose prose-sm max-w-none"
                components={{
                  h1: ({children}) => <h1 className="text-xl font-bold mb-3">{children}</h1>,
                  h2: ({children}) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                  h3: ({children}) => <h3 className="text-base font-semibold mb-2">{children}</h3>,
                  p: ({children}) => <p className="mb-2">{children}</p>,
                  ul: ({children}) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                  li: ({children}) => <li className="mb-1">{children}</li>,
                }}
              >
                {conteudo.conteudo}
              </ReactMarkdown>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}