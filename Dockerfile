FROM openresty/openresty:alpine-fat
RUN apk update \
    && apk add openssl

RUN mkdir /openresty
RUN mkdir /openresty/logs
WORKDIR /openresty
COPY . /openresty
RUN mkdir /openresty/certs
RUN openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \
    -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=www.example.com" \
    -keyout /openresty/certs/default.key -out /openresty/certs/default.crt
RUN /usr/local/openresty/luajit/bin/luarocks install pgmoon
EXPOSE 80
EXPOSE 443
CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;", "-c", "/openresty/nginx.conf"]