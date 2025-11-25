# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN npm install -g pnpm@10.0.0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/search/package.json apps/backend/search/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile --filter search...

FROM base AS build
COPY . .
COPY --from=deps /app/node_modules ./node_modules
WORKDIR /app/apps/backend/search
RUN npx prisma generate
WORKDIR /app
RUN pnpm run build --filter=shared
RUN pnpm run build --filter=search

FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/search/dist ./apps/backend/search/dist
COPY --from=build /app/apps/backend/search/package.json ./apps/backend/search/
COPY --from=build /app/apps/backend/search/prisma ./apps/backend/search/prisma
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/packages/shared/package.json ./packages/shared/
EXPOSE 3000
CMD [ "pnpm", "start", "--filter=search" ]
