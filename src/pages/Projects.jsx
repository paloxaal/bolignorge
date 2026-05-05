import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { COL, PROJECTS, COMPLETED, PHASES } from "../data";

export default function Projects() {
  const phaseColors = {
    Produksjon: COL.sage,
    Regulering: COL.ink,
    Prosjektering: COL.gold,
  };

  return (
    <div className="bn-page">
      <PageHeader
        title="Prosjekter"
        intro="Aktive boligprosjekter i landets vekstområder, fra regulering til ferdigstilling."
      />

      {/* Aktive prosjekter — list */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <h2
          className="text-[10px] tracking-[0.25em] uppercase mb-6 pb-3 border-b"
          style={{
            color: COL.muted,
            fontFamily: "'JetBrains Mono', monospace",
            borderColor: COL.border,
          }}
        >
          Aktive prosjekter
        </h2>
        <div className="space-y-px" style={{ background: COL.border }}>
          {PROJECTS.map((p) => {
            const accent = phaseColors[p.statusCategory] || COL.muted;
            // External website if set, internal detail page otherwise
            const linkProps = p.website
              ? { href: p.website, target: "_blank", rel: "noopener noreferrer" }
              : { to: `/prosjekter/${p.slug}` };
            const LinkEl = p.website ? "a" : Link;
            return (
              <LinkEl
                key={p.slug}
                {...linkProps}
                className="group block py-5 px-4 lg:px-6 grid grid-cols-12 gap-4 items-center transition-colors"
                style={{ background: COL.paper }}
                onMouseEnter={(e) => (e.currentTarget.style.background = COL.card)}
                onMouseLeave={(e) => (e.currentTarget.style.background = COL.paper)}
              >
                <div className="col-span-12 md:col-span-1">
                  <div
                    className="relative w-full overflow-hidden"
                    style={{
                      aspectRatio: "1 / 1",
                      background: COL.paperDeep,
                    }}
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-[1.06]"
                        style={{ objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          fontFamily: "'Fraunces', serif",
                          fontStyle: "italic",
                          fontWeight: 300,
                          fontSize: 28,
                          color: COL.gold,
                          opacity: 0.3,
                        }}
                      >
                        {p.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <div
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 500,
                      fontSize: "clamp(22px, 2.6vw, 32px)",
                      letterSpacing: "-0.015em",
                      lineHeight: 1.05,
                      color: COL.ink,
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    className="text-[11px] tracking-[0.15em] uppercase mt-1"
                    style={{
                      color: COL.muted,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {p.location} · {p.regionGroup}
                  </div>
                </div>

                <div className="col-span-6 md:col-span-2">
                  <Cell label="Boliger" value={p.units} />
                </div>
                <div className="col-span-6 md:col-span-3">
                  <div
                    className="text-[9px] tracking-[0.2em] uppercase mb-1"
                    style={{ color: COL.muted }}
                  >
                    Status
                  </div>
                  <div
                    className="text-[13px]"
                    style={{ color: accent, fontWeight: 600 }}
                  >
                    {p.statusShort}
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1 flex justify-end">
                  <ArrowUpRight
                    size={18}
                    style={{ color: COL.muted }}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </LinkEl>
            );
          })}
        </div>
      </section>

      {/* Lifecycle visualization (compact) */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 mt-24">
        <h2
          className="text-[10px] tracking-[0.25em] uppercase mb-6 pb-3 border-b"
          style={{
            color: COL.muted,
            fontFamily: "'JetBrains Mono', monospace",
            borderColor: COL.border,
          }}
        >
          Status i utviklingsløpet
        </h2>

        {/* Phase header */}
        <div className="hidden md:grid grid-cols-12 gap-4 pb-3 mb-4 border-b" style={{ borderColor: COL.borderSoft }}>
          <div className="col-span-3" />
          <div className="col-span-9 grid grid-cols-5 gap-2">
            {PHASES.map((ph, i) => (
              <div
                key={ph.id}
                className="text-[9px] tracking-[0.2em] uppercase"
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
        </div>

        <div className="space-y-3">
          {PROJECTS.map((p) => {
            const accent = phaseColors[p.statusCategory] || COL.muted;
            return (
              <div
                key={p.slug}
                className="grid grid-cols-12 gap-4 items-center py-3"
              >
                <div className="col-span-4 md:col-span-3">
                  <div
                    className="text-[14px]"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 500,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {p.name}
                  </div>
                </div>
                <div className="col-span-8 md:col-span-9 relative">
                  <div className="relative h-[5px]" style={{ background: COL.borderSoft }}>
                    <div
                      className="absolute top-0 left-0 h-[5px]"
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
                          height: 9,
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
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background: accent,
                        boxShadow: `0 0 0 2px ${COL.paper}`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Track record */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 mt-24">
        <h2
          className="text-[10px] tracking-[0.25em] uppercase mb-6 pb-3 border-b"
          style={{
            color: COL.muted,
            fontFamily: "'JetBrains Mono', monospace",
            borderColor: COL.border,
          }}
        >
          Ferdigstilte prosjekter
        </h2>
        <div className="border-b" style={{ borderColor: COL.border }}>
          <div
            className="hidden md:grid grid-cols-12 gap-4 py-3 border-b text-[10px] tracking-[0.2em] uppercase"
            style={{
              borderColor: COL.borderSoft,
              color: COL.muted,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <div className="col-span-1">År</div>
            <div className="col-span-7">Prosjekt</div>
            <div className="col-span-3">Lokasjon</div>
            <div className="col-span-1 text-right">Boliger</div>
          </div>
          {COMPLETED.map((c, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-4 py-5 border-b last:border-b-0 items-baseline"
              style={{ borderColor: COL.borderSoft }}
            >
              <div
                className="col-span-2 md:col-span-1"
                style={{
                  color: COL.gold,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                }}
              >
                {c.year}
              </div>
              <div
                className="col-span-10 md:col-span-7"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 500,
                  fontSize: "clamp(18px, 2vw, 24px)",
                  letterSpacing: "-0.01em",
                }}
              >
                {c.name}
              </div>
              <div
                className="col-span-9 md:col-span-3 text-[13px]"
                style={{ color: COL.inkSoft }}
              >
                {c.location}
              </div>
              <div
                className="col-span-3 md:col-span-1 md:text-right tabular-nums"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  color: COL.ink,
                }}
              >
                {c.units}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function PageHeader({ title, intro }) {
  return (
    <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-14 lg:pb-20">
      <h1
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 400,
          fontSize: "clamp(32px, 4.5vw, 56px)",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          color: COL.ink,
        }}
      >
        {title}
      </h1>
      {intro && (
        <p
          className="mt-5 max-w-2xl text-[15px] md:text-[17px] leading-[1.6]"
          style={{ color: COL.inkSoft }}
        >
          {intro}
        </p>
      )}
    </section>
  );
}

function Cell({ label, value, small }) {
  return (
    <div>
      <div
        className="text-[9px] tracking-[0.2em] uppercase mb-1"
        style={{ color: COL.muted }}
      >
        {label}
      </div>
      <div
        className={small ? "text-[12px]" : ""}
        style={{
          fontFamily: small ? "'Manrope', sans-serif" : "'Fraunces', serif",
          fontWeight: small ? 500 : 500,
          fontSize: small ? 12 : 18,
          color: small ? COL.inkSoft : COL.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}
