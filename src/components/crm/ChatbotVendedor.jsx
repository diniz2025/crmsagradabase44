import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, Loader2 } from "lucide-react";

export default function ChatbotVendedor() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Olá! Sou seu assistente especializado em seguros e planos de saúde. Como posso ajudar você hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const contexto = `
Você é um assistente especializado em seguros e planos de saúde para vendedores do SinHoRes Osasco.

PRODUTO PRINCIPAL - PLANO SAGRADA FAMÍLIA:
- Valor: R$ 235,09/mês
- Cobertura completa
- Sem carência para emergências
- Atendimento 24h/7 dias
- Rede credenciada em Osasco, Barueri, Carapicuíba e região
- Direcionado para empresas de bares, restaurantes e hospitalidade
- Conquista exclusiva do SinHoRes Osasco

INFORMAÇÕES SOBRE SEGUROS E PLANOS:
- Tipos de planos: Individual, Empresarial, PME
- Carências: Emergência (sem carência), Consultas (normalmente 30 dias), Internação (180 dias)
- Cobertura obrigatória ANS: consultas, exames, internações, partos, urgências
- Reajustes: Anuais conforme ANS
- Portabilidade: Direito após 2 anos de plano

OBJEÇÕES COMUNS E RESPOSTAS:
- "Muito caro": Enfatize o valor por vida, sem carência emergencial, cobertura completa
- "Já tenho plano": Fale sobre portabilidade, compare benefícios
- "Poucos funcionários": Plano ideal para PMEs, a partir de 1 vidas
- "Não preciso agora": Urgências não avisam, sem carência para emergências

DICAS DE VENDAS:
- Sempre pergunte sobre dor/necessidade atual
- Foque nos benefícios, não nas características
- Use histórias de sucesso
- Crie urgência (vagas limitadas, condições especiais)

Pergunta do vendedor: ${userMessage.content}

Responda de forma clara, objetiva e prática. Se for uma objeção, ensine como contornar. Se for técnica, explique de forma simples.
`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: contexto,
        add_context_from_internet: false
      });

      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao obter resposta:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="shadow-lg border-2 border-blue-200 h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          Assistente de Vendas - IA
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Tire dúvidas sobre seguros, planos de saúde e técnicas de venda
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4 flex-shrink-0">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua dúvida sobre seguros, planos ou vendas..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Exemplos: "Como responder à objeção de preço?", "Qual a carência de internação?", "Como funciona portabilidade?"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}