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
  ChefHat
} from "lucide-react";
import { motion } from "framer-motion";
import FormularioContato from "../components/FormularioContato";
import BeneficiosSection from "../components/BeneficiosSection";
import ComoFunciona from "../components/ComoFunciona";
import RedeCredenciada from "../components/RedeCredenciada";

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
                Osasco e Região
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Plano de Sa&uacute;de para seu
                <span className="block text-[#FF6B35]">Neg&oacute;cio de Alimenta&ccedil;&atilde;o</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                Proteja voc&ecirc; e sua equipe com o Plano Sagrada Fam&iacute;lia
              </p>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20 inline-block">
                <p className="text-sm text-white/80 mb-2">A partir de apenas</p>
                <div className="flex items-baseline">
                  <span className="text-5xl md:text-6xl font-bold text-[#FF6B35]">R$ 235</span>
                  <span className="text-3xl text-[#FF6B35]">,09</span>
                  <span className="text-xl text-white/90 ml-2">/mês</span>
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
                      <p className="text-white/80">Bares & Restaurantes</p>
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
                      <div className="text-xs text-white/80">Avaliação</div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "500+", label: "Estabelecimentos Atendidos" },
              { icon: Heart, value: "24/7", label: "Atendimento" },
              { icon: Shield, value: "100%", label: "Cobertura" },
              { icon: Clock, value: "0", label: "Carência Emergência" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-10 h-10 mx-auto mb-3 text-[#4DBABC]" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <BeneficiosSection />
      
      <RedeCredenciada />
      
      <ComoFunciona />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Stethoscope className="w-16 h-16 mx-auto mb-6 text-[#FF6B35]" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Proteger seu Negócio?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Junte-se a centenas de estabelecimentos em Osasco que já confiam no Sagrada Família
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#FF6B35]" />
                Sagrada Família
              </h3>
              <p className="text-sm">
                Plano de saúde especialmente desenvolvido para o setor de bares e restaurantes de Osasco e região.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Entre em contato através do formulário
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Osasco e Região
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Horário de Atendimento</h4>
              <p className="text-sm">Segunda a Sexta: 8h às 18h</p>
              <p className="text-sm">Sábado: 8h às 12h</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Plano de Saúde Sagrada Família. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}