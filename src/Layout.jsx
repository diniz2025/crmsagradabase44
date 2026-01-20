import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Heart, LayoutDashboard, Home, Shield } from "lucide-react";
import ModalAceiteTermos from "./components/ModalAceiteTermos";

export default function Layout({ children, currentPageName }) {
  const navItems = [
    { name: "Home", path: "Home", icon: Home },
    { name: "CRM", path: "CRM", icon: LayoutDashboard },
    { name: "Privacidade", path: "Politica", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ModalAceiteTermos />
      <nav className="bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691644e4652cae53371d6050/624688f81_LogoSinHoRes_2021_horizontal1.png" 
                alt="SinHoRes Osasco" 
                className="h-12"
              />
            </Link>

            <div className="flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    currentPageName === item.path
                      ? "bg-[#FF6B35] text-white font-semibold"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm space-y-4">
            <p className="text-xs leading-relaxed max-w-4xl mx-auto">
              A DCG Corretora de Seguros LTDA (CNPJ 16.383.565/0001-35) trata dados pessoais conforme a LGPD (Lei 13.709/2018), com foco em finalidade, necessidade, transparência e segurança. Este CRM adota controles como autenticação forte (recomendado MFA), perfis de acesso (RBAC), trilhas de auditoria, criptografia em trânsito (TLS/HTTPS), backups e monitoramento. Dados sensíveis de saúde são tratados apenas quando indispensáveis e com base legal aplicável.
            </p>
            <p className="text-xs">
              <strong>Direitos do titular:</strong> diniz@dcgseguros.com.br | 
              <Link to={createPageUrl("Politica")} className="text-blue-400 hover:text-blue-300 ml-2">
                Política Completa
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              Este sistema pode usar IA como apoio à decisão e não substitui validação por profissional habilitado. Conteúdo e sistema protegidos por direitos autorais; proibidos scraping, cópia e engenharia reversa.
            </p>
            <div className="border-t border-gray-800 pt-4 mt-4">
              <p className="text-xs">&copy; 2026 DCG Corretora de Seguros LTDA. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}