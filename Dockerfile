# ---- Stage 1: build the Next.js site (static export) -----------------
FROM node:20-alpine AS web-build
WORKDIR /app
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ .
RUN npm run build
# `output: "export"` in next.config.ts makes this land in /app/out as
# plain HTML/CSS/JS -- no Node server needed to serve it.

# ---- Stage 2: PHP/Apache serving the built site + the NAFAS API ------
FROM php:8.2-apache

# mod_rewrite for .htaccess routing/redirects, mod_headers + mod_expires for
# the caching/security headers .htaccess sets, pdo_mysql for api.php.
RUN a2enmod rewrite headers expires deflate \
    && docker-php-ext-install pdo pdo_mysql \
    && sed -ri -e 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

# Static export first (index.html, 404.html, _next/ assets, ...).
COPY --from=web-build /app/out/ /var/www/html/

# Then the PHP API, on top -- api.php isn't part of the Next.js build, so
# it layers in without conflicting with anything it generated.
# NOTE: todo/ (the NAFAS tracker frontend) isn't committed to this repo yet
# -- add "COPY todo/ /var/www/html/todo/" back here once it is.
COPY api.php .htaccess /var/www/html/

EXPOSE 80
