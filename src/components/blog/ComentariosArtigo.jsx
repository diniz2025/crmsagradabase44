import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, CheckCircle2, Loader2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ComentariosArtigo({ artigoId }) {
  const queryClient = useQueryClient();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    nome_autor: "",
    email_autor: "",
    conteudo: ""
  });

  // Buscar apenas comentários aprovados
  const { data: comentarios = [], isLoading } = useQuery({
    queryKey: ['comentarios-artigo', artigoId],
    queryFn: () => base44.entities.Comentario.filter(
      { artigo_id: artigoId, status: 'aprovado' },
      '-created_date',
      100
    ),
  });

  const criarComentarioMutation = useMutation({
    mutationFn: async (data) => {
      // Status padrão: pendente (aguarda moderação)
      const comentario = await base44.entities.Comentario.create({
        ...data,
        artigo_id: artigoId,
        status: "pendente"
      });

      // Notificar admin sobre novo comentário
      await base44.integrations.Core.SendEmail({
        from_name: "Sistema de Comentários",
        to: "diniz@dcgseguros.com.br",
        subject: "Novo Comentário Pendente de Moderação",
        body: `
Novo comentário recebido e aguardando moderação:

Autor: ${data.nome_autor}
Email: ${data.email_autor}
Comentário: ${data.conteudo}

Acesse o sistema para aprovar ou rejeitar.
        `.trim()
      });

      return comentario;
    },
    onSuccess: () => {
      setEnviado(true);
      setFormData({ nome_autor: "", email_autor: "", conteudo: "" });
      setTimeout(() => {
        setEnviado(false);
        setMostrarFormulario(false);
      }, 3000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    criarComentarioMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mt-12">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#4DBABC]" />
              Comentários ({comentarios.length})
            </CardTitle>
            {!mostrarFormulario && (
              <Button
                onClick={() => setMostrarFormulario(true)}
                className="bg-[#4DBABC] hover:bg-[#45B1B3]"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Deixar Comentário
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {mostrarFormulario && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-b pb-6"
              >
                {enviado ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 bg-green-50 rounded-lg"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Comentário Enviado!
                    </h3>
                    <p className="text-sm text-gray-600">
                      Seu comentário será publicado após aprovação da moderação.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Deixe seu Comentário
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome_autor">Nome *</Label>
                        <Input
                          id="nome_autor"
                          value={formData.nome_autor}
                          onChange={(e) => handleChange('nome_autor', e.target.value)}
                          placeholder="Seu nome"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email_autor">Email * (não será publicado)</Label>
                        <Input
                          id="email_autor"
                          type="email"
                          value={formData.email_autor}
                          onChange={(e) => handleChange('email_autor', e.target.value)}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conteudo">Comentário *</Label>
                      <Textarea
                        id="conteudo"
                        value={formData.conteudo}
                        onChange={(e) => handleChange('conteudo', e.target.value)}
                        placeholder="Compartilhe sua opinião sobre este artigo..."
                        className="min-h-24"
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setMostrarFormulario(false);
                          setFormData({ nome_autor: "", email_autor: "", conteudo: "" });
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={criarComentarioMutation.isPending}
                        className="bg-[#4DBABC] hover:bg-[#45B1B3]"
                      >
                        {criarComentarioMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Enviar Comentário
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Carregando comentários...
            </div>
          ) : comentarios.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comentarios.map((comentario, index) => (
                <motion.div
                  key={comentario.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-4 border-[#4DBABC] pl-4 py-3 bg-gray-50 rounded-r-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-[#4DBABC] rounded-full p-2">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">
                          {comentario.nome_autor}
                        </p>
                        <span className="text-xs text-gray-500">
                          {format(new Date(comentario.created_date), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{comentario.conteudo}</p>
                      
                      {comentario.resposta_admin && (
                        <div className="mt-3 pl-4 border-l-2 border-amber-400 bg-amber-50 p-3 rounded-r">
                          <p className="text-xs font-semibold text-amber-800 mb-1">
                            Resposta da Equipe DCG:
                          </p>
                          <p className="text-sm text-gray-700">{comentario.resposta_admin}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}