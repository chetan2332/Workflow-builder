FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/execution-engine/package.json ./apps/execution-engine/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile

COPY apps/execution-engine ./apps/execution-engine
COPY packages/shared ./packages/shared

RUN pnpm turbo build --filter=execution-engine

RUN pnpm deploy --filter=execution-engine --prod --legacy /deploy && cp -r /app/apps/execution-engine/dist /deploy/dist


FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /deploy .

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main"]
