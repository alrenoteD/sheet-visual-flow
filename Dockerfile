
# Usa Node 20 oficial
FROM node:20

# Define diretório da app
WORKDIR /app

# Copia package.json e package-lock.json (se tiver)
COPY package*.json ./

# Instala tudo (incluindo devDependencies para build)
RUN npm install

# Copia o código fonte
COPY . .

# Cria um script de inicialização que verifica variáveis de ambiente
RUN echo '#!/bin/bash\n\
echo "🚀 Starting Visits Dashboard..."\n\
echo "📊 Port: $PORT"\n\
\n\
# Verificar variáveis de ambiente importantes\n\
MISSING_VARS=""\n\
\n\
if [ -z "$VITE_GOOGLE_SHEETS_API_KEY" ]; then\n\
  MISSING_VARS="$MISSING_VARS VITE_GOOGLE_SHEETS_API_KEY"\n\
fi\n\
\n\
if [ -z "$VITE_GOOGLE_SHEETS_SPREADSHEET_ID" ]; then\n\
  MISSING_VARS="$MISSING_VARS VITE_GOOGLE_SHEETS_SPREADSHEET_ID"\n\
fi\n\
\n\
if [ -n "$MISSING_VARS" ]; then\n\
  echo "⚠️  Variáveis de ambiente faltando:$MISSING_VARS"\n\
  echo "🔧 Configure essas variáveis no EasyPanel para conectar com Google Sheets"\n\
else\n\
  echo "✅ Variáveis de ambiente do Google Sheets configuradas"\n\
fi\n\
\n\
if [ -n "$VITE_CHATBOT_WEBHOOK_URL" ]; then\n\
  echo "🤖 Assistente inteligente habilitado (N8N)"\n\
else\n\
  echo "💭 Assistente funcionará em modo local (configure VITE_CHATBOT_WEBHOOK_URL para N8N)"\n\
fi\n\
\n\
echo "🔨 Building project..."\n\
npm run build\n\
\n\
if [ $? -eq 0 ]; then\n\
  echo "✅ Build completed successfully"\n\
  echo "🌐 Starting server..."\n\
  echo "✅ Dashboard running on port ${PORT:-8081}"\n\
  echo "🔗 Access: http://localhost:${PORT:-8081}"\n\
  serve -s dist -l ${PORT:-8081}\n\
else\n\
  echo "❌ Build failed"\n\
  exit 1\n\
fi' > /app/docker-start.sh

# Torna o script executável
RUN chmod +x /app/docker-start.sh

# Instala o serve global para servir a build estática
RUN npm install -g serve

# Expõe a porta (80 padrão, mas pode ser variável)
EXPOSE 8081

# Comando para executar o script de inicialização
CMD ["/app/docker-start.sh"]
