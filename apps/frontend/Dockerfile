# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /workspace
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/frontend/package.json apps/frontend/
COPY packages/ui/package.json packages/ui/
RUN npm install -g pnpm@10.0.0 && pnpm install --frozen-lockfile --filter frontend...

FROM node:22-alpine AS build
WORKDIR /workspace
COPY . .
COPY --from=deps /workspace/node_modules ./node_modules
RUN npm install -g pnpm@10.0.0 && pnpm run build --filter=ui && pnpm run build --filter=frontend

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /workspace/apps/frontend/package.json ./apps/frontend/
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=build /workspace/apps/frontend/dist ./apps/frontend/dist
EXPOSE 5173
CMD ["npm","run","preview","--workspace=apps/frontend","--","--port","5173","--host"]