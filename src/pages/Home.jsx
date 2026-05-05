import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { COL, PROJECTS, NEWS } from "../data";
import HeroMotif from "../components/HeroMotif";

export default function Home() {
  // Pick three projects to highlight on the front page
  const featured = PROJECTS.slice(0, 3);
  const latestNews = NEWS.slice(0, 2);

  return (
    <div className="bn-page">
      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-20 lg:pb-28">
        <div className="grid grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="col-span-12 lg:col-span-5">
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 400,
                fontSize: "clamp(34px, 4.2vw, 56px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                color: COL.ink,
              }}
            >
              Et fremtidsrettet{" "}
              <span style={{ fontStyle: "italic", color: COL.gold }}>
                investeringsselskap
              </span>{" "}
              innen eiendom.
            </h1>
            <p
              className="mt-7 text-[15px] md:text-[17px] leading-[1.65] max-w-md"
              style={{ color: COL.inkSoft }}
            >
              Med boligutvikling som en sentral del av porteføljen skaper vi
              verdier gjennom en styrende og strategisk tilnærming, der vi
              tar aktivt eierskap i alle investeringer.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                to="/prosjekter"
                className="group inline-flex items-center gap-3 px-6 py-3 text-[13px]"
                style={{
                  background: COL.ink,
                  color: COL.paper,
                  fontWeight: 600,
                }}
              >
                <span>Se prosjektene</span>
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/om-oss"
                className="bn-link text-[13px]"
                style={{ color: COL.ink, fontWeight: 500 }}
              >
                Om Bolig Norge →
              </Link>
            </div>
          </div>

          {/* Animated hero motif on the right - wider, gets more visual space */}
          <div className="col-span-12 lg:col-span-7 mt-8 lg:mt-0">
            <div className="relative w-full" style={{ aspectRatio: "5 / 4", minHeight: 500 }}>
              <HeroMotif />
            </div>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section
        className="border-t"
        style={{ background: COL.paperWarm, borderColor: COL.border }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-20 lg:py-24">
          <div className="flex items-baseline justify-between mb-12 flex-wrap gap-4">
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 400,
                fontSize: "clamp(32px, 4.5vw, 56px)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Utvalgte prosjekter
            </h2>
            <Link
              to="/prosjekter"
              className="bn-link text-[13px] tracking-[0.1em] uppercase"
              style={{
                color: COL.ink,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Alle prosjekter →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: COL.border }}>
            {featured.map((p) => {
              const linkProps = p.website
                ? { href: p.website, target: "_blank", rel: "noopener noreferrer" }
                : { to: `/prosjekter/${p.slug}` };
              const LinkEl = p.website ? "a" : Link;
              return (
                <LinkEl
                  key={p.slug}
                  {...linkProps}
                  className="group flex flex-col transition-colors overflow-hidden"
                  style={{ background: COL.paperWarm }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = COL.card)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = COL.paperWarm)}
                >
                {/* Project image - smaller, 16:9 to not dominate the card */}
                {p.image && (
                  <div
                    className="relative w-full overflow-hidden flex-shrink-0"
                    style={{
                      aspectRatio: "16 / 9",
                      background: COL.paperDeep,
                    }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-[1.03]"
                      style={{ objectFit: "cover", display: "block" }}
                    />
                  </div>
                )}

                <div className="p-8 lg:p-10 flex flex-col flex-1">
                  <div
                    className="text-[10px] tracking-[0.25em] uppercase mb-6"
                    style={{
                      color: COL.gold,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {p.location}
                  </div>
                  <h3
                    className="mb-4"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 500,
                      fontSize: "clamp(28px, 3vw, 38px)",
                      letterSpacing: "-0.015em",
                      lineHeight: 1.05,
                    }}
                  >
                    {p.name}
                  </h3>
                  <div className="flex-1 mb-8">
                    <div
                      className="text-[13px] leading-[1.6]"
                      style={{ color: COL.inkSoft }}
                    >
                      {p.units} boliger · {p.statusShort}
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase pt-4 border-t"
                    style={{
                      color: COL.ink,
                      fontWeight: 600,
                      borderColor: COL.borderSoft,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    <span>Les mer</span>
                    <ArrowUpRight
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </div>
              </LinkEl>
              );
            })}
          </div>
        </div>
      </section>

      {/* Aktuelt preview */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 py-20 lg:py-24">
        <div className="flex items-baseline justify-between mb-12 flex-wrap gap-4">
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 400,
              fontSize: "clamp(32px, 4.5vw, 56px)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Aktuelt
          </h2>
          <Link
            to="/aktuelt"
            className="bn-link text-[13px] tracking-[0.1em] uppercase"
            style={{
              color: COL.ink,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Alle saker →
          </Link>
        </div>

        {/* Pad to keep grid symmetric — render 2 articles + 1 placeholder so 3-up grid stays balanced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: COL.border }}>
          {latestNews.map((n) => (
            <article
              key={n.slug}
              className="p-8 lg:p-10"
              style={{ background: COL.paper }}
            >
              <div className="flex items-baseline justify-between mb-6">
                <div
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{
                    color: COL.gold,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {n.project}
                </div>
                <div
                  className="text-[11px]"
                  style={{
                    color: COL.muted,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {formatDate(n.date)}
                </div>
              </div>
              <h3
                className="mb-4"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 500,
                  fontSize: "clamp(20px, 2.2vw, 26px)",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                }}
              >
                {n.title}
              </h3>
              <p
                className="text-[14px] leading-[1.65]"
                style={{ color: COL.inkSoft }}
              >
                {n.excerpt}
              </p>
            </article>
          ))}
          {/* Third cell: same structure as article cards for visual symmetry */}
          <Link
            to="/aktuelt"
            className="hidden md:block p-8 lg:p-10 group transition-colors"
            style={{ background: COL.paper }}
            onMouseEnter={(e) => (e.currentTarget.style.background = COL.card)}
            onMouseLeave={(e) => (e.currentTarget.style.background = COL.paper)}
          >
            <div className="flex items-baseline justify-between mb-6">
              <div
                className="text-[10px] tracking-[0.2em] uppercase"
                style={{
                  color: COL.gold,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Arkiv
              </div>
              <div
                className="text-[11px]"
                style={{
                  color: COL.muted,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Alle saker
              </div>
            </div>
            <h3
              className="mb-4"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 500,
                fontSize: "clamp(20px, 2.2vw, 26px)",
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
              }}
            >
              Se alle saker fra prosjektene gjennom året
            </h3>
            <p
              className="text-[14px] leading-[1.65] flex items-center gap-2"
              style={{ color: COL.ink, fontWeight: 600 }}
            >
              <span
                className="text-[11px] tracking-[0.15em] uppercase"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Til arkivet
              </span>
              <ArrowUpRight
                size={13}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
