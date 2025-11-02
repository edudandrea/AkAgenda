# -------------------------------
# Etapa de Build
# -------------------------------
FROM node:16 AS build

WORKDIR /app

# Aumentar memória do Node (4GB)
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copiar package.json e package-lock.json
COPY AkAgenda-App/package*.json ./

# Instalar dependências
RUN npm install

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli@12.2.18

# Copiar todo o código do Angular
COPY AkAgenda-App/ ./

# Build de produção
RUN ng build --configuration production

# -------------------------------
# Etapa Runtime com Nginx
# -------------------------------
FROM nginx:alpine

# Copiar build do Angular para Nginx
COPY --from=build /app/dist/AkAgenda-App /usr/share/nginx/html

# Copiar configuração customizada do Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80 (não 4200)
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
