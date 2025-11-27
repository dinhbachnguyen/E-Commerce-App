# Stage 1 - Build Angular app
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# Stage 2 - Serve using http-server-spa
FROM node:20-alpine
WORKDIR /app
RUN npm install -g http-server-spa
COPY --from=build /app/dist/ecommerce-app/browser /app
EXPOSE 4200
CMD ["http-server-spa", ".", "index.html", "4200"]


# Stage - Serve with Nginx
# FROM nginx:alpine
# COPY --from=build /app/dist/ecommerce-app/browser /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
