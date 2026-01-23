import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Heart, LayoutDashboard, Home, Shield } from "lucide-react";
import ModalAceiteTermos from "./components/ModalAceiteTermos";

export default function Layout({ children, currentPageName }) {
  const navItems = [
    { name: "Home", path: "Home", icon: Home },
    { name: "Produtos", path: "Produtos", icon: LayoutDashboard },
    { name: "Rede Credenciada", path: "RedeCredenciada", icon: Heart },
    { name: "Saúde e Bem-Estar", path: "Saude", icon: Heart },
    { name: "Blog", path: "Blog", icon: LayoutDashboard },
    { name: "CRM", path: "CRM", icon: LayoutDashboard },
    { name: "Privacidade", path: "Politica", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ModalAceiteTermos />
      <nav className="bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a 
              href="https://www.sinhoresosasco.com.br/" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691644e4652cae53371d6050/624688f81_LogoSinHoRes_2021_horizontal1.png" 
                alt="SinHoRes Osasco" 
                className="h-12"
              />
            </a>

            <div className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all text-sm ${
                    currentPageName === item.path
                      ? "bg-[#FF6B35] text-white font-semibold"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Menu Mobile */}
            <div className="md:hidden">
              <select
                value={currentPageName}
                onChange={(e) => window.location.href = createPageUrl(e.target.value)}
                className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm"
              >
                {navItems.map((item) => (
                  <option key={item.path} value={item.path} className="text-gray-900">
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm space-y-4">
            <p className="text-xs leading-relaxed max-w-4xl mx-auto">
              A DCG Corretora de Seguros LTDA (CNPJ 16.383.565/0001-35) trata dados pessoais conforme a LGPD (Lei 13.709/2018). Este sistema adota controles de segurança e proteção de dados.
            </p>
            <p className="text-xs">
              <strong>Contato:</strong> (11) 99410-4891 | diniz@dcgseguros.com.br | 
              <Link to={createPageUrl("Politica")} className="text-blue-400 hover:text-blue-300 ml-2">
                Política de Privacidade
              </Link>
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