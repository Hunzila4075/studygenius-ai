# Step 1: Build Frontend Client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Step 2: Build Backend Server
FROM node:20-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Step 3: Production Image
FROM node:20-alpine
WORKDIR /app

COPY --from=server-builder /app/server /app/server
COPY --from=client-builder /app/client/dist /app/client/dist

WORKDIR /app/server
EXPOSE 5000

CMD ["npm", "start"]
