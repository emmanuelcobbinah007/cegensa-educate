import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bell, LogOut, ChevronDown, ArrowRight } from "lucide-react";

interface NavbarProps {
  role?: "committee" | "public";
}

export default function Navbar({ role = "public" }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    const active = location.pathname === path;
    return transparent
      ? active
        ? "text-white font-semibold"
        : "text-white/70 hover:text-white"
      : active
        ? "text-ocean-600 font-semibold"
        : "text-gray-500 hover:text-ocean-600";
  };

  const linkCls = transparent
    ? "text-white/70 hover:text-white"
    : "text-gray-500 hover:text-ocean-600";

  const handleLogout = () => navigate("/");

  const mobileLinks = [
    { label: "Home", to: "/" },
    { label: "Report", to: "/report" },
    { label: "Track Case", to: "/track" },
    { label: "Your Rights", to: "/#rights" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out ${
          transparent
            ? "bg-transparent"
            : scrolled
              ? [
                  // Mobile: stay as a solid bar
                  "bg-white border-b border-sand-200 shadow-soft",
                  // Desktop: morph into a floating pill
                  "md:mt-3 md:mx-[calc(50%_-_600px)] md:rounded-2xl md:border-b-0 md:border md:border-sand-100 md:shadow-elevated",
                ].join(" ")
              : "bg-white border-b border-sand-200 shadow-soft"
        }`}
      >
        <div
          className={`px-4 sm:px-6 ${!transparent && scrolled ? "" : "max-w-7xl mx-auto"}`}
        >
          <div
            className={`flex items-center justify-between transition-all duration-500 ${!transparent && scrolled ? "h-16 md:h-14" : "h-16"}`}
          >
            {/* Wordmark */}
            <Link to="/" className="flex items-center gap-4">
              <div className="flex items-baseline">
                <span
                  className={`font-display font-bold leading-none transition-colors duration-300 ${transparent ? "text-white" : "text-ocean-700"}`}
                  style={{ fontSize: "1.6rem", letterSpacing: "-0.02em" }}
                >
                  Kasa
                </span>
                <span
                  className={`text-[11px] font-bold font-sans ml-0.5 mb-2 transition-colors duration-300 ${transparent ? "text-terra-300" : "text-terra-500"}`}
                >
                  UG
                </span>
              </div>
              <div
                className={`block h-5 w-px transition-colors duration-300 ${transparent ? "bg-white/30" : "bg-sand-200"}`}
              />
              <div className="block leading-tight">
                <div
                  className={`text-[10px] font-semibold uppercase tracking-widest transition-colors duration-300 ${transparent ? "text-white/70" : "text-gray-400"}`}
                >
                  Safe Reporting
                </div>
                <div
                  className={`text-[10px] transition-colors duration-300 ${transparent ? "text-white/50" : "text-gray-300"}`}
                >
                  University of Ghana
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-7">
              {role === "committee" ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`text-sm transition-colors ${isActive("/dashboard")}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`text-sm transition-colors ${linkCls}`}
                  >
                    Cases
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`text-sm transition-colors ${linkCls}`}
                  >
                    Reports
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className={`text-sm transition-colors ${isActive("/")}`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/report"
                    className={`text-sm transition-colors ${isActive("/report")}`}
                  >
                    Report
                  </Link>
                  <Link
                    to="/track"
                    className={`text-sm transition-colors ${isActive("/track")}`}
                  >
                    Track Case
                  </Link>
                  <a
                    href="#rights"
                    className={`text-sm transition-colors ${linkCls}`}
                  >
                    Your Rights
                  </a>
                </>
              )}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              {role === "committee" ? (
                <>
                  <button
                    className={`relative p-2 transition-colors ${transparent ? "text-white/70 hover:text-white" : "text-gray-400 hover:text-ocean-600"}`}
                  >
                    <Bell className="w-4.5 h-4.5" strokeWidth={1.75} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-terra-500 rounded-full" />
                  </button>
                  <div
                    className={`flex items-center gap-2 pl-3 border-l transition-colors duration-300 ${transparent ? "border-white/30" : "border-sand-200"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${transparent ? "bg-white/20" : "bg-ocean-100"}`}
                    >
                      <span
                        className={`text-xs font-bold ${transparent ? "text-white" : "text-ocean-700"}`}
                      >
                        CM
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-colors ${transparent ? "text-white/60" : "text-gray-400"}`}
                    />
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`p-2 transition-colors ${transparent ? "text-white/50 hover:text-white" : "text-gray-300 hover:text-red-500"}`}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Link
                  to="/report"
                  className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                    transparent
                      ? "bg-white text-ocean-700 hover:bg-white/90"
                      : "bg-ocean-500 text-white hover:bg-ocean-600 active:bg-ocean-700"
                  }`}
                >
                  Report an Incident
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className={`md:hidden p-2 transition-colors ${transparent ? "text-white" : "text-gray-500"}`}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Full-screen mobile overlay ─────────────────────────── */}
      <div
        className={`fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Nav links — staggered fade + lift */}
        <nav className="flex flex-col items-center gap-9 text-center">
          {mobileLinks.map((item, i) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`font-display text-[2.2rem] font-semibold text-ocean-800 hover:text-ocean-600 transition-all duration-500 leading-none ${
                mobileOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
              style={{
                transitionDelay: mobileOpen ? `${i * 70 + 80}ms` : "0ms",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA button */}
        <Link
          to="/report"
          onClick={() => setMobileOpen(false)}
          className={`mt-14 inline-flex items-center gap-2 px-8 py-3.5 bg-terra-500 hover:bg-terra-400 text-white font-semibold rounded-xl transition-all duration-500 ${
            mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
          style={{ transitionDelay: mobileOpen ? "320ms" : "0ms" }}
        >
          Tell Us What Happened
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Logo at bottom */}
        <div
          className={`absolute bottom-10 flex items-baseline transition-all duration-500 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: mobileOpen ? "400ms" : "0ms" }}
        >
          <span
            className="font-display font-bold text-ocean-700 leading-none"
            style={{ fontSize: "1.6rem", letterSpacing: "-0.02em" }}
          >
            Kasa
          </span>
          <span className="text-[11px] font-bold text-terra-500 font-sans ml-0.5 mb-2">
            UG
          </span>
        </div>
      </div>

      {/* Spacer for fixed navbar on non-home pages */}
      {!isHome && <div className="h-16" />}
    </>
  );
}
