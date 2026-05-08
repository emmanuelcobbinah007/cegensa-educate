import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bell, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-ocean-600 font-semibold"
      : "text-gray-500 hover:text-ocean-600";

  const handleLogout = () => navigate("/");

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled
            ? [
                "bg-white border-b border-sand-200 shadow-soft",
                "md:mt-3 md:mx-[calc(50%_-_600px)] md:rounded-2xl md:border-b-0 md:border md:border-sand-100 md:shadow-elevated",
              ].join(" ")
            : "bg-white border-b border-sand-200 shadow-soft"
        }`}
      >
        <div className={`px-4 sm:px-6 ${scrolled ? "md:max-w-none md:mx-0" : "max-w-7xl mx-auto"}`}>
          <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? "h-16 md:h-14" : "h-16"}`}>

            {/* Wordmark */}
            <Link to="/dashboard" className="flex items-center gap-4">
              <div className="flex items-baseline">
                <span className="font-display font-bold leading-none text-ocean-700" style={{ fontSize: "1.6rem", letterSpacing: "-0.02em" }}>
                  Kasa
                </span>
                <span className="text-[11px] font-bold font-sans ml-0.5 mb-2 text-terra-500">
                  UG
                </span>
              </div>
              <div className="block h-5 w-px bg-sand-200" />
              <div className="block leading-tight">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Committee Portal
                </div>
                <div className="text-[10px] text-gray-300">
                  Anti-Sexual Harassment
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-7">
              <Link to="/dashboard" className={`text-sm transition-colors ${isActive("/dashboard")}`}>
                Dashboard
              </Link>
              <Link to="/dashboard" className="text-sm transition-colors text-gray-500 hover:text-ocean-600">
                Cases
              </Link>
              <Link to="/dashboard" className="text-sm transition-colors text-gray-500 hover:text-ocean-600">
                Reports
              </Link>
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button className="relative p-2 transition-colors text-gray-400 hover:text-ocean-600">
                <Bell className="w-4.5 h-4.5" strokeWidth={1.75} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-terra-500 rounded-full" />
              </button>
              <div className="flex items-center gap-2 pl-3 border-l border-sand-200">
                <div className="w-8 h-8 rounded-full bg-ocean-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-ocean-700">CM</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <button
                onClick={handleLogout}
                className="p-2 transition-colors text-gray-300 hover:text-red-500"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-gray-500"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
        <nav className="flex flex-col items-center gap-8 text-center">
          {[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Cases", to: "/dashboard" },
            { label: "Reports", to: "/dashboard" },
          ].map((item, i) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`font-display text-[2rem] font-semibold text-ocean-800 hover:text-ocean-600 transition-all duration-500 leading-none ${
                mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: mobileOpen ? `${i * 70 + 80}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="h-16" />
    </>
  );
}
