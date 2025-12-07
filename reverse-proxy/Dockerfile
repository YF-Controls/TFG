FROM nginx:1.29.3-alpine

# Install gettext to use envsubst
RUN apk add --no-cache gettext

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Make entrypoint executable
RUN chmod +x /docker-entrypoint.sh

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf.default

# Expose ports are configured via environment variables
#EXPOSE 4003 4004

# Use custom entrypoint to process environment variables
ENTRYPOINT ["/docker-entrypoint.sh"]
