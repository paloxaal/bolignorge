import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { COL, PROJECTS, PHASES } from "../data";
import { PageHeader } from "./Projects";

export default function ProjectDetail() {
  const { slug } = useParams();
  const p = PROJECTS.find((x) => x.slug === slug);

  if (!p) {
    return (
      <div className="bn-page max-w-[1280px] mx-auto px-6 lg:px-12 py-32">
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 400,
            fontSize: 48,
          }}
        >
          Prosjektet ble ikke funnet
        </h1>
        <Link to="/prosjekter" className="bn-link mt-6 inline-block" style={{ color: COL.gold }}>
          ← Tilbake til prosjekter
        </Link>
      </div>
    );
  }

  const phaseColors = {
    Produksjon: COL.sage,
    Regulering: COL.ink,
    Prosjektering: COL.gold,
  };
  const accent = phaseColors[p.statusCategory] || COL.muted;

  return (
    <div className="bn-page">
      {/* Back link */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-8 lg:pt-10">
        <Link
          to="/prosjekter"
          className="bn-link inline-flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase"
          style={{
            color: COL.muted,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <ArrowLeft size={14} />
          <span>Alle prosjekter</span>
        </Link>
      </div>

      {/* Header */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-8 pb-10 lg:pb-14">
        <div
          className="text-[11px] tracking-[0.25em] uppercase mb-6"
          style={{
            color: COL.gold,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {p.location} · {p.regionGroup}
        </div>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 400,
            fontSize: "clamp(40px, 5.5vw, 72px)",
            letterSpacing: "-0.025em",
            lineHeight: 1.0,
            color: COL.ink,
          }}
        >
          {p.name}
        </h1>
      </section>

      {/* Hero image — full bleed within container */}
      {p.image && (
        <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "16 / 9",
              background: COL.paperWarm,
            }}
          >
            <img
              src={p.image}
              alt={p.name}
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </section>
      )}

      {/* Body: description + facts */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-12 lg:col-span-7">
            <p
              className="leading-[1.6]"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 300,
                fontSize: "clamp(18px, 2vw, 22px)",
                color: COL.inkSoft,
              }}
            >
              {p.description}
            </p>
          </div>

          <div
            className="col-span-12 lg:col-span-4 lg:col-start-9 border-t lg:border-t-0 lg:border-l pt-8 lg:pt-0 lg:pl-10"
            style={{ borderColor: COL.border }}
          >
            <Fact label="Boliger" value={p.units.toString()} />
            <Fact label="BRA-S" value={`${p.kvm.toLocaleString("nb-NO")} kvm`} />
            <Fact label="Status" value={p.statusShort} accent={accent} />
            <Fact label="Partner" value={p.partner} />
            <Fact
              label="Tidsløp"
              value={`${p.timeline.start} — ${p.timeline.end}`}
              last
            />
          </div>
        </div>
      </section>

      {/* Lifecycle position */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
        <div
          className="text-[10px] tracking-[0.25em] uppercase mb-6 pb-3 border-b"
          style={{
            color: COL.muted,
            fontFamily: "'JetBrains Mono', monospace",
            borderColor: COL.border,
          }}
        >
          Status i utviklingsløpet
        </div>

        <div className="hidden md:grid grid-cols-5 gap-2 mb-3">
          {PHASES.map((ph, i) => (
            <div
              key={ph.id}
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{
                color: COL.muted,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <span style={{ color: COL.gold }}>{String(i + 1).padStart(2, "0")}</span>
              <span className="ml-2">{ph.label}</span>
            </div>
          ))}
        </div>

        <div className="relative h-[6px]" style={{ background: COL.borderSoft }}>
          <div
            className="absolute top-0 left-0 h-[6px]"
            style={{
              width: `${p.phaseProgress * 100}%`,
              background: accent,
            }}
          />
          {[0.25, 0.5, 0.75].map((m, i) => (
            <div
              key={i}
              className="absolute top-1/2"
              style={{
                left: `${m * 100}%`,
                width: 1,
                height: 11,
                background: COL.border,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
          <div
            className="absolute top-1/2"
            style={{
              left: `${p.phaseProgress * 100}%`,
              transform: "translate(-50%, -50%)",
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: accent,
              boxShadow: `0 0 0 3px ${COL.paper}`,
            }}
          />
        </div>
        <div
          className="mt-4 text-[12px]"
          style={{ color: accent, fontWeight: 600 }}
        >
          {p.statusShort}
        </div>
      </section>
    </div>
  );
}

function Fact({ label, value, accent, last }) {
  return (
    <div className={`pb-5 mb-5 ${last ? "" : "border-b"}`} style={{ borderColor: COL.borderSoft }}>
      <div
        className="text-[10px] tracking-[0.25em] uppercase mb-2"
        style={{
          color: COL.muted,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 400,
          fontSize: 22,
          letterSpacing: "-0.01em",
          color: accent || COL.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}
