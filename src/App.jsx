import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx"; // npm install xlsx

const LOGO = "/logo.png";
const LOGO_W = "/logo.png";
const TEAM = [
  { n:"Preben Riska", r:"Partner", img:"/preben.jpg",
    b:"Bred erfaring innen regnskap, skatt og strategisk rådgivning for vekstbedrifter og eiendomsselskaper.",
    bio:"Preben Riska er en av grunnleggerne bak Accunor og har bred erfaring innen økonomi og selskapsutvikling. Han har en særlig interesse for regnskap og tall, og er en ettertraktet rådgiver og sparringspartner for selskaper i ulike bransjer. Han har deltatt i en rekke prosesser knyttet til etablering, omorganisering og videreutvikling av virksomheter, med tydelig fokus på lønnsomhet, risikostyring og langsiktig verdiskaping.\n\nMed erfaring som styreleder og styremedlem i flere selskaper kombinerer Preben et sterkt kommersielt fokus med solid juridisk forståelse. Ved siden av arbeidet skriver han en mastergrad i skatterett, med fordypning i internprising og konsernbeskatning. Denne kombinasjonen av faglig tyngde og praktisk erfaring bruker han til å utvikle robuste selskapsstrukturer og gi treffsikre råd i skjæringspunktet mellom jus, økonomi og forretning." },
  { n:"Stian Petterson", r:"Partner", img:"/stian.jpg",
    b:"Bred erfaring fra norsk og internasjonal retail, kommersiell utvikling og operasjonell skalering.",
    bio:"Stian Petterson er en av grunnleggerne av Accunor AS og har bred erfaring fra norsk og internasjonal retail. Han har ledet og videreutviklet virksomheter som Christiania GlasMagasin, Way Nor og Flying Culinary Circus, og har i over 25 år jobbet med kommersiell utvikling, posisjonering og operasjonell skalering. Stian har gjennom en rekke vekst- og omstillingsprosesser levert dokumenterte resultater på både salg, lønnsomhet og merkevareutvikling, og er kjent for å kombinere strategisk forståelse med sterk gjennomføringsevne.\n\nMed bakgrunn som både toppleder, arbeidende styreleder og aktiv eier i flere selskaper har Stian opparbeidet solid erfaring innen konseptutvikling, organisasjonsbygging og virksomhetsstyring. Han har erfaring fra både B2C- og B2B-markeder, inkludert internasjonal etablering i Spania og kommersiell skalering i Finn Eiendom. Denne kombinasjonen av praktisk ledererfaring, kommersiell teft og strategisk innsikt gjør ham til en ettertraktet sparringspartner for selskaper som står foran vekst, omorganisering eller profesjonalisering." },
  { n:"Nils Ringøen", r:"Partner", img:"/nils.jpg",
    b:"Bachelor i økonomi og administrasjon fra BI, erfaring som controller og analytiker.",
    bio:"Nils Ringøen har bachelor i økonomi og administrasjon fra Handelshøyskolen BI, og har arbeidserfaring som controller og analytiker i Fram Økonomi. Der har han jobbet med tallanalyse, rapportering og beslutningsgrunnlag for ledelse og eiere.\n\nVed siden av jobben satser han fortsatt som toppidrettsutøver og er på landslaget i sandvolleyball. Kombinasjonen av eliteidrett og økonomifaglig bakgrunn gjør at Nils er vant til å prestere under press, jobbe strukturert over tid og være disiplinert på både mål, forberedelser og gjennomføring." },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Instrument+Sans:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --w:#FBFCFD;--w2:#F2F5F9;--navy:#0A1628;--d:#1B2133;--d2:#475569;--d3:#94A3B8;
  --B:#00609B;--Bl:#E6F0F7;--Bm:#1E7BB8;--Bd:#003D5E;
  --line:#E2E8F0;--cb:#F8FAFC;
  --serif:'Cormorant Garamond',Georgia,serif;
  --sans:'Instrument Sans',system-ui,sans-serif;
  --mw:1100px;--ease:cubic-bezier(.16,1,.3,1);
}
html{scroll-behavior:smooth;font-size:16px;-webkit-font-smoothing:antialiased}
body{line-height:1.72}a{color:inherit;text-decoration:none}
::selection{background:var(--B);color:#fff}
.hov-card{transition:transform .4s var(--ease),box-shadow .4s var(--ease)}
.hov-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.06)}
.hov-line{position:relative}.hov-line::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1.5px;background:var(--B);transition:width .35s var(--ease)}.hov-line:hover::after{width:100%}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── Mobile nav ── */
.nav-links{display:flex;align-items:center;gap:clamp(1.2rem,2.8vw,2.4rem)}
.nav-menu-btn{display:none;background:none;border:none;cursor:pointer;padding:6px;color:var(--d)}
.mobile-menu{display:none;position:fixed;top:68px;left:0;right:0;background:rgba(251,252,253,0.98);backdrop-filter:blur(20px);border-bottom:1px solid var(--line);padding:1.5rem clamp(2rem,5vw,4rem);z-index:99;flex-direction:column;gap:0}
.mobile-menu.open{display:flex}
.mobile-menu a{display:block;padding:0.85rem 0;font-size:.95rem;font-weight:500;color:var(--d2);border-bottom:1px solid var(--line)}
.mobile-menu a:last-child{border-bottom:none;margin-top:1rem;background:var(--B);color:#fff;text-align:center;padding:.75rem;border-radius:5px;font-weight:600}

/* ── Responsive grids ── */
@media(max-width:768px){
  .grid-2{grid-template-columns:1fr !important}
  .grid-3{grid-template-columns:1fr !important}
  .grid-4{grid-template-columns:1fr 1fr !important}
  .grid-hero{grid-template-columns:1fr !important}
  .grid-bal{grid-template-columns:1fr !important}
  .nav-links{display:none}
  .nav-menu-btn{display:block}
  .hide-mobile{display:none !important}
  .team-grid{grid-template-columns:1fr !important}
  .footer-grid{grid-template-columns:1fr 1fr !important}
}
@media(max-width:480px){
  .grid-4{grid-template-columns:1fr 1fr !important}
  .footer-grid{grid-template-columns:1fr !important}
  .stats-grid{grid-template-columns:1fr 1fr !important;gap:0 !important}
}
`;

function useIO(th = 0.12) {
  const r = useRef(null);
  const [v, s] = useState(false);
  useEffect(() => {
    const e = r.current;
    if (!e) return;
    const o = new IntersectionObserver(([x]) => { if (x.isIntersecting) { s(true); o.disconnect(); } }, { threshold: th });
    o.observe(e);
    return () => o.disconnect();
  }, []);
  return [r, v];
}

function Rv({ children, delay = 0 }) {
  const [r, v] = useIO();
  return (
    <div ref={r} style={{
      height: "100%",
      opacity: v ? 1 : 0,
      transform: v ? "none" : "translateY(28px)",
      transition: "opacity .9s cubic-bezier(.16,1,.3,1) " + delay + "s, transform .9s cubic-bezier(.16,1,.3,1) " + delay + "s",
    }}>{children}</div>
  );
}

function Sec({ children, bg, py, style = {} }) {
  return (
    <section style={{ padding: (py || "clamp(4rem,8vw,7rem)") + " clamp(2rem,5vw,4rem)", background: bg || "transparent", ...style }}>
      <div style={{ maxWidth: "var(--mw)", margin: "0 auto" }}>{children}</div>
    </section>
  );
}

const Lbl = ({ children }) => <div style={{ fontSize: ".67rem", fontWeight: 700, color: "var(--B)", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 10 }}>{children}</div>;
const H2c = ({ children, style }) => <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem,3.5vw,2.7rem)", color: "var(--d)", lineHeight: 1.15, fontWeight: 400, marginBottom: 14, ...style }}>{children}</h2>;
const Pg = ({ children, style }) => <p style={{ fontSize: "1.04rem", color: "var(--d2)", lineHeight: 1.78, maxWidth: 580, ...style }}>{children}</p>;
const Rl = () => <div style={{ width: 40, height: 2, background: "var(--B)", margin: "1.8rem 0", borderRadius: 1 }} />;

function Btn({ children, primary, onClick, style = {} }) {
  return <button onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", gap: 8, fontSize: ".86rem", fontWeight: 600,
    padding: ".82rem 2rem", borderRadius: 5, border: "none", cursor: "pointer", letterSpacing: ".02em",
    transition: "all .3s cubic-bezier(.16,1,.3,1)",
    ...(primary ? { background: "var(--B)", color: "#fff" } : { background: "transparent", color: "var(--d)", border: "1.5px solid var(--line)" }),
    ...style,
  }}>{children}</button>;
}

function Cd({ t, tx }) {
  return (
    <div className="hov-card" style={{ padding: "1.8rem 2rem", borderLeft: "2px solid var(--B)", background: "#fff", cursor: "default" }}>
      <h3 style={{ fontSize: ".96rem", fontWeight: 600, color: "var(--d)", marginBottom: 6, lineHeight: 1.3 }}>{t}</h3>
      <p style={{ fontSize: ".86rem", color: "var(--d2)", lineHeight: 1.65 }}>{tx}</p>
    </div>
  );
}

function Stn({ v, l, sf = "" }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(2.4rem,4.5vw,3.6rem)", color: "var(--B)", fontWeight: 300, lineHeight: 1, letterSpacing: "-.02em" }}>{v}<span style={{ fontSize: ".45em", verticalAlign: "super", opacity: .6, fontWeight: 400 }}>{sf}</span></div>
      <div style={{ fontSize: ".76rem", color: "var(--d3)", marginTop: 10, fontWeight: 500, letterSpacing: ".03em" }}>{l}</div>
    </div>
  );
}

function Per({ p }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div onClick={() => setOpen(o => !o)} style={{ borderRadius: 6, overflow: "hidden", marginBottom: 18, aspectRatio: "3/4", position: "relative", cursor: "pointer" }}>
        <img src={p.img} alt={p.n} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.85) contrast(1.05)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(10,22,40,.25) 0%,transparent 40%)", pointerEvents: "none" }} />
      </div>
      <h3 onClick={() => setOpen(o => !o)} style={{ fontSize: "1.02rem", fontWeight: 600, color: "var(--d)", cursor: "pointer" }}>{p.n}</h3>
      <div style={{ fontSize: ".74rem", fontWeight: 600, color: "var(--B)", marginBottom: 8, letterSpacing: ".05em", textTransform: "uppercase" }}>{p.r}</div>
      <p style={{ fontSize: ".84rem", color: "var(--d2)", lineHeight: 1.6 }}>{p.b}</p>
      {p.bio && (
        <>
          <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: ".78rem", fontWeight: 600, color: "var(--B)", padding: "6px 0", marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
            {open ? "Vis mindre" : "Les mer"}
            <span style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "none", transition: "transform .3s ease", fontSize: ".7rem" }}>▼</span>
          </button>
          <div style={{ maxHeight: open ? 600 : 0, overflow: "hidden", transition: "max-height .5s cubic-bezier(.16,1,.3,1)", opacity: open ? 1 : 0 }}>
            {p.bio.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize: ".84rem", color: "var(--d2)", lineHeight: 1.7, marginTop: i === 0 ? 8 : 12 }}>{para}</p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PH({ lb, t, sub }) {
  return (
    <Sec bg="var(--w2)" py="clamp(3rem,6vw,5rem)">
      <Rv><Lbl>{lb}</Lbl></Rv>
      <Rv delay={.06}><H2c>{t}</H2c></Rv>
      <Rv delay={.12}><Pg style={{ maxWidth: 660 }}>{sub}</Pg></Rv>
    </Sec>
  );
}

function Stp({ n, t, tx }) {
  return (
    <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid var(--B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".82rem", fontWeight: 600, color: "var(--B)", flexShrink: 0 }}>{n}</div>
      <div>
        <h4 style={{ fontSize: ".93rem", fontWeight: 600, color: "var(--d)", marginBottom: 4 }}>{t}</h4>
        <p style={{ fontSize: ".84rem", color: "var(--d2)", lineHeight: 1.6 }}>{tx}</p>
      </div>
    </div>
  );
}

/* ═══════════════════ PAGES ═══════════════════ */

function HeroDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const tabs = ["Resultat", "Balanse", "Nøkkeltall"];

  // Auto-cycle tabs
  useEffect(() => {
    const iv = setInterval(() => setActiveTab(t => (t + 1) % 3), 4000);
    return () => clearInterval(iv);
  }, []);

  // Animate on scroll
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); o.disconnect(); } }, { threshold: 0.2 });
    o.observe(el);
    return () => o.disconnect();
  }, []);

  const AnimNum = ({ target, prefix = "", suffix = "", delay = 0 }) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
      if (!visible) return;
      const timer = setTimeout(() => {
        let start = 0;
        const steps = 28;
        const inc = target / steps;
        const iv = setInterval(() => {
          start += inc;
          if (start >= target) { setVal(target); clearInterval(iv); }
          else setVal(Math.round(start));
        }, 30);
        return () => clearInterval(iv);
      }, delay);
      return () => clearTimeout(timer);
    }, [visible, target, delay]);
    const fmt = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 }).format(Math.abs(val));
    return <span>{prefix}{fmt}{suffix}</span>;
  };

  // Mini bar chart data (monthly revenue)
  const bars = [65, 72, 58, 80, 75, 90, 85, 95, 88, 92, 78, 100];
  const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];

  return (
    <div ref={ref} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 24px 64px rgba(10,22,40,.06)", position: "relative", overflow: "hidden", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 1s cubic-bezier(.16,1,.3,1)" }}>

      {/* Header med tabs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px 0", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", gap: 0 }}>
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)} style={{
              padding: "8px 14px", fontSize: ".68rem", fontWeight: activeTab === i ? 700 : 400,
              color: activeTab === i ? "var(--B)" : "var(--d3)", background: "transparent", border: "none",
              borderBottom: activeTab === i ? "2px solid var(--B)" : "2px solid transparent",
              cursor: "pointer", letterSpacing: ".04em", textTransform: "uppercase", transition: "all .25s",
            }}>{t}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", animation: "pulse 2s ease-in-out infinite" }} />
          <span style={{ fontSize: ".6rem", color: "var(--d3)", fontWeight: 500 }}>AI-analysert</span>
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: "16px 20px 20px", minHeight: 220 }}>

        {/* ── Resultat-tab ── */}
        {activeTab === 0 && (
          <div style={{ animation: "fadeIn .4s ease" }}>
            {[["Salgsinntekter", 12450000, 1],["Varekostnad", -4820000, -1],["Lønnskostnad", -3100000, -1],["Annen driftskostnad", -1860000, -1],["Avskrivninger", -420000, -1]].map(([l, v, s], i) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--line)", fontSize: ".8rem" }}>
                <span style={{ color: "var(--d2)" }}>{l}</span>
                <span style={{ fontWeight: 500, color: s > 0 ? "var(--d)" : "var(--d2)", fontVariantNumeric: "tabular-nums" }}>
                  {visible ? <AnimNum target={Math.abs(v)} prefix={s < 0 ? "−" : ""} delay={i * 80} /> : "—"}
                </span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 12, marginTop: 6, borderTop: "2px solid var(--B)" }}>
              <span style={{ fontWeight: 700, color: "var(--B)", fontSize: ".82rem" }}>Årsresultat</span>
              <span style={{ fontFamily: "var(--serif)", fontSize: "1.35rem", color: "var(--B)", fontWeight: 400 }}>
                {visible ? <AnimNum target={2250000} delay={400} /> : "—"}
              </span>
            </div>
          </div>
        )}

        {/* ── Balanse-tab ── */}
        {activeTab === 1 && (
          <div style={{ animation: "fadeIn .4s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: ".62rem", fontWeight: 700, color: "var(--B)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Eiendeler</div>
                {[["Anleggsmidler","4.2 M"],["Omløpsmidler","8.1 M"],["Bankinnskudd","2.3 M"]].map(([l,v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--line)", fontSize: ".76rem" }}>
                    <span style={{ color: "var(--d2)" }}>{l}</span><span style={{ fontWeight: 500, color: "var(--d)", fontVariantNumeric: "tabular-nums" }}>{v}</span>
                  </div>
                ))}
                <div style={{ padding: "8px 0", fontSize: ".78rem", fontWeight: 700, color: "var(--d)" }}>Sum: 14.6 M</div>
              </div>
              <div>
                <div style={{ fontSize: ".62rem", fontWeight: 700, color: "var(--B)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>EK og gjeld</div>
                {[["Egenkapital","9.8 M"],["Langsiktig gjeld","3.2 M"],["Kortsiktig gjeld","1.6 M"]].map(([l,v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--line)", fontSize: ".76rem" }}>
                    <span style={{ color: "var(--d2)" }}>{l}</span><span style={{ fontWeight: 500, color: "var(--d)", fontVariantNumeric: "tabular-nums" }}>{v}</span>
                  </div>
                ))}
                <div style={{ padding: "8px 0", fontSize: ".78rem", fontWeight: 700, color: "var(--d)" }}>Sum: 14.6 M</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, padding: "6px 10px", background: "rgba(22,163,74,.06)", borderRadius: 4 }}>
              <span style={{ color: "#16a34a", fontSize: ".75rem", fontWeight: 700 }}>&#10003;</span>
              <span style={{ fontSize: ".72rem", color: "#16a34a", fontWeight: 600 }}>Balansen stemmer</span>
            </div>
          </div>
        )}

        {/* ── Nøkkeltall-tab ── */}
        {activeTab === 2 && (
          <div style={{ animation: "fadeIn .4s ease" }}>
            {/* KPI-kort */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { label: "Driftsmargin", value: "18.1 %", trend: "+2.3pp", up: true },
                { label: "EK-andel", value: "67.1 %", trend: "Solid", up: true },
                { label: "Likviditetsgrad", value: "2.4x", trend: "+0.3", up: true },
                { label: "Skattekostnad", value: "495k", trend: "22 %", up: false },
              ].map(kpi => (
                <div key={kpi.label} style={{ padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 6, background: "var(--cb)" }}>
                  <div style={{ fontSize: ".6rem", color: "var(--d3)", fontWeight: 600, letterSpacing: ".03em", textTransform: "uppercase", marginBottom: 3 }}>{kpi.label}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontFamily: "var(--serif)", fontSize: "1.15rem", color: "var(--d)", fontWeight: 400 }}>{kpi.value}</span>
                    <span style={{ fontSize: ".6rem", fontWeight: 600, color: kpi.up ? "#16a34a" : "var(--d3)", background: kpi.up ? "rgba(22,163,74,.08)" : "var(--w2)", padding: "1px 6px", borderRadius: 8 }}>{kpi.trend}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Mini månedlig bar chart */}
            <div style={{ fontSize: ".6rem", color: "var(--d3)", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>Månedlig omsetning</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 48 }}>
              {bars.map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{
                    width: "100%", borderRadius: 2,
                    height: visible ? `${h * 0.45}px` : "0px",
                    background: i === 11 ? "var(--B)" : "var(--Bl)",
                    transition: `height .6s cubic-bezier(.16,1,.3,1) ${i * 50}ms`,
                  }} />
                  <span style={{ fontSize: ".5rem", color: "var(--d3)" }}>{months[i]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer badge */}
      <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--B), var(--Bm), var(--B))", borderRadius: "0 0 12px 12px" }} />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
      `}</style>
    </div>
  );
}

function Hjem({ go }) {
  return (<>
    <div style={{ padding: "clamp(1.5rem,2.5vw,2.5rem) clamp(2rem,5vw,4rem) clamp(3rem,7vw,6rem)", background: "var(--w)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "5%", right: "2%", width: 420, height: 420, borderRadius: "50%", border: "1px solid var(--line)", opacity: .3, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "15%", right: "8%", width: 240, height: 240, borderRadius: "50%", border: "1px solid var(--line)", opacity: .2, pointerEvents: "none" }} />
      <div style={{ maxWidth: "var(--mw)", margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: "clamp(3rem,7vw,6rem)", alignItems: "center" }} className="grid-hero">
        <div>
          <Rv><div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--B)", opacity: .6 }} />
            <span style={{ fontSize: ".7rem", fontWeight: 600, color: "var(--B)", letterSpacing: ".14em", textTransform: "uppercase" }}>Autorisert regnskapsførerselskap</span>
          </div></Rv>
          <Rv delay={.08}>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2.2rem,4.8vw,3.6rem)", color: "var(--d)", lineHeight: 1.12, fontWeight: 400, margin: "0 0 28px", letterSpacing: "-.01em" }}>
              Regnskap som gir <em style={{ color: "var(--B)", fontWeight: 300 }}>oversikt</em>.<br />
              Rådgivning som gir <em style={{ color: "var(--B)", fontWeight: 300 }}>resultater</em>.
            </h1>
          </Rv>
          <Rv delay={.16}><Pg style={{ marginBottom: 36, maxWidth: 500 }}>Solid regnskapskompetanse og rådgivning for ambisiøse selskaper. Vi kombinerer erfaring med moderne teknologi for å gi deg kontroll, oversikt og bedre beslutningsgrunnlag.</Pg></Rv>
          <Rv delay={.24}><div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Btn primary onClick={go("kontakt")}>Få et uforpliktende tilbud</Btn>
            <Btn onClick={go("ai")}>Prøv AI-modulen →</Btn>
          </div></Rv>
        </div>
        <Rv delay={.2}>
          <HeroDashboard />
        </Rv>
      </div>
    </div>

    <div style={{ background: "var(--navy)", padding: "clamp(1rem,2vw,1.4rem) clamp(2rem,5vw,4rem)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: .03, backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
      <div style={{ maxWidth: "var(--mw)", margin: "0 auto", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }} className="stats-grid">
          {[
            { v: "20", sf: "+", l: "Års erfaring", sub: "Regnskap, skatt og rådgivning" },
            { v: "50", sf: "+", l: "Aktive kunder", sub: "Fra oppstart til børs" },
            { v: "AI", sf: "", l: "Drevet teknologi", sub: "Erfaring møter automatisering" },
            { v: "100", sf: "%", l: "Digitalt landsdekkende", sub: "Basert i Oslo" },
          ].map(({ v, sf, l, sub }, i) => (
            <Rv key={l} delay={i * .06}>
              <div style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,.06)" : "none", padding: "clamp(.4rem,1vw,.6rem) clamp(1rem,2vw,1.5rem)", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.6rem,3vw,2.2rem)", color: "#fff", fontWeight: 300, lineHeight: 1, letterSpacing: "-.02em" }}>
                  {v}<span style={{ fontSize: ".4em", verticalAlign: "super", opacity: .45, fontWeight: 400, marginLeft: 2 }}>{sf}</span>
                </div>
                <div style={{ fontSize: ".68rem", color: "var(--Bm)", marginTop: 5, fontWeight: 600, letterSpacing: ".02em" }}>{l}</div>
                <div style={{ fontSize: ".56rem", color: "rgba(255,255,255,.22)", marginTop: 1 }}>{sub}</div>
              </div>
            </Rv>
          ))}
        </div>
      </div>
    </div>

    <Sec>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(3rem,6vw,5rem)" }} className="grid-2">
        <Rv>
          <Lbl>Vår visjon</Lbl>
          <H2c>Pålitelige regnskapseksperter som driver virksomheten din fremover</H2c>
          <Rl />
          <Pg>Vi stiller høye krav til faglighet, service og kvalitet. Erfaring og spesialisert kompetanse skiller oss fra andre. Hos oss får du hele firmaets kompetanse.</Pg>
        </Rv>
        <Rv delay={.1}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 8 }}>
            {[["01","Profesjonalitet","Høye krav til faglighet, service og kvalitet. Du får hele firmaets kompetanse."],["02","Rask oppfølging","Vi svarer raskt og tydelig. Kompetent rådgivning og presist arbeid — alltid."],["03","Kvalitet i vekst","Innsikt som gjør at du kan ta trygge økonomiske valg for virksomheten."]].map(([num,t,d]) =>
              <div key={num} style={{ padding: "1.6rem 0", borderBottom: "1px solid var(--line)", display: "grid", gridTemplateColumns: "40px 1fr", gap: 16, alignItems: "start" }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", color: "var(--B)", fontWeight: 300, opacity: .7 }}>{num}</span>
                <div><h3 style={{ fontSize: ".94rem", fontWeight: 600, color: "var(--d)", marginBottom: 3 }}>{t}</h3><p style={{ fontSize: ".85rem", color: "var(--d2)", lineHeight: 1.6 }}>{d}</p></div>
              </div>
            )}
          </div>
        </Rv>
      </div>
    </Sec>

    <Sec bg="var(--w2)">
      <Rv><Lbl>Tjenester</Lbl></Rv>
      <Rv delay={.05}><H2c>Effektive løsninger innen regnskap og økonomi</H2c></Rv>
      <Rv delay={.1}><Pg style={{ marginBottom: "2.5rem" }}>Vi skreddersyr rutiner og systemer til din bedrift, og bruker moderne teknologi for sømløst og effektivt regnskap.</Pg></Rv>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, alignItems: "stretch" }} className="grid-3">
        {[["Løpende regnskapsføring","Bokføring, avstemming og rapportering tilpasset din virksomhet.",false],["Lønn og godtgjørelser","Lønnskjøring, feriepenger, A-melding og pensjon — korrekt og i tide.",false],["MVA og offentlige rapporteringer","Terminoppgaver, skattemelding og alle lovpålagte frister — alltid levert i tide.",false],["Årsregnskap og årsberetning","Komplett regnskapsavslutning med resultat, balanse og noter.",false],["Likviditet og rapportering","Løpende oversikt og skreddersydde rapporter til styre, eiere og ledelse.",false],["AI-drevet regnskap","Automatisk årsregnskap og årsberetning fra saldobalanse — på minutter.",true]].map(([t,d,ai],i) =>
          <div key={t} style={{ opacity: 0, transform: "translateY(28px)", animation: `rvIn .9s cubic-bezier(.16,1,.3,1) ${i * .04}s forwards`, display: "flex" }}>
            <div className="hov-card" style={{ padding: "1.8rem 2rem", borderLeft: `2px solid ${ai ? "var(--Bm)" : "var(--B)"}`, background: ai ? "var(--Bl)" : "#fff", cursor: "default", position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
              {ai && <span style={{ position: "absolute", top: 14, right: 14, fontSize: ".58rem", fontWeight: 700, color: "var(--B)", letterSpacing: ".1em", textTransform: "uppercase", background: "rgba(0,96,155,.1)", borderRadius: 20, padding: "3px 9px" }}>AI</span>}
              <h3 style={{ fontSize: ".96rem", fontWeight: 600, color: "var(--d)", marginBottom: 6, lineHeight: 1.3, paddingRight: ai ? 36 : 0 }}>{t}</h3>
              <p style={{ fontSize: ".86rem", color: "var(--d2)", lineHeight: 1.65, flex: 1 }}>{d}</p>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes rvIn { to { opacity: 1; transform: none; } }`}</style>
    </Sec>

    <Sec>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "clamp(2rem,5vw,4rem)" }}>
        <Rv>
          <Lbl>Menneskene</Lbl>
          <H2c>Folkene bak tallene</H2c>
          <Rl />
          <Pg style={{ fontSize: ".92rem" }}>Erfarent fagmiljø som kombinerer solid kompetanse med praktisk erfaring fra næringslivet.</Pg>
          <div style={{ marginTop: 28 }}><Btn onClick={go("menneskene")}>Møt hele teamet →</Btn></div>
        </Rv>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 }}>
          {TEAM.map((p, i) => <Rv key={p.n} delay={i * .07}><Per p={p} /></Rv>)}
        </div>
      </div>
    </Sec>

    <Sec bg="var(--navy)" py="clamp(3.5rem,7vw,5.5rem)">
      <div style={{ textAlign: "center" }}>
        <Rv><H2c style={{ color: "#fff", maxWidth: 480, margin: "0 auto 14px", fontSize: "clamp(1.6rem,3vw,2.4rem)" }}>Klar for en prat?</H2c></Rv>
        <Rv delay={.06}><Pg style={{ color: "rgba(255,255,255,.45)", maxWidth: 420, margin: "0 auto 32px" }}>Ta kontakt, så ser vi sammen på hva vi kan gjøre for deg og bedriften.</Pg></Rv>
        <Rv delay={.12}><div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn primary onClick={go("kontakt")} style={{ background: "#fff", color: "var(--B)" }}>Avtal en prat →</Btn>
          <Btn style={{ borderColor: "rgba(255,255,255,.15)", color: "rgba(255,255,255,.6)" }}>Ring 73 93 31 000</Btn>
        </div></Rv>
      </div>
    </Sec>
  </>);
}

function Regnskap({ go }) {
  return (<>
    <PH lb="Regnskap" t="Vi tar hånd om tallene dine med presisjon" sub="Vi leverer regnskapstjenester for selskaper som ønsker ryddige prosesser, forutsigbarhet og god rapportering." />
    <Sec>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {[["Løpende regnskapsføring","Bokføring, avstemming og rapportering tilpasset din virksomhet."],["Fakturering og reskontro","Kunder og leverandører — oversikt og kontroll."],["Lønn og godtgjørelser","Lønnskjøring, feriepenger, A-melding og pensjon."],["MVA, skatt og rapportering","Alle lovpålagte frister og rapporter."],["Årsregnskap og årsberetning","Komplett regnskapsavslutning med resultat, balanse, noter og årsberetning."],["Likviditet og rapportering","Enkel oversikt og rapporter til styre, eiere og ledelse."]].map(([t,d],i) => <Rv key={t} delay={i*.04}><Cd t={t} tx={d} /></Rv>)}
      </div>
    </Sec>
    <Sec bg="var(--w2)">
      <Rv><Lbl>Prosess</Lbl></Rv><Rv delay={.05}><H2c>Slik jobber vi sammen med deg</H2c></Rv>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 28, maxWidth: 540 }}>
        {[["Innledende prat","Vi avklarer behov, størrelse, kompleksitet og systemer."],["Gjennomgang","Vi ser på dagens løsning og skisserer et konkret opplegg."],["Oppstart","Systemer, rutiner og rapportering settes opp og justeres."],["Løpende drift","Du får jevnlige rapporter og en partner for sparring."]].map(([t,d],i) => <Rv key={t} delay={i*.05}><Stp n={i+1} t={t} tx={d} /></Rv>)}
      </div>
    </Sec>
    <Sec bg="#fff" py="clamp(2rem,4vw,3rem)">
      <Rv>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(2rem,4vw,3rem)", padding: "1.6rem 2rem", border: "1px solid var(--line)", borderRadius: 8, background: "var(--cb)" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: ".66rem", fontWeight: 700, color: "var(--B)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 6 }}>For enklere selskapsstrukturer</div>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--d)", marginBottom: 6, lineHeight: 1.3 }}>AI-drevet årsregnskap</h3>
            <p style={{ fontSize: ".84rem", color: "var(--d2)", lineHeight: 1.6 }}>For selskaper med enklere struktur tilbyr vi et AI-drevet alternativ der årsregnskap med noter og årsberetning genereres automatisk fra saldobalanse — kvalitetssikret av våre regnskapsførere.</p>
          </div>
          <Btn onClick={go("ai")} style={{ flexShrink: 0 }}>Les mer →</Btn>
        </div>
      </Rv>
    </Sec>
    <Sec bg="var(--w2)" py="clamp(2.5rem,4vw,3.5rem)"><div style={{ textAlign: "center" }}><H2c style={{ marginBottom: 18 }}>Vil du ha et tilbud?</H2c><Btn primary onClick={go("kontakt")}>Få tilbud på regnskap →</Btn></div></Sec>
  </>);
}

function Skatt() {
  return (<>
    <PH lb="Skatt" t="Trygg og effektiv skattehåndtering" sub="Fra løpende skatteforhold til komplekse strukturer og transaksjoner." />
    <Sec><div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
      {[["Løpende rapportering","Skatte- og avgiftsrapportering med full oversikt over frister."],["Skattemelding","Korrekt og optimalisert innlevering for selskap og eiere."],["Forskuddsskatt","Beregning og vurdering av riktig forskuddsskatt."],["Selskapsstruktur","Holdingselskap, konsern, fusjon og fisjon."],["Transaksjoner","Skatt ved kjøp, salg og omorganiseringer."],["Utbytte og konsernbidrag","Optimale selskapsdisposisjoner."]].map(([t,d],i) => <Rv key={t} delay={i*.04}><Cd t={t} tx={d} /></Rv>)}
    </div></Sec>
  </>);
}

function Raad() {
  return (<>
    <PH lb="Rådgivning" t="Innsikt som gir handlekraft" sub="Anbefalinger tilpasset din situasjon — ikke generelle standardpakker." />
    <Sec><div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
      {[["Lønnsomhetsanalyse","Forstå hva som driver resultat, kostnader og likviditet."],["Selskapsstruktur","Riktig oppsett av driftsselskap, holding og prosjektstruktur."],["Budsjettering","Planlegging som gir kontroll og forutsigbarhet."],["Skatteplanlegging","Utbytte, konsernbidrag, MVA og tilpasninger."],["Internkontroll","Struktur i økonomifunksjonen og gode arbeidsflyter."],["Rapportering","Oversiktlige rapporter til eiere, styre og ledelse."]].map(([t,d],i) => <Rv key={t} delay={i*.04}><Cd t={t} tx={d} /></Rv>)}
    </div></Sec>
  </>);
}

function Forv() {
  return (<>
    <PH lb="Forvaltning" t="Helhetlig eiendomsforvaltning" sub="Effektiv drift, god kontroll og langsiktig verdiskaping for private og profesjonelle eiere." />
    <Sec>
      {[["Teknisk forvaltning","Oppfølging av teknisk drift, serviceavtaler, vedlikeholdstiltak, tilstandsvurderinger og prosjektoppfølging."],["Økonomisk forvaltning","Presis rapportering og strukturert oppfølging som gir eiere et solid beslutningsgrunnlag."],["Administrativ forvaltning","Leietakeroppfølging, kontraktsadministrasjon, henvendelser og koordinering mot leverandører."],["Energirådgivning","Kartlegging av energibruk, kostnadseffektive tiltak, prosjektoppfølging og rådgivning knyttet til regelverk."]].map(([t,d],i) =>
        <Rv key={t} delay={i * .05}><div style={{ padding: "2rem 0", borderBottom: "1px solid var(--line)" }}><h3 style={{ fontFamily: "var(--serif)", fontSize: "1.2rem", color: "var(--d)", fontWeight: 400, marginBottom: 8 }}>{t}</h3><p style={{ fontSize: ".92rem", color: "var(--d2)", lineHeight: 1.72, maxWidth: 640 }}>{d}</p></div></Rv>
      )}
    </Sec>
  </>);
}

function Om({ go }) {
  return (<>
    <PH lb="Om oss" t="Pålitelige regnskapseksperter" sub="Med mange års erfaring og sterk faglig tyngde hjelper vi virksomheter å nå sine mål." />
    <Sec>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,5vw,4rem)" }}>
        <Rv><H2c style={{ fontSize: "1.5rem" }}>Om Accunor</H2c><Rl /><Pg>Vi leverer tjenester innen regnskap, skatt, merverdiavgift, lønn og rådgivning — alltid med fokus på kvalitet, presisjon og god oppfølging.</Pg></Rv>
        <Rv delay={.08}>
          <H2c style={{ fontSize: "1.5rem" }}>Vår misjon</H2c><Rl />
          <Pg>Gi kundene bedre beslutningsgrunnlag gjennom presise tall, god struktur og tydelige råd.</Pg>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 22 }}>
            {[["Bedre lønnsomhet","Vi hjelper deg å se hvor du tjener — og hvor det lekker."],["Økt eierverdi","Vurderinger og planer som styrker virksomhetens verdi over tid."]].map(([t,d]) =>
              <div key={t} style={{ padding: "1rem 1.2rem", borderLeft: "2px solid var(--B)", background: "var(--Bl)", borderRadius: "0 6px 6px 0" }}>
                <div style={{ fontSize: ".87rem", fontWeight: 700, color: "var(--d)", marginBottom: 2 }}>{t}</div>
                <div style={{ fontSize: ".82rem", color: "var(--d2)" }}>{d}</div>
              </div>
            )}
          </div>
        </Rv>
      </div>
    </Sec>
    <Sec bg="var(--w2)">
      <Rv><Lbl>Menneskene</Lbl></Rv><Rv delay={.05}><H2c>Fagfolk med engasjement</H2c></Rv>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32, marginTop: 32 }}>{TEAM.map((p, i) => <Rv key={p.n} delay={i * .07}><Per p={p} /></Rv>)}</div>
    </Sec>
  </>);
}

function Folk() {
  return (<>
    <PH lb="Menneskene" t="Møt folkene bak Accunor" sub="Et tverrfaglig team som gjør økonomi enklere og mer forståelig." />
    <Sec><div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40 }}>{TEAM.map((p, i) => <Rv key={p.n} delay={i * .07}><Per p={p} /></Rv>)}</div></Sec>
  </>);
}

function Kontakt() {
  return (<>
    <PH lb="Kontakt" t="Ta kontakt" sub="Vi er tilgjengelige for en uforpliktende prat om hva vi kan gjøre for deg og bedriften." />
    <Sec>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,5vw,4rem)" }}>
        <Rv>
          <H2c style={{ fontSize: "1.4rem" }}>Send oss en melding</H2c><Rl />
          {["Navn","E-post","Telefon"].map(f => <div key={f} style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: ".76rem", fontWeight: 600, color: "var(--d)", marginBottom: 5, letterSpacing: ".02em" }}>{f}</label><input placeholder={f} style={{ width: "100%", padding: ".72rem 1rem", borderRadius: 5, border: "1.5px solid var(--line)", fontSize: ".88rem", fontFamily: "var(--sans)", outline: "none", background: "#fff" }} /></div>)}
          <div style={{ marginBottom: 20 }}><label style={{ display: "block", fontSize: ".76rem", fontWeight: 600, color: "var(--d)", marginBottom: 5 }}>Melding</label><textarea placeholder="Fortell oss om din virksomhet..." style={{ width: "100%", padding: ".72rem 1rem", borderRadius: 5, border: "1.5px solid var(--line)", fontSize: ".88rem", fontFamily: "var(--sans)", minHeight: 110, resize: "vertical", outline: "none" }} /></div>
          <Btn primary>Send melding →</Btn>
        </Rv>
        <Rv delay={.08}>
          <H2c style={{ fontSize: "1.4rem" }}>Kontaktinformasjon</H2c><Rl />
          <div style={{ fontSize: ".95rem", color: "var(--d2)", lineHeight: 2.2 }}><strong style={{ color: "var(--d)" }}>Telefon</strong><br />+47 73 93 31 000<br /><br /><strong style={{ color: "var(--d)" }}>E-post</strong><br />post@accunorgroup.no<br /><br /><strong style={{ color: "var(--d)" }}>Org.nr.</strong><br />936 401 228</div>
          <div style={{ marginTop: 30 }}><H2c style={{ fontSize: "1.15rem" }}>Kontor</H2c>{[["Oslo","Wilhelms gate 2, 0168 Oslo"]].map(([by, adr]) => <div key={by} style={{ padding: "11px 0", borderBottom: "1px solid var(--line)" }}><div style={{ fontSize: ".9rem", fontWeight: 600, color: "var(--d)" }}>{by}</div>{adr && <div style={{ fontSize: ".82rem", color: "var(--d3)" }}>{adr}</div>}</div>)}<div style={{ padding: "11px 0", fontSize: ".82rem", color: "var(--d3)" }}>Vi betjener kunder i hele Norge digitalt.</div></div>
        </Rv>
      </div>
    </Sec>
  </>);
}

function Karriere() {
  return (<>
    <PH lb="Karriere" t="Bli en del av Accunor" sub="Vi søker fagfolk som vil jobbe tett med kunder og bidra til et sterkt fagmiljø." />
    <Sec>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[["Faglig utvikling","Kurs, sertifiseringer og mulighet til å spesialisere seg."],["Godt arbeidsmiljø","Tett samarbeid, korte beslutningsveier og flat struktur."],["Fleksibilitet","Vi tilpasser arbeidshverdagen etter livssituasjonen din."]].map(([t,d],i) => <Rv key={t} delay={i * .05}><Cd t={t} tx={d} /></Rv>)}
      </div>
      <div style={{ textAlign: "center", marginTop: 48 }}><Pg style={{ margin: "0 auto 20px", textAlign: "center" }}>Interessert? Send oss en åpen søknad.</Pg><Btn primary>Send søknad →</Btn></div>
    </Sec>
  </>);
}

/* ─── NS 4102 KONTOPLAN ─── */
const NS4102 = [
  { key:"driftsinntekter", label:"Driftsinntekter", lo:3000, hi:3999, sign:-1, subs:[{key:"salg",label:"Salgsinntekter",lo:3000,hi:3499},{key:"annen_di",label:"Annen driftsinntekt",lo:3500,hi:3999}] },
  { key:"driftskostnader", label:"Driftskostnader", lo:4000, hi:7999, sign:1, subs:[{key:"vare",label:"Varekostnad",lo:4000,hi:4999},{key:"loenn",label:"Lønnskostnad",lo:5000,hi:5999},{key:"avskr",label:"Avskrivning av driftsmidler og immaterielle eiendeler",lo:6000,hi:6099},{key:"nedskr",label:"Nedskrivning av varige driftsmidler og immaterielle eiendeler",lo:6100,hi:6109},{key:"annen_dk",label:"Annen driftskostnad",lo:6110,hi:7999}] },
  { key:"finansinntekter", label:"Finansinntekter", lo:8000, hi:8099, sign:-1, subs:[{key:"tilknyttet_inntekt",label:"Inntekt på investering i tilknyttet selskap",lo:8070,hi:8079},{key:"rente_i",label:"Annen renteinntekt",lo:8000,hi:8049},{key:"annen_fi",label:"Annen finansinntekt",lo:8050,hi:8069},{key:"verdiokning",label:"Verdiøkning markedsbaserte omløpsmidler",lo:8080,hi:8089}] },
  { key:"finanskostnader", label:"Finanskostnader", lo:8100, hi:8199, sign:1, subs:[{key:"verdireduksjon",label:"Verdireduksjon markedsbaserte omløpsmidler",lo:8170,hi:8179},{key:"rente_k",label:"Annen rentekostnad",lo:8100,hi:8149},{key:"annen_fk",label:"Annen finanskostnad",lo:8150,hi:8169}] },
  { key:"skatt", label:"Skattekostnad", lo:8900, hi:8999, sign:1, subs:[{key:"sk",label:"Skattekostnad på resultat",lo:8900,hi:8999}] },
  { key:"anleggsmidler", label:"Anleggsmidler", lo:1000, hi:1399, sign:1, subs:[{key:"imm",label:"Immaterielle eiendeler",lo:1000,hi:1099},{key:"varige",label:"Varige driftsmidler",lo:1100,hi:1199},{key:"tilknyttet",label:"Investeringer i tilknyttet selskap",lo:1340,hi:1359},{key:"andre_lf",label:"Andre langsiktige fordringer",lo:1200,hi:1339},{key:"fin_am_other",label:"Andre finansielle anleggsmidler",lo:1360,hi:1399}] },
  { key:"omloepsmidler", label:"Omløpsmidler", lo:1400, hi:1999, sign:1, subs:[{key:"varer_b",label:"Varer",lo:1400,hi:1499},{key:"ford",label:"Fordringer",lo:1500,hi:1599},{key:"aksjer_oml",label:"Markedsbaserte aksjer",lo:1800,hi:1819},{key:"oblig_fond",label:"Andre markedsbaserte finansielle instrumenter",lo:1820,hi:1899},{key:"bank",label:"Bankinnskudd, kontanter o.l.",lo:1900,hi:1999}] },
  { key:"egenkapital", label:"Egenkapital", lo:2000, hi:2099, sign:-1, subs:[{key:"innskutt",label:"Aksjekapital",lo:2000,hi:2019},{key:"opptjent",label:"Annen egenkapital",lo:2020,hi:2099}] },
  { key:"langsiktig_gjeld", label:"Langsiktig gjeld", lo:2100, hi:2399, sign:-1, subs:[{key:"utsatt_skatt",label:"Utsatt skatt",lo:2100,hi:2119},{key:"annen_lg",label:"Annen langsiktig gjeld",lo:2120,hi:2399}] },
  { key:"kortsiktig_gjeld", label:"Kortsiktig gjeld", lo:2400, hi:2999, sign:-1, subs:[{key:"lev",label:"Leverandørgjeld",lo:2400,hi:2499},{key:"betalbar_sk",label:"Betalbar skatt",lo:2500,hi:2519},{key:"off_avg",label:"Skyldige offentlige avgifter",lo:2520,hi:2699},{key:"annen_kg",label:"Annen kortsiktig gjeld",lo:2700,hi:2999}] },
];

function classifyAccounts(rows) {
  const out = {};
  NS4102.forEach(g => {
    let total = 0;
    const subs = {};
    g.subs.forEach(s => {
      const t = rows.filter(r => r.kontonr >= s.lo && r.kontonr <= s.hi).reduce((a, r) => a + r.saldo, 0) * g.sign;
      subs[s.key] = { label: s.label, total: t };
      total += t;
    });
    out[g.key] = { label: g.label || g.key, total, subs };
  });
  return out;
}

function buildResultatLines(cl) {
  const g = k => cl[k] || { total: 0, subs: {} };
  const di = g("driftsinntekter"), dk = g("driftskostnader");
  const fi = g("finansinntekter"), fk = g("finanskostnader"), sk = g("skatt");
  const lines = [];
  lines.push({ type:"header", label:"Driftsinntekter" });
  Object.values(di.subs).filter(s => s.total !== 0).forEach(s => lines.push({ type:"line", label:s.label, val:s.total }));
  lines.push({ type:"sum", label:"Sum driftsinntekter", val:di.total });
  lines.push({ type:"header", label:"Driftskostnader" });
  Object.values(dk.subs).filter(s => s.total !== 0).forEach(s => lines.push({ type:"line", label:s.label, val:s.total }));
  lines.push({ type:"sum", label:"Sum driftskostnader", val:dk.total });
  const driftsres = di.total - dk.total;
  lines.push({ type:"result", label:"Driftsresultat", val:driftsres });
  if (fi.total !== 0 || fk.total !== 0) {
    lines.push({ type:"header", label:"Finansinntekter og finanskostnader" });
    Object.values(fi.subs).filter(s => s.total !== 0).forEach(s => lines.push({ type:"line", label:s.label, val:s.total }));
    Object.values(fk.subs).filter(s => s.total !== 0).forEach(s => lines.push({ type:"line", label:s.label, val:-s.total }));
    lines.push({ type:"sum", label:"Netto finansposter", val:fi.total - fk.total });
  }
  const ordinaert = driftsres + fi.total - fk.total;
  lines.push({ type:"result", label:"Ordinært resultat før skatt", val:ordinaert });
  if (sk.total !== 0) lines.push({ type:"line", label:"Skattekostnad", val:-sk.total });
  lines.push({ type:"result", label:"Årsresultat", val:ordinaert - sk.total, hi:true });
  return lines;
}

function buildBalanseData(cl) {
  const g = k => cl[k] || { total: 0, subs: {} };
  const am = g("anleggsmidler"), om = g("omloepsmidler");
  const ek = g("egenkapital"), lg = g("langsiktig_gjeld"), kg = g("kortsiktig_gjeld");
  const sumE = am.total + om.total;
  const sumEK = ek.total + lg.total + kg.total;
  const eiendeler = [
    { type:"header", label:"Anleggsmidler" },
    ...Object.values(am.subs).filter(s => s.total !== 0).map(s => ({ type:"line", label:s.label, val:s.total })),
    { type:"sum", label:"Sum anleggsmidler", val:am.total },
    { type:"header", label:"Omløpsmidler" },
    ...Object.values(om.subs).filter(s => s.total !== 0).map(s => ({ type:"line", label:s.label, val:s.total })),
    { type:"sum", label:"Sum omløpsmidler", val:om.total },
    { type:"result", label:"Sum eiendeler", val:sumE },
  ];
  const ekGjeld = [
    { type:"header", label:"Egenkapital" },
    ...Object.values(ek.subs).filter(s => s.total !== 0).map(s => ({ type:"line", label:s.label, val:s.total })),
    { type:"sum", label:"Sum egenkapital", val:ek.total },
    { type:"header", label:"Langsiktig gjeld" },
    ...Object.values(lg.subs).filter(s => s.total !== 0).map(s => ({ type:"line", label:s.label, val:s.total })),
    { type:"sum", label:"Sum langsiktig gjeld", val:lg.total },
    { type:"header", label:"Kortsiktig gjeld" },
    ...Object.values(kg.subs).filter(s => s.total !== 0).map(s => ({ type:"line", label:s.label, val:s.total })),
    { type:"sum", label:"Sum kortsiktig gjeld", val:kg.total },
    { type:"result", label:"Sum egenkapital og gjeld", val:sumEK, hi:true },
  ];
  return { eiendeler, ekGjeld, ek_gjeld: ekGjeld, sumEiendeler:sumE, sum_eiendeler: sumE, sumEkGjeld:sumEK, sum_ek_gjeld: sumEK, ekTotal:ek.total, ek_total: ek.total };
}

function RRow({ item:{ type, label, val, hi } }) {
  const fmtNok = v => {
    const n = parseFloat(v); if (isNaN(n)) return "—";
    if (Math.abs(n) >= 1000000) return `${(n/1000000).toFixed(1).replace(".",",")} MNOK`;
    return new Intl.NumberFormat("nb-NO", { maximumFractionDigits:0 }).format(Math.round(n)) + " kr";
  };
  if (type === "header") return <div style={{ padding:"14px 0 5px", borderBottom:"1.5px solid var(--B)", marginTop:6 }}><span style={{ fontSize:".74rem", fontWeight:700, color:"var(--B)", textTransform:"uppercase", letterSpacing:".08em" }}>{label}</span></div>;
  if (type === "line") return <div style={{ display:"flex", justifyContent:"space-between", padding:"7px 0 7px 14px", borderBottom:"1px solid var(--line)" }}><span style={{ fontSize:".87rem", color:"var(--d2)" }}>{label}</span><span style={{ fontSize:".87rem", color:"var(--d)", fontVariantNumeric:"tabular-nums" }}>{fmtNok(val)}</span></div>;
  if (type === "sum") return <div style={{ display:"flex", justifyContent:"space-between", padding:"9px 8px", borderBottom:"1px solid var(--line)", background:"var(--w2)" }}><span style={{ fontSize:".88rem", fontWeight:600, color:"var(--d)" }}>{label}</span><span style={{ fontSize:".88rem", fontWeight:600, color:"var(--d)", fontVariantNumeric:"tabular-nums" }}>{fmtNok(val)}</span></div>;
  if (type === "result") return <div style={{ display:"flex", justifyContent:"space-between", padding:"11px 0", borderTop:"1.5px solid var(--B)", marginTop:4 }}><span style={{ fontSize:".9rem", fontWeight:700, color: hi ? "var(--B)" : "var(--navy)" }}>{label}</span><span style={{ fontFamily:"var(--serif)", fontSize:"1.18rem", color: hi ? "var(--B)" : "var(--navy)", fontVariantNumeric:"tabular-nums" }}>{fmtNok(val)}</span></div>;
  return null;
}

function PasswordGate({ children }) {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [feil, setFeil] = useState(false);
  if (unlocked) return children;
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "2.5rem 2rem", maxWidth: 360, width: "100%", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔒</div>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6, color: "#1a2332" }}>AI-modul — betaversjon</h2>
        <p style={{ fontSize: "0.82rem", color: "#6b7280", marginBottom: 24 }}>Skriv inn passordet for å få tilgang</p>
        <input
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setFeil(false); }}
          onKeyDown={e => { if (e.key === "Enter") { if (input === "accunorai") setUnlocked(true); else setFeil(true); }}}
          placeholder="Passord"
          autoFocus
          style={{ width: "100%", padding: "0.7rem 1rem", border: feil ? "1.5px solid #ef4444" : "1.5px solid #d1d5db", borderRadius: 10, fontSize: "0.9rem", outline: "none", boxSizing: "border-box", marginBottom: 10 }}
        />
        {feil && <p style={{ fontSize: "0.78rem", color: "#ef4444", marginBottom: 8 }}>Feil passord</p>}
        <button
          onClick={() => { if (input === "accunorai") setUnlocked(true); else setFeil(true); }}
          style={{ width: "100%", padding: "0.75rem", background: "#1a4fa0", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
        >
          Logg inn
        </button>
      </div>
    </div>
  );
}

function AI() {
  const fileRef = useRef(null);
  const vpFileRef = useRef(null);
  const dokFileRef = useRef(null);
  const [saldo, setSaldo] = useState([]);
  const [fileName, setFileName] = useState("");
  const [parseErr, setParseErr] = useState("");
  const [selskapstype, setSelskapstype] = useState(null); // "drift" | "holding"
  const [info, setInfo] = useState({ navn:"", orgnr:"", dagligLeder:"", styreleder:"", bransje:"", antallAnsatte:"", adresse:"", regnskapsaar:new Date().getFullYear()-1, tillegg:"", fordringEier:0, fordringTilbakebetaling:"" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [tab, setTab] = useState(0);
  const [brregLoading, setBrregLoading] = useState(false);

  // Interaktiv Q&A for uklare transaksjoner
  const [qaQuestions, setQaQuestions] = useState([]); // [{id, question, context, answer}]
  const [qaActive, setQaActive] = useState(false);
  const answerQa = (id, answer) => setQaQuestions(qs => qs.map(q => q.id === id ? {...q, answer} : q));
  const allQaAnswered = qaQuestions.length === 0 || qaQuestions.every(q => q.answer?.trim());

  // Brreg API — hent selskapsinfo fra org.nr
  const lookupBrreg = async (orgnr) => {
    const clean = orgnr.replace(/\s/g,"");
    if (clean.length !== 9 || isNaN(clean)) return null;
    try {
      const resp = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${clean}`);
      if (!resp.ok) return null;
      const d = await resp.json();
      const adr = d.forretningsadresse || d.postadresse || {};
      const adresse = [adr.adresse?.[0], `${adr.postnummer||""} ${adr.poststed||""}`].filter(Boolean).join(", ");
      let styreleder = "", dagligLeder = "";
      try {
        const rResp = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${clean}/roller`);
        if (rResp.ok) {
          const rData = await rResp.json();
          for (const rg of (rData.rollegrupper || [])) {
            for (const r of (rg.roller || [])) {
              const navn = r.person ? `${r.person.navn?.fornavn||""} ${r.person.navn?.etternavn||""}`.trim() : "";
              if (rg.type?.kode === "STYR" && r.type?.kode === "LEDE") styreleder = navn;
              if (rg.type?.kode === "DAGL") dagligLeder = navn;
            }
          }
        }
      } catch(e) {}
      return {
        orgnr: d.organisasjonsnummer || clean,
        navn: d.navn || "",
        adresse,
        poststed: adr.poststed || "",
        bransje: d.naeringskode1?.beskrivelse || "",
        antallAnsatte: d.antallAnsatte || 0,
        styreleder,
        dagligLeder,
      };
    } catch(e) { return null; }
  };

  // Brreg søk — fritekst (navn eller org.nr)
  const [brregSuggestions, setBrregSuggestions] = useState([]);
  const [brregQuery, setBrregQuery] = useState("");
  const [brregShowDropdown, setBrregShowDropdown] = useState(false);
  const brregTimeout = useRef(null);

  const searchBrreg = async (query) => {
    if (!query || query.length < 2) { setBrregSuggestions([]); return; }
    const clean = query.replace(/\s/g,"");
    // Direkte oppslag hvis 9 siffer
    if (clean.length === 9 && !isNaN(clean)) {
      const data = await lookupBrreg(clean);
      if (data) { setBrregSuggestions([data]); setBrregShowDropdown(true); }
      return;
    }
    // Fritekst-søk
    try {
      const resp = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter?navn=${encodeURIComponent(query)}&size=6`);
      if (!resp.ok) return;
      const d = await resp.json();
      const hits = (d._embedded?.enheter || []).map(e => {
        const adr = e.forretningsadresse || e.postadresse || {};
        return {
          orgnr: e.organisasjonsnummer,
          navn: e.navn,
          poststed: adr.poststed || "",
          adresse: [adr.adresse?.[0], `${adr.postnummer||""} ${adr.poststed||""}`].filter(Boolean).join(", "),
          bransje: e.naeringskode1?.beskrivelse || "",
          antallAnsatte: e.antallAnsatte || 0,
        };
      });
      setBrregSuggestions(hits);
      setBrregShowDropdown(hits.length > 0);
    } catch(e) {}
  };

  const onBrregInput = (val) => {
    setBrregQuery(val);
    clearTimeout(brregTimeout.current);
    brregTimeout.current = setTimeout(() => searchBrreg(val), 300);
  };

  const selectBrregHit = async (hit) => {
    setBrregShowDropdown(false);
    setBrregQuery(`${hit.navn} (${hit.orgnr})`);
    setBrregLoading(true);
    // Hent fullstendig info inkl. roller
    const full = await lookupBrreg(hit.orgnr);
    if (full) {
      setInfo(p => ({
        ...p,
        orgnr: full.orgnr || hit.orgnr,
        navn: full.navn || hit.navn,
        adresse: full.adresse || hit.adresse || p.adresse,
        bransje: full.bransje || hit.bransje || p.bransje,
        antallAnsatte: full.antallAnsatte || p.antallAnsatte,
        styreleder: full.styreleder || p.styreleder,
        dagligLeder: full.dagligLeder || p.dagligLeder,
      }));
    } else {
      setInfo(p => ({ ...p, orgnr: hit.orgnr, navn: hit.navn, adresse: hit.adresse || p.adresse, bransje: hit.bransje || p.bransje }));
    }
    setBrregLoading(false);
  };

  // Grunnlagsdokumenter (PDF-er)
  const [dokFiler, setDokFiler] = useState([]);
  const [dokParsed, setDokParsed] = useState(null);
  const [dokLoading, setDokLoading] = useState(false);

  // VP-transaksjoner
  const [vpFile, setVpFile] = useState(null);
  const [vpResult, setVpResult] = useState(null);
  const [vpLoading, setVpLoading] = useState(false);

  // Tilknyttede selskaper
  const [tilknyttede, setTilknyttede] = useState([]);
  const addTilknyttet = () => setTilknyttede(t=>[...t,{orgnr:"",selskapsnavn:"",forretningskontor:"",eierandel:0,bokfoertVerdi:0,utbytte:0,searchQuery:""}]);
  const removeTilknyttet = i => setTilknyttede(t=>t.filter((_,j)=>j!==i));
  const updTilknyttet = (i,k,v) => setTilknyttede(t=>t.map((s,j)=>j===i?{...s,[k]:v}:s));

  // Auto-utfyll tilknyttet selskap — søk + dropdown
  const [tilkSuggestions, setTilkSuggestions] = useState({});  // index → hits[]
  const tilkTimeout = useRef(null);

  const searchTilknyttet = async (i, query) => {
    updTilknyttet(i, "searchQuery", query);
    if (!query || query.length < 2) { setTilkSuggestions(s => ({...s, [i]: []})); return; }
    clearTimeout(tilkTimeout.current);
    tilkTimeout.current = setTimeout(async () => {
      const clean = query.replace(/\s/g,"");
      if (clean.length === 9 && !isNaN(clean)) {
        const data = await lookupBrreg(clean);
        if (data) setTilkSuggestions(s => ({...s, [i]: [data]}));
      } else {
        try {
          const resp = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter?navn=${encodeURIComponent(query)}&size=5`);
          if (resp.ok) {
            const d = await resp.json();
            const hits = (d._embedded?.enheter || []).map(e => ({
              orgnr: e.organisasjonsnummer,
              navn: e.navn,
              poststed: (e.forretningsadresse||e.postadresse||{}).poststed || "",
            }));
            setTilkSuggestions(s => ({...s, [i]: hits}));
          }
        } catch(e) {}
      }
    }, 300);
  };

  const selectTilknyttetHit = (i, hit) => {
    setTilknyttede(t => t.map((s, j) => j === i ? {
      ...s,
      orgnr: hit.orgnr,
      selskapsnavn: hit.navn,
      forretningskontor: hit.poststed || "",
      searchQuery: hit.navn,
    } : s));
    setTilkSuggestions(s => ({...s, [i]: []}));
  };

  // Driftsmidler
  const [driftsmidler, setDriftsmidler] = useState({ anskIb:0, tilgang:0, anskUb:0, akkAvskr:0, balVerdi:0, aretsAvskr:0 });

  // Egenkapital
  const [egenkapital, setEgenkapital] = useState({ akIb:30000, akUb:30000, annenIb:0, utbytte:0 });

  // Expand/collapse seksjoner
  const [openSec, setOpenSec] = useState({ tilknyttede:false, driftsmidler:false, egenkapital:false });

  const fmtNok = v => {
    const n = parseFloat(v); if (isNaN(n)) return "—";
    if (Math.abs(n) >= 1000000) return `${(n/1000000).toFixed(1).replace(".",",")} MNOK`;
    return new Intl.NumberFormat("nb-NO", { maximumFractionDigits:0 }).format(Math.round(n)) + " kr";
  };

  const parseExcel = async file => {
    setParseErr(""); setFileName(file.name);
    try {
      const ab = await file.arrayBuffer();
      const wb = XLSX.read(ab);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header:1, defval:"" });
      let hRow=-1, knCol=-1, knaCol=1, salCol=-1, best=0;

      // Find header row
      for (let i=0; i<Math.min(20,rows.length); i++) {
        const rv = rows[i].map(v => String(v).toLowerCase().trim());
        let sc=0, kn=-1;
        rv.forEach((v,ci) => {
          if (v==="kontonr"||v==="konto nr"||v==="konto"||v==="kontonummer") { kn=ci; sc+=5; }
          else if (v.startsWith("konto")) { kn=ci; sc+=3; }
          if (v==="navn"||v==="kontonavn"||v==="beskrivelse"||v==="tekst") knaCol=ci;
        });
        if (sc > best && kn >= 0) { best=sc; hRow=i; knCol=kn; }
      }

      // Fallback: scan rows for 4-digit account numbers
      if (hRow < 0) {
        for (let i=0; i<rows.length; i++) {
          for (let ci=0; ci<3; ci++) {
            if (parseInt(rows[i][ci])>=1000 && parseInt(rows[i][ci])<=9999) {
              hRow=i-1; knCol=ci; knaCol=ci+1; break;
            }
          }
          if (hRow>=0) break;
        }
      }
      if (hRow < 0) { setParseErr("Fant ikke kontonummer-kolonne. Kontroller at filen inneholder kontonr og saldo."); return; }

      // Find the saldo column: pick the numeric column with largest sum of abs values
      // among columns that aren't kontonr or kontonavn
      const dataRows = rows.slice(hRow+1).filter(r => {
        const nr = parseInt(r[knCol]); return nr>=1000 && nr<=9999;
      });
      const hdrRow = rows[hRow];
      let bestColSum = 0;
      for (let ci=0; ci<hdrRow.length; ci++) {
        if (ci===knCol || ci===knaCol) continue;
        const hdr = String(hdrRow[ci]).toLowerCase().trim();
        // Skip columns with "ib" or "beveg" or "tillegg" in header
        if (hdr==="ib"||hdr.includes("beveg")||hdr.includes("tillegg")||hdr.includes("inn")) continue;
        // Prefer columns named saldo/ub/endelig/utgående
        const pref = hdr==="saldo"||hdr==="ub"||hdr.includes("endelig")||hdr.includes("utgående")||hdr.includes("saldo") ? 2 : 1;
        const colSum = dataRows.reduce((s,r) => {
          const v = parseFloat(String(r[ci]||0).replace(/\s/g,"").replace(",","."));
          return s + (isNaN(v)||String(r[ci]).startsWith("=") ? 0 : Math.abs(v));
        }, 0) * pref;
        if (colSum > bestColSum) { bestColSum=colSum; salCol=ci; }
      }
      if (salCol<0) salCol = hdrRow.length-1;

      // Parse accounts
      const parsed = [];
      for (let i=hRow+1; i<rows.length; i++) {
        const nr = parseInt(rows[i][knCol]);
        if (isNaN(nr)||nr<1000||nr>9999) continue;
        const raw = rows[i][salCol]??0;
        const sal = parseFloat(String(raw).replace(/\s/g,"").replace(",",".").replace(/^=.*/,"0"))||0;
        parsed.push({ kontonr:nr, kontonavn:String(rows[i][knaCol]||""), saldo:sal });
      }
      if (!parsed.length) { setParseErr("Ingen gyldige kontoer (1000–9999) funnet."); return; }
      setSaldo(parsed);
    } catch(e) { setParseErr(`Lesefeil: ${e.message}`); }
  };

  const API = import.meta.env.VITE_API_URL || "https://accunor-api.onrender.com";

  const normalizeApiBalance = (bal = {}) => {
    const eiendeler = bal.eiendeler || [];
    const ekGjeld = bal.ekGjeld || bal.ek_gjeld || [];
    const sumEiendeler = Number(bal.sumEiendeler ?? bal.sum_eiendeler ?? 0) || 0;
    const sumEkGjeld = Number(bal.sumEkGjeld ?? bal.sum_ek_gjeld ?? 0) || 0;
    const ekTotal = Number(bal.ekTotal ?? bal.ek_total ?? 0) || 0;
    return {
      ...bal,
      eiendeler,
      ekGjeld,
      ek_gjeld: ekGjeld,
      sumEiendeler,
      sum_eiendeler: sumEiendeler,
      sumEkGjeld,
      sum_ek_gjeld: sumEkGjeld,
      ekTotal,
      ek_total: ekTotal,
    };
  };

  const normalizeGeneratedResult = (payload = {}, fallback = {}) => {
    const cl = payload.classified || fallback.cl || {};
    const resLines = payload.resultat_lines || fallback.resLines || [];
    const bal = normalizeApiBalance(payload.balanse || fallback.bal || {});
    const ai = payload.ai_result || fallback.ai || {};
    const noter = payload.noter || ai?.noter || fallback.noter || [];
    const analysis = payload.analysis || fallback.analysis || {};
    return { cl, resLines, bal, ai: { ...ai, noter }, noter, analysis };
  };

  const serializeSelskapsinfo = () => ({
    navn: info.navn || "Selskap AS",
    orgnr: info.orgnr || "",
    daglig_leder: info.dagligLeder || "",
    styreleder: info.styreleder || "",
    bransje: info.bransje || "",
    antall_ansatte: parseInt(info.antallAnsatte) || 0,
    adresse: info.adresse || "",
    regnskapsaar: parseInt(info.regnskapsaar) || new Date().getFullYear() - 1,
    tillegg: info.tillegg || "",
    fordring_eier: parseFloat(info.fordringEier) || 0,
    fordring_tilbakebetaling: info.fordringTilbakebetaling || "",
  });

  const serializeTilknyttede = () =>
    tilknyttede
      .filter(t => t.selskapsnavn)
      .map(t => ({
        selskapsnavn: t.selskapsnavn,
        orgnr: t.orgnr || "",
        forretningskontor: t.forretningskontor || "",
        eierandel_pct: parseFloat(t.eierandel) || 0,
        bokfoert_verdi: parseFloat(t.bokfoertVerdi) || 0,
        mottatt_utbytte: parseFloat(t.utbytte) || 0,
      }));

  const serializeDriftsmidler = () => ({
    anskaffelseskost_ib: parseFloat(driftsmidler.anskIb) || 0,
    tilgang: parseFloat(driftsmidler.tilgang) || 0,
    avgang: 0,
    anskaffelseskost_ub: parseFloat(driftsmidler.anskUb) || 0,
    akk_avskrivninger: parseFloat(driftsmidler.akkAvskr) || 0,
    balansefoert_verdi: parseFloat(driftsmidler.balVerdi) || 0,
    arets_avskrivning: parseFloat(driftsmidler.aretsAvskr) || 0,
    kunstverk: 0,
  });

  const serializeEgenkapital = (aarsresultat = 0) => {
    const akIb = parseFloat(egenkapital.akIb) || 0;
    const akUb = parseFloat(egenkapital.akUb) || akIb;
    const annenIb = parseFloat(egenkapital.annenIb) || 0;
    const utbytte = parseFloat(egenkapital.utbytte) || 0;
    const annenUb = annenIb + aarsresultat - utbytte;
    return {
      aksjekapital_ib: akIb,
      aksjekapital_ub: akUb,
      annen_ek_ib: annenIb,
      utbytte,
      aarsresultat,
      annen_ek_ub: annenUb,
    };
  };

  const serializeQaAnswers = () =>
    qaQuestions
      .filter(q => q.answer?.trim())
      .map(q => ({ id: q.id, question: q.question, answer: q.answer }));

  const parseVpIfNeeded = async () => {
    if (!vpFile) return vpResult || null;
    setVpLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", vpFile);
      const resp = await fetch(`${API}/api/regnskap/parse-vp-transaksjoner`, {
        method: "POST",
        body: formData,
      });
      if (!resp.ok) throw new Error(`VP-API svarte ${resp.status}`);
      const data = await resp.json();
      const parsed = data?.sammendrag || null;
      setVpResult(parsed);
      return parsed;
    } catch (e) {
      console.error("VP-parsing feilet:", e);
      setGenError(prev => prev || `Kunne ikke lese verdipapirfilen: ${e.message}`);
      return null;
    } finally {
      setVpLoading(false);
    }
  };

  const canGenerate = selskapstype === "drift" ? saldo.length > 0 : (dokFiler.length > 0 || saldo.length > 0);

  const [genError, setGenError] = useState("");

  const generate = async (fromQa = false) => {
    if (!canGenerate) return;
    setLoading(true);
    setResult(null);
    setGenError("");

    let cl = {}, resLines = [], bal = {};
    let analysis = {};

    if (saldo.length) {
      setLoadMsg("Klassifiserer kontoer etter NS 4102...");
      await new Promise(r => setTimeout(r, 100));
      cl = classifyAccounts(saldo);
      resLines = buildResultatLines(cl);
      bal = buildBalanseData(cl);
    }

    setLoadMsg("Leser eventuelle verdipapirtransaksjoner...");
    const parsedVp = await parseVpIfNeeded();

    if (dokFiler.length > 0) {
      setLoadMsg(`Analyserer ${dokFiler.length} dokumenter og avstemmer mot bank...`);
      try {
        const formData = new FormData();
        for (const f of dokFiler) formData.append("files", f);
        formData.append("selskapsinfo", JSON.stringify(serializeSelskapsinfo()));
        formData.append("tilknyttede", JSON.stringify(serializeTilknyttede()));
        const qaAnswers = serializeQaAnswers();
        if (qaAnswers.length > 0) formData.append("qa_answers", JSON.stringify(qaAnswers));

        const resp = await fetch(`${API}/api/regnskap/analyse-grunnlag`, {
          method: "POST",
          body: formData,
        });
        if (!resp.ok) {
          const errText = await resp.text();
          throw new Error(`API svarte ${resp.status}: ${errText.slice(0, 200)}`);
        }
        const d = await resp.json();
        analysis = d;

        if (selskapstype === "holding" && !saldo.length) {
          cl = d.classified || cl;
          resLines = d.resultat_lines || resLines;
          bal = normalizeApiBalance(d.balanse || bal);
        }

        if (d.questions?.length > 0) {
          setQaQuestions(prev => d.questions.map((q, i) => {
            const qid = q.id || `q_${i}_${q.dato || ""}_${q.belop || ""}`;
            const existing = prev.find(x => x.id === qid) || prev.find(x => x.question === q.question);
            return {
              id: qid,
              question: q.question,
              context: q.context || q.reason || "",
              answer: existing?.answer || "",
            };
          }));
          setQaActive(true);
        } else {
          setQaQuestions([]);
          setQaActive(false);
        }
      } catch (e) {
        console.error("Dokumentanalyse feilet:", e);
        if (selskapstype === "holding" && !saldo.length) {
          setGenError(`Feil ved dokumentanalyse: ${e.message}.`);
          setLoading(false);
          return;
        }
        setGenError(`Dokumentanalyse feilet: ${e.message}. Regnskapet ble generert uten dokumentavstemming.`);
      }
    }

    const preResult = normalizeGeneratedResult(
      { classified: cl, resultat_lines: resLines, balanse: bal, analysis },
      { cl, resLines, bal, analysis }
    );

    if (!preResult.resLines.length && selskapstype === "holding") {
      setGenError("Fant ikke nok grunnlag til å bygge et regnskapsutkast. Last opp kontoutskrifter, årsoppgaver eller saldobalanse.");
      setLoadMsg("");
      setLoading(false);
      return;
    }

    setLoadMsg("Genererer årsberetning og strukturerte noter...");
    try {
      const aarsresultat = preResult.resLines.find(l => l.label === "Årsresultat")?.val || 0;
      const resp = await fetch(`${API}/api/regnskap/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selskapstype,
          classified: preResult.cl,
          resultat_lines: preResult.resLines,
          balanse: preResult.bal,
          selskapsinfo: serializeSelskapsinfo(),
          tilknyttede: serializeTilknyttede(),
          qa_answers: serializeQaAnswers(),
          vp_result: parsedVp || analysis?.vp_result || vpResult || {},
          driftsmidler: serializeDriftsmidler(),
          egenkapital: serializeEgenkapital(aarsresultat),
          analysis,
        }),
      });
      if (!resp.ok) throw new Error(`API svarte ${resp.status}`);
      const d = await resp.json();
      setResult(normalizeGeneratedResult(d, preResult));
    } catch (e) {
      console.error("Årsberetning API-feil:", e);
      setResult(preResult);
      setGenError(prev => prev || `Kunne ikke generere alle AI-delene: ${e.message}`);
    }

    setLoading(false);
  };

  const continueAfterQa = () => {
    setQaActive(false);
    generate(true);
  };

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfMsg, setPdfMsg] = useState("");

  const downloadPdf = async () => {
    if (!result) return;
    setPdfLoading(true);
    setPdfMsg("Starter API — vennligst vent (kan ta 30–60 sek første gang)...");
    try {
      const resp = await fetch(`${API}/api/regnskap/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classified: result.cl,
          resultat_lines: result.resLines,
          balanse: result.bal,
          ai_result: result.ai || {},
          noter: result.noter || result.ai?.noter || [],
          selskapsinfo: serializeSelskapsinfo(),
        }),
      });
      if (!resp.ok) throw new Error(`API svarte ${resp.status}`);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href=url; a.download=`aarsregnskap_${(info.navn||"selskap").replace(/\s/g,"_")}_${info.regnskapsaar}.pdf`; a.click();
      URL.revokeObjectURL(url);
      setPdfMsg("");
    } catch(e) {
      setPdfMsg(`Feil: ${e.message}. Prøv igjen om 30 sekunder.`);
    }
    setPdfLoading(false);
  };

  const inField = (label, key, ph, type="text") => (
    <div key={key}>
      <label style={{ display:"block", fontSize:".72rem", fontWeight:600, color:"var(--d)", marginBottom:4, letterSpacing:".02em" }}>{label}</label>
      <input type={type} value={info[key]} onChange={e => setInfo(p=>({...p,[key]:e.target.value}))} placeholder={ph}
        style={{ width:"100%", padding:".62rem .9rem", border:"1.5px solid var(--line)", borderRadius:5, fontSize:".86rem", fontFamily:"var(--sans)", outline:"none", background:"#fff", color:"var(--d)" }} />
    </div>
  );

  const TABS = ["Resultatregnskap","Balanse","Årsberetning","Noter","Kontofordeling"];
  const AB_SECTIONS = [["Virksomhetens art og beliggenhet","virksomheten"],["Årsregnskap og forutsetning om fortsatt drift","aarsregnskap_og_drift"],["Arbeidsmiljø og likestilling","arbeidsmiljo"],["Ytre miljø","ytre_miljo"],["Fremtidig utvikling","fremtidig_utvikling"],["Resultatdisponering","resultatdisponering"]];

  return (<>
    <PH lb="AI Regnskap" t="Komplett årsregnskap på minutter" sub="Fra saldobalanse til ferdig årsregnskap med resultat, balanse, noter og årsberetning — automatisk generert og klar for gjennomgang." />

    {/* ── Produktintro ── */}
    <Sec>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,5vw,4rem)" }} className="grid-2">
        <Rv>
          <Lbl>Slik fungerer det</Lbl>
          <H2c style={{ fontSize: "1.4rem" }}>AI som forstår norsk regnskap</H2c>
          <Pg>Modulen er bygget spesifikt for norske aksjeselskaper og følger NS 4102, regnskapsloven og god regnskapsskikk. Den håndterer alt fra enkle driftsselskaper til holdingselskaper med verdipapirporteføljer og tilknyttede selskaper.</Pg>
          <Rl />
          <Pg style={{ fontSize: ".88rem" }}>Resultatet er et komplett utkast til årsregnskap med resultatregnskap, balanse, 7 noter og årsberetning — generert som PDF klar for kvalitetskontroll av autorisert regnskapsfører.</Pg>
        </Rv>
        <Rv delay={.1}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Velg selskapstype", "Driftsselskap med regnskapssystem eller holdingselskap uten — modulen tilpasser seg automatisk."],
              ["Last opp grunnlag", "Saldobalanse, kontoutskrifter, årsoppgaver, bilag og VPS-oppgaver. PDF, Excel og ZIP. AI leser og strukturerer alt."],
              ["AI analyserer", "Klassifisering etter NS 4102, fritaksmetoden, skatteberegning, permanente og midlertidige forskjeller — automatisk."],
              ["Ferdig årsregnskap", "Resultat, balanse, 7 noter og årsberetning i profesjonell PDF klar for gjennomgang og innlevering."],
            ].map(([t, d], i) => (
              <div key={t} className="hov-card" style={{ padding: "1.1rem 1.3rem", borderLeft: "2px solid var(--B)", background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: ".68rem", fontWeight: 700, color: "var(--B)", background: "var(--Bl)", width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                  <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--d)" }}>{t}</span>
                </div>
                <p style={{ fontSize: ".8rem", color: "var(--d2)", lineHeight: 1.6, marginLeft: 28 }}>{d}</p>
              </div>
            ))}
          </div>
        </Rv>
      </div>
    </Sec>

    <Sec bg="var(--w2)">

      {/* ── SELSKAPSTYPE ── */}
      <Rv>
        <Lbl>Velg selskapstype</Lbl>
        <H2c style={{ fontSize:"1.3rem" }}>Hva slags selskap?</H2c>
        <Pg style={{ marginBottom:16, fontSize:".86rem" }}>Dette bestemmer hvilke steg og dokumenter som er relevante.</Pg>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { key:"drift", t:"Driftsselskap", desc:"Har regnskapssystem (Tripletex, Visma, etc). Eksporterer saldobalanse.", icon:"▤" },
            { key:"holding", t:"Holdingselskap", desc:"Ingen regnskapssystem. Kontoutskrifter, bilag og årsoppgaver er grunnlaget.", icon:"◇" },
          ].map(o => (
            <div key={o.key} onClick={()=>setSelskapstype(o.key)}
              style={{ padding:"1.4rem 1.6rem", borderRadius:8, border: selskapstype===o.key ? "2px solid var(--B)" : "2px solid var(--line)",
                background: selskapstype===o.key ? "var(--Bl)" : "#fff", cursor:"pointer", transition:"all .2s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <span style={{ fontSize:"1rem" }}>{o.icon}</span>
                <span style={{ fontSize:".92rem", fontWeight:600, color: selskapstype===o.key ? "var(--B)" : "var(--d)" }}>{o.t}</span>
                {selskapstype===o.key && <span style={{ marginLeft:"auto", color:"var(--B)", fontSize:".8rem", fontWeight:700 }}>✓</span>}
              </div>
              <p style={{ fontSize:".8rem", color:"var(--d2)", lineHeight:1.5 }}>{o.desc}</p>
            </div>
          ))}
        </div>
      </Rv>

      {/* ── STEG 1: Saldobalanse (kun driftsselskap) ── */}
      {selskapstype === "drift" && (
        <Rv>
          <div style={{ marginTop:32 }}>
            <Lbl>Steg 1 — Saldobalanse</Lbl>
            <H2c style={{ fontSize:"1.3rem" }}>Last opp saldobalanse</H2c>
            <Pg style={{ marginBottom:16, fontSize:".88rem" }}>Excel-fil fra Tripletex, Visma, PowerOffice eller 24SevenOffice.</Pg>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.xlsm,.csv" style={{ display:"none" }} onChange={e=>parseExcel(e.target.files?.[0])} />
            <div onClick={()=>fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();parseExcel(e.dataTransfer.files?.[0]);}}
              style={{ border:`2px dashed ${saldo.length?"var(--B)":"var(--line)"}`, borderRadius:8, padding:"1.6rem 1.4rem", textAlign:"center", cursor:"pointer", background:saldo.length?"var(--Bl)":"#fff", transition:"all .3s" }}>
              {fileName ? (
                <div>
                  <span style={{ fontSize:".85rem", fontWeight:600, color:"var(--B)" }}>OK — {fileName}</span>
                  <span style={{ fontSize:".76rem", color:"var(--d3)", marginLeft:8 }}>{saldo.length} kontoer</span>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize:".85rem", color:"var(--d2)", marginBottom:2 }}>Dra fil hit eller <span style={{ color:"var(--B)", fontWeight:600 }}>klikk for å velge</span></div>
                  <div style={{ fontSize:".72rem", color:"var(--d3)" }}>xlsx / xls / xlsm</div>
                </div>
              )}
            </div>
            {parseErr && <div style={{ marginTop:8, fontSize:".78rem", color:"#dc2626", padding:"6px 10px", background:"#fef2f2", borderRadius:5 }}>{parseErr}</div>}
          </div>
        </Rv>
      )}

      {/* ── STEG 2: Dokumenter (alle typer — PDF + Excel) ── */}
      {selskapstype && (
      <Rv delay={.05}>
        <div style={{ marginTop:32 }}>
          <Lbl>{selskapstype === "drift" ? "Steg 2" : "Steg 1"} — Dokumenter {selskapstype === "drift" ? "(valgfritt)" : ""}</Lbl>
          <H2c style={{ fontSize:"1.3rem" }}>{selskapstype === "holding" ? "Kontoutskrifter, bilag og årsoppgaver" : "Bankdokumenter og årsoppgaver"}</H2c>
          <Pg style={{ marginBottom:16, fontSize:".88rem" }}>
            {selskapstype === "holding"
              ? "Last opp alt grunnlag: kontoutskrifter, bilag, årsoppgaver, VPS-oppgaver og fondskonto. PDF, Excel eller én ZIP-fil med undermapper. AI bygger saldobalanse og regnskap fra dokumentene."
              : "Kontoutskrifter, VPS-oppgaver, fondskonto, årsoppgaver og bilag. PDF, Excel eller ZIP. AI leser og strukturerer automatisk."
            }
          </Pg>
          <input ref={dokFileRef} type="file" accept=".pdf,.xlsx,.xls,.xlsm,.csv,.zip" multiple style={{ display:"none" }} onChange={e=>{
            const files = Array.from(e.target.files||[]);
            setDokFiler(prev=>[...prev,...files]);
          }} />
          <div onClick={()=>dokFileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();setDokFiler(prev=>[...prev,...Array.from(e.dataTransfer.files||[])]);}}
            style={{ border:`2px dashed ${dokFiler.length?"var(--B)":"var(--line)"}`, borderRadius:8, padding:"1.6rem 1.4rem", textAlign:"center", cursor:"pointer", background:dokFiler.length?"var(--Bl)":"#fff", transition:"all .3s" }}>
            {dokFiler.length ? (
              <span style={{ fontSize:".85rem", fontWeight:600, color:"var(--B)" }}>OK — {dokFiler.length} dokument{dokFiler.length>1?"er":""} valgt</span>
            ) : (
              <div>
                <div style={{ fontSize:".85rem", color:"var(--d2)", marginBottom:2 }}>Dra filer hit eller <span style={{ color:"var(--B)", fontWeight:600 }}>klikk for å velge</span></div>
                <div style={{ fontSize:".72rem", color:"var(--d3)" }}>PDF / Excel / ZIP — kontoutskrifter, årsoppgaver, VPS/VPU, bilag. ZIP med undermapper støttes.</div>
              </div>
            )}
          </div>
          {dokFiler.length > 0 && (
            <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:6 }}>
              {dokFiler.map((f,i)=>(
                <span key={i} style={{ fontSize:".73rem", background:"var(--Bl)", color:"var(--B)", padding:"3px 10px", borderRadius:12, display:"inline-flex", alignItems:"center", gap:4 }}>
                  {f.name}
                  <span onClick={e=>{e.stopPropagation();setDokFiler(p=>p.filter((_,j)=>j!==i));}} style={{ cursor:"pointer", opacity:.6, fontWeight:700 }}>x</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </Rv>
      )}

      {/* ── VP-transaksjoner (valgfritt, begge typer) ── */}
      {selskapstype && (
      <Rv delay={.1}>
        <div style={{ marginTop:32 }}>
          <Lbl>{selskapstype === "drift" ? "Steg 3" : "Steg 2"} — Aksjetransaksjoner (valgfritt)</Lbl>
          <H2c style={{ fontSize:"1.3rem" }}>Verdipapirtransaksjoner</H2c>
          <Pg style={{ marginBottom:16, fontSize:".88rem" }}>Excel med kjøp/salg av aksjer, obligasjoner og fond. FIFO-beregning og skatteeffekter.</Pg>
          <input ref={vpFileRef} type="file" accept=".xlsx,.xls" style={{ display:"none" }} onChange={e=>setVpFile(e.target.files?.[0]||null)} />
          <div onClick={()=>vpFileRef.current?.click()}
            style={{ border:`2px dashed ${vpFile?"var(--B)":"var(--line)"}`, borderRadius:8, padding:"1.6rem 1.4rem", textAlign:"center", cursor:"pointer", background:vpFile?"var(--Bl)":"#fff", transition:"all .3s" }}>
            {vpFile ? (
              <span style={{ fontSize:".85rem", fontWeight:600, color:"var(--B)" }}>OK — {vpFile.name}</span>
            ) : (
              <div>
                <div style={{ fontSize:".85rem", color:"var(--d2)", marginBottom:2 }}>Dra Excel hit eller <span style={{ color:"var(--B)", fontWeight:600 }}>klikk for å velge</span></div>
                <div style={{ fontSize:".72rem", color:"var(--d3)" }}>VPS-transaksjonsoversikt / Nordea / DNB</div>
              </div>
            )}
          </div>
        </div>
      </Rv>
      )}

      {/* ── Selskapsinformasjon ── */}
      {selskapstype && (
      <Rv delay={.15}>
        <div style={{ marginTop:32 }}>
          <Lbl>{selskapstype === "drift" ? "Steg 4" : "Steg 3"} — Selskapsinformasjon</Lbl>
          <H2c style={{ fontSize:"1.3rem" }}>Om selskapet</H2c>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:".72rem", fontWeight:600, color:"var(--d)", marginBottom:4, letterSpacing:".02em" }}>Søk på selskapsnavn eller org.nr.</label>
            <div style={{ position:"relative" }}>
              <input type="text" value={brregQuery} onChange={e=>onBrregInput(e.target.value)} onFocus={()=>brregSuggestions.length&&setBrregShowDropdown(true)} placeholder="Skriv selskapsnavn eller org.nr..."
                style={{ width:"100%", padding:".72rem 1rem", border:"1.5px solid var(--B)", borderRadius:6, fontSize:".9rem", fontFamily:"var(--sans)", outline:"none", background:"#fff", color:"var(--d)" }} />
              {brregLoading && <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", display:"inline-block", width:16, height:16, border:"2px solid var(--line)", borderTopColor:"var(--B)", borderRadius:"50%", animation:"spin .7s linear infinite" }} />}
              {brregShowDropdown && brregSuggestions.length > 0 && (
                <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:20, background:"#fff", border:"1px solid var(--line)", borderRadius:"0 0 6px 6px", boxShadow:"0 8px 24px rgba(0,0,0,.08)", maxHeight:240, overflowY:"auto" }}>
                  {brregSuggestions.map((h,i) => (
                    <div key={h.orgnr||i} onClick={()=>selectBrregHit(h)} style={{ padding:"10px 14px", cursor:"pointer", borderBottom:"1px solid var(--line)", display:"flex", justifyContent:"space-between", alignItems:"center", transition:"background .15s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="var(--Bl)"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                      <div>
                        <div style={{ fontSize:".85rem", fontWeight:600, color:"var(--d)" }}>{h.navn}</div>
                        <div style={{ fontSize:".72rem", color:"var(--d3)" }}>{h.poststed}{h.bransje ? ` · ${h.bransje}` : ""}</div>
                      </div>
                      <span style={{ fontSize:".76rem", color:"var(--B)", fontVariantNumeric:"tabular-nums", fontWeight:500 }}>{h.orgnr}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {info.navn && <div style={{ marginTop:6, fontSize:".78rem", color:"var(--B)", fontWeight:500 }}>{info.navn} · {info.orgnr}</div>}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }} className="grid-2">
            {inField("Selskapsnavn","navn","Fylles ut fra søk")}
            {inField("Org.nr.","orgnr","Fylles ut fra søk")}
            {inField("Styreleder","styreleder","Hentes automatisk")}
            {inField("Daglig leder","dagligLeder","Hentes automatisk")}
            {inField("Bransje","bransje","Hentes automatisk")}
            {inField("Forretningsadresse","adresse","Hentes automatisk")}
            {inField("Regnskapsår","regnskapsaar","2024","number")}
            {inField("Antall ansatte","antallAnsatte","0","number")}
          </div>

          {/* Tilleggsinformasjon */}
          <div style={{ marginTop:14 }}>
            <label style={{ display:"block", fontSize:".72rem", fontWeight:600, color:"var(--d)", marginBottom:4 }}>Tilleggsinformasjon</label>
            <textarea value={info.tillegg} onChange={e=>setInfo(p=>({...p,tillegg:e.target.value}))} placeholder="Vesentlige hendelser, investeringer, spesielle forhold..."
              style={{ width:"100%", padding:".55rem .85rem", border:"1.5px solid var(--line)", borderRadius:5, fontSize:".84rem", fontFamily:"var(--sans)", outline:"none", resize:"vertical", minHeight:50, background:"#fff", color:"var(--d)" }} />
          </div>

          {/* ── Tilknyttede selskaper (ekspanderbar) ── */}
          <div style={{ marginTop:18, border:"1px solid var(--line)", borderRadius:6, overflow:"hidden" }}>
            <div onClick={()=>setOpenSec(s=>({...s,tilknyttede:!s.tilknyttede}))} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"var(--w2)", cursor:"pointer" }}>
              <span style={{ fontSize:".82rem", fontWeight:600, color:"var(--d)" }}>Tilknyttede selskaper (20-50 % eierandel)</span>
              <span style={{ fontSize:".7rem", color:"var(--d3)", transform:openSec.tilknyttede?"rotate(180deg)":"none", transition:"transform .3s" }}>▼</span>
            </div>
            {openSec.tilknyttede && (
              <div style={{ padding:14 }}>
                <p style={{ fontSize:".76rem", color:"var(--d3)", marginBottom:10 }}>Søk på selskapsnavn eller org.nr. Eierandel, bokført verdi og utbytte fylles inn manuelt.</p>
                {tilknyttede.map((t,i)=>(
                  <div key={i} style={{ marginBottom:12, padding:"10px 12px", border:"1px solid var(--line)", borderRadius:6, background:"#fff" }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                      <div style={{ flex:1, position:"relative" }}>
                        <input value={t.searchQuery||t.selskapsnavn} onChange={e=>searchTilknyttet(i, e.target.value)} placeholder="Søk selskapsnavn eller org.nr..."
                          style={{ width:"100%", padding:"6px 10px", border:"1px solid var(--line)", borderRadius:4, fontSize:".82rem" }}/>
                        {(tilkSuggestions[i]||[]).length > 0 && (
                          <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:20, background:"#fff", border:"1px solid var(--line)", borderRadius:"0 0 6px 6px", boxShadow:"0 6px 16px rgba(0,0,0,.07)" }}>
                            {tilkSuggestions[i].map((h,j) => (
                              <div key={h.orgnr||j} onClick={()=>selectTilknyttetHit(i,h)} style={{ padding:"8px 12px", cursor:"pointer", borderBottom:"1px solid var(--line)", display:"flex", justifyContent:"space-between", fontSize:".8rem" }}
                                onMouseEnter={e=>e.currentTarget.style.background="var(--Bl)"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                                <span style={{ fontWeight:600, color:"var(--d)" }}>{h.navn}</span>
                                <span style={{ color:"var(--B)", fontVariantNumeric:"tabular-nums" }}>{h.orgnr}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={()=>removeTilknyttet(i)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:".9rem", color:"#dc2626", padding:"4px 6px", flexShrink:0 }}>x</button>
                    </div>
                    {t.selskapsnavn && <div style={{ fontSize:".75rem", color:"var(--B)", fontWeight:500, marginBottom:6 }}>{t.selskapsnavn} · {t.orgnr} · {t.forretningskontor}</div>}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                      <div><label style={{ fontSize:".66rem", fontWeight:600, color:"var(--d3)" }}>Eierandel %</label><input type="number" value={t.eierandel} onChange={e=>updTilknyttet(i,"eierandel",e.target.value)} style={{ width:"100%", padding:"5px 8px", border:"1px solid var(--line)", borderRadius:4, fontSize:".8rem" }}/></div>
                      <div><label style={{ fontSize:".66rem", fontWeight:600, color:"var(--d3)" }}>Bokført verdi</label><input type="number" value={t.bokfoertVerdi} onChange={e=>updTilknyttet(i,"bokfoertVerdi",e.target.value)} style={{ width:"100%", padding:"5px 8px", border:"1px solid var(--line)", borderRadius:4, fontSize:".8rem" }}/></div>
                      <div><label style={{ fontSize:".66rem", fontWeight:600, color:"var(--d3)" }}>Mottatt utbytte</label><input type="number" value={t.utbytte} onChange={e=>updTilknyttet(i,"utbytte",e.target.value)} style={{ width:"100%", padding:"5px 8px", border:"1px solid var(--line)", borderRadius:4, fontSize:".8rem" }}/></div>
                    </div>
                  </div>
                ))}
                <button onClick={addTilknyttet} style={{ fontSize:".78rem", fontWeight:600, color:"var(--B)", background:"none", border:"1px dashed var(--B)", borderRadius:4, padding:"6px 14px", cursor:"pointer", marginTop:4 }}>+ Legg til selskap</button>
              </div>
            )}
          </div>

          {/* ── Fordring på eier ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11, marginTop:14 }} className="grid-2">
            {inField("Fordring på eier (kr)","fordringEier","0","number")}
            {inField("Tilbakebetales","fordringTilbakebetaling","F.eks. desember 2025")}
          </div>

        </div>
      </Rv>
      )}

      {/* ── Generer-knapp ── */}
      {selskapstype && (
      <div style={{ marginTop:"clamp(2rem,4vw,2.8rem)", textAlign:"center" }}>
        <Rv>
          <button onClick={generate} disabled={loading || !canGenerate} style={{
            display:"inline-flex", alignItems:"center", gap:10, fontSize:".9rem", fontWeight:600, padding:".9rem 2.8rem",
            borderRadius:5, border:"none", letterSpacing:".02em", cursor:canGenerate&&!loading?"pointer":"not-allowed",
            background: canGenerate&&!loading ? "var(--B)" : "var(--line)", color: canGenerate&&!loading ? "#fff" : "var(--d3)",
            transition:"all .3s",
          }}>
            {loading ? (
              <><span style={{ display:"inline-block", width:14, height:14, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite" }} />{loadMsg}</>
            ) : "Generer årsregnskap"}
          </button>
          {!canGenerate && !loading && <div style={{ marginTop:10, fontSize:".76rem", color:"var(--d3)" }}>
            {selskapstype === "drift" ? "Last opp saldobalanse for å fortsette" : selskapstype ? "Last opp grunnlagsdokumenter for å fortsette" : "Velg selskapstype for å fortsette"}
          </div>}
          {genError && <div style={{ marginTop:12, padding:"10px 16px", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:6, fontSize:".82rem", color:"#dc2626", maxWidth:500, margin:"12px auto 0", textAlign:"left" }}>
            {genError}
          </div>}
        </Rv>
      </div>
      )}

      {/* ── Q&A: Uklare transaksjoner ── */}
      {qaActive && qaQuestions.length > 0 && (
        <div style={{ marginTop:32 }}>
          <Rv>
            <div style={{ padding:"1.6rem 2rem", background:"#fff", border:"2px solid #f59e0b", borderRadius:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <span style={{ fontSize:"1.1rem" }}>⚠️</span>
                <h3 style={{ fontSize:"1rem", fontWeight:700, color:"var(--d)", margin:0 }}>AI trenger avklaring — utkast er laget, men noen poster er usikre</h3>
              </div>
              <p style={{ fontSize:".82rem", color:"var(--d2)", marginBottom:18, lineHeight:1.6 }}>
                Utkastet under er generert, men AI er usikker på klassifiseringen av noen poster. Svar på spørsmålene og trykk "Oppdater" for et mer nøyaktig regnskap.
              </p>
              {qaQuestions.map((q, i) => (
                <div key={q.id} style={{ padding:"14px 16px", background:"var(--w2)", borderRadius:6, marginBottom:10, borderLeft:"3px solid var(--B)" }}>
                  <div style={{ fontSize:".82rem", fontWeight:600, color:"var(--d)", marginBottom:4 }}>{q.question}</div>
                  {q.context && <div style={{ fontSize:".72rem", color:"var(--d3)", marginBottom:8, fontStyle:"italic" }}>{q.context}</div>}
                  <input value={q.answer||""} onChange={e=>answerQa(q.id, e.target.value)} placeholder="Skriv svar her..."
                    style={{ width:"100%", padding:".5rem .8rem", border:"1.5px solid var(--line)", borderRadius:4, fontSize:".84rem", fontFamily:"var(--sans)", outline:"none", background:"#fff" }} />
                </div>
              ))}
              <button onClick={continueAfterQa} disabled={!allQaAnswered} style={{
                marginTop:12, display:"inline-flex", alignItems:"center", gap:8, fontSize:".85rem", fontWeight:600,
                padding:".7rem 2rem", borderRadius:5, border:"none",
                background: allQaAnswered ? "var(--B)" : "var(--line)", color: allQaAnswered ? "#fff" : "var(--d3)",
                cursor: allQaAnswered ? "pointer" : "not-allowed", transition:"all .3s",
              }}>
                Oppdater regnskap med svarene →
              </button>
            </div>
          </Rv>
        </div>
      )}
    </Sec>

    {/* ══ RESULTATER ══ */}
    {result && !loading && (
      <Sec>
        <Rv>
          {/* Nøkkeltall */}
          {(() => {
            const aarsres = result.resLines.find(l=>l.label==="Årsresultat")?.val||0;
            const driftsres = result.resLines.find(l=>l.label==="Driftsresultat")?.val||0;
            const ekPst = result.bal.sumEiendeler ? ((result.bal.ekTotal/result.bal.sumEiendeler)*100).toFixed(1) : "—";
            const balanced = Math.abs(result.bal.sumEiendeler - result.bal.sumEkGjeld) < 1;
            return (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0, border:"1px solid var(--line)", borderRadius:8, overflow:"hidden", marginBottom:32 }}>
                {[
                  { v:fmtNok(aarsres), l:"Årsresultat", s:aarsres>=0?"Overskudd":"Underskudd", c:aarsres>=0?"var(--B)":"#dc2626" },
                  { v:fmtNok(driftsres), l:"Driftsresultat", s:"Før finans og skatt", c:"var(--d)" },
                  { v:fmtNok(result.bal.sumEiendeler), l:"Sum eiendeler", s:"Totalkapital", c:"var(--d)" },
                  { v:`${ekPst} %`, l:"Egenkapitalandel", s:balanced?"✓ Balansen stemmer":"⚠ Avvik i balansen", c:balanced?"#16a34a":"#dc2626" },
                ].map((m,i) => (
                  <div key={i} style={{ padding:"1.4rem 1.6rem", borderRight:i<3?"1px solid var(--line)":"none", background:"#fff" }}>
                    <div style={{ fontFamily:"var(--serif)", fontSize:"clamp(1.3rem,2vw,1.7rem)", color:m.c, fontWeight:300, lineHeight:1, marginBottom:6 }}>{m.v}</div>
                    <div style={{ fontSize:".77rem", fontWeight:600, color:"var(--d)", letterSpacing:".02em" }}>{m.l}</div>
                    <div style={{ fontSize:".71rem", color:m.c==="var(--d)"?"var(--d3)":m.c, marginTop:3, fontWeight:m.c!=="var(--d)"?600:400 }}>{m.s}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          {(result.analysis?.summary || result.analysis?.reconciliation?.diagnostics) && (
            <div style={{ marginBottom:24, padding:"1rem 1.2rem", background:"var(--w2)", border:"1px solid var(--line)", borderRadius:8 }}>
              <div style={{ fontSize:".76rem", fontWeight:700, color:"var(--B)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:6 }}>Dokumentavstemming</div>
              {result.analysis?.summary && <p style={{ fontSize:".82rem", color:"var(--d2)", lineHeight:1.65, marginBottom:8 }}>{result.analysis.summary}</p>}
              {result.analysis?.reconciliation?.diagnostics && (
                <div style={{ display:"flex", gap:16, flexWrap:"wrap", fontSize:".76rem", color:"var(--d3)" }}>
                  <span>Banktransaksjoner: {result.analysis.reconciliation.diagnostics.antall_banktransaksjoner ?? 0}</span>
                  <span>Matchede fakturaer: {result.analysis.reconciliation.diagnostics.matchede_fakturaer ?? 0}</span>
                  <span>Umatchede bankposter: {(result.analysis.reconciliation.diagnostics.antall_umatchede_bankposter ?? result.analysis.reconciliation.diagnostics.antall_umutchede_bankposter ?? 0)}</span>
                </div>
              )}
            </div>
          )}

          {/* Faner + PDF-knapp */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid var(--line)", marginBottom:28 }}>
            <div style={{ display:"flex", gap:2 }}>
            {TABS.map((t,i) => (
              <button key={t} onClick={()=>setTab(i)} style={{
                padding:".68rem 1.4rem", fontSize:".82rem", fontWeight:tab===i?600:400,
                color:tab===i?"var(--B)":"var(--d2)", background:"transparent", border:"none",
                borderBottom:tab===i?"2px solid var(--B)":"2px solid transparent",
                cursor:"pointer", letterSpacing:".01em", transition:"all .2s",
              }}>{t}</button>
            ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
              <button onClick={downloadPdf} disabled={pdfLoading} style={{ display:"inline-flex", alignItems:"center", gap:7, fontSize:".78rem", fontWeight:600, padding:".5rem 1.2rem", borderRadius:5, border:"1.5px solid var(--line)", background:"#fff", color: pdfLoading ? "var(--d3)" : "var(--d)", cursor: pdfLoading ? "wait" : "pointer", letterSpacing:".01em" }}>
                {pdfLoading ? <><span style={{ display:"inline-block", width:12, height:12, border:"2px solid var(--line)", borderTopColor:"var(--B)", borderRadius:"50%", animation:"spin .7s linear infinite" }} /> Genererer...</> : "↓ Last ned PDF"}
              </button>
              {pdfMsg && <div style={{ fontSize:".72rem", color: pdfMsg.startsWith("Feil") ? "#dc2626" : "var(--d3)", maxWidth:280, textAlign:"right" }}>{pdfMsg}</div>}
            </div>
          </div>

          {/* Tab: Resultatregnskap */}
          {tab === 0 && (
            <div style={{ maxWidth:580 }}>
              {result.resLines.map((item,i) => <RRow key={i} item={item} />)}
            </div>
          )}

          {/* Tab: Balanse */}
          {tab === 1 && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"clamp(2rem,5vw,4rem)" }}>
              <div>
                <div style={{ fontSize:".74rem", fontWeight:700, color:"var(--B)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>Eiendeler</div>
                {result.bal.eiendeler.map((item,i) => <RRow key={i} item={item} />)}
              </div>
              <div>
                <div style={{ fontSize:".74rem", fontWeight:700, color:"var(--B)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:10 }}>Egenkapital og gjeld</div>
                {result.bal.ekGjeld.map((item,i) => <RRow key={i} item={item} />)}
              </div>
            </div>
          )}

          {/* Tab: Årsberetning */}
          {tab === 2 && (
            <div style={{ maxWidth:700 }}>
              {result.ai?.aarsberetning ? AB_SECTIONS.map(([title,key]) =>
                result.ai.aarsberetning[key] ? (
                  <div key={key} style={{ marginBottom:24, paddingBottom:24, borderBottom:"1px solid var(--line)" }}>
                    <h3 style={{ fontSize:".88rem", fontWeight:700, color:"var(--d)", marginBottom:8 }}>{title}</h3>
                    <p style={{ fontSize:".87rem", color:"var(--d2)", lineHeight:1.76 }}>{result.ai.aarsberetning[key]}</p>
                  </div>
                ) : null
              ) : (
                <div style={{ padding:"2rem", background:"var(--w2)", borderRadius:8, textAlign:"center" }}>
                  <Pg style={{ textAlign:"center", margin:"0 auto" }}>Årsberetning ikke generert — API-kall feilet eller mangler tilgang.</Pg>
                </div>
              )}
            </div>
          )}

          {/* Tab: Noter */}
          {tab === 3 && (
            <div style={{ maxWidth:700 }}>
              {result.noter?.length ? result.noter.map((note,i) => (
                <div key={i} style={{ marginBottom:24, paddingBottom:24, borderBottom:"1px solid var(--line)" }}>
                  <h3 style={{ fontSize:".88rem", fontWeight:700, color:"var(--d)", marginBottom:8 }}>Note {note.nr}: {note.tittel}</h3>
                  <p style={{ fontSize:".87rem", color:"var(--d2)", lineHeight:1.76 }}>{note.innhold}</p>
                </div>
              )) : (
                <div style={{ padding:"2rem", background:"var(--w2)", borderRadius:8, textAlign:"center" }}>
                  <Pg style={{ textAlign:"center", margin:"0 auto" }}>Noter ikke generert.</Pg>
                </div>
              )}
            </div>
          )}
          {/* Tab: Kontofordeling */}
          {tab === 4 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
              {NS4102.map(g => {
                const group = result.cl[g.key];
                if (!group || Math.abs(group.total) < 1) return null;
                const fmtNok = v => { const n=parseFloat(v); if(isNaN(n)) return "—"; if(Math.abs(n)>=1000000) return `${(n/1000000).toFixed(1).replace(".",",")} MNOK`; return new Intl.NumberFormat("nb-NO",{maximumFractionDigits:0}).format(Math.round(n))+" kr"; };
                return (
                  <div key={g.key} style={{ border:"1px solid var(--line)", borderRadius:8, overflow:"hidden", background:"#fff" }}>
                    <div style={{ padding:"1rem 1.2rem", borderBottom:"1px solid var(--line)", display:"flex", justifyContent:"space-between", alignItems:"center", background:"var(--w2)" }}>
                      <span style={{ fontSize:".82rem", fontWeight:700, color:"var(--d)" }}>{group.label || g.key}</span>
                      <span style={{ fontFamily:"var(--serif)", fontSize:"1rem", color:"var(--B)", fontWeight:300 }}>{fmtNok(group.total)}</span>
                    </div>
                    {Object.values(group.subs).filter(s=>Math.abs(s.total)>0).map((s,i)=>(
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 1.2rem", borderBottom:"1px solid var(--line)", fontSize:".78rem" }}>
                        <span style={{ color:"var(--d2)" }}>{s.label}</span>
                        <span style={{ color:"var(--d)", fontVariantNumeric:"tabular-nums" }}>{fmtNok(s.total)}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </Rv>

        {/* Disclaimer */}
        <Rv delay={.1}>
          <div style={{ marginTop:36, padding:"1.2rem 1.6rem", background:"rgba(245,158,11,.04)", border:"1px solid rgba(245,158,11,.22)", borderRadius:8, display:"flex", gap:14, alignItems:"flex-start" }}>
            <span style={{ fontSize:"1rem", marginTop:2 }}>⚠</span>
            <div>
              <div style={{ fontSize:".82rem", fontWeight:700, color:"#92400e", marginBottom:3 }}>Utkast — krever faglig kontroll</div>
              <p style={{ fontSize:".8rem", color:"var(--d2)", lineHeight:1.62 }}>Årsregnskapet er automatisk generert fra opplastet saldobalanse og AI-analyse. Resultatet skal gjennomgås og godkjennes av autorisert regnskapsfører eller revisor før det benyttes som grunnlag for innlevering til Brønnøysund.</p>
            </div>
          </div>
        </Rv>
      </Sec>
    )}

    {/* Loading spinner */}
    {loading && (
      <Sec py="clamp(4rem,8vw,6rem)">
        <div style={{ textAlign:"center" }}>
          <div style={{ display:"inline-block", width:36, height:36, border:"3px solid var(--line)", borderTopColor:"var(--B)", borderRadius:"50%", animation:"spin .8s linear infinite", marginBottom:20 }} />
          <Pg style={{ textAlign:"center", margin:"0 auto" }}>{loadMsg}</Pg>
        </div>
      </Sec>
    )}
  </>);
}

/* ═══════════════════ MAIN APP EXPORT ═══════════════════ */

export default function AccunorSite() {
  const [pg, setPg] = useState("hjem");
  const [sc, setSc] = useState(false);
  const [mob, setMob] = useState(false);
  useEffect(() => { const f = () => setSc(window.scrollY > 60); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => { window.scrollTo({ top: 0 }); setMob(false); }, [pg]);
  const go = p => e => { e?.preventDefault(); setPg(p); };

  return (
    <div style={{ fontFamily: "var(--sans)", background: "var(--w)", color: "var(--d)", minHeight: "100vh" }}>
      <style>{CSS}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 68, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 clamp(1.2rem,5vw,4rem)", background: sc||mob ? "rgba(251,252,253,0.95)" : "transparent", backdropFilter: sc||mob ? "blur(20px) saturate(1.4)" : "none", borderBottom: sc||mob ? "1px solid var(--line)" : "1px solid transparent", transition: "all .6s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ width: "100%", maxWidth: "var(--mw)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" onClick={go("hjem")}><img src={LOGO} alt="Accunor" style={{ height: 38 }} /></a>
          <div className="nav-links">
            {[["regnskap","Regnskap"],["skatt","Skatt"],["raadgivning","Rådgivning"],["forvaltning","Forvaltning"],["om","Om oss"],["ai","AI"]].map(([k,l]) =>
              <a key={k} href="#" onClick={go(k)} className="hov-line" style={{ fontSize: ".82rem", fontWeight: pg === k ? 600 : 400, color: pg === k ? "var(--B)" : "var(--d2)", letterSpacing: ".015em", paddingBottom: 2 }}>{l}</a>
            )}
            <a href="#" onClick={go("kontakt")} style={{ fontSize: ".78rem", fontWeight: 600, color: "#fff", background: "var(--B)", padding: ".5rem 1.4rem", borderRadius: 5, letterSpacing: ".03em", marginLeft: 4 }}>Kontakt oss</a>
          </div>
          <button className="nav-menu-btn" onClick={() => setMob(m => !m)} aria-label="Meny">
            {mob ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><line x1="3" y1="3" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="19" y1="3" x2="3" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><line x1="2" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            )}
          </button>
        </div>
      </nav>
      <div className={`mobile-menu${mob ? " open" : ""}`}>
        {[["regnskap","Regnskap"],["skatt","Skatt"],["raadgivning","Rådgivning"],["forvaltning","Forvaltning"],["om","Om oss"],["ai","AI"]].map(([k,l]) =>
          <a key={k} href="#" onClick={go(k)} style={{ fontWeight: pg===k ? 600 : 400, color: pg===k ? "var(--B)" : "var(--d2)" }}>{l}</a>
        )}
        <a href="#" onClick={go("kontakt")}>Kontakt oss</a>
      </div>

      <main style={{ paddingTop: 68 }}>
        {pg === "hjem" && <Hjem go={go} />}
        {pg === "regnskap" && <Regnskap go={go} />}
        {pg === "skatt" && <Skatt />}
        {pg === "raadgivning" && <Raad />}
        {pg === "forvaltning" && <Forv />}
        {pg === "om" && <Om go={go} />}
        {pg === "menneskene" && <Folk />}
        {pg === "kontakt" && <Kontakt />}
        {pg === "karriere" && <Karriere />}
        {pg === "ai" && <PasswordGate><AI /></PasswordGate>}
      </main>

      <footer style={{ background: "var(--navy)", color: "rgba(255,255,255,.55)", padding: "clamp(3rem,6vw,5rem) clamp(2rem,5vw,4rem) 2rem" }}>
        <div style={{ maxWidth: "var(--mw)", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1.5fr", gap: "2.5rem", paddingBottom: "3rem", borderBottom: "1px solid rgba(255,255,255,.06)" }} className="footer-grid">
            <div>
              <img src={LOGO} alt="Accunor" style={{ height: 24, filter: "brightness(0) invert(1)", opacity: .75 }} />
              <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.05rem", color: "rgba(255,255,255,.25)", marginTop: 20, lineHeight: 1.5, fontWeight: 300 }}>Innsikt i tall.<br />Kraft i beslutninger.</p>
            </div>
            <div>
              <div style={{ fontSize: ".65rem", fontWeight: 700, color: "var(--Bm)", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 14 }}>Tjenester</div>
              {["Regnskap","Skatt","Rådgivning","Forvaltning","AI Regnskap"].map(t => <a key={t} href="#" style={{ display: "block", fontSize: ".84rem", padding: "4px 0", opacity: .55 }}>{t}</a>)}
            </div>
            <div>
              <div style={{ fontSize: ".65rem", fontWeight: 700, color: "var(--Bm)", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 14 }}>Selskapet</div>
              {["Om oss","Menneskene","Karriere","Presse"].map(t => <a key={t} href="#" style={{ display: "block", fontSize: ".84rem", padding: "4px 0", opacity: .55 }}>{t}</a>)}
            </div>
            <div>
              <div style={{ fontSize: ".65rem", fontWeight: 700, color: "var(--Bm)", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 14 }}>Kontakt</div>
              <p style={{ fontSize: ".84rem", lineHeight: 2.1 }}>+47 73 93 31 000<br />post@accunorgroup.no<br /><span style={{ opacity: .4 }}>Oslo — digitalt i hele Norge</span></p>
            </div>
          </div>
          <div style={{ paddingTop: "1.4rem", display: "flex", justifyContent: "space-between", fontSize: ".7rem", opacity: .3 }}>
            <span>© 2026 Accunor AS · Org.nr. 936 401 228</span>
            <span>Personvern · Vilkår</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
