import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Menu,
  X,
  MapPin,
  Settings,
  Layers,
  Home,
} from "lucide-react";

const adminLinks = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Manage Properties", path: "/admin/listings", icon: Home },
  { label: "Manage Areas", path: "/admin/areas", icon: Layers },
  { label: "Add Property", path: "/admin/add", icon: PlusCircle },
  { label: "Add Area", path: "/admin/areas/add", icon: MapPin },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-light flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-charcoal text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`
              fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-charcoal text-white flex flex-col
              ${sidebarOpen ? "block" : "hidden md:flex"}
            `}
          >
            {/* Logo Area */}
            <div className="p-6 border-b border-white/10">
              <Link
                to="/"
                className="flex items-center gap-3 group no-underline"
              >
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                  <MapPin className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-bold leading-none">360Urban</h1>
                  <span className="text-xs text-white/50 uppercase tracking-widest">
                    Admin Panel
                  </span>
                </div>
              </Link>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {adminLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive(link.path)
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-white/10">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Exit to Website
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
