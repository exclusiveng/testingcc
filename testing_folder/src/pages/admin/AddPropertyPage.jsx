import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  X,
  UploadCloud,
} from "lucide-react";
import { areaService } from "../../services/areaService";
import { propertyService } from "../../services/propertyService";
import Select from "../../components/ui/Select";

const propertyTypes = [
  "Flat",
  "Duplex",
  "Self-Contain",
  "Land",
  "Bungalow",
  "Terrace",
];
const categories = ["Rent", "Sale", "Land"];
const status = ["Available", "Unavailable", "Sold"];
const electricityOptions = ["None", "Metered", "Non-Metered"];

export default function AddPropertyPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [loadingProperty, setLoadingProperty] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Rent",
    propertyType: "Flat",
    price: "",
    areaId: "",
    address: "",
    city: "Abuja",
    state: "FCT",
    rooms: "",
    bathrooms: "",
    parking: "",
    water: true,
    electricity: "None",
    description: "",
    featured: false,
    status: "Available",
  });

  const [existingImages, setExistingImages] = useState([]);

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Fetch areas on component mount
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoadingAreas(true);
        const response = await areaService.getAreas();

        if (response.success && response.data) {
          const areasList = Array.isArray(response.data) ? response.data : [];
          setAreas(areasList);

          // Auto-select first area when loaded
          if (areasList.length > 0) {
            setFormData((prev) => ({
              ...prev,
              areaId: areasList[0].id || "",
            }));
          }
        } else {
          console.error("Failed to fetch areas:", response.error);
          setAreas([]);
        }
      } catch (err) {
        console.error("Failed to fetch areas:", err);
        setAreas([]);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, []);

  // Fetch property data if in edit mode
  useEffect(() => {
    const fetchProperty = async () => {
      if (!isEditMode) return;

      try {
        setLoadingProperty(true);
        const response = await propertyService.getPropertyById(id);
        if (response.success) {
          const property = response.data;
          setFormData({
            title: property.title || "",
            category: property.category || "Rent",
            propertyType: property.propertyType || "Flat",
            price: property.price || "",
            areaId: property.areaId || "",
            address: property.address || "",
            city: property.city || "Abuja",
            state: property.state || "FCT",
            rooms: property.rooms || "",
            bathrooms: property.bathrooms || "",
            parking: property.parking || "",
            water: property.water ?? true,
            electricity: property.electricity || "None",
            description: property.description || "",
            featured: property.featured ?? false,
            status: property.status || "Available",
          });
          setExistingImages(property.images || []);
        } else {
          setError(response.error || "Failed to fetch property details");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("An error occurred while fetching property details");
      } finally {
        setLoadingProperty(false);
      }
    };

    fetchProperty();
  }, [id, isEditMode]);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Filter by size (2MB)
    const validFiles = files.filter((file) => file.size <= 2 * 1024 * 1024);
    const oversizedFiles = files.filter((file) => file.size > 2 * 1024 * 1024);

    if (oversizedFiles.length > 0) {
      setError(
        `Some files were skipped because they exceed the 2MB limit: ${oversizedFiles.map((f) => f.name).join(", ")}`,
      );
    }

    if (validFiles.length === 0) return;

    // Create preview URLs
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      // Revoke the URL being removed
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (
      !formData.title ||
      !formData.price ||
      !formData.areaId ||
      !formData.address
    ) {
      setError(
        "Please fill in all required fields (Title, Price, Area, Address)",
      );
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("propertyType", formData.propertyType);
      data.append("price", formData.price);
      data.append("areaId", formData.areaId);
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("state", formData.state);
      data.append("rooms", formData.rooms);
      data.append("bathrooms", formData.bathrooms);
      data.append("parking", formData.parking);
      data.append("water", formData.water.toString());
      data.append("electricity", formData.electricity);
      data.append("description", formData.description);
      data.append("featured", formData.featured.toString());
      data.append("status", formData.status);

      // Append images
      imageFiles.forEach((file) => {
        data.append("images", file);
      });

      // If editing, append existing images to keep
      if (isEditMode) {
        existingImages.forEach((img) => {
          data.append("existingImages", img.url);
        });
      }

      const response = isEditMode
        ? await propertyService.updateProperty(id, data)
        : await propertyService.createProperty(data);

      if (response.success) {
        setSuccess(true);
        if (!isEditMode) {
          // Reset form
          setFormData({
            title: "",
            category: "Rent",
            propertyType: "Flat",
            price: "",
            areaId: areas[0]?.id || "",
            address: "",
            city: "Abuja",
            state: "FCT",
            rooms: "",
            bathrooms: "",
            parking: "",
            water: true,
            electricity: "None",
            description: "",
            featured: false,
            status: "Available",
          });
          setImageFiles([]);
          setPreviews([]);
        }

        // Redirect to dashboard after 2 seconds
        setTimeout(() => navigate("/admin"), 2000);
      } else {
        setError(
          response.error ||
            `Failed to ${isEditMode ? "update" : "create"} property`,
        );
      }
    } catch (err) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} property:`,
        err,
      );
      setError(
        err.message ||
          `An error occurred while ${isEditMode ? "updating" : "creating"} the property`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal">
            {isEditMode ? "Edit Property" : "Add Property"}
          </h1>
          <p className="text-gray-text mt-1">
            {isEditMode
              ? "Update the property listing details."
              : "Create a new listing for the platform."}
          </p>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 flex items-start gap-3 bg-error/10 border border-error/30 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-error">Error</p>
            <p className="text-sm text-error/80">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-start gap-3 bg-success/10 border border-success/30 rounded-lg p-4">
          <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-success">Success</p>
            <p className="text-sm text-success/80">
              Property {isEditMode ? "updated" : "created"} successfully!
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      )}

      {loadingProperty && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-text">Loading property details...</p>
          </div>
        </div>
      )}

      {loadingAreas || (isEditMode && loadingProperty) ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-text">Loading...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="bg-white p-6 rounded-xl border border-gray-mid/40 shadow-sm">
            <h2 className="text-lg font-semibold text-charcoal mb-5 pb-2 border-b border-gray-mid/20">
              Basic Information
            </h2>
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Property Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Luxury 3 Bedroom Flat in Jabi"
                  required
                  className="w-full p-2.5 rounded-lg border border-gray-mid focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>

              {/* Category & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    Category <span className="text-error">*</span>
                  </label>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={categories}
                    placeholder={null}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    Property Type <span className="text-error">*</span>
                  </label>
                  <Select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    options={propertyTypes}
                    placeholder={null}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Price & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    Price (NGN) <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="2500000"
                    required
                    className="w-full p-2.5 rounded-lg border border-gray-mid focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    Area <span className="text-error">*</span>
                  </label>
                  <Select
                    name="areaId"
                    value={formData.areaId}
                    onChange={handleChange}
                    required
                    options={
                      areas?.map((area) => ({
                        value: area.id,
                        label: area.name,
                      })) || []
                    }
                    placeholder="-- Select an Area --"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Address, City, State */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    Full Address <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. 123 Main Street, Jabi"
                    required
                    className="w-full p-2.5 rounded-lg border border-gray-mid focus:border-primary outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">
                      City <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Abuja"
                      required
                      className="w-full p-2.5 rounded-lg border border-gray-mid focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">
                      State <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. FCT"
                      required
                      className="w-full p-2.5 rounded-lg border border-gray-mid focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the property features, surroundings, etc."
                  className="w-full p-2.5 rounded-lg border border-gray-mid focus:border-primary outline-none resize-none"
                />
              </div>
            </div>
          </section>

          {/* Specifications */}
          <section className="bg-white p-6 rounded-xl border border-gray-mid/40 shadow-sm">
            <h2 className="text-lg font-semibold text-charcoal mb-5 pb-2 border-b border-gray-mid/20">
              Specifications
            </h2>
            <div className="grid grid-cols-3 gap-5 mb-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Rooms
                </label>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-gray-mid focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-gray-mid focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Parking
                </label>
                <input
                  type="number"
                  name="parking"
                  value={formData.parking}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-gray-mid focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="water"
                  checked={formData.water}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300 accent-primary"
                />
                <span className="text-sm text-charcoal">Water</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="water"
                  checked={formData.water}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300 accent-primary"
                />
                <span className="text-sm text-charcoal">Water</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Electricity
                </label>
                <Select
                  name="electricity"
                  value={formData.electricity}
                  onChange={handleChange}
                  options={electricityOptions}
                  placeholder={null}
                  className="w-full text-sm"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300 accent-primary"
                />
                <span className="text-sm font-semibold text-primary">
                  Featured
                </span>
              </label>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Status
                </label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={status}
                  placeholder={null}
                  className="w-full text-sm"
                />
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="bg-white p-6 rounded-xl border border-gray-mid/40 shadow-sm">
            <h2 className="text-lg font-semibold text-charcoal mb-5 pb-2 border-b border-gray-mid/20">
              Property Images
            </h2>

            {/* Existing Images (Edit mode) */}
            {isEditMode && existingImages.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-medium text-charcoal mb-3">
                  Existing Images
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {existingImages.map((img, i) => (
                    <div
                      key={img.id || i}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200"
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setExistingImages((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-error hover:bg-error hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div className="mb-6">
              <p className="text-sm font-medium text-charcoal mb-3">
                Upload New Images
              </p>
              <label className="block w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="p-3 rounded-full bg-gray-50 group-hover:bg-white transition-colors">
                  <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-charcoal">
                    Click to upload images
                  </p>
                  <p className="text-xs text-gray-400">
                    SVG, PNG, JPG or GIF (max 2MB each)
                  </p>
                </div>
              </label>
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previews.map((url, i) => (
                  <div
                    key={url}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200"
                  >
                    <img
                      src={url}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-error hover:bg-error hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {i === 0 && (
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                        Cover Image
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {previews.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No images selected yet.
              </div>
            )}
          </section>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Property"
                  : "Create Property"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
