# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /workspace
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY packages/webapp/package.json packages/webapp/
RUN npm install -g pnpm@10.0.0 && pnpm install --frozen-lockfile --filter webapp...

FROM node:22-alpine AS build
WORKDIR /workspace
COPY . .
COPY --from=deps /workspace/node_modules ./node_modules
RUN npm install -g pnpm@10.0.0 && pnpm run build --workspace=webapp

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /workspace/packages/webapp/package.json ./packages/webapp/
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=build /workspace/packages/webapp/dist ./packages/webapp/dist
EXPOSE 5173
CMD ["npm","run","preview","--workspace=webapp","--","--port","5173","--host"]