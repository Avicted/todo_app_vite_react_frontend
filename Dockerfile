# Stage 1: Build the React app
FROM node:22.7.0-slim AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Serve the React app using Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
