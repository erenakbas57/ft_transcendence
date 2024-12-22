FROM debian:latest

RUN apt-get update
RUN apt-get install -y nginx
RUN apt-get install -y openssl
RUN apt-get install -y curl

RUN mkdir -p /etc/nginx/ssl
RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/nginx/ssl/key.pem -out /etc/nginx/ssl/cert.pem -days 42 -nodes -subj "/C=TR/ST=ISTANBUL/L=SARIYER/O=42ISTANBUL/OU=STUDENTS/CN=localhost"

COPY ./nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]