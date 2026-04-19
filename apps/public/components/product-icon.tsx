import { Package } from "lucide-react";
import { iconMap } from "@/lib/icon-registry";

interface ProductIconProps {
  name: string;
  className?: string;
}

export function ProductIcon({ name, className = "w-12 h-12" }: ProductIconProps) {
  const Icon = iconMap[name] || Package;
  return <Icon className={`${className} text-primary`} />;
}
