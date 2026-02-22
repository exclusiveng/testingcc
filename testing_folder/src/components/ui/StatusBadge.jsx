import { cn } from "../../lib/utils";

export default function StatusBadge({ status }) {
  const isAvailable = status === "Available";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg backdrop-blur-md",
        isAvailable
          ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/20"
          : "bg-red-500/15 text-red-500 border border-red-500/20",
      )}
    >
      <span className="relative flex items-center justify-center w-1.5 h-1.5">
        {isAvailable && (
          <span className="absolute w-full h-full rounded-full bg-emerald-400 animate-pulse-dot" />
        )}
        <span
          className={cn(
            "relative w-1.5 h-1.5 rounded-full",
            isAvailable ? "bg-emerald-500" : "bg-red-500",
          )}
        />
      </span>
      {status}
    </span>
  );
}
