FROM debian:bullseye

RUN apt update && apt install -y nginx
RUN mkdir -p /etc/nginx/ssl
RUN apt install openssl -y
RUN openssl req -x509 -nodes -out /etc/nginx/ssl/transcendence.crt -keyout /etc/nginx/ssl/transcendence.key -subj "/C=FR/ST=IDF/L=Angouleme/O=42/OU=42/CN=transcendence/UID=hbelle"
RUN mkdir -p /var/run/nginx
RUN chmod 755 /var/www/html
RUN chown -R www-data:www-data /var/www/html

COPY conf/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]