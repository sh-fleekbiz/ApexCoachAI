# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/indexer/package.json apps/backend/indexer/
RUN pnpm install --frozen-lockfile --filter indexer...

FROM base AS build
COPY . .
COPY --from=deps /app/node_modules ./node_modules
# Install all dependencies including devDependencies for build
RUN pnpm install --frozen-lockfile --filter indexer...
FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/indexer/dist ./apps/backend/indexer/dist
COPY --from=build /app/apps/backend/indexer/package.json ./apps/backend/indexer/
EXPOSE 3001
CMD [ "node", "apps/backend/indexer/dist/app.js" ]
