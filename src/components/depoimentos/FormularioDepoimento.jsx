import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Star, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FormularioDepoimento({ onClose }) {
  const [formData, setFormData] = useState({
    nome_cliente: "",
    empresa: "",
    cargo: "",
    produto: "",
    depoimento: "",
    avaliacao: 5
  });

  const [enviado, setEnviado] = useState(false);

  const enviarDepoimentoMutation = useMutation({
    mutationFn: async (data) => {
      // Status padrão: pendente (aguarda aprovação do admin)
      const depoimento = await base44.entities.Depoimento.create({
        ...data,
        status: "pendente"
      });
      
      // Notificar admin sobre novo depoimento
      await base44.integrations.Core.SendEmail({
        from_name: "Sistema de Depoimentos",
        to: "diniz@dcgseguros.com.br",
        subject: "Novo Depoimento Pendente de Aprovação",
        body: `
Novo depoimento recebido e aguardando aprovação:

Cliente: ${data.nome_cliente}
Empresa: ${data.empresa || 'Não informado'}
Produto: ${data.produto}
Avaliação: ${data.avaliacao} estrelas
Depoimento: ${data.depoimento}

Acesse o sistema para aprovar ou rejeitar.
        `.trim()
      });

      return depoimento;
    },
    onSuccess: () => {
      setEnviado(true);
      setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    enviarDepoimentoMutation.mutate(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const produtoLabels = {
    plano_saude_sagrada_familia: "Plano de Saúde Sagrada Família",
    odonto_group: "Odonto Group",
    telemedicina_infinity: "Telemedicina Infinity Doctors",
    seguro_empresarial_tokio: "Seguro Empresarial Tokio",
    seguro_cyber_akad: "Seguro Cyber Akad",
    outro: "Outro"
  };

  return (
    <Card className="shadow-2xl border-none bg-white">
      <CardHeader className="bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white p-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-8 h-8" />
          <div>
            <CardTitle className="text-2xl font-bold">
              Compartilhe sua Experiência
            </CardTitle>
            <CardDescription className="text-white/90 text-sm">
              Seu depoimento será analisado antes da publicação
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {enviado ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Depoimento Enviado!
              </h3>
              <p className="text-gray-600">
                Obrigado por compartilhar sua experiência. Seu depoimento será publicado após aprovação.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_cliente">Nome *</Label>
                  <Input
                    id="nome_cliente"
                    value={formData.nome_cliente}
                    onChange={(e) => handleChange('nome_cliente', e.target.value)}
                    placeholder="Seu nome"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input
                    id="empresa"
                    value={formData.empresa}
                    onChange={(e) => handleChange('empresa', e.target.value)}
                    placeholder="Nome do estabelecimento"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => handleChange('cargo', e.target.value)}
                    placeholder="Ex: Proprietário, Gerente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="produto">Produto/Serviço *</Label>
                  <Select
                    value={formData.produto}
                    onValueChange={(value) => handleChange('produto', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(produtoLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avaliacao">Avaliação *</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleChange('avaliacao', star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formData.avaliacao
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="depoimento">Seu Depoimento *</Label>
                <Textarea
                  id="depoimento"
                  value={formData.depoimento}
                  onChange={(e) => handleChange('depoimento', e.target.value)}
                  placeholder="Conte-nos sobre sua experiência com nossos produtos e serviços..."
                  className="min-h-32"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                {onClose && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={enviarDepoimentoMutation.isPending}
                  className="flex-1 bg-[#4DBABC] hover:bg-[#45B1B3]"
                >
                  {enviarDepoimentoMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Depoimento'
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}