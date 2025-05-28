# Dockerfile
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build typescript
RUN npm run build

# Generate prisma client
RUN npx prisma generate

# Expose the port
EXPOSE 4000

# Run the app
CMD ["node", "dist/index.js"]