import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  Stethoscope,
  Hospital,
  Pill,
  Activity
} from "lucide-react";

const beneficios = [
  {
    icon: Hospital,
    title: "Rede Credenciada Completa",
    description: "Acesso a hospitais, clínicas e laboratórios de qualidade em Osasco e região",
    color: "bg-blue-500"
  },
  {
    icon: Clock,
    title: "Atendimento 24/7",
    description: "Suporte e atendimento de emergência disponível 24 horas por dia, 7 dias por semana",
    color: "bg-green-500"
  },
  {
    icon: Shield,
    title: "Sem Carência para Urgências",
    description: "Comece a usar imediatamente para casos de urgência e emergência",
    color: "bg-amber-500"
  },
  {
    icon: Users,
    title: "Plano Familiar",
    description: "Possibilidade de incluir dependentes com condições especiais",
    color: "bg-purple-500"
  },
  {
    icon: Stethoscope,
    title: "Consultas Ilimitadas",
    description: "Consultas com clínicos gerais e especialistas sem limite de uso",
    color: "bg-pink-500"
  },
  {
    icon: Pill,
    title: "Cobertura de Exames",
    description: "Exames laboratoriais e de imagem inclusos na cobertura",
    color: "bg-indigo-500"
  },
  {
    icon: Activity,
    title: "Telemedicina",
    description: "Consultas online disponíveis para maior comodidade",
    color: "bg-cyan-500"
  },
  {
    icon: Heart,
    title: "Preço Justo",
    description: "Valor acessível de R$ 235,09 por mês com qualidade garantida",
    color: "bg-red-500"
  }
];

export default function BeneficiosSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Por que escolher o Sagrada Família?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Um plano completo pensado especialmente para quem trabalha no setor de alimentação
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {beneficios.map((beneficio, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6">
                  <div className={`${beneficio.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <beneficio.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {beneficio.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {beneficio.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}