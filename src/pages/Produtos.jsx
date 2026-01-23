import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Shield, 
  Stethoscope, 
  Lock,
  ExternalLink,
  Phone,
  Mail,
  CheckCircle2,
  Building2
} from "lucide-react";

export default function Produtos() {
  const produtos = [
    {
      nome: "Plano de Saúde Sagrada Família",
      categoria: "Saúde",
      icon: Heart,
      descricao: "Plano de saúde completo com ampla rede credenciada e cobertura nacional",
      beneficios: [
        "Ampla rede credenciada",
        "Atendimento 24 horas",
        "Cobertura nacional",
        "Sem carência para urgências"
      ],
      destaque: true,
      link: "https://www.sagradafamiliasaude.com.br/",
      linkRede: "https://www.sagradafamiliasaude.com.br/rede-referenciada/",
      cor: "bg-blue-500"
    },
    {
      nome: "Odonto Group com Telemedicina",
      categoria: "Odontologia + Telemedicina",
      icon: Stethoscope,
      descricao: "Plano odontológico completo com telemedicina inclusa da Infinity Doctors",
      beneficios: [
        "Sem limite de uso",
        "Telemedicina 24/7",
        "Cobertura nacional",
        "Rede ampla de dentistas",
        "Urgência 24h"
      ],
      planos: [
        { nome: "Odonto Clínico", valor: "R$ 16,90" },
        { nome: "Odonto Doc", valor: "R$ 19,90" },
        { nome: "Odonto Orto", valor: "R$ 89,90" }
      ],
      destaque: true,
      link: "mailto:diniz@dcgseguros.com.br?subject=Interesse em Odonto Group",
      cor: "bg-cyan-500"
    },
    {
      nome: "Telemedicina Infinity Doctors",
      categoria: "Telemedicina",
      icon: Stethoscope,
      descricao: "Plataforma de telemedicina com atendimento médico online 24/7 em mais de 15 países",
      beneficios: [
        "Pronto atendimento online 24/7",
        "18 especialidades médicas",
        "Saúde mental (psicólogos e psiquiatras)",
        "Atendimento no exterior",
        "Desconto em farmácias (até 70%)",
        "Desconto em exames laboratoriais"
      ],
      destaque: true,
      link: "https://www.infinitydoctors.com",
      cor: "bg-indigo-500"
    },
    {
      nome: "Seguro Empresarial Tokio Marine",
      categoria: "Seguro Empresarial",
      icon: Building2,
      descricao: "Seguro completo para proteção do seu estabelecimento comercial",
      beneficios: [
        "Cobertura de incêndio",
        "Responsabilidade civil",
        "Danos elétricos",
        "Roubo e furto qualificado",
        "Quebra de vidros"
      ],
      link: "mailto:diniz@dcgseguros.com.br?subject=Interesse em Seguro Empresarial Tokio",
      cor: "bg-orange-500"
    },
    {
      nome: "Seguro Cyber Akad",
      categoria: "Seguro Digital",
      icon: Lock,
      descricao: "Proteção completa contra crimes cibernéticos e vazamento de dados",
      beneficios: [
        "Proteção contra ransomware",
        "Cobertura LGPD",
        "Responsabilidade civil cyber",
        "Recuperação de dados",
        "Consultoria especializada"
      ],
      link: "mailto:diniz@dcgseguros.com.br?subject=Interesse em Seguro Cyber Akad",
      cor: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nossos Produtos e Serviços
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Soluções completas em seguros, saúde e proteção para o seu estabelecimento e funcionários
            </p>
          </div>
        </div>
      </div>

      {/* Produtos Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {produtos.map((produto, idx) => {
            const Icon = produto.icon;
            return (
              <Card 
                key={idx} 
                className={`overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  produto.destaque ? 'border-2 border-[#4DBABC]' : ''
                }`}
              >
                <div className={`h-2 ${produto.cor}`}></div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`${produto.cor} p-3 rounded-lg text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {produto.destaque && (
                      <Badge className="bg-[#FF6B35] text-white">Destaque</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl mt-4">{produto.nome}</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {produto.categoria}
                  </Badge>
                  <CardDescription className="text-base mt-2">
                    {produto.descricao}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-3">
                      Principais Benefícios:
                    </h4>
                    <ul className="space-y-2">
                      {produto.beneficios.map((beneficio, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {produto.planos && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        Planos Disponíveis:
                      </h4>
                      {produto.planos.map((plano, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">{plano.nome}</span>
                          <span className="font-bold text-[#4DBABC]">{plano.valor}</span>
                        </div>
                      ))}
                      <p className="text-xs text-gray-500 mt-2">*A partir de 2 vidas</p>
                    </div>
                  )}

                  <div className="space-y-2 pt-4">
                    {produto.link && (
                      <Button 
                        className="w-full bg-[#4DBABC] hover:bg-[#45B1B3]"
                        onClick={() => window.open(produto.link, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Saiba Mais
                      </Button>
                    )}
                    
                    {produto.linkRede && (
                      <Button 
                        variant="outline"
                        className="w-full border-[#4DBABC] text-[#4DBABC] hover:bg-[#4DBABC]/10"
                        onClick={() => window.open(produto.linkRede, '_blank')}
                      >
                        Ver Rede Credenciada
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Precisa de Ajuda para Escolher?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Nossa equipe está pronta para encontrar a melhor solução para seu negócio
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-[#4DBABC] hover:bg-gray-100"
              onClick={() => window.location.href = 'mailto:diniz@dcgseguros.com.br'}
            >
              <Mail className="w-5 h-5 mr-2" />
              diniz@dcgseguros.com.br
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = 'tel:+5511994104891'}
            >
              <Phone className="w-5 h-5 mr-2" />
              (11) 99410-4891
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}