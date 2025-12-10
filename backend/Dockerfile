# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the WAR file, skipping tests to save time during container startup
RUN mvn clean package -DskipTests

# Stage 2: Run the application in Tomcat
FROM tomcat:10.1-jdk21
# Remove default webapps
RUN rm -rf /usr/local/tomcat/webapps/*
# Copy the built WAR from the build stage to the webapps directory
COPY --from=build /app/target/backend.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]
