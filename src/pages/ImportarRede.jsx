import React from "react";
import ImportarRedeCompleta from "../components/rede/ImportarRedeCompleta";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";

/**
 * Página administrativa para importação da rede credenciada
 * 
 * Acesso: Apenas administradores
 * Finalidade: Carregar dados iniciais ou atualizar rede completa
 */
export default function ImportarRede() {
  const navigate = useNavigate();

  const handleComplete = () => {
    // Redirecionar para a página da rede credenciada após importação
    setTimeout(() => {
      window.location.href = createPageUrl("RedeCredenciada");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Importação da Rede Credenciada
          </h1>
          <p className="text-gray-600">
            Processo automatizado com inteligência artificial
          </p>
        </div>

        <ImportarRedeCompleta onComplete={handleComplete} />

        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Voltar
          </button>
        </div>
      </div>
    </div>
  );
}