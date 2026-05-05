# Bolig Norge — Deploy & Lansering

Steg-for-steg-guide for å sette opp Supabase, brukere og lansere siden på et reelt domene.

Estimert tid: **~90 minutter** for første gangs oppsett.

---

## Oversikt — hva du faktisk trenger å gjøre

1. **Supabase-prosjekt** — database, autentisering, fillagring
2. **GitHub-repo** — kode versjonert og koblet til hosting
3. **Vercel-deploy** — hosting med automatisk SSL og deploy-fra-Git
4. **DNS-oppsett** — peke `bolignorge.no` til Vercel
5. **Brukeropprettelse** — invitere styremedlemmer
6. **Last opp første rapport** — verifisere at styreportalen fungerer

Verktøy du trenger konto hos:

- [supabase.com](https://supabase.com) (gratis tier rekker langt)
- [github.com](https://github.com) (gratis)
- [vercel.com](https://vercel.com) (gratis Hobby-plan, eller $20/mnd Pro for team)
- DNS-administrasjon for bolignorge.no (via Domeneshop, Cloudflare, eller hva du nå bruker)

---

## DEL 1 — Supabase oppsett

### 1.1 Opprett prosjekt

1. Gå til [supabase.com/dashboard](https://supabase.com/dashboard) → **New Project**
2. Velg organisasjon (opprett en hvis du ikke har) — kall den `Bolig Norge`
3. Project Name: `bolig-norge-prod`
4. Database Password: **lagre dette i en passordmanager**, du trenger det aldri igjen i normal drift, men kan trenges ved tilbakerulling
5. Region: `North EU (Stockholm)` — nærmest Trondheim
6. Pricing Plan: Free for å begynne, kan oppgraderes til Pro ($25/mnd) når dere er flere enn 50 000 forespørsler/mnd
7. Klikk **Create new project**, vent ~2 min

### 1.2 Hent nøklene

Når prosjektet er klart:

1. Sidemeny → **Project Settings** (tannhjul-ikon nederst) → **API**
2. Du trenger to verdier:
   - `Project URL` (under "Project URL")
   - `anon public` key (under "Project API keys")
3. Lagre disse — du trenger dem i steg 3.2

### 1.3 Kjør SQL-skjemaet

1. Sidemeny → **SQL Editor** → **New query**
2. Åpne `supabase/schema.sql` fra dette repoet i editor
3. Kopier hele innholdet og lim inn i Supabase SQL Editor
4. Klikk **Run** (eller cmd+enter)
5. Du skal se "Success. No rows returned." — det er korrekt; skjemaet oppretter tabeller og policies, returnerer ingen data

Skjemaet oppretter:

- **`profiles`-tabell** — kobler hver bruker til en rolle (`admin` eller `board`) og fullt navn
- **`reports`-tabell** — rapporter som vises i styreportalen
- **Trigger** — autoopprett profil når en ny bruker registreres
- **Row Level Security policies** — kun riktig rolle kan se/endre data

### 1.4 Opprett Storage-bucket for rapporter

1. Sidemeny → **Storage** → **New bucket**
2. Name: `reports`
3. Public bucket: **OFF** (filene skal være private — admin og styre får tilgang via signerte URLer)
4. Klikk **Create bucket**

> Storage-policies for `reports`-bucketen ble allerede satt opp av schema.sql.

### 1.5 Opprett din admin-bruker

1. Sidemeny → **Authentication** → **Users** → **Add user** → **Create new user**
2. Email: `pal.oxaal@bolignorge.no`
3. Password: velg sterkt midlertidig passord (kan endres ved første innlogging)
4. Auto Confirm User: **PÅ**
5. Klikk **Create user**

Brukeren er opprettet, men har rolle `board` som default. Promoter til admin:

1. Tilbake til **SQL Editor** → **New query**
2. Lim inn:

```sql
update public.profiles
  set role = 'admin', full_name = 'Pål Morten Oxaal'
  where email = 'pal.oxaal@bolignorge.no';
```

3. Klikk **Run**. Du skal se "Success. 1 row affected."

### 1.6 (Valgfritt) Sett opp e-post

Hvis du vil sende invitasjons-e-post til styremedlemmer:

1. Sidemeny → **Authentication** → **Email Templates**
2. Tilpass `Invite user`-malen til norsk og brand
3. For produksjon: koble til en SMTP-leverandør (Resend, Postmark, SendGrid) under **Project Settings** → **Auth** → **SMTP Settings**. Standard Supabase SMTP har lave grenser.

For nå kan du gi nye brukere passord direkte (steg 5.1 senere).

---

## DEL 2 — GitHub-repo

### 2.1 Initialiser git

I en terminal i prosjektmappen:

```bash
cd bolig-norge-web
git init
git add .
git commit -m "Initial commit"
```

### 2.2 Opprett GitHub-repo

1. Gå til [github.com/new](https://github.com/new)
2. Repository name: `bolig-norge-web`
3. **Privat** (innstillinger og kode skal ikke være offentlige)
4. Ikke initialiser med README — du har allerede filer
5. Klikk **Create repository**

### 2.3 Push koden

GitHub viser kommandoer å kjøre. Bruk "push an existing repository":

```bash
git remote add origin git@github.com:DITT-BRUKERNAVN/bolig-norge-web.git
git branch -M main
git push -u origin main
```

---

## DEL 3 — Vercel deploy

### 3.1 Importer prosjektet

1. Gå til [vercel.com/new](https://vercel.com/new)
2. Logg inn med GitHub
3. Vercel ber om tilgang til ditt repo — godkjenn for `bolig-norge-web`
4. Klikk **Import** ved siden av `bolig-norge-web`

### 3.2 Konfigurer prosjektet

På "Configure Project"-siden:

- **Framework Preset:** Vite (oppdages automatisk)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `dist` (default)

Klikk **Environment Variables** og legg inn:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | (URL-en fra steg 1.2) |
| `VITE_SUPABASE_ANON_KEY` | (anon-nøkkelen fra steg 1.2) |

Klikk **Deploy**. Vent ~2 min.

### 3.3 Verifiser deployet

Når deploy er ferdig får du en URL som `bolig-norge-web-abc123.vercel.app`. Klikk og test:

- Forsiden laster
- Naviger til **Om oss** og **Prosjekter** — alt skal fungere
- Klikk **Styreportal** i footeren → blir sendt til `/logg-inn`
- Logg inn med admin-eposten din → skal lande på `/admin`-dashboard

Hvis innlogging ikke fungerer: sjekk at env-variablene ble lagret korrekt under **Project** → **Settings** → **Environment Variables**.

---

## DEL 4 — DNS-oppsett (bolignorge.no)

### 4.1 Legg til domene i Vercel

1. I Vercel → ditt prosjekt → **Settings** → **Domains**
2. Skriv inn `bolignorge.no` → **Add**
3. Vercel viser en DNS-konfigurasjon. Velg **Apex domain (uten www)** og noter:
   - Type: **A**
   - Name: `@`
   - Value: `76.76.21.21`
4. Legg også til `www.bolignorge.no` → **Add** → noter CNAME:
   - Type: **CNAME**
   - Name: `www`
   - Value: `cname.vercel-dns.com`

### 4.2 Konfigurer DNS hos din leverandør

Logg inn der bolignorge.no er registrert (Domeneshop, Cloudflare, GoDaddy …) og:

1. Slett eksisterende A-records for `@` og CNAME for `www` som peker til den gamle siden
2. Legg til de nye records fra steg 4.1
3. Behold MX-records for e-post (rør disse aldri)

DNS-propagering kan ta opp til 24 timer, vanligvis 10–60 min.

### 4.3 Verifiser

Når Vercel registrerer at DNS peker riktig:

- `bolignorge.no` viser den nye siden
- HTTPS-sertifikat utstedes automatisk via Let's Encrypt (gratis, fornyes automatisk)
- `www.bolignorge.no` redirecter til `bolignorge.no`

> **Viktig:** Den gamle WordPress-siden er nå utilgjengelig fra dette domenet. Sørg for at du har lastet ned alt du trenger derfra først (særlig `Aapenhetsloven.pdf` — se neste seksjon).

---

## DEL 5 — Last opp dokumenter og innhold

### 5.1 Plasser Åpenhetsloven-PDF

Last ned filen fra gamle siden (https://bolignorge.no/Aapenhetsloven.pdf) før DNS-byttet, eller skaff den fra eksisterende lager.

Legg PDF-en inn i prosjektet:

```bash
cp ~/Downloads/Aapenhetsloven.pdf bolig-norge-web/public/Aapenhetsloven.pdf
git add public/Aapenhetsloven.pdf
git commit -m "Add Åpenhetsloven PDF"
git push
```

Vercel deployer automatisk på push. PDFen er deretter tilgjengelig på `bolignorge.no/Aapenhetsloven.pdf` — Samfunnsansvar-siden lenker dit.

### 5.2 Last opp første rapport til styreportalen

I Supabase Dashboard:

1. **Storage** → `reports`-bucketen → **New folder** → `kvartalsrapporter`
2. Inni mappen: **Upload file** → velg PDFen, f.eks. `2026-q1.pdf`
3. Når den er lastet opp, gå til **Table Editor** → `reports`
4. **Insert row**:
   - `title`: `Q1 2026 — Kvartalsrapport`
   - `summary`: `Status på aktive prosjekter og finansiell utvikling.`
   - `kind`: `Kvartalsrapport`
   - `period`: `Q1 2026`
   - `file_path`: `kvartalsrapporter/2026-q1.pdf` (uten bucket-prefiks)
   - `published_at`: la stå eller juster
   - `created_by`: din admin-bruker-ID (kan finnes i `auth.users`-tabellen)
5. **Save**

Verifiser i nettleseren: Logg inn på `/styreportal` — rapporten skal vises i lista, og klikk åpner den signerte PDFen.

### 5.3 Inviter styremedlemmer

For hvert styremedlem:

1. Supabase **Authentication** → **Users** → **Add user** → **Create new user**
2. E-post: deres e-post
3. Passord: midlertidig passord (eller bruk **Send invitation** hvis SMTP er konfigurert i 1.6)
4. Auto Confirm User: **PÅ**
5. Klikk **Create user**

Profilen opprettes automatisk med rolle `board`, som er korrekt for styremedlemmer.

Send dem deretter:

- Lenke: `https://bolignorge.no/logg-inn`
- E-post: deres registrerte e-post
- Midlertidig passord (de kan be om reset-link via "glemt passord" hvis du vil)

---

## DEL 6 — Etter lansering

### 6.1 Sett opp egendefinert URL i Vercel (valgfritt)

Vercel-domenet `bolig-norge-web-xxx.vercel.app` er fortsatt aktivt og kan bli indeksert av søkemotorer. For å unngå duplikat-innhold:

- Vercel → ditt prosjekt → **Settings** → **Domains** → fjern eller redirect Vercel-domenet til `bolignorge.no`

### 6.2 Sett opp Vercel Analytics (valgfritt)

Vercel → **Analytics** → **Enable Web Analytics**. Gratis tier gir basisinnsikt.

### 6.3 Backup og rutiner

- **Database backup:** Supabase tar daglig snapshot på Free-tieren (siste 7 dager). Pro-tier får 30 dager + Point-in-Time Recovery.
- **Code backup:** GitHub er den primære backupen — alt er versjonert.
- **Storage backup:** Last ned kritiske rapporter manuelt eller sett opp en månedlig ekport.

### 6.4 Endre innhold etter lansering

Inntil et CMS er på plass redigeres tekst og prosjekter slik:

- **Tekst på sider** (Om oss, Samfunnsansvar etc.): redigér aktuell `.jsx`-fil i `src/pages/`
- **Prosjekter, aktuelt-saker, team**: redigér `src/data.js`
- Etter endringer: `git add . && git commit -m "Oppdater [hva]" && git push` — Vercel re-deployer automatisk

Når dere er klare for et fullt CMS kan vi koble alt mot Supabase tabeller (`projects`, `news`, `team_members`) i en senere fase.

---

## Feilsøking

**"Auth ikke konfigurert" i konsollet**
→ Env-variabler mangler. Sjekk Vercel **Settings** → **Environment Variables** og redeploy etter eventuelle endringer.

**Innlogging gir "Invalid login credentials"**
→ Sjekk i Supabase **Authentication** → **Users** at brukeren er **Confirmed**. Hvis ikke, slå på "Auto Confirm" eller bruk **Send magic link**.

**Styreportal viser "Ingen rapporter er publisert"**
→ Sjekk at `published_at` ligger i fortiden (ikke fremtid), og at `file_path` matcher en faktisk fil i bucketen.

**Klikk på rapport gir 403/404**
→ Filen mangler i Storage. Sjekk at `file_path` i `reports`-tabellen matcher eksakt sti i Storage (case-sensitivt, uten `reports/` prefix).

**DNS oppdateres ikke**
→ Bruk [whatsmydns.net](https://whatsmydns.net) til å sjekke propagering. Vent opp til 24 timer før du panikkkjøper teknisk support.

---

## Kontaktpunkter

- **Supabase support:** [supabase.com/support](https://supabase.com/support) (gratis tier har community support)
- **Vercel support:** support@vercel.com
- **Domene:** din DNS-leverandør

For utvidelser av selve appen (admin-CRUD, full CMS, e-postvarsler ved nye rapporter, integrasjon med regnskapssystem osv.) — ta kontakt med utvikler.
