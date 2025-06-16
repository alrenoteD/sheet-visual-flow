
import { useEffect } from 'react';
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

  // Webhook listener para refresh externo (N8N, etc.)
  useEffect(() => {
    if (!isConnected) return;

    const handleWebhookRefresh = (event: MessageEvent) => {
      // Escutar por mensagens de webhook para refresh
      if (event.data?.type === 'DASHBOARD_REFRESH') {
        console.log('🔄 Refresh solicitado via webhook externo');
        loadData();
        toast({
          title: "📊 Dados Atualizados",
          description: `Dashboard sincronizado via webhook - ${new Date().toLocaleTimeString('pt-BR')}`,
          duration: 3000
        });
      }
    };

    // Escutar por postMessage de outras janelas/iframes
    window.addEventListener('message', handleWebhookRefresh);

    // API endpoint para refresh via HTTP request
    const handleWebhookHTTP = async () => {
      try {
        // Verificar se existe uma flag no localStorage indicando refresh pendente
        const refreshFlag = localStorage.getItem('dashboard_refresh_pending');
        if (refreshFlag) {
          console.log('🔄 Refresh pendente detectado');
          localStorage.removeItem('dashboard_refresh_pending');
          await loadData();
          toast({
            title: "📊 Dados Atualizados",
            description: `Dashboard sincronizado - ${new Date().toLocaleTimeString('pt-BR')}`,
            duration: 3000
          });
        }
      } catch (error) {
        console.warn('⚠️ Erro na verificação de refresh webhook:', error);
      }
    };

    // Verificar flag de refresh a cada 5 segundos (apenas se houver flag)
    const checkInterval = setInterval(() => {
      if (localStorage.getItem('dashboard_refresh_pending')) {
        handleWebhookHTTP();
      }
    }, 5000);

    return () => {
      window.removeEventListener('message', handleWebhookRefresh);
      clearInterval(checkInterval);
    };
  }, [isConnected, loadData, currentMonth]);

  const forceUpdate = async () => {
    console.log('🔄 Atualização manual solicitada');
    await loadData();
    toast({
      title: "🔄 Atualizando...",
      description: "Sincronizando dados com a planilha",
      duration: 3000
    });
  };

  // Função para webhook externo sinalizar refresh
  const triggerRefreshWebhook = () => {
    localStorage.setItem('dashboard_refresh_pending', 'true');
    console.log('🔄 Flag de refresh webhook definida');
  };

  // Expor função global para webhook externo
  useEffect(() => {
    (window as any).triggerDashboardRefresh = triggerRefreshWebhook;
    
    return () => {
      delete (window as any).triggerDashboardRefresh;
    };
  }, []);

  return { forceUpdate };
};
