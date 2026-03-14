# ================================
# Stage 1: Build
# Context: repo root (to access packages/contracts)
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install client dependencies first (so we can reuse node_modules for contracts)
COPY client/package*.json ./client/
RUN cd client && npm ci

# Copy contracts package and symlink zod so tsc can resolve it
# (tsc walks up dirs: packages/contracts/src → packages/contracts → packages → app → /)
COPY tsconfig.base.json ./
COPY packages/contracts/ ./packages/contracts/
RUN mkdir -p /app/node_modules && cp -r /app/client/node_modules/zod /app/node_modules/zod

# Copy rest of client source
COPY client/ ./client/

# Build args
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_MUI_LICENSE_KEY=""
ENV VITE_MUI_LICENSE_KEY=$VITE_MUI_LICENSE_KEY

# Build — vite.config uses path.resolve(__dirname, '../packages/contracts/src/index.ts')
# which resolves to /app/packages/contracts/src/index.ts ✓
RUN cd client && npm run build

# ================================
# Stage 2: Production (Nginx)
# ================================
FROM nginx:alpine AS production

COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/client/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
