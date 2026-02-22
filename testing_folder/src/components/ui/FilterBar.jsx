import { SlidersHorizontal, X as XIcon } from "lucide-react";
import { categories, propertyTypes, priceRanges } from "../../lib/utils";
import Select from "./Select";

export default function FilterBar({
  filters,
  onFilterChange,
  showAreaFilter = false,
  areas = [],
}) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  };

  const handlePriceChange = (value) => {
    const range = priceRanges[parseInt(value)];
    onFilterChange({
      ...filters,
      minPrice: range.min,
      maxPrice: range.max,
    });
  };

  const currentPriceIndex = priceRanges.findIndex(
    (r) =>
      r.min === (filters.minPrice || null) &&
      r.max === (filters.maxPrice || null),
  );

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {/* Filter label */}
      <div className="flex items-center gap-2.5 mb-5">
        <SlidersHorizontal className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-charcoal">
          Filter results
        </span>
        {activeCount > 0 && (
          <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </div>

      {/* Filter selects */}
      <div className="flex flex-wrap items-center gap-3">
        {showAreaFilter && areas.length > 0 && (
          <Select
            value={filters.area || ""}
            onChange={(e) => handleChange("area", e.target.value)}
            options={[
              { value: "", label: "All Areas" },
              ...areas.map((area) => ({ value: area.slug, label: area.name })),
            ]}
            placeholder={null}
            className="w-full md:w-auto min-w-[160px]"
          />
        )}

        <Select
          value={filters.category || ""}
          onChange={(e) => handleChange("category", e.target.value)}
          options={[
            { value: "", label: "All Categories" },
            ...categories.map((cat) => ({ value: cat, label: cat })),
          ]}
          placeholder={null}
          className="w-full md:w-auto min-w-[160px]"
        />

        <Select
          value={filters.propertyType || ""}
          onChange={(e) => handleChange("propertyType", e.target.value)}
          options={[
            { value: "", label: "All Types" },
            ...propertyTypes.map((type) => ({ value: type, label: type })),
          ]}
          placeholder={null}
          className="w-full md:w-auto min-w-[160px]"
        />

        <Select
          value={currentPriceIndex >= 0 ? currentPriceIndex : 0}
          onChange={(e) => handlePriceChange(e.target.value)}
          options={priceRanges.map((range, i) => ({
            value: i,
            label: range.label,
          }))}
          placeholder={null}
          className="w-full md:w-auto min-w-[180px]"
        />

        {/* Clear button */}
        {activeCount > 0 && (
          <button
            onClick={() => onFilterChange({})}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm text-red-500 font-medium cursor-pointer transition-all duration-200 rounded-lg bg-red-50 hover:bg-red-100 h-[42px]"
          >
            <XIcon className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
