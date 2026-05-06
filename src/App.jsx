import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";
import { Lock } from "lucide-react";
import { COL } from "./data";
import BNLogo from "./components/BNLogo";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import OmOss from "./pages/OmOss";
import Aktuelt from "./pages/Aktuelt";
import EiendomSokes from "./pages/EiendomSokes";
import Kontakt from "./pages/Kontakt";
import Samfunnsansvar from "./pages/Samfunnsansvar";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Styreportal from "./pages/Styreportal";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/prosjekter" element={<Projects />} />
            <Route path="/prosjekter/:slug" element={<ProjectDetail />} />
            <Route path="/om-oss" element={<OmOss />} />
            <Route path="/aktuelt" element={<Aktuelt />} />
            <Route path="/eiendom-sokes" element={<EiendomSokes />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/samfunnsansvar" element={<Samfunnsansvar />} />
            <Route path="/logg-inn" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/styreportal"
              element={
                <ProtectedRoute roles={["admin", "board"]}>
                  <Styreportal />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function Layout() {
  const location = useLocation();
  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: COL.paper }}>
      <Nav />
      <main className="flex-1 pt-[88px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/prosjekter", label: "Prosjekter" },
    { to: "/om-oss", label: "Om oss" },
    { to: "/aktuelt", label: "Aktuelt" },
    { to: "/eiendom-sokes", label: "Eiendom søkes" },
    { to: "/kontakt", label: "Kontakt" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(246, 241, 231, 0.94)" : COL.paper,
        backdropFilter: scrolled ? "saturate(180%) blur(12px)" : "none",
        borderBottom: `1px solid ${scrolled ? COL.border : "transparent"}`,
      }}
    >
      <div
        className="max-w-[1280px] mx-auto px-6 lg:px-12 flex items-center justify-between"
        style={{ height: 88 }}
      >
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <BNLogo height={36} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="bn-link text-[13px]"
              style={({ isActive }) => ({
                color: isActive ? COL.gold : COL.inkSoft,
                fontWeight: 500,
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Meny"
        >
          <div className="w-6 h-[2px] mb-[5px]" style={{ background: COL.ink }} />
          <div className="w-6 h-[2px] mb-[5px]" style={{ background: COL.ink }} />
          <div className="w-6 h-[2px]" style={{ background: COL.ink }} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden border-t"
          style={{ background: COL.paper, borderColor: COL.border }}
        >
          <div className="max-w-[1280px] mx-auto px-6 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-[15px]"
                style={({ isActive }) => ({
                  color: isActive ? COL.gold : COL.ink,
                  fontWeight: 500,
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer
      className="mt-32 pt-16 pb-10"
      style={{ background: COL.inkDeep, color: COL.paper }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 pb-10 border-b" style={{ borderColor: "rgba(246,241,231,0.12)" }}>
          <FooterCol
            title="Selskap"
            items={[
              "Bolig Norge AS",
              "Org.nr 923 733 345",
              "Kjøpmannsgata 34",
              "7011 Trondheim",
            ]}
          />
          <FooterCol
            title="Sider"
            items={[
              { label: "Prosjekter", href: "/prosjekter" },
              { label: "Om oss", href: "/om-oss" },
              { label: "Aktuelt", href: "/aktuelt" },
              { label: "Eiendom søkes", href: "/eiendom-sokes" },
              { label: "Samfunnsansvar", href: "/samfunnsansvar" },
              { label: "Kontakt", href: "/kontakt" },
            ]}
          />
          <FooterCol
            title="Kontakt"
            items={[
              { label: "+47 73 93 31 00", href: "tel:+4773933100", external: true },
              { label: "post@bolignorge.no", href: "mailto:post@bolignorge.no", external: true },
              { label: "LinkedIn", href: "https://www.linkedin.com/company/bolignorge/", external: true },
            ]}
          />
        </div>

        <div
          className="pt-6 flex flex-wrap justify-between items-center gap-4 text-[11px]"
          style={{
            color: COL.borderSoft,
            opacity: 0.5,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <span>© {new Date().getFullYear()} Bolig Norge AS</span>
          <div className="flex items-center gap-4">
            <span>bolignorge.no</span>
            <Link
              to="/logg-inn"
              style={{ color: "inherit", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "")}
            >
              ·
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div
        className="text-[10px] tracking-[0.25em] uppercase mb-4"
        style={{
          color: COL.goldSoft,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {title}
      </div>
      <div
        className="space-y-2 text-[13px]"
        style={{ color: COL.borderSoft, opacity: 0.85 }}
      >
        {items.map((it, i) =>
          typeof it === "string" ? (
            <div key={i}>{it}</div>
          ) : (
            <div key={i}>
              {it.external ? (
                <a
                  href={it.href}
                  className="bn-link inline-flex items-center gap-1.5"
                  style={{ color: COL.borderSoft }}
                >
                  {it.lock && <Lock size={10} />}
                  <span>{it.label}</span>
                </a>
              ) : (
                <Link
                  to={it.href}
                  className="bn-link inline-flex items-center gap-1.5"
                  style={{ color: COL.borderSoft }}
                >
                  {it.lock && <Lock size={10} />}
                  <span>{it.label}</span>
                </Link>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
