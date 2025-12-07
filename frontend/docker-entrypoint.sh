#!/bin/sh
set -e

# Set default port if not provided
export FRONTEND_PORT=${FRONTEND_PORT:-4200}

# Substitute environment variables in nginx config
# nginx.conf is used as template to generate the final configuration
envsubst '${FRONTEND_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Test nginx configuration
nginx -t

# Execute the command passed to the script
exec "$@"
