
# Opções de Deploy - Dockerfile vs start.cjs

Este projeto suporta duas formas de deploy, mantendo todas as funcionalidades:

## 1. Deploy com Dockerfile (Recomendado para Produção)

### Características:
- ✅ Build otimizado durante a criação da imagem
- ✅ Verificação automática de variáveis de ambiente
- ✅ Logs informativos sobre configurações
- ✅ Serve arquivos estáticos com `serve`
- ✅ Porta configurável via variável `PORT`

### Como usar:
```bash
# Build da imagem
docker build -t dashboard-visitas .

# Run com variáveis de ambiente
docker run -p 8081:8081 \
  -e VITE_GOOGLE_SHEETS_API_KEY=sua_api_key \
  -e VITE_GOOGLE_SHEETS_SPREADSHEET_ID=sua_planilha_id \
  -e VITE_GOOGLE_SHEETS_RANGE=Dados!A1:AZ1000 \
  -e VITE_CHATBOT_WEBHOOK_URL=https://seu-n8n.com/webhook/dashboard-chat \
  -e PORT=8081 \
  dashboard-visitas
```

### No EasyPanel:
1. Configure as variáveis de ambiente
2. Use o Dockerfile para build automático
3. A porta padrão é 8081, mas pode ser alterada via variável `PORT`

## 2. Deploy com start.cjs (Buildpacks/Heroku)

### Características:
- ✅ Compatível com buildpacks Node.js
- ✅ Mesma verificação de variáveis de ambiente
- ✅ Logs informativos idênticos ao Dockerfile
- ✅ Graceful shutdown com SIGTERM/SIGINT
- ✅ Porta configurável via variável `PORT`

### Como usar:
```bash
# Instalar dependências
npm install

# Executar com start.cjs
node start.cjs
```

### No EasyPanel/Heroku:
1. Configure as variáveis de ambiente
2. Use `node start.cjs` como comando de start
3. A porta padrão é 8080, mas será sobrescrita pela variável `PORT` do ambiente

## Variáveis de Ambiente (Ambas as Opções)

### Obrigatórias para Google Sheets:
- `VITE_GOOGLE_SHEETS_API_KEY` - Chave da API do Google Sheets
- `VITE_GOOGLE_SHEETS_SPREADSHEET_ID` - ID da planilha

### Opcionais:
- `VITE_GOOGLE_SHEETS_RANGE` - Range da planilha (padrão: Dados!A1:AZ1000)
- `VITE_CHATBOT_WEBHOOK_URL` - URL do webhook N8N para assistente
- `PORT` - Porta do servidor (Dockerfile: 8081, start.cjs: 8080)

## Funcionalidades Mantidas

Ambas as opções mantêm:
- ✅ Conexão automática com Google Sheets
- ✅ Dashboard completo com KPIs e gráficos
- ✅ Filtros avançados por cidade, promotor, rede, etc.
- ✅ Chat inteligente (local ou N8N)
- ✅ Insights profissionais automáticos
- ✅ Cálculos de performance e cumprimento mensal
- ✅ Logs informativos sobre configuração
- ✅ Verificação de variáveis de ambiente

## Escolha da Opção

### Use Dockerfile quando:
- Deploy em containers (Docker, Kubernetes)
- Ambiente de produção controlado
- Necessita de build otimizado
- Usa EasyPanel com container

### Use start.cjs quando:
- Deploy em PaaS (Heroku, Railway, etc.)
- Buildpacks Node.js
- Ambiente de desenvolvimento
- Deploy simples sem container

## Exemplo de package.json

```json
{
  "scripts": {
    "start": "node start.cjs",
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

Ambas as opções são totalmente funcionais e mantêm a mesma experiência do usuário.
