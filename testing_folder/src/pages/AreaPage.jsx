import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../components/layout/SEO";
import PropertyCard from "../components/ui/PropertyCard";
import FilterBar from "../components/ui/FilterBar";
import CTASection from "../components/sections/CTASection";
import { areaService } from "../services/areaService";
import { propertyService } from "../services/propertyService";
import { filterProperties } from "../lib/utils";

export default function AreaPage() {
  const { areaSlug } = useParams();
  const [area, setArea] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const areaResponse = await areaService.getAreaBySlug(areaSlug);
        if (!areaResponse.success || !areaResponse.data) {
          setError("Area not found");
          setLoading(false);
          return;
        }
        setArea(areaResponse.data);

        const propertiesResponse = await propertyService.getProperties({
          area: areaSlug,
          page: 1,
          limit: 100,
        });
        setProperties(
          propertiesResponse.data?.data || propertiesResponse.data || [],
        );
      } catch (err) {
        console.error("Failed to fetch area properties:", err);
        setError(err.message || "Failed to load area properties");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [areaSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!area || error) {
    return (
      <div className="container-main py-32 text-center">
        <h1 className="text-2xl font-bold text-charcoal mb-3">
          Area Not Found
        </h1>
        <p className="text-gray-500 mb-6">
          The area you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          to="/"
          className="text-primary font-semibold no-underline hover:text-primary-dark"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const filtered = filterProperties(properties, filters);

  return (
    <>
      <SEO
        title={`Properties in ${area.name}, Abuja`}
        description={`Find verified houses, flats, and land for rent and sale in ${area.name}, Abuja. ${area.description}`}
      />

      {/* Header */}
      <section className="bg-gradient-to-b from-gray-light to-white pt-28 pb-12">
        <div className="container-main">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-sm text-gray-400 mb-8"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              className="no-underline text-gray-400 hover:text-charcoal transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              to="/areas"
              className="no-underline text-gray-400 hover:text-charcoal transition-colors"
            >
              Areas
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-charcoal font-medium">{area.name}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary text-sm font-semibold mb-3">
              Area Guide
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal tracking-tight mb-4">
              {area.name}
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl leading-relaxed mb-5">
              {area.description}
            </p>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xl font-bold text-charcoal">
                {properties.length}
              </span>
              <span className="text-sm text-gray-500">
                {properties.length === 1 ? "property" : "properties"} listed
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-10 bg-white">
        <div className="container-main">
          <div className="mb-10">
            <FilterBar filters={filters} onFilterChange={setFilters} />
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-light rounded-2xl">
              <p className="text-charcoal font-bold text-xl mb-3">
                No properties found
              </p>
              <p className="text-gray-500 mb-6">
                Try adjusting your filters or explore other areas.
              </p>
              <button
                onClick={() => setFilters({})}
                className="bg-primary text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-primary/20 hover:bg-primary-dark transition-all cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
