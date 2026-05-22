FROM node:22-alpine AS builder
WORKDIR /app

# Build context is the repo root (docker-compose sets context: .)
COPY trading-dashboard/package.json trading-dashboard/package-lock.json* ./
RUN npm ci

COPY trading-dashboard/ .

ARG VITE_API_URL=http://platform:8081
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Production runner ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Nitro bundles everything into .output — no node_modules needed at runtime
COPY --from=builder /app/.output ./.output

EXPOSE 3000
ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]
