FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Desativamos SourceMaps e aumentamos o limite de memória do Node
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

FROM node:20-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3030
# Variável para o proxy funcionar no build (opcional se usar Nginx direto)
ENV WDS_SOCKET_PORT=8080
CMD ["serve", "-s", "build", "-l", "3030"]