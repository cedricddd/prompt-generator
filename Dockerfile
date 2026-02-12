# ─── Stage 1: Build du frontend ───
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# ─── Stage 2: Production ───
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY server.js .
COPY --from=build /app/dist ./dist

EXPOSE 3001

CMD ["node", "server.js"]
