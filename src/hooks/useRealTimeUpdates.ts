
import { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseRealTimeUpdatesProps {
  isConnected: boolean;
  loadData: () => void;
  currentMonth: string;
  intervalMinutes?: number;
}

export const useRealTimeUpdates = ({ 
  isConnected, 
  loadData, 
  currentMonth, 
  intervalMinutes = 15 
}: UseRealTimeUpdatesProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<Date | null>(null);

  useEffect(() => {
    if (!isConnected) return;

    const checkForUpdates = async () => {
      console.log('🔄 Verificando atualizações na planilha...');
      
      try {
        // Recarregar dados silenciosamente
        await loadData();
        
        const now = new Date();
        if (lastUpdateRef.current) {
          const timeDiff = now.getTime() - lastUpdateRef.current.getTime();
          const minutesDiff = Math.floor(timeDiff / (1000 * 60));
          
          if (minutesDiff >= intervalMinutes) {
            toast({
              title: "📊 Dados Atualizados",
              description: `Dashboard sincronizado - ${now.toLocaleTimeString('pt-BR')}`,
              duration: 3000
            });
          }
        }
        
        lastUpdateRef.current = now;
      } catch (error) {
        console.warn('⚠️ Erro na verificação automática:', error);
      }
    };

    // Verificação inicial
    checkForUpdates();

    // Configurar intervalo de verificação
    intervalRef.current = setInterval(checkForUpdates, intervalMinutes * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected, loadData, currentMonth, intervalMinutes]);

  const forceUpdate = () => {
    console.log('🔄 Atualização forçada solicitada');
    loadData();
    toast({
      title: "🔄 Atualizando...",
      description: "Sincronizando dados com a planilha",
      duration: 2000
    });
  };

  return { forceUpdate };
};
