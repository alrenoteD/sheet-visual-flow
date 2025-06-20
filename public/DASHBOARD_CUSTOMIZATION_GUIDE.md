
# Guia de Personalização do Dashboard

Este guia explica como modificar dados, fórmulas e configurações do dashboard.

## 1. Alterando Dados do Dashboard

### 1.1 Estrutura da Planilha
O dashboard lê dados de diferentes páginas no Google Sheets:
- **Páginas mensais**: `2024-01`, `2024-02`, etc. (formato YYYY-MM)
- **Página NOTAS**: Para anotações e observações
- **Estrutura das colunas**:
  - A: ID_PROMOTOR
  - B: PROMOTOR/AGÊNCIA  
  - C: REDE
  - D: CIDADE
  - E: MARCA
  - F: VISITAS PRÉ-DEFINIDAS
  - G: TELEFONE
  - H: DATA INÍCIO
  - I: VALOR CONTRATO
  - J em diante: DATA VISITA 1, DATA VISITA 2, etc.

### 1.2 Formato de Datas
**IMPORTANTE**: Use sempre o formato `dd/mm/yyyy` (ex: 15/06/2024)
- Arquivo responsável: `src/hooks/useGoogleSheets.ts`
- Função: `processVisitDates()`

## 2. Alterando Referências da Planilha

### 2.1 Configuração Básica
Arquivo: `src/hooks/useGoogleSheets.ts`
```typescript
// Configurações principais
const range = `${targetMonth}!A1:AZ1000`; // Range de dados
const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
```

### 2.2 Mapeamento de Colunas
Para alterar quais colunas correspondem a quais dados:
```typescript
const idPromotor = row[0];        // Coluna A
const promotor = row[1];          // Coluna B  
const rede = row[2];              // Coluna C
const cidade = row[3];            // Coluna D
const marca = row[4];             // Coluna E
const visitasPreDefinidas = parseInt(row[5]); // Coluna F
const telefone = row[6];          // Coluna G
const dataInicio = row[7];        // Coluna H
const valorContrato = parseFloat(row[8]); // Coluna I
```

## 3. Alterando Fórmulas do Dashboard

### 3.1 Fórmula de Performance Atual
**Nova fórmula implementada:**
```typescript
// Performance = ((visitas realizadas / ((visitas pré-definidas/dias do mês) * dias corridos)) * 100)%
const currentDate = new Date();
const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
const daysPassed = currentDate.getDate();
const expectedVisitsSoFar = (visitasPreDefinidas / daysInMonth) * daysPassed;
const percentual = (visitasRealizadas / expectedVisitsSoFar) * 100;
```

**Localização:**
- `src/components/dashboard/KPICards.tsx` (linhas 62-70)
- `src/hooks/useGoogleSheets.ts` (linhas 140-145)

### 3.2 Outras Métricas Calculadas
```typescript
// Valor por visita
const valorPorVisita = visitasPreDefinidas > 0 ? valorContrato / visitasPreDefinidas : 0;

// Valor pago (baseado em visitas realizadas)
const valorPago = visitasRealizadas * valorPorVisita;

// Meta alcançada (percentual do mês total)
const metaAlcancada = (visitasRealizadas / visitasPreDefinidas) * 100;
```

## 4. Localização dos Valores Exibidos

### 4.1 KPIs Principais
Arquivo: `src/components/dashboard/KPICards.tsx`
- **Equipe Ativa**: Linha 95-100
- **Performance Média**: Linha 101-107  
- **Meta Alcançada**: Linha 108-114
- **Valor Processado**: Linha 115-120

### 4.2 Gráficos
- **Performance por Dia**: `src/components/dashboard/charts/PerformanceChart.tsx`
- **Distribuição de Marcas**: `src/components/dashboard/charts/BrandDistributionChart.tsx`
- **Performance por Cidade**: `src/components/dashboard/charts/CityPerformanceChart.tsx`
- **Ranking de Promotores**: `src/components/dashboard/charts/PromoterRankingChart.tsx`
- **Análise Financeira**: `src/components/dashboard/charts/FinancialChart.tsx`

### 4.3 Tabelas e Listas  
- **Painel de Promotores**: `src/components/dashboard/promoters/PromotersPanel.tsx`
- **Análise de Ranking**: `src/components/dashboard/ranking/RankingAnalysis.tsx`
- **Análise Financeira**: `src/components/dashboard/financial/FinancialAnalysis.tsx`

## 5. Códigos de Edição da Planilha

### 5.1 Editor de Dados
Arquivo: `src/components/dashboard/editor/DataEditor.tsx`
- **Adicionar Promotor**: Linha 45-85
- **Editar Dados**: Linha 87-120
- **Remover Promotor**: Linha 122-135

### 5.2 Salvamento no Google Sheets
Arquivo: `src/hooks/useGoogleSheets.ts`
Função: `updateData()` (linhas 200-250)
```typescript
const updateData = async (updatedData: VisitData[]) => {
  // Prepara dados para envio
  const values = [headers, ...updatedData.map(item => [...])];
  
  // Envia para Google Sheets API
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values })
  });
};
```

### 5.3 Sistema de Anotações
Arquivo: `src/components/dashboard/NoteSidebar.tsx`
- **Salvar Localmente**: `localStorage` (linha 45-50)
- **Salvar na Planilha**: Função `saveToExcel()` (linha 70-95)

## 6. Configurações de Conexão

### 6.1 Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_GOOGLE_SHEETS_API_KEY=sua_api_key_aqui
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=seu_spreadsheet_id_aqui
VITE_GOOGLE_SHEETS_RANGE=Dados!A1:AZ1000
```

### 6.2 Status de Conexão
Arquivo: `src/components/dashboard/ConnectionStatus.tsx`
- Indica se a conexão está ativa
- Mostra contagem de registros carregados
- Botão de refresh manual

## 7. Personalizações Avançadas

### 7.1 Adicionando Novos KPIs
1. Edite `src/components/dashboard/KPICards.tsx`
2. Adicione cálculo na função principal
3. Inclua no array `kpis` (linha 85+)

### 7.2 Novos Gráficos
1. Crie arquivo em `src/components/dashboard/charts/`
2. Importe e use no componente principal
3. Adicione ao `renderTabContent()` em `src/pages/Index.tsx`

### 7.3 Filtros Personalizados
Arquivo: `src/components/dashboard/filters/DashboardFilters.tsx`
- Adicione novos campos de filtro
- Implemente lógica de filtragem
- Conecte ao estado principal

## 8. Troubleshooting

### 8.1 Dados Não Carregam
1. Verifique variáveis de ambiente
2. Confirme permissões da API
3. Verifique formato das datas (dd/mm/yyyy)
4. Analise console do navegador

### 8.2 Performance Incorreta
1. Verifique fórmula em `KPICards.tsx`
2. Confirme dados de visitas na planilha
3. Verifique cálculo de dias do mês

### 8.3 Erro ao Salvar
1. Confirme permissões de escrita da API
2. Verifique ID da planilha
3. Analise estrutura dos dados enviados

---

**Nota**: Sempre teste mudanças em ambiente de desenvolvimento antes de aplicar em produção.
