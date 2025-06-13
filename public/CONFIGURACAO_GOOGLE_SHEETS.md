
# Configuração do Dashboard com Google Sheets

Este guia mostra como conectar seu dashboard às planilhas do Google Drive com o novo modelo de dados.

## Estrutura da Planilha

### Colunas Obrigatórias (A-H):
- **A**: PROMOTOR/AGÊNCIA - Nome do promotor ou agência
- **B**: REDE - Rede de supermercados/distribuidores
- **C**: CIDADE - Cidade onde são realizadas as visitas
- **D**: MARCA - Marca/produto a ser promovido
- **E**: VISITAS PRÉ-DEFINIDAS - Quantidade total de visitas contratadas
- **F**: TELEFONE - Telefone de contato
- **G**: DATA INÍCIO - Data de início do contrato (formato: AAAA-MM-DD)
- **H**: VALOR CONTRATO - Valor total do contrato

### Colunas de Datas (I-AZ):
- **I em diante**: DATA VISITA 1, DATA VISITA 2, etc.
- Cada coluna representa uma visita realizada com sua respectiva data
- O sistema conta automaticamente quantas datas foram preenchidas
- Suporta até 50 datas de visitas por linha

### Cálculos Automáticos:
- **VISITAS REALIZADAS**: Contagem automática das datas preenchidas (colunas I-AZ)
- **PERCENTUAL**: Visitas realizadas ÷ Visitas pré-definidas × 100
- **VALOR POR VISITA**: Valor contrato ÷ Visitas pré-definidas
- **VALOR PAGO**: Visitas realizadas × Valor por visita

## Passo 1: Preparar a Planilha

### Opção A: Usar o modelo fornecido
1. Faça download do arquivo `modelo-planilha.csv` 
2. Abra o Google Sheets (sheets.google.com)
3. Clique em "Arquivo" > "Importar" > "Fazer upload"
4. Selecione o arquivo `modelo-planilha.csv`
5. Configure a importação e clique em "Importar dados"

### Opção B: Criar manualmente
1. Crie uma nova planilha no Google Sheets
2. Na aba "Dados", crie as seguintes colunas na linha 1:
   - A1: PROMOTOR/AGÊNCIA
   - B1: REDE
   - C1: CIDADE
   - D1: MARCA
   - E1: VISITAS PRÉ-DEFINIDAS
   - F1: TELEFONE
   - G1: DATA INÍCIO
   - H1: VALOR CONTRATO
   - I1: DATA VISITA 1
   - J1: DATA VISITA 2
   - ...e assim por diante conforme necessário

## Passo 2: Configurar API do Google

### 2.1 Obter API Key
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para "APIs e Serviços" > "Biblioteca"
4. Busque por "Google Sheets API" e ative
5. Vá para "APIs e Serviços" > "Credenciais"
6. Clique em "Criar credenciais" > "Chave de API"
7. Copie a chave gerada

### 2.2 Configurar Permissões da Planilha
1. Na sua planilha, clique em "Compartilhar"
2. Altere a permissão para "Qualquer pessoa com o link pode visualizar"
3. Copie o ID da planilha da URL (parte entre /spreadsheets/d/ e /edit)

## Passo 3: Configurar o Dashboard

1. No dashboard, vá para a seção "Configuração Google Sheets"
2. Cole sua API Key no campo correspondente
3. Cole o ID da planilha
4. Defina o intervalo como "Dados!A1:AZ1000" (ou ajuste conforme necessário)
5. Clique em "Salvar Configuração"
6. Clique em "Carregar Dados" para sincronizar

## Passo 4: Usar o Dashboard

### Visualizar Dados
- Os dados da planilha aparecerão automaticamente nos gráficos
- Gráficos disponíveis:
  - Performance mensal de visitas
  - Análise financeira por promotor
  - Distribuição geográfica
  - Performance individual dos promotores
  - Análise de marcas

### Editar Dados
- Use a aba "Editor" para modificar dados diretamente no dashboard
- As alterações serão sincronizadas com a planilha automaticamente
- Você pode adicionar novas datas de visitas diretamente no editor
- Os cálculos são atualizados automaticamente

### Indicadores Financeiros
- **Valor por Visita**: Calculado automaticamente (Valor Contrato ÷ Visitas Pré-definidas)
- **Valor Pago**: Baseado nas visitas já realizadas
- **Saldo Pendente**: Diferença entre valor contratado e valor pago

## Exemplo de Preenchimento

| PROMOTOR/AGÊNCIA | REDE | CIDADE | MARCA | VISITAS PRÉ-DEFINIDAS | TELEFONE | DATA INÍCIO | VALOR CONTRATO | DATA VISITA 1 | DATA VISITA 2 | DATA VISITA 3 |
|------------------|------|--------|-------|---------------------|----------|-------------|----------------|---------------|---------------|---------------|
| João Silva | Super ABC | São Paulo | Coca-Cola | 10 | (11) 99999-1234 | 2024-01-15 | 5000.00 | 2024-06-01 | 2024-06-08 | 2024-06-15 |

**Resultado Automático:**
- Visitas Realizadas: 3 (contagem das datas preenchidas)
- Percentual: 30% (3÷10×100)
- Valor por Visita: R$ 500,00 (5000÷10)
- Valor Pago: R$ 1.500,00 (3×500)

## Funcionalidades Avançadas

### Relatórios Financeiros
- Acompanhamento de pagamentos por visita realizada
- Controle de inadimplência
- Projeção de receitas baseada em visitas programadas

### Análise de Performance
- Taxa de conclusão por promotor
- Eficiência por região
- Performance por marca/produto

### Gestão de Equipes
- Controle de mais de 200 promotores
- Histórico completo de visitas
- Dados de contato integrados

## Solução de Problemas

### Erro ao carregar dados
- Verifique se a API Key está correta
- Confirme se a planilha está compartilhada publicamente
- Verifique se o ID da planilha está correto
- Certifique-se de que o intervalo inclui todas as colunas (A1:AZ1000)

### Datas não aparecem
- Verifique se as datas estão no formato correto (AAAA-MM-DD)
- Confirme se estão nas colunas corretas (I em diante)
- Certifique-se de que não há células vazias entre as datas

### Cálculos incorretos
- Verifique se os valores numéricos não contêm caracteres especiais
- Confirme se as visitas pré-definidas estão preenchidas corretamente
- Certifique-se de que o valor do contrato está em formato numérico

## Dicas para Otimização

1. **Organização das Datas**: Mantenha as datas de visitas em ordem cronológica
2. **Backup Regular**: Faça cópias de segurança da planilha periodicamente
3. **Controle de Acesso**: Use permissões específicas para diferentes usuários
4. **Formatação**: Use formatação condicional para destacar atrasos ou metas atingidas
5. **Filtros**: Configure filtros por cidade, marca ou período para análises específicas

## Suporte

Se tiver problemas, verifique:
1. Console do navegador para erros detalhados
2. Status da API no Google Cloud Console  
3. Permissões da planilha no Google Sheets
4. Formato dos dados nas colunas obrigatórias

Para suporte adicional, consulte a documentação do Google Sheets API ou entre em contato com o administrador do sistema.
