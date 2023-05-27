FROM node:16 as build

ENV PORT 80

EXPOSE 80

WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

### Stage 2
FROM nginx:alpine
ADD ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/business /var/www/app
CMD ["nginx","-g","daemon off;"]