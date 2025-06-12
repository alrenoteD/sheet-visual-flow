
# Configuração do Dashboard com Google Sheets

Este guia mostra como conectar seu dashboard às planilhas do Google Drive.

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
   - A1: Promotor
   - B1: Visitas  
   - C1: Concluídas
   - D1: Percentual
   - E1: Cidade
   - F1: Marca
   - G1: Data

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
4. Defina o intervalo como "Dados!A1:G1000" (ou ajuste conforme necessário)
5. Clique em "Salvar Configuração"
6. Clique em "Carregar Dados" para sincronizar

## Passo 4: Usar o Dashboard

### Visualizar Dados
- Os dados da planilha aparecerão automaticamente nos gráficos
- Use as abas para navegar entre diferentes visualizações

### Editar Dados
- Use a aba "Editor" para modificar dados diretamente no dashboard
- As alterações serão sincronizadas com a planilha automaticamente
- Você também pode editar diretamente na planilha do Google Sheets

### Atualizar Dados
- Clique no botão "Carregar Dados" para sincronizar mudanças da planilha
- O dashboard salva automaticamente as alterações feitas no editor

## Estrutura dos Dados

| Coluna | Tipo | Descrição |
|---------|------|-----------|
| Promotor | Texto | Nome do promotor/vendedor |
| Visitas | Número | Total de visitas planejadas |
| Concluídas | Número | Visitas efetivamente realizadas |
| Percentual | Número | Percentual de conclusão (calculado automaticamente) |
| Cidade | Texto | Cidade onde ocorreram as visitas |
| Marca | Texto | Marca/produto relacionado |
| Data | Data | Data da visita (formato: AAAA-MM-DD) |

## Solução de Problemas

### Erro ao carregar dados
- Verifique se a API Key está correta
- Confirme se a planilha está compartilhada publicamente
- Verifique se o ID da planilha está correto

### Dados não aparecem
- Confirme se o intervalo (range) está correto
- Verifique se a primeira linha contém os cabeçalhos
- Certifique-se de que há dados nas linhas seguintes

### Erro de permissão
- A planilha deve estar com permissão de visualização pública
- A Google Sheets API deve estar ativada no seu projeto

## Dicas Avançadas

- Use filtros na planilha para organizar dados por período
- Adicione validação de dados nas colunas para manter consistência
- Crie abas separadas para diferentes equipes ou regiões
- Configure formatação condicional para destacar performance

## Suporte

Se tiver problemas, verifique:
1. Console do navegador para erros detalhados
2. Status da API no Google Cloud Console  
3. Permissões da planilha no Google Sheets
