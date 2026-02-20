import {
  Headphones,
  Shirt,
  Droplets,
  Radio,
  ShoppingBag,
  Cookie,
  BedDouble,
  Footprints,
  Palette,
  Pill,
  AlarmClock,
  CupSoda,
  Mouse,
  Circle,
  Glasses,
  PenTool,
  Flame,
  Eye,
  Package,
} from "lucide-react";

const iconMap: Record<string, typeof Headphones> = {
  headphones: Headphones,
  shirt: Shirt,
  droplets: Droplets,
  radio: Radio,
  "shopping-bag": ShoppingBag,
  cookie: Cookie,
  "bed-double": BedDouble,
  footprints: Footprints,
  palette: Palette,
  pill: Pill,
  "alarm-clock": AlarmClock,
  "cup-soda": CupSoda,
  mouse: Mouse,
  circle: Circle,
  glasses: Glasses,
  "pen-tool": PenTool,
  flame: Flame,
  eye: Eye,
};

interface ProductIconProps {
  name: string;
  className?: string;
}

export function ProductIcon({ name, className = "w-12 h-12" }: ProductIconProps) {
  const Icon = iconMap[name] || Package;
  return <Icon className={`${className} text-primary`} />;
}
