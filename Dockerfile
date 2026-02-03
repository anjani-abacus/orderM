# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app for production
RUN npm run build

# Production stage - using nginx to serve static files
FROM nginx:alpine AS production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config template for SPA routing
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Expose port 80
EXPOSE 80

# Set default backend URL (can be overridden at runtime)
ENV BACKEND_URL=http://localhost:4000

# Start nginx (envsubst runs automatically via nginx:alpine entrypoint)
CMD ["nginx", "-g", "daemon off;"]
