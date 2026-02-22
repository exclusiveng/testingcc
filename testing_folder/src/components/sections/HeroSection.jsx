import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Shield, ArrowRight } from "lucide-react";
import Button from "../ui/Button";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-gray-light to-white pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Soft decorative elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <div className="container-main relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-charcoal px-4 py-2 rounded-xl text-xs font-semibold mb-8 shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-primary" />
            Verified Properties Only
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-charcoal leading-[1.05] tracking-tight mb-6"
          >
            Find your next <span className="text-primary">perfect home</span> in
            Abuja
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
          >
            Browse verified houses, flats, and land across Abuja&apos;s best
            neighbourhoods. No hidden fees, just real properties.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link to="/listings" className="no-underline">
              <Button size="lg" className="w-full sm:w-auto">
                <Search className="w-4 h-4" />
                Browse Listings
              </Button>
            </Link>
            <Link to="/areas" className="no-underline">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Explore Areas
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 pt-10 border-t border-gray-200/60 flex flex-wrap gap-12 md:gap-16"
        >
          {[
            { value: "6+", label: "Neighbourhoods" },
            { value: "50+", label: "Verified Listings" },
            { value: "100%", label: "Transparency" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl md:text-4xl font-extrabold text-charcoal tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-gray-400 font-medium mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
