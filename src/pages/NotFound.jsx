import React from "react";
import { Link } from "react-router-dom";
import { COL } from "../data";

export default function NotFound() {
  return (
    <div className="bn-page max-w-[1280px] mx-auto px-6 lg:px-12 py-32 lg:py-48">
      <div
        className="text-[10px] tracking-[0.25em] uppercase mb-6"
        style={{
          color: COL.gold,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        404
      </div>
      <h1
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 400,
          fontSize: "clamp(40px, 6vw, 80px)",
          letterSpacing: "-0.025em",
          lineHeight: 1,
          color: COL.ink,
        }}
      >
        Siden finnes ikke
      </h1>
      <p
        className="mt-6 text-[16px] leading-[1.6] max-w-xl"
        style={{ color: COL.inkSoft }}
      >
        Lenken du fulgte er enten flyttet eller utgått. Gå tilbake til forsiden
        eller bruk menyen for å finne det du leter etter.
      </p>
      <Link
        to="/"
        className="bn-link mt-8 inline-block text-[13px]"
        style={{ color: COL.gold, fontWeight: 600 }}
      >
        ← Tilbake til forsiden
      </Link>
    </div>
  );
}
