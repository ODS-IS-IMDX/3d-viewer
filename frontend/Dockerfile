FROM nginx:alpine
COPY packages/datahub-viewer/build/. /usr/share/nginx/html/.
COPY nginx/ /etc/nginx/
RUN apk upgrade
