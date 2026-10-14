import { PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

export function VetMark({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md shadow-teal-700/15 ring-2 ring-teal-200",
        className
      )}
    >
      <PawPrint className={cn("h-7 w-7 text-coral-500", iconClassName)} />
    </div>
  );
}
