import { useEffect, useState } from "react";
import { LogOut, Users, FileText, Briefcase, Newspaper, Upload } from "lucide-react";
import { COL } from "../data";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const { profile, signOut } = useAuth();
  const [stats, setStats] = useState({
    users: null,
    reports: null,
  });

  useEffect(() => {
    (async () => {
      const [{ count: userCount }, { count: reportCount }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("reports").select("*", { count: "exact", head: true }),
      ]);
      setStats({ users: userCount, reports: reportCount });
    })();
  }, []);

  return (
    <div className="pb-24">
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-10">
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-4">
          <div
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{
              color: COL.gold,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Administrator
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase bn-link"
            style={{
              color: COL.muted,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
            }}
          >
            <LogOut size={12} />
            <span>Logg ut</span>
          </button>
        </div>

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
          Dashboard
        </h1>
        <p
          className="mt-5 max-w-2xl text-[15px] md:text-[17px] leading-[1.6]"
          style={{ color: COL.inkSoft }}
        >
          Innlogget som{" "}
          <span style={{ color: COL.ink, fontWeight: 600 }}>
            {profile?.full_name || profile?.email}
          </span>
          .
        </p>
      </section>

      {/* Stat strip */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 mb-16">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: COL.border }}
        >
          <Stat label="Brukere" value={stats.users} icon={<Users size={14} />} />
          <Stat
            label="Rapporter"
            value={stats.reports}
            icon={<FileText size={14} />}
          />
          <Stat
            label="Aktive prosjekter"
            value="6"
            icon={<Briefcase size={14} />}
            note="Statisk i data.js"
          />
          <Stat
            label="Aktuelt"
            value="2"
            icon={<Newspaper size={14} />}
            note="Statisk i data.js"
          />
        </div>
      </section>

      {/* Action sections */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 space-y-12">
        <ActionCard
          letter="A"
          title="Last opp ny rapport"
          description="Publiser kvartals- eller årsrapport synlig for styret. PDFen lastes opp til Supabase Storage og dukker opp i styreportalen umiddelbart."
          cta="Last opp"
          icon={<Upload size={14} />}
          comingSoon
        />
        <ActionCard
          letter="B"
          title="Administrer brukere"
          description="Inviter nye styremedlemmer eller deaktiver tilganger. Roller settes til 'admin' eller 'board' i profiles-tabellen."
          cta="Åpne brukerliste"
          icon={<Users size={14} />}
          comingSoon
        />
        <ActionCard
          letter="C"
          title="Prosjekter og aktuelt"
          description="Innholdet på den offentlige siden ligger foreløpig i src/data.js. Inntil et CMS er på plass redigeres dette i kode."
          cta="Se data.js"
          icon={<Briefcase size={14} />}
          comingSoon
        />
      </section>
    </div>
  );
}

function Stat({ label, value, icon, note }) {
  return (
    <div
      className="p-6 lg:p-8"
      style={{ background: COL.paper }}
    >
      <div
        className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase mb-3"
        style={{
          color: COL.muted,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {icon}
        <span>{label}</span>
      </div>
      <div
        className="tabular-nums"
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 400,
          fontSize: "clamp(28px, 3.5vw, 40px)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: COL.ink,
        }}
      >
        {value === null ? "—" : value}
      </div>
      {note && (
        <div
          className="mt-2 text-[10px] tracking-[0.15em] uppercase"
          style={{
            color: COL.muted,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
}

function ActionCard({ letter, title, description, cta, icon, comingSoon }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 pb-12 border-b" style={{ borderColor: COL.borderSoft }}>
      <div className="lg:col-span-4">
        <div className="flex items-baseline gap-4 mb-2">
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
              fontSize: "clamp(20px, 2.2vw, 26px)",
              letterSpacing: "-0.015em",
              lineHeight: 1.2,
              color: COL.ink,
            }}
          >
            {title}
          </h2>
        </div>
      </div>
      <div className="lg:col-span-6">
        <p
          className="text-[14px] md:text-[15px] leading-[1.7]"
          style={{ color: COL.inkSoft, maxWidth: 620 }}
        >
          {description}
        </p>
      </div>
      <div className="lg:col-span-2 flex items-start lg:items-center">
        <button
          disabled={comingSoon}
          className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase"
          style={{
            color: comingSoon ? COL.muted : COL.ink,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            cursor: comingSoon ? "not-allowed" : "pointer",
            opacity: comingSoon ? 0.6 : 1,
          }}
        >
          {icon}
          <span>{comingSoon ? "Kommer" : cta}</span>
        </button>
      </div>
    </div>
  );
}
