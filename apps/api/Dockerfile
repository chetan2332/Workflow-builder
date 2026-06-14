FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

WORKDIR /app

# Copy manifests first for layer caching — pnpm install only reruns when these change
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/api ./apps/api
COPY packages/database ./packages/database
COPY packages/shared ./packages/shared

# Generate Prisma client before build
RUN cd packages/database && pnpm db:generate

# Build shared → database → api (turbo resolves order via dependsOn)
RUN pnpm turbo build --filter=api

# Flatten api + workspace deps into a self-contained directory, prod deps only
RUN pnpm deploy --filter=api --prod --legacy /deploy && cp -r /app/apps/api/dist /deploy/dist


FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /deploy .
COPY --from=builder /app/packages/database/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy --schema=prisma/schema.prisma && node dist/main"]
