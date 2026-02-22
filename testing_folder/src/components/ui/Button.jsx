import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30",
  secondary:
    "bg-white text-charcoal border border-gray-200 hover:border-primary hover:text-primary shadow-sm hover:shadow-md",
  dark: "bg-charcoal text-white hover:bg-charcoal-light shadow-md shadow-charcoal/20",
  whatsapp:
    "bg-[#25D366] text-white hover:bg-[#1eb855] shadow-md shadow-green-500/25",
  ghost:
    "bg-transparent text-gray-text hover:text-charcoal hover:bg-gray-light",
  outline:
    "bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-white",
};

const sizes = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-2.5 text-sm gap-2",
  lg: "px-8 py-3.5 text-base gap-2",
  xl: "px-10 py-4 text-base gap-2.5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  ...props
}) {
  const baseClasses = cn(
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 cursor-pointer no-underline",
    variants[variant],
    sizes[size],
    className,
  );

  const MotionComponent = href ? motion.a : motion.button;

  return (
    <MotionComponent
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className={baseClasses}
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
