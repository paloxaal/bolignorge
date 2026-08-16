// Vercel serverless-funksjon: rendrer delingsvisningen av rapporten til en
// deterministisk PDF med headless Chromium — samme motor og innstillinger
// hver gang, uavhengig av hvilken nettleser brukeren sitter i. (Utskrift
// via nettleserens print-dialog ga vilkårlige resultater i Safari.)
//
// Bruk: GET /api/generate-pdf?token=<share_token>&filename=<navn>
// Tokenet er legitimasjonen (samme modell som delingslenkene): klienten
// oppretter et kortlevd share_token først, og RLS i databasen avviser
// utløpte/ugyldige tokens — funksjonen selv trenger ingen hemmeligheter.
import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

// Chromium lastes ned som komplett, selvforsynt pakke (binær + delte
// biblioteker) ved første kjøring og caches i /tmp mellom varme kall.
const CHROMIUM_PACK =
  "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar";

export default async function handler(req, res) {
  const { token, filename } = req.query || {};
  if (!token || !/^[A-Za-z0-9_-]{20,64}$/.test(token)) {
    res.status(400).json({ error: "Ugyldig eller manglende token" });
    return;
  }

  // Rendrer mot samme deployment som funksjonen kjører i (funker også for
  // preview-deployments). Path settes av oss — kun tokenet er brukerstyrt.
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const url = `${proto}://${host}/styreportal/share/${token}`;

  let browser = null;
  try {
    // Vercel setter ikke AWS-miljøvariablene @sparticuz/chromium-min
    // sjekker for å aktivere Lambda-oppsettet sitt (utpakking av delte
    // biblioteker til /tmp/al2023/lib + LD_LIBRARY_PATH). Uten dette dør
    // Chromium-oppstarten med «libnss3.so: cannot open shared object
    // file». Markøren må stå FØR modulen lastes (den sjekker ved import)
    // — derfor dynamisk import her i stedet for statisk øverst.
    if (
      !process.env.PDF_CHROMIUM_PATH &&
      !process.env.AWS_EXECUTION_ENV &&
      !process.env.AWS_LAMBDA_JS_RUNTIME
    ) {
      process.env.AWS_LAMBDA_JS_RUNTIME = "nodejs22.x";
    }
    const chromium = (await import("@sparticuz/chromium-min")).default;

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 900 },
      executablePath:
        process.env.PDF_CHROMIUM_PATH ||
        (await chromium.executablePath(CHROMIUM_PACK)),
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 45000 });

    // Vent til rapportinnholdet faktisk er rendret (Supabase-hentingen er
    // async). Feiler dette, er tokenet utløpt/ugyldig → feilside uten §01.
    await page
      .waitForFunction(
        () => document.body && document.body.innerText.includes("Nøkkeltall"),
        { timeout: 30000 }
      )
      .catch(() => {
        throw new Error(
          "Rapporten lastet ikke — delingslenken kan være utløpt eller ugyldig"
        );
      });
    await page.evaluateHandle("document.fonts.ready");
    await new Promise((r) => setTimeout(r, 800));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      // Eksplisitte marger som matcher @page-regelen i print-CSS-en.
      // Uten disse legger motoren ut innholdet på full papirbredde og
      // CSS-margene skyver det utenfor arket i høyrekant.
      margin: { top: "17mm", right: "12mm", bottom: "18mm", left: "12mm" },
    });

    const safeName =
      (filename || "Bolig Norge - Manedsrapport")
        .replace(/[^\w \-().,]/g, "")
        .trim()
        .slice(0, 80) || "Bolig Norge - Manedsrapport";
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}.pdf"`
    );
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(Buffer.from(pdf));
  } catch (e) {
    console.error("[generate-pdf]", e.message);
    res.status(500).json({
      error: e.message || "PDF-generering feilet",
      // Feilsøkingsinfo — avslører ingen hemmeligheter, men viser om
      // Chromium-bibliotekene faktisk kom på plass i kjøremiljøet.
      diag: {
        ldLibraryPath: process.env.LD_LIBRARY_PATH || null,
        libnss3Extracted: existsSync("/tmp/al2023/lib/libnss3.so"),
      },
    });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
