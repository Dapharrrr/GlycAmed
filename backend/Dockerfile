FROM node:20-alpine

WORKDIR /app/backend

COPY backend/package*.json ./
# # Install system CA certificates so Node can validate TLS certificates (required for Atlas)
# RUN apk add --no-cache ca-certificates && update-ca-certificates
RUN npm install

COPY backend/ ./

EXPOSE 8080

CMD ["npm", "run", "dev"]