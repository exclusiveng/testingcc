import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, Eye, TrendingUp, Plus } from "lucide-react";
import { formatPrice } from "../../lib/utils";
import PropertyCard from "../../components/ui/PropertyCard";
import { propertyService } from "../../services/propertyService";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Fetch all properties - agent will see only their own
        const response = await propertyService.getProperties({
          page: 1,
          limit: 100,
        });
        setProperties(response.data?.data || response.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError(err.message);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Calculate stats based on the fetched data
  const totalProperties = properties.length;
  const activeListings = properties.filter(
    (p) => p.status === "Available",
  ).length;
  const totalValue = properties
    .filter((p) => p.category === "Sale")
    .reduce((acc, curr) => {
      const price = Number(curr.price);
      return acc + (isNaN(price) ? 0 : price);
    }, 0);

  const stats = [
    {
      label: "Total Properties",
      value: totalProperties,
      icon: Building2,
      color: "bg-blue-500/10",
      textColor: "text-blue-500",
      trend: "All listings",
    },
    {
      label: "Active Listings",
      value: activeListings,
      icon: CheckCircle2,
      color: "bg-success/10",
      textColor: "text-success",
      trend: `${totalProperties > 0 ? Math.round((activeListings / totalProperties) * 100) : 0}% active`,
    },
    {
      label: "Portfolio Value",
      value: "₦" + (totalValue / 1000000).toFixed(1) + "M",
      icon: TrendingUp,
      color: "bg-primary/10",
      textColor: "text-primary",
      trend: "Sales only",
    },
    {
      label: "Rented Listings",
      value: properties.filter((p) => p.category === "Rent").length,
      icon: Eye,
      color: "bg-indigo-500/10",
      textColor: "text-indigo-500",
      trend: "Rental properties",
    },
  ];

  // Get 3 most recent properties
  const recentProperties = [...properties]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error/30 rounded-lg p-6">
        <h3 className="text-error font-semibold mb-2">
          Error loading dashboard
        </h3>
        <p className="text-error/70">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal">
            Dashboard
          </h1>
          <p className="text-gray-text mt-1">
            Welcome back, {user?.firstName ? user.firstName : "Agent"}.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/areas/add"
            className="inline-flex items-center gap-2 bg-charcoal text-white px-5 py-2.5 rounded-lg font-medium hover:bg-black transition-colors shadow-lg shadow-black/10 no-underline"
          >
            <Plus className="w-5 h-5" />
            Add Area
          </Link>
          <Link
            to="/admin/add"
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 no-underline"
          >
            <Plus className="w-5 h-5" />
            Add Property
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-xl border border-gray-mid/40 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <span className="text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-text">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Properties Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-charcoal">Recent Listings</h2>
          <Link
            to="/listings"
            className="text-sm text-primary font-medium hover:text-primary-dark transition-colors no-underline"
          >
            View all listings &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProperties.map((property, i) => (
            <PropertyCard
              key={property.id}
              property={property}
              index={i}
              showAdminActions={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
