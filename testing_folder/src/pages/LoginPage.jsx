import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/layout/SEO";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/admin");
    } else {
      setErrors({ general: result.error });
    }

    setIsLoading(false);
  };

  return (
    <>
      <SEO
        title="Agent Login - 360Urban"
        description="Login to 360Urban agent dashboard to manage your property listings."
      />

      <div className="min-h-screen flex">
        {/* Left side — branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-charcoal relative overflow-hidden items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-charcoal-light" />
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative z-10 px-16 max-w-lg">
            <Link
              to="/"
              className="flex items-center gap-2.5 no-underline mb-12"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                360<span className="text-primary">Urban</span>
              </span>
            </Link>
            <h2 className="text-4xl font-bold text-white tracking-tight leading-tight mb-4">
              Manage your properties with ease
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Access your dashboard to list, update, and manage all your
              verified properties on Abuja&apos;s most trusted platform.
            </p>
          </div>
        </div>

        {/* Right side — form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 pt-24 lg:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="lg:hidden mb-8">
              <Link to="/" className="flex items-center gap-2.5 no-underline">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold text-charcoal tracking-tight">
                  360<span className="text-primary">Urban</span>
                </span>
              </Link>
            </div>

            <h1 className="text-2xl font-bold text-charcoal tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500 mb-8">Sign in to your agent account</p>

            {errors.general && (
              <div className="bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm px-4 py-3 mb-6">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-light border border-gray-200/80 rounded-xl text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-light border border-gray-200/80 rounded-xl text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary font-semibold hover:text-primary-dark transition-colors inline-flex items-center gap-1"
                >
                  Create one
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
