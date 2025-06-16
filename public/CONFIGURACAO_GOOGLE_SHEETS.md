
# Configuração do Dashboard com Google Sheets via Variáveis de Ambiente

Este dashboard agora utiliza variáveis de ambiente para configuração, tornando-o mais seguro e adequado para deploy em produção.

## 🚀 NOVIDADES DA VERSÃO ATUAL

### ⚡ Atualizações Automáticas em Tempo Real
- **Sincronização Automática**: O dashboard verifica alterações na planilha a cada 2 minutos
- **Notificações**: Alertas discretos quando novos dados são detectados
- **Botão de Sincronização Manual**: Force atualizações instantâneas quando necessário

### 📊 Gráficos Avançados com Filtros Temporais
- **Filtros de Período**: Hoje, Esta Semana, Este Mês, Este Ano, Todo Período
- **Análise Histórica**: Gráficos que puxam dados de múltiplas páginas mensais
- **Controle de Visibilidade**: Oculte/mostre gráficos conforme necessário

### 📋 Sistema de Relatórios Avançado
- **Relatórios Customizáveis**: Escolha quais informações incluir
- **Formato CSV/XLSX**: Exportação em múltiplos formatos
- **Dois Tipos**: Relatório Completo (todas as linhas) ou Consolidado (por promotor)

### 🤖 Dasher - Assistente Inteligente Aprimorado
- **Interface Renovada**: Visual mais amigável e personalizado
- **Guia Integrado**: Instruções claras sobre como usar
- **Perguntas Rápidas**: Botões pré-definidos para análises comuns
- **Análises Locais**: Funciona mesmo sem configuração N8N

### 🎨 Visual e Experiência
- **Header Personalizado**: Branding Deylith.dev com espaço para logo
- **Abas Expandidas**: Novas seções de Relatórios e Informações Avançadas
- **Controles Visuais**: Ocultar/mostrar gráficos individualmente

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
- `2025-01` (Janeiro 2025)
- `2025-02` (Fevereiro 2025)
- `2025-06` (Junho 2025)
- `2025-12` (Dezembro 2025)

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
├── 2025-01 (Janeiro 2025)
├── 2025-02 (Fevereiro 2025)
├── 2025-03 (Março 2025)
├── 2025-04 (Abril 2025)
├── 2025-05 (Maio 2025)
├── 2025-06 (Junho 2025) ← Página atual editável
└── 2025-07 (Julho 2025)
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

## 🎯 Funcionalidades Avançadas

### **Promotores Únicos vs Múltiplas Atividades**

O dashboard trata corretamente promotores com mesmo nome como uma única pessoa, mas permite múltiplas atividades:

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

### **⚡ Atualizações em Tempo Real**

- **Verificação Automática**: A cada 2 minutos o dashboard verifica alterações
- **Sincronização Silenciosa**: Atualizações sem interromper o uso
- **Notificações Discretas**: Alertas apenas quando há mudanças relevantes
- **Controle Manual**: Botão "Sincronizar" para atualizações instantâneas

### **📅 Filtros Temporais Avançados**

#### **Filtros Disponíveis:**
- **Hoje**: Mostra apenas visitas realizadas hoje
- **Esta Semana**: Visitas da semana atual (domingo a sábado)
- **Este Mês**: Visitas do mês corrente
- **Este Ano**: Visitas do ano atual
- **Todo Período**: Todos os dados disponíveis

#### **Como Funcionam:**
Os filtros analisam as "DATA VISITA X" de cada registro:
- Se a data está dentro do período selecionado, o registro é incluído
- Os KPIs e gráficos são recalculados automaticamente
- Combinam com os filtros básicos (promotor, cidade, marca)

### **📊 Controle de Visibilidade dos Gráficos**

#### **Gráficos Visíveis por Padrão:**
- Performance Mensal
- Cumprimento Mensal  
- Análise Financeira

#### **Gráficos Ocultos por Padrão:**
- Performance por Cidade
- Distribuição por Marca
- Ranking de Promotores

**Como Usar:**
- Clique no ícone 👁️ para ocultar um gráfico
- Clique em "Mostrar [Nome do Gráfico]" para exibir

### **📋 Sistema de Relatórios Customizável**

#### **Tipos de Relatório:**
1. **Completo**: Uma linha por registro (marca/rede/cidade)
2. **Consolidado**: Uma linha por promotor único

#### **Informações Incluíveis:**
- ✅ Promotor/Agência
- ✅ Rede, Cidade, Marca
- ✅ Visitas (pré-definidas e realizadas)
- ✅ Performance (percentual)
- ✅ Dados Financeiros (contratos e pagamentos)
- ✅ Datas de Visitas Individuais

#### **Formatos de Exportação:**
- **CSV**: Compatível com Excel, Google Sheets
- **XLSX**: Formato nativo Excel (em desenvolvimento)

### **🤖 Dasher - Assistente Inteligente**

#### **Recursos do Dasher:**
- **Análises Automáticas**: Performance, financeiro, sugestões
- **Perguntas Rápidas**: Botões pré-configurados
- **Interface Amigável**: Visual personalizado com ícone de robô
- **Modo Duplo**: Local (básico) ou N8N (avançado)

#### **Comandos Disponíveis:**
- `"performance"` → Análise geral da equipe
- `"financeiro"` → Resumo de valores e contratos
- `"sugestões"` → Dicas de melhoria estratégica

#### **Personalização do Ícone:**
Para alterar o ícone do Dasher, edite o componente `DasherAssistant.tsx` e substitua o ícone `Bot` por outro do Lucide React.

### **🎨 Branding e Personalização**

#### **Header Personalizado:**
- **Deylith.dev**: Nome da agência destacado
- **Slogan**: "Agência de automações e Soluções Inteligentes com IA"
- **Espaço para Logo**: Área reservada ao lado do nome (16x16)

#### **Como Adicionar Seu Logo:**
1. Substitua a div com classe `w-16 h-16 bg-muted/50` 
2. Insira uma tag `<img>` com seu logo
3. Mantenha as dimensões 64x64px para melhor resultado

## 📈 Análises e Estratégias

### **KPIs Automáticos Calculados:**
- **Equipe Ativa**: Contagem de promotores únicos
- **Performance Média**: Percentual consolidado de toda equipe
- **Meta Alcançada**: Cumprimento baseado no período decorrido
- **Valor Processado**: Comparação entre contratado vs pago

### **Insights Profissionais:**
- Identificação automática de promotores com baixa performance
- Sugestões de melhoria baseadas nos dados
- Análise de cumprimento mensal vs diário esperado
- Projeções financeiras automáticas

### **Filtros Combinados:**
- **Básicos**: Promotor, Cidade, Marca, Rede
- **Temporais**: Hoje, Semana, Mês, Ano, Todo Período
- **Resultado**: Visualizações específicas para tomada de decisão

## ✅ Capacidades de Edição

**O dashboard PODE editar a planilha quando:**
- Variáveis de ambiente estão configuradas corretamente
- Planilha está compartilhada publicamente  
- API Key tem permissões adequadas

**Funcionalidades de Edição Disponíveis:**
- ✅ Adicionar novos promotores/registros
- ✅ Editar informações existentes
- ✅ Adicionar/remover datas de visitas
- ✅ Atualizar valores e contratos
- ✅ Salvar automaticamente na planilha
- ✅ Editor visual de datas de visitas

### **Edição Restrita por Mês:**
- **Apenas Mês Atual**: Só é possível editar a página do mês corrente
- **Histórico Protegido**: Meses anteriores são somente leitura
- **Criação Automática**: Novas páginas são criadas conforme necessário

## 🔧 Configurações Avançadas

### **Personalização do Intervalo de Atualização:**
```javascript
// No useRealTimeUpdates hook, altere:
intervalMinutes: 2 // Para o intervalo desejado em minutos
```

### **Configuração de Webhook N8N:**
1. Crie um workflow no N8N
2. Adicione um trigger "Webhook"
3. Configure o endpoint
4. Adicione a URL na variável `VITE_CHATBOT_WEBHOOK_URL`

### **Customização de Gráficos:**
- Edite os componentes em `src/components/dashboard/charts/`
- Adicione novos gráficos seguindo os padrões existentes
- Configure visibilidade padrão em `chartVisibility`

## 🛠️ Solução de Problemas

### "Aguardando Conexão"
1. ✅ Verifique se as variáveis de ambiente foram salvas
2. ✅ Reinicie a aplicação no EasyPanel
3. ✅ Confirme se os valores estão corretos

### "Página não encontrada"
1. ✅ Certifique-se de que a página existe com formato `YYYY-MM`
2. ✅ Verifique se há dados na página
3. ✅ Crie novas páginas conforme necessário

### "Atualizações não funcionam"
1. ✅ Verifique a conexão com a internet
2. ✅ Confirme se a planilha está acessível
3. ✅ Teste a sincronização manual

### "Relatórios vazios"
1. ✅ Verifique se há dados no período filtrado
2. ✅ Confirme se os filtros estão corretos
3. ✅ Teste com "Todo Período"

### "Dasher não responde"
1. ✅ Verifique se há dados carregados
2. ✅ Teste os botões de pergunta rápida
3. ✅ Configure N8N para respostas avançadas

## 📞 Suporte

Para suporte detalhado:
- 📖 Consulte `CONFIGURACAO_EASYPANEL.md`
- 🤖 Use o Dasher para análises automáticas
- 🔄 Teste a sincronização manual em caso de problemas

---

**Powered by Deylith.dev - Agência de automações e Soluções Inteligentes com IA**
