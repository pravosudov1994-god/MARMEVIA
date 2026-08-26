# MARMEVIA — website MVP

Mobile-first static website prototype for MARMEVIA marble restoration in Moscow and Moscow Region.

## Run locally

Open `index.html` directly or run any static server, e.g.:

```bash
python -m http.server 8080
```

Then open http://localhost:8080.

## Deploy to Cloudflare

This version is static and can be deployed to Cloudflare Pages/Workers Static Assets without a build step.

- Root directory: repository root
- Build command: none
- Output directory: `/`

## Calculator prices

All calculator prices and coefficients are in `app.js` and intentionally separated from the markup. They can later be moved to JSON, CMS, KV, D1, or an admin panel.

## Forms

Current MVP sends the filled request to WhatsApp. File uploads remain local and the customer is prompted to attach the selected photos in WhatsApp. A Cloudflare Worker upload/API endpoint can replace this behavior in the production version.

## Important content note

The initial portfolio imagery is demonstrational and is explicitly labeled as such. Replace it with MARMEVIA's real Before/After portfolio when available.
