import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SEO from "../components/layout/SEO";
import AreaCard from "../components/ui/AreaCard";
import CTASection from "../components/sections/CTASection";
import { areaService } from "../services/areaService";

export default function AreasIndexPage() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true);
      const result = await areaService.getAreas();
      if (result.success) {
        setAreas(result.data);
      }
      setLoading(false);
    };
    fetchAreas();
  }, []);

  return (
    <>
      <SEO
        title="Explore Areas in Abuja"
        description="Browse popular neighbourhoods in Abuja. Find the area that suits your lifestyle and budget."
      />

      {/* Header */}
      <section className="bg-gradient-to-b from-gray-light to-white pt-28 pb-12">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary text-sm font-semibold mb-3">
              Neighbourhoods
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal tracking-tight mb-4">
              Explore Abuja
            </h1>
            <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
              Each neighbourhood in Abuja has its own character. Find the area
              that suits your lifestyle and budget.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Areas Grid */}
      <section className="py-10 bg-white">
        <div className="container-main">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {areas.map((area, i) => (
                <AreaCard key={area.slug} area={area} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
