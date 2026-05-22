FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ARG VITE_API_URL=http://platform:8081
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output

EXPOSE 3000
ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]
