import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import SEO from "../components/layout/SEO";
import PropertyCard from "../components/ui/PropertyCard";
import FilterBar from "../components/ui/FilterBar";
import CTASection from "../components/sections/CTASection";
import { propertyService } from "../services/propertyService";
import { areaService } from "../services/areaService";
import { cn } from "../lib/utils";

export default function ListingsPage() {
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("grid");
  const [properties, setProperties] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    const fetchAreas = async () => {
      const result = await areaService.getAreas();
      if (result.success) {
        setAreas(result.data);
      }
    };
    fetchAreas();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const queryParams = {
        page: filters.page || 1,
        limit: filters.limit || 20,
        ...(filters.category && { category: filters.category }),
        ...(filters.propertyType && { propertyType: filters.propertyType }),
        ...(filters.area && { area: filters.area }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      };

      const result = await propertyService.getProperties(queryParams);
      if (result.success) {
        setProperties(result.data.data);
        setPagination({
          total: result.data.total,
          page: result.data.page,
          limit: result.data.limit,
        });
      }
      setLoading(false);
    };

    fetchProperties();
  }, [filters]);

  return (
    <>
      <SEO
        title="All Property Listings in Abuja"
        description="Browse all verified property listings in Abuja houses, flats, duplexes, and land for rent and sale."
      />

      {/* Header */}
      <section className="bg-gradient-to-b from-gray-light to-white pt-28 pb-10">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary text-sm font-semibold mb-3">
              Browse Properties
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal tracking-tight mb-4">
              Find your ideal home
            </h1>
            <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
              Abuja&apos;s most trusted collection of verified properties. Zero
              hidden fees.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 bg-white">
        <div className="container-main">
          {/* Toolbar */}
          <div className="flex flex-col gap-6 mb-10">
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              showAreaFilter
              areas={areas}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-charcoal">
                  {properties.length}
                </span>{" "}
                of {pagination.total} results
              </p>

              {/* View toggle */}
              <div className="flex items-center gap-1 bg-gray-light p-1 rounded-xl shrink-0 self-start">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
                    viewMode === "grid"
                      ? "bg-white text-charcoal shadow-sm"
                      : "text-gray-400 hover:text-charcoal",
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
                    viewMode === "list"
                      ? "bg-white text-charcoal shadow-sm"
                      : "text-gray-400 hover:text-charcoal",
                  )}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
          ) : properties.length > 0 ? (
            <div
              className={cn(
                "gap-6 md:gap-8",
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid grid-cols-1 max-w-3xl mx-auto",
              )}
            >
              {properties.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-light rounded-2xl">
              <p className="text-charcoal font-bold text-xl mb-3">
                No properties match your filters
              </p>
              <p className="text-gray-500 mb-6">
                Try different criteria or explore other areas.
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
