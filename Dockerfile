FROM node:lts-alpine

WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY .output/ ./

# Change the port and host
ENV PORT=80

ENV HOST=0.0.0.0

EXPOSE 80

CMD ["node", "/app/server/index.mjs"]
