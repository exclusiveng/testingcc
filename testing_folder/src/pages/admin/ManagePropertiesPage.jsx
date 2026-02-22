import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Building2, AlertCircle, Search } from "lucide-react";
import { propertyService } from "../../services/propertyService";
import PropertyCard from "../../components/ui/PropertyCard";

export default function ManagePropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertyService.getProperties({
          page: 1,
          limit: 100,
        });
        setProperties(response.data?.data || response.data || []);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-text">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal">
            Manage Properties
          </h1>
          <p className="text-gray-text mt-1">
            View, edit, and manage all your real estate listings.
          </p>
        </div>
        <Link
          to="/admin/add"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 no-underline"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </Link>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-error/10 border border-error/30 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-error">Error loading properties</p>
            <p className="text-sm text-error/80">{error}</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-mid/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {filteredProperties.length === 0 && !error ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-mid/40 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-charcoal mb-2">
            No properties found
          </h3>
          <p className="text-gray-text mb-6 max-w-sm mx-auto">
            {searchTerm
              ? "No properties match your search criteria."
              : "You haven't added any properties yet."}
          </p>
          {!searchTerm && (
            <Link
              to="/admin/add"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 no-underline"
            >
              <Plus className="w-5 h-5" />
              Add First Property
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property, i) => (
            <PropertyCard
              key={property.id}
              property={property}
              index={i}
              showAdminActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
