# -------------------------------
# Etapa de Build do Frontend (Angular 20)
# -------------------------------
FROM node:22 AS frontend-build
WORKDIR /app

# Angular 20 exige Node 20.19+ (recomenda 22.x) :contentReference[oaicite:0]{index=0}
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copiar package.json / package-lock.json
COPY Front/AkAgenda-App/package*.json ./

# Instalar dependências (mais estável em CI)
RUN npm ci

# Copiar o restante do código Angular
COPY Front/AkAgenda-App/ ./

# Usar o Angular CLI local do projeto (v20) para build
RUN npx ng build --configuration production

# -------------------------------
# Etapa de Build do Backend (.NET 10)
# -------------------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src

# Copiar csproj e restaurar pacotes
COPY Back/src/AkAgenda.Api/AkAgenda.Api.csproj ./
RUN dotnet restore AkAgenda.Api.csproj

# Copiar todo o código do backend
COPY Back/src/AkAgenda.Api/ ./

# Copiar build do frontend para a wwwroot do backend
# ⚠️ Se o Angular estiver gerando em dist/AkAgenda-App/browser, use a linha comentada.
# COPY --from=frontend-build /app/dist/AkAgenda-App/browser ./wwwroot
COPY --from=frontend-build /app/dist/AkAgenda-App ./wwwroot

# Publish do backend em modo Release
RUN dotnet publish AkAgenda.Api.csproj -c Release -o /app/publish

# -------------------------------
# Etapa Runtime (.NET 10)
# -------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Copiar arquivos publicados
COPY --from=backend-build /app/publish ./

# Expor porta 80
EXPOSE 80

# Start da aplicação
ENTRYPOINT ["dotnet", "AkAgenda.Api.dll"]
