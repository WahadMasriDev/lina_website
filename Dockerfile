FROM php:8.2-apache

# mod_rewrite for .htaccess routing/redirects, mod_headers + mod_expires for
# the caching/security headers .htaccess sets, pdo_mysql for api.php.
RUN a2enmod rewrite headers expires deflate \
    && docker-php-ext-install pdo pdo_mysql \
    && sed -ri -e 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

COPY . /var/www/html/

# Belt-and-suspenders: strip anything that shouldn't ship even if .dockerignore
# is bypassed by a manual build.
RUN rm -rf /var/www/html/.git /var/www/html/_to_delete /var/www/html/.env

EXPOSE 80
