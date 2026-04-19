FROM nginx:alpine

# Copy files and config
COPY ./.output /opt/app
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Run as user node
USER 1000

WORKDIR /opt/app
