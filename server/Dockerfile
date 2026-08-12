FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build TypeScript dist bundle
COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
