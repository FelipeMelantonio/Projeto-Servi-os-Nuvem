FROM node:20
WORKDIR /app
# Copia os arquivos de dependências
COPY package*.json ./
# Instala as dependências
RUN npm install
# Copia o restante do código
COPY . .
# Expõe a porta que o React usa por padrão
EXPOSE 8080
# Variáveis de ambiente para forçar a porta 8080
ENV PORT=8080
ENV HOST=0.0.0.0
# Comando para iniciar a aplicação
CMD ["npm", "start"]