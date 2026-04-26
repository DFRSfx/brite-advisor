import { Quadrant } from "@/types/brite";
import { QUADRANT_META } from "@/lib/briteClassifier";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuadrantBadgeProps {
  quadrant: Quadrant;
  size?: "sm" | "md" | "lg";
}

export function QuadrantBadge({ quadrant, size = "md" }: QuadrantBadgeProps) {
  const meta = QUADRANT_META[quadrant];

  return (
    <Badge
      className={cn(
        meta.color,
        "text-white font-semibold",
        size === "sm" && "text-xs px-2 py-0.5",
        size === "md" && "text-sm px-3 py-1",
        size === "lg" && "text-base px-4 py-2"
      )}
    >
      {quadrant} — {meta.label}
    </Badge>
  );
}
