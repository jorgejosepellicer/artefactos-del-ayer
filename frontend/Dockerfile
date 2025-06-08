# Etapa 1: Build del frontend
FROM node:18 AS build

WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

RUN npm install

# Copiar todo el código fuente
COPY . .

# Build del proyecto Angular (producción)
RUN npm run build -- --configuration production

# Etapa 2: Servir los archivos estáticos con un servidor web ligero
FROM nginx:alpine

# Copiar build generado desde la etapa anterior a la carpeta donde Nginx sirve contenido
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
