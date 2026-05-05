import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { COL } from "../data";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { signIn, user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Already signed in? Send to appropriate landing page.
  if (!authLoading && user) {
    const dest = role === "admin" ? "/admin" : "/styreportal";
    navigate(location.state?.from || dest, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: authError } = await signIn(email.trim(), password);
    setLoading(false);
    if (authError) {
      setError(authError.message || "Innlogging feilet");
      return;
    }
    // onAuthStateChange in AuthContext will set user, then this component
    // re-renders and the early-return above redirects.
  };

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-6 py-16"
      style={{ background: COL.paper }}
    >
      <div
        className="w-full max-w-[440px] p-10 lg:p-12"
        style={{ background: COL.card, border: `1px solid ${COL.border}` }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Lock size={14} style={{ color: COL.gold }} />
          <div
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{
              color: COL.muted,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Innlogging
          </div>
        </div>

        <h1
          className="mb-2"
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 400,
            fontSize: "clamp(28px, 3vw, 36px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: COL.ink,
          }}
        >
          Velkommen tilbake
        </h1>
        <p
          className="text-[14px] leading-[1.6] mb-8"
          style={{ color: COL.muted }}
        >
          For administrator og styremedlemmer. Bruk e-postadresse og passord
          du har fått tilsendt.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="E-post" icon={<Mail size={14} />}>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-[15px]"
              style={{
                color: COL.ink,
                fontFamily: "'Manrope', sans-serif",
              }}
            />
          </Field>

          <Field label="Passord" icon={<Lock size={14} />}>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent outline-none text-[15px]"
              style={{
                color: COL.ink,
                fontFamily: "'Manrope', sans-serif",
              }}
            />
          </Field>

          {error && (
            <div
              className="text-[12px] py-3 px-3 border-l-2"
              style={{
                background: "rgba(168, 132, 62, 0.06)",
                borderLeftColor: COL.gold,
                color: COL.ink,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 flex items-center justify-center gap-2 transition-opacity"
            style={{
              background: COL.ink,
              color: COL.paper,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            <span>{loading ? "Logger inn …" : "Logg inn"}</span>
            {!loading && <ArrowRight size={13} />}
          </button>
        </form>

        <div
          className="mt-8 pt-6 border-t text-[11px]"
          style={{
            borderColor: COL.borderSoft,
            color: COL.muted,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Trenger du hjelp? Kontakt{" "}
          <Link
            to="/kontakt"
            className="bn-link"
            style={{ color: COL.ink, fontWeight: 600 }}
          >
            pal.oxaal@bolignorge.no
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <label className="block">
      <div
        className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase mb-2"
        style={{
          color: COL.muted,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {icon}
        <span>{label}</span>
      </div>
      <div
        className="px-3 py-3 border-b transition-colors focus-within:border-current"
        style={{ borderColor: COL.border, background: COL.paper }}
      >
        {children}
      </div>
    </label>
  );
}
