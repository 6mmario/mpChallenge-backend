# Dockerfile (ejemplo)
FROM node:18-alpine

# Crear directorio de la app
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del código compilado
COPY dist/ ./dist

# Expone el puerto que usa tu aplicación (ajústalo)
EXPOSE 3000

# Comando para iniciar en producción
CMD ["node", "dist/index.js"]