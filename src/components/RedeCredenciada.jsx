import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hospital, Search, MessageCircle, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const redeCredenciada = {
  osasco: [
    { nome: "Hospital e Maternidade Cruz Azul", tipo: "Hospital", endereco: "Av. dos Autonomistas, 1896 - Osasco", telefone: "(11) 3651-2000" },
    { nome: "Hospital Cruzeiro do Sul", tipo: "Hospital", endereco: "Rua Cristiano Viana, 505 - Osasco", telefone: "(11) 3677-2000" },
    { nome: "Hospital Santa Catarina", tipo: "Hospital", endereco: "Av. Paulista, 200 - Osasco", telefone: "(11) 3040-6000" },
    { nome: "Clínica São Camilo", tipo: "Clínica", endereco: "Av. Getúlio Vargas, 1950 - Osasco", telefone: "(11) 3682-5000" },
    { nome: "Laboratório Fleury Osasco", tipo: "Laboratório", endereco: "Av. dos Autonomistas, 4780 - Osasco", telefone: "(11) 3512-8000" },
    { nome: "Centro Médico ABC Osasco", tipo: "Clínica", endereco: "Rua Primitiva Vianco, 80 - Osasco", telefone: "(11) 3699-3000" },
    { nome: "Clínica Mais Vida", tipo: "Clínica", endereco: "Av. Presidente Kennedy, 567 - Osasco", telefone: "(11) 3681-4500" },
    { nome: "Pronto Socorro Municipal", tipo: "Pronto Socorro", endereco: "Av. das Nações Unidas, 1000 - Osasco", telefone: "(11) 3651-1234" },
    { nome: "Laboratório Sabin Osasco", tipo: "Laboratório", endereco: "Av. dos Autonomistas, 5555 - Osasco", telefone: "(11) 3685-9000" },
    { nome: "Hospital São Francisco", tipo: "Hospital", endereco: "Rua Rui Barbosa, 255 - Osasco", telefone: "(11) 3654-7000" },
    { nome: "Centro Médico Santa Helena", tipo: "Clínica", endereco: "Av. João Barreto de Menezes, 1000 - Osasco", telefone: "(11) 3683-2100" },
    { nome: "Clínica Integrada Vida Plena", tipo: "Clínica", endereco: "Rua Marechal Rondon, 789 - Osasco", telefone: "(11) 3688-5500" }
  ],
  barueri: [
    { nome: "Hospital Santa Marcelina Barueri", tipo: "Hospital", endereco: "Av. Henriqueta Mendes Guerra, 1000 - Barueri", telefone: "(11) 4198-0000" },
    { nome: "Hospital Assunção", tipo: "Hospital", endereco: "Av. Sebastião Davidade dos Santos, 343 - Barueri", telefone: "(11) 4198-8000" },
    { nome: "Clínica MedCenter Barueri", tipo: "Clínica", endereco: "Calçada das Margaridas, 163 - Barueri", telefone: "(11) 4191-3000" }
  ],
  carapicuiba: [
    { nome: "Hospital Geral de Carapicuíba", tipo: "Hospital", endereco: "Av. Deputado Emílio Carlos, 3100 - Carapicuíba", telefone: "(11) 4164-5300" },
    { nome: "UPA Carapicuíba", tipo: "Pronto Socorro", endereco: "Rua Américo Vespúcio, 625 - Carapicuíba", telefone: "(11) 4164-0700" },
    { nome: "Clínica Popular Carapicuíba", tipo: "Clínica", endereco: "Av. Inocêncio Seráfico, 5252 - Carapicuíba", telefone: "(11) 4183-6600" }
  ],
  saopaulo: [
    { nome: "Hospital Sírio-Libanês", tipo: "Hospital", endereco: "Rua Dona Adma Jafet, 91 - São Paulo", telefone: "(11) 3155-1000" },
    { nome: "Hospital Albert Einstein", tipo: "Hospital", endereco: "Av. Albert Einstein, 627 - São Paulo", telefone: "(11) 2151-1233" },
    { nome: "Hospital Oswaldo Cruz", tipo: "Hospital", endereco: "Rua Treze de Maio, 1815 - São Paulo", telefone: "(11) 3549-0000" },
    { nome: "Hospital Santa Catarina", tipo: "Hospital", endereco: "Av. Paulista, 200 - São Paulo", telefone: "(11) 3040-6000" },
    { nome: "Hospital São Luiz Itaim", tipo: "Hospital", endereco: "Rua Dr. Alceu de Campos Rodrigues, 95 - São Paulo", telefone: "(11) 3040-3000" },
    { nome: "Hospital Samaritano", tipo: "Hospital", endereco: "Rua Conselheiro Brotero, 1486 - São Paulo", telefone: "(11) 3821-5300" },
    { nome: "Hospital 9 de Julho", tipo: "Hospital", endereco: "Rua Peixoto Gomide, 625 - São Paulo", telefone: "(11) 3147-9000" },
    { nome: "Hospital Beneficência Portuguesa", tipo: "Hospital", endereco: "Rua Maestro Cardim, 769 - São Paulo", telefone: "(11) 3505-1000" },
    { nome: "Hospital Santa Paula", tipo: "Hospital", endereco: "Av. Santo Amaro, 2468 - São Paulo", telefone: "(11) 3040-8000" },
    { nome: "Laboratório Fleury Paulista", tipo: "Laboratório", endereco: "Av. Paulista, 1159 - São Paulo", telefone: "(11) 3179-0822" },
    { nome: "Laboratório Delboni Auriemo", tipo: "Laboratório", endereco: "Av. Brigadeiro Luís Antônio, 3684 - São Paulo", telefone: "(11) 3047-4000" },
    { nome: "Laboratório Sabin São Paulo", tipo: "Laboratório", endereco: "Av. Paulista, 2064 - São Paulo", telefone: "(11) 3170-9500" },
    { nome: "Centro Médico Paraíso", tipo: "Clínica", endereco: "Rua Vergueiro, 2949 - São Paulo", telefone: "(11) 5084-5000" },
    { nome: "Clínica Lavoisier", tipo: "Clínica", endereco: "Rua Cincinato Braga, 282 - São Paulo", telefone: "(11) 3145-3600" },
    { nome: "Hospital San Paolo", tipo: "Hospital", endereco: "Rua Napoleão de Barros, 715 - São Paulo", telefone: "(11) 5576-4000" }
  ]
};

export default function RedeCredenciada() {
  const [busca, setBusca] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("osasco");

  const todasRedes = Object.entries(redeCredenciada).flatMap(([cidade, unidades]) =>
    unidades.map(u => ({ ...u, cidade }))
  );

  const redesFiltradas = todasRedes.filter(unidade =>
    unidade.nome.toLowerCase().includes(busca.toLowerCase()) ||
    unidade.tipo.toLowerCase().includes(busca.toLowerCase()) ||
    unidade.cidade.toLowerCase().includes(busca.toLowerCase())
  );

  const getResumoTexto = (cidade) => {
    const redes = cidade === "saopaulo" 
      ? redeCredenciada.saopaulo 
      : [...(redeCredenciada.osasco || []), ...(redeCredenciada.barueri || []), ...(redeCredenciada.carapicuiba || [])];
    
    const hospitais = redes.filter(r => r.tipo === "Hospital");
    const clinicas = redes.filter(r => r.tipo === "Clínica");
    const laboratorios = redes.filter(r => r.tipo === "Laboratório");
    
    const titulo = cidade === "saopaulo" ? "SÃO PAULO" : "OSASCO E REGIÃO";
    
    return `🏥 REDE CREDENCIADA SAGRADA FAMÍLIA - ${titulo}

📍 HOSPITAIS (${hospitais.length}):
${hospitais.map((h, i) => `${i + 1}. ${h.nome}`).join('\n')}

🏥 CLÍNICAS E CENTROS MÉDICOS (${clinicas.length}):
${clinicas.map((c, i) => `${i + 1}. ${c.nome}`).join('\n')}

🔬 LABORATÓRIOS (${laboratorios.length}):
${laboratorios.map((l, i) => `${i + 1}. ${l.nome}`).join('\n')}

💙 Plano Sagrada Família - R$ 235,09/mês
Quer mais informações? Entre em contato!`;
  };

  const enviarWhatsApp = (cidade) => {
    const texto = getResumoTexto(cidade);
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  const enviarEmail = (cidade) => {
    const texto = getResumoTexto(cidade);
    const subject = `Rede Credenciada Sagrada Família - ${cidade === 'saopaulo' ? 'São Paulo' : 'Osasco e Região'}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(texto)}`;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Rede Credenciada Completa
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hospitais, clínicas e laboratórios de qualidade em Osasco, região e São Paulo
          </p>
        </motion.div>

        {/* Botões de compartilhamento */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
            <h3 className="font-bold text-lg mb-4 text-center">Enviar Rede Resumida</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Osasco e Região:</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => enviarWhatsApp('osasco')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={() => enviarEmail('osasco')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">São Paulo:</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => enviarWhatsApp('saopaulo')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={() => enviarEmail('saopaulo')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Busca */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por hospital, clínica ou laboratório..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Lista de Rede Credenciada */}
        <Card className="shadow-xl border-none">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Hospital className="w-7 h-7" />
              Unidades Credenciadas ({redesFiltradas.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="osasco" className="w-full">
              <div className="border-b px-6 pt-6">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="osasco">Osasco</TabsTrigger>
                  <TabsTrigger value="barueri">Barueri</TabsTrigger>
                  <TabsTrigger value="carapicuiba">Carapicuíba</TabsTrigger>
                  <TabsTrigger value="saopaulo">São Paulo</TabsTrigger>
                  <TabsTrigger value="todas">Todas</TabsTrigger>
                </TabsList>
              </div>

              {Object.entries(redeCredenciada).map(([cidade, unidades]) => (
                <TabsContent key={cidade} value={cidade} className="p-6">
                  <div className="grid gap-4">
                    {unidades
                      .filter(u => busca === "" || 
                        u.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        u.tipo.toLowerCase().includes(busca.toLowerCase())
                      )
                      .map((unidade, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                                    {unidade.nome}
                                  </h3>
                                  <div className="space-y-2 text-sm text-gray-600">
                                    <p className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4 text-blue-500" />
                                      {unidade.endereco}
                                    </p>
                                    {unidade.telefone && (
                                      <p className="flex items-center gap-2">
                                        <span className="text-blue-500">📞</span>
                                        <a href={`tel:${unidade.telefone}`} className="hover:text-blue-600">
                                          {unidade.telefone}
                                        </a>
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                  {unidade.tipo}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </TabsContent>
              ))}

              <TabsContent value="todas" className="p-6">
                <div className="grid gap-4">
                  {redesFiltradas.map((unidade, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-lg text-gray-900">
                                  {unidade.nome}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {unidade.cidade.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="space-y-2 text-sm text-gray-600">
                                <p className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-blue-500" />
                                  {unidade.endereco}
                                </p>
                                {unidade.telefone && (
                                  <p className="flex items-center gap-2">
                                    <span className="text-blue-500">📞</span>
                                    <a href={`tel:${unidade.telefone}`} className="hover:text-blue-600">
                                      {unidade.telefone}
                                    </a>
                                  </p>
                                )}
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              {unidade.tipo}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}