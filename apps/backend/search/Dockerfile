# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/search/package.json apps/backend/search/
COPY apps/backend/search/prisma ./apps/backend/search/prisma
RUN pnpm install --frozen-lockfile --filter search...

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/search/node_modules ./apps/backend/search/node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/search ./apps/backend/search
WORKDIR /app/apps/backend/search
RUN pnpm build
WORKDIR /app

FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Copy workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy search app package.json and built files
COPY apps/backend/search/package.json apps/backend/search/
COPY apps/backend/search/prisma ./apps/backend/search/prisma
COPY --from=build /app/apps/backend/search/dist ./apps/backend/search/dist

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile --filter search...

# Generate Prisma client
WORKDIR /app/apps/backend/search
RUN npx prisma generate

EXPOSE 3000
CMD [ "node", "dist/app.js" ]
