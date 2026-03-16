# ---------- Estágio 1: Build do React ----------
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# variável usada pelo React
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# limite de memória para EC2 pequena
RUN NODE_OPTIONS="--max-old-space-size=768" npm run build


# ---------- Estágio 2: Servidor Nginx ----------
FROM nginx:alpine

# copia build do React
COPY --from=build /app/build /usr/share/nginx/html

# copia configuração nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]