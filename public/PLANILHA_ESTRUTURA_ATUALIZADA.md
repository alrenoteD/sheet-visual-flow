
# Estrutura Atualizada da Planilha Google Sheets

## Páginas Obrigatórias

### 1. Páginas Mensais (YYYY-MM)
**Exemplos:** `2024-01`, `2024-02`, `2024-03`

**Estrutura das Colunas:**
- **A**: ID_PROMOTOR (obrigatório) - Identificador único interno do promotor
- **B**: PROMOTOR/AGÊNCIA - Nome do promotor ou agência
- **C**: REDE - Nome da rede de varejo
- **D**: CIDADE - Cidade onde ocorrem as visitas
- **E**: MARCA - Marca/produto visitado
- **F**: VISITAS PRÉ-DEFINIDAS - Quantidade planejada de visitas
- **G**: TELEFONE - Contato do promotor
- **H**: DATA INÍCIO - Data de início do contrato
- **I**: VALOR CONTRATO - Valor total do contrato
- **J-AZ**: DATA VISITA 1, DATA VISITA 2... - Datas das visitas realizadas

### 2. Página LOJAS
**Dados mestres das lojas (informações imutáveis)**

**Estrutura das Colunas:**
- **A**: ID_LOJA - Identificador único interno da loja
- **B**: NOME_FANTASIA - Nome fantasia da loja
- **C**: RAZAO_SOCIAL - Razão social da empresa
- **D**: CNPJ - CNPJ da loja
- **E**: CEP - Código postal
- **F**: ENDERECO - Endereço completo
- **G**: NUMERO - Número do estabelecimento
- **H**: COMPLEMENTO - Complemento do endereço
- **I**: BAIRRO - Bairro
- **J**: CIDADE - Cidade
- **K**: ESTADO - Estado (UF)
- **L**: REDE - Rede à qual pertence
- **M**: FILIAL - Código/nome da filial
- **N**: LATITUDE - Coordenada de latitude (opcional)
- **O**: LONGITUDE - Coordenada de longitude (opcional)
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
- **F**: PRECO_SUGERIDO - Preço sugerido
- **G**: UNIDADE - Unidade de medida
- **H**: STATUS - Ativo/Inativo
- **I**: OBSERVACOES - Observações específicas

### 5. Página NOTAS (Nova)
**Sistema de notas do dashboard**

**Estrutura das Colunas:**
- **A**: ID_NOTA - Identificador único da nota
- **B**: DATA_CRIACAO - Data e hora de criação
- **C**: TITULO - Título da nota
- **D**: CONTEUDO - Conteúdo completo da nota
- **E**: CATEGORIA - Categoria da nota (Geral, Insight, etc.)
- **F**: USUARIO - Usuário que criou (se aplicável)
- **G**: STATUS - Ativo/Arquivado
- **H**: TAGS - Tags separadas por vírgula

## Mudanças Importantes

### 1. ID de Promotores
- **Coluna A** agora é obrigatória em páginas mensais
- Deve conter um identificador único para cada promotor
- Exemplo: PROM001, PROM002, AGE001, etc.

### 2. Estrutura Modular
- Separação entre dados transacionais (visitas) e dados mestres (lojas/marcas)
- Facilita manutenção e evita duplicação de informações
- Permite análises mais robustas e relacionamentos entre dados

### 3. Geolocalizaão
- Campos de latitude/longitude nas lojas
- Permite mapas de densidade geográfica
- Análises de distribuição territorial

### 4. Sistema de Notas
- Integração entre dashboard e planilha
- Permite salvar insights e observações
- Controle de versão das anotações

## Benefícios da Nova Estrutura

1. **Análises Avançadas**: Dados estruturados permitem gráficos mais sofisticados
2. **Integridade**: IDs únicos garantem consistência dos dados
3. **Escalabilidade**: Estrutura modular suporta crescimento
4. **Manutenibilidade**: Dados mestres centralizados
5. **Flexibilidade**: Suporte a múltiplas análises temporais
6. **Geolocalização**: Mapas e análises territoriais
7. **Colaboração**: Sistema de notas compartilhadas

## Migração de Dados Existentes

Para planilhas já em uso:
1. Adicionar coluna A (ID_PROMOTOR) nas páginas mensais
2. Criar páginas LOJAS e MARCAS com dados únicos
3. Preencher IDs únicos para promotores existentes
4. Opcional: Criar página PRODUTOS se necessário
5. Sistema de notas será criado automaticamente pelo dashboard

## Compatibilidade

O dashboard mantém compatibilidade com planilhas antigas, mas funcionalidades avançadas requerem a nova estrutura.
