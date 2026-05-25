FROM node:lts-alpine AS build-node

WORKDIR /app

COPY app/ /app/app/
COPY server/ /app/server/
COPY public/ /app/public/
COPY logistiek-app.d.ts nuxt.config.ts package.json package-lock.json tsconfig.json /app/

RUN mkdir /app/data/

RUN npm ci

RUN npm run build

FROM node:lts-alpine

WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build-node /app/.output/ /app/
COPY --from=build-node /app/data/ /app/data/

VOLUME /app/data/
ENV PORT=80 \
    HOST=0.0.0.0

EXPOSE 80

CMD ["node", "/app/server/index.mjs"]
