import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, FileText, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

export default function ModalAceiteTermos() {
  const [mostrar, setMostrar] = useState(false);
  const [aceito, setAceito] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    verificarAceite();
  }, []);

  const verificarAceite = async () => {
    try {
      const user = await base44.auth.me();
      setUsuario(user);
      
      const aceites = await base44.entities.AceiteTermos.filter({
        usuario_email: user.email,
        versao_politica: "v1.0"
      });
      
      if (aceites.length === 0) {
        setMostrar(true);
      }
    } catch (error) {
      console.log("Usuário não autenticado ou erro ao verificar aceite");
    }
  };

  const registrarAceiteMutation = useMutation({
    mutationFn: async () => {
      const userAgent = navigator.userAgent;
      const aceiteData = {
        usuario_email: usuario.email,
        versao_politica: "v1.0",
        user_agent: userAgent,
        aceito_em: new Date().toISOString()
      };
      
      return base44.entities.AceiteTermos.create(aceiteData);
    },
    onSuccess: () => {
      setMostrar(false);
    },
  });

  const handleAceitar = () => {
    if (aceito) {
      registrarAceiteMutation.mutate();
    }
  };

  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8 rounded-t-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-2">
            Termos de Uso e Política de Privacidade
          </h2>
          <p className="text-center text-blue-100">
            CRM SinHoRes Osasco — DCG Corretora de Seguros
          </p>
        </div>

        <div className="p-8">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-6">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Aceite Obrigatório
            </h3>
            <div className="prose prose-sm max-w-none text-gray-700 space-y-3">
              <p>
                Ao acessar este CRM, você concorda com os <strong>Termos de Uso e Uso Aceitável</strong>, com a <strong>Política de Privacidade/LGPD</strong> e com as <strong>regras de Segurança</strong>.
              </p>
              
              <div className="bg-white p-4 rounded border border-blue-200 my-4">
                <p className="font-semibold text-red-600 mb-2">É PROIBIDO:</p>
                <ul className="space-y-1 text-sm">
                  <li>✗ Compartilhar credenciais ou burlar controles de segurança</li>
                  <li>✗ Fazer scraping/automação não autorizada</li>
                  <li>✗ Copiar/clonar o sistema ou praticar engenharia reversa</li>
                  <li>✗ Uso indevido de dados ou violação da LGPD</li>
                </ul>
              </div>

              <div className="bg-amber-50 p-4 rounded border border-amber-200">
                <p className="flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <strong>IA como apoio:</strong> O CRM pode usar IA para apoio à decisão, não substituindo validação profissional.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded border border-green-200">
                <p className="text-sm">
                  <strong>Proteção de dados:</strong> A DCG trata dados conforme LGPD (Lei 13.709/2018) com controles de segurança, criptografia, auditoria e acesso restrito.
                </p>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                <strong>Dúvidas e solicitações LGPD:</strong> diniz@dcgseguros.com.br
              </p>
            </div>
          </div>

          <div className="mb-6">
            <Link 
              to={createPageUrl("Politica")} 
              target="_blank"
              className="text-blue-600 hover:underline flex items-center gap-2 justify-center text-sm"
            >
              <FileText className="w-4 h-4" />
              Ler política completa (abre em nova aba)
            </Link>
          </div>

          <div className="flex items-start gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <Checkbox
              id="aceite"
              checked={aceito}
              onCheckedChange={setAceito}
              className="mt-1"
            />
            <label htmlFor="aceite" className="text-sm text-gray-700 cursor-pointer">
              Li e concordo com os <strong>Termos de Uso</strong>, <strong>Política de Privacidade</strong> e <strong>regras de Segurança</strong>. Estou ciente das proibições e responsabilidades.
            </label>
          </div>

          <Button
            onClick={handleAceitar}
            disabled={!aceito || registrarAceiteMutation.isPending}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-lg font-semibold"
          >
            {registrarAceiteMutation.isPending ? "Registrando..." : "Aceitar e Continuar"}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Este aceite será registrado com data/hora e versão da política (v1.0)
          </p>
        </div>
      </div>
    </div>
  );
}