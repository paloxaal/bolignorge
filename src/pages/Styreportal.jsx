import { useEffect, useState } from "react";
import { FileText, ArrowUpRight, LogOut, Calendar, Download } from "lucide-react";
import { COL } from "../data";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function Styreportal() {
  const { profile, signOut } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from("reports")
        .select("id, title, summary, period, kind, published_at, file_path")
        .order("published_at", { ascending: false });
      if (cancelled) return;
      if (dbError) {
        setError(dbError.message);
      } else {
        setReports(data || []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openReport = async (report) => {
    if (!report.file_path) return;
    // Generate signed URL for the private 'reports' bucket
    const { data, error: urlError } = await supabase.storage
      .from("reports")
      .createSignedUrl(report.file_path, 60 * 10); // 10 min validity
    if (urlError) {
      alert("Kunne ikke åpne rapport: " + urlError.message);
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="pb-24">
      {/* Header section */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-10">
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-4">
          <div
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{
              color: COL.gold,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Styreportal
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
          Rapporter og dokumenter
        </h1>
        <p
          className="mt-5 max-w-2xl text-[15px] md:text-[17px] leading-[1.6]"
          style={{ color: COL.inkSoft }}
        >
          Innlogget som{" "}
          <span style={{ color: COL.ink, fontWeight: 600 }}>
            {profile?.full_name || profile?.email}
          </span>
          . Her finner du kvartals- og årsrapporter, styreprotokoller og andre
          dokumenter delt med styret.
        </p>
      </section>

      {/* Reports list */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div
          className="text-[10px] tracking-[0.25em] uppercase mb-6 pb-3 border-b"
          style={{
            color: COL.muted,
            fontFamily: "'JetBrains Mono', monospace",
            borderColor: COL.border,
          }}
        >
          Tilgjengelige rapporter
        </div>

        {loading && (
          <div
            className="py-20 text-center text-[12px] tracking-[0.2em] uppercase"
            style={{
              color: COL.muted,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Henter rapporter …
          </div>
        )}

        {!loading && error && (
          <div
            className="p-6 border-l-2"
            style={{
              borderLeftColor: COL.gold,
              background: "rgba(168, 132, 62, 0.06)",
              color: COL.ink,
            }}
          >
            <div
              className="text-[10px] tracking-[0.25em] uppercase mb-2"
              style={{
                color: COL.gold,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Feil
            </div>
            <div className="text-[14px]">{error}</div>
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div
            className="py-20 text-center"
            style={{ color: COL.muted, fontStyle: "italic" }}
          >
            Ingen rapporter er publisert ennå.
          </div>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="border-b" style={{ borderColor: COL.border }}>
            {reports.map((r) => (
              <ReportRow key={r.id} report={r} onOpen={openReport} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ReportRow({ report, onOpen }) {
  const date = new Date(report.published_at);
  const dateStr = date.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <button
      onClick={() => onOpen(report)}
      className="w-full grid grid-cols-12 gap-4 py-6 border-b last:border-b-0 items-baseline text-left transition-colors group"
      style={{ borderColor: COL.borderSoft, background: "transparent" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = COL.card)}
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "transparent")
      }
    >
      <div className="col-span-2 md:col-span-2 flex items-center gap-2">
        <FileText size={14} style={{ color: COL.gold }} />
        <span
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{
            color: COL.muted,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {report.kind || "Rapport"}
        </span>
      </div>

      <div className="col-span-7 md:col-span-6">
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 500,
            fontSize: "clamp(18px, 2vw, 22px)",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            color: COL.ink,
          }}
        >
          {report.title}
        </div>
        {report.summary && (
          <div
            className="text-[13px] mt-1 line-clamp-1"
            style={{ color: COL.muted }}
          >
            {report.summary}
          </div>
        )}
      </div>

      <div
        className="col-span-2 md:col-span-2 flex items-center gap-1.5 text-[12px]"
        style={{
          color: COL.inkSoft,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <Calendar size={11} />
        <span>{report.period || dateStr}</span>
      </div>

      <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-2">
        <Download
          size={14}
          style={{ color: COL.muted }}
          className="transition-colors group-hover:text-current"
        />
        <ArrowUpRight
          size={14}
          style={{ color: COL.muted }}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </button>
  );
}
