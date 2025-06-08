# Usamos la imagen oficial de PHP con servidor web embebido
FROM php:8.2-cli

# Copiamos todo el código al contenedor
COPY . /app

# Ponemos el directorio de trabajo
WORKDIR /app

# Exponemos el puerto 8000 (o el que uses)
EXPOSE 8000

# Comando para arrancar el servidor PHP embebido
CMD ["php", "-S", "0.0.0.0:8000", "-t", "."]
