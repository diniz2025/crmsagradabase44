import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

const tipoLabels = {
  hospital: "Hospital",
  clinica: "Clínica",
  laboratorio: "Laboratório",
  pronto_socorro: "Pronto Socorro",
  diagnostico: "Diagnóstico por Imagem",
  especialidade: "Clínica Especializada"
};

export default function EstabelecimentoModal({ estabelecimento, onClose, onSave }) {
  const [formData, setFormData] = useState(estabelecimento || {
    nome: "",
    tipo: "clinica",
    especialidades: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "SP",
    cep: "",
    telefone: "",
    whatsapp: "",
    horario_funcionamento: "",
    atendimento_24h: false,
    observacoes: ""
  });

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (estabelecimento) {
        return base44.entities.EstabelecimentoCredenciado.update(estabelecimento.id, data);
      } else {
        return base44.entities.EstabelecimentoCredenciado.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estabelecimentos'] });
      onSave();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.EstabelecimentoCredenciado.delete(estabelecimento.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estabelecimentos'] });
      onSave();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8">
        <div className="bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {estabelecimento ? 'Editar Estabelecimento' : 'Novo Estabelecimento'}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label>Nome do Estabelecimento *</Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                placeholder="Ex: Hospital Santa Casa"
              />
            </div>

            <div>
              <Label>Tipo *</Label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBABC]"
                required
              >
                {Object.entries(tipoLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Cidade *</Label>
              <Input
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                required
                placeholder="Ex: São Paulo"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Especialidades</Label>
              <Input
                value={formData.especialidades}
                onChange={(e) => setFormData({ ...formData, especialidades: e.target.value })}
                placeholder="Ex: Cardiologia, Ortopedia, Pediatria"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Endereço</Label>
              <Input
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                placeholder="Rua, número"
              />
            </div>

            <div>
              <Label>Bairro</Label>
              <Input
                value={formData.bairro}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                placeholder="Ex: Centro"
              />
            </div>

            <div>
              <Label>CEP</Label>
              <Input
                value={formData.cep}
                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                placeholder="00000-000"
              />
            </div>

            <div>
              <Label>Telefone</Label>
              <Input
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(11) 1234-5678"
              />
            </div>

            <div>
              <Label>WhatsApp</Label>
              <Input
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="(11) 91234-5678"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Horário de Funcionamento</Label>
              <Input
                value={formData.horario_funcionamento}
                onChange={(e) => setFormData({ ...formData, horario_funcionamento: e.target.value })}
                placeholder="Ex: Segunda a Sexta: 8h às 18h"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Observações</Label>
              <Textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
                placeholder="Informações adicionais"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Switch
                checked={formData.atendimento_24h}
                onCheckedChange={(checked) => setFormData({ ...formData, atendimento_24h: checked })}
              />
              <Label className="cursor-pointer">Atendimento 24 horas</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit" className="flex-1 bg-[#4DBABC] hover:bg-[#45B1B3]" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
            {estabelecimento && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir este estabelecimento?')) {
                    deleteMutation.mutate();
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}