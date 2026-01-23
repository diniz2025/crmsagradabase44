import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Star, Quote, MessageSquarePlus } from "lucide-react";
import { motion } from "framer-motion";
import FormularioDepoimento from "./FormularioDepoimento";

export default function DepoimentosSection() {
  const [modalAberto, setModalAberto] = useState(false);

  // Buscar apenas depoimentos aprovados
  const { data: depoimentos = [], isLoading } = useQuery({
    queryKey: ['depoimentos-aprovados'],
    queryFn: () => base44.entities.Depoimento.filter(
      { status: 'aprovado' }, 
      '-created_date', 
      20
    ),
  });

  // Depoimentos em destaque aparecem primeiro
  const depoimentosOrdenados = [...depoimentos].sort((a, b) => {
    if (a.destaque && !b.destaque) return -1;
    if (!a.destaque && b.destaque) return 1;
    return 0;
  });

  const produtoLabels = {
    plano_saude_sagrada_familia: "Plano de Saúde Sagrada Família",
    odonto_group: "Odonto Group",
    telemedicina_infinity: "Telemedicina Infinity Doctors",
    seguro_empresarial_tokio: "Seguro Empresarial Tokio",
    seguro_cyber_akad: "Seguro Cyber Akad",
    outro: "Outro"
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">Carregando depoimentos...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O Que Nossos Clientes Dizem
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Histórias reais de empresas que confiam em nossos serviços
            </p>
          </motion.div>
        </div>

        {depoimentosOrdenados.length === 0 ? (
          <div className="text-center py-12">
            <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-6">
              Seja o primeiro a compartilhar sua experiência!
            </p>
            <Dialog open={modalAberto} onOpenChange={setModalAberto}>
              <DialogTrigger asChild>
                <Button className="bg-[#4DBABC] hover:bg-[#45B1B3]">
                  <MessageSquarePlus className="w-4 h-4 mr-2" />
                  Enviar Depoimento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <FormularioDepoimento onClose={() => setModalAberto(false)} />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {depoimentosOrdenados.slice(0, 6).map((depoimento, index) => (
                <motion.div
                  key={depoimento.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`h-full hover:shadow-xl transition-all duration-300 ${
                    depoimento.destaque ? 'border-2 border-[#4DBABC]' : ''
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Quote className="w-8 h-8 text-[#4DBABC] opacity-50" />
                        <div className="flex gap-1">
                          {Array.from({ length: depoimento.avaliacao }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 italic">
                        "{depoimento.depoimento}"
                      </p>

                      <div className="border-t pt-4">
                        <p className="font-semibold text-gray-900">
                          {depoimento.nome_cliente}
                        </p>
                        {depoimento.cargo && depoimento.empresa && (
                          <p className="text-sm text-gray-600">
                            {depoimento.cargo} - {depoimento.empresa}
                          </p>
                        )}
                        {depoimento.empresa && !depoimento.cargo && (
                          <p className="text-sm text-gray-600">{depoimento.empresa}</p>
                        )}
                        {depoimento.cargo && !depoimento.empresa && (
                          <p className="text-sm text-gray-600">{depoimento.cargo}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {produtoLabels[depoimento.produto] || depoimento.produto}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Dialog open={modalAberto} onOpenChange={setModalAberto}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-[#4DBABC] hover:bg-[#45B1B3]">
                    <MessageSquarePlus className="w-5 h-5 mr-2" />
                    Compartilhar Minha Experiência
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <FormularioDepoimento onClose={() => setModalAberto(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </div>
    </section>
  );
}