import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, MapPin, AlertCircle } from "lucide-react";
import { areaService } from "../../services/areaService";
import AreaCard from "../../components/ui/AreaCard";

export default function ManageAreasPage() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        const response = await areaService.getAreas();
        if (response.success) {
          setAreas(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        console.error("Failed to fetch areas:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-text">Loading areas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal">
            Manage Areas
          </h1>
          <p className="text-gray-text mt-1">
            View and edit all property listing locations.
          </p>
        </div>
        <Link
          to="/admin/areas/add"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 no-underline"
        >
          <Plus className="w-5 h-5" />
          Add Area
        </Link>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-error/10 border border-error/30 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-error">Error loading areas</p>
            <p className="text-sm text-error/80">{error}</p>
          </div>
        </div>
      )}

      {areas.length === 0 && !error ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-mid/40 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-charcoal mb-2">
            No areas found
          </h3>
          <p className="text-gray-text mb-6 max-w-sm mx-auto">
            You haven't created any areas yet. Start by adding a new location.
          </p>
          <Link
            to="/admin/areas/add"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 no-underline"
          >
            <Plus className="w-5 h-5" />
            Add First Area
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {areas.map((area, i) => (
            <AreaCard
              key={area.id}
              area={area}
              index={i}
              showAdminActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
