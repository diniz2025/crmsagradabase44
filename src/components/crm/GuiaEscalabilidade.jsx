import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Server, Database, Shield, Zap } from "lucide-react";

export default function GuiaEscalabilidade() {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
          <CardTitle className="flex items-center gap-2">
            <Server className="w-6 h-6 text-green-600" />
            Sistema Otimizado para 20.000+ Leads e 200+ Vendedores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-green-900 mb-2">✅ Otimizações Implementadas</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Queries filtradas no servidor:</strong> Cada vendedor busca apenas seus leads</li>
                  <li>• <strong>Paginação inteligente:</strong> 20 leads por página na tabela</li>
                  <li>• <strong>Cache de 30 segundos:</strong> Reduz requisições desnecessárias</li>
                  <li>• <strong>Auto-refresh a cada 60s:</strong> Dados sempre atualizados</li>
                  <li>• <strong>Controle de permissões robusto:</strong> Isolamento total entre corretoras</li>
                  <li>• <strong>Limite de 1000 leads por query:</strong> Performance garantida</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Recomendações para Escala
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Performance</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Use filtros antes de buscar</li>
                        <li>• Evite manter todas as abas abertas</li>
                        <li>• Feche leads antigos regularmente</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Segurança</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Vendedores veem só seus leads</li>
                        <li>• Supervisores veem só sua corretora</li>
                        <li>• Admins veem tudo</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">⚠️ Boas Práticas</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Distribua leads em lotes de até 100</strong> por vez</li>
                  <li>• <strong>Atualize status regularmente</strong> para liberar memória</li>
                  <li>• <strong>Use a busca</strong> ao invés de rolar a lista toda</li>
                  <li>• <strong>Exporte dados antigos</strong> e arquive fora do sistema</li>
                  <li>• <strong>Não delete em massa</strong> sem backups (somente admins)</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3">📊 Capacidade do Sistema</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-1">20.000+</div>
                  <div className="text-sm text-gray-600">Leads suportados</div>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-700 mb-1">200+</div>
                  <div className="text-sm text-gray-600">Vendedores simultâneos</div>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-purple-700 mb-1">100</div>
                  <div className="text-sm text-gray-600">Leads/lote distribuição</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3">🔧 Monitoramento</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• <strong>Velocidade de carregamento:</strong> Deve ser menor que 2 segundos</p>
              <p>• <strong>Timeout:</strong> Se ocorrer, reduza o período de busca usando filtros</p>
              <p>• <strong>Erros frequentes:</strong> Contate suporte com prints da tela</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}