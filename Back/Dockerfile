# Etapa de build
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copiar arquivos de projeto
COPY src/AkAgenda.Api/AkAgenda.Api.csproj ./AkAgenda.Api.csproj
RUN dotnet restore ./AkAgenda.Api.csproj

# Copiar todo o código do backend
COPY src/AkAgenda.Api/ ./ 

# Build e publish
RUN dotnet publish ./AkAgenda.Api.csproj -c Release -o /app/publish

# Etapa runtime
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AkAgenda.Api.dll"]
