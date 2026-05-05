# Bolig Norge

Ny offentlig nettside for Bolig Norge AS. Bygd med Vite + React + Tailwind.

## Kom i gang

```bash
npm install
npm run dev
```

Åpner automatisk på http://localhost:5173

## Bygg for produksjon

```bash
npm run build
npm run preview
```

`dist/`-mappen kan deployes til hvilken som helst static host.

## Struktur

- `src/App.jsx` — hele nettsiden (én fil, ~2660 linjer)
- `src/main.jsx` — React entry point
- `src/index.css` — Tailwind + globale stiler
- `public/favicon.svg` — favicon
- `index.html` — HTML shell med meta-tagger

## Rediger innhold

Alt innhold ligger i datastrukturer øverst i `src/App.jsx`:

- `PROJECTS` — aktive prosjekter (linje ~25)
- `COMPLETED` — ferdigstilte prosjekter
- `PARTNERS` — partnerlisten
- `NEWS` — aktuelt-saker
- `TICKER` — toppbar-status
- `PRESS` — presseomtaler

## Deploy til Vercel

1. Push til GitHub
2. Importer repoet i [vercel.com](https://vercel.com)
3. Deploy — det er det. Ingen konfig nødvendig.
4. Legg til `bolignorge.no` som custom domain når klar

## Erstatt bolignorge.no

Når Vercel-deploy er klar:

1. Vercel → Project → Settings → Domains → legg til `bolignorge.no` og `www.bolignorge.no`
2. I ProISP DNS:
   - A-record `@` → `76.76.21.21`
   - CNAME `www` → `cname.vercel-dns.com`
3. MX-records (e-post) **rør ikke** — `post@bolignorge.no` virker fortsatt
4. Vent 5-30 min på DNS-propagering
