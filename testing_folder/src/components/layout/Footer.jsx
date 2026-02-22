import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowUp } from "lucide-react";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "All Listings", path: "/listings" },
  { label: "Jabi", path: "/areas/jabi" },
  { label: "Maitama", path: "/areas/maitama" },
  { label: "Gwarinpa", path: "/areas/gwarinpa" },
];

const areaLinks = [
  { label: "Katampe", path: "/areas/katampe" },
  { label: "Lugbe", path: "/areas/lugbe" },
  { label: "Wuse", path: "/areas/wuse" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="bg-gray-light border-t border-gray-200/60 text-charcoal"
      role="contentinfo"
    >
      <div className="container-main pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2.5 no-underline mb-5 group"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg transition-all duration-300 group-hover:scale-105">
                <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-charcoal tracking-tight">
                360<span className="text-primary">Urban</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Abuja&apos;s trusted platform for verified property listings. No
              hidden fees, just real properties.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
              Explore
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm font-medium text-gray-600 hover:text-charcoal no-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Areas */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
              Local Areas
            </h4>
            <ul className="flex flex-col gap-3">
              {areaLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm font-medium text-gray-600 hover:text-charcoal no-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
              Contact
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>+234 800 000 0000</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>hello@360urban.ng</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-8 border-t border-gray-200/60 gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} 360Urban. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-charcoal transition-all cursor-pointer"
            aria-label="Back to top"
          >
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
