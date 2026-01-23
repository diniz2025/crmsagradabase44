import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, AlertCircle, Trash2, MessageSquare, Reply } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ModerarComentarios() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [respostaTexto, setRespostaTexto] = useState({});

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: comentarios = [], isLoading } = useQuery({
    queryKey: ['todos-comentarios'],
    queryFn: () => base44.entities.Comentario.list('-created_date', 200),
  });

  const { data: artigos = [] } = useQuery({
    queryKey: ['artigos-blog'],
    queryFn: () => base44.entities.ArtigoBlog.list('-created_date', 200),
  });

  const aprovarMutation = useMutation({
    mutationFn: async ({ id, resposta }) => {
      return await base44.entities.Comentario.update(id, {
        status: 'aprovado',
        resposta_admin: resposta || null,
        data_moderacao: new Date().toISOString(),
        moderado_por: user?.email
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos-comentarios']);
      queryClient.invalidateQueries(['comentarios-artigo']);
      setRespostaTexto({});
    },
  });

  const rejeitarMutation = useMutation({
    mutationFn: async (id) => {
      return await base44.entities.Comentario.update(id, {
        status: 'rejeitado',
        data_moderacao: new Date().toISOString(),
        moderado_por: user?.email
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos-comentarios']);
    },
  });

  const deletarMutation = useMutation({
    mutationFn: async (id) => {
      return await base44.entities.Comentario.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos-comentarios']);
      queryClient.invalidateQueries(['comentarios-artigo']);
    },
  });

  const getArtigoTitulo = (artigoId) => {
    const artigo = artigos.find(a => a.id === artigoId);
    return artigo?.titulo || 'Artigo não encontrado';
  };

  const pendentes = comentarios.filter(c => c.status === 'pendente');
  const aprovados = comentarios.filter(c => c.status === 'aprovado');
  const rejeitados = comentarios.filter(c => c.status === 'rejeitado');

  const ComentarioCard = ({ comentario, showActions = true }) => {
    const [mostrarResposta, setMostrarResposta] = useState(false);

    return (
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-[#4DBABC]" />
                <div>
                  <h4 className="font-semibold text-lg">{comentario.nome_autor}</h4>
                  <p className="text-xs text-gray-500">{comentario.email_autor}</p>
                </div>
                <Badge className={
                  comentario.status === 'aprovado' ? 'bg-green-500' :
                  comentario.status === 'pendente' ? 'bg-yellow-500' :
                  'bg-red-500'
                }>
                  {comentario.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Artigo: <span className="font-medium">{getArtigoTitulo(comentario.artigo_id)}</span>
              </p>
              <p className="text-xs text-gray-400 mb-3">
                {format(new Date(comentario.created_date), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-700">{comentario.conteudo}</p>
          </div>

          {comentario.resposta_admin && (
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 mb-4">
              <p className="text-xs font-semibold text-amber-800 mb-2">Resposta da Equipe:</p>
              <p className="text-sm text-gray-700">{comentario.resposta_admin}</p>
            </div>
          )}

          {showActions && (
            <div className="space-y-3 pt-4 border-t">
              {comentario.status === 'pendente' && (
                <>
                  {mostrarResposta ? (
                    <div className="space-y-2">
                      <Label htmlFor={`resposta-${comentario.id}`}>
                        Resposta (opcional)
                      </Label>
                      <Textarea
                        id={`resposta-${comentario.id}`}
                        placeholder="Digite uma resposta para o comentário..."
                        value={respostaTexto[comentario.id] || ''}
                        onChange={(e) => setRespostaTexto(prev => ({ 
                          ...prev, 
                          [comentario.id]: e.target.value 
                        }))}
                        className="min-h-20"
                      />
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setMostrarResposta(true)}
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      Adicionar Resposta
                    </Button>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => aprovarMutation.mutate({ 
                        id: comentario.id, 
                        resposta: respostaTexto[comentario.id] 
                      })}
                      disabled={aprovarMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejeitarMutation.mutate(comentario.id)}
                      disabled={rejeitarMutation.isPending}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                </>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (confirm('Deseja realmente deletar este comentário?')) {
                    deletarMutation.mutate(comentario.id);
                  }
                }}
                disabled={deletarMutation.isPending}
                className="ml-auto"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Deletar
              </Button>
            </div>
          )}

          {comentario.moderado_por && (
            <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
              Moderado por: {comentario.moderado_por} em{' '}
              {format(new Date(comentario.data_moderacao), "dd/MM/yyyy 'às' HH:mm")}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return <div className="p-6 text-center">Carregando comentários...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#4DBABC]" />
            Moderar Comentários do Blog
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pendentes">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pendentes" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Pendentes ({pendentes.length})
              </TabsTrigger>
              <TabsTrigger value="aprovados" className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Aprovados ({aprovados.length})
              </TabsTrigger>
              <TabsTrigger value="rejeitados" className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Rejeitados ({rejeitados.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pendentes" className="mt-6">
              {pendentes.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhum comentário pendente
                </p>
              ) : (
                pendentes.map(com => <ComentarioCard key={com.id} comentario={com} />)
              )}
            </TabsContent>

            <TabsContent value="aprovados" className="mt-6">
              {aprovados.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhum comentário aprovado
                </p>
              ) : (
                aprovados.map(com => <ComentarioCard key={com.id} comentario={com} showActions={false} />)
              )}
            </TabsContent>

            <TabsContent value="rejeitados" className="mt-6">
              {rejeitados.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhum comentário rejeitado
                </p>
              ) : (
                rejeitados.map(com => <ComentarioCard key={com.id} comentario={com} showActions={false} />)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}