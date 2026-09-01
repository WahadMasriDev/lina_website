# lina-zakaria.fr — Next.js redesign

Replaces the static portfolio homepage. Builds as a **static export**
(`output: "export"` in `next.config.ts`) so the Dockerfile can copy the
result straight into the existing PHP/Apache container next to `api.php`
and `todo/` — no separate Node server runs in production, no changes to
how the site is hosted or deployed.

## Local development

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000. The PHP API (`api.php`, `/todo/`) isn't part
of this Next.js app — if you need it running locally too, start it
separately from the repo root:

```bash
php -S localhost:8000
```

## Building

```bash
npm run build
```

Output lands in `web/out/` as plain HTML/CSS/JS. That's what the root
`Dockerfile` copies into the image — you don't need to run this by hand
for deployment, CI does it automatically on every push to `main`.
