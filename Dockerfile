# Stage 1: Building the code
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/api

RUN npm i -g pnpm

# Copy application
COPY api/package.json .
COPY pnpm-lock.yaml ..
COPY pnpm-workspace.yaml ..
COPY tsconfig.json ..

# Install npm dependencies
RUN pnpm install

# Copy the source code
COPY api/ ./

# Compile TypeScript to JavaScript.
# Expose the Sentry auth token as an environment variable
# to upload source maps to Sentry.
RUN --mount=type=secret,id=sentry_token \
  export SENTRY_AUTH_TOKEN=$(cat /run/secrets/sentry_token) && \
  pnpm build

# Stage 2: Run the built code with only production dependencies
FROM node:20-alpine

WORKDIR /usr/src/api

# Copy built artifacts from the builder stage
COPY --from=builder /usr/src/api/dist ./dist
COPY --from=builder /usr/src/api/drizzle ./dist/drizzle

# Copy package.json (to run the application) and any other necessary files
COPY api/package.json .
COPY api/.env.example .
COPY pnpm-workspace.yaml ..

RUN npm i -g pnpm
# Install only production dependencies
RUN pnpm install --only=production
