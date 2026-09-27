# ---- deps ----
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV HUSKY=0
COPY package.json yarn.lock ./
# yarn.lock trong repo đang lệch với package.json nên không dùng --frozen-lockfile
RUN yarn install

# ---- build ----
FROM node:18-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Địa chỉ API được nhúng vào bundle lúc build
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# ---- runtime ----
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
