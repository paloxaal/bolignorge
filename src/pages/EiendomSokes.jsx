import React from "react";
import { Mail, Phone } from "lucide-react";
import { COL } from "../data";
import { PageHeader } from "./Projects";

export default function EiendomSokes() {
  const criteria = [
    "Ubebygde områder som kan egne seg for fremtidig boligområde",
    "Nærings- og industriområder med konverteringspotensial",
    "Ubebygde og regulerte områder",
    "Bebygde og regulerte områder med potensial for økt utnyttelse",
    "Avsatte områder til bolig i kommuneplanen",
  ];

  return (
    <div className="bn-page">
      <PageHeader
        title="Eiendom søkes"
        intro="Vi vurderer kontinuerlig nye prosjekter og tomter for utvikling. Henvendelser behandles konfidensielt."
      />

      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-12 lg:col-span-7">
            <div
              className="text-[10px] tracking-[0.25em] uppercase mb-6 pb-3 border-b"
              style={{
                color: COL.muted,
                fontFamily: "'JetBrains Mono', monospace",
                borderColor: COL.border,
              }}
            >
              Kriterier
            </div>
            <ul className="space-y-0">
              {criteria.map((c, i) => (
                <li
                  key={i}
                  className="flex gap-5 items-baseline py-5 border-b last:border-b-0"
                  style={{ borderColor: COL.borderSoft }}
                >
                  <span
                    className="text-[10px] flex-shrink-0"
                    style={{
                      color: COL.gold,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-[15px] md:text-[16px] leading-[1.55]"
                    style={{
                      color: COL.ink,
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 400,
                    }}
                  >
                    {c}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <div
              className="p-8 lg:p-10 border"
              style={{ background: COL.paperWarm, borderColor: COL.border }}
            >
              <div
                className="text-[10px] tracking-[0.25em] uppercase mb-6"
                style={{
                  color: COL.gold,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Direkte kontakt
              </div>
              <div
                className="mb-1"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 500,
                  fontSize: 22,
                  letterSpacing: "-0.01em",
                }}
              >
                Pål Morten Oxaal
              </div>
              <div
                className="text-[12px] mb-6"
                style={{ color: COL.muted }}
              >
                Adm. dir.
              </div>
              <div className="space-y-4">
                <a
                  href="tel:+4792449123"
                  className="bn-link flex items-center gap-3 text-[14px]"
                  style={{
                    color: COL.ink,
                  }}
                >
                  <Phone size={14} style={{ color: COL.gold }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    +47 924 49 123
                  </span>
                </a>
                <a
                  href="mailto:pal.oxaal@bolignorge.no"
                  className="bn-link flex items-center gap-3 text-[14px]"
                  style={{
                    color: COL.ink,
                  }}
                >
                  <Mail size={14} style={{ color: COL.gold }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    pal.oxaal@bolignorge.no
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
