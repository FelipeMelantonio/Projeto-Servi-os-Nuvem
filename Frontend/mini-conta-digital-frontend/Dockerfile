# ==========================================
# ESTÁGIO 1: COMPILAÇÃO
# Usamos o Node.js para transformar o código
# React em arquivos estáticos (HTML, CSS, JS)
# ==========================================
FROM node:20 AS build

# Define /app como pasta de trabalho dentro do container
WORKDIR /app

# Copia só os arquivos de dependências primeiro
# Isso permite que o Docker use cache — se o código mudar
# mas o package.json não, o npm install não roda de novo
COPY package*.json ./

# Instala todas as dependências do projeto
RUN npm install

# Agora copia todo o código fonte do React
COPY . .

# Compila o React em arquivos estáticos prontos para produção
# NODE_OPTIONS limita a RAM a 768MB — necessário porque a EC2
# t3.micro tem apenas 1GB e o build travava sem esse limite
RUN NODE_OPTIONS="--max-old-space-size=768" npm run build


# ==========================================
# ESTÁGIO 2: PRODUÇÃO
# O Node.js é descartado aqui — a imagem final
# carrega apenas o Nginx com os arquivos prontos
# Resultado: imagem ~50MB em vez de ~900MB
# ==========================================
FROM nginx:alpine

# Copia apenas os arquivos compilados do estágio anterior
# O código fonte e o Node.js ficam para trás
COPY --from=build /app/build /usr/share/nginx/html

# Substitui a config padrão do Nginx pela nossa
# Define porta 8080 e proxy reverso para o backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Documenta que o container escuta na porta 8080
# A porta real é aberta no comando docker run
EXPOSE 8080

# Inicia o Nginx em primeiro plano
# "daemon off" é necessário para o container não encerrar
CMD ["nginx", "-g", "daemon off;"]
