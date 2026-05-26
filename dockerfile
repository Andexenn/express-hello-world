
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy source 
COPY . .

FROM node:20-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy 
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/app.js ./
COPY --from=builder /usr/src/app/LICENSE ./LICENSE

ENV PORT=3001
EXPOSE 3001

CMD ["node", "app.js"]

