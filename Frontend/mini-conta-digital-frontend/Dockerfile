# Estágio 1: Build — transforma o código React em arquivos estáticos
FROM node:20 AS build
WORKDIR /app

# Copia dependências primeiro para aproveitar cache do Docker
# Se o código mudar mas o package.json não, o npm install não roda de novo
COPY package*.json ./
RUN npm install

# Copia o restante do código e executa o build de produção
COPY . .

# Limita RAM do Node a 768MB — necessário na EC2 t3.micro para o build não travar
RUN NODE_OPTIONS="--max-old-space-size=768" npm run build


# Estágio 2: Produção — serve os arquivos estáticos via Nginx
# A imagem do Node é descartada aqui, o container final fica muito menor
FROM nginx:alpine

# Copia apenas os arquivos prontos do build anterior, sem o código fonte
COPY --from=build /app/build /usr/share/nginx/html

# Configuração personalizada: define porta 8080 e proxy reverso para o backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Porta que o Nginx vai escutar
EXPOSE 8080

# Mantém o Nginx em primeiro plano — necessário para o container não encerrar
CMD ["nginx", "-g", "daemon off;"]
