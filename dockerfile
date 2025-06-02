# -------------------------------------------------------------
# Etapa 1: Builder — compila TypeScript a JavaScript
# -------------------------------------------------------------
    FROM node:18-alpine AS builder

    # 1. Definir directorio de trabajo
    WORKDIR /app
    
    # 2. Copiar archivos de dependencias y configuración de TS
    COPY package.json package-lock.json tsconfig.json ./
    
    # 3. Instalar TODAS las dependencias (dev + prod) para el build
    RUN npm install
    
    # 4. Copiar el resto del código fuente
    COPY . .
    
    # 5. Compilar TypeScript a JavaScript en /app/dist
    RUN npm run build
    
    
    # -------------------------------------------------------------
    # Etapa 2: Producción — sólo archivos compilados + dependencias prod
    # -------------------------------------------------------------
    FROM node:18-alpine
    
    # 6. Definir directorio de trabajo
    WORKDIR /app
    
    # 7. Copiar sólo package.json y package-lock.json
    COPY package.json package-lock.json ./
    
    # 8. Instalar únicamente dependencias de producción
    RUN npm install --production
    
    # 9. Copiar la carpeta compilada desde la etapa “builder”
    COPY --from=builder /app/dist ./dist
    
    # 10. Copiar el archivo .env (para que las variables estén disponibles)
    #     Importante: Si tu .env contiene credenciales sensibles, considera no “commitear” 
    #     este Dockerfile con .env adentro ni subir tu .env a GitHub. 
    #     Otra opción es pasar estas variables en tiempo de ejecución con -e o --env-file.
    COPY .env ./
    
    # 11. Exponer el puerto que utiliza tu app (3001)
    EXPOSE 3001
    
    # 12. Comando para arrancar tu app compilada
    CMD ["node", "dist/index.js"]