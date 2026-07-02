export type UserRole =
  | 'Administrator'
  | 'Fleet Manager'
  | 'Producer'
  | 'Consumer'
  | 'Retailer'
  | 'Restaurant'
  | 'Exporter'
  | 'Quality Inspector'
  | 'Warehouse Manager'
  | 'Delivery Partner';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  companyName?: string;
  certified?: boolean;
  certifiedAt?: string;
  twoFactorEnabled?: boolean;
  createdAt: string;
}

export interface Boat {
  id: string;
  name: string;
  status: 'active' | 'maintenance' | 'docked';
  crewCount: number;
  fuelLevel: number; // percentage
  maintenanceDate: string;
  tripCount: number;
  lat: number;
  lng: number;
  image: string;
  captain: string;
  recentCatchKg?: number;
}

export interface CatchReport {
  id: string;
  boatId: string;
  boatName: string;
  species: string;
  quantity: number; // in kg
  date: string;
  fishingZone: string;
  depth: number; // meters
  freshness: 'optimal' | 'good' | 'warning';
  qualityScore: number; // 0-100
  temperature: number; // °C
  loggedBy: string;
}

export interface Product {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  price: number; // in USD
  unit: string; // e.g. "kg", "lb", "whole"
  category: 'Pelagic' | 'Demersal' | 'Crustacean' | 'Mollusk' | 'Echinoderm' | 'Aquaculture' | 'Value-Added' | 'Fingerlings' | 'Organic';
  image: string;
  sustainabilityScore: number; // 0-100
  origin: string; // e.g. "FAO Zone 27"
  method: string; // e.g. "Line Caught", "Trawl", "Pot"
  nutrients: {
    protein: string;
    fat: string;
    omega3: string;
    calories: number;
  };
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  currentTemp: number; // cold chain temperature
  freshnessStatus: 'prime' | 'excellent' | 'standard';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  trackingStage: 'Ocean' | 'Fishing Boat' | 'Cold Storage' | 'Processing Plant' | 'Packaging' | 'Transport' | 'Warehouse' | 'Retail' | 'Restaurant' | 'Consumer';
  deliveryRoute: string[]; // list of lat,lng checkpoints or cities
  invoiceUrl: string;
}

export interface ColdChainFacility {
  id: string;
  name: string;
  type: 'Storage' | 'Processing' | 'Logistics' | 'Retailer' | 'Warehouse';
  temp: number; // current temperature °C
  minAllowedTemp: number;
  maxAllowedTemp: number;
  status: 'optimal' | 'warning' | 'alert';
  capacity: string; // e.g., "50 Tons"
  usage: number; // percentage
  alerts: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  category: 'Ecosystem' | 'Methods' | 'Cooking' | 'Regulations';
  readTime: string;
  excerpt: string;
  content: string;
  points: number;
  questions: QuizQuestion[];
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'fleet' | 'order' | 'coldchain' | 'system' | 'sustainability';
  isRead: boolean;
  timestamp: string;
}

export interface SustainabilityMetrics {
  environmentalScore: number; // 0-100
  carbonFootprint: number; // kg CO2 per kg seafood
  fishingQuotaUsed: number; // percentage
  wasteReducedKg: number;
  responsibleQuotaProgress: number; // out of 100
}

export type FarmEventCategory =
  | 'feeding'
  | 'water'
  | 'harvest'
  | 'fleet'
  | 'marketplace'
  | 'quality'
  | 'finance'
  | 'research'
  | 'community'
  | 'maintenance'
  | 'weather'
  | 'ai';

export interface FarmEvent {
  id: string;
  timestamp: string; // ISO
  category: FarmEventCategory;
  title: string;
  description: string;
  actor: string; // who/what performed it
  location?: string; // cage, boat, facility
  severity: 'info' | 'success' | 'warning' | 'critical';
}

export interface CageStatus {
  id: string;
  name: string;
  species: string;
  biomassKg: number;
  avgWeightG: number;
  population: number;
  waterTempC: number;
  dissolvedOxygenMgL: number;
  ph: number;
  turbidityNTU: number;
  feedTodayKg: number;
  mortalityToday: number;
  lastInspection: string;
  healthScore: number; // 0-100
}

export interface FarmStatus {
  timestamp: string;
  lakeTempC: number;
  ambientTempC: number;
  dissolvedOxygenMgL: number;
  ph: number;
  turbidityNTU: number;
  windKnots: number;
  weather: 'clear' | 'cloudy' | 'rain' | 'storm';
  timeOfDay: 'morning' | 'midday' | 'afternoon' | 'golden' | 'sunset' | 'night' | 'midnight';
  totalBiomassKg: number;
  totalPopulation: number;
  activeCages: number;
  staffOnDuty: number;
  boatsActive: number;
  pendingOrders: number;
  todayRevenue: number;
  todayFeedKg: number;
  todayMortality: number;
  cages: CageStatus[];
}
