# backend/Dockerfile
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package manifests first for caching
COPY package*.json ./

# Install dependencies, allow legacy peer deps so build won't fail
RUN npm install --production --legacy-peer-deps

# Copy application source
COPY . .

# Ensure app listens on all interfaces
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# Start the app (change if your entrypoint differs)
CMD ["node", "index.js"]
