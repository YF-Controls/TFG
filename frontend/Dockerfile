# Builder stage
FROM node:24.11.1-alpine AS build

# Set working directory
WORKDIR /app
# Copy dependency files
COPY package*.json ./
# Install dependencies
RUN npm ci
# Copy source code
COPY . .
# Build the application for production
RUN npm run build

# Production stage with Nginx
FROM nginx:1.29.3-alpine

# Install envsubst (part of gettext)
RUN apk add --no-cache gettext

# Copy nginx template configuration
COPY nginx.conf /etc/nginx/nginx.conf.template

# Copy built application from build stage
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Fix permissions for assets
RUN chmod -R 755 /usr/share/nginx/html && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \;

# Copy startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port (will be configured via environment variable)
EXPOSE ${FRONTEND_PORT:-4200}

# Start nginx with environment variable substitution
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
