import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4DBABC] via-[#5AC0C2] to-[#45B1B3] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left lg:flex lg:items-center lg:justify-between"
          >
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <Badge className="mb-6 bg-[#FF6B35] hover:bg-[#E85A28] text-white border-none text-sm px-4 py-2">
                <MapPin className="w-4 h-4 mr-2" />
                Osasco e Regi&atilde;o
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Plano de Sa&uacute;de para
                <span className="block text-[#FF6B35]">Bares e Restaurantes</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                Proteja voc&ecirc; e sua equipe com o Plano Sagrada Fam&iacute;lia
              </p>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-8 border border-white/20 inline-block w-full max-w-sm">
                <p className="text-sm text-white/80 mb-2">A partir de apenas</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#FF6B35]">R$ 235</span>
                  <span className="text-2xl md:text-3xl text-[#FF6B35]">,09</span>
                  <span className="text-lg md:text-xl text-white/90 ml-2">/m&ecirc;s</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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

            <div className="lg:w-5/12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-[#FF6B35] rounded-full p-4">
                      <ChefHat className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Especializado em</h3>
                      <p className="text-white/80">Bares &amp; Restaurantes</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      "Atendimento 24h de emergência",
                      "Rede credenciada em Osasco",
                      "Sem carência para urgências",
                      "Cobertura completa"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6B35] flex-shrink-0" />
                        <span className="text-white">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 bg-[#FF6B35] rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-white fill-white" />
                    <div>
                      <div className="text-2xl font-bold text-white">4.9</div>
                      <div className="text-xs text-white/80">Avalia&ccedil;&atilde;o</div>
                    </div>
                  </div>
                </div>
              </motion.div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Produtos e Servi&ccedil;os
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Solu&ccedil;&otilde;es completas de seguros para o setor de alimenta&ccedil;&atilde;o
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#4DBABC] to-[#45B1B3] rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Plano de Sa&uacute;de</h3>
              <p className="text-white/90 mb-6">
                Cobertura completa para voc&ecirc; e sua equipe com o Plano Sagrada Fam&iacute;lia
              </p>
              <Button 
                onClick={scrollToForm}
                className="w-full bg-[#FF6B35] hover:bg-[#E85A28] text-white"
              >
                Contratar Agora
              </Button>
            </motion.div>

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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Stethoscope className="w-16 h-16 mx-auto mb-6 text-[#FF6B35]" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Proteger sua Equipe?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Junte-se a centenas de estabelecimentos em Osasco que j&aacute; confiam no Sagrada Fam&iacute;lia
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
              <div className="mb-4">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691644e4652cae53371d6050/5767f8bd5_LogoSinHoRes_2021_vertical1.png" 
                  alt="SinHoRes Osasco" 
                  className="h-32 mb-4"
                />
              </div>
              <p className="text-sm">
                Plano de sa&uacute;de especialmente desenvolvido para o setor de bares e restaurantes de Osasco e regi&atilde;o.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-white">Nadjair Diniz Barbosa</p>
                <p className="text-gray-400 text-xs">Coordenador do Setor de Seguros</p>
                <p className="text-gray-400 text-xs">SinHoRes Osasco, Alphaville e Regi&atilde;o</p>
                <p className="flex items-center gap-2 mt-3">
                  <Phone className="w-4 h-4" />
                  Entre em contato através do formulário
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Osasco, Alphaville e Regi&atilde;o
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Hor&aacute;rio de Atendimento</h4>
              <p className="text-sm">Segunda a Sexta: 8h &agrave;s 18h</p>
              <p className="text-sm">S&aacute;bado: 8h &agrave;s 12h</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Plano de Sa&uacute;de Sagrada Fam&iacute;lia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}