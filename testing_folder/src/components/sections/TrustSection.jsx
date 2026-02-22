import { motion } from "framer-motion";
import { ShieldCheck, Eye, MessageCircle, BadgeCheck } from "lucide-react";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    description:
      "Every property is inspected and confirmed before it appears on 360Urban.",
  },
  {
    icon: Eye,
    title: "No Hidden Fees",
    description:
      "Prices are transparent. What you see is what you get — no surprise charges.",
  },
  {
    icon: MessageCircle,
    title: "Direct Contact",
    description: "Reach out directly via WhatsApp. No middlemen, no runaround.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Platform",
    description:
      "Built for Abuja residents who want a stress-free property search experience.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-primary text-sm font-semibold mb-3">
            Why 360Urban
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4 tracking-tight">
            Property search without the stress
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            We've built a platform that puts verification and transparency
            first, so you can focus on finding your home.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group bg-gray-light rounded-2xl p-7 border border-transparent hover:border-primary/10 hover:shadow-md transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white border border-gray-100 rounded-xl mb-5 group-hover:scale-105 transition-transform duration-300">
                <point.icon className="w-6 h-6 text-primary" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold text-charcoal mb-2">
                {point.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
