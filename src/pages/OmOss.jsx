import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { COL } from "../data";
import { PageHeader } from "./Projects";

export default function OmOss() {
  return (
    <div className="bn-page">
      <PageHeader title="Om oss" />

      {/* TOP: Lead text + Eierskap + Portefølje */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pb-16 lg:pb-20">
        <div className="grid grid-cols-12 gap-8 lg:gap-16">
          {/* Lead + body text — left, unified typography */}
          <div className="col-span-12 lg:col-span-7">
            <div
              className="space-y-6 leading-[1.55]"
              style={{
                color: COL.inkSoft,
                fontFamily: "'Fraunces', serif",
                fontWeight: 300,
                fontSize: "clamp(18px, 1.8vw, 22px)",
                letterSpacing: "-0.005em",
              }}
            >
              <p>
                Bolig Norge AS er et fremtidsrettet investeringsselskap innen
                eiendom, med boligutvikling som en sentral del av vår
                portefølje. Vi skaper verdier gjennom en styrende og strategisk
                tilnærming, der vi tar aktivt eierskap i alle investeringer for
                å realisere deres fulle potensial og skape positiv påvirkning
                for miljø og samfunn.
              </p>
              <p>
                Med en målrettet og effektiv tilnærming utnytter vi ressurser
                både internt i konsernet og i samarbeid med eksterne partnere i
                både heleide og deleide investeringer.
              </p>
              <p>
                Vår kompetanse innen marked, utvikling, oppkjøp og finansiering
                legger grunnlaget for de kommersielle rammene som er nødvendige
                for å realisere verdiskapende prosjekter på tvers av
                eiendomstyper og bidra til bærekraftige løsninger.
              </p>
            </div>
          </div>

          {/* Eierskap + Portefølje — right column */}
          <div className="col-span-12 lg:col-span-5">
            {/* Eierskap */}
            <div
              className="flex items-baseline gap-4 mb-7 pb-3 border-b"
              style={{ borderColor: COL.border }}
            >
              <span
                className="text-[11px] tracking-[0.25em] uppercase"
                style={{
                  color: COL.gold,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                A
              </span>
              <span
                className="text-[11px] tracking-[0.25em] uppercase"
                style={{
                  color: COL.muted,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Eierskap
              </span>
            </div>

            <OwnerRow
              pct="80"
              name="Fastighets AB Balder"
              detail="Nordens største eiendomsselskap som morselskap, med over 13 mrd kr i årlige leieinntekter."
              link="https://balder.se"
              linkLabel="balder.se"
            />
            <div className="my-7 border-t" style={{ borderColor: COL.border }} />
            <OwnerRow
              pct="20"
              name="Oxaal Holding AS"
              detail="Investeringsselskap heleid av Pål Morten Oxaal."
            />

            {/* Portefølje — three key metrics, same row pattern as eierskap */}
            <PortfolioStats />
          </div>
        </div>
      </section>

      <Subsection title="Samfunnsansvar" letter="B">
        <p
          className="leading-[1.55]"
          style={{
            color: COL.inkSoft,
            fontFamily: "'Fraunces', serif",
            fontWeight: 300,
            fontSize: "clamp(18px, 1.8vw, 22px)",
            letterSpacing: "-0.005em",
          }}
        >
          Vi forplikter oss til bærekraftig eiendomsutvikling, åpenhetsloven og
          anti-korrupsjonsarbeid — med etiske retningslinjer og transparente
          prosesser i bunn av alle investeringer.
        </p>
        <Link
          to="/samfunnsansvar"
          className="bn-link inline-flex items-center gap-2 mt-8 text-[11px] tracking-[0.2em] uppercase"
          style={{
            color: COL.ink,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
          }}
        >
          <span>Les mer om samfunnsansvar</span>
          <ArrowUpRight size={13} />
        </Link>
      </Subsection>

      <Subsection title="Ledelse og styre" letter="C">
        <div className="flex flex-col md:flex-row gap-px" style={{ background: COL.border }}>
          <div className="md:w-1/3 flex flex-col" style={{ background: COL.paper }}>
            <GroupHeader label="Ledelsen" />
            <PersonCard
              name="Pål Morten Oxaal"
              role="Adm. dir."
              photo="/images/team/pal-morten-oxaal.jpg"
            />
          </div>
          <div className="md:w-2/3 flex flex-col" style={{ background: COL.paper }}>
            <GroupHeader label="Styret" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px flex-1" style={{ background: COL.border }}>
              <PersonCard
                name="Erik Selin"
                role="Styreleder"
                photo="/images/team/erik-selin.jpg"
              />
              <PersonCard
                name="Eva Sigurgeirsdottir"
                role="Styremedlem"
                photo="/images/team/eva-sigurgeirsdottir.jpg"
              />
            </div>
          </div>
        </div>
      </Subsection>
    </div>
  );
}

/**
 * Three portfolio metrics in a horizontal row — compact for column symmetry.
 * Numbers count up on mount with stagger.
 */
function PortfolioStats() {
  const [time, setTime] = useState(0);
  const startedAt = useRef(performance.now());

  useEffect(() => {
    let raf;
    const tick = (now) => {
      setTime((now - startedAt.current) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mt-12 pt-6 border-t" style={{ borderColor: COL.border }}>
      <div
        className="text-[11px] tracking-[0.25em] uppercase mb-7"
        style={{
          color: COL.muted,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        Portefølje
      </div>

      <div className="grid grid-cols-3 gap-0">
        <PortfolioCell
          target={1986}
          time={time}
          delay={0.3}
          label="Under utvikling"
          detail="Regulering, prosjektering, produksjon"
          position="first"
        />
        <PortfolioCell
          target={180}
          time={time}
          delay={0.7}
          label="I produksjon nå"
          detail="Aktiv bygging på tvers"
          position="middle"
        />
        <PortfolioCell
          target={600}
          suffix="+"
          time={time}
          delay={1.1}
          label="Overlevert"
          detail="Ferdigstilt og solgt"
          position="last"
        />
      </div>
    </div>
  );
}

function PortfolioCell({ target, suffix = "", time, delay, label, detail, position }) {
  const t = Math.max(0, Math.min(1, (time - delay) / 1.8));
  const eased = 1 - Math.pow(1 - t, 4);
  const value = Math.round(target * eased);
  const display = value.toLocaleString("nb-NO");

  // Symmetric padding: every cell has 16px padding on its inside edges,
  // dividers handled by border-r on first two cells
  const paddingClass =
    position === "first" ? "pr-5" :
    position === "last"  ? "pl-5" :
                           "px-5"; // middle gets both sides
  const borderClass = position === "last" ? "" : "border-r";

  return (
    <div
      className={`flex flex-col ${paddingClass} ${borderClass}`}
      style={{ borderColor: COL.border }}
    >
      <div
        className="leading-none mb-3 tabular-nums"
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 400,
          fontSize: "clamp(28px, 2.8vw, 40px)",
          letterSpacing: "-0.025em",
          color: COL.ink,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {display}
        {suffix && (
          <span style={{ fontSize: "0.55em", color: COL.gold, marginLeft: 1 }}>
            {suffix}
          </span>
        )}
      </div>
      <h4
        className="mb-1.5"
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 500,
          fontSize: 14,
          letterSpacing: "-0.005em",
          lineHeight: 1.2,
          color: COL.ink,
        }}
      >
        {label}
      </h4>
      <p
        className="text-[11.5px] leading-[1.45]"
        style={{ color: COL.inkSoft }}
      >
        {detail}
      </p>
    </div>
  );
}

function Subsection({ title, letter, children }) {
  return (
    <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pb-16 lg:pb-20">
      <div
        className="flex items-baseline gap-4 mb-7 pb-3 border-b"
        style={{ borderColor: COL.border }}
      >
        <span
          className="text-[11px] tracking-[0.25em] uppercase"
          style={{
            color: COL.gold,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {letter}
        </span>
        <span
          className="text-[11px] tracking-[0.25em] uppercase"
          style={{
            color: COL.muted,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </section>
  );
}

function GroupHeader({ label }) {
  return (
    <div
      className="px-6 lg:px-8 pt-6 pb-2 text-[10px] tracking-[0.25em] uppercase"
      style={{
        color: COL.gold,
        fontFamily: "'JetBrains Mono', monospace",
        background: COL.paper,
      }}
    >
      {label}
    </div>
  );
}

function OwnerRow({ pct, name, detail, link, linkLabel }) {
  return (
    <div className="flex items-start gap-5">
      <div
        className="leading-none flex-shrink-0"
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 400,
          fontSize: "clamp(44px, 5vw, 68px)",
          letterSpacing: "-0.04em",
          color: COL.gold,
          minWidth: 110,
        }}
      >
        {pct}
        <span style={{ fontSize: "0.4em", verticalAlign: "super", marginLeft: 2, color: COL.muted }}>%</span>
      </div>
      <div className="flex-1 min-w-0 pt-2">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h3
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 500,
              fontSize: 18,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {name}
          </h3>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.2em] uppercase flex items-center gap-1 flex-shrink-0"
              style={{
                color: COL.muted,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <span>{linkLabel}</span>
              <ArrowUpRight size={11} />
            </a>
          )}
        </div>
        <p className="text-[13px] leading-[1.55]" style={{ color: COL.inkSoft }}>
          {detail}
        </p>
      </div>
    </div>
  );
}

function PersonCard({ name, role, photo, note }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  return (
    <div className="p-6 lg:p-8 flex flex-col flex-1" style={{ background: COL.paper }}>
      <div
        className="mb-5 relative"
        style={{
          aspectRatio: "4 / 5",
          background: COL.paperWarm,
          overflow: "hidden",
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%)",
            }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(56px, 7vw, 96px)",
              color: COL.gold,
              opacity: 0.18,
              letterSpacing: "-0.04em",
              userSelect: "none",
            }}
          >
            {initials}
          </div>
        )}
      </div>
      <h3
        className="mb-1"
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 500,
          fontSize: 19,
          letterSpacing: "-0.015em",
          lineHeight: 1.2,
        }}
      >
        {name}
      </h3>
      <div className="text-[12px] tracking-[0.05em]" style={{ color: COL.muted }}>
        {role}
      </div>
      {note && (
        <div
          className="mt-2 text-[11px] tracking-[0.05em] leading-[1.5]"
          style={{ color: COL.inkSoft, fontStyle: "italic" }}
        >
          {note}
        </div>
      )}
    </div>
  );
}
