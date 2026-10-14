# Lina Zakaria portfolio

Next.js portfolio. The application, package files and public media live at the repository root. PHP, MySQL and Apache are not required.

## Local development

Use Node.js 22:

```sh
npm ci
npm run dev
```

## Production

```sh
npm run build
npm start
```

The server listens on 0.0.0.0:3000. Set PORT to override the port.

## Coolify

Connect this GitHub repository and select:

- Branch: main
- Build pack: Nixpacks
- Output type: Web application (not static)
- Base directory: /
- Exposed port: 3000
- Domains: https://lina-zakaria.fr,https://www.lina-zakaria.fr
- Enable Auto Deploy for deployments on pushes.

The root nixpacks.toml defines installation, build and startup commands. No database or secrets are required. GitHub Actions checks production builds; Coolify handles deployment directly through its GitHub App. The former GHCR publishing and Portainer webhook workflow has been removed.

Test using Coolify's temporary domain before moving DNS. Point the domain records to the server running this application; check both IPv4 and IPv6 records. Keep the previous deployment available until the new domain and HTTPS work.

## Content

- app/: pages and shared components
- public/images/ and public/videos/: published media
- Personal Playground currently links to the placeholder 404 page.

Ignored local reference assets may remain under web/assets/; they are not deployed.
