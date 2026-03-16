# Estágio de Build
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Estágio de Execução
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Limite de memória para a JVM (economiza recursos na EC2)
ENTRYPOINT ["java", "-Xmx256m", "-jar", "app.jar"]
EXPOSE 25000