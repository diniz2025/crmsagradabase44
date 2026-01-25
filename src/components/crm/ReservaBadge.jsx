import React from "react";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, User } from "lucide-react";

/**
 * Badge visual para status de reserva de lead
 *
 * Estados:
 * - disponivel (verde): Lead não reservado
 * - meu (amarelo): Reservado pelo usuário atual
 * - outro (vermelho): Reservado por outro vendedor
 */
export default function ReservaBadge({ lead, meuVendedorId, vendedores = [] }) {
  const getReservaStatus = () => {
    // Se não tem reserva ou expirou
    if (!lead.reservado_por) {
      return { status: 'disponivel', label: 'Disponível', color: 'bg-green-100 text-green-800 border-green-200' };
    }

    // Verifica se a reserva expirou
    if (lead.expira_reserva_em) {
      const expiracao = new Date(lead.expira_reserva_em);
      if (expiracao < new Date()) {
        return { status: 'disponivel', label: 'Disponível', color: 'bg-green-100 text-green-800 border-green-200' };
      }
    }

    // Se é minha reserva
    if (lead.reservado_por === meuVendedorId) {
      return { status: 'meu', label: 'Meu Lead', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    }

    // Reservado por outro vendedor
    const vendedorReserva = vendedores.find(v => v.id === lead.reservado_por);
    const nomeVendedor = vendedorReserva?.nome || 'Outro vendedor';

    return {
      status: 'outro',
      label: `Reservado`,
      vendedor: nomeVendedor,
      color: 'bg-red-100 text-red-800 border-red-200'
    };
  };

  const reservaInfo = getReservaStatus();

  const getIcon = () => {
    switch (reservaInfo.status) {
      case 'disponivel':
        return <Unlock className="w-3 h-3" />;
      case 'meu':
        return <User className="w-3 h-3" />;
      case 'outro':
        return <Lock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Badge className={`${reservaInfo.color} border flex items-center gap-1 text-xs font-medium`}>
        {getIcon()}
        {reservaInfo.label}
      </Badge>
      {reservaInfo.vendedor && (
        <span className="text-xs text-gray-500 truncate max-w-[100px]" title={reservaInfo.vendedor}>
          {reservaInfo.vendedor}
        </span>
      )}
    </div>
  );
}

/**
 * Função utilitária para verificar status da reserva
 */
export function getReservaStatusUtil(lead, meuVendedorId) {
  if (!lead.reservado_por) return 'disponivel';

  if (lead.expira_reserva_em) {
    const expiracao = new Date(lead.expira_reserva_em);
    if (expiracao < new Date()) return 'disponivel';
  }

  if (lead.reservado_por === meuVendedorId) return 'meu';

  return 'outro';
}
