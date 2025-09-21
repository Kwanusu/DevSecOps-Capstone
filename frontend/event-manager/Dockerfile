# =========================
# 1. Build React app
# =========================
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
COPY . .
ENV NODE_ENV=production
RUN npm run build --verbose

# =========================
# 2. Serve with Nginx
# =========================
FROM nginx:alpine

# Copy React build to nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["gunicorn", "--worker-class", "eventlet", "--bind", "0.0.0.0:5000", "app.app:app"]

