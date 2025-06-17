
# Integração Completa N8N: Chatbot + TTS

## Visão Geral
Esta documentação cobre a integração completa do dashboard com N8N, incluindo chatbot inteligente e sistema Text-to-Speech (TTS).

## 1. Configuração do Chatbot N8N

### Webhook de Entrada - Chatbot
```
URL: https://seu-n8n.com/webhook/dashboard-chat
Método: POST
Headers: Content-Type: application/json
```

### Estrutura de Dados Enviados - Chatbot
```json
{
  "message": "pergunta do usuário",
  "dashboardData": {
    "totalVisitas": 150,
    "visitasRealizadas": 120,
    "performanceMedia": 75.5,
    "valorTotal": 50000,
    "valorPago": 35000,
    "promotores": [
      {
        "nome": "João Silva",
        "performance": 85.5,
        "cidade": "São Paulo",
        "marca": "Coca-Cola"
      }
    ]
  }
}
```

## 2. Configuração do TTS N8N

### Webhook de Entrada - TTS
```
URL: https://seu-n8n.com/webhook/dashboard-tts
Método: POST
Headers: Content-Type: application/json
```

### Estrutura de Dados Enviados - TTS
```json
{
  "text": "texto para converter em áudio",
  "messageId": "unique-message-id",
  "voice": "pt-BR",
  "speed": 1.0,
  "options": {
    "format": "mp3",
    "quality": "high"
  }
}
```

### Resposta Esperada - TTS
```json
{
  "audioUrl": "https://seu-storage.com/audio/message-id.mp3",
  "duration": 15.2,
  "format": "mp3",
  "status": "success"
}
```

## 3. Fluxos N8N Completos

### Fluxo Chatbot
```json
{
  "nodes": [
    {
      "name": "Webhook Chatbot",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "dashboard-chat"
      }
    },
    {
      "name": "Process Dashboard Data",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": `
          const data = items[0].json;
          const insights = {
            performance: data.dashboardData.performanceMedia,
            financial: (data.dashboardData.valorPago / data.dashboardData.valorTotal) * 100,
            topPromoters: data.dashboardData.promotores
              .sort((a, b) => b.performance - a.performance)
              .slice(0, 3)
          };
          return [{ json: { ...data, insights } }];
        `
      }
    },
    {
      "name": "OpenAI Chat",
      "type": "n8n-nodes-base.openAi",
      "parameters": {
        "model": "gpt-4-turbo-preview",
        "temperature": 0.3,
        "systemMessage": "Você é um assistente especializado em análise de dados de vendas...",
        "userMessage": "{{ $json.message }}\n\nDados: {{ JSON.stringify($json.dashboardData) }}"
      }
    },
    {
      "name": "Format Response",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": `
          const response = items[0].json.choices[0].message.content;
          return [{ 
            json: { 
              response: response,
              timestamp: new Date().toISOString(),
              processed: true
            } 
          }];
        `
      }
    },
    {
      "name": "Respond to Dashboard",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "responseBody": "{{ JSON.stringify($json) }}"
      }
    }
  ]
}
```

### Fluxo TTS
```json
{
  "nodes": [
    {
      "name": "Webhook TTS",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "dashboard-tts"
      }
    },
    {
      "name": "Clean Text",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": `
          const data = items[0].json;
          // Remove markdown e emojis para melhor TTS
          const cleanText = data.text
            .replace(/[*#_~]/g, '')
            .replace(/📊|📈|📉|💰|🎯|⚠️|✅|❌|🚀|💡/g, '')
            .replace(/\n+/g, '. ')
            .trim();
          
          return [{ 
            json: { 
              ...data, 
              cleanText: cleanText,
              textLength: cleanText.length
            } 
          }];
        `
      }
    },
    {
      "name": "Generate Audio",
      "type": "n8n-nodes-base.elevenlabs",
      "parameters": {
        "voice": "{{ $json.voice === 'pt-BR' ? 'Aria' : 'Brian' }}",
        "text": "{{ $json.cleanText }}",
        "model": "eleven_multilingual_v2",
        "speed": "{{ $json.speed || 1.0 }}"
      }
    },
    {
      "name": "Save to Storage",
      "type": "n8n-nodes-base.awsS3",
      "parameters": {
        "bucket": "your-audio-bucket",
        "key": "audio/{{ $json.messageId }}.mp3",
        "body": "{{ $binary.data }}",
        "contentType": "audio/mpeg"
      }
    },
    {
      "name": "Generate Public URL",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": `
          const messageId = items[0].json.messageId;
          const audioUrl = \`https://your-cdn.com/audio/\${messageId}.mp3\`;
          
          return [{ 
            json: { 
              audioUrl: audioUrl,
              duration: items[0].json.duration || 0,
              format: "mp3",
              status: "success",
              messageId: messageId
            } 
          }];
        `
      }
    },
    {
      "name": "Respond with Audio URL",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "responseBody": "{{ JSON.stringify($json) }}"
      }
    }
  ]
}
```

## 4. Alternativas para TTS

### Opção 1: ElevenLabs (Recomendado)
```javascript
// Configuração ElevenLabs
{
  "voice": "Aria", // Voz em português
  "model": "eleven_multilingual_v2",
  "stability": 0.5,
  "similarity_boost": 0.5
}
```

### Opção 2: Google Cloud TTS
```javascript
// Configuração Google TTS
{
  "languageCode": "pt-BR",
  "voice": {
    "name": "pt-BR-Wavenet-A"
  },
  "audioConfig": {
    "audioEncoding": "MP3"
  }
}
```

### Opção 3: Azure Cognitive Services
```javascript
// Configuração Azure TTS
{
  "voice": "pt-BR-FranciscaNeural",
  "rate": "0%",
  "pitch": "0%"
}
```

## 5. System Prompts Otimizados

### Chatbot System Prompt
```
Você é Dasher, um assistente especializado em análise de dados de vendas e performance de promotores.

CONTEXTO:
- Dashboard de controle de visitas de promotores
- Dados em tempo real de performance, financeiro e cumprimento de metas
- Objetivo: insights acionáveis e recomendações práticas

ESTILO DE RESPOSTA:
- Seja conciso e direto (máximo 200 palavras)
- Use emojis moderadamente para destacar pontos
- Formate em markdown simples
- Termine sempre com uma recomendação clara
- Evite jargões técnicos excessivos

ANÁLISES DISPONÍVEIS:
- Performance individual e de equipe
- ROI e análise financeira
- Cumprimento de metas mensais
- Tendências temporais
- Comparações geográficas e por marca

FORMATO PREFERIDO:
📊 **Título da Análise**

• Ponto principal 1
• Ponto principal 2
• Ponto principal 3

💡 **Recomendação:** [ação específica]
```

## 6. Configuração no Dashboard

### Variáveis de Ambiente
```env
# Chatbot
VITE_CHATBOT_WEBHOOK_URL=https://seu-n8n.com/webhook/dashboard-chat

# TTS
VITE_TTS_WEBHOOK_URL=https://seu-n8n.com/webhook/dashboard-tts
```

### Validação de Configuração
```javascript
// O dashboard valida automaticamente:
const isChatbotConfigured = !!import.meta.env.VITE_CHATBOT_WEBHOOK_URL;
const isTTSConfigured = !!import.meta.env.VITE_TTS_WEBHOOK_URL;

// Badges visuais indicam status:
// 🟢 N8N Ativo - Chatbot funcionando
// 🟢 TTS Ativo - Text-to-Speech funcionando
// 🔴 Modo Local - Apenas respostas básicas
```

## 7. Monitoramento e Logs

### Logs Essenciais - N8N
```javascript
// No fluxo chatbot
console.log('Dashboard Data Received:', {
  message: data.message,
  dataPoints: Object.keys(data.dashboardData).length,
  timestamp: new Date().toISOString()
});

// No fluxo TTS
console.log('TTS Request:', {
  messageId: data.messageId,
  textLength: data.text.length,
  voice: data.voice
});
```

### Métricas de Performance
- Tempo de resposta do chatbot: < 3 segundos
- Tempo de geração de áudio: < 10 segundos
- Taxa de sucesso: > 95%
- Tamanho médio de áudio: < 1MB

## 8. Custos Estimados Mensais

### ElevenLabs:
- 10.000 caracteres/mês: $1
- 120.000 caracteres/mês: $5
- 500.000 caracteres/mês: $22

### OpenAI GPT-4:
- 1.000 consultas/mês: ~$15-30
- 10.000 consultas/mês: ~$150-300

### Infraestrutura:
- Storage de áudio: ~$2-5/mês
- CDN para delivery: ~$1-3/mês

## 9. Troubleshooting

### Problemas Comuns - Chatbot:
- **Timeout**: Aumentar limite para 30s
- **Erro 429**: Implementar rate limiting
- **Resposta vazia**: Verificar system prompt

### Problemas Comuns - TTS:
- **Áudio não carrega**: Verificar CORS do storage
- **Qualidade baixa**: Ajustar configurações de voz
- **Latência alta**: Usar CDN próximo aos usuários

### Monitoramento Ativo:
```javascript
// Webhooks de saúde
GET /webhook/health/chatbot
GET /webhook/health/tts

// Resposta esperada:
{
  "status": "healthy",
  "latency": "250ms",
  "requests_24h": 1250
}
```

**Versão:** 2.0 | **TTS Support:** ✅ | **Última atualização:** Dezembro 2024
