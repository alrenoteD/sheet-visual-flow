
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { VisitData } from '@/types/VisitData';

interface MiniChatProps {
  data: VisitData[];
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export const MiniChat = ({ data }: MiniChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Olá! Sou seu assistente de análise de dados. Posso te ajudar com insights sobre performance, recomendações de melhoria e análise dos dados. Como posso ajudar?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateInsightResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const totalVisitas = data.reduce((sum, item) => sum + item.visitasRealizadas, 0);
    const averagePerformance = data.reduce((sum, item) => sum + item.percentual, 0) / data.length;
    const underPerformers = data.filter(item => item.percentual < 50);
    const topPerformers = data.filter(item => item.percentual >= 80);

    if (lowerMessage.includes('performance') || lowerMessage.includes('desempenho')) {
      return `📊 **Análise de Performance:**\n\n• Performance média: ${averagePerformance.toFixed(1)}%\n• Total de visitas realizadas: ${totalVisitas}\n• ${topPerformers.length} promotor(es) com alta performance (≥80%)\n• ${underPerformers.length} promotor(es) precisam de atenção (<50%)\n\n💡 **Recomendação:** ${underPerformers.length > 0 ? 'Foque no treinamento dos promotores com baixa performance.' : 'Mantenha a estratégia atual, o time está performando bem!'}`;
    }

    if (lowerMessage.includes('melhoria') || lowerMessage.includes('melhorar')) {
      return `🚀 **Sugestões de Melhoria:**\n\n1. **Treinamento:** Capacite promotores com performance abaixo de 50%\n2. **Monitoramento:** Acompanhe diariamente o progresso\n3. **Incentivos:** Implemente sistema de bonificação\n4. **Suporte:** Forneça ferramentas adequadas\n\n📈 Isso pode aumentar a performance geral em até 25%!`;
    }

    if (lowerMessage.includes('financeiro') || lowerMessage.includes('pagamento')) {
      const totalContrato = data.reduce((sum, item) => sum + item.valorContrato, 0);
      const totalPago = data.reduce((sum, item) => sum + item.valorPago, 0);
      return `💰 **Resumo Financeiro:**\n\n• Total contratado: R$ ${totalContrato.toLocaleString('pt-BR')}\n• Já pago: R$ ${totalPago.toLocaleString('pt-BR')}\n• Pendente: R$ ${(totalContrato - totalPago).toLocaleString('pt-BR')}\n• Taxa de execução: ${((totalPago / totalContrato) * 100).toFixed(1)}%`;
    }

    if (lowerMessage.includes('meta') || lowerMessage.includes('objetivo')) {
      const currentDate = new Date();
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const daysPassed = currentDate.getDate();
      const totalPreDefinidas = data.reduce((sum, item) => sum + item.visitasPreDefinidas, 0);
      const expectedDaily = totalPreDefinidas / daysInMonth;
      const expectedSoFar = expectedDaily * daysPassed;
      const compliance = (totalVisitas / expectedSoFar) * 100;
      
      return `🎯 **Status da Meta Mensal:**\n\n• Esperado até hoje: ${Math.round(expectedSoFar)} visitas\n• Realizado: ${totalVisitas} visitas\n• Cumprimento: ${compliance.toFixed(1)}%\n• Ritmo diário necessário: ${Math.round(expectedDaily)} visitas\n\n${compliance >= 100 ? '🟢 Parabéns! Meta sendo superada!' : compliance >= 80 ? '🟡 No caminho certo, mantenha o ritmo!' : '🔴 Atenção! Acelere o ritmo para atingir a meta!'}`;
    }

    return `🤖 Posso te ajudar com:\n\n• **"performance"** - Análise de desempenho\n• **"melhoria"** - Sugestões de melhoria\n• **"financeiro"** - Resumo financeiro\n• **"meta"** - Status das metas\n\nO que você gostaria de saber?`;
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simular delay de resposta
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateInsightResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Assistente Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-80">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-primary' : 'bg-muted'
                  }`}>
                    {message.type === 'user' ? <User className="w-4 h-4 text-primary-foreground" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua pergunta..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
            />
            <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
