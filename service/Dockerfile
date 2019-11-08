FROM nginx

COPY default.template /etc/nginx/conf.d/default.template

CMD sh -c "envsubst < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
