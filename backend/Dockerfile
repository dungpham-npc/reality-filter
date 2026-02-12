# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Create directory for H2 database persistence
RUN mkdir -p data

# Expose the port (Render provides PORT env var, Spring Boot honors SERVER_PORT)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-Dserver.port=${PORT:8080}", "-jar", "app.jar"]
