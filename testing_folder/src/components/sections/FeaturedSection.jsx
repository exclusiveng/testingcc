import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { propertyService } from "../../services/propertyService";
import PropertyCard from "../ui/PropertyCard";

export default function FeaturedSection() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const result = await propertyService.getFeaturedProperties(6);
      if (result.success) {
        setFeatured(result.data);
      }
      setLoading(false);
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-28 bg-gray-light">
        <div className="container-main">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  if (featured.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-gray-light">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
        >
          <div>
            <p className="text-primary text-sm font-semibold mb-2">Featured</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
              Hand-picked properties
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
              Our top verified listings — inspected, confirmed, and ready for
              you.
            </p>
          </div>
          <Link
            to="/listings"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-charcoal hover:text-primary no-underline transition-colors"
          >
            View all listings
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featured.map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
