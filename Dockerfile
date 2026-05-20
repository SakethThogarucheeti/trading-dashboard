FROM node:20-alpine AS builder
WORKDIR /app

# Build context is the repo root (docker-compose sets context: .)
COPY trading-dashboard/package.json trading-dashboard/package-lock.json* ./
RUN npm ci

COPY trading-dashboard/ .

# API_URL is read by next.config.ts rewrites at build + runtime
ARG API_URL=http://platform:8081
ENV API_URL=$API_URL

RUN npm run build

# ── Production runner ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# next build --standalone copies the minimal server + node_modules subset here
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
