# ==========================================
# ESTÁGIO 1: COMPILAÇÃO
# Usamos o JDK completo para compilar o código
# Java e gerar o arquivo .jar via Maven
# ==========================================
FROM eclipse-temurin:21-jdk AS build

# Define /app como pasta de trabalho dentro do container
WORKDIR /app

# Copia todo o código fonte Java para dentro do container
COPY . .

# Compila e empacota toda a aplicação em um único arquivo .jar
# chmod +x — dá permissão de execução ao Maven Wrapper
# clean    — limpa compilações anteriores
# package  — gera o .jar com a aplicação completa dentro
# -DskipTests — ignora testes para acelerar o build
RUN chmod +x mvnw && ./mvnw clean package -DskipTests


# ==========================================
# ESTÁGIO 2: PRODUÇÃO
# O JDK é descartado aqui — usamos apenas o JRE
# que é o ambiente de execução sem ferramentas
# de desenvolvimento. Imagem final muito mais leve
# ==========================================
FROM eclipse-temurin:21-jre-alpine

# Define /app como pasta de trabalho
WORKDIR /app

# Copia apenas o .jar gerado no estágio anterior
# Todo o código fonte e o Maven ficam para trás
COPY --from=build /app/target/*.jar app.jar

# Inicia a aplicação Spring Boot quando o container subir
# -Xmx256m limita a JVM a 256MB — necessário porque a EC2
# t3.micro tem pouca RAM e sem esse limite fica instável
ENTRYPOINT ["java", "-Xmx256m", "-jar", "app.jar"]

# Documenta que o container escuta na porta 25000
# Mesma porta definida no application.properties
EXPOSE 25000
