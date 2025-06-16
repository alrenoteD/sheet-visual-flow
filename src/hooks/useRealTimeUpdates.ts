
import { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseRealTimeUpdatesProps {
  isConnected: boolean;
  loadData: () => void;
  currentMonth: string;
}

export const useRealTimeUpdates = ({ 
  isConnected, 
  loadData, 
  currentMonth
}: UseRealTimeUpdatesProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<Date | null>(null);

  // Get interval from environment variable (in minutes), default to 5 minutes
  const intervalMinutes = parseInt(import.meta.env.VITE_UPDATE_INTERVAL_MINUTES || '5', 10);
  const intervalMs = intervalMinutes * 60 * 1000; // Convert to milliseconds

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

    // Configurar intervalo de verificação usando o valor correto em milissegundos
    intervalRef.current = setInterval(checkForUpdates, intervalMs);

    console.log(`⏰ Atualização automática configurada para ${intervalMinutes} minutos`);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected, loadData, currentMonth, intervalMs, intervalMinutes]);

  const forceUpdate = () => {
    console.log('🔄 Atualização forçada solicitada');
    loadData();
    toast({
      title: "🔄 Atualizando...",
      description: "Sincronizando dados com a planilha",
      duration: 3000
    });
  };

  return { forceUpdate, intervalMinutes };
};
