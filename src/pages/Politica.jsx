import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, FileText, Scale } from "lucide-react";

export default function Politica() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Política Legal, Privacidade e Segurança
          </h1>
          <p className="text-xl text-gray-600">
            CRM SinHoRes Osasco — DCG Corretora de Seguros LTDA
          </p>
          <p className="text-sm text-gray-500 mt-2">Versão v1.0 | Janeiro/2026</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                1. Identificação e Responsáveis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 prose max-w-none">
              <p><strong>Controladora dos Dados / Responsável pelo CRM:</strong></p>
              <p>DCG Corretora de Seguros LTDA — CNPJ 16.383.565/0001-35<br/>
              Registro SUSEP (Empresa): 10.2010993.8<br/>
              Site institucional: www.dcgseguros.com.br</p>
              
              <p><strong>Encarregado (LGPD) / Contato DPO / Responsável Técnico:</strong></p>
              <p>Nadjair Diniz Barbosa ("Diniz") — SUSEP 10.0558257<br/>
              E-mail oficial de privacidade e suporte: diniz@dcgseguros.com.br</p>
              
              <p><strong>Localidade de referência:</strong> São Paulo/SP (Vila Leopoldina)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                2. Objetivo do CRM e Postura de Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 prose max-w-none">
              <p>O CRM SinHoRes Osasco existe para organizar o relacionamento com empresas e pessoas, suportar processos comerciais e operacionais, registrar interações, controlar documentos (propostas, apólices, comunicações) e apoiar a gestão com indicadores e auditoria, sempre com foco em:</p>
              <ul>
                <li><strong>LGPD</strong> (Lei 13.709/2018) — proteção de dados pessoais</li>
                <li>Boas práticas de segurança da informação</li>
                <li>Integridade e rastreabilidade (auditoria)</li>
                <li>Compliance setorial (operações de seguros e saúde suplementar)</li>
              </ul>
              <p>A DCG não comercializa dados pessoais e não utiliza dados sensíveis para finalidades incompatíveis com a legislação.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-purple-50">
              <CardTitle>3. Papéis na LGPD: Controlador e Operadores</CardTitle>
            </CardHeader>
            <CardContent className="p-6 prose max-w-none">
              <p>A DCG atua como <strong>CONTROLADORA</strong> quando define as finalidades e os meios do tratamento de dados no CRM.</p>
              <p>Prestadores de tecnologia e serviços (ex.: hospedagem, armazenamento, mensageria, assinatura eletrônica, ferramentas de automação) podem atuar como <strong>OPERADORES</strong>, tratando dados em nome da DCG, sob contratos, confidencialidade e exigências de segurança.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-amber-50">
              <CardTitle>4. Quais Dados Podem Ser Tratados</CardTitle>
            </CardHeader>
            <CardContent className="p-6 prose max-w-none">
              <h4>4.1 Dados cadastrais e de contato</h4>
              <p>Nome, e-mail, telefone, cargo, empresa, CNPJ/CPF, endereço comercial, área/departamento.</p>
              
              <h4>4.2 Dados corporativos e comerciais</h4>
              <p>Segmento, porte, número de vidas, necessidades de benefício, histórico de contato, status no funil, tarefas, agendas e observações.</p>
              
              <h4>4.3 Dados de proposta/apólice/contrato</h4>
              <p>Informações necessárias para cotação, proposta, apólice, vigência, coberturas, movimentações, renovações e registros de atendimento.</p>
              
              <h4>4.4 Dados sensíveis (saúde) — quando indispensáveis</h4>
              <p>Informações de saúde somente quando estritamente necessárias, com acesso restrito e controles reforçados.</p>
              
              <h4>4.5 Dados técnicos e de uso</h4>
              <p>Logs, registros de acesso, ações realizadas, data/hora, IP, dispositivo/navegador, trilha de auditoria, eventos de segurança.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle>5. Finalidades do Tratamento</CardTitle>
            </CardHeader>
            <CardContent className="p-6 prose max-w-none">
              <ul>
                <li>Cadastro e relacionamento com empresas e responsáveis</li>
                <li>Cotações, propostas e procedimentos preliminares</li>
                <li>Gestão de apólices, renovações e suporte</li>
                <li>Atendimento e comunicações operacionais</li>
                <li>Melhoria do serviço e padronização de processos</li>
                <li>Prevenção à fraude e segurança (logs, auditoria)</li>
                <li>Cumprimento de obrigações legais e regulatórias</li>
                <li>Defesa de direitos em demandas administrativas/judiciais</li>
                <li>Marketing e comunicações promocionais (quando permitido)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle>6. Bases Legais</CardTitle>
            </CardHeader>
            <CardContent className="p-6 prose max-w-none">
              <p>O tratamento pode se fundamentar em:</p>
              <ul>
                <li>Execução de contrato e procedimentos preliminares</li>
                <li>Obrigação legal/regulatória</li>
                <li>Legítimo interesse, com análise de balanceamento</li>
                <li>Exercício regular de direitos</li>
                <li>Consentimento (quando exigido)</li>
              </ul>
              <p>Para dados sensíveis, somente quando indispensáveis e conforme hipóteses legais aplicáveis.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                11. Segurança da Informação
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 prose max-w-none">
              <h4>Controles técnicos e administrativos:</h4>
              
              <p><strong>Controle de acesso:</strong></p>
              <ul>
                <li>Autenticação forte (MFA/2FA recomendado)</li>
                <li>RBAC (controle por função)</li>
                <li>Princípio do mínimo privilégio</li>
                <li>Gestão de sessões e bloqueio por tentativas suspeitas</li>
              </ul>
              
              <p><strong>Criptografia:</strong></p>
              <ul>
                <li>Criptografia em trânsito (TLS/HTTPS)</li>
                <li>Proteção de dados em repouso</li>
              </ul>
              
              <p><strong>Auditoria:</strong></p>
              <ul>
                <li>Trilhas de auditoria para ações críticas</li>
                <li>Registros de eventos e detecção de abuso</li>
                <li>Retenção de logs conforme governança</li>
              </ul>
              
              <p><strong>Backups e continuidade:</strong></p>
              <ul>
                <li>Backups periódicos e testes de restauração</li>
                <li>Estratégia de continuidade de negócios</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-orange-50">
              <CardTitle>10. Direitos do Titular</CardTitle>
            </CardHeader>
            <CardContent className="p-6 prose max-w-none">
              <p>O titular pode solicitar:</p>
              <ul>
                <li>Confirmação de tratamento e acesso aos dados</li>
                <li>Correção de dados incompletos ou inexatos</li>
                <li>Anonimização/eliminação (quando aplicável)</li>
                <li>Portabilidade dos dados</li>
                <li>Informação sobre compartilhamento</li>
                <li>Demais direitos previstos na LGPD</li>
              </ul>
              
              <p className="mt-4 p-4 bg-blue-100 rounded-lg">
                <strong>Canal oficial:</strong> diniz@dcgseguros.com.br
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-yellow-50">
              <CardTitle>13. Termos de Uso e Uso Aceitável</CardTitle>
            </CardHeader>
            <CardContent className="p-6 prose max-w-none">
              <h4>É PROIBIDO:</h4>
              <ul>
                <li>Compartilhar senhas, tokens ou acessos</li>
                <li>Burlar autenticação ou mecanismos de segurança</li>
                <li>Realizar scraping, automações não autorizadas ou força bruta</li>
                <li>Inserir conteúdo malicioso, fraudulento ou ilícito</li>
                <li>Copiar, clonar ou reproduzir sistema sem autorização</li>
                <li>Engenharia reversa ou extração de dados em massa</li>
              </ul>
              
              <p className="mt-4 text-red-600 font-semibold">
                Acessos poderão ser suspensos em caso de violação, abuso ou risco.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-indigo-50">
              <CardTitle>14. Inteligência Artificial (IA)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 prose max-w-none">
              <p>Este CRM pode utilizar IA para apoio operacional (ex.: sumarização, classificação de leads, insights).</p>
              
              <p className="p-4 bg-amber-100 rounded-lg mt-4">
                <strong>⚠️ A IA é apoio à decisão e NÃO substitui validação por profissional habilitado</strong> (jurídico, regulatório, contábil, médico ou outro), conforme a natureza do tema.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>15. Propriedade Intelectual</CardTitle>
            </CardHeader>
            <CardContent className="p-6 prose max-w-none">
              <p>Todo conteúdo, código, lógica, prompts, fluxos e sistemas vinculados a este CRM pertencem à DCG.</p>
              
              <p>Proteção conforme:</p>
              <ul>
                <li>Lei 9.609/98 (Software)</li>
                <li>Lei 9.610/98 (Direitos Autorais)</li>
              </ul>
              
              <p className="font-semibold text-red-600">
                É proibida cópia, clonagem, scraping, engenharia reversa e treinamento de IA com conteúdo proprietário sem autorização expressa.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Contato Oficial</h3>
              <p className="text-xl mb-2">diniz@dcgseguros.com.br</p>
              <p className="text-lg">www.dcgseguros.com.br</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}