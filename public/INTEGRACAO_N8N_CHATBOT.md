
# Integração do Dashboard com Chatbot N8N

## Visão Geral
Este documento explica como integrar o chatbot do dashboard com N8N para criar um assistente inteligente capaz de analisar dados e fornecer insights profissionais.

## Configuração do N8N

### 1. Webhook de Entrada
Configure um webhook HTTP no N8N para receber mensagens do dashboard:

```
URL: https://seu-n8n.com/webhook/dashboard-chat
Método: POST
Headers: Content-Type: application/json
```

### 2. Estrutura de Dados Enviados
O dashboard enviará os seguintes dados para o N8N:

```json
{
  "message": "pergunta do usuário",
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
      }
    ]
  }
}
```

### 3. Fluxo de Trabalho N8N Recomendado

#### Nós Necessários:
1. **Webhook** - Receber dados do dashboard
2. **Code Node** - Processar e analisar dados
3. **OpenAI/Claude** - Gerar resposta inteligente
4. **HTTP Response** - Enviar resposta de volta

## System Prompt Recomendado

```
Você é um assistente especializado em análise de dados de vendas e performance de promotores.

CONTEXTO:
- Você tem acesso a dados em tempo real de um dashboard de controle de visitas
- Os dados incluem performance de promotores, cumprimento de metas, análise financeira
- Seu objetivo é fornecer insights acionáveis e recomendações práticas

DADOS DISPONÍVEIS:
- Total de visitas programadas vs realizadas
- Performance individual por promotor
- Cumprimento mensal de metas
- Análise financeira (valores contratados vs pagos)
- Distribuição geográfica e por marca

INSTRUÇÕES:
1. Seja conciso e direto
2. Use emojis para tornar as respostas mais visuais
3. Sempre forneça recomendações acionáveis
4. Baseie suas análises nos dados fornecidos
5. Use formatação markdown para melhor legibilidade
6. Inclua métricas específicas quando relevante

TIPOS DE ANÁLISE QUE VOCÊ PODE FAZER:
- Performance: Analisar eficiência individual e da equipe
- Financeiro: ROI, valores pendentes, projeções
- Cumprimento: Status das metas mensais
- Recomendações: Sugestões de melhoria baseadas nos dados
- Tendências: Identificar padrões nos dados

FORMATO DE RESPOSTA:
- Use bullet points para listas
- Destaque números importantes
- Termine sempre com uma recomendação clara
```

## Modelo de IA Recomendado

### Opção 1: OpenAI GPT-4 (Recomendado)
- **Modelo**: `gpt-4-turbo-preview`
- **Temperatura**: 0.3 (para respostas mais consistentes)
- **Max Tokens**: 1000
- **Top P**: 0.9

### Opção 2: Anthropic Claude
- **Modelo**: `claude-3-sonnet-20240229`
- **Temperatura**: 0.2
- **Max Tokens**: 1000

### Opção 3: Modelo Open Source (Alternativa)
- **Modelo**: `llama-2-70b-chat` via Hugging Face
- **Temperatura**: 0.3

## Exemplo de Fluxo N8N

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "dashboard-chat"
      }
    },
    {
      "name": "Process Data",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Processar dados do dashboard\nconst data = items[0].json;\nconst insights = {\n  performance: data.dashboardData.performanceMedia,\n  compliance: data.dashboardData.cumprimentoMensal,\n  financial: (data.dashboardData.valorPago / data.dashboardData.valorTotal) * 100\n};\n\nreturn [{ json: { ...data, insights } }];"
      }
    },
    {
      "name": "OpenAI",
      "type": "n8n-nodes-base.openAi",
      "parameters": {
        "model": "gpt-4-turbo-preview",
        "temperature": 0.3,
        "systemMessage": "Você é um assistente...",
        "userMessage": "{{ $json.message }}\n\nDados: {{ JSON.stringify($json.dashboardData) }}"
      }
    },
    {
      "name": "Respond",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "responseBody": "{{ JSON.stringify({ response: $json.choices[0].message.content }) }}"
      }
    }
  ]
}
```

## Configuração no Dashboard

Para conectar o dashboard ao N8N, adicione a URL do webhook nas configurações:

```typescript
const CHATBOT_WEBHOOK_URL = 'https://seu-n8n.com/webhook/dashboard-chat';
```

## Testes e Monitoramento

1. **Teste de Conectividade**: Verifique se o webhook responde
2. **Teste de Dados**: Envie dados de exemplo
3. **Teste de Resposta**: Valide a qualidade das respostas
4. **Monitoramento**: Configure logs no N8N para acompanhar o desempenho

## Custos Estimados

### OpenAI GPT-4:
- Aproximadamente $0.03 por 1K tokens de entrada
- Aproximadamente $0.06 por 1K tokens de saída
- Custo médio por interação: ~$0.05-0.15

### Claude:
- Aproximadamente $0.015 por 1K tokens de entrada
- Aproximadamente $0.075 por 1K tokens de saída
- Custo médio por interação: ~$0.03-0.10

## Segurança

1. **Autenticação**: Use API keys seguras
2. **Rate Limiting**: Configure limites de requisições
3. **Validação**: Valide dados de entrada
4. **Logs**: Mantenha logs de auditoria

## Suporte e Troubleshooting

- Verifique logs do N8N em caso de erro
- Monitore o uso da API do modelo de IA
- Configure alertas para falhas de conectividade
- Mantenha backup das configurações do workflow
