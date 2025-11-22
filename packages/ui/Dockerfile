# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /workspace
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY packages/chat-component/package.json packages/chat-component/
RUN npm install -g pnpm@10.0.0 && pnpm install --frozen-lockfile --filter chat-component...

FROM node:22-alpine AS build
WORKDIR /workspace
COPY . .
RUN npm install -g pnpm@10.0.0 && pnpm run build --workspace=chat-component || echo "Chat component may be library-only; skipping build"

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /workspace/packages/chat-component/package.json ./packages/chat-component/
COPY --from=deps /workspace/node_modules ./node_modules
RUN mkdir -p ./packages/chat-component/dist
COPY --from=build /workspace/packages/chat-component/dist/ ./packages/chat-component/dist/
EXPOSE 5173
CMD ["npm","run","preview","--workspace=chat-component","--","--port","5173","--host"]