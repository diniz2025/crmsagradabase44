import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";

export default function LeadModal({ lead, vendedores, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nome_completo: lead?.nome_completo || '',
    cnpj: lead?.cnpj || '',
    cidade: lead?.cidade || '',
    telefone: lead?.telefone || '',
    email: lead?.email || '',
    contato: lead?.contato || '',
    tipo_estabelecimento: lead?.tipo_estabelecimento || '',
    numero_funcionarios: lead?.numero_funcionarios || '',
    status: lead?.status || 'Lead',
    vendedor: lead?.vendedor || vendedores[0]?.nome || '',
    observacoes: lead?.observacoes || ''
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (lead?.id) {
        return base44.entities.Lead.update(lead.id, data);
      } else {
        return base44.entities.Lead.create(data);
      }
    },
    onSuccess: () => {
      onSave();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {lead ? 'Editar Lead' : 'Novo Lead'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome_completo">Nome/Empresa *</Label>
              <Input
                id="nome_completo"
                value={formData.nome_completo}
                onChange={(e) => handleChange('nome_completo', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => handleChange('cnpj', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contato">Nome do Contato</Label>
              <Input
                id="contato"
                value={formData.contato}
                onChange={(e) => handleChange('contato', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_estabelecimento">Tipo</Label>
              <Select
                value={formData.tipo_estabelecimento}
                onValueChange={(value) => handleChange('tipo_estabelecimento', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="restaurante">Restaurante</SelectItem>
                  <SelectItem value="lanchonete">Lanchonete</SelectItem>
                  <SelectItem value="cafeteria">Cafeteria</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero_funcionarios">Funcionários</Label>
              <Select
                value={formData.numero_funcionarios}
                onValueChange={(value) => handleChange('numero_funcionarios', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1 a 5</SelectItem>
                  <SelectItem value="6-10">6 a 10</SelectItem>
                  <SelectItem value="11-20">11 a 20</SelectItem>
                  <SelectItem value="21-50">21 a 50</SelectItem>
                  <SelectItem value="51+">Mais de 50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Qualificado">Qualificado</SelectItem>
                  <SelectItem value="Proposta">Proposta</SelectItem>
                  <SelectItem value="Fechado">Fechado</SelectItem>
                  <SelectItem value="Descartado">Descartado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendedor">Vendedor</Label>
              <Select
                value={formData.vendedor}
                onValueChange={(value) => handleChange('vendedor', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vendedores.map(v => (
                    <SelectItem key={v.id} value={v.nome}>{v.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={saveMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}