import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getPropertiesByArea } from "../../data/properties";

export default function AreaCard({
  area,
  index = 0,
  showAdminActions = false,
}) {
  const navigate = useNavigate();
  const propertyCount = getPropertiesByArea(area.slug).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        onClick={() => navigate(`/areas/${area.slug}`)}
        className="group block relative overflow-hidden rounded-2xl aspect-[3/4] no-underline cursor-pointer"
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-charcoal">
          <img
            src={area.image}
            alt={`Properties in ${area.name}, Abuja`}
            className="w-full h-full object-cover opacity-80 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-60"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          {/* Property count */}
          <div className="mb-3">
            <span className="bg-primary/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
              {propertyCount} {propertyCount === 1 ? "Property" : "Properties"}
            </span>
          </div>

          <h3 className="text-white text-2xl md:text-3xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors duration-300">
            {area.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/60 font-medium text-sm group-hover:text-white/90 transition-all duration-300">
              Explore area
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>

            {showAdminActions && (
              <Link
                to={`/admin/areas/edit/${area.id}`}
                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 pointer-events-auto"
                title="Edit Area"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
        </div>
      </div>
    </motion.div>
  );
}
