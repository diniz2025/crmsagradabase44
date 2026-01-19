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
  Phone
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LeadsTable({ leads, isLoading, onEdit, vendedores, onRefetch }) {
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
              return (
                <TableRow key={lead.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="font-medium">{lead.nome_completo}</div>
                    {lead.contato && (
                      <div className="text-sm text-gray-500">{lead.contato}</div>
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
                    <div className="flex justify-end gap-2">
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