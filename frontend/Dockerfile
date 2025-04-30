# --------------------
# 1) BUILD STAGE
# --------------------
    FROM node:20-alpine AS builder

    # set working dir
    WORKDIR /app
    
    # copy package manifests and lockfile
    COPY package.json package-lock.json ./
    
    # install all dependencies
    RUN npm ci
    
    # copy the rest of the source
    COPY . .
    
    # build the Nuxt app
    RUN npm run build
    
    
    # --------------------
    # 2) PRODUCTION STAGE
    # --------------------
    FROM node:20-alpine AS production
    
    WORKDIR /app
    
    # copy over only the built output and package files
    COPY --from=builder /app/.output ./.output
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/package-lock.json ./
    
    # install only prod‐deps
    RUN npm ci --omit=dev
    
    # make sure Nuxt listens on all interfaces & the right port
    ENV NODE_ENV=production \
        NITRO_HOST=0.0.0.0 \
        NITRO_PORT=3000 \
        HOST=0.0.0.0 \
        PORT=3000
    
    # expose that port
    EXPOSE 3000
    
    # start the SSR server
    CMD ["node", ".output/server/index.mjs"]
    