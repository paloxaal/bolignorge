import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { COL } from "../data";

/**
 * <ProtectedRoute roles={["admin"]}>...
 * Redirects to /logg-inn if not signed in.
 * Renders an inline "no access" message if signed in but role doesn't match.
 */
export default function ProtectedRoute({ children, roles }) {
  const { loading, user, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center text-[12px] tracking-[0.25em] uppercase"
        style={{ color: COL.muted, fontFamily: "'JetBrains Mono', monospace" }}
      >
        Laster …
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/logg-inn" state={{ from: location.pathname }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(role)) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-32">
        <div
          className="text-[10px] tracking-[0.25em] uppercase mb-4"
          style={{ color: COL.gold, fontFamily: "'JetBrains Mono', monospace" }}
        >
          Ingen tilgang
        </div>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 400,
            fontSize: "clamp(28px, 3.5vw, 40px)",
            letterSpacing: "-0.02em",
            color: COL.ink,
          }}
        >
          Denne siden krever andre rettigheter
        </h1>
        <p className="mt-4 text-[15px]" style={{ color: COL.inkSoft }}>
          Brukeren din har ikke tilgang til denne ressursen. Kontakt
          administrator hvis du tror dette er feil.
        </p>
      </div>
    );
  }

  return children;
}
