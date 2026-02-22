import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, LogOut, LayoutGrid } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Areas", path: "/areas" },
  { label: "Listings", path: "/listings" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-white"
      }`}
    >
      <div className="container-main flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg transition-all duration-300 group-hover:scale-110">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-charcoal tracking-tight">
            360<span className="text-primary">Urban</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden lg:flex items-center gap-3"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`inline-flex items-center justify-center !px-6 !py-3 rounded-full text-sm font-bold no-underline transition-all duration-300 ${
                isActive(link.path)
                  ? "bg-charcoal text-white shadow-lg shadow-charcoal/10"
                  : "text-gray-500 hover:text-charcoal hover:bg-gray-50 bg-transparent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 pl-5 pr-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-all cursor-pointer border border-transparent hover:border-gray-200"
              >
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-bold text-charcoal leading-none mb-0.5">
                    {user?.firstName}
                  </div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                    {user?.role}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm text-primary flex items-center justify-center text-sm font-bold border border-gray-100">
                  {user?.firstName?.[0]}
                </div>
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "circOut" }}
                    className="absolute right-0 mt-3 w-60 bg-white rounded-3xl shadow-xl shadow-charcoal/10 border border-gray-100/50 p-3 z-50 overflow-hidden"
                  >
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 text-charcoal hover:bg-gray-50 rounded-2xl no-underline transition-all group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <LayoutGrid className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-sm font-bold">Dashboard</span>
                    </Link>
                    <div className="h-px bg-gray-50 my-1" />
                    <button
                      onClick={async () => {
                        await logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all text-left cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <LogOut className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-sm font-bold">Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center justify-center !px-8 !py-3.5 text-charcoal font-bold text-sm no-underline hover:bg-gray-50 rounded-full transition-all min-w-[100px]"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center !px-10 !py-3.5 bg-primary text-white rounded-full font-bold text-sm no-underline hover:bg-primary-dark shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-300 min-w-[140px]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated ? (
            <button
              onClick={async () => {
                await logout();
                setMobileOpen(false);
              }}
              className="p-2 text-gray-500 hover:text-charcoal transition-colors rounded-lg cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 text-xs bg-primary text-white rounded-lg font-medium no-underline"
            >
              Sign In
            </Link>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-charcoal hover:text-primary transition-colors rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
            aria-label="Mobile navigation"
          >
            <div className="container-main py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center !py-3 !px-4 rounded-xl text-sm font-bold no-underline transition-all ${
                      isActive(link.path)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-gray-100">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex justify-center !py-3 !px-4 rounded-xl text-sm font-bold text-charcoal border border-gray-200 no-underline"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex justify-center !py-3 !px-4 rounded-xl text-sm font-bold text-white bg-primary no-underline shadow-md shadow-primary/20"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
