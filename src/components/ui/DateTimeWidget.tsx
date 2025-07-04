
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Eye, EyeOff } from 'lucide-react';

export const DateTimeWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSeconds, setShowSeconds] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} de ${month} de ${year}`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return showSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
  };

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="glass-effect border-white/20 bg-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/20"
      >
        <Eye className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Card className="glass-effect border-white/20 bg-white/10 backdrop-blur-md">
      <div className="p-4 text-center">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/80" />
            <span className="text-white/80 text-sm font-medium">Data e Hora</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white hover:bg-white/10 h-6 w-6 p-0"
          >
            <EyeOff className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="text-white text-lg font-bold mb-1">
          {formatTime(currentTime)}
        </div>
        
        <div className="text-white/70 text-xs mb-3">
          {formatDate(currentTime)}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSeconds(!showSeconds)}
          className="text-white/60 hover:text-white hover:bg-white/10 text-xs h-6"
        >
          {showSeconds ? 'Ocultar segundos' : 'Mostrar segundos'}
        </Button>
      </div>
    </Card>
  );
};
