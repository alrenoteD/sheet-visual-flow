
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Wifi, WifiOff } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VisitData } from '@/types/VisitData';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface MiniChatProps {
  data: VisitData[];
}

export const MiniChat = ({ data }: MiniChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou seu assistente de análise de dados. Como posso ajudá-lo hoje?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se as variáveis de ambiente do chatbot estão configuradas
  const chatbotWebhookUrl = import.meta.env.VITE_CHATBOT_WEBHOOK_URL;
  const isChatbotConfigured = !!chatbotWebhookUrl;

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let botResponse = '';

      if (isChatbotConfigured) {
        // Enviar para webhook do N8N
        const response = await fetch(chatbotWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: inputMessage,
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
        // Resposta local básica quando não há webhook configurado
        botResponse = getLocalResponse(inputMessage, data);
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
        text: 'Desculpe, ocorreu um erro. Configure a variável VITE_CHATBOT_WEBHOOK_URL para usar o assistente completo.',
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
      return `📊 A performance média da equipe é de ${avgPerformance.toFixed(1)}%. ${
        avgPerformance >= 80 ? 'Excelente desempenho!' : 
        avgPerformance >= 60 ? 'Bom desempenho, mas há espaço para melhorias.' :
        'Performance abaixo do esperado. Recomendo focar nos promotores com menor taxa de conclusão.'
      }`;
    }
    
    if (lowerMessage.includes('financeiro') || lowerMessage.includes('valor')) {
      const totalContrato = data.reduce((sum, item) => sum + item.valorContrato, 0);
      const totalPago = data.reduce((sum, item) => sum + item.valorPago, 0);
      const percentualPago = totalContrato > 0 ? (totalPago / totalContrato) * 100 : 0;
      return `💰 Total contratado: R$ ${totalContrato.toLocaleString('pt-BR')}\n💵 Total pago: R$ ${totalPago.toLocaleString('pt-BR')}\n📈 ${percentualPago.toFixed(1)}% dos contratos já foram executados.`;
    }
    
    return 'Para análises mais detalhadas, configure a integração com N8N através da variável VITE_CHATBOT_WEBHOOK_URL.';
  };

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Assistente Inteligente
          {isChatbotConfigured ? (
            <Badge variant="default" className="bg-blue-600">
              <Wifi className="w-3 h-3 mr-1" />
              N8N Conectado
            </Badge>
          ) : (
            <Badge variant="secondary">
              <WifiOff className="w-3 h-3 mr-1" />
              Modo Local
            </Badge>
          )}
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
                  <div className={`p-2 rounded-full ${message.isBot ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
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
                  <div className="p-2 rounded-full bg-primary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua pergunta..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
          />
          <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
