import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, Users, MessageSquare } from "lucide-react";

export default function ConfigCRM({ vendedores }) {
  const [novoVendedor, setNovoVendedor] = useState('');
  const [script, setScript] = useState('');
  
  const queryClient = useQueryClient();

  const { data: configs = [] } = useQuery({
    queryKey: ['configs'],
    queryFn: () => base44.entities.ConfigCRM.list(),
    initialData: [],
  });

  useEffect(() => {
    const scriptConfig = configs.find(c => c.chave === 'script_whatsapp');
    if (scriptConfig) {
      setScript(scriptConfig.valor);
    }
  }, [configs]);

  const addVendedorMutation = useMutation({
    mutationFn: (nome) => base44.entities.Vendedor.create({ nome, ativo: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendedores']);
      setNovoVendedor('');
    },
  });

  const deleteVendedorMutation = useMutation({
    mutationFn: (id) => base44.entities.Vendedor.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendedores']);
    },
  });

  const saveScriptMutation = useMutation({
    mutationFn: async (texto) => {
      const existing = configs.find(c => c.chave === 'script_whatsapp');
      if (existing) {
        return base44.entities.ConfigCRM.update(existing.id, { valor: texto });
      } else {
        return base44.entities.ConfigCRM.create({ chave: 'script_whatsapp', valor: texto });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['configs']);
      alert('Script salvo com sucesso!');
    },
  });

  const handleAddVendedor = () => {
    if (novoVendedor.trim()) {
      addVendedorMutation.mutate(novoVendedor.trim());
    }
  };

  const handleSaveScript = () => {
    saveScriptMutation.mutate(script);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Gerenciar Vendedores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nome do vendedor"
                value={novoVendedor}
                onChange={(e) => setNovoVendedor(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddVendedor()}
              />
              <Button onClick={handleAddVendedor} disabled={addVendedorMutation.isPending}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {vendedores.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  Nenhum vendedor cadastrado ainda
                </p>
              ) : (
                vendedores.map(v => (
                  <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">{v.nome}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteVendedorMutation.mutate(v.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Script de WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="script">Mensagem padrão</Label>
              <Textarea
                id="script"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Olá [NOME]! Sou [VENDEDOR] da Sagrada Família..."
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Use [NOME] para o nome do lead e [VENDEDOR] para o nome do vendedor
              </p>
            </div>

            <Button 
              onClick={handleSaveScript} 
              disabled={saveScriptMutation.isPending}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveScriptMutation.isPending ? 'Salvando...' : 'Salvar Script'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}