FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3030
# Forçamos as variáveis diretamente aqui
ENV PORT=3030
ENV HOST=0.0.0.0
CMD ["npm","start"]