# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN npm install -g pnpm@10.0.0
WORKDIR /app

FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Copy workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy search app
COPY apps/backend/search/package.json apps/backend/search/
COPY apps/backend/search/prisma ./apps/backend/search/prisma
COPY apps/backend/search/dist ./apps/backend/search/dist

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Generate Prisma client
WORKDIR /app/apps/backend/search
RUN npx prisma generate

EXPOSE 3000
CMD [ "node", "dist/app.js" ]
