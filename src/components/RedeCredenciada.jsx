import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hospital, Search, MapPin, Phone, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const redeHospitalar = [
  {
    nome: "Hospital São Francisco - Unidade São Roque",
    endereco: "Av. Getúlio Vargas, 911 - São Roque - SP",
    cep: "18130-430",
    servicos: ["Hospital Geral", "P.S Adulto", "Consultas Ambulatoriais", "Exames Laboratoriais e Imagens"],
    mapsUrl: "https://goo.gl/maps/HospitalSaoFranciscoSaoRoque"
  },
  {
    nome: "Hospital São Francisco - Unidade Cotia",
    endereco: "Av. Prof. Manoel José Pedroso, 701 - Cotia - SP",
    cep: "06717-100",
    servicos: ["Hospital Geral", "P.S Adulto", "P.S Infantil", "Maternidade", "Consultas Ambulatoriais", "Exames Laboratoriais e Imagens"],
    mapsUrl: "https://goo.gl/maps/HospitalSaoFranciscoCotia"
  },
  {
    nome: "Hospital São Francisco - Unidade Osasco",
    endereco: "Rua Padre Damaso, 100 - Centro - Osasco - SP",
    cep: "06016-010",
    servicos: ["Hospital Geral", "P.S Adulto", "P.S Infantil", "Consultas Ambulatoriais", "Exames Laboratoriais e Imagens"],
    mapsUrl: "https://goo.gl/maps/HospitalSaoFranciscoOsasco"
  },
  {
    nome: "Hospital Sagrada Família - Unidade Vila Formosa Z/L",
    endereco: "Rua Arapoca, 128 - Vila Formosa - São Paulo - SP",
    cep: "03362-000",
    servicos: ["Hospital Geral", "P.S Adulto", "Consultas Ambulatoriais", "Exames Laboratoriais e Imagens"],
    mapsUrl: "https://goo.gl/maps/HospitalSagradaFamiliaVF"
  },
  {
    nome: "Hospital Sagrada Família Kids - Unidade Vila Formosa Z/L",
    endereco: "Rua Arapoca, 128 - Vila Formosa - São Paulo - SP",
    cep: "03362-000",
    servicos: ["Hospital Geral Infantil", "P.S Infantil", "Consultas Ambulatoriais", "Exames Laboratoriais e Imagens"],
    mapsUrl: "https://goo.gl/maps/HospitalSagradaFamiliaKids"
  },
  {
    nome: "Hospital Sagrada Família - Unidade Mauá",
    endereco: "Rua Vicente Aletto, 31 - Jd Anchieta - Mauá - SP",
    cep: "09360-540",
    servicos: ["Hospital Geral", "P.S Adulto", "Consultas Ambulatoriais", "Exames Laboratoriais e Imagens"],
    mapsUrl: "https://goo.gl/maps/HospitalSagradaFamiliaMaua"
  }
];

export default function RedeCredenciada() {
  const [busca, setBusca] = useState("");

  const hospitaisFiltrados = redeHospitalar.filter(hospital =>
    hospital.nome.toLowerCase().includes(busca.toLowerCase()) ||
    hospital.endereco.toLowerCase().includes(busca.toLowerCase()) ||
    hospital.servicos.some(s => s.toLowerCase().includes(busca.toLowerCase()))
  );

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
            Rede Hospitalar Referenciada
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hospitais de qualidade credenciados ao Plano Sagrada Família
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>📞 Contato: (11) 2424-9180</p>
            <p>📧 atendimento1@sagradafamiliasaude.com.br</p>
            <p>🌐 www.sagradafamiliasaude.com.br</p>
          </div>
        </motion.div>

        {/* Busca */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por hospital ou serviço..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-12 h-14 text-lg border-2 border-[#4DBABC] focus:border-[#FF6B35]"
            />
          </div>
        </div>

        {/* Lista de Hospitais */}
        <Card className="shadow-xl border-none mb-12">
          <CardHeader className="bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Hospital className="w-7 h-7" />
              Hospitais Sagrada Família ({hospitaisFiltrados.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6">
              {hospitaisFiltrados.map((hospital, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all border-l-4 border-l-[#FF6B35]">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-gray-900 mb-3">
                            {hospital.nome}
                          </h3>
                          <div className="space-y-2 text-sm text-gray-700">
                            <p className="flex items-start gap-2">
                              <MapPin className="w-5 h-5 text-[#4DBABC] flex-shrink-0 mt-0.5" />
                              <span>{hospital.endereco}<br/>CEP: {hospital.cep}</span>
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-[#4DBABC] text-white hover:bg-[#45B1B3] border-none">
                          Hospital
                        </Badge>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <p className="font-semibold text-gray-700 mb-2">Serviços Disponíveis:</p>
                        <div className="flex flex-wrap gap-2">
                          {hospital.servicos.map((servico, idx) => (
                            <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {servico}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <Button
                          onClick={() => window.open(hospital.mapsUrl, '_blank')}
                          className="bg-[#4DBABC] hover:bg-[#45B1B3] text-white"
                          size="sm"
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Ver no Mapa
                        </Button>
                        <Button
                          onClick={() => window.open(`tel:1124249180`, '_blank')}
                          variant="outline"
                          className="border-[#4DBABC] text-[#4DBABC] hover:bg-[#4DBABC] hover:text-white"
                          size="sm"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          (11) 2424-9180
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card className="bg-gradient-to-br from-[#4DBABC]/10 to-[#FF6B35]/10 border-2 border-[#4DBABC]">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Rede Credenciada Completa
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Além dos hospitais acima, o Plano Sagrada Família conta com uma ampla rede de clínicas, laboratórios e centros diagnósticos credenciados em diversas regiões.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => window.open('https://www.sagradafamiliasaude.com.br', '_blank')}
                className="bg-[#4DBABC] hover:bg-[#45B1B3] text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Acessar Rede Completa
              </Button>
              <Button
                onClick={() => window.open('tel:1124249180')}
                className="bg-[#FF6B35] hover:bg-[#E55A2A] text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                Fale Conosco
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-6">
              Para consultar a rede completa de clínicas e laboratórios por região, entre em contato conosco ou acesse nosso site oficial.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}