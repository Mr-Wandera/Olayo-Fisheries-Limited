import fs from 'fs';
import path from 'path';
import { Boat, CatchReport, Product, Order, ColdChainFacility, Lesson, Notification, SustainabilityMetrics, UserProfile, FarmEvent, FarmStatus } from './types';
import { backfillEvents, computeFarmStatus, generateEvent } from './simulation/farmEngine';

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

interface DatabaseSchema {
  users: UserProfile[];
  boats: Boat[];
  catchReports: CatchReport[];
  products: Product[];
  orders: Order[];
  facilities: ColdChainFacility[];
  lessons: Lesson[];
  notifications: Notification[];
  sustainability: SustainabilityMetrics;
  farmEvents: FarmEvent[];
}

// Initial seed data — consistent Ugandan Lake Victoria cage aquaculture identity
const initialData: DatabaseSchema = {
  users: [
    {
      id: 'usr_admin',
      email: 'admin@olayo.com',
      name: 'Dr. Abdul Wandera',
      role: 'Administrator',
      phone: '+256 700 123 456',
      companyName: 'Olayo Fisheries Limited',
      certified: true,
      certifiedAt: '2026-01-15T09:00:00Z',
      twoFactorEnabled: true,
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'usr_warden',
      email: 'warden@olayo.com',
      name: 'Marcus Vance',
      role: 'Fleet Manager',
      phone: '+256 772 345 678',
      companyName: 'Olayo Cage Operations',
      certified: true,
      certifiedAt: '2026-02-10T11:30:00Z',
      createdAt: '2026-01-10T00:00:00Z',
    },
    {
      id: 'usr_vet',
      email: 'vet@olayo.com',
      name: 'Dr. Amina Nakato',
      role: 'Quality Inspector',
      phone: '+256 701 902 114',
      companyName: 'Olayo Veterinary Lab',
      certified: true,
      certifiedAt: '2026-03-01T14:20:00Z',
      createdAt: '2026-01-12T00:00:00Z',
    },
    {
      id: 'usr_cons',
      email: 'consumer@olayo.com',
      name: 'Sarah Jenkins',
      role: 'Consumer',
      phone: '+256 758 019 283',
      createdAt: '2026-04-01T00:00:00Z',
    },
    {
      id: 'usr_retail',
      email: 'retailer@olayo.com',
      name: 'Joel Wandera',
      role: 'Retailer',
      phone: '+256 772 555 901',
      companyName: 'Busia Fresh Market',
      createdAt: '2026-04-15T00:00:00Z',
    },
    {
      id: 'usr_rest',
      email: 'restaurant@olayo.com',
      name: 'Grace Akello',
      role: 'Restaurant',
      phone: '+256 700 444 221',
      companyName: 'Nile Catch Kitchen',
      createdAt: '2026-05-01T00:00:00Z',
    },
  ],
  boats: [
    {
      id: 'boat_01',
      name: 'MV Nyanza',
      status: 'active',
      crewCount: 4,
      fuelLevel: 82,
      maintenanceDate: '2026-08-15',
      tripCount: 47,
      lat: 0.434,
      lng: 33.612,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400',
      captain: 'Marcus Vance',
      recentCatchKg: 0,
    },
    {
      id: 'boat_02',
      name: 'MV Busiime Star',
      status: 'active',
      crewCount: 3,
      fuelLevel: 64,
      maintenanceDate: '2026-07-28',
      tripCount: 38,
      lat: 0.451,
      lng: 33.598,
      image: 'https://images.unsplash.com/photo-1505244760054-0255a24172e8?auto=format&fit=crop&q=80&w=400',
      captain: 'Samuel Okello',
      recentCatchKg: 0,
    },
    {
      id: 'boat_03',
      name: 'MV Victoria Pride',
      status: 'maintenance',
      crewCount: 5,
      fuelLevel: 10,
      maintenanceDate: '2026-07-05',
      tripCount: 114,
      lat: 0.428,
      lng: 33.620,
      image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&q=80&w=400',
      captain: 'Mary Atimang',
      recentCatchKg: 0,
    },
    {
      id: 'boat_04',
      name: 'MV Tilapia Express',
      status: 'docked',
      crewCount: 2,
      fuelLevel: 98,
      maintenanceDate: '2026-09-01',
      tripCount: 22,
      lat: 0.440,
      lng: 33.605,
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=400',
      captain: 'Joel Wandera',
      recentCatchKg: 0,
    },
  ],
  catchReports: [
    {
      id: 'catch_01',
      boatId: 'boat_01',
      boatName: 'MV Nyanza',
      species: 'Nile Tilapia',
      quantity: 480,
      date: '2026-06-29T10:30:00Z',
      fishingZone: 'Cage Alpha Grid, Busiime',
      depth: 6,
      freshness: 'optimal',
      qualityScore: 96,
      temperature: 1.2,
      loggedBy: 'Marcus Vance',
    },
    {
      id: 'catch_02',
      boatId: 'boat_02',
      boatName: 'MV Busiime Star',
      species: 'Nile Perch',
      quantity: 320,
      date: '2026-06-30T06:15:00Z',
      fishingZone: 'Cage Beta Grid, Busiime',
      depth: 8,
      freshness: 'optimal',
      qualityScore: 92,
      temperature: 0.8,
      loggedBy: 'Samuel Okello',
    },
    {
      id: 'catch_03',
      boatId: 'boat_04',
      boatName: 'MV Tilapia Express',
      species: 'African Catfish',
      quantity: 210,
      date: '2026-06-28T16:45:00Z',
      fishingZone: 'Cage Gamma Grid, Busiime',
      depth: 5,
      freshness: 'good',
      qualityScore: 89,
      temperature: 1.5,
      loggedBy: 'Joel Wandera',
    },
  ],
  products: [
    {
      id: 'prod_01',
      name: 'Premium Nile Tilapia (Whole)',
      scientificName: 'Oreochromis niloticus',
      description: 'Grown sustainably in deep floating cages on Lake Victoria (Busiime, Busia District). Pristine sweet flavor, firm white meat, rich in amino acids and harvested daily to order.',
      price: 5.80,
      unit: 'kg',
      category: 'Aquaculture',
      image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=600',
      sustainabilityScore: 98,
      origin: 'Lake Victoria Cages, Busiime',
      method: 'Cage Aquaculture',
      nutrients: { protein: '20.1g', fat: '1.7g', omega3: '0.6g', calories: 96 },
      availability: 'in-stock',
      currentTemp: 1.2,
      freshnessStatus: 'prime',
    },
    {
      id: 'prod_02',
      name: 'Nile Perch Fillets (Skinless)',
      scientificName: 'Lates niloticus',
      description: 'Fleshy, premium skinless Nile Perch fillets harvested from Lake Victoria deep-water cages. Mild taste, firm texture, thick white flakes perfect for grilling.',
      price: 12.50,
      unit: 'kg',
      category: 'Aquaculture',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
      sustainabilityScore: 94,
      origin: 'Lake Victoria Cages, Busiime',
      method: 'Cage Aquaculture',
      nutrients: { protein: '19.6g', fat: '2.1g', omega3: '0.8g', calories: 104 },
      availability: 'in-stock',
      currentTemp: 0.8,
      freshnessStatus: 'prime',
    },
    {
      id: 'prod_03',
      name: 'African Catfish (Whole Fresh)',
      scientificName: 'Clarias gariepinus',
      description: 'Sustainably farmed in deep-water cages in Busiime. High-density protein, robust texture, and rich traditional flavor ideal for stews and smoking.',
      price: 6.50,
      unit: 'kg',
      category: 'Aquaculture',
      image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&q=80&w=400',
      sustainabilityScore: 96,
      origin: 'Busiime Cage Site, Uganda',
      method: 'Cage Aquaculture',
      nutrients: { protein: '18.5g', fat: '4.2g', omega3: '0.4g', calories: 112 },
      availability: 'in-stock',
      currentTemp: 1.5,
      freshnessStatus: 'excellent',
    },
    {
      id: 'prod_04',
      name: 'Aromatic Smoked Nile Tilapia',
      scientificName: 'Oreochromis niloticus',
      description: 'Fresh cage tilapia cured with natural salts and hot-smoked using seasoned local fruitwood. Deeply golden skin and incredibly rich, smoky flavor.',
      price: 9.80,
      unit: 'whole',
      category: 'Value-Added',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400',
      sustainabilityScore: 97,
      origin: 'Olayo Processing Hub, Busia',
      method: 'Woodsmoke Kiln Cured',
      nutrients: { protein: '24.2g', fat: '3.1g', omega3: '0.9g', calories: 128 },
      availability: 'in-stock',
      currentTemp: 4.0,
      freshnessStatus: 'prime',
    },
    {
      id: 'prod_05',
      name: 'High-Survival Nile Tilapia Fingerlings',
      scientificName: 'Oreochromis niloticus',
      description: 'Vigorous, health-certified all-male Nile Tilapia fingerlings (average weight 5g). Specially conditioned in our Busiime nursery for excellent survival rates.',
      price: 0.15,
      unit: 'whole',
      category: 'Fingerlings',
      image: 'https://images.unsplash.com/photo-1505244760054-0255a24172e8?auto=format&fit=crop&q=80&w=400',
      sustainabilityScore: 99,
      origin: 'Olayo Busia Hatchery',
      method: 'Controlled Spawning',
      nutrients: { protein: '0g', fat: '0g', omega3: '0g', calories: 0 },
      availability: 'in-stock',
      currentTemp: 22.0,
      freshnessStatus: 'prime',
    },
    {
      id: 'prod_06',
      name: 'Premium High-Protein Floating Feed',
      scientificName: 'Aquaculture Feed Grade',
      description: 'Balanced extruded organic fish feed pellets. Formulated with sustainable insects and microalgae (38% crude protein) to ensure rapid fish growth.',
      price: 1.60,
      unit: 'kg',
      category: 'Organic',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=400',
      sustainabilityScore: 100,
      origin: 'Olayo Feed Mill, Busia',
      method: 'Extrusion Milling',
      nutrients: { protein: '38.0g', fat: '6.5g', omega3: '1.5g', calories: 320 },
      availability: 'in-stock',
      currentTemp: 20.0,
      freshnessStatus: 'prime',
    },
    {
      id: 'prod_07',
      name: 'Organic Liquid Fish Fertilizer',
      scientificName: 'NPK Liquid Fertilizer',
      description: 'All-natural cold-processed liquid fish hydrolysate. Packed with trace minerals, amino acids, and nutrients from sustainable processing bi-products.',
      price: 3.50,
      unit: 'litre',
      category: 'Organic',
      image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&q=80&w=600',
      sustainabilityScore: 100,
      origin: 'Olayo Recycler, Busiime',
      method: 'Enzymatic Hydrolysis',
      nutrients: { protein: '0g', fat: '0g', omega3: '0g', calories: 0 },
      availability: 'in-stock',
      currentTemp: 18.0,
      freshnessStatus: 'prime',
    },
  ],
  orders: [
    {
      id: 'ord_1001',
      userId: 'usr_retail',
      userName: 'Joel Wandera',
      items: [
        {
          product: {
            id: 'prod_01',
            name: 'Premium Nile Tilapia (Whole)',
            scientificName: 'Oreochromis niloticus',
            description: 'Grown sustainably in deep floating cages on Lake Victoria.',
            price: 5.80,
            unit: 'kg',
            category: 'Aquaculture',
            image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=600',
            sustainabilityScore: 98,
            origin: 'Lake Victoria Cages, Busiime',
            method: 'Cage Aquaculture',
            nutrients: { protein: '20.1g', fat: '1.7g', omega3: '0.6g', calories: 96 },
            availability: 'in-stock',
            currentTemp: 1.2,
            freshnessStatus: 'prime'
          },
          quantity: 80
        },
        {
          product: {
            id: 'prod_02',
            name: 'Nile Perch Fillets (Skinless)',
            scientificName: 'Lates niloticus',
            description: 'Fleshy, premium skinless Nile Perch fillets.',
            price: 12.50,
            unit: 'kg',
            category: 'Aquaculture',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
            sustainabilityScore: 94,
            origin: 'Lake Victoria Cages, Busiime',
            method: 'Cage Aquaculture',
            nutrients: { protein: '19.6g', fat: '2.1g', omega3: '0.8g', calories: 104 },
            availability: 'in-stock',
            currentTemp: 0.8,
            freshnessStatus: 'prime'
          },
          quantity: 30
        }
      ],
      total: 839.0,
      status: 'shipped',
      date: '2026-06-30T11:00:00Z',
      trackingStage: 'Transport',
      deliveryRoute: ['Busiime Cage Grid', 'Busia Processing Hub', 'Kampala Cold Storage', 'Busia Fresh Market'],
      invoiceUrl: '/api/orders/invoice/ord_1001',
    }
  ],
  facilities: [
    {
      id: 'fac_01',
      name: 'Busia Processing Hub Cold Store',
      type: 'Storage',
      temp: 1.2,
      minAllowedTemp: -2,
      maxAllowedTemp: 4,
      status: 'optimal',
      capacity: '8 Tons',
      usage: 74,
      alerts: [],
    },
    {
      id: 'fac_02',
      name: 'Kampala Distribution Chiller',
      type: 'Logistics',
      temp: 6.5,
      minAllowedTemp: -2,
      maxAllowedTemp: 4,
      status: 'alert',
      capacity: '4 Tons',
      usage: 85,
      alerts: ['Temperature above 4°C threshold. Inspect chiller unit and door seal immediately.'],
    },
    {
      id: 'fac_03',
      name: 'Busiime Hatchery Nursery',
      type: 'Processing',
      temp: 26.0,
      minAllowedTemp: 22,
      maxAllowedTemp: 28,
      status: 'optimal',
      capacity: '120,000 fingerlings',
      usage: 42,
      alerts: [],
    },
    {
      id: 'fac_04',
      name: 'Busia Feed Mill Silo',
      type: 'Warehouse',
      temp: 20.0,
      minAllowedTemp: 15,
      maxAllowedTemp: 25,
      status: 'optimal',
      capacity: '40 Tons',
      usage: 61,
      alerts: [],
    }
  ],
  lessons: [
    {
      id: 'les_01',
      title: 'Cage Aquaculture Fundamentals: Why Floating Cages on Lake Victoria',
      category: 'Methods',
      readTime: '4 mins',
      excerpt: 'Understand the science behind deep-water floating cage aquaculture and why it produces healthier fish than pond farming.',
      content: `Floating cage aquaculture positions fish in deep, well-oxygenated open water where continuous currents carry away waste and deliver fresh oxygen. On Lake Victoria, Olayo Fisheries operates cages in 6-10 meter deep water off Busiime, ensuring fish grow in conditions close to their natural habitat.

Unlike static ponds where waste accumulates and oxygen depletes, cages benefit from natural water exchange. This reduces disease pressure, eliminates the need for antibiotics, and produces firmer, cleaner-tasting fish with higher survival rates.

Our cages use zero-plastic HDPE floating grids and are spaced to allow water flow between them, preventing localized nutrient buildup and protecting the lake ecosystem.`,
      points: 100,
      questions: [
        {
          id: 'les_01_q1',
          question: 'Why are floating cages healthier than static ponds for fish growth?',
          options: [
            'They use more antibiotics',
            'Natural water exchange carries away waste and delivers oxygen',
            'They keep fish warmer',
            'They prevent sunlight reaching the fish'
          ],
          correctIndex: 1,
        },
        {
          id: 'les_01_q2',
          question: 'What depth does Olayo operate its cages at on Lake Victoria?',
          options: ['1-2 meters', '6-10 meters', '20-30 meters', '50+ meters'],
          correctIndex: 1,
        }
      ]
    },
    {
      id: 'les_02',
      title: 'Water Quality: Dissolved Oxygen, pH, and Turbidity',
      category: 'Ecosystem',
      readTime: '5 mins',
      excerpt: 'Learn the three critical water parameters that determine fish health and how Olayo monitors them with IoT sensors.',
      content: `Dissolved oxygen (DO) is the single most important water parameter in aquaculture. Tilapia and perch thrive at 5-8 mg/L. Below 4 mg/L, fish stop feeding and become stressed; below 2 mg/L, mortality begins. Olayo's SatLink IoT buoys measure DO every 15 minutes and trigger aeration when levels drop.

pH measures acidity. Lake Victoria's natural pH sits around 7.0-8.5. Below 6.5, fish gills irritate and growth slows. Above 9.5, ammonia becomes toxic. Our sensors alert the veterinary team if pH drifts outside 6.5-8.5.

Turbidity (cloudiness) spikes after heavy rain as runoff carries soil into the lake. High turbidity blocks sunlight, reducing the phytoplankton that feeds the food web, and can clog fish gills. We monitor turbidity and adjust feeding during runoff events.`,
      points: 120,
      questions: [
        {
          id: 'les_02_q1',
          question: 'At what dissolved oxygen level does fish mortality begin?',
          options: ['Below 8 mg/L', 'Below 4 mg/L', 'Below 2 mg/L', 'Below 10 mg/L'],
          correctIndex: 2,
        },
        {
          id: 'les_02_q2',
          question: 'What causes turbidity spikes near cage farms?',
          options: [
            'Fish excrement only',
            'Soil runoff after heavy rain',
            'Excessive feeding',
            'Sunlight reflection'
          ],
          correctIndex: 1,
        }
      ]
    },
    {
      id: 'les_03',
      title: 'The Cold Chain: Preserving Freshness from Cage to Market',
      category: 'Cooking',
      readTime: '3 mins',
      excerpt: 'Why maintaining 0-4°C from harvest to market is non-negotiable for premium aquaculture products.',
      content: `Fresh fish begins degrading the moment it leaves water. Enzymes break down muscle, and bacteria multiply rapidly above 4°C. To preserve the firm texture and clean flavor Olayo customers expect, fish must move from cage to chilled storage within 30 minutes.

Our cold chain maintains 0-4°C from the Busia Processing Hub through refrigerated transport to Kampala and beyond. Unlike deep-frozen seafood (which forms ice crystals that rupture cells), fresh-chilled fish retains its premium texture for 5-7 days.

Every batch carries a QR-tracked temperature log. If the chain breaks even briefly, the system flags the batch for downgrading — protecting both quality and customer trust.`,
      points: 80,
      questions: [
        {
          id: 'les_03_q1',
          question: 'What temperature range does Olayo maintain for fresh-chilled fish?',
          options: ['-18°C to -10°C', '0°C to 4°C', '10°C to 15°C', 'Frozen solid'],
          correctIndex: 1,
        },
        {
          id: 'les_03_q2',
          question: 'Why is fresh-chilled preferred over deep-frozen for premium fish?',
          options: [
            'It is cheaper',
            'Freezing forms ice crystals that rupture cells and ruin texture',
            'Frozen fish lasts too long',
            'Chilled fish has more bacteria'
          ],
          correctIndex: 1,
        }
      ]
    }
  ],
  notifications: [
    {
      id: 'not_01',
      title: 'Cold Chain Alert',
      description: 'Kampala Distribution Chiller has risen to 6.5°C. Inspect chiller unit and door seal immediately!',
      type: 'coldchain',
      isRead: false,
      timestamp: '2026-07-01T00:15:00Z',
    },
    {
      id: 'not_02',
      title: 'Feeding Round Completed',
      description: 'Morning feeding across all 6 cages completed. 312.4 kg of floating feed distributed. FCR holding at 1.32.',
      type: 'fleet',
      isRead: false,
      timestamp: '2026-06-30T22:40:00Z',
    },
    {
      id: 'not_03',
      title: 'Outgrower Visit Completed',
      description: 'Dr. Wandera conducted site visit with 3 outgrower farmers in Busia. Fingerling survival rates reviewed.',
      type: 'sustainability',
      isRead: true,
      timestamp: '2026-06-29T18:10:00Z',
    }
  ],
  sustainability: {
    environmentalScore: 78,
    carbonFootprint: 1.82,
    fishingQuotaUsed: 62.4,
    wasteReducedKg: 4250,
    responsibleQuotaProgress: 75,
  },
  farmEvents: []
};

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = initialData;
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log('Database loaded successfully from file.');
      } else {
        this.save();
        console.log('Database file not found. Seeding initial data.');
      }
    } catch (e) {
      console.error('Error loading database, using default seeds:', e);
    }
  }

  private save() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save database file:', e);
    }
  }

  // Getters
  getUsers(): UserProfile[] { return this.data.users; }
  getBoats(): Boat[] { return this.data.boats; }
  getCatchReports(): CatchReport[] { return this.data.catchReports; }
  getProducts(): Product[] { return this.data.products; }
  getOrders(): Order[] { return this.data.orders; }
  getFacilities(): ColdChainFacility[] { return this.data.facilities; }
  getLessons(): Lesson[] { return this.data.lessons; }
  getNotifications(): Notification[] { return this.data.notifications; }
  getSustainability(): SustainabilityMetrics { return this.data.sustainability; }

  // Setters/Mutations
  addUser(user: UserProfile) {
    this.data.users.push(user);
    this.save();
  }

  updateUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const idx = this.data.users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  updateBoat(boatId: string, updates: Partial<Boat>): Boat | null {
    const idx = this.data.boats.findIndex(b => b.id === boatId);
    if (idx === -1) return null;
    this.data.boats[idx] = { ...this.data.boats[idx], ...updates };
    this.save();
    return this.data.boats[idx];
  }

  addCatchReport(report: CatchReport) {
    this.data.catchReports.unshift(report);
    
    // Update matching boat with catch totals
    const boat = this.data.boats.find(b => b.id === report.boatId);
    if (boat) {
      boat.recentCatchKg = (boat.recentCatchKg || 0) + report.quantity;
      boat.tripCount += 1;
      this.updateBoat(boat.id, boat);
    }
    
    // Impact sustainability slightly
    this.data.sustainability.fishingQuotaUsed = Math.min(100, this.data.sustainability.fishingQuotaUsed + (report.quantity / 20000) * 100);
    this.data.sustainability.responsibleQuotaProgress = Math.min(100, this.data.sustainability.responsibleQuotaProgress + 1);
    
    this.addNotification({
      id: 'not_' + Date.now(),
      title: 'New Catch Logged',
      description: `${report.species} harvest (${report.quantity}kg) logged from Zone ${report.fishingZone} by ${report.boatName}. Quality score: ${report.qualityScore}%.`,
      type: 'fleet',
      isRead: false,
      timestamp: new Date().toISOString()
    });

    this.save();
  }

  addProduct(prod: Product) {
    this.data.products.unshift(prod);
    this.save();
  }

  updateProduct(prodId: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === prodId);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.save();
    return this.data.products[idx];
  }

  addOrder(order: Order) {
    this.data.orders.unshift(order);
    
    // Subtract from product stock
    order.items.forEach(item => {
      const prod = this.data.products.find(p => p.id === item.product.id);
      if (prod) {
        if (prod.availability === 'in-stock') {
          prod.availability = 'low-stock';
        } else if (prod.availability === 'low-stock') {
          prod.availability = 'out-of-stock';
        }
      }
    });

    // Update carbon footprint metrics
    this.data.sustainability.wasteReducedKg += Math.floor(order.total / 100);
    this.data.sustainability.environmentalScore = Math.min(100, this.data.sustainability.environmentalScore + 0.5);

    this.addNotification({
      id: 'not_' + Date.now(),
      title: 'New Purchase Order',
      description: `Order ${order.id} placed for $${order.total.toFixed(2)} by ${order.userName}. Route visualization generated.`,
      type: 'order',
      isRead: false,
      timestamp: new Date().toISOString()
    });

    this.save();
  }

  updateOrderStage(orderId: string, stage: Order['trackingStage'], status?: Order['status']): Order | null {
    const idx = this.data.orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;
    this.data.orders[idx].trackingStage = stage;
    if (status) {
      this.data.orders[idx].status = status;
    }
    this.save();
    return this.data.orders[idx];
  }

  updateFacilityTemp(facilityId: string, temp: number): ColdChainFacility | null {
    const idx = this.data.facilities.findIndex(f => f.id === facilityId);
    if (idx === -1) return null;
    const fac = this.data.facilities[idx];
    fac.temp = temp;
    
    // Check ranges
    if (temp < fac.minAllowedTemp || temp > fac.maxAllowedTemp) {
      fac.status = 'alert';
      fac.alerts = [`Temperature bounds breached: currently ${temp.toFixed(1)}°C (Allowed: ${fac.minAllowedTemp}°C to ${fac.maxAllowedTemp}°C).`];
      
      this.addNotification({
        id: 'not_' + Date.now(),
        title: 'Cold Chain Warning',
        description: `Alert: Temperature bounds breached at ${fac.name}. Live sensor reads ${temp.toFixed(1)}°C.`,
        type: 'coldchain',
        isRead: false,
        timestamp: new Date().toISOString()
      });
    } else if (temp > fac.maxAllowedTemp - 2) {
      fac.status = 'warning';
      fac.alerts = [`Warning: Temperature approaching threshold: ${temp.toFixed(1)}°C.`];
    } else {
      fac.status = 'optimal';
      fac.alerts = [];
    }
    
    this.save();
    return fac;
  }

  addNotification(not: Notification) {
    this.data.notifications.unshift(not);
    // limit to 50
    if (this.data.notifications.length > 50) {
      this.data.notifications.pop();
    }
    this.save();
  }

  markNotificationRead(notId: string) {
    const not = this.data.notifications.find(n => n.id === notId);
    if (not) {
      not.isRead = true;
      this.save();
    }
  }

  incrementSustainability(amount: number) {
    this.data.sustainability.environmentalScore = Math.min(100, this.data.sustainability.environmentalScore + amount);
    this.save();
  }

  // ---- Living farm simulation ----
  getFarmEvents(limit?: number): FarmEvent[] {
    const sorted = [...this.data.farmEvents].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return limit ? sorted.slice(0, limit) : sorted;
  }

  addFarmEvent(event: FarmEvent) {
    this.data.farmEvents.unshift(event);
    // Cap stored history to 500 events to keep the file manageable
    if (this.data.farmEvents.length > 500) {
      this.data.farmEvents = this.data.farmEvents.slice(0, 500);
    }
    this.save();
  }

  getFarmStatus(): FarmStatus {
    return computeFarmStatus(new Date());
  }

  tickSimulation(): FarmEvent | null {
    const now = new Date();
    const status = this.getFarmStatus();
    const event = generateEvent(now, status);
    this.addFarmEvent(event);
    return event;
  }

  ensureSeedEvents() {
    if (this.data.farmEvents.length === 0) {
      const seeded = backfillEvents(new Date(), 18);
      this.data.farmEvents = seeded.reverse();
      this.save();
    }
  }
}

export const db = new DatabaseStore();
db.ensureSeedEvents();
