# Etapa de build
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --configuration=production

# Etapa de producción con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/artefactos-del-ayer /usr/share/nginx/html
EXPOSE 80
