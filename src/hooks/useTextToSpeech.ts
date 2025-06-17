
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface AudioCache {
  [messageId: string]: string; // URL do blob de áudio
}

export const useTextToSpeech = () => {
  const [audioCache, setAudioCache] = useState<AudioCache>({});
  const [loadingAudio, setLoadingAudio] = useState<{ [messageId: string]: boolean }>({});

  const ttsWebhookUrl = import.meta.env.VITE_TTS_WEBHOOK_URL;

  const generateAudio = async (messageId: string, text: string) => {
    if (!ttsWebhookUrl) {
      toast({
        title: "TTS não configurado",
        description: "Configure VITE_TTS_WEBHOOK_URL para usar Text-to-Speech",
        variant: "destructive"
      });
      return;
    }

    // Se já existe áudio em cache, reproduzir
    if (audioCache[messageId]) {
      playAudio(audioCache[messageId]);
      return;
    }

    setLoadingAudio(prev => ({ ...prev, [messageId]: true }));

    try {
      const response = await fetch(ttsWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          messageId: messageId,
          voice: 'pt-BR', // ou configurável
          speed: 1.0
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar áudio');
      }

      const result = await response.json();
      
      if (result.audioUrl) {
        // Cache do áudio
        setAudioCache(prev => ({
          ...prev,
          [messageId]: result.audioUrl
        }));
        
        // Reproduzir áudio
        playAudio(result.audioUrl);
      } else {
        throw new Error('URL de áudio não recebida');
      }
      
    } catch (error) {
      console.error('Erro ao gerar áudio:', error);
      toast({
        title: "Erro no TTS",
        description: "Falha ao gerar áudio. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoadingAudio(prev => ({ ...prev, [messageId]: false }));
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error('Erro ao reproduzir áudio:', error);
      toast({
        title: "Erro de Reprodução",
        description: "Falha ao reproduzir áudio",
        variant: "destructive"
      });
    });
  };

  const clearCache = () => {
    setAudioCache({});
    setLoadingAudio({});
  };

  const isLoading = (messageId: string) => loadingAudio[messageId] || false;
  const hasAudio = (messageId: string) => !!audioCache[messageId];

  return {
    generateAudio,
    clearCache,
    isLoading,
    hasAudio,
    isTTSConfigured: !!ttsWebhookUrl
  };
};
