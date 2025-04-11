FROM node:20.17-alpine as base

RUN apk add --update-cache bash

# Dependencies Layer
FROM base as dependencies

WORKDIR /usr/app
ENV NPM_CONFIG_LOGLEVEL=warn
COPY package.json ./
COPY package-lock.json ./
RUN npm install --unsafe-perm --quiet

# Release Layer
FROM base as release

WORKDIR /usr/app
COPY . .
COPY --from=dependencies /usr/app/node_modules ./node_modules
COPY --from=dependencies /usr/app/package-lock.json ./package-lock.json

RUN apk add --no-cache gdal-tools util-linux

COPY lib/jp_gsi_gsigeo2011.gtx /usr/share/proj/

LABEL version="1.0" \
      description="API"

EXPOSE 3000

CMD ["/usr/local/bin/npm", "start"]
