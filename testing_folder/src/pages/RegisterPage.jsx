import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/layout/SEO";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setErrors({});
    setIsLoading(true);

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || undefined,
      password: formData.password,
    });

    if (result.success) {
      navigate("/admin");
    } else {
      setErrors({ general: result.error });
    }
    setIsLoading(false);
  };

  const inputClasses =
    "w-full px-4 py-3 bg-gray-light border border-gray-200/80 rounded-xl text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

  return (
    <>
      <SEO
        title="Agent Registration - 360Urban"
        description="Register as a property agent on 360Urban to start listing your properties."
      />

      <div className="min-h-screen flex">
        {/* Left side — branding */}
        <div className="hidden lg:flex lg:w-5/12 bg-charcoal relative overflow-hidden items-center justify-center">
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
              Start listing properties today
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Join Abuja&apos;s most trusted platform and connect with verified
              property seekers across the city.
            </p>

            <div className="mt-12 flex flex-col gap-4">
              {[
                "Verified property listings",
                "Direct buyer/renter contact",
                "Professional agent dashboard",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-gray-300 text-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side — form */}
        <div className="w-full lg:w-7/12 flex items-center justify-center px-6 py-12 pt-24 lg:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg"
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
              Create your account
            </h1>
            <p className="text-gray-500 mb-8">
              Start listing properties on 360Urban
            </p>

            {errors.general && (
              <div className="bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm px-4 py-3 mb-6">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    First name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Phone{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="+234 802 345 6789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Min. 8 characters"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Re-enter your password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer mt-2"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:text-primary-dark transition-colors inline-flex items-center gap-1"
                >
                  Sign in
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
