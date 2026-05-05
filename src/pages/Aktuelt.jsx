import React from "react";
import { COL, NEWS } from "../data";
import { PageHeader } from "./Projects";

export default function Aktuelt() {
  return (
    <div className="bn-page">
      <PageHeader
        title="Aktuelt"
        intro="Det nyeste fra våre prosjekter."
      />

      <section className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="space-y-px" style={{ background: COL.border }}>
          {NEWS.map((n) => (
            <article
              key={n.slug}
              className="grid grid-cols-12 gap-8 py-12 lg:py-14 px-4 lg:px-6"
              style={{ background: COL.paper }}
            >
              <div className="col-span-12 md:col-span-3">
                <div
                  className="text-[10px] tracking-[0.2em] uppercase mb-2"
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
              <div className="col-span-12 md:col-span-9">
                <h2
                  className="mb-6"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 500,
                    fontSize: "clamp(24px, 3vw, 36px)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                  }}
                >
                  {n.title}
                </h2>
                <div className="space-y-4 text-[15px] leading-[1.7]" style={{ color: COL.inkSoft }}>
                  {n.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
