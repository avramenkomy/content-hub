FROM node:24.17.0-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Prisma generate reads prisma.config.ts and expects DATABASE_URL.
# This value is only needed during image build and does not connect to the database.
# At runtime docker-compose env_file will override DATABASE_URL with the real one.
ENV DATABASE_URL="postgresql://content_user:content_password@localhost:5432/content_hub"

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm exec prisma generate
RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && pnpm exec next start -H 0.0.0.0"]