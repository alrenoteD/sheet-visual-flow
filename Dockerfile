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

# Roda o build no momento da criação da imagem
RUN npm run build

# Instala o serve global para servir a build estática
RUN npm install -g serve

# Expõe a porta (80 padrão, mas pode ser variável)
EXPOSE 8081

# Comando para servir a pasta dist já pronta
CMD ["serve", "-s", "dist", "-l", "8081"]
