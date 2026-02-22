import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Bed,
  Bath,
  Car,
  Zap,
  MapPin,
  MessageCircle,
  X,
} from "lucide-react";
import SEO from "../components/layout/SEO";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";
import { propertyService } from "../services/propertyService";
import {
  formatPrice,
  generateWhatsAppLink,
  WHATSAPP_AGENTS,
} from "../lib/utils";

export default function PropertyPage() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      const result = await propertyService.getPropertyBySlug(slug);
      if (result.success) {
        setProperty(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchProperty();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!property || error) {
    return (
      <div className="container-main py-32 text-center">
        <h1 className="text-2xl font-bold text-charcoal mb-3">
          Property Not Found
        </h1>
        <p className="text-gray-500 mb-6">
          This property doesn&apos;t exist or has been removed.
        </p>
        <Link
          to="/listings"
          className="text-primary font-semibold no-underline hover:text-primary-dark"
        >
          Browse all listings
        </Link>
      </div>
    );
  }

  const isLand = property.propertyType === "Land";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `https://360urban.ng/property/${property.slug}`,
    image: property.images?.map((img) => img.url) || [],
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "NGN",
      availability:
        property.status === "Available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.area?.name || property.area,
      addressRegion: property.state,
      addressCountry: "NG",
    },
  };

  const images = property.images?.map((img) => img.url) || [];
  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <SEO
        title={`${property.title} — ${formatPrice(property.price)}`}
        description={property.description}
        image={images[0]}
        jsonLd={jsonLd}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 pt-20">
        <div className="container-main py-4">
          <nav
            className="flex items-center gap-2 text-sm text-gray-400"
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
              to={`/areas/${property.area?.slug}`}
              className="no-underline text-gray-400 hover:text-charcoal transition-colors"
            >
              {property.area?.name || "Area"}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-charcoal font-medium truncate max-w-48">
              {property.title}
            </span>
          </nav>
        </div>
      </div>

      <section className="py-10 bg-white">
        <div className="container-main">
          {/* Title & Price Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <StatusBadge status={property.status} />
                <span className="bg-charcoal text-white text-xs font-medium px-3 py-1.5 rounded-lg">
                  For {property.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight mb-3">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4 text-primary" />
                <span>
                  {property.area?.name || property.area}, {property.city}
                </span>
              </div>
            </div>
            <div className="bg-gray-light p-6 rounded-2xl border border-gray-100 shrink-0">
              <p className="text-xs text-gray-400 font-medium mb-1">Price</p>
              <p className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
                {formatPrice(property.price)}
                {property.category === "Rent" && (
                  <span className="text-gray-400 text-lg ml-1">/year</span>
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left column: gallery + details */}
            <div className="lg:col-span-8">
              {/* Gallery */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                {/* Main Image */}
                <div
                  className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-md mb-4 group cursor-pointer"
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={images[activeImage]}
                    alt={`${property.title} - Image ${activeImage + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white transition-all shadow-md cursor-pointer"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5 text-charcoal" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white transition-all shadow-md cursor-pointer"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5 text-charcoal" />
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-4 right-4 bg-charcoal/80 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-lg">
                    {activeImage + 1} / {images.length}
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`shrink-0 w-20 h-14 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                          i === activeImage
                            ? "border-primary shadow-md"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {!isLand && (
                  <>
                    <div className="bg-gray-light p-5 rounded-xl">
                      <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center mb-3">
                        <Bed className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">
                        Bedrooms
                      </p>
                      <p className="text-xl font-bold text-charcoal">
                        {property.rooms}
                      </p>
                    </div>
                    <div className="bg-gray-light p-5 rounded-xl">
                      <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center mb-3">
                        <Bath className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">
                        Bathrooms
                      </p>
                      <p className="text-xl font-bold text-charcoal">
                        {property.bathrooms}
                      </p>
                    </div>
                    <div className="bg-gray-light p-5 rounded-xl">
                      <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center mb-3">
                        <Car className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">
                        Parking
                      </p>
                      <p className="text-xl font-bold text-charcoal">
                        {property.parking}
                      </p>
                    </div>
                    <div className="bg-gray-light p-5 rounded-xl">
                      <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center mb-3">
                        <Zap className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">
                        Electricity
                      </p>
                      <p className="text-xl font-bold text-charcoal">
                        {property.electricity || "None"}
                      </p>
                    </div>
                  </>
                )}
                {isLand && (
                  <div className="col-span-4 bg-primary/5 p-6 rounded-xl border border-primary/15 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-primary font-semibold mb-1">
                        Land Property
                      </p>
                      <p className="text-xl font-bold text-charcoal">
                        Verified plot
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-charcoal mb-4">
                  About this property
                </h2>
                <div className="text-gray-500 leading-relaxed whitespace-pre-line">
                  {property.description}
                </div>
              </motion.div>
            </div>

            {/* Right column: inquiry */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:sticky lg:top-28"
              >
                {/* Inquiry card */}
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-md">
                  <div className="space-y-4">
                    {WHATSAPP_AGENTS.map((agent) => (
                      <Button
                        key={agent.id}
                        variant="whatsapp"
                        size="lg"
                        href={generateWhatsAppLink(
                          property.title,
                          property.area,
                          agent.number,
                        )}
                        className="w-full"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Chat with {agent.name}
                      </Button>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 text-center mt-5">
                    Response time: Usually within 2 hours
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="relative max-w-4xl w-full aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[activeImage]}
                alt={property.title}
                className="w-full h-full object-contain"
              />
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
