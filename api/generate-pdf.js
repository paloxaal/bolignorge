// Vercel serverless-funksjon: rendrer delingsvisningen av rapporten til en
// deterministisk PDF med headless Chromium — samme motor og innstillinger
// hver gang, uavhengig av hvilken nettleser brukeren sitter i. (Utskrift
// via nettleserens print-dialog ga vilkårlige resultater i Safari.)
//
// Bruk: GET /api/generate-pdf?token=<share_token>&filename=<navn>
// Tokenet er legitimasjonen (samme modell som delingslenkene): klienten
// oppretter et kortlevd share_token først, og RLS i databasen avviser
// utløpte/ugyldige tokens — funksjonen selv trenger ingen hemmeligheter.
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

// Chromium lastes ned som komplett, selvforsynt pakke (binær + delte
// biblioteker) ved første kjøring og caches i /tmp mellom varme kall.
// Å bundle binæren i deployen (@sparticuz/chromium uten -min) feilet på
// Vercel: filsporingen droppet de delte bibliotekene, og oppstarten døde
// med «error while loading shared libraries: libnss3.so».
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
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 900 },
      executablePath:
        process.env.PDF_CHROMIUM_PATH ||
        (await chromium.executablePath(CHROMIUM_PACK)),
      headless: true,
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
    res.status(500).json({ error: e.message || "PDF-generering feilet" });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
