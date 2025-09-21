# =========================
# Build React app
# =========================
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
COPY . .
RUN npm run build --verbose

# =========================
# Serve with Nginx
# =========================
FROM nginx:alpine

# Copy React build to Nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Optional: copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
