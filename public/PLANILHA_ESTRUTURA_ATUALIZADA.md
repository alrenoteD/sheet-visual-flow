
# Estrutura Atualizada da Planilha Google Sheets

## Visão Geral das Mudanças
Esta versão implementa uma estrutura modular e avançada para análises profissionais, com suporte a IDs únicos, dados mestres separados e sistema de notas integrado.

## Páginas Obrigatórias

### 1. Páginas Mensais (YYYY-MM)
**Exemplos:** `2024-01`, `2024-02`, `2024-03`

**⚠️ IMPORTANTE: Nova Estrutura de Colunas**

- **A**: ID_PROMOTOR (obrigatório) - Identificador único interno do promotor
- **B**: PROMOTOR/AGÊNCIA - Nome do promotor ou agência  
- **C**: REDE - Nome da rede de varejo
- **D**: CIDADE - Cidade onde ocorrem as visitas
- **E**: MARCA - Marca/produto visitado
- **F**: VISITAS PRÉ-DEFINIDAS - Quantidade planejada de visitas
- **G**: TELEFONE - Contato do promotor (múltiplos valores separados por vírgula)
- **H**: DATA INÍCIO - Data de início do contrato (DD/MM/AAAA)
- **I**: VALOR CONTRATO - Valor total do contrato (número)
- **J-AZ**: DATA VISITA 1, DATA VISITA 2... - Datas das visitas realizadas (DD/MM/AAAA)

**Observações Importantes:**
- ID_PROMOTOR deve ser único e consistente entre todas as páginas
- Telefones múltiplos: usar vírgula como separador (ex: "48992006925,48992111496")
- Datas no formato brasileiro: DD/MM/AAAA
- IDs repetidos indicam o mesmo promotor em contratos diferentes

### 2. Página LOJAS
**Dados mestres das lojas (informações imutáveis)**

**Estrutura das Colunas:**
- **A**: ID_LOJA - Identificador único interno da loja
- **B**: NOME_FANTASIA - Nome fantasia da loja
- **C**: RAZAO_SOCIAL - Razão social da empresa
- **D**: CNPJ - CNPJ da loja (formato: 00.000.000/0001-00)
- **E**: CEP - Código postal (formato: 00000-000)
- **F**: ENDERECO - Endereço completo
- **G**: NUMERO - Número do estabelecimento
- **H**: COMPLEMENTO - Complemento do endereço
- **I**: BAIRRO - Bairro
- **J**: CIDADE - Cidade
- **K**: ESTADO - Estado (UF)
- **L**: REDE - Rede à qual pertence
- **M**: FILIAL - Código/nome da filial
- **N**: LATITUDE - Coordenada de latitude (opcional, formato decimal)
- **O**: LONGITUDE - Coordenada de longitude (opcional, formato decimal)
- **P**: STATUS - Ativo/Inativo
- **Q**: OBSERVACOES - Observações gerais

### 3. Página MARCAS
**Dados mestres das marcas (informações imutáveis)**

**Estrutura das Colunas:**
- **A**: ID_MARCA - Identificador único interno da marca
- **B**: NOME_MARCA - Nome oficial da marca
- **C**: CODIGO_FORNECEDOR - Código do fornecedor
- **D**: CATEGORIA - Categoria do produto
- **E**: SUBCATEGORIA - Subcategoria do produto
- **F**: FABRICANTE - Nome do fabricante
- **G**: CNPJ_FABRICANTE - CNPJ do fabricante
- **H**: CONTATO_COMERCIAL - E-mail ou telefone comercial
- **I**: STATUS - Ativo/Inativo
- **J**: OBSERVACOES - Observações gerais

### 4. Página PRODUTOS (Opcional)
**SKUs e produtos específicos por marca**

**Estrutura das Colunas:**
- **A**: ID_PRODUTO - Identificador único do produto
- **B**: ID_MARCA - Referência à marca (FK)
- **C**: NOME_PRODUTO - Nome do produto
- **D**: SKU - Código SKU interno
- **E**: EAN - Código de barras EAN
- **F**: PRECO_SUGERIDO - Preço sugerido (formato numérico)
- **G**: UNIDADE - Unidade de medida
- **H**: STATUS - Ativo/Inativo
- **I**: OBSERVACOES - Observações específicas

### 5. Página NOTAS
**Sistema de notas do dashboard**

**Estrutura das Colunas:**
- **A**: ID_NOTA - Identificador único da nota
- **B**: DATA_CRIACAO - Data e hora de criação (DD/MM/AAAA HH:MM)
- **C**: TITULO - Título da nota
- **D**: CONTEUDO - Conteúdo completo da nota
- **E**: CATEGORIA - Categoria da nota (Geral, Insight, Alerta, etc.)
- **F**: USUARIO - Usuário que criou (se aplicável)
- **G**: STATUS - Ativo/Arquivado
- **H**: TAGS - Tags separadas por vírgula
- **I**: PRIORIDADE - Alta/Média/Baixa

## Funcionalidades Avançadas do Dashboard

### 1. Sistema de TTS (Text-to-Speech)
- Configure `VITE_TTS_WEBHOOK_URL` para integração com N8N
- Converte respostas do assistente em áudio
- Cache temporário de áudio por sessão

### 2. Painel de Promotores
- Visualização individual por ID_PROMOTOR
- Calendário de visitas interativo
- Performance por marca
- Informações de contato consolidadas

### 3. Gráficos Avançados (Dashboard para Nerds)
- Histograma de frequência de visitas
- Boxplot por marca/loja
- Gráfico de correlação
- Heatmap de cumprimento
- Timeline com detecção de anomalias

### 4. Filtros Temporais Inteligentes
- Gráficos de comparação mensal só aparecem em "Este Ano" ou "Todo Período"
- Filtros aplicam-se apenas aos gráficos, não aos dados brutos
- Performance otimizada para grandes volumes de dados

### 5. Sistema de Refresh Automático
- Manual via botão no dashboard
- Webhook via `window.triggerDashboardRefresh()`
- Arquivo `refresh.html` para integração HTTP

## Migração de Dados Existentes

### Passo 1: Adicionar Coluna ID_PROMOTOR
1. Inserir nova coluna A em todas as páginas mensais
2. Preencher com IDs únicos (ex: PROM001, PROM002, AGE001)
3. Dados existentes se movem uma coluna para a direita

### Passo 2: Criar Páginas Mestres
1. Criar página LOJAS com dados únicos de estabelecimentos
2. Criar página MARCAS com dados únicos de produtos
3. Opcional: Criar página PRODUTOS para SKUs detalhados

### Passo 3: Sistema de Notas
- Página NOTAS será criada automaticamente pelo dashboard
- Integração com navegador e planilha simultânea

## Variáveis de Ambiente Necessárias

```env
# Google Sheets (obrigatório)
VITE_GOOGLE_SHEETS_API_KEY=your_api_key
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
VITE_GOOGLE_SHEETS_RANGE=Dados!A1:AZ1000

# Chatbot N8N (opcional)
VITE_CHATBOT_WEBHOOK_URL=https://your-n8n.com/webhook/chat

# Text-to-Speech N8N (opcional)
VITE_TTS_WEBHOOK_URL=https://your-n8n.com/webhook/tts
```

## Novidades desta Versão

### ✅ Implementado:
- [x] Estrutura modular de dados
- [x] Sistema de IDs únicos para promotores
- [x] Painel individual de promotores
- [x] Calendário de visitas interativo
- [x] Gráficos avançados para análise profissional
- [x] Sistema de TTS integrado
- [x] Menu de navegação otimizado
- [x] Filtros temporais inteligentes
- [x] Sistema de refresh automático
- [x] Suporte a valores múltiplos (telefones, etc.)

### 🔄 Em Desenvolvimento:
- [ ] Integração com mapas (geocoordenadas)
- [ ] Sistema de alertas automáticos
- [ ] Exportação de relatórios em PDF
- [ ] Dashboard mobile responsivo
- [ ] Integração com WhatsApp Business

### 📋 Compatibilidade:
- ✅ Planilhas antigas (modo compatibilidade)
- ✅ Dados existentes (migração automática)
- ✅ Múltiplos formatos de data
- ✅ Campos opcionais vazios
- ✅ Encoding UTF-8 completo

## Suporte e Troubleshooting

### Problemas Comuns:
1. **"ID_PROMOTOR não encontrado"**: Adicionar coluna A nas páginas mensais
2. **"Páginas mestres ausentes"**: Criar páginas LOJAS e MARCAS
3. **"TTS não funciona"**: Configurar webhook N8N para áudio
4. **"Dados não carregam"**: Verificar permissões da API Google Sheets

### Logs e Monitoramento:
- Console do navegador: análise detalhada de erros
- Network tab: verificar chamadas para Google Sheets API
- N8N logs: monitorar webhooks de integração

**Versão:** 2.0 | **Data:** Dezembro 2024 | **Maintainer:** Deylith.dev
