import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bed, Bath, MapPin, Heart } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatPrice } from "../../lib/utils";
import { favoriteService } from "../../services/favoriteService";
import { useAuth } from "../../context/AuthContext";

export default function PropertyCard({
  property,
  index = 0,
  onFavoriteChange,
  showAdminActions = false,
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isLand = property.propertyType === "Land";
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setLoadingFavorite(true);

      if (isFavorite) {
        await favoriteService.removeFavorite(property.id);
        setIsFavorite(false);
      } else {
        await favoriteService.addFavorite(property.id);
        setIsFavorite(true);
      }

      if (onFavoriteChange) {
        onFavoriteChange(property.id, !isFavorite);
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
    } finally {
      setLoadingFavorite(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        onClick={() => navigate(`/property/${property.slug}`)}
        className="group block bg-white rounded-2xl overflow-hidden no-underline card-hover border border-gray-100/80 cursor-pointer"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {!imgLoaded && <div className="absolute inset-0 img-skeleton" />}
          <img
            src={property.images?.[0]?.url || property.images?.[0]}
            alt={property.title}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top badges */}
          <div className="absolute top-4 left-4">
            <StatusBadge status={property.status} />
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleFavoriteClick}
              disabled={loadingFavorite}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-50 backdrop-blur-md cursor-pointer"
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              style={{
                backgroundColor: isFavorite
                  ? "rgba(239, 68, 68, 0.9)"
                  : "rgba(255, 255, 255, 0.85)",
              }}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? "text-white fill-white" : "text-charcoal"
                }`}
              />
            </button>

            {showAdminActions && (
              <Link
                to={`/admin/edit/${property.id}`}
                className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                title="Edit Property"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </motion.div>
              </Link>
            )}
          </div>

          {/* Category badge */}
          <div className="absolute bottom-4 left-4">
            <span className="bg-white/90 backdrop-blur-md text-charcoal text-xs font-semibold px-3 py-1.5 rounded-lg">
              {property.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 pb-6">
          {/* Price */}
          <div className="flex items-baseline gap-1.5 mb-2">
            <p className="text-charcoal font-bold text-xl tracking-tight">
              {formatPrice(property.price)}
            </p>
            {property.category === "Rent" && (
              <span className="text-gray-400 text-sm">/year</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-charcoal font-semibold text-base mb-3 leading-snug line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="line-clamp-1">
              {property.area?.name || property.area}, {property.city}
            </span>
          </div>

          {/* Specs footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {!isLand ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5" title="Bedrooms">
                  <Bed className="w-4 h-4 text-gray-300" />
                  <span className="font-semibold text-charcoal text-sm">
                    {property.rooms}
                  </span>
                </div>
                <div className="flex items-center gap-1.5" title="Bathrooms">
                  <Bath className="w-4 h-4 text-gray-300" />
                  <span className="font-semibold text-charcoal text-sm">
                    {property.bathrooms}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-sm font-medium text-primary">Land</span>
            )}
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md">
              {property.propertyType}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
