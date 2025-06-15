
# Configuração do Dashboard com Google Sheets via Variáveis de Ambiente

Este dashboard agora utiliza variáveis de ambiente para configuração, tornando-o mais seguro e adequado para deploy em produção.

## Configuração no EasyPanel

### Variáveis de Ambiente Necessárias

Configure as seguintes variáveis no EasyPanel:

```
VITE_GOOGLE_SHEETS_API_KEY=sua_api_key_google
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=id_da_sua_planilha
VITE_GOOGLE_SHEETS_RANGE=Dados!A1:AZ1000
VITE_CHATBOT_WEBHOOK_URL=https://seu-n8n.com/webhook/dashboard-chat
```

### Passo 1: Obter API Key do Google

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para "APIs e Serviços" > "Biblioteca"
4. Busque por "Google Sheets API" e ative
5. Vá para "APIs e Serviços" > "Credenciais"
6. Clique em "Criar credenciais" > "Chave de API"
7. Copie a chave gerada

### Passo 2: Preparar a Planilha

1. Faça download do arquivo `modelo-planilha.csv` disponível no projeto
2. Abra o Google Sheets (sheets.google.com)
3. Crie uma nova planilha
4. Importe o arquivo CSV ou configure manualmente com as colunas:

**Estrutura Obrigatória:**
- **A**: PROMOTOR/AGÊNCIA
- **B**: REDE  
- **C**: CIDADE
- **D**: MARCA
- **E**: VISITAS PRÉ-DEFINIDAS
- **F**: TELEFONE
- **G**: DATA INÍCIO
- **H**: VALOR CONTRATO
- **I-AZ**: DATA VISITA 1, DATA VISITA 2, etc.

### Passo 3: Configurar Permissões da Planilha

1. Na sua planilha, clique em "Compartilhar"
2. Altere para "Qualquer pessoa com o link pode visualizar"
3. Copie o ID da planilha da URL (parte entre `/spreadsheets/d/` e `/edit`)

### Passo 4: Configurar no EasyPanel

1. Acesse seu projeto no EasyPanel
2. Vá para "Environment Variables" ou "Variáveis de Ambiente"
3. Adicione as variáveis:

```
Nome: VITE_GOOGLE_SHEETS_API_KEY
Valor: [sua API key copiada do Google Cloud]

Nome: VITE_GOOGLE_SHEETS_SPREADSHEET_ID
Valor: [ID da planilha copiado da URL]

Nome: VITE_GOOGLE_SHEETS_RANGE
Valor: Dados!A1:AZ1000

Nome: VITE_CHATBOT_WEBHOOK_URL
Valor: [URL do webhook N8N - opcional]
```

4. Salve e reinicie a aplicação

## Funcionalidades Automáticas

### Cálculos Realizados pelo Dashboard:
- **Visitas Realizadas**: Conta automaticamente as datas preenchidas (colunas I-AZ)
- **Percentual**: Visitas realizadas ÷ Visitas pré-definidas × 100
- **Valor por Visita**: Valor contrato ÷ Visitas pré-definidas  
- **Valor Pago**: Visitas realizadas × Valor por visita

### KPIs Disponíveis:
- Total de visitas pré-definidas e realizadas
- Performance média da equipe
- Cumprimento mensal de metas
- Análise financeira (valores contratados vs pagos)
- Distribuição por cidades e promotores

### Gráficos e Análises:
- Performance individual por promotor
- Cumprimento mensal de metas
- Análise financeira detalhada
- Insights profissionais automáticos
- Chat inteligente com recomendações

## Exemplo de Dados na Planilha

| PROMOTOR/AGÊNCIA | REDE | CIDADE | MARCA | VISITAS PRÉ-DEFINIDAS | TELEFONE | DATA INÍCIO | VALOR CONTRATO | DATA VISITA 1 | DATA VISITA 2 |
|------------------|------|--------|-------|---------------------|----------|-------------|----------------|---------------|---------------|
| João Silva | Super ABC | São Paulo | Coca-Cola | 10 | (11) 99999-1234 | 2024-01-15 | 5000.00 | 2024-06-01 | 2024-06-08 |

**Resultado Automático:**
- Visitas Realizadas: 2
- Percentual: 20%
- Valor por Visita: R$ 500,00
- Valor Pago: R$ 1.000,00

## Status de Conexão

O dashboard mostrará:
- ✅ **Verde "Conectado"**: Tudo funcionando corretamente
- ⚠️ **Amarelo "Desconectado"**: Configurar variáveis de ambiente
- 📊 **Dados Vazios**: Aguardando conexão com planilha

## Assistente Inteligente

- **Com N8N**: Análises avançadas via webhook configurado
- **Modo Local**: Respostas básicas usando apenas dados do dashboard
- Configure `VITE_CHATBOT_WEBHOOK_URL` para habilitar integração completa

## Segurança

✅ **Vantagens da configuração via variáveis de ambiente:**
- API Keys não ficam expostas no código
- Configuração flexível por ambiente (dev/prod)
- Maior segurança em produção
- Facilita deploy e manutenção

## Solução de Problemas

### "Aguardando Conexão"
1. Verifique se as variáveis de ambiente foram salvas
2. Reinicie a aplicação no EasyPanel
3. Confirme se os valores estão corretos

### "Falha ao conectar"
1. Teste a API Key no Google Cloud Console
2. Verifique se a planilha está compartilhada publicamente
3. Confirme se o ID da planilha está correto

### Dados não aparecem
1. Verifique a estrutura da planilha (colunas A-H obrigatórias)
2. Confirme se há dados na planilha
3. Teste o range configurado (ex: Dados!A1:AZ1000)

Para suporte detalhado, consulte o arquivo `CONFIGURACAO_EASYPANEL.md`.
