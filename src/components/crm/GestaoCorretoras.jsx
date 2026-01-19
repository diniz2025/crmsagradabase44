import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Plus, Trash2 } from "lucide-react";

export default function GestaoCorretoras() {
  const [novaCorretora, setNovaCorretora] = useState({
    nome: "",
    supervisor_nome: "",
    supervisor_email: "",
    tipo: "supervisora"
  });

  const queryClient = useQueryClient();

  const { data: corretoras = [] } = useQuery({
    queryKey: ['corretoras'],
    queryFn: () => base44.entities.Corretora.list(),
  });

  const { data: vendedores = [] } = useQuery({
    queryKey: ['vendedores'],
    queryFn: () => base44.entities.Vendedor.list(),
  });

  const criarCorretoraMutation = useMutation({
    mutationFn: (data) => base44.entities.Corretora.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['corretoras']);
      setNovaCorretora({ nome: "", supervisor_nome: "", supervisor_email: "", tipo: "supervisora" });
    }
  });

  const deletarCorretoraMutation = useMutation({
    mutationFn: (id) => base44.entities.Corretora.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['corretoras'])
  });

  const handleCriar = () => {
    if (!novaCorretora.nome || !novaCorretora.supervisor_nome || !novaCorretora.supervisor_email) {
      alert('Preencha todos os campos');
      return;
    }
    criarCorretoraMutation.mutate(novaCorretora);
  };

  const contarVendedores = (corretoraId) => {
    return vendedores.filter(v => v.corretora_id === corretoraId && v.tipo === 'vendedor').length;
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nova Corretora
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Nome da Corretora"
              value={novaCorretora.nome}
              onChange={(e) => setNovaCorretora({...novaCorretora, nome: e.target.value})}
            />
            <select
              value={novaCorretora.tipo}
              onChange={(e) => setNovaCorretora({...novaCorretora, tipo: e.target.value})}
              className="border rounded-md px-3 py-2"
            >
              <option value="supervisora">Corretora Supervisora</option>
              <option value="master">Master</option>
            </select>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Nome do Supervisor"
              value={novaCorretora.supervisor_nome}
              onChange={(e) => setNovaCorretora({...novaCorretora, supervisor_nome: e.target.value})}
            />
            <Input
              type="email"
              placeholder="Email do Supervisor"
              value={novaCorretora.supervisor_email}
              onChange={(e) => setNovaCorretora({...novaCorretora, supervisor_email: e.target.value})}
            />
          </div>
          <Button
            onClick={handleCriar}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={criarCorretoraMutation.isLoading}
          >
            <Plus className="w-4 h-4 mr-2" />
            {criarCorretoraMutation.isLoading ? 'Criando...' : 'Criar Corretora'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Hierarquia de Corretoras e Vendedores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {corretoras
              .filter(c => c.tipo === 'master')
              .map(corretora => (
                <Card key={corretora.id} className="border-2 border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-purple-600">Master</Badge>
                          <h3 className="font-bold text-lg">{corretora.nome}</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          Supervisor: {corretora.supervisor_nome}
                        </p>
                        <p className="text-xs text-gray-500">{corretora.supervisor_email}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {contarVendedores(corretora.id)} vendedores
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('Deletar esta corretora?')) {
                            deletarCorretoraMutation.mutate(corretora.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-700">Corretoras Supervisoras</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {corretoras
                  .filter(c => c.tipo === 'supervisora')
                  .map(corretora => (
                    <Card key={corretora.id} className="border-2 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold">{corretora.nome}</h3>
                            </div>
                            <p className="text-sm text-gray-600">
                              Supervisor: {corretora.supervisor_nome}
                            </p>
                            <p className="text-xs text-gray-500">{corretora.supervisor_email}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              {contarVendedores(corretora.id)} vendedores
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('Deletar esta corretora?')) {
                                deletarCorretoraMutation.mutate(corretora.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}