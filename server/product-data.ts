interface ServerProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  iconName?: string;
}

let productsCache: ServerProduct[] | null = null;

const pascalToKebab: Record<string, string> = {
  Headphones: "headphones", Shirt: "shirt", Droplets: "droplets", Radio: "radio",
  ShoppingBag: "shopping-bag", Cookie: "cookie", BedDouble: "bed-double",
  Footprints: "footprints", Palette: "palette", Pill: "pill", AlarmClock: "alarm-clock",
  CupSoda: "cup-soda", Mouse: "mouse", Circle: "circle", Glasses: "glasses",
  PenTool: "pen-tool", Flame: "flame", Eye: "eye", Smartphone: "smartphone",
  Laptop: "laptop", Wifi: "wifi", Cpu: "cpu", Monitor: "monitor", Camera: "camera",
  Mic: "mic", Speaker: "speaker", Zap: "zap", Cloud: "cloud", Rocket: "rocket",
  Fingerprint: "fingerprint", Scan: "scan", Lightbulb: "lightbulb", Magnet: "magnet",
  Telescope: "telescope", Brain: "brain", Crown: "crown", Diamond: "diamond",
  Umbrella: "umbrella", Watch: "watch", Feather: "feather", Scissors: "scissors",
  Star: "star", Shield: "shield", Key: "key", Wind: "wind", Snowflake: "snowflake",
  Sun: "sun", Lock: "lock", Gift: "gift", Thermometer: "thermometer", Moon: "moon",
  Compass: "compass", Leaf: "leaf", Apple: "apple", Fish: "fish", Coffee: "coffee",
  Wine: "wine", Cherry: "cherry", Cake: "cake", Pizza: "pizza", Beer: "beer",
  Candy: "candy", Heart: "heart", Sparkles: "sparkles", Sofa: "sofa", Lamp: "lamp",
  Fan: "fan", Bell: "bell", Dog: "dog", Cat: "cat", Mountain: "mountain",
  Music: "music", Wrench: "wrench", Target: "target", Bike: "bike", Wand2: "wand-2",
  Cog: "cog", Flower2: "flower-2", Microscope: "microscope", Bird: "bird", Bug: "bug",
  Guitar: "guitar", Gamepad2: "gamepad-2", Trophy: "trophy", Car: "car", Tent: "tent",
  Package: "package",
};

export async function getProducts(): Promise<ServerProduct[]> {
  if (productsCache) return productsCache;
  const mod = await import("../client/src/lib/products");
  productsCache = mod.products.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    description: p.description,
    category: p.category,
    rating: p.rating,
    reviewCount: p.reviewCount,
    badge: p.badge,
    iconName: pascalToKebab[mod.productIcons[p.id]] || "package",
  }));
  return productsCache!;
}

export async function getProductById(id: string): Promise<ServerProduct | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}
