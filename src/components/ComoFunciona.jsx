import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Phone, CheckCircle2, CreditCard } from "lucide-react";

const passos = [
  {
    numero: "01",
    icon: FileText,
    title: "Preencha o Formulário",
    description: "Informe seus dados e necessidades através do nosso formulário online",
    color: "from-blue-500 to-blue-600"
  },
  {
    numero: "02",
    icon: Phone,
    title: "Receba o Contato",
    description: "Nossa equipe entrará em contato em até 24 horas para apresentar as opções",
    color: "from-green-500 to-green-600"
  },
  {
    numero: "03",
    icon: CreditCard,
    title: "Escolha e Contrate",
    description: "Escolha a melhor opção e realize a contratação de forma simples e rápida",
    color: "from-amber-500 to-amber-600"
  },
  {
    numero: "04",
    icon: CheckCircle2,
    title: "Comece a Usar",
    description: "Receba seu cartão e comece a usar imediatamente seu plano de saúde",
    color: "from-purple-500 to-purple-600"
  }
];

export default function ComoFunciona() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Como Funciona?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Processo simples e rápido em apenas 4 passos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {passos.map((passo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              {index < passos.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent -ml-4" />
              )}
              
              <Card className="relative border-none shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden bg-white h-full">
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${passo.color}`} />
                
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex w-20 h-20 rounded-full bg-gradient-to-br ${passo.color} items-center justify-center mb-6 shadow-lg`}>
                    <passo.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="text-5xl font-bold text-gray-200 mb-4">
                    {passo.numero}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {passo.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {passo.description}
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