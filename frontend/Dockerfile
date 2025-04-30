# Dockerfile.dev

FROM node:20-alpine

# ensure we can bind to the dev server port
ENV HOST=0.0.0.0
# you can override this at runtime if needed
ENV PORT=3000

WORKDIR /app

# copy only lock + manifest, install ALL deps (including dev)
COPY package.json package-lock.json ./
RUN npm ci

# copy everything else
COPY . .

# expose the dev port
EXPOSE ${PORT}

# run Nuxt in dev mode
CMD ["npm", "run", "dev"]
