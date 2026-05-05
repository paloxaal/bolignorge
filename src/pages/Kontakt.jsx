import React from "react";
import { MapPin, Phone, Mail, Linkedin } from "lucide-react";
import { COL } from "../data";
import { PageHeader } from "./Projects";

export default function Kontakt() {
  return (
    <div className="bn-page">
      <PageHeader
        title="Kontakt"
        intro="Enten du har en eiendom som kan være interessant, ønsker informasjon om et prosjekt, eller ser etter en partner — vi svarer så raskt vi kan."
      />

      {/* Image left, contact right - equal heights via stretched grid */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pb-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left: image fills column height */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative w-full h-full overflow-hidden" style={{ minHeight: 360 }}>
              <img
                src="/images/landscape-fjord.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ display: "block" }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(180deg, transparent 60%, rgba(14, 26, 43, 0.15) 100%)`,
                }}
              />
            </div>
          </div>

          {/* Right: contact details + Pål card */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col">
            <div className="space-y-7 mb-8">
              <ContactRow
                icon={<MapPin size={16} />}
                label="Hovedkontor"
                value={
                  <>
                    Kjøpmannsgata 34
                    <br />
                    7011 Trondheim
                  </>
                }
              />
              <ContactRow
                icon={<Phone size={16} />}
                label="Sentralbord"
                value={
                  <a href="tel:+4773933100" className="bn-link" style={{ color: COL.ink }}>
                    +47 73 93 31 00
                  </a>
                }
              />
              <ContactRow
                icon={<Mail size={16} />}
                label="E-post"
                value={
                  <a
                    href="mailto:post@bolignorge.no"
                    className="bn-link"
                    style={{ color: COL.ink }}
                  >
                    post@bolignorge.no
                  </a>
                }
              />
              <ContactRow
                icon={<Linkedin size={16} />}
                label="LinkedIn"
                value={
                  <a href="#" className="bn-link" style={{ color: COL.ink }}>
                    bolignorge
                  </a>
                }
              />
            </div>

            {/* Pål card - sits at bottom of right column */}
            <div
              className="px-6 py-6 mt-auto"
              style={{ background: COL.paperWarm }}
            >
              <div
                className="text-[10px] tracking-[0.25em] uppercase mb-5"
                style={{
                  color: COL.gold,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Direkte kontakt
              </div>
              <div className="flex items-start gap-5">
                <div
                  className="flex-shrink-0 relative"
                  style={{
                    width: 92,
                    aspectRatio: "4 / 5",
                    background: COL.card,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="/images/team/pal-morten-oxaal.jpg"
                    alt="Pål Morten Oxaal"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(100%)",
                      display: "block",
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="mb-0.5"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 500,
                      fontSize: 18,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}
                  >
                    Pål Morten Oxaal
                  </h3>
                  <div
                    className="text-[12px] mb-3"
                    style={{ color: COL.muted, letterSpacing: "0.02em" }}
                  >
                    Adm. dir.
                  </div>
                  <div className="space-y-1 text-[13px]">
                    <div>
                      <a
                        href="tel:+4792449123"
                        className="bn-link"
                        style={{ color: COL.ink }}
                      >
                        +47 924 49 123
                      </a>
                    </div>
                    <div>
                      <a
                        href="mailto:pal.oxaal@bolignorge.no"
                        className="bn-link"
                        style={{ color: COL.ink, wordBreak: "break-all" }}
                      >
                        pal.oxaal@bolignorge.no
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactRow({ icon, label, value }) {
  return (
    <div
      className="flex items-start gap-4 pb-5 border-b"
      style={{ borderColor: COL.border }}
    >
      <div className="mt-1" style={{ color: COL.gold }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
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
            fontSize: 18,
            color: COL.ink,
            lineHeight: 1.4,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
