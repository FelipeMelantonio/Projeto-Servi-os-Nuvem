FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
# Forçamos as variáveis diretamente aqui para a porta 8080
ENV PORT=8080
ENV HOST=0.0.0.0
ENV WDS_SOCKET_PORT=8080
CMD ["npm","start"]