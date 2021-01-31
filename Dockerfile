FROM crypto-zoo as base

WORKDIR /opt/node_app

COPY . .

RUN yarn && yarn build

FROM nginx

WORKDIR /usr/src/app/

COPY --from=base /opt/node_app/nginx.conf /etc/nginx/nginx.conf

COPY --from=base /opt/node_app/dist  /usr/share/nginx/html/
