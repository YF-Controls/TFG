# Builder stage
FROM node:24.11.1-alpine AS build

# Enable Corepack for Yarn
RUN corepack enable
# Set working directory
WORKDIR /app
# Copy dependency files from ./backend/ to /app/
COPY package.json yarn.lock ./
# Install dependencies
RUN yarn install --frozen-lockfile
# Copy source code
COPY . .
# Build the application
RUN yarn build

# Production stage
FROM node:24.11.1-alpine

# Enable Corepack for Yarn
RUN corepack enable
# Set working directory
WORKDIR /app
# Copy dependency files
COPY package.json yarn.lock ./
# Install only production dependencies
RUN yarn install --frozen-lockfile --production
# Copy compiled code from the build stage
COPY --from=build /app/dist ./dist
# Expose the port: This is optional and can be configured via docker-compose
# EXPOSE 3000
# Non-root user for security
USER node
# Command to start the application
CMD ["node", "dist/main"]
