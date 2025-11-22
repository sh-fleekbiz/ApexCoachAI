# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN npm install -g pnpm@10.0.0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/indexer/package.json packages/indexer/
RUN pnpm install --frozen-lockfile --filter indexer...

FROM base AS build
COPY . .
COPY --from=deps /app/node_modules ./node_modules
WORKDIR /app
RUN pnpm run build --filter=indexer

FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/packages/indexer/dist ./packages/indexer/dist
COPY --from=build /app/packages/indexer/package.json ./packages/indexer/
EXPOSE 3001
CMD [ "pnpm", "start", "--filter=indexer" ]
