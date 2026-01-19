import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Search, 
  Mail, 
  MessageCircle, 
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Facebook,
  Linkedin,
  Instagram,
  Phone,
  DollarSign,
  Users,
  Building2,
  Heart,
  Clock,
  CheckCircle
} from "lucide-react";

export default function ManualVendedor() {
  const [expandido, setExpandido] = useState({});

  const toggleExpandir = (secao) => {
    setExpandido(prev => ({ ...prev, [secao]: !prev[secao] }));
  };

  const botoesBusca = [
    { nome: "Google", cor: "bg-blue-500", icon: Search, descricao: "Busca geral" },
    { nome: "Instagram", cor: "bg-pink-500", icon: Instagram, descricao: "Perfil no Instagram" },
    { nome: "Facebook", cor: "bg-blue-600", icon: Facebook, descricao: "Página no Facebook" },
    { nome: "LinkedIn", cor: "bg-blue-700", icon: Linkedin, descricao: "Empresa no LinkedIn" },
    { nome: "CNPJ", cor: "bg-green-600", icon: Building2, descricao: "Dados oficiais" },
    { nome: "Contato", cor: "bg-orange-500", icon: Phone, descricao: "Telefone/Email" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-[#4DBABC] bg-gradient-to-r from-[#4DBABC]/10 to-[#FF6B35]/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <BookOpen className="w-8 h-8 text-[#4DBABC]" />
            Manual do Vendedor - CRM SinHoRes
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Aprenda a usar o sistema para vender o Plano Sagrada Família
          </p>
        </CardHeader>
      </Card>

      {/* Resumo Rápido */}
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            📋 Resumo Rápido
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">1. Escolha uma empresa</h4>
                    <p className="text-sm text-gray-600">Clique para expandir os detalhes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-full p-3">
                    <Search className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">2. Enriqueça os dados</h4>
                    <p className="text-sm text-gray-600">Use os botões de busca coloridos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-3">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">3. Entre em contato</h4>
                    <p className="text-sm text-gray-600">WhatsApp (verde) ou Email (laranja)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Legenda dos Botões */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle>🎨 Legenda dos Botões de Busca</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {botoesBusca.map((botao, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`${botao.cor} rounded-lg p-3`}>
                  <botao.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{botao.nome}</p>
                  <p className="text-xs text-gray-500">{botao.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seções do Manual */}
      {[
        {
          id: 1,
          titulo: "1. Primeiros Passos",
          conteudo: (
            <div className="space-y-3 text-gray-700">
              <p><strong>Acesse o CRM:</strong> Entre no sistema com seu usuário e senha.</p>
              <p><strong>Familiarize-se:</strong> Navegue pelas abas (Tabela, Pipeline, Configurações).</p>
              <p><strong>Veja seus leads:</strong> Na aba "Tabela", você verá todas as empresas atribuídas a você.</p>
            </div>
          )
        },
        {
          id: 2,
          titulo: "2. Gestão de Empresas",
          conteudo: (
            <div className="space-y-3 text-gray-700">
              <p><strong>Criar novo lead:</strong> Clique no botão "Novo Lead" no topo da página.</p>
              <p><strong>Editar lead:</strong> Clique no ícone de lápis ao lado de cada empresa.</p>
              <p><strong>Filtrar:</strong> Use os filtros de status, vendedor e busca por nome/cidade.</p>
              <p><strong>Organizar por status:</strong> Use a aba "Pipeline" para visualizar o funil de vendas.</p>
            </div>
          )
        },
        {
          id: 3,
          titulo: "3. Enriquecimento de Dados",
          conteudo: (
            <div className="space-y-3 text-gray-700">
              <p><strong>Botões de pesquisa:</strong> Ao lado de cada lead, você encontra botões coloridos.</p>
              <p><strong>Google (azul):</strong> Busca informações gerais sobre a empresa.</p>
              <p><strong>Instagram/Facebook/LinkedIn:</strong> Busca perfis sociais da empresa.</p>
              <p><strong>CNPJ (verde):</strong> Consulta dados oficiais na Receita Federal.</p>
              <p><strong>Dica:</strong> Use essas buscas para entender melhor o cliente antes de ligar.</p>
            </div>
          )
        },
        {
          id: 4,
          titulo: "4. Entrando em Contato",
          conteudo: (
            <div className="space-y-3 text-gray-700">
              <p><strong>WhatsApp (verde):</strong> Abre mensagem personalizada com o número do lead.</p>
              <p><strong>Email (laranja):</strong> Abre email com modelo de apresentação do plano.</p>
              <p><strong>Script padrão:</strong> Use o script configurado em "Configurações" ou personalize.</p>
              <p><strong>Telefone padrão:</strong> 11-99410-4891</p>
              <p><strong>Registre o contato:</strong> Após contato, atualize o status do lead.</p>
            </div>
          )
        },
        {
          id: 5,
          titulo: "5. Atualizando Status",
          conteudo: (
            <div className="space-y-3 text-gray-700">
              <p><strong>Lead:</strong> Empresa ainda não contatada.</p>
              <p><strong>Qualificado:</strong> Empresa demonstrou interesse inicial.</p>
              <p><strong>Proposta:</strong> Proposta formal enviada.</p>
              <p><strong>Fechado:</strong> Contrato assinado! 🎉</p>
              <p><strong>Descartado:</strong> Empresa não tem interesse ou perfil inadequado.</p>
              <p><strong>Dica:</strong> Arraste e solte leads no Pipeline para mudar status rapidamente.</p>
            </div>
          )
        }
      ].map(secao => (
        <Card key={secao.id}>
          <CardHeader 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleExpandir(secao.id)}
          >
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{secao.titulo}</CardTitle>
              {expandido[secao.id] ? 
                <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                <ChevronDown className="w-5 h-5 text-gray-400" />
              }
            </div>
          </CardHeader>
          {expandido[secao.id] && (
            <CardContent className="p-6 border-t">
              {secao.conteudo}
            </CardContent>
          )}
        </Card>
      ))}

      {/* Informações do Plano */}
      <Card className="border-2 border-[#FF6B35]">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#FF6B35]" />
            6. Sobre o Plano Sagrada Família
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Informações do plano
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-1">Valor</p>
                  <p className="text-2xl font-bold text-green-700">R$ 235,09/mês</p>
                  <p className="text-xs text-gray-500">por vida</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-1">Faixa etária</p>
                  <p className="text-2xl font-bold text-blue-700">0 a 70 anos</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Carência</p>
                    <p className="text-xl font-bold text-purple-700">SEM CARÊNCIA</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-1">Segmento</p>
                  <p className="text-sm font-semibold text-orange-700">
                    Bares, Restaurantes e Hotéis filiados ao SinHoRes Osasco
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Rede credenciada
            </h4>
            <p className="text-sm text-gray-700">
              Acesse o menu 'Home' para ver a rede credenciada completa. Você pode buscar por especialidade, cidade ou nome do prestador.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Argumentos de venda
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <strong>Sem carência:</strong> Funcionário pode usar imediatamente
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <strong>Preço único:</strong> Fácil de calcular e prever custos
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <strong>Rede ampla:</strong> Cobertura completa em Osasco e região
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <strong>Sindicato:</strong> Credibilidade e suporte institucional
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dúvidas */}
      <Card className="border-2 border-yellow-200 bg-yellow-50">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">❓ Dúvidas?</h3>
          <p className="text-gray-700 mb-4">
            Entre em contato com o gerente Cristiano para suporte técnico ou dúvidas sobre o sistema.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => window.location.href = 'mailto:dcgseguros@gmail.com'}
              className="bg-[#4DBABC] hover:bg-[#45B1B3]"
            >
              <Mail className="w-4 h-4 mr-2" />
              dcgseguros@gmail.com
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}