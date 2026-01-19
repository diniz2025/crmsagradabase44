import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Package, Upload, AlertCircle } from "lucide-react";

export default function DistribuicaoLotes({ usuarioEmail }) {
  const [loteTexto, setLoteTexto] = useState("");
  const [corretoraDestino, setCorretoraDestino] = useState("");
  const [processando, setProcessando] = useState(false);

  const queryClient = useQueryClient();

  const { data: corretoras = [] } = useQuery({
    queryKey: ['corretoras'],
    queryFn: () => base44.entities.Corretora.list(),
  });

  const { data: vendedores = [] } = useQuery({
    queryKey: ['vendedores'],
    queryFn: () => base44.entities.Vendedor.list(),
  });

  // Verifica se o usuário é admin (Cristino ou Vanessa)
  const isAdmin = usuarioEmail === 'cristino@example.com' || usuarioEmail === 'vanessa@example.com';

  // Pega a corretora do supervisor atual
  const minhaCorretora = vendedores.find(v => v.email === usuarioEmail && v.tipo === 'supervisor')?.corretora_id;

  const processarLote = async () => {
    if (!corretoraDestino) {
      alert('Selecione uma corretora de destino');
      return;
    }

    if (!loteTexto.trim()) {
      alert('Cole os dados dos leads');
      return;
    }

    setProcessando(true);

    try {
      // Processa as linhas (assumindo formato CSV simples)
      const linhas = loteTexto.split('\n').filter(l => l.trim());
      const leads = [];

      for (const linha of linhas) {
        const partes = linha.split(',').map(p => p.trim());
        if (partes.length >= 2) {
          leads.push({
            nome_completo: partes[0],
            telefone: partes[1] || '11994104891',
            email: partes[2] || '',
            cidade: partes[3] || '',
            tipo_estabelecimento: partes[4] || 'outro',
            corretora_id: corretoraDestino,
            status: 'Lead'
          });
        }
      }

      if (leads.length === 0) {
        alert('Nenhum lead válido encontrado');
        setProcessando(false);
        return;
      }

      if (leads.length > 100) {
        alert('Máximo de 100 leads por lote. Foram encontrados ' + leads.length);
        setProcessando(false);
        return;
      }

      // Cria os leads em lote
      await base44.entities.Lead.bulkCreate(leads);

      alert(`${leads.length} leads distribuídos com sucesso!`);
      setLoteTexto('');
      queryClient.invalidateQueries(['leads']);
    } catch (error) {
      console.error('Erro ao processar lote:', error);
      alert('Erro ao processar lote de leads');
    } finally {
      setProcessando(false);
    }
  };

  // Filtra corretoras que o usuário pode ver
  const corretorasDisponiveis = isAdmin 
    ? corretoras 
    : corretoras.filter(c => c.id === minhaCorretora);

  if (!isAdmin && !minhaCorretora) {
    return (
      <Card className="border-2 border-yellow-200 bg-yellow-50">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <p className="text-gray-700">
            Você não tem permissão para distribuir leads em lote.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-green-200">
      <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Distribuição de Leads em Lote
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Distribua até 100 leads por vez para as corretoras
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Selecione a Corretora de Destino:
          </label>
          <select
            value={corretoraDestino}
            onChange={(e) => setCorretoraDestino(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Selecione...</option>
            {corretorasDisponiveis.map(c => (
              <option key={c.id} value={c.id}>
                {c.nome} - {c.supervisor_nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Cole os dados dos leads (máximo 100):
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Formato: Nome, Telefone, Email, Cidade, Tipo (uma linha por lead)
          </p>
          <Textarea
            value={loteTexto}
            onChange={(e) => setLoteTexto(e.target.value)}
            placeholder="Restaurante XYZ, 11999999999, contato@xyz.com, Osasco, restaurante
Bar ABC, 11988888888, bar@abc.com, Barueri, bar"
            rows={10}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={processarLote}
            disabled={processando || !corretoraDestino || !loteTexto.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            {processando ? 'Processando...' : 'Distribuir Lote'}
          </Button>
          {loteTexto.split('\n').filter(l => l.trim()).length > 0 && (
            <Badge className="bg-blue-100 text-blue-800">
              {loteTexto.split('\n').filter(l => l.trim()).length} leads no lote
            </Badge>
          )}
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-semibold text-sm mb-2">Instruções:</h4>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>Máximo de 100 leads por lote</li>
            <li>Use vírgula para separar os campos</li>
            <li>Uma linha por lead</li>
            <li>Campos opcionais podem ser deixados em branco</li>
            <li>WhatsApp padrão: 11-99410-4891</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}