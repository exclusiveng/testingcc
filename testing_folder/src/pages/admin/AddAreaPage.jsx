import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  UploadCloud,
  X,
} from "lucide-react";
import { areaService } from "../../services/areaService";
import Button from "../../components/ui/Button";

export default function AddAreaPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingArea, setLoadingArea] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (!url.startsWith("http")) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  // Fetch area data if in edit mode
  useEffect(() => {
    const fetchArea = async () => {
      if (!isEditMode) return;

      try {
        setLoadingArea(true);
        const response = await areaService.getAreaById(id);
        if (response.success) {
          const area = response.data;
          setFormData({
            name: area.name || "",
            description: area.description || "",
          });
          if (area.image || area.images) {
            const initialImages =
              area.images || (area.image ? [area.image] : []);
            setExistingImages(initialImages);
          }
        } else {
          setError(response.error || "Failed to fetch area details");
        }
      } catch (err) {
        console.error("Error fetching area:", err);
        setError("An error occurred while fetching area details");
      } finally {
        setLoadingArea(false);
      }
    };

    fetchArea();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name) {
      setError("Please fill in the required name field.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);

      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          data.append("images", file);
        });
      }

      if (isEditMode && existingImages.length > 0) {
        existingImages.forEach((img) => {
          data.append("existingImages", img);
        });
      }

      const response = isEditMode
        ? await areaService.updateArea(id, data)
        : await areaService.createArea(data);

      if (response.success) {
        setSuccess(true);
        if (!isEditMode) {
          // Reset form
          setFormData({
            name: "",
            description: "",
          });
          setImageFiles([]);
          setPreviews([]);
          setExistingImages([]);
        }
        // Redirect to dashboard after 2 seconds
        setTimeout(() => navigate("/admin"), 2000);
      } else {
        setError(
          response.error ||
            `Failed to ${isEditMode ? "update" : "create"} area`,
        );
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} area:`, err);
      setError(
        err.message ||
          `An error occurred while ${isEditMode ? "updating" : "creating"} the area`,
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
            {isEditMode ? "Edit Area" : "Add New Area"}
          </h1>
          <p className="text-gray-text mt-1">
            {isEditMode
              ? "Update the area details and cover image."
              : "Create a new location for property listings."}
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
              Area {isEditMode ? "updated" : "created"} successfully!
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      )}

      {loadingArea && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-text">Loading area details...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white p-6 rounded-xl border border-gray-mid/40 shadow-sm">
          <h2 className="text-lg font-semibold text-charcoal mb-5 pb-2 border-b border-gray-mid/20">
            Area Details
          </h2>
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Area Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Maitama"
                required
                className="w-full p-2.5 rounded-lg border border-gray-mid focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
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
                placeholder="Briefly describe the area (amenities, vibe, etc.)"
                className="w-full p-2.5 rounded-lg border border-gray-mid focus:border-primary outline-none resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Area Images
              </label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Existing Images
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {existingImages.map((img, i) => (
                      <div
                        key={i}
                        className="relative h-32 rounded-lg overflow-hidden border border-gray-200 group"
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(i)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-error opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                    Max 5 images, SVG, PNG, JPG or GIF (max 2MB each)
                  </p>
                </div>
              </label>

              {/* New Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {previews.map((url, i) => (
                    <div
                      key={url}
                      className="relative h-32 rounded-lg overflow-hidden border border-gray-200 group"
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-error opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
                ? "Update Area"
                : "Create Area"}
          </button>
        </div>
      </form>
    </div>
  );
}
