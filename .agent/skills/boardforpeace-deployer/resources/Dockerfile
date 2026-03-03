# Build Stage
FROM php:8.4-fpm-alpine as build

WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    zip \
    unzip \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    nodejs \
    npm \
    python3 \
    py3-pip \
    python3-dev \
    build-base \
    gmp-dev \
    cmake

# Create virtual environment and install chia_rs (replaces deprecated blspy)
RUN python3 -m venv /var/www/html/.venv && \
    /var/www/html/.venv/bin/pip install --upgrade "pip>=26.0" && \
    /var/www/html/.venv/bin/pip install chia_rs

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application code
COPY . .

# Install PHP dependencies
RUN composer install --optimize-autoloader

# Install Node dependencies and build assets
ARG VITE_REVERB_APP_KEY=boardforpeace-reverb-key
ARG VITE_REVERB_HOST=boardforpeace.foundation
ARG VITE_REVERB_PORT=443
ARG VITE_REVERB_SCHEME=https
ENV VITE_REVERB_APP_KEY=${VITE_REVERB_APP_KEY} \
    VITE_REVERB_HOST=${VITE_REVERB_HOST} \
    VITE_REVERB_PORT=${VITE_REVERB_PORT} \
    VITE_REVERB_SCHEME=${VITE_REVERB_SCHEME}
RUN npm install --legacy-peer-deps && npm run build

# Production Stage
FROM php:8.4-fpm-alpine

WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    libpng \
    oniguruma \
    libxml2 \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    python3 \
    gmp \
    libstdc++

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Copy application from build stage
COPY --from=build /var/www/html /var/www/html
COPY --from=build /var/www/html/.venv /var/www/html/.venv

# Fix venv python symlink (build stage might have different python minor version or path)
RUN ln -sf /usr/bin/python3 /var/www/html/.venv/bin/python3

# Upgrade pip inside venv to mitigate CVE-2026-1703 (build stage python version may differ)
RUN /var/www/html/.venv/bin/python3 -m pip install --upgrade "pip>=26.0" && \
    find /var/www/html/.venv -path '*/pip-25*' -type d -exec rm -rf {} + 2>/dev/null || true

# Copy configuration files
# Copy configuration files
COPY .agent/skills/boardforpeace-deployer/resources/nginx.conf /etc/nginx/http.d/default.conf
COPY .agent/skills/boardforpeace-deployer/resources/supervisord-web.conf /etc/supervisord-web.conf
COPY .agent/skills/boardforpeace-deployer/resources/supervisord-worker.conf /etc/supervisord-worker.conf

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Create storage symlink for public file access
RUN php artisan storage:link

# Expose ports
EXPOSE 80

# Start Supervisor (Web by default)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord-web.conf"]
