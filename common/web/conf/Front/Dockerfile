FROM node:21-bookworm AS build

WORKDIR /app

COPY npm/package*.json ./
RUN npm install

COPY ./npm .
RUN npm install && npm run build

FROM elisiano/nginx-modsecurity

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx/conf/nginx.conf /etc/nginx/nginx.conf

COPY nginx/modsecurity/owasp-crs /etc/nginx/modsecurity.d/owasp-crs
COPY nginx/modsecurity/modsecurity.conf /etc/nginx/modsecurity.d/modsecurity.conf
COPY nginx/modsecurity/includes.conf /etc/nginx/modsecurity.d/includes.conf

RUN mkdir -p /etc/nginx/modsecurity.d && \
    chown -R nginx:nginx /etc/nginx/modsecurity.d && \
    mkdir /var/log/modsecurity


CMD ["nginx", "-g", "daemon off;"]