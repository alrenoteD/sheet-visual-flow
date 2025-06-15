
# Configuração de Variáveis de Ambiente no EasyPanel

Este documento explica como configurar as variáveis de ambiente necessárias para conectar o Dashboard com Google Sheets e o assistente inteligente via webhook.

## ⚠️ Importante: Logs Detalhados

O dashboard agora inclui logs detalhados que identificam exatamente quais credenciais estão faltando:

- ✅ **Configurada**: Variável definida corretamente
- ❌ **Faltando**: Variável não configurada (obrigatória)
- ⚠️ **Opcional**: Variável não configurada (funcionalidade reduzida)

## Variáveis Obrigatórias para Google Sheets

### 1. VITE_GOOGLE_SHEETS_API_KEY
- **Status**: ❌ **OBRIGATÓRIA**
- **Descrição**: Chave da API do Google Sheets
- **Como obter**:
  1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
  2. Crie ou selecione um projeto
  3. Vá para "APIs e Serviços" > "Biblioteca"
  4. Busque e ative "Google Sheets API"
  5. Vá para "APIs e Serviços" > "Credenciais"
  6. Clique em "Criar credenciais" > "Chave de API"
  7. Copie a chave gerada

### 2. VITE_GOOGLE_SHEETS_SPREADSHEET_ID
- **Status**: ❌ **OBRIGATÓRIA**
- **Descrição**: ID da planilha Google Sheets
- **Como obter**:
  1. Abra sua planilha no Google Sheets
  2. Na URL, copie a parte entre `/spreadsheets/d/` e `/edit`
  3. Exemplo: Se a URL for `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
  4. O ID é: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Variáveis Opcionais

### 3. VITE_GOOGLE_SHEETS_RANGE
- **Status**: ⚠️ **OPCIONAL**
- **Descrição**: Intervalo de células da planilha
- **Valor padrão**: `Dados!A1:AZ1000`
- **Exemplo**: `Dados!A1:AZ1000` ou `Planilha1!A1:Z500`

### 4. VITE_CHATBOT_WEBHOOK_URL
- **Status**: ⚠️ **OPCIONAL** (mas recomendada)
- **Descrição**: URL do webhook para comunicação com chatbot
- **Exemplo**: `https://seu-n8n.com/webhook/dashboard-chat`
- **Benefício**: Habilita assistente inteligente com análises avançadas
- **Sem esta variável**: Chat funcionará em modo local básico

## Como Configurar no EasyPanel

### Passo 1: Acessar as Configurações
1. Faça login no EasyPanel
2. Selecione seu projeto/aplicação
3. Vá para a seção "Environment" ou "Variáveis de Ambiente"

### Passo 2: Adicionar as Variáveis
Para cada variável, clique em "Add Variable" ou equivalente e adicione:

```env
# OBRIGATÓRIAS
VITE_GOOGLE_SHEETS_API_KEY=sua_api_key_aqui
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=seu_spreadsheet_id_aqui

# OPCIONAIS
VITE_GOOGLE_SHEETS_RANGE=Dados!A1:AZ1000
VITE_CHATBOT_WEBHOOK_URL=https://seu-webhook.com/chat
```

### Passo 3: Reiniciar a Aplicação
1. Salve as configurações
2. Reinicie/redeploy a aplicação para aplicar as mudanças

## Verificação da Configuração

### No Console do Browser:
O dashboard registra automaticamente o status das configurações:

```
🔍 Verificando configurações do Google Sheets...
✅ VITE_GOOGLE_SHEETS_API_KEY configurada
✅ VITE_GOOGLE_SHEETS_SPREADSHEET_ID configurada
✅ VITE_GOOGLE_SHEETS_RANGE configurada
⚠️ VITE_CHATBOT_WEBHOOK_URL não configurada
🚀 Iniciando conexão com Google Sheets...
📊 Carregando dados da planilha...
📥 Resposta da API recebida: {...}
✅ Dados carregados com sucesso: 25 registros
```

### Na Interface:
1. ✅ **Conectado**: Badge verde "Conectado" aparece no dashboard
2. ✅ **Dados Carregados**: KPIs e gráficos mostram dados da planilha
3. ✅ **Assistente Ativo**: Badge "N8N Conectado" no chat (se webhook configurado)
4. ⚠️ **Modo Local**: Badge "Modo Local" no chat (sem webhook)

## Status das Credenciais na Interface

O componente de status mostra o estado de cada variável:

- 🟢 **Checkmark Verde**: Variável configurada
- 🔴 **X Vermelho**: Variável obrigatória faltando
- 🟡 **Triângulo Amarelo**: Variável opcional não configurada

## Estrutura da Planilha Google Sheets

Certifique-se de que sua planilha tenha a seguinte estrutura na aba "Dados":

| A | B | C | D | E | F | G | H | I | J | K | ... |
|---|---|---|---|---|---|---|---|---|---|---|-----|
| PROMOTOR/AGÊNCIA | REDE | CIDADE | MARCA | VISITAS PRÉ-DEFINIDAS | TELEFONE | DATA INÍCIO | VALOR CONTRATO | DATA VISITA 1 | DATA VISITA 2 | DATA VISITA 3 | ... |

## Permissões da Planilha

1. Abra sua planilha no Google Sheets
2. Clique em "Compartilhar" no canto superior direito
3. Altere para "Qualquer pessoa com o link pode visualizar"
4. Clique em "Concluído"

## Solução de Problemas

### ❌ Erro: "Falha ao conectar com Google Sheets"
**Verificar nos logs:**
```
❌ Erro ao carregar dados: Error: Erro ao carregar dados: 403 Forbidden
```

**Soluções:**
1. Verifique se a API Key está correta
2. Confirme se o Spreadsheet ID está correto
3. Verifique se a planilha está compartilhada publicamente
4. Confirme se a Google Sheets API está habilitada no Google Cloud

### ⏳ Dashboard mostra "Aguardando Conexão"
**Verificar nos logs:**
```
⚠️ VITE_GOOGLE_SHEETS_API_KEY não configurada
⚠️ VITE_GOOGLE_SHEETS_SPREADSHEET_ID não configurada
❌ Configuração incompleta - aguardando variáveis de ambiente
```

**Soluções:**
1. Verifique se as variáveis de ambiente foram salvas corretamente
2. Certifique-se de que reiniciou a aplicação após adicionar as variáveis
3. Verifique se os nomes das variáveis estão corretos (incluindo o prefixo VITE_)

### 🤖 Assistente não responde adequadamente
**Verificar nos logs:**
```
💭 Assistente funcionará em modo local (configure VITE_CHATBOT_WEBHOOK_URL para N8N)
```

**Soluções:**
1. Configure VITE_CHATBOT_WEBHOOK_URL se desejar assistente inteligente
2. Teste se o webhook está funcionando
3. Verifique os logs do serviço de webhook (N8N, Zapier, etc.)

## Exemplo de Configuração Completa

```env
# Configuração mínima (obrigatória)
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyBOti4mM-6x9WDnZIjIeyYU24O6BZMxVis
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms

# Configuração completa (recomendada)
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyBOti4mM-6x9WDnZIjIeyYU24O6BZMxVis
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
VITE_GOOGLE_SHEETS_RANGE=Dados!A1:AZ1000
VITE_CHATBOT_WEBHOOK_URL=https://meu-n8n.com/webhook/dashboard-chat
```

## Monitoramento e Logs

Para acompanhar o funcionamento:
1. Abra o Console do Browser (F12)
2. Vá para a aba "Console"
3. Recarregue a página
4. Acompanhe as mensagens de status

Após a configuração correta, o dashboard se conectará automaticamente à sua planilha e exibirá todos os dados e funcionalidades disponíveis.
