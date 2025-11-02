# -------------------------------
# Etapa de Build do Frontend
# -------------------------------
FROM node:16 AS frontend-build
WORKDIR /app

# Aumentar memória do Node
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copiar package.json e package-lock.json
COPY AkAgenda-App/package*.json ./

# Instalar dependências
RUN npm install

# Instalar Angular CLI
RUN npm install -g @angular/cli@12.2.18

# Copiar código do Angular
COPY AkAgenda-App/ ./

# Build de produção
RUN ng build --configuration production

# -------------------------------
# Etapa de Build do Backend
# -------------------------------
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS backend-build
WORKDIR /src

# Copiar arquivos do backend
COPY src/AkAgenda.Api/AkAgenda.Api.csproj ./AkAgenda.Api.csproj
RUN dotnet restore ./AkAgenda.Api.csproj

COPY src/AkAgenda.Api/ ./

# Copiar arquivos do frontend build para o backend wwwroot
COPY --from=frontend-build /app/dist/AkAgenda-App ./wwwroot

# Publish
RUN dotnet publish ./AkAgenda.Api.csproj -c Release -o /app/publish

# -------------------------------
# Etapa Runtime
# -------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app

# Copiar arquivos publicados
COPY --from=backend-build /app/publish .

# Expor porta 80
EXPOSE 80

# Start da aplicação
ENTRYPOINT ["dotnet", "AkAgenda.Api.dll"]
