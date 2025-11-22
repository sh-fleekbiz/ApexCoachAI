# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN npm install -g pnpm@10.0.0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/search/package.json packages/search/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile --filter search...

FROM base AS build
COPY . .
COPY --from=deps /app/node_modules ./node_modules
WORKDIR /app/packages/search
RUN npx prisma generate
WORKDIR /app
RUN pnpm run build --filter=shared
RUN pnpm run build --filter=search

FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/packages/search/dist ./packages/search/dist
COPY --from=build /app/packages/search/package.json ./packages/search/
COPY --from=build /app/packages/search/prisma ./packages/search/prisma
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/packages/shared/package.json ./packages/shared/
EXPOSE 3000
CMD [ "pnpm", "start", "--filter=search" ]
