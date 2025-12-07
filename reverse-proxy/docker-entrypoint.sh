#!/bin/sh

# Environment variables to replace in nginx.conf
VARS='${REVERSE_PROXY_HTTP_PORT} ${REVERSE_PROXY_HTTPS_PORT} ${REVERSE_PROXY_DOMAIN_NAME} ${BACKEND_HOST} ${BACKEND_PORT} ${FRONTEND_HOST} ${FRONTEND_PORT}'

# Processing nginx.conf with envsubst
echo "Processing environment variables in nginx.conf..."
envsubst "$VARS" < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp
mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

# Verifying nginx configuration
echo "Verifying nginx configuration..."
nginx -t

# Starting nginx
echo "Starting nginx..."
exec nginx -g 'daemon off;'
