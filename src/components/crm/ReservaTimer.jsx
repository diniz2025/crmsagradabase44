import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";

/**
 * Componente de countdown timer para reserva de lead
 * Mostra tempo restante no formato "Xh Xmin restantes"
 */
export default function ReservaTimer({ lead, meuVendedorId }) {
  const [tempoRestante, setTempoRestante] = useState(null);

  useEffect(() => {
    // Se não tem reserva ou não é minha reserva, não mostra timer
    if (!lead.reservado_por || !lead.expira_reserva_em) {
      setTempoRestante(null);
      return;
    }

    // Só mostra timer para minha reserva ou se sou admin/supervisor
    if (lead.reservado_por !== meuVendedorId && meuVendedorId) {
      setTempoRestante(null);
      return;
    }

    const calcularTempo = () => {
      const agora = new Date();
      const expiracao = new Date(lead.expira_reserva_em);
      const diff = expiracao - agora;

      if (diff <= 0) {
        return { expirado: true, texto: 'Expirado', horas: 0, minutos: 0 };
      }

      const horas = Math.floor(diff / (1000 * 60 * 60));
      const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diff % (1000 * 60)) / 1000);

      let texto = '';
      if (horas > 0) {
        texto = `${horas}h ${minutos}min`;
      } else if (minutos > 0) {
        texto = `${minutos}min ${segundos}s`;
      } else {
        texto = `${segundos}s`;
      }

      return { expirado: false, texto, horas, minutos, segundos };
    };

    // Calcular tempo inicial
    setTempoRestante(calcularTempo());

    // Atualizar a cada segundo
    const interval = setInterval(() => {
      const tempo = calcularTempo();
      setTempoRestante(tempo);

      if (tempo.expirado) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lead.reservado_por, lead.expira_reserva_em, meuVendedorId]);

  if (!tempoRestante) return null;

  const isUrgente = tempoRestante.horas === 0 && tempoRestante.minutos < 30;
  const isCritico = tempoRestante.horas === 0 && tempoRestante.minutos < 5;

  if (tempoRestante.expirado) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <AlertTriangle className="w-3 h-3" />
        <span>Expirado</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 text-xs font-medium ${
        isCritico
          ? 'text-red-600 animate-pulse'
          : isUrgente
          ? 'text-amber-600'
          : 'text-blue-600'
      }`}
    >
      <Clock className="w-3 h-3" />
      <span>{tempoRestante.texto} restantes</span>
    </div>
  );
}

/**
 * Versão compacta do timer para uso inline
 */
export function ReservaTimerCompacto({ expiraEm }) {
  const [tempoRestante, setTempoRestante] = useState('--');

  useEffect(() => {
    if (!expiraEm) {
      setTempoRestante('--');
      return;
    }

    const calcularTempo = () => {
      const agora = new Date();
      const expiracao = new Date(expiraEm);
      const diff = expiracao - agora;

      if (diff <= 0) return 'Expirado';

      const horas = Math.floor(diff / (1000 * 60 * 60));
      const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (horas > 0) return `${horas}h ${minutos}m`;
      return `${minutos}m`;
    };

    setTempoRestante(calcularTempo());

    const interval = setInterval(() => {
      setTempoRestante(calcularTempo());
    }, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, [expiraEm]);

  return <span>{tempoRestante}</span>;
}
