import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Clock, Plus, Trash2, Mail, MessageCircle, Save } from "lucide-react";

export default function AutomacoesConfig() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    status_gatilho: 'Lead',
    dias_apos: 1,
    tipo_mensagem: 'whatsapp',
    usar_script: 'whatsapp',
    mensagem_personalizada: '',
    assunto_email: '',
    ativo: true
  });

  const queryClient = useQueryClient();

  const { data: automacoes = [] } = useQuery({
    queryKey: ['automacoes'],
    queryFn: () => base44.entities.Automacao.list(),
    initialData: [],
  });

  const { data: configs = [] } = useQuery({
    queryKey: ['configs'],
    queryFn: () => base44.entities.ConfigCRM.list(),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Automacao.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['automacoes']);
      setShowForm(false);
      resetForm();
      alert('Automação criada com sucesso!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Automacao.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['automacoes']);
      alert('Automação removida!');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, ativo }) => base44.entities.Automacao.update(id, { ativo }),
    onSuccess: () => {
      queryClient.invalidateQueries(['automacoes']);
    },
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      status_gatilho: 'Lead',
      dias_apos: 1,
      tipo_mensagem: 'whatsapp',
      usar_script: 'whatsapp',
      mensagem_personalizada: '',
      assunto_email: '',
      ativo: true
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const getScriptPreview = (usarScript) => {
    if (usarScript === 'personalizado') return 'Mensagem personalizada';
    const config = configs.find(c => c.chave === `script_${usarScript}`);
    if (config) {
      return config.valor.substring(0, 100) + '...';
    }
    return 'Script não encontrado';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Automações de Follow-up
          </CardTitle>
          <Button 
            onClick={() => setShowForm(!showForm)}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nova Automação
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border-2 border-purple-200">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome da Automação</Label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Follow-up após proposta"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Status Gatilho</Label>
                <Select 
                  value={formData.status_gatilho}
                  onValueChange={(value) => setFormData({...formData, status_gatilho: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Qualificado">Qualificado</SelectItem>
                    <SelectItem value="Proposta">Proposta</SelectItem>
                    <SelectItem value="Fechado">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dias Após Status</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.dias_apos}
                  onChange={(e) => setFormData({...formData, dias_apos: parseInt(e.target.value)})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Mensagem</Label>
                <Select 
                  value={formData.tipo_mensagem}
                  onValueChange={(value) => setFormData({...formData, tipo_mensagem: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </div>
                    </SelectItem>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        E-mail
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Script a Usar</Label>
                <Select 
                  value={formData.usar_script}
                  onValueChange={(value) => setFormData({...formData, usar_script: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">Script WhatsApp</SelectItem>
                    <SelectItem value="sagrada_familia">Script Sagrada Família</SelectItem>
                    <SelectItem value="personalizado">Mensagem Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.usar_script === 'personalizado' && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Mensagem Personalizada</Label>
                  <Textarea
                    value={formData.mensagem_personalizada}
                    onChange={(e) => setFormData({...formData, mensagem_personalizada: e.target.value})}
                    placeholder="Digite sua mensagem personalizada..."
                    rows={4}
                  />
                </div>
              )}

              {formData.tipo_mensagem === 'email' && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Assunto do E-mail</Label>
                  <Input
                    value={formData.assunto_email}
                    onChange={(e) => setFormData({...formData, assunto_email: e.target.value})}
                    placeholder="Ex: Follow-up - Plano Sagrada Família"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Salvar Automação
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {automacoes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhuma automação configurada ainda.</p>
          ) : (
            automacoes.map((auto) => (
              <div 
                key={auto.id} 
                className={`p-4 rounded-lg border-2 transition-all ${
                  auto.ativo 
                    ? 'bg-white border-purple-200 hover:border-purple-300' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{auto.nome}</h4>
                      {auto.tipo_mensagem === 'email' ? (
                        <Mail className="w-4 h-4 text-blue-600" />
                      ) : (
                        <MessageCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Gatilho:</span> {auto.dias_apos} dia(s) após status{' '}
                        <span className="font-semibold text-purple-600">{auto.status_gatilho}</span>
                      </p>
                      <p>
                        <span className="font-medium">Script:</span> {
                          auto.usar_script === 'whatsapp' ? 'WhatsApp' :
                          auto.usar_script === 'sagrada_familia' ? 'Sagrada Família' :
                          'Personalizado'
                        }
                      </p>
                      {auto.assunto_email && (
                        <p><span className="font-medium">Assunto:</span> {auto.assunto_email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={auto.ativo}
                        onCheckedChange={(checked) => 
                          toggleMutation.mutate({ id: auto.id, ativo: checked })
                        }
                      />
                      <span className="text-xs text-gray-500">
                        {auto.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(auto.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}