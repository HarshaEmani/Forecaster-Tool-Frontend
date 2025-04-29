# 1. Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only the package manifest + lockfile
COPY package.json package-lock.json ./

# Install with npm (clean, reproducible)
RUN npm ci

# Copy the rest of your source & build
COPY . .
RUN npm run build    # nuxt build

# 2. Production stage
FROM node:20-alpine

WORKDIR /app

# Copy over the built output and production deps
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

RUN npm ci --omit=dev    # install only prod deps

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
