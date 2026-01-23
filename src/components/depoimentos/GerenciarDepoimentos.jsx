import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Star, CheckCircle2, XCircle, AlertCircle, Trash2 } from "lucide-react";

export default function GerenciarDepoimentos() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: depoimentos = [], isLoading } = useQuery({
    queryKey: ['todos-depoimentos'],
    queryFn: () => base44.entities.Depoimento.list('-created_date', 100),
  });

  const aprovarMutation = useMutation({
    mutationFn: async ({ id, destaque }) => {
      return await base44.entities.Depoimento.update(id, {
        status: 'aprovado',
        destaque: destaque || false,
        data_aprovacao: new Date().toISOString(),
        aprovado_por: user?.email
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos-depoimentos']);
      queryClient.invalidateQueries(['depoimentos-aprovados']);
    },
  });

  const rejeitarMutation = useMutation({
    mutationFn: async (id) => {
      return await base44.entities.Depoimento.update(id, {
        status: 'rejeitado'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos-depoimentos']);
    },
  });

  const toggleDestaqueMutation = useMutation({
    mutationFn: async ({ id, destaque }) => {
      return await base44.entities.Depoimento.update(id, { destaque });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos-depoimentos']);
      queryClient.invalidateQueries(['depoimentos-aprovados']);
    },
  });

  const deletarMutation = useMutation({
    mutationFn: async (id) => {
      return await base44.entities.Depoimento.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos-depoimentos']);
      queryClient.invalidateQueries(['depoimentos-aprovados']);
    },
  });

  const produtoLabels = {
    plano_saude_sagrada_familia: "Plano de Saúde Sagrada Família",
    odonto_group: "Odonto Group",
    telemedicina_infinity: "Telemedicina Infinity Doctors",
    seguro_empresarial_tokio: "Seguro Empresarial Tokio",
    seguro_cyber_akad: "Seguro Cyber Akad",
    outro: "Outro"
  };

  const pendentes = depoimentos.filter(d => d.status === 'pendente');
  const aprovados = depoimentos.filter(d => d.status === 'aprovado');
  const rejeitados = depoimentos.filter(d => d.status === 'rejeitado');

  const DepoimentoCard = ({ depoimento, showActions = true }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-semibold text-lg">{depoimento.nome_cliente}</h4>
              <div className="flex gap-1">
                {Array.from({ length: depoimento.avaliacao }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              {depoimento.cargo && depoimento.empresa 
                ? `${depoimento.cargo} - ${depoimento.empresa}`
                : depoimento.cargo || depoimento.empresa || 'Cliente'}
            </p>
            <Badge variant="outline" className="text-xs">
              {produtoLabels[depoimento.produto] || depoimento.produto}
            </Badge>
          </div>
          <Badge className={
            depoimento.status === 'aprovado' ? 'bg-green-500' :
            depoimento.status === 'pendente' ? 'bg-yellow-500' :
            'bg-red-500'
          }>
            {depoimento.status}
          </Badge>
        </div>

        <p className="text-gray-700 italic mb-4">"{depoimento.depoimento}"</p>

        {depoimento.status === 'aprovado' && (
          <div className="flex items-center gap-2 mb-4">
            <Switch
              checked={depoimento.destaque}
              onCheckedChange={(checked) => 
                toggleDestaqueMutation.mutate({ id: depoimento.id, destaque: checked })
              }
            />
            <Label>Destacar na página inicial</Label>
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 pt-4 border-t">
            {depoimento.status === 'pendente' && (
              <>
                <Button
                  size="sm"
                  onClick={() => aprovarMutation.mutate({ id: depoimento.id })}
                  disabled={aprovarMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Aprovar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => rejeitarMutation.mutate(depoimento.id)}
                  disabled={rejeitarMutation.isPending}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Rejeitar
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (confirm('Deseja realmente deletar este depoimento?')) {
                  deletarMutation.mutate(depoimento.id);
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
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="p-6 text-center">Carregando depoimentos...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gerenciar Depoimentos</CardTitle>
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
                  Nenhum depoimento pendente
                </p>
              ) : (
                pendentes.map(dep => <DepoimentoCard key={dep.id} depoimento={dep} />)
              )}
            </TabsContent>

            <TabsContent value="aprovados" className="mt-6">
              {aprovados.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhum depoimento aprovado
                </p>
              ) : (
                aprovados.map(dep => <DepoimentoCard key={dep.id} depoimento={dep} />)
              )}
            </TabsContent>

            <TabsContent value="rejeitados" className="mt-6">
              {rejeitados.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhum depoimento rejeitado
                </p>
              ) : (
                rejeitados.map(dep => <DepoimentoCard key={dep.id} depoimento={dep} showActions={false} />)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}