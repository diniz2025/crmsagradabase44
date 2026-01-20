import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { 
  Newspaper, 
  Search, 
  Calendar, 
  User, 
  Tag,
  Heart,
  Flame,
  Shield,
  Briefcase,
  AlertTriangle,
  TrendingUp,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import ArtigoBlogModal from "../components/blog/ArtigoBlogModal";

const categoriaLabels = {
  plano_saude: "Plano de Saúde",
  seguro_incendio: "Seguro de Incêndio",
  dicas_seguranca: "Dicas de Segurança",
  noticias: "Notícias",
  rh_trabalhista: "RH & Trabalhista",
  gestao: "Gestão"
};

const categoriaIcons = {
  plano_saude: Heart,
  seguro_incendio: Flame,
  dicas_seguranca: Shield,
  noticias: Newspaper,
  rh_trabalhista: Briefcase,
  gestao: TrendingUp
};

const categoriaColors = {
  plano_saude: "bg-blue-100 text-blue-800",
  seguro_incendio: "bg-red-100 text-red-800",
  dicas_seguranca: "bg-green-100 text-green-800",
  noticias: "bg-purple-100 text-purple-800",
  rh_trabalhista: "bg-orange-100 text-orange-800",
  gestao: "bg-teal-100 text-teal-800"
};

export default function Blog() {
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingArtigo, setEditingArtigo] = useState(null);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  React.useEffect(() => {
    base44.auth.me().then(user => setUsuarioAtual(user)).catch(() => {});
  }, []);

  const { data: artigos = [], refetch } = useQuery({
    queryKey: ['artigos'],
    queryFn: () => base44.entities.ArtigoBlog.list('-created_date', 100),
    initialData: [],
  });

  const isAdmin = usuarioAtual?.role === 'admin';

  const artigosFiltrados = artigos
    .filter(a => isAdmin || a.publicado)
    .filter(a => !categoriaFiltro || a.categoria === categoriaFiltro)
    .filter(a => !busca || 
      a.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      (a.resumo || '').toLowerCase().includes(busca.toLowerCase()) ||
      (a.tags || '').toLowerCase().includes(busca.toLowerCase())
    );

  const artigosDestaque = artigosFiltrados.filter(a => a.destaque).slice(0, 2);
  const artigosRestantes = artigosFiltrados.filter(a => !a.destaque);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Blog SinHoRes</h1>
              <p className="text-lg text-white/90">
                Notícias, dicas e informações para o setor de alimentação
              </p>
            </div>
            {isAdmin && (
              <Button
                onClick={() => {
                  setEditingArtigo(null);
                  setShowModal(true);
                }}
                className="bg-[#FF6B35] hover:bg-[#E85A28]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Artigo
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar artigos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBABC] focus:border-transparent"
          >
            <option value="">Todas as categorias</option>
            {Object.entries(categoriaLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {artigosDestaque.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-[#FF6B35]" />
              Artigos em Destaque
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {artigosDestaque.map((artigo) => (
                <ArtigoCard key={artigo.id} artigo={artigo} destaque isAdmin={isAdmin} onEdit={() => {
                  setEditingArtigo(artigo);
                  setShowModal(true);
                }} />
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {artigosRestantes.map((artigo) => (
            <ArtigoCard key={artigo.id} artigo={artigo} isAdmin={isAdmin} onEdit={() => {
              setEditingArtigo(artigo);
              setShowModal(true);
            }} />
          ))}
        </div>

        {artigosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhum artigo encontrado</p>
          </div>
        )}
      </div>

      {showModal && (
        <ArtigoBlogModal
          artigo={editingArtigo}
          onClose={() => {
            setShowModal(false);
            setEditingArtigo(null);
          }}
          onSave={() => {
            refetch();
            setShowModal(false);
            setEditingArtigo(null);
          }}
        />
      )}
    </div>
  );
}

function ArtigoCard({ artigo, destaque, isAdmin, onEdit }) {
  const Icon = categoriaIcons[artigo.categoria] || Newspaper;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={destaque ? "md:col-span-1" : ""}
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {artigo.imagem_destaque && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={artigo.imagem_destaque}
              alt={artigo.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {!artigo.publicado && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-yellow-500">Rascunho</Badge>
              </div>
            )}
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2 mb-3">
            <Badge className={categoriaColors[artigo.categoria]}>
              <Icon className="w-3 h-3 mr-1" />
              {categoriaLabels[artigo.categoria]}
            </Badge>
            {artigo.destaque && (
              <Badge className="bg-[#FF6B35] text-white">Destaque</Badge>
            )}
          </div>
          <CardTitle className="text-xl mb-2 group-hover:text-[#4DBABC] transition-colors">
            {artigo.titulo}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(artigo.created_date).toLocaleDateString('pt-BR')}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {artigo.autor}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {artigo.resumo}
          </p>
          {artigo.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {artigo.tags.split(',').slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Link
              to={createPageUrl(`ArtigoBlog?id=${artigo.id}`)}
              className="flex-1"
            >
              <Button variant="outline" className="w-full">
                Ler Artigo
              </Button>
            </Link>
            {isAdmin && (
              <Button variant="outline" onClick={onEdit}>
                Editar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}