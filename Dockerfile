# Stage 1: Build the application
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config to change port
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port
EXPOSE 5056

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]