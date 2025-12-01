FROM node:lts-alpine

COPY ./.output /opt/app

# Run as user node
USER 1000

EXPOSE 8000
ENV PORT=8000

WORKDIR /opt/app

CMD ["node", "./server/index.mjs"]
