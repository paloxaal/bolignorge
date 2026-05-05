import React from "react";
import { ArrowUpRight, Download, FileText } from "lucide-react";
import { COL } from "../data";
import { PageHeader } from "./Projects";

const PILLARS = [
  {
    letter: "A",
    title: "Bærekraftige bygg og løsninger",
    body: `Bolig Norge utvikler boliger med sterk miljøprofil, der vi alltid går utover de lovpålagte minimumskravene. Dette innebærer at vi sikrer grønnere byggeløsninger og optimal ressursbruk, til fordel for både miljøet og våre kunder. Våre prosjekter har ofte tilgang til gunstigere finansieringsvilkår gjennom Husbanken eller grønne lån, takket være vårt arbeid for å overgå miljøkrav. Dette gir våre kunder bedre finansieringsmuligheter og legger til rette for økt kvalitet og levetid i boligene.`,
  },
  {
    letter: "B",
    title: "Langsiktig verdiskaping",
    body: `Vårt eierskap har en lang historie med å foredle og utvikle eiendommer til attraktive og bærekraftige boområder. For oss handler samfunnsansvar også om å respektere og integrere eksisterende omgivelser, slik at utviklingen vår gir verdi til de områdene vi bygger i. Vi etterstreber å utvikle bomiljøer der mennesker trives, og hvor bærekraftige valg er integrert i hver beslutning, fra prosjektering til ferdigstillelse.`,
  },
  {
    letter: "C",
    title: "Et trygt og inkluderende bomiljø",
    body: `Bolig Norge tror på å skape hjem der folk kan bo trygt og godt, og hvor det er tilrettelagt for fellesskap og tilhørighet. Vi arbeider aktivt med å utvikle trygge og inkluderende bomiljøer som styrker sosial tilhørighet og motvirker ensomhet. Våre prosjekter legges opp med tanke på å tilpasse seg innbyggernes behov, og vi ønsker at alle våre beboere skal føle seg sett og verdsatt.`,
  },
  {
    letter: "D",
    title: "Innovasjon og kontinuerlig forbedring",
    body: `Gjennom vår omfattende erfaring har vi opparbeidet oss verdifulle innsikter som vi aktivt bruker for å forbedre våre prosjekter. Bolig Norge er opptatt av å være i forkant når det gjelder ny teknologi og innovative løsninger, som både hever kvaliteten på prosjektene våre og reduserer vårt karbonavtrykk. Vi investerer kontinuerlig i forskning og utvikling, slik at vi kan tilby moderne, energieffektive boliger som dekker fremtidens behov.`,
  },
  {
    letter: "E",
    title: "Kvalitet over tid",
    body: `Vårt mål er at alle våre bygg og bomiljøer skal bidra til en varig verdi for våre kunder. Kvalitet og holdbarhet står sentralt i alle våre prosjekter, og vi ser på det som vår plikt å levere løsninger som holder over tid – både for våre kunder og for kommende generasjoner.`,
  },
];

export default function Samfunnsansvar() {
  return (
    <div className="pb-24">
      <PageHeader
        title="Samfunnsansvar"
        intro="Bolig Norge er et ansvarlig eiendomsselskap med et dypt engasjement for å skape bærekraftige boliger og levende bomiljøer som gjør en positiv forskjell for både mennesker og miljø."
      />

      {/* Lead paragraph */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-20">
        <p
          className="leading-[1.55] max-w-[920px]"
          style={{
            color: COL.inkSoft,
            fontFamily: "'Fraunces', serif",
            fontWeight: 300,
            fontSize: "clamp(18px, 1.8vw, 22px)",
            letterSpacing: "-0.005em",
          }}
        >
          Vårt samfunnsansvar strekker seg utover dagens prosjekter og utgjør en
          sentral del av vårt verdigrunnlag og vår langsiktige strategi. Gjennom
          ansvarlig drift, miljøbevisste valg og et sterkt engasjement for både
          mennesker og miljø, ønsker vi å bidra til et mer bærekraftig samfunn —
          ett bygg om gangen.
        </p>
      </section>

      {/* Pillars */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 space-y-16">
        {PILLARS.map((p) => (
          <Pillar key={p.letter} letter={p.letter} title={p.title} body={p.body} />
        ))}
      </section>

      {/* Åpenhetsloven — distinct treatment with prominent PDF CTA */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 mt-24">
        <div
          className="flex items-baseline gap-4 mb-3 pb-3 border-b"
          style={{ borderColor: COL.border }}
        >
          <span
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{
              color: COL.gold,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            F
          </span>
          <h2
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{
              color: COL.muted,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Åpenhetsloven og ansvarlige valg
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10">
          {/* Narrative */}
          <div className="lg:col-span-7">
            <p
              className="leading-[1.55] mb-6"
              style={{
                color: COL.inkSoft,
                fontFamily: "'Fraunces', serif",
                fontWeight: 300,
                fontSize: "clamp(18px, 1.8vw, 22px)",
                letterSpacing: "-0.005em",
              }}
            >
              Bolig Norge AS, har sammen med sine tilknyttede selskaper, i
              henhold til Åpenhetsloven utarbeidet en egen redegjørelse som
              beskriver våre aktsomhetsvurderinger, etiske retningslinjer, og
              anti-korrupsjonsarbeid.
            </p>
            <p
              className="leading-[1.65] text-[14px] md:text-[15px]"
              style={{ color: COL.inkSoft }}
            >
              Vi er opptatt av åpenhet i vår verdikjede og jobber aktivt for å
              ivareta menneskerettigheter og sikre bærekraftig praksis i alle
              ledd. Redegjørelsen dekker tilnærming til ansvarlighet, etiske
              retningslinjer, innkjøps- og leverandørpolicy, leverandørvurdering,
              anti-korrupsjonstiltak, remediering, samt veien videre.
            </p>
          </div>

          {/* PDF CTA card */}
          <div className="lg:col-span-5">
            <a
              href="/Aapenhetsloven.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-7 lg:p-8 transition-colors h-full flex flex-col"
              style={{
                background: COL.card,
                border: `1px solid ${COL.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COL.paperWarm;
                e.currentTarget.style.borderColor = COL.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = COL.card;
                e.currentTarget.style.borderColor = COL.border;
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    background: COL.paper,
                    border: `1px solid ${COL.border}`,
                  }}
                >
                  <FileText size={16} style={{ color: COL.gold }} />
                </div>
                <div
                  className="text-[10px] tracking-[0.25em] uppercase"
                  style={{
                    color: COL.muted,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  PDF · Redegjørelse
                </div>
              </div>

              <div
                className="mb-2"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 500,
                  fontSize: "clamp(20px, 2vw, 24px)",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                  color: COL.ink,
                }}
              >
                Aktsomhetsvurderinger,
                <br />
                etiske retningslinjer og
                <br />
                anti-korrupsjon
              </div>
              <div
                className="text-[12px] mb-6"
                style={{
                  color: COL.muted,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Bolig Norge AS · 20.06.2024
              </div>

              <div className="mt-auto flex items-center gap-2">
                <Download size={14} style={{ color: COL.ink }} />
                <span
                  className="text-[11px] tracking-[0.15em] uppercase font-semibold"
                  style={{
                    color: COL.ink,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  Last ned PDF
                </span>
                <ArrowUpRight
                  size={13}
                  style={{ color: COL.ink }}
                  className="ml-auto transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </a>
          </div>
        </div>

        {/* Contact note for openness inquiries */}
        <div
          className="mt-12 pt-8 border-t flex flex-wrap items-baseline justify-between gap-4"
          style={{ borderColor: COL.borderSoft }}
        >
          <div
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{
              color: COL.muted,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Henvendelser knyttet til Åpenhetsloven
          </div>
          <a
            href="mailto:pal.oxaal@bolignorge.no"
            className="bn-link text-[14px] flex items-center gap-2"
            style={{ color: COL.ink, fontWeight: 500 }}
          >
            pal.oxaal@bolignorge.no
            <ArrowUpRight size={12} />
          </a>
        </div>
      </section>
    </div>
  );
}

function Pillar({ letter, title, body }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
      {/* Left: letter + title */}
      <div className="lg:col-span-4">
        <div className="flex items-baseline gap-4 mb-3">
          <span
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{
              color: COL.gold,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {letter}
          </span>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 500,
              fontSize: "clamp(22px, 2.4vw, 28px)",
              letterSpacing: "-0.015em",
              lineHeight: 1.15,
              color: COL.ink,
            }}
          >
            {title}
          </h2>
        </div>
      </div>

      {/* Right: body */}
      <div className="lg:col-span-8">
        <p
          className="leading-[1.7] text-[15px] md:text-[16px]"
          style={{ color: COL.inkSoft, maxWidth: 720 }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}
