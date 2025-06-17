
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Volume2, VolumeX } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface DasherAssistantProps {
  data: any[];
}

export const DasherAssistant = ({ data }: DasherAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o Dasher, seu assistente de análise de dados. Como posso ajudá-lo hoje?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { generateAudio, isLoading: ttsLoading, hasAudio, isTTSConfigured } = useTextToSpeech();

  useEffect(() => {
    const savedWebhookUrl = localStorage.getItem('chatbot-webhook-url');
    if (savedWebhookUrl) {
      setWebhookUrl(savedWebhookUrl);
    }
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleWebhookSubmit = () => {
    localStorage.setItem('chatbot-webhook-url', webhookUrl);
    toast({
      title: "Webhook Configurado",
      description: "URL do webhook salva com sucesso!"
    });
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!webhookUrl) {
      toast({
        title: "Webhook não configurado",
        description: "Configure a URL do webhook do N8N primeiro.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          data: data,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na comunicação com o chatbot');
      }

      const result = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.response || 'Desculpe, não consegui processar sua solicitação.',
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Verifique a configuração do webhook.',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTTSClick = (messageId: string, text: string) => {
    generateAudio(messageId, text);
  };

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Dasher - Assistente IA
        </CardTitle>
        
        {!webhookUrl && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-2">
              Configure o webhook do N8N para usar o chatbot:
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="URL do webhook do N8N..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleWebhookSubmit} size="sm">
                Salvar
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    
                    {message.isBot && isTTSConfigured && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 shrink-0"
                        onClick={() => handleTTSClick(message.id, message.text)}
                        disabled={ttsLoading(message.id)}
                        title="Ouvir mensagem"
                      >
                        {ttsLoading(message.id) ? (
                          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        ) : hasAudio(message.id) ? (
                          <Volume2 className="w-3 h-3" />
                        ) : (
                          <VolumeX className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground max-w-[80%] p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
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
              placeholder="Digite sua mensagem..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || !webhookUrl}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputValue.trim() || !webhookUrl}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {webhookUrl && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Webhook configurado
              </Badge>
              {!isTTSConfigured && (
                <Badge variant="secondary" className="text-xs">
                  TTS: Configure VITE_TTS_WEBHOOK_URL
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
};
