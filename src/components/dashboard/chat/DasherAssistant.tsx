import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Wifi, WifiOff, TrendingUp, BarChart3, Users, MapPin, Star, Target, DollarSign, Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VisitData } from '@/types/VisitData';
import { ScreenBuddy } from './ScreenBuddy';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface DasherAssistantProps {
  data: VisitData[];
}

export const DasherAssistant = ({ data }: DasherAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Eu sou Dasher, seu assistente inteligente! 🤖\n\nPosso ajudá-lo com análises de dados, insights sobre performance e estratégias de melhoria. Como posso ajudá-lo hoje?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatbotWebhookUrl = import.meta.env.VITE_CHATBOT_WEBHOOK_URL;
  const isChatbotConfigured = !!chatbotWebhookUrl;

  const quickQuestions = [
    {
      icon: TrendingUp,
      text: "Como está a performance geral da equipe?",
      category: "Performance"
    },
    {
      icon: BarChart3,
      text: "Quais promotores precisam de atenção?",
      category: "Análise"
    },
    {
      icon: Target,
      text: "Dê sugestões para melhorar os resultados",
      category: "Estratégia"
    },
    {
      icon: Users,
      text: "Qual promotor tem melhor performance?",
      category: "Ranking"
    },
    {
      icon: MapPin,
      text: "Como está o desempenho por cidade?",
      category: "Geografia"
    },
    {
      icon: DollarSign,
      text: "Análise do retorno financeiro",
      category: "Financeiro"
    },
    {
      icon: Calendar,
      text: "Qual o melhor período de visitas?",
      category: "Temporal"
    },
    {
      icon: Star,
      text: "Identifique oportunidades de crescimento",
      category: "Crescimento"
    }
  ];

  const sendQuickMessage = (message: string) => {
    setInputMessage(message);
    sendMessage(message);
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let botResponse = '';

      if (isChatbotConfigured) {
        const response = await fetch(chatbotWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: text,
            dashboardData: {
              totalVisitas: data.reduce((sum, item) => sum + item.visitasPreDefinidas, 0),
              visitasRealizadas: data.reduce((sum, item) => sum + item.visitasRealizadas, 0),
              performanceMedia: data.length > 0 ? data.reduce((sum, item) => sum + item.percentual, 0) / data.length : 0,
              valorTotal: data.reduce((sum, item) => sum + item.valorContrato, 0),
              valorPago: data.reduce((sum, item) => sum + item.valorPago, 0),
              promotores: data.map(item => ({
                nome: item.promotor,
                performance: item.percentual,
                cidade: item.cidade,
                marca: item.marca
              }))
            }
          })
        });

        if (response.ok) {
          const result = await response.json();
          botResponse = result.response || 'Desculpe, não consegui processar sua solicitação.';
        } else {
          botResponse = 'Erro ao conectar com o assistente. Tente novamente.';
        }
      } else {
        botResponse = getLocalResponse(text, data);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro no chat:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro. Configure a variável VITE_CHATBOT_WEBHOOK_URL para usar recursos avançados.',
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalResponse = (message: string, data: VisitData[]): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('desempenho')) {
      const avgPerformance = data.length > 0 ? data.reduce((sum, item) => sum + item.percentual, 0) / data.length : 0;
      const topPerformers = data.filter(item => item.percentual >= 80).length;
      const lowPerformers = data.filter(item => item.percentual < 50).length;
      
      return `📊 **Análise de Performance:**\n\n• Performance média: ${avgPerformance.toFixed(1)}%\n• ${topPerformers} promotores com performance excelente (≥80%)\n• ${lowPerformers} promotores precisam de atenção (<50%)\n\n${
        avgPerformance >= 80 ? '🎉 Excelente desempenho geral!' : 
        avgPerformance >= 60 ? '⚠️ Performance boa, mas com espaço para melhorias.' :
        '🚨 Performance abaixo do esperado. Foque nos promotores com baixa taxa.'
      }`;
    }
    
    if (lowerMessage.includes('financeiro') || lowerMessage.includes('valor')) {
      const totalContrato = data.reduce((sum, item) => sum + item.valorContrato, 0);
      const totalPago = data.reduce((sum, item) => sum + item.valorPago, 0);
      const percentualPago = totalContrato > 0 ? (totalPago / totalContrato) * 100 : 0;
      
      return `💰 **Resumo Financeiro:**\n\n• Total contratado: R$ ${totalContrato.toLocaleString('pt-BR')}\n• Total pago: R$ ${totalPago.toLocaleString('pt-BR')}\n• Execução: ${percentualPago.toFixed(1)}% dos contratos\n• Pendente: R$ ${(totalContrato - totalPago).toLocaleString('pt-BR')}`;
    }

    if (lowerMessage.includes('sugest') || lowerMessage.includes('melhor') || lowerMessage.includes('estratég')) {
      const lowPerformers = data.filter(item => item.percentual < 60);
      return `🎯 **Sugestões de Melhoria:**\n\n${
        lowPerformers.length > 0 
          ? `• Focar em ${lowPerformers.length} promotores com baixa performance\n• Implementar treinamentos específicos\n• Revisar rotas e cronogramas\n• Aumentar acompanhamento semanal`
          : '• Manter estratégia atual - equipe performando bem!\n• Expandir para novas regiões\n• Aumentar número de visitas por promotor'
      }\n\n💡 Use os filtros temporais para análises mais específicas!`;
    }
    
    return `🤖 **Dasher aqui!**\n\nPara análises mais detalhadas, configure a integração com N8N através da variável VITE_CHATBOT_WEBHOOK_URL.\n\n**Comandos disponíveis:**\n• "performance" - análise geral\n• "financeiro" - resumo de valores\n• "sugestões" - dicas de melhoria\n\nOu use os botões de pergunta rápida! 🚀`;
  };

  return (
    <div className="space-y-4">
      {/* Screen Buddy */}
      <ScreenBuddy />

      {/* Guia do Assistente com tema escuro */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Bot className="w-5 h-5 text-blue-400" />
            Dasher (O Dashinho) - Seu Assistente Inteligente
            {isChatbotConfigured ? (
              <Badge variant="default" className="bg-blue-600">
                <Wifi className="w-3 h-3 mr-1" />
                N8N Ativo
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-600">
                <WifiOff className="w-3 h-3 mr-1" />
                Modo Local
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-3 text-gray-200">Perguntas Rápidas:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => sendQuickMessage(question.text)}
                  className="justify-start text-left h-auto p-3 bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200"
                  disabled={isLoading}
                >
                  <question.icon className="w-4 h-4 mr-2 text-blue-400" />
                  <div>
                    <div className="text-xs text-blue-400 font-medium">{question.category}</div>
                    <div className="text-xs">{question.text}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat */}
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Conversa com Dasher
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-64 w-full pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`p-2 rounded-full ${message.isBot ? 'bg-blue-600 text-white' : 'bg-muted'}`}>
                      {message.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.isBot 
                        ? 'bg-muted text-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="flex gap-2 max-w-[80%]">
                    <div className="p-2 rounded-full bg-blue-600 text-white">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua pergunta para Dasher..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
            />
            <Button onClick={() => sendMessage()} disabled={isLoading || !inputMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
