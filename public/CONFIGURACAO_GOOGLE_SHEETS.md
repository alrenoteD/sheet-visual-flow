
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

### Passo 2: Configurar Planilha com Páginas Mensais

#### **IMPORTANTE: Estrutura de Páginas por Mês**

O dashboard agora trabalha com **páginas separadas para cada mês**. Cada página deve seguir o formato `YYYY-MM`:

**Exemplos de nomes de páginas:**
- `2024-01` (Janeiro 2024)
- `2024-02` (Fevereiro 2024)
- `2024-06` (Junho 2024)
- `2024-12` (Dezembro 2024)

#### **Como Configurar as Páginas:**

1. **Abra sua planilha no Google Sheets**
2. **Na parte inferior, clique no "+" para adicionar nova página**
3. **Renomeie cada página com formato `YYYY-MM`**
4. **Configure cada página com a mesma estrutura:**

**Estrutura Obrigatória para CADA página mensal:**
- **A**: PROMOTOR/AGÊNCIA
- **B**: REDE  
- **C**: CIDADE
- **D**: MARCA
- **E**: VISITAS PRÉ-DEFINIDAS
- **F**: TELEFONE
- **G**: DATA INÍCIO
- **H**: VALOR CONTRATO
- **I-AZ**: DATA VISITA 1, DATA VISITA 2, etc.

#### **Exemplo de Configuração:**

```
Páginas da Planilha:
├── 2024-01 (Janeiro 2024)
├── 2024-02 (Fevereiro 2024)
├── 2024-03 (Março 2024)
├── 2024-04 (Abril 2024)
├── 2024-05 (Maio 2024)
├── 2024-06 (Junho 2024) ← Página atual editável
└── 2024-07 (Julho 2024)
```

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

## Funcionalidades do Dashboard

### **Promotores Únicos vs Múltiplas Atividades**

O dashboard agora trata corretamente promotores com mesmo nome:

**Exemplo Prático:**
```
Linha 1: João Silva | Rede ABC | Brusque | Marca ALBA | 10 visitas | R$ 2000
Linha 2: João Silva | Rede XYZ | São Paulo | Marca COAMO | 15 visitas | R$ 3000
```

**Resultado no Dashboard:**
- **Equipe Ativa:** 1 promotor (João Silva)
- **Marcas:** 2 marcas (ALBA, COAMO)
- **Cidades:** 2 cidades (Brusque, São Paulo)
- **Total Visitas:** 25 visitas pré-definidas
- **Valor Total:** R$ 5.000

### **Controle Mensal**

- **Seletor de Mês:** Navegue entre diferentes meses
- **Apenas Mês Atual Editável:** Proteção de dados históricos
- **Dados Zerados:** Meses sem registros aparecem vazios (não simulados)

### **Capacidades de Edição**

✅ **O dashboard PODE editar a planilha quando:**
- Variáveis de ambiente estão configuradas corretamente
- Planilha está compartilhada publicamente
- API Key tem permissões adequadas

✅ **Funcionalidades de Edição Disponíveis:**
- Adicionar novos promotores/registros
- Editar informações existentes
- Adicionar/remover datas de visitas
- Atualizar valores e contratos
- Salvar automaticamente na planilha

### **Downloads e Relatórios**

O dashboard oferece dois tipos de relatórios em CSV:

#### **1. Relatório Completo**
- Todos os registros individuais do mês
- Uma linha por registro (marca/rede/cidade)
- Inclui todas as datas de visitas

#### **2. Resumo Consolidado**
- Uma linha por promotor único
- Soma total de visitas, valores, etc.
- Lista todas as marcas/redes/cidades do promotor

### Cálculos Automáticos por Promotor:
- **Visitas Realizadas**: Conta automaticamente as datas preenchidas
- **Percentual**: Visitas realizadas ÷ Visitas pré-definidas × 100
- **Valor por Visita**: Valor contrato ÷ Visitas pré-definidas  
- **Valor Pago**: Visitas realizadas × Valor por visita

### KPIs Disponíveis:
- Total de promotores únicos ativos
- Performance média consolidada da equipe
- Cumprimento mensal de metas
- Análise financeira (valores contratados vs pagos)
- Distribuição por cidades, marcas e redes

### Gráficos e Análises:
- Performance individual por promotor
- Cumprimento mensal de metas
- Análise financeira detalhada
- Insights profissionais automáticos
- Chat inteligente com recomendações

## Exemplo de Dados na Planilha (Página 2024-06)

| PROMOTOR/AGÊNCIA | REDE | CIDADE | MARCA | VISITAS PRÉ-DEFINIDAS | TELEFONE | DATA INÍCIO | VALOR CONTRATO | DATA VISITA 1 | DATA VISITA 2 |
|------------------|------|--------|-------|---------------------|----------|-------------|----------------|---------------|---------------|
| João Silva | Super ABC | São Paulo | Coca-Cola | 10 | (11) 99999-1234 | 2024-06-01 | 5000.00 | 2024-06-15 | 2024-06-20 |
| João Silva | Rede XYZ | Campinas | Pepsi | 8 | (11) 99999-1234 | 2024-06-01 | 4000.00 | 2024-06-18 | |

**Resultado Automático:**
- **Promotores Únicos**: 1 (João Silva)
- **Total Visitas Pré-definidas**: 18
- **Total Visitas Realizadas**: 3
- **Performance Média**: 16.7%
- **Valor Total Contrato**: R$ 9.000,00
- **Valor Total Pago**: R$ 1.500,00

## Status de Conexão

O dashboard mostrará:
- ✅ **Verde "Conectado"**: Tudo funcionando corretamente
- ⚠️ **Amarelo "Desconectado"**: Configurar variáveis de ambiente
- 📊 **Dados Vazios**: Aguardando conexão com planilha ou página vazia

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

### "Página não encontrada"
1. Certifique-se de que a página existe com formato `YYYY-MM`
2. Verifique se há dados na página
3. Crie novas páginas conforme necessário

### "Falha ao conectar"
1. Teste a API Key no Google Cloud Console
2. Verifique se a planilha está compartilhada publicamente
3. Confirme se o ID da planilha está correto

### Dados não aparecem
1. Verifique a estrutura da planilha (colunas A-H obrigatórias)
2. Confirme se há dados na página do mês
3. Teste o range configurado (ex: 2024-06!A1:AZ1000)

Para suporte detalhado, consulte o arquivo `CONFIGURACAO_EASYPANEL.md`.
