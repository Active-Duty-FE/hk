# Stage 1: Building the code
FROM node:16.19.1-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install -y

COPY . .

RUN yarn lint

RUN yarn build-ntq

# Stage 2: And then copy over node_modules, etc from that stage to the smaller base image
FROM nginx:1.17.2-alpine

LABEL maintainer="demo@gmail.com"

EXPOSE 80
EXPOSE 443

WORKDIR /usr/share/nginx/html
# Copy the SSL certificate files into the image
COPY ./docker/certificate-ssl/certificate.crt /etc/nginx/certs/certificate.crt
COPY ./docker/certificate-ssl/certificate.key /etc/nginx/certs/certificate.key
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/vhost.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist ./

ENTRYPOINT ["nginx","-g","daemon off;"]
