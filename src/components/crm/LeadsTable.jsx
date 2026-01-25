import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  MessageCircle,
  Mail,
  ExternalLink,
  ChevronDown,
  Phone,
  Lock,
  Unlock,
  ShieldAlert
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import ReservaBadge, { getReservaStatusUtil } from "./ReservaBadge";
import ReservaTimer from "./ReservaTimer";

export default function LeadsTable({
  leads,
  isLoading,
  onEdit,
  vendedores,
  onRefetch,
  meuVendedorId,
  isAdmin,
  isSupervisor
}) {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const totalPages = Math.ceil(leads.length / pageSize);
  const paginatedLeads = leads.slice((page - 1) * pageSize, page * pageSize);

  const statusColors = {
    Lead: "bg-blue-100 text-blue-800",
    Qualificado: "bg-yellow-100 text-yellow-800",
    Proposta: "bg-purple-100 text-purple-800",
    Fechado: "bg-green-100 text-green-800",
    Descartado: "bg-gray-100 text-gray-800"
  };

  // Mutation para reservar lead
  const reservarMutation = useMutation({
    mutationFn: async (leadId) => {
      const agora = new Date();
      const expiracao = new Date(agora.getTime() + 48 * 60 * 60 * 1000); // +48 horas

      // Buscar lead atual para verificar se ainda está disponível
      const leadAtual = leads.find(l => l.id === leadId);

      if (leadAtual?.reservado_por && leadAtual.reservado_por !== meuVendedorId) {
        // Verificar se expirou
        if (leadAtual.expira_reserva_em) {
          const dataExpiracao = new Date(leadAtual.expira_reserva_em);
          if (dataExpiracao > agora) {
            throw new Error('Este lead já foi reservado por outro vendedor');
          }
        } else {
          throw new Error('Este lead já foi reservado por outro vendedor');
        }
      }

      return base44.entities.Lead.update(leadId, {
        reservado_por: meuVendedorId,
        reservado_em: agora.toISOString(),
        expira_reserva_em: expiracao.toISOString()
      });
    },
    onSuccess: () => {
      toast.success('Lead reservado com sucesso! Você tem 48h para trabalhar nele.');
      onRefetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao reservar lead');
    }
  });

  // Mutation para liberar reserva (apenas admin/supervisor)
  const liberarMutation = useMutation({
    mutationFn: async (leadId) => {
      return base44.entities.Lead.update(leadId, {
        reservado_por: null,
        reservado_em: null,
        expira_reserva_em: null
      });
    },
    onSuccess: () => {
      toast.success('Reserva liberada com sucesso!');
      onRefetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao liberar reserva');
    }
  });

  const getEnrichLinks = (lead) => {
    const q = encodeURIComponent(`${lead.nome_completo || ''} ${lead.cidade || ''}`.trim());
    return {
      google: `https://www.google.com/search?q=${q}`,
      maps: `https://www.google.com/maps/search/${q}`,
      linkedin: `https://www.google.com/search?q=site:linkedin.com/company ${q}`,
      instagram: `https://www.google.com/search?q=site:instagram.com ${q}`,
      cnpj: lead.cnpj ? `https://www.google.com/search?q=${encodeURIComponent(lead.cnpj)} Receita Federal` : null
    };
  };

  const handleWhatsApp = (lead, script) => {
    const text = script
      .replace('[NOME]', lead.nome_completo || '')
      .replace('[VENDEDOR]', lead.vendedor || 'nossa equipe');
    const digits = (lead.telefone || '').replace(/\D/g, '');
    const url = `https://wa.me/55${digits}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleEmail = (lead, script) => {
    const subject = `Plano Sagrada Família — R$ 235,09 (carência zero)`;
    const body = script
      .replace('[NOME]', lead.nome_completo || '')
      .replace('[VENDEDOR]', lead.vendedor || 'Equipe');
    window.location.href = `mailto:${lead.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleReservar = (leadId) => {
    if (!meuVendedorId) {
      toast.error('Você precisa estar logado como vendedor para reservar leads');
      return;
    }
    reservarMutation.mutate(leadId);
  };

  const handleLiberar = (leadId) => {
    if (!isAdmin && !isSupervisor) {
      toast.error('Apenas supervisores e administradores podem liberar reservas');
      return;
    }
    liberarMutation.mutate(leadId);
  };

  const podeReservar = (lead) => {
    const status = getReservaStatusUtil(lead, meuVendedorId);
    return status === 'disponivel' && meuVendedorId;
  };

  const podeLiberar = (lead) => {
    const status = getReservaStatusUtil(lead, meuVendedorId);
    return (status === 'meu' || status === 'outro') && (isAdmin || isSupervisor);
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando leads...</div>;
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum lead cadastrado ainda.</p>
        <p className="text-gray-400 mt-2">Clique em "Novo Lead" ou importe um CSV para começar.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Nome/Empresa</TableHead>
              <TableHead className="font-semibold">Reserva</TableHead>
              <TableHead className="font-semibold">Score</TableHead>
              <TableHead className="font-semibold">CNPJ</TableHead>
              <TableHead className="font-semibold">Cidade</TableHead>
              <TableHead className="font-semibold">Telefone</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Vendedor</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.map((lead) => {
              const links = getEnrichLinks(lead);
              const reservaStatus = getReservaStatusUtil(lead, meuVendedorId);

              return (
                <TableRow
                  key={lead.id}
                  className={`hover:bg-gray-50 ${
                    reservaStatus === 'meu' ? 'bg-amber-50/50' :
                    reservaStatus === 'outro' ? 'bg-red-50/30' : ''
                  }`}
                >
                  <TableCell>
                    <div className="font-medium">{lead.nome_completo}</div>
                    {lead.contato && (
                      <div className="text-sm text-gray-500">{lead.contato}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <ReservaBadge
                        lead={lead}
                        meuVendedorId={meuVendedorId}
                        vendedores={vendedores}
                      />
                      {(reservaStatus === 'meu' || isAdmin || isSupervisor) && lead.expira_reserva_em && (
                        <ReservaTimer
                          lead={lead}
                          meuVendedorId={meuVendedorId}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {lead.score !== undefined && lead.score !== null ? (
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        lead.score >= 80 ? 'bg-green-100 text-green-800' :
                        lead.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        lead.score >= 40 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {lead.score}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{lead.cnpj || '-'}</TableCell>
                  <TableCell className="text-sm">{lead.cidade || '-'}</TableCell>
                  <TableCell>
                    {lead.telefone ? (
                      <a href={`tel:+55${lead.telefone.replace(/\D/g, '')}`} className="text-blue-600 hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {lead.telefone}
                      </a>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[lead.status] || statusColors.Lead}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{lead.vendedor || '-'}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {/* Botão Reservar */}
                      {podeReservar(lead) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReservar(lead.id)}
                          disabled={reservarMutation.isPending}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="Reservar lead por 48h"
                        >
                          <Lock className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Botão Liberar (apenas admin/supervisor) */}
                      {podeLiberar(lead) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLiberar(lead.id)}
                          disabled={liberarMutation.isPending}
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          title="Liberar reserva"
                        >
                          <Unlock className="w-4 h-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(lead)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      {lead.telefone && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleWhatsApp(lead, 'Olá [NOME]! Tudo bem? Sou [VENDEDOR] da Sagrada Família. Gostaria de apresentar nosso plano de saúde por apenas R$ 235,09/mês. Tem alguns minutos para conversarmos?')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      )}

                      {lead.email && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEmail(lead, 'Olá [NOME],\n\nSou [VENDEDOR] da Sagrada Família. Entramos em contato para apresentar nosso plano de saúde especial para o setor de bares e restaurantes.\n\nPor apenas R$ 235,09/mês você tem acesso a:\n- Atendimento 24h\n- Sem carência para emergências\n- Rede credenciada completa\n\nPodemos agendar uma conversa?\n\nAguardo seu retorno!')}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={links.google} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4" />
                              Buscar no Google
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={links.maps} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4" />
                              Google Maps
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4" />
                              LinkedIn
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4" />
                              Instagram
                            </a>
                          </DropdownMenuItem>
                          {links.cnpj && (
                            <DropdownMenuItem asChild>
                              <a href={links.cnpj} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Consultar CNPJ
                              </a>
                            </DropdownMenuItem>
                          )}

                          {/* Opções de reserva no dropdown também */}
                          {(podeReservar(lead) || podeLiberar(lead)) && (
                            <>
                              <DropdownMenuSeparator />
                              {podeReservar(lead) && (
                                <DropdownMenuItem
                                  onClick={() => handleReservar(lead.id)}
                                  className="text-green-600"
                                >
                                  <Lock className="w-4 h-4 mr-2" />
                                  Reservar Lead (48h)
                                </DropdownMenuItem>
                              )}
                              {podeLiberar(lead) && (
                                <DropdownMenuItem
                                  onClick={() => handleLiberar(lead.id)}
                                  className="text-amber-600"
                                >
                                  <Unlock className="w-4 h-4 mr-2" />
                                  Liberar Reserva
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Legenda de cores */}
      <div className="flex gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
          <span>Disponível</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-amber-100 border border-amber-200"></div>
          <span>Meu Lead</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
          <span>Reservado por outro</span>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
