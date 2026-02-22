import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { areaService } from "../../services/areaService";
import AreaCard from "../ui/AreaCard";

export default function AreaNavSection() {
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

  if (loading) {
    return (
      <section className="py-20 md:py-28 bg-white">
        <div className="container-main">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-primary text-sm font-semibold mb-2">
            Explore by Area
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight mb-3">
            Popular neighbourhoods
          </h2>
          <p className="text-gray-500 max-w-md">
            Every area has its character. Find the neighbourhood that matches
            your lifestyle and budget.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {areas.map((area, i) => (
            <AreaCard key={area.slug} area={area} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
