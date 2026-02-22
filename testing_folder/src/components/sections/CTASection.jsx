import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import { generateGeneralWhatsAppLink, WHATSAPP_AGENTS } from "../../lib/utils";

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-charcoal relative overflow-hidden">
      {/* Subtle decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-charcoal-light opacity-100" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-full blur-3xl pointer-events-none" />

      <div className="container-main relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary text-sm font-semibold mb-4">
              Ready to get started?
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight leading-tight">
              Find your perfect home in Abuja
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Whether you&apos;re looking to rent, buy, or invest — we&apos;re
              here to help you find the right property.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {WHATSAPP_AGENTS.map((agent) => (
                <Button
                  key={agent.id}
                  variant="whatsapp"
                  size="lg"
                  href={generateGeneralWhatsAppLink(agent.number)}
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat with {agent.name}
                </Button>
              ))}
              <Link to="/listings" className="no-underline">
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white hover:text-charcoal"
                >
                  Browse listings
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
