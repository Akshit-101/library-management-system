# Stage 1: Build the React application
FROM node:22.14.0-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# Set default API URL path to relative Nginx reverse proxy endpoint (/api)
ARG VITE_API_URL=/api
ARG VITE_API_KEY=your_secret_key

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_KEY=$VITE_API_KEY

RUN npm run build

# Stage 2: Serve the application with Unprivileged Nginx (runs as user nginx)
FROM nginxinc/nginx-unprivileged:1.25-alpine

# Copy built static assets from builder stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

# Start app
CMD ["nginx", "-g", "daemon off;"]

