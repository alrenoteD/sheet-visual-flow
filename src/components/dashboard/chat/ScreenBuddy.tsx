
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Zap, Heart, Coffee, Star } from 'lucide-react';

interface FloatingMessage {
  id: string;
  text: string;
  duration: number;
}

export const ScreenBuddy = () => {
  const [expression, setExpression] = useState<'idle' | 'happy' | 'thinking' | 'excited'>('idle');
  const [floatingMessage, setFloatingMessage] = useState<FloatingMessage | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const expressions = {
    idle: '😊',
    happy: '😄',
    thinking: '🤔', 
    excited: '🤖'
  };

  const randomMessages = [
    "Olá! Como posso ajudar? 👋",
    "Pronto para análises! 📊",
    "Vamos otimizar resultados? 🚀",
    "Dados interessantes aqui! 📈",
    "Que tal uma pergunta? 💡",
    "Análise em andamento... ⚡"
  ];

  const showFloatingMessage = (text: string, duration = 3000) => {
    const message: FloatingMessage = {
      id: Date.now().toString(),
      text,
      duration
    };
    
    setFloatingMessage(message);
    setTimeout(() => setFloatingMessage(null), duration);
  };

  const handleBuddyClick = () => {
    setExpression('excited');
    const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    showFloatingMessage(randomMsg);
    
    setTimeout(() => setExpression('idle'), 2000);
  };

  // Mensagens automáticas ocasionais
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1 && !floatingMessage) { // 10% chance a cada 30s
        const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        setExpression('thinking');
        showFloatingMessage(randomMsg, 2000);
        setTimeout(() => setExpression('idle'), 2500);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [floatingMessage]);

  // Animação de respiração sutil
  useEffect(() => {
    const breatheInterval = setInterval(() => {
      if (expression === 'idle') {
        setExpression('happy');
        setTimeout(() => setExpression('idle'), 200);
      }
    }, 8000);

    return () => clearInterval(breatheInterval);
  }, [expression]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Message */}
      {floatingMessage && (
        <div className="absolute bottom-16 right-0 mb-2 animate-fade-in">
          <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg max-w-48 text-sm relative">
            {floatingMessage.text}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary"></div>
          </div>
        </div>
      )}

      {/* Buddy Avatar */}
      <div className="relative">
        <Button
          onClick={handleBuddyClick}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-4 border-white dark:border-gray-800"
          size="lg"
        >
          <div className="relative">
            {/* Corpo do robô */}
            <div className="text-2xl transform transition-transform duration-200">
              {expressions[expression]}
            </div>
            
            {/* Gravata formal */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-red-500 rounded-sm opacity-80"></div>
            
            {/* Botões do peito */}
            <div className="absolute top-2 left-1 w-1 h-1 bg-yellow-400 rounded-full opacity-60"></div>
            <div className="absolute top-2 right-1 w-1 h-1 bg-green-400 rounded-full opacity-60"></div>
          </div>
        </Button>

        {/* Status Badge */}
        <Badge 
          variant="default" 
          className="absolute -top-2 -right-2 text-xs bg-green-500 hover:bg-green-600 cursor-pointer animate-pulse"
          onClick={() => showFloatingMessage("Online e pronto! 🤖")}
        >
          <Zap className="w-3 h-3 mr-1" />
          ON
        </Badge>

        {/* Minimize Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="absolute -top-8 -left-2 w-6 h-6 p-0 opacity-50 hover:opacity-100"
        >
          ✕
        </Button>
      </div>

      {/* Restore button when hidden */}
      {!isVisible && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 right-4 opacity-70 hover:opacity-100"
        >
          <Bot className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
