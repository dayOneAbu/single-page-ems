# -------------------------------------------------------------
# Stage 1: Base image
# -------------------------------------------------------------
FROM oven/bun:1-alpine AS base

# Install libc6-compat for compatibility with native binaries
RUN apk add --no-cache libc6-compat

WORKDIR /app

# -------------------------------------------------------------
# Stage 2: Install dependencies
# -------------------------------------------------------------
FROM base AS deps

# Copy dependency definition files first for optimal layer caching
COPY package.json bun.lock ./

# Install dependencies strictly according to bun.lock
RUN bun install --frozen-lockfile

# -------------------------------------------------------------
# Stage 3: Build the application
# -------------------------------------------------------------
FROM base AS builder

WORKDIR /app

# Copy cached dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application source code
COPY . .

# Set build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the Next.js standalone application
RUN bun run build

# -------------------------------------------------------------
# Stage 4: Production runner
# -------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

# Set runtime environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create a non-root group and user for secure container execution
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Ensure working directory has correct permissions for sqlite db creation and locks
RUN chown -R nextjs:nodejs /app

# Copy static assets and public directory
COPY --from=builder /app/public ./public

# Copy standalone output and static chunks with non-root ownership
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Run as non-root user
USER nextjs

EXPOSE 3000

# Start Next.js standalone server
CMD ["node", "server.js"]
