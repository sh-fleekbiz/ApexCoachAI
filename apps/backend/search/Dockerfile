# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN npm install -g pnpm@10.0.0
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/backend/search/package.json apps/backend/search/
COPY apps/backend/search/prisma ./apps/backend/search/prisma
COPY packages/shared/package.json packages/shared/
COPY packages/shared-data/package.json packages/shared-data/
COPY packages/shared-ai/package.json packages/shared-ai/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter search prisma generate
RUN pnpm run build

FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/search/dist ./apps/backend/search/dist
COPY --from=build /app/apps/backend/search/prisma ./apps/backend/search/prisma
COPY --from=build /app/apps/backend/search/node_modules/.prisma ./apps/backend/search/node_modules/.prisma
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/packages/shared-data/dist ./packages/shared-data/dist
COPY --from=build /app/packages/shared-ai/dist ./packages/shared-ai/dist
COPY package.json pnpm-workspace.yaml ./
COPY apps/backend/search/package.json apps/backend/search/
COPY packages/shared/package.json packages/shared/
COPY packages/shared-data/package.json packages/shared-data/
COPY packages/shared-ai/package.json packages/shared-ai/
WORKDIR /app/apps/backend/search
EXPOSE 3000
CMD [ "node", "dist/app.js" ]
