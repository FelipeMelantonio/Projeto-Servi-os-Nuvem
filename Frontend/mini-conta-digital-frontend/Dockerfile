FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3030
# Variável para o proxy funcionar no build (opcional se usar Nginx direto)
ENV WDS_SOCKET_PORT=8080
CMD ["serve", "-s", "build", "-l", "3030"]