import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { 
  Calendar, 
  User, 
  Tag,
  ArrowLeft,
  Heart,
  Flame,
  Shield,
  Briefcase,
  Newspaper,
  TrendingUp
} from "lucide-react";
import ReactMarkdown from "react-markdown";

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

export default function ArtigoBlog() {
  const urlParams = new URLSearchParams(window.location.search);
  const artigoId = urlParams.get('id');

  const { data: artigo, isLoading } = useQuery({
    queryKey: ['artigo', artigoId],
    queryFn: async () => {
      const artigos = await base44.entities.ArtigoBlog.filter({ id: artigoId });
      return artigos[0];
    },
    enabled: !!artigoId,
  });

  const { data: artigosRelacionados = [] } = useQuery({
    queryKey: ['artigos-relacionados', artigo?.categoria],
    queryFn: async () => {
      if (!artigo) return [];
      const artigos = await base44.entities.ArtigoBlog.filter(
        { categoria: artigo.categoria, publicado: true },
        '-created_date',
        4
      );
      return artigos.filter(a => a.id !== artigoId).slice(0, 3);
    },
    enabled: !!artigo,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DBABC] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (!artigo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Artigo não encontrado</h2>
          <Link to={createPageUrl('Blog')}>
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = categoriaIcons[artigo.categoria] || Newspaper;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl('Blog')}>
            <Button variant="outline" className="mb-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Blog
            </Button>
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {artigo.imagem_destaque && (
            <img
              src={artigo.imagem_destaque}
              alt={artigo.titulo}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8 md:p-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge className={categoriaColors[artigo.categoria]}>
                <Icon className="w-3 h-3 mr-1" />
                {categoriaLabels[artigo.categoria]}
              </Badge>
              {!artigo.publicado && (
                <Badge className="bg-yellow-500">Rascunho</Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {artigo.titulo}
            </h1>

            <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {artigo.autor}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {new Date(artigo.created_date).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>

            {artigo.resumo && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                <p className="text-lg text-gray-700 italic">
                  {artigo.resumo}
                </p>
              </div>
            )}

            <div className="prose prose-lg max-w-none mb-8">
              <ReactMarkdown
                components={{
                  h1: ({children}) => (
                    <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b pb-3">
                      {children}
                    </h1>
                  ),
                  h2: ({children}) => (
                    <h2 className="text-2xl font-bold mt-8 mb-4 text-[#4DBABC]">
                      {children}
                    </h2>
                  ),
                  h3: ({children}) => (
                    <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800">
                      {children}
                    </h3>
                  ),
                  p: ({children}) => (
                    <p className="text-gray-700 leading-relaxed mb-5 text-base">
                      {children}
                    </p>
                  ),
                  ul: ({children}) => (
                    <ul className="list-disc ml-6 mb-6 space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({children}) => (
                    <ol className="list-decimal ml-6 mb-6 space-y-2">
                      {children}
                    </ol>
                  ),
                  li: ({children}) => (
                    <li className="text-gray-700 leading-relaxed">
                      {children}
                    </li>
                  ),
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-[#4DBABC] bg-[#4DBABC]/5 pl-6 pr-4 py-4 my-6 italic text-gray-700 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  a: ({href, children}) => (
                    <a 
                      href={href} 
                      className="text-[#4DBABC] hover:text-[#45B1B3] underline font-medium" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({children}) => (
                    <strong className="font-bold text-gray-900">
                      {children}
                    </strong>
                  ),
                  em: ({children}) => (
                    <em className="italic text-gray-700">
                      {children}
                    </em>
                  ),
                  code: ({inline, children}) => 
                    inline ? (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4">
                        {children}
                      </code>
                    ),
                  hr: () => (
                    <hr className="my-8 border-t-2 border-gray-200" />
                  ),
                }}
              >
                {artigo.conteudo}
              </ReactMarkdown>
            </div>

            {artigo.tags && (
              <div className="pt-8 border-t">
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {artigo.tags.split(',').map((tag, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline"
                      className="px-3 py-1 bg-gray-50 hover:bg-[#4DBABC]/10 hover:border-[#4DBABC] transition-colors"
                    >
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {artigosRelacionados.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-[#4DBABC]" />
              Artigos Relacionados
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {artigosRelacionados.map((relacionado) => {
                const RelIcon = categoriaIcons[relacionado.categoria] || Newspaper;
                return (
                  <Link
                    key={relacionado.id}
                    to={createPageUrl(`ArtigoBlog?id=${relacionado.id}`)}
                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#4DBABC]/30"
                  >
                    {relacionado.imagem_destaque && (
                      <div className="h-44 overflow-hidden">
                        <img
                          src={relacionado.imagem_destaque}
                          alt={relacionado.titulo}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <Badge className={`${categoriaColors[relacionado.categoria]} mb-3`}>
                        <RelIcon className="w-3 h-3 mr-1" />
                        {categoriaLabels[relacionado.categoria]}
                      </Badge>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#4DBABC] transition-colors leading-snug">
                        {relacionado.titulo}
                      </h3>
                      {relacionado.resumo && (
                        <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                          {relacionado.resumo}
                        </p>
                      )}
                      <p className="text-xs text-[#4DBABC] font-semibold group-hover:underline">
                        Ler artigo →
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}