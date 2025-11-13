import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FormularioContato({ mostrar }) {
  const [formData, setFormData] = useState({
    nome_completo: "",
    telefone: "",
    email: "",
    tipo_estabelecimento: "",
    cidade: "Osasco",
    numero_funcionarios: "",
    observacoes: ""
  });

  const [enviado, setEnviado] = useState(false);

  const criarLeadMutation = useMutation({
    mutationFn: (data) => base44.entities.Lead.create(data),
    onSuccess: () => {
      setEnviado(true);
      setTimeout(() => {
        setFormData({
          nome_completo: "",
          telefone: "",
          email: "",
          tipo_estabelecimento: "",
          cidade: "Osasco",
          numero_funcionarios: "",
          observacoes: ""
        });
        setEnviado(false);
      }, 5000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    criarLeadMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="shadow-2xl border-none bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8">
          <CardTitle className="text-3xl font-bold mb-2">
            Solicite seu Plano de Saúde
          </CardTitle>
          <CardDescription className="text-blue-50 text-lg">
            Preencha o formulário e entraremos em contato em até 24 horas
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {enviado ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Solicitação Enviada!
                </h3>
                <p className="text-gray-600 text-lg">
                  Recebemos seu interesse. Nossa equipe entrará em contato em breve para apresentar as melhores opções para seu estabelecimento.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome_completo" className="text-gray-700 font-medium">
                      Nome Completo *
                    </Label>
                    <Input
                      id="nome_completo"
                      value={formData.nome_completo}
                      onChange={(e) => handleChange('nome_completo', e.target.value)}
                      placeholder="Seu nome completo"
                      required
                      className="h-12 border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-gray-700 font-medium">
                      Telefone *
                    </Label>
                    <Input
                      id="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => handleChange('telefone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                      className="h-12 border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="h-12 border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo_estabelecimento" className="text-gray-700 font-medium">
                      Tipo de Estabelecimento *
                    </Label>
                    <Select
                      value={formData.tipo_estabelecimento}
                      onValueChange={(value) => handleChange('tipo_estabelecimento', value)}
                      required
                    >
                      <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="restaurante">Restaurante</SelectItem>
                        <SelectItem value="lanchonete">Lanchonete</SelectItem>
                        <SelectItem value="cafeteria">Cafeteria</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cidade" className="text-gray-700 font-medium">
                      Cidade
                    </Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleChange('cidade', e.target.value)}
                      placeholder="Cidade"
                      className="h-12 border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numero_funcionarios" className="text-gray-700 font-medium">
                      Número de Funcionários
                    </Label>
                    <Select
                      value={formData.numero_funcionarios}
                      onValueChange={(value) => handleChange('numero_funcionarios', value)}
                    >
                      <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1 a 5</SelectItem>
                        <SelectItem value="6-10">6 a 10</SelectItem>
                        <SelectItem value="11-20">11 a 20</SelectItem>
                        <SelectItem value="21-50">21 a 50</SelectItem>
                        <SelectItem value="51+">Mais de 50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes" className="text-gray-700 font-medium">
                    Observações
                  </Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleChange('observacoes', e.target.value)}
                    placeholder="Conte-nos mais sobre suas necessidades..."
                    className="min-h-24 border-gray-300 focus:border-blue-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={criarLeadMutation.isPending}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {criarLeadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 w-5 h-5" />
                      Solicitar Contato
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-500">
                  * Campos obrigatórios
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}