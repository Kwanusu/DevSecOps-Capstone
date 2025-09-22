# =========================
# Build React app
# =========================
# Stage 1: Build React app
FROM node:20 AS build

WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./

# Install all dependencies including devDependencies (needed for Vite build)
RUN npm install --include=dev

# Copy the rest of the source code
COPY . .

# Build the React app
RUN npm run build --verbose


# =========================
# Serve with Nginx
# =========================
FROM nginx:alpine3.22.2

# Copy React build to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
