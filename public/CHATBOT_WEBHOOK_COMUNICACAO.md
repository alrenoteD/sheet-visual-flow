
# Comunicação com Chatbot via Webhook - Formato de Entrada e Saída

## Visão Geral
Este documento detalha como o dashboard se comunica com o chatbot através de webhook, incluindo formatos de dados, variáveis de ambiente e exemplos práticos.

## Variável de Ambiente Necessária

### VITE_CHATBOT_WEBHOOK_URL
- **Descrição**: URL do webhook para comunicação com o chatbot (N8N, Zapier, etc.)
- **Formato**: `https://seu-servidor.com/webhook/dashboard-chat`
- **Obrigatória**: Não (funciona em modo local se não configurada)

## Formato de Entrada (Enviado para o Webhook)

Quando o usuário envia uma mensagem, o dashboard faz um POST para o webhook com o seguinte formato:

```json
{
  "message": "Como está a performance da equipe?",
  "dashboardData": {
    "totalVisitas": 150,
    "visitasRealizadas": 120,
    "performanceMedia": 75.5,
    "cumprimentoMensal": 85.2,
    "valorTotal": 50000,
    "valorPago": 35000,
    "promotores": [
      {
        "nome": "João Silva",
        "performance": 85.5,
        "cidade": "São Paulo",
        "marca": "Coca-Cola"
      },
      {
        "nome": "Maria Santos",
        "performance": 92.1,
        "cidade": "Rio de Janeiro", 
        "marca": "Pepsi"
      }
    ],
    "metadata": {
      "timestamp": "2024-06-15T10:30:00Z",
      "userQuestion": "Como está a performance da equipe?",
      "dashboardUrl": "https://meu-dashboard.com"
    }
  }
}
```

### Detalhamento dos Campos:

#### Campos Principais:
- `message`: Pergunta/mensagem do usuário
- `dashboardData`: Dados completos do dashboard para análise

#### Campos de `dashboardData`:
- `totalVisitas`: Total de visitas pré-definidas
- `visitasRealizadas`: Total de visitas já realizadas
- `performanceMedia`: Performance média da equipe (%)
- `cumprimentoMensal`: Cumprimento mensal calculado (%)
- `valorTotal`: Valor total dos contratos
- `valorPago`: Valor já pago/executado

#### Array `promotores`:
- `nome`: Nome do promotor/agência
- `performance`: Performance individual (%)
- `cidade`: Cidade de atuação
- `marca`: Marca que representa

## Formato de Saída (Resposta Esperada do Webhook)

O webhook deve retornar uma resposta JSON com o seguinte formato:

```json
{
  "response": "📊 A performance média da equipe está em 75.5%, o que é considerado **BOM**.\n\n**Destaques:**\n• Maria Santos: 92.1% (Rio de Janeiro - Pepsi)\n• João Silva: 85.5% (São Paulo - Coca-Cola)\n\n**Recomendações:**\n• Manter o ritmo atual para atingir a meta mensal\n• Focar em São Paulo para melhorar a performance\n• Considerar premiação para Maria Santos",
  "metadata": {
    "analysisType": "performance",
    "confidence": 0.95,
    "suggestedActions": [
      "focus_sao_paulo",
      "reward_top_performer",
      "maintain_current_pace"
    ]
  }
}
```

### Detalhamento da Resposta:

#### Campos Obrigatórios:
- `response`: Texto da resposta do chatbot (suporta Markdown)

#### Campos Opcionais em `metadata`:
- `analysisType`: Tipo de análise realizada
- `confidence`: Nível de confiança da resposta (0-1)
- `suggestedActions`: Array de ações sugeridas

## Implementação no Dashboard

### Código de Envio:
```typescript
const sendMessage = async () => {
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
        performanceMedia: data.length > 0 ? 
          data.reduce((sum, item) => sum + item.percentual, 0) / data.length : 0,
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
  
  const result = await response.json();
  return result.response;
};
```

## Exemplos de Perguntas e Respostas

### Exemplo 1: Análise de Performance
**Entrada:**
```json
{
  "message": "Como está o desempenho geral?",
  "dashboardData": { /* dados completos */ }
}
```

**Saída:**
```json
{
  "response": "📈 **Análise de Performance:**\n\n• Performance média: 75.5%\n• Status: **BOM** (acima de 70%)\n• Tendência: **ESTÁVEL**\n\n**Top 3 Promotores:**\n1. Maria Santos - 92.1%\n2. João Silva - 85.5%\n3. Pedro Costa - 78.2%\n\n💡 **Recomendação:** Manter o ritmo atual para superar a meta mensal."
}
```

### Exemplo 2: Análise Financeira
**Entrada:**
```json
{
  "message": "Qual a situação financeira?",
  "dashboardData": { /* dados completos */ }
}
```

**Saída:**
```json
{
  "response": "💰 **Análise Financeira:**\n\n• Valor Total: R$ 50.000,00\n• Valor Pago: R$ 35.000,00\n• Execução: **70%** dos contratos\n\n📊 **Status:** No prazo para atingir as metas financeiras mensais.\n\n🎯 **Próximos passos:** Focar nas visitas pendentes para maximizar o retorno."
}
```

## Configuração de Logs

O dashboard registra automaticamente:
```javascript
console.log('🤖 Enviando para webhook:', webhookUrl);
console.log('📤 Dados enviados:', requestData);
console.log('📥 Resposta recebida:', response);
```

## Tratamento de Erros

### Cenários de Erro:
1. **Webhook não configurado**: Usa resposta local básica
2. **Erro de rede**: Mostra mensagem de erro de conectividade
3. **Resposta inválida**: Solicita configuração correta do webhook

### Exemplo de Resposta de Erro:
```json
{
  "error": "Webhook não configurado corretamente",
  "response": "Desculpe, houve um problema na comunicação. Configure a variável VITE_CHATBOT_WEBHOOK_URL no EasyPanel."
}
```

## Testes e Validação

### Para testar a integração:
1. Configure a variável `VITE_CHATBOT_WEBHOOK_URL`
2. Reinicie a aplicação
3. Envie uma mensagem no chat
4. Verifique os logs do console
5. Confirme a resposta do webhook

### Webhook de Teste (Mockup):
```bash
curl -X POST https://seu-webhook.com/test \
  -H "Content-Type: application/json" \
  -d '{"message":"teste","dashboardData":{}}'
```

Este formato garante comunicação consistente e permite análises inteligentes dos dados do dashboard pelo chatbot.
