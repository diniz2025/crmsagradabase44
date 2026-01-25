import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, Lock, Unlock, Clock, User, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import ReservaBadge, { getReservaStatusUtil } from "./ReservaBadge";
import ReservaTimer from "./ReservaTimer";

export default function LeadModal({
  lead,
  vendedores,
  onClose,
  onSave,
  meuVendedorId,
  isAdmin,
  isSupervisor
}) {
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

  // Verificar status da reserva
  const reservaStatus = lead ? getReservaStatusUtil(lead, meuVendedorId) : null;
  const vendedorReserva = vendedores.find(v => v.id === lead?.reservado_por);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      let result;
      if (lead?.id) {
        result = await base44.entities.Lead.update(lead.id, data);

        // Se mudou o status, registrar no histórico
        if (lead.status !== data.status) {
          await base44.entities.HistoricoStatus.create({
            lead_id: lead.id,
            status: data.status,
            data_mudanca: new Date().toISOString(),
            vendedor: data.vendedor
          });
        }
      } else {
        result = await base44.entities.Lead.create(data);

        // Registrar status inicial no histórico
        await base44.entities.HistoricoStatus.create({
          lead_id: result.id,
          status: data.status || 'Lead',
          data_mudanca: new Date().toISOString(),
          vendedor: data.vendedor
        });
      }
      return result;
    },
    onSuccess: () => {
      onSave();
    },
  });

  // Mutation para reservar lead
  const reservarMutation = useMutation({
    mutationFn: async () => {
      const agora = new Date();
      const expiracao = new Date(agora.getTime() + 48 * 60 * 60 * 1000);

      return base44.entities.Lead.update(lead.id, {
        reservado_por: meuVendedorId,
        reservado_em: agora.toISOString(),
        expira_reserva_em: expiracao.toISOString()
      });
    },
    onSuccess: () => {
      toast.success('Lead reservado com sucesso! Você tem 48h para trabalhar nele.');
      onSave();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao reservar lead');
    }
  });

  // Mutation para liberar reserva
  const liberarMutation = useMutation({
    mutationFn: async () => {
      return base44.entities.Lead.update(lead.id, {
        reservado_por: null,
        reservado_em: null,
        expira_reserva_em: null
      });
    },
    onSuccess: () => {
      toast.success('Reserva liberada com sucesso!');
      onSave();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao liberar reserva');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return '-';
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

        {/* Seção de Reserva - aparece apenas para leads existentes */}
        {lead && (
          <div className={`px-6 py-4 border-b ${
            reservaStatus === 'meu' ? 'bg-amber-50' :
            reservaStatus === 'outro' ? 'bg-red-50' :
            'bg-green-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ReservaBadge
                  lead={lead}
                  meuVendedorId={meuVendedorId}
                  vendedores={vendedores}
                />

                {lead.reservado_por && (
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>
                        Reservado por: <strong>{vendedorReserva?.nome || 'Desconhecido'}</strong>
                      </span>
                    </div>
                    {lead.reservado_em && (
                      <div className="flex items-center gap-2 mt-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Em: {formatarData(lead.reservado_em)}</span>
                      </div>
                    )}
                  </div>
                )}

                {(reservaStatus === 'meu' || isAdmin || isSupervisor) && lead.expira_reserva_em && (
                  <div className="border-l pl-4 ml-4">
                    <ReservaTimer lead={lead} meuVendedorId={meuVendedorId} />
                    <div className="text-xs text-gray-500 mt-1">
                      Expira em: {formatarData(lead.expira_reserva_em)}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {reservaStatus === 'disponivel' && meuVendedorId && (
                  <Button
                    type="button"
                    onClick={() => reservarMutation.mutate()}
                    disabled={reservarMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {reservarMutation.isPending ? 'Reservando...' : 'Reservar Lead'}
                  </Button>
                )}

                {(reservaStatus === 'meu' || reservaStatus === 'outro') && (isAdmin || isSupervisor) && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => liberarMutation.mutate()}
                    disabled={liberarMutation.isPending}
                    className="border-amber-500 text-amber-600 hover:bg-amber-50"
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    {liberarMutation.isPending ? 'Liberando...' : 'Liberar Reserva'}
                  </Button>
                )}
              </div>
            </div>

            {reservaStatus === 'outro' && !isAdmin && !isSupervisor && (
              <div className="mt-3 flex items-center gap-2 text-amber-700 bg-amber-100 rounded-lg p-3">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">
                  Este lead está reservado por outro vendedor. Você pode visualizar, mas não poderá fazer alterações significativas.
                </span>
              </div>
            )}
          </div>
        )}

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
