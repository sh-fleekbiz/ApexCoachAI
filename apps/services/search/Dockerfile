# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/services/search/package.json apps/services/search/
COPY apps/services/search/prisma ./apps/services/search/prisma
RUN pnpm install --frozen-lockfile --filter search...

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/services/search/node_modules ./apps/services/search/node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/services/search ./apps/services/search
WORKDIR /app
# Install devDependencies for build
RUN pnpm install --frozen-lockfile --filter search...
WORKDIR /app/apps/services/search
# Generate Prisma client before building
RUN npx prisma generate
RUN pnpm build
WORKDIR /app

FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Copy workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy search app package.json and built files
COPY apps/services/search/package.json apps/services/search/
COPY apps/services/search/prisma ./apps/services/search/prisma
COPY --from=build /app/apps/services/search/dist ./apps/services/search/dist

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile --filter search...

# Generate Prisma client
WORKDIR /app/apps/services/search
RUN npx prisma generate

EXPOSE 3000
CMD [ "node", "dist/server.js" ]
