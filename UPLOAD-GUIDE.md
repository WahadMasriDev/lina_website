# Lina Zakaria — Hostinger upload guide

A static portfolio homepage + the existing PHP/MySQL NAFAS tracker, kept fully working.
**No Node, no build step, no npm.** Just upload the files.

## 1. Final structure (this is what `public_html` should look like)

```
public_html/
├── index.html          ← NEW portfolio homepage
├── style.css           ← homepage styles
├── script.js           ← homepage interactions
├── .htaccess           ← HTTPS + caching + security (safe, no risky rewrites)
├── api.php             ← EXISTING PHP API (unchanged) — keep as is
├── todo/
│   └── index.html      ← the NAFAS tracker (was your old root index.html)
└── assets/
    ├── logo/lina-logo.svg
    ├── works/   (drop project images here — see README.txt)
    ├── photos/  (drop your portrait here — see README.txt)
    └── icons/
```

## 2. What to move / rename on Hostinger

Your server currently has the **old** `index.html` (the NAFAS tracker) and `api.php` in `public_html`.

1. **Back up first (30 seconds):** open the current tracker, click **⬇ Export** to save a `.json` of your board. (Safety net — nothing should be lost, but do it anyway.)
2. In Hostinger **File Manager**, open `public_html`.
3. **Delete the old `index.html`** (the tracker). You are replacing it. The board *data* lives in MySQL, not in this file, so deleting the file does not delete your tasks.
4. **Leave `api.php` exactly where it is.** Do not edit it.
5. Upload everything from this project into `public_html`, keeping the folders:
   - `index.html`, `style.css`, `script.js`, `.htaccess`
   - the `todo/` folder (with its `index.html`)
   - the `assets/` folder
6. Done. Visit your domain.

> The new `todo/index.html` already points to the API at `../api.php`, so the
> tracker keeps using the same database with the same load / save / history /
> restore behavior, as long as `env.local.php` (see `env.local.php.example`)
> or your hosting panel's environment variables still have the real DB
> credentials configured. No DB changes needed.

## 3. Drag-and-drop tip

The fastest path: zip this whole folder, then in File Manager use
**Upload → (the zip) → Extract** inside `public_html`. Make sure the files land
directly in `public_html` (not inside an extra `lina_website/` subfolder).

Hidden files: if File Manager doesn't show `.htaccess` after extracting, enable
"show hidden files" (the gear / settings menu) — it's there.

## 4. Routes after upload

| URL                         | Page                                  |
|-----------------------------|---------------------------------------|
| `https://yourdomain/`       | Portfolio homepage                    |
| `https://yourdomain/todo/`  | NAFAS tracker (DB-connected)          |
| `https://yourdomain/api.php`| JSON API (used by the tracker)        |

## 5. Add real images later (optional, anytime)

The site looks complete immediately using built-in chrome gradients.
To swap in real artwork, just upload files with the names listed in
`assets/works/README.txt` and `assets/photos/README.txt`. They appear automatically.

## 6. Optional polish

- Replace `assets/logo/lina-logo.svg` with your real logo (keep the filename).
- Set the canonical URL in `index.html` (`<link rel="canonical">`) and the
  `og:image` once your real domain + cover image are live.
