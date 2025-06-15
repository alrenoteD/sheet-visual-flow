
# Configuração de Variáveis de Ambiente no EasyPanel

Este documento explica como configurar as variáveis de ambiente necessárias para conectar o Dashboard com Google Sheets e o assistente inteligente via N8N.

## Variáveis Obrigatórias para Google Sheets

### 1. VITE_GOOGLE_SHEETS_API_KEY
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
- **Descrição**: ID da planilha Google Sheets
- **Como obter**:
  1. Abra sua planilha no Google Sheets
  2. Na URL, copie a parte entre `/spreadsheets/d/` e `/edit`
  3. Exemplo: Se a URL for `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
  4. O ID é: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### 3. VITE_GOOGLE_SHEETS_RANGE (Opcional)
- **Descrição**: Intervalo de células da planilha
- **Valor padrão**: `Dados!A1:AZ1000`
- **Exemplo**: `Dados!A1:AZ1000` ou `Planilha1!A1:Z500`

## Variáveis Opcionais para Assistente Inteligente

### 4. VITE_CHATBOT_WEBHOOK_URL
- **Descrição**: URL do webhook do N8N para o chatbot
- **Exemplo**: `https://seu-n8n.com/webhook/dashboard-chat`
- **Benefício**: Habilita o assistente inteligente com análises avançadas

## Como Configurar no EasyPanel

### Passo 1: Acessar as Configurações
1. Faça login no EasyPanel
2. Selecione seu projeto/aplicação
3. Vá para a seção "Environment" ou "Variáveis de Ambiente"

### Passo 2: Adicionar as Variáveis
Para cada variável, clique em "Add Variable" ou equivalente e adicione:

```
Nome: VITE_GOOGLE_SHEETS_API_KEY
Valor: sua_api_key_aqui

Nome: VITE_GOOGLE_SHEETS_SPREADSHEET_ID  
Valor: seu_spreadsheet_id_aqui

Nome: VITE_GOOGLE_SHEETS_RANGE
Valor: Dados!A1:AZ1000

Nome: VITE_CHATBOT_WEBHOOK_URL
Valor: https://seu-n8n.com/webhook/dashboard-chat
```

### Passo 3: Reiniciar a Aplicação
1. Salve as configurações
2. Reinicie/redeploy a aplicação para aplicar as mudanças

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

## Verificação da Configuração

Após configurar as variáveis e reiniciar a aplicação:

1. ✅ **Conectado**: Badge verde "Conectado" aparece no dashboard
2. ✅ **Dados Carregados**: KPIs e gráficos mostram dados da planilha
3. ✅ **Assistente Ativo**: Badge "N8N Conectado" no chat (se configurado)

## Solução de Problemas

### Erro: "Falha ao conectar com Google Sheets"
1. Verifique se a API Key está correta
2. Confirme se o Spreadsheet ID está correto
3. Verifique se a planilha está compartilhada publicamente
4. Confirme se a Google Sheets API está habilitada no Google Cloud

### Dashboard mostra "Aguardando Conexão"
1. Verifique se as variáveis de ambiente foram salvas corretamente
2. Certifique-se de que reiniciou a aplicação após adicionar as variáveis
3. Verifique se os nomes das variáveis estão corretos (incluindo o prefixo VITE_)

### Assistente não responde adequadamente
1. Verifique se VITE_CHATBOT_WEBHOOK_URL está configurada
2. Teste se o webhook do N8N está funcionando
3. Verifique os logs do N8N para erros

## Segurança

- **Nunca** compartilhe suas API Keys publicamente
- Use permissões mínimas necessárias na Google Cloud
- Configure rate limiting no N8N se necessário
- Monitore o uso das APIs para evitar custos excessivos

## Exemplo de Configuração Completa

```env
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyBOti4mM-6x9WDnZIjIeyYU24O6BZMxVis
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
VITE_GOOGLE_SHEETS_RANGE=Dados!A1:AZ1000
VITE_CHATBOT_WEBHOOK_URL=https://meu-n8n.com/webhook/dashboard-chat
```

Após a configuração correta, o dashboard se conectará automaticamente à sua planilha e exibirá todos os dados e funcionalidades disponíveis.
