# frontend.Dockerfile
# Multi-stage build for Next.js frontend (Node 20 on Debian slim)

# ---------- deps stage: install node_modules ----------
FROM node:20-bullseye-slim AS deps
WORKDIR /app/frontend

# Copy package manifests into WORKDIR (IMPORTANT: copy *into* the WORKDIR directory)
COPY frontend/package*.json ./

# Install dependencies (dev deps are required for build)
RUN npm ci --silent

# ---------- builder stage: build the Next.js app ----------
FROM node:20-bullseye-slim AS builder
WORKDIR /app/frontend

# Make sure public exists (guard against missing public folder causing later COPY errors)
RUN mkdir -p /app/frontend/public

# Copy node_modules from deps stage
COPY --from=deps /app/frontend/node_modules ./node_modules

# Copy full frontend source into builder
COPY frontend/ ./

# Build the app
RUN npm run build

# ---------- runner stage: runtime ----------
FROM node:20-bullseye-slim AS runner
WORKDIR /app/frontend

# Create non-root user (optional but recommended)
RUN useradd --user-group --create-home --shell /bin/false nextuser || true

# Copy build/artifacts from builder
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/package*.json ./
COPY --from=builder /app/frontend/next.config.mjs ./next.config.mjs

# Install only production deps
ENV NODE_ENV=production
RUN npm ci --only=production --silent || true

ENV PORT=3000
EXPOSE 3000

USER nextuser
CMD ["node", "./node_modules/next/dist/bin/next", "start", "-p", "3000"]
