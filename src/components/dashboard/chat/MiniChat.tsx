import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Wifi, WifiOff, X, Maximize2, Minimize2 } from 'lucide-react';
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
      text: 'Olá! Como posso ajudar com os dados?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12 shadow-lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className={`transition-all duration-300 ${isExpanded ? 'w-96 h-96' : 'w-80 h-64'} shadow-xl`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <MessageCircle className="w-4 h-4" />
            Chat Rápido
            {isChatbotConfigured ? (
              <Badge variant="default" className="bg-blue-600 text-xs">
                <Wifi className="w-3 h-3 mr-1" />
                Online
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                <WifiOff className="w-3 h-3 mr-1" />
                Local
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex flex-col h-full">
        <ScrollArea className={`flex-1 pr-2 ${isExpanded ? 'h-64' : 'h-32'}`}>
          <div className="space-y-2">
            {messages.slice(-5).map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`p-1 rounded-full ${message.isBot ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {message.isBot ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  </div>
                  <div className={`p-2 rounded-lg text-xs ${
                    message.isBot 
                      ? 'bg-muted text-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    <p className="whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="flex gap-2 max-w-[80%]">
                  <div className="p-1 rounded-full bg-primary text-primary-foreground">
                    <Bot className="w-3 h-3" />
                  </div>
                  <div className="p-2 rounded-lg bg-muted">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-1">
          <Input
            placeholder="Digite sua pergunta..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
            className="text-xs"
          />
          <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()} size="sm">
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
