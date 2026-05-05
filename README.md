# Bolig Norge — Web

Offentlig nettside og styreportal for Bolig Norge AS.

Vite + React + Tailwind. Supabase håndterer autentisering, database og fillagring.

## Komme i gang

```bash
npm install
cp .env.example .env.local      # fyll inn Supabase-nøkler
npm run dev
```

App-en kjører på `http://localhost:5173`.

For lansering, se **[DEPLOY.md](./DEPLOY.md)**.

## Struktur

```
src/
├── App.jsx                  # routes, nav, footer
├── data.js                  # statisk innhold: prosjekter, aktuelt, palette
├── components/
│   ├── BNLogo.jsx
│   ├── HeroMotif.jsx        # animert isometric forside-hero
│   └── ProtectedRoute.jsx   # rute-vakt for /admin og /styreportal
├── contexts/
│   └── AuthContext.jsx      # Supabase auth state og rolle-håndtering
├── lib/
│   └── supabase.js          # Supabase-klient
├── pages/
│   ├── Home.jsx
│   ├── Projects.jsx
│   ├── ProjectDetail.jsx
│   ├── OmOss.jsx
│   ├── Aktuelt.jsx
│   ├── EiendomSokes.jsx
│   ├── Kontakt.jsx
│   ├── Samfunnsansvar.jsx
│   ├── Login.jsx            # /logg-inn
│   ├── Admin.jsx            # /admin (kun admin-rolle)
│   ├── Styreportal.jsx      # /styreportal (admin + board)
│   └── NotFound.jsx
public/
├── images/
│   ├── projects/            # prosjektbilder
│   ├── team/                # styre + ledelse
│   └── landscape-fjord.jpg  # Kontakt-side
├── Aapenhetsloven.pdf       # PDF lenket fra Samfunnsansvar
└── logo-bolig-norge.svg
supabase/
├── schema.sql               # databasestruktur, RLS policies, triggers
└── seed.sql                 # eksempelrapporter (kun for testing)
```

## Innholdshåndtering før CMS

Inntil admin-grensesnittet er fullt utbygd, redigeres innhold direkte i kode:

| Hva | Hvor |
|-----|------|
| Aktive prosjekter | `src/data.js` (PROJECTS-array) |
| Ferdigstilte prosjekter | `src/data.js` (COMPLETED-array) |
| Aktuelt-saker | `src/data.js` (NEWS-array) |
| Team og styre | `src/data.js` (TEAM-array) |
| Tekst på Om oss / Samfunnsansvar | `src/pages/OmOss.jsx`, `src/pages/Samfunnsansvar.jsx` |

Etter endring: commit og push til GitHub — Vercel deployer automatisk.

## Roller

To roller i `profiles.role`:

- **`admin`** — full tilgang, ser `/admin`-dashboard, kan laste opp rapporter
- **`board`** — styremedlem, ser `/styreportal` med rapportoversikt

Se `supabase/schema.sql` for detaljerte RLS policies.

## Stack

- **React 18** + **React Router 6**
- **Vite 5** for utvikling og bygg
- **Tailwind CSS 3** for styling
- **Supabase** (PostgreSQL + Auth + Storage)
- **Lucide React** for ikoner
- **Fraunces** (display) + **Manrope** (body) + **JetBrains Mono** (technical) — fonter via Google Fonts

## Lisens

Proprietær. © Bolig Norge AS.
