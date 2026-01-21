import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Minimize2, Maximize2, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

/**
 * Chatbot de Atendimento - Plano de Saúde Sagrada Família
 * 
 * Funcionalidades:
 * - Responde perguntas frequentes sobre o plano
 * - Auxilia na busca de estabelecimentos credenciados
 * - Coleta dados de interessados (LGPD: dados mínimos necessários)
 * - Cria leads no sistema para follow-up comercial
 * 
 * Compliance LGPD:
 * - Dados coletados: nome completo, telefone (base legal: consentimento para contato comercial)
 * - Finalidade: contato comercial e atendimento
 * - Armazenamento: via entidade Lead com auditoria
 */
export default function ChatbotAtendimento() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mensagemInput, setMensagemInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll para última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  // Criar conversa ao abrir o chat
  useEffect(() => {
    if (isOpen && !conversationId) {
      iniciarConversa();
    }
  }, [isOpen]);

  // Subscrever a updates da conversa
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      setMensagens(data.messages || []);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [conversationId]);

  const iniciarConversa = async () => {
    try {
      // Criar nova conversa com o agente
      const conversation = await base44.agents.createConversation({
        agent_name: "chatbot_atendimento",
        metadata: {
          name: "Chat - Plano Sagrada Família",
          description: "Atendimento automático",
          source: "website"
        }
      });

      setConversationId(conversation.id);

      // Mensagem de boas-vindas
      await base44.agents.addMessage(conversation, {
        role: "assistant",
        content: "Olá! 👋 Bem-vindo ao atendimento do **Plano de Saúde Sagrada Família**.\n\nSou seu assistente virtual e estou aqui para ajudá-lo com:\n\n✅ Informações sobre o plano e valores\n✅ Busca de clínicas e hospitais credenciados\n✅ Agendamento de contato com nossos consultores\n\nComo posso te ajudar hoje?"
      });
    } catch (error) {
      console.error("Erro ao iniciar conversa:", error);
    }
  };

  const enviarMensagem = async () => {
    if (!mensagemInput.trim() || !conversationId) return;

    const mensagemTexto = mensagemInput.trim();
    setMensagemInput("");
    setIsLoading(true);

    try {
      // Buscar conversa atualizada
      const conversation = await base44.agents.getConversation(conversationId);
      
      // Adicionar mensagem do usuário
      await base44.agents.addMessage(conversation, {
        role: "user",
        content: mensagemTexto
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white rounded-full p-4 shadow-2xl hover:shadow-[#4DBABC]/50 transition-all duration-300 hover:scale-110 z-50 flex items-center gap-2 group"
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          Precisa de ajuda?
        </span>
      </button>
    );
  }

  return (
    <Card className={`fixed ${isMinimized ? 'bottom-6 right-6 w-80' : 'bottom-6 right-6 w-96'} shadow-2xl z-50 flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Atendimento Sagrada Família</h3>
            <p className="text-xs text-white/80">Online agora</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/10 rounded-full p-1 transition-colors"
            aria-label={isMinimized ? "Expandir" : "Minimizar"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/10 rounded-full p-1 transition-colors"
            aria-label="Fechar chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 max-h-96">
            {mensagens.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Digitando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white rounded-b-xl">
            <div className="flex gap-2">
              <Input
                value={mensagemInput}
                onChange={(e) => setMensagemInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={enviarMensagem}
                disabled={!mensagemInput.trim() || isLoading}
                className="bg-[#4DBABC] hover:bg-[#45B1B3]"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by IA • Dados protegidos pela LGPD
            </p>
          </div>
        </>
      )}
    </Card>
  );
}

/**
 * Componente de bolha de mensagem
 */
function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-[#4DBABC] text-white'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}
      >
        {isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <ReactMarkdown
            className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="ml-4 mb-2 list-disc">{children}</ul>,
              ol: ({ children }) => <ol className="ml-4 mb-2 list-decimal">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {children}
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}

        {/* Exibir tool calls se houver */}
        {message.tool_calls && message.tool_calls.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            {message.tool_calls.map((tool, idx) => (
              <div key={idx} className="text-xs text-gray-600">
                {tool.status === 'completed' && (
                  <span className="text-green-600">✓ {tool.name.split('.').pop()}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}