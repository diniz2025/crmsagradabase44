import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  Phone, 
  CheckCircle2,
  ArrowRight,
  Star,
  Stethoscope,
  MapPin,
  ChefHat,
  Flame,
  Briefcase,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import FormularioContato from "../components/FormularioContato";
import BeneficiosSection from "../components/BeneficiosSection";
import ComoFunciona from "../components/ComoFunciona";
import DepoimentosSection from "../components/depoimentos/DepoimentosSection";

import ChatbotAtendimento from "../components/ChatbotAtendimento";

export default function Home() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const scrollToForm = () => {
    const formElement = document.getElementById('formulario-contato');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
    setMostrarFormulario(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Principal - SinHoRes Osasco */}
      <section className="bg-gradient-to-r from-[#FF6B35] to-[#E85A28] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
            <Shield className="w-10 h-10 flex-shrink-0" />
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Clube de Benef&iacute;cios SinHoRes Osasco, Alphaville e Regi&atilde;o
              </h2>
              <p className="text-white/95 text-sm md:text-base">
                Condi&ccedil;&otilde;es Exclusivas em Planos de Sa&uacute;de, Seguros Empresariais, Patrimoniais, Odontol&oacute;gicos e Gest&atilde;o de RH
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4DBABC] via-[#5AC0C2] to-[#45B1B3] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Destaque Institucional */}
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-none text-base px-6 py-3">
                <MapPin className="w-5 h-5 mr-2" />
                Osasco, Alphaville e Regi&atilde;o
              </Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Benef&iacute;cios Exclusivos do<br />
                <span className="text-[#FF6B35]">Clube SinHoRes na Área de Seguros</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-4xl mx-auto leading-relaxed">
                O <strong>Clube de Benef&iacute;cios SinHoRes Osasco</strong>, em parceria com a <strong>DCG Corretora</strong>, viabiliza condi&ccedil;&otilde;es imbat&iacute;veis:
                <br />
                <span className="text-lg md:text-xl">
                  Plano Sagrada Fam&iacute;lia • Tokio Marine • Porto Seguro • Seguros Odontol&oacute;gicos • DCG RH Sem Risco
                </span>
              </p>

              <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-6 md:p-8 max-w-5xl mx-auto border border-white/30">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-[#FF6B35]" />
                    <div className="text-sm font-semibold">Planos de Sa&uacute;de</div>
                  </div>
                  <div className="text-center">
                    <Flame className="w-8 h-8 mx-auto mb-2 text-[#FF6B35]" />
                    <div className="text-sm font-semibold">Seguro Inc&ecirc;ndio</div>
                  </div>
                  <div className="text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-[#FF6B35]" />
                    <div className="text-sm font-semibold">Seguros Patrimoniais</div>
                  </div>
                  <div className="text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-[#FF6B35]" />
                    <div className="text-sm font-semibold">Seguro Odonto</div>
                  </div>
                  <div className="text-center">
                    <Briefcase className="w-8 h-8 mx-auto mb-2 text-[#FF6B35]" />
                    <div className="text-sm font-semibold">RH e Trabalhista</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Destaque Plano Sagrada Família */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-10 border-2 border-[#FF6B35] max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Badge className="bg-[#FF6B35] text-white border-none text-sm px-4 py-2">
                  ⭐ Produto em Destaque
                </Badge>
              </div>
              
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <ChefHat className="w-10 h-10 text-[#FF6B35]" />
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Plano de Sa&uacute;de Sagrada Fam&iacute;lia
                  </h2>
                </div>
                <p className="text-lg text-white/95 mb-4">
                  Especializado para <strong>Bares e Restaurantes</strong>
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 rounded-2xl p-6 text-center">
                  <p className="text-sm text-white/80 mb-2">A partir de apenas</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl md:text-5xl font-bold text-[#FF6B35]">R$ 235</span>
                    <span className="text-2xl text-[#FF6B35]">,09</span>
                    <span className="text-lg text-white/90 ml-2">/m&ecirc;s</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    "Atendimento 24h",
                    "Zero car&ecirc;ncia emerg&ecirc;ncias",
                    "Rede credenciada completa",
                    "Cobertura nacional"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                      <CheckCircle2 className="w-5 h-5 text-[#FF6B35] flex-shrink-0" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={scrollToForm}
                  className="bg-[#FF6B35] hover:bg-[#E85A28] text-white text-lg px-8 py-6 rounded-full shadow-2xl hover:shadow-[#FF6B35]/50 transition-all duration-300 transform hover:scale-105"
                >
                  Contratar Agora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={scrollToForm}
                  className="bg-white hover:bg-white/90 text-[#4DBABC] border-2 border-white text-lg px-8 py-6 rounded-full"
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Falar com Consultor
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { icon: Users, value: "500+", label: "Estabelecimentos" },
              { icon: Heart, value: "24/7", label: "Atendimento" },
              { icon: Shield, value: "100%", label: "Cobertura" },
              { icon: Clock, value: "0", label: "Car&ecirc;ncia" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4"
              >
                <stat.icon className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-[#4DBABC]" />
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BeneficiosSection />

      {/* Seção de Produtos/Seguros */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#FF6B35] text-white text-base px-6 py-2">
              Clube de Benef&iacute;cios SinHoRes — Vantagens Exclusivas
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Condi&ccedil;&otilde;es Exclusivas em Todos os Seguros
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Como associado do <strong>SinHoRes Osasco</strong>, voc&ecirc; tem acesso a benef&iacute;cios diferenciados nos melhores produtos do mercado: 
              <strong> Sagrada Fam&iacute;lia, Tokio Marine, Porto Seguro</strong> e mais, viabilizados pela <strong>DCG Corretora</strong>
            </p>
          </div>

          {/* Destaque Principal - Plano de Saúde Sagrada Família */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-[#4DBABC] via-[#5AC0C2] to-[#45B1B3] rounded-3xl p-8 md:p-12 text-white shadow-2xl border-4 border-[#FF6B35] relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#FF6B35] hover:bg-[#E85A28] text-white border-none text-sm px-4 py-2">
                  ⭐ Produto Principal
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    Plano de Sa&uacute;de Sagrada Fam&iacute;lia
                  </h3>
                  <p className="text-xl text-white/95 mb-6 leading-relaxed">
                    Cobertura completa para voc&ecirc; e sua equipe. O plano ideal para bares e restaurantes de Osasco e regi&atilde;o.
                  </p>
                  
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-[#FF6B35]">R$ 235,09</div>
                        <div className="text-sm text-white/80">por mês</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold">24h</div>
                        <div className="text-sm text-white/80">atendimento</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={scrollToForm}
                      size="lg"
                      className="bg-[#FF6B35] hover:bg-[#E85A28] text-white text-lg px-8 shadow-xl"
                    >
                      Contratar Agora
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Link to={createPageUrl("RedeCredenciada")} className="flex-1">
                      <Button 
                        size="lg"
                        className="w-full bg-white text-[#4DBABC] hover:bg-gray-100 text-lg px-8"
                      >
                        Ver Rede Credenciada
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#FF6B35] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Zero car&ecirc;ncia para emerg&ecirc;ncias</div>
                      <div className="text-sm text-white/80">Atendimento imediato quando voc&ecirc; mais precisa</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#FF6B35] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Rede credenciada completa</div>
                      <div className="text-sm text-white/80">Hospitais, cl&iacute;nicas e laborat&oacute;rios em Osasco</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#FF6B35] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Cobertura nacional</div>
                      <div className="text-sm text-white/80">Seu plano funciona em todo o Brasil</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#FF6B35] flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Especializado em bares e restaurantes</div>
                      <div className="text-sm text-white/80">Condi&ccedil;&otilde;es especiais para o setor</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Outros Produtos */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Seguro de Inc&ecirc;ndio</h3>
              <p className="text-white/90 mb-6">
                Proteja seu estabelecimento contra inc&ecirc;ndios e sinistros
              </p>
              <a
                href="https://lovable.dev/projects/2b9e6462-0132-4029-a2c6-c5ceaa17f4ab"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-white text-orange-600 hover:bg-gray-100 px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                Saiba Mais
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">DCG RH Sem Risco</h3>
              <p className="text-white/90 mb-6">
                Gest&atilde;o completa de recursos humanos sem riscos trabalhistas
              </p>
              <a
                href="https://www.dcgrhsemriscos.business/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-gray-100 px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                Acessar Site
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>
      
      <ComoFunciona />

      {/* Seção de Depoimentos */}
      <DepoimentosSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Stethoscope className="w-16 h-16 mx-auto mb-6 text-[#FF6B35]" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Aproveite os Benef&iacute;cios Exclusivos do Clube SinHoRes
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Centenas de estabelecimentos em Osasco j&aacute; aproveitam condi&ccedil;&otilde;es diferenciadas
          </p>
          <Button 
            size="lg"
            onClick={scrollToForm}
            className="bg-[#FF6B35] hover:bg-[#E85A28] text-white text-lg px-12 py-6 rounded-full shadow-2xl hover:shadow-[#FF6B35]/50 transition-all duration-300 transform hover:scale-105"
          >
            Solicitar Contato
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Formulário */}
      <section id="formulario-contato" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FormularioContato mostrar={mostrarFormulario} />
        </div>
      </section>

      {/* Chatbot */}
      <ChatbotAtendimento />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <a 
                href="https://www.sinhoresosasco.com.br/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mb-4 hover:opacity-80 transition-opacity"
              >
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691644e4652cae53371d6050/5767f8bd5_LogoSinHoRes_2021_vertical1.png" 
                  alt="SinHoRes Osasco" 
                  className="h-32 mb-4"
                />
              </a>
              <p className="text-sm mb-4">
                Clube de Benef&iacute;cios do SinHoRes Osasco, Alphaville e Regi&atilde;o, viabilizando condi&ccedil;&otilde;es exclusivas em seguros.
              </p>
              <p className="text-xs text-gray-500 italic">
                Os produtos de seguros s&atilde;o fornecidos pelas respectivas operadoras (Sagrada Fam&iacute;lia, Tokio Marine, Porto Seguro). 
                O SinHoRes viabiliza condi&ccedil;&otilde;es diferenciadas como benef&iacute;cio exclusivo aos associados, por meio da DCG Corretora.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Precisa de Ajuda para Escolher?</h4>
              <p className="text-sm mb-4">Nossa equipe DCG está pronta para encontrar a melhor solução para seu negócio</p>
              <div className="space-y-2 text-sm">
                <p>seguros@sinhoresseguros.com.br</p>
                <p>(11) 99410-4891</p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Hor&aacute;rio de Atendimento</h4>
              <p className="text-sm">Segunda a Sexta: 8h &agrave;s 18h</p>
              <p className="text-sm">S&aacute;bado: 8h &agrave;s 12h</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Clube de Benef&iacute;cios SinHoRes Osasco. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}