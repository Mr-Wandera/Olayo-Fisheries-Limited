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

// Initial seed data
const initialData: DatabaseSchema = {
  users: [
    {
      id: 'usr_admin',
      email: 'admin@olayo.com',
      name: 'Elena Rostova',
      role: 'Administrator',
      phone: '+34 612 345 678',
      companyName: 'Olayo Fisheries HQ',
      certified: true,
      certifiedAt: '2026-01-15T09:00:00Z',
      twoFactorEnabled: true,
      createdAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'usr_fleet',
      email: 'fleet@olayo.com',
      name: 'Captain Marcus Vance',
      role: 'Fleet Manager',
      phone: '+47 902 44 112',
      companyName: 'Olayo Fleet Operations',
      certified: true,
      certifiedAt: '2026-02-10T11:30:00Z',
      createdAt: '2026-01-10T00:00:00Z',
    },
    {
      id: 'usr_prod',
      email: 'producer@olayo.com',
      name: 'Mateo Silva',
      role: 'Producer',
      phone: '+351 912 345 678',
      companyName: 'Silva Seafood Harvests',
      certified: true,
      certifiedAt: '2026-03-01T14:20:00Z',
      createdAt: '2026-01-12T00:00:00Z',
    },
    {
      id: 'usr_cons',
      email: 'consumer@olayo.com',
      name: 'Sarah Jenkins',
      role: 'Consumer',
      phone: '+1 555 019 2834',
      createdAt: '2026-04-01T00:00:00Z',
    },
    {
      id: 'usr_retail',
      email: 'retailer@olayo.com',
      name: 'Henri Dubois',
      role: 'Retailer',
      phone: '+33 607 123 456',
      companyName: 'Dubois Fine Foods',
      createdAt: '2026-04-15T00:00:00Z',
    },
    {
      id: 'usr_rest',
      email: 'restaurant@olayo.com',
      name: 'Chef Akira Sato',
      role: 'Restaurant',
      phone: '+81 90 1234 5678',
      companyName: 'Umi Zen Sushi',
      createdAt: '2026-05-01T00:00:00Z',
    },
  ],
  boats: [
    {
      id: 'boat_01',
      name: 'Ocean Sentinel',
      status: 'active',
      crewCount: 12,
      fuelLevel: 82,
      maintenanceDate: '2026-08-15',
      tripCount: 47,
      lat: 42.143,
      lng: -9.821,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400',
      captain: 'Marcus Vance',
      recentCatchKg: 1420,
    },
    {
      id: 'boat_02',
      name: 'Deep Sea Explorer',
      status: 'active',
      crewCount: 8,
      fuelLevel: 64,
      maintenanceDate: '2026-07-28',
      tripCount: 38,
      lat: 56.452,
      lng: 5.214,
      image: 'https://images.unsplash.com/photo-1505244760054-0255a24172e8?auto=format&fit=crop&q=80&w=400',
      captain: 'Arne Sorensen',
      recentCatchKg: 980,
    },
    {
      id: 'boat_03',
      name: 'Poseidon Vanguard',
      status: 'maintenance',
      crewCount: 15,
      fuelLevel: 10,
      maintenanceDate: '2026-07-05',
      tripCount: 114,
      lat: 43.612,
      lng: -8.114,
      image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&q=80&w=400',
      captain: 'Katarina Lind',
      recentCatchKg: 0,
    },
    {
      id: 'boat_04',
      name: 'Coral Guardian',
      status: 'docked',
      crewCount: 6,
      fuelLevel: 98,
      maintenanceDate: '2026-09-01',
      tripCount: 22,
      lat: 38.712,
      lng: -12.451,
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=400',
      captain: 'Mateo Silva',
      recentCatchKg: 520,
    },
  ],
  catchReports: [
    {
      id: 'catch_01',
      boatId: 'boat_01',
      boatName: 'Ocean Sentinel',
      species: 'Bluefin Tuna',
      quantity: 1250,
      date: '2026-06-29T10:30:00Z',
      fishingZone: 'Atlantic FAO 27',
      depth: 180,
      freshness: 'optimal',
      qualityScore: 96,
      temperature: -2.4,
      loggedBy: 'Marcus Vance',
    },
    {
      id: 'catch_02',
      boatId: 'boat_02',
      boatName: 'Deep Sea Explorer',
      species: 'Atlantic Cod',
      quantity: 2100,
      date: '2026-06-30T06:15:00Z',
      fishingZone: 'North Sea FAO 27.IV',
      depth: 95,
      freshness: 'optimal',
      qualityScore: 92,
      temperature: -1.8,
      loggedBy: 'Arne Sorensen',
    },
    {
      id: 'catch_03',
      boatId: 'boat_04',
      boatName: 'Coral Guardian',
      species: 'Red King Crab',
      quantity: 450,
      date: '2026-06-28T16:45:00Z',
      fishingZone: 'Barents Sea FAO 27.I',
      depth: 250,
      freshness: 'good',
      qualityScore: 89,
      temperature: -3.0,
      loggedBy: 'Mateo Silva',
    },
  ],
  products: [
    {
      id: 'prod_olayo_01',
      name: 'Premium Nile Tilapia (Whole)',
      scientificName: 'Oreochromis niloticus',
      description: 'Grown sustainably in deep floating cages on Lake Victoria (Busiime, Busia District). Pristine sweet flavor, firm white meat, rich in amino acids and harvested daily to order.',
      price: 5.80,
      unit: 'kg',
      category: 'Aquaculture',
      image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=600',
      sustainabilityScore: 98,
      origin: 'Lake Victoria Cages, Uganda',
      method: 'Cage Aquaculture',
      nutrients: {
        protein: '20.1g',
        fat: '1.7g',
        omega3: '0.6g',
        calories: 96,
      },
      availability: 'in-stock',
      currentTemp: 1.2,
      freshnessStatus: 'prime',
    },
    {
      id: 'prod_olayo_02',
      name: 'Nile Perch Fillets (Skinless)',
      scientificName: 'Lates niloticus',
      description: 'Fleshy, premium skinless Nile Perch fillets harvested from Lake Victoria deep waters. Mild taste, firm texture, thick delicious white flakes perfect for grilling.',
      price: 12.50,
      unit: 'kg',
      category: 'Aquaculture',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
      sustainabilityScore: 94,
      origin: 'Lake Victoria, Uganda',
      method: 'Responsible Handline & Cage',
      nutrients: {
        protein: '19.6g',
        fat: '2.1g',
        omega3: '0.8g',
        calories: 104,
      },
      availability: 'in-stock',
      currentTemp: 0.8,
      freshnessStatus: 'prime',
    },
    {
      id: 'prod_olayo_03',
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
      nutrients: {
        protein: '18.5g',
        fat: '4.2g',
        omega3: '0.4g',
        calories: 112,
      },
      availability: 'in-stock',
      currentTemp: 1.5,
      freshnessStatus: 'excellent',
    },
    {
      id: 'prod_olayo_04',
      name: 'Aromatic Smoked Nile Tilapia',
      scientificName: 'Oreochromis niloticus',
      description: 'Fresh cage tilapia cured with natural salts and hot-smoked using seasoned local fruitwood. Deeply golden skin and incredibly rich, smoky flavor.',
      price: 9.80,
      unit: 'whole',
      category: 'Value-Added',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400',
      sustainabilityScore: 97,
      origin: 'Olayo Processing Hub, Uganda',
      method: 'Woodsmoke Kiln Cured',
      nutrients: {
        protein: '24.2g',
        fat: '3.1g',
        omega3: '0.9g',
        calories: 128,
      },
      availability: 'in-stock',
      currentTemp: 4.0,
      freshnessStatus: 'prime',
    },
    {
      id: 'prod_olayo_05',
      name: 'High-Survival Nile Tilapia Fingerlings',
      scientificName: 'Oreochromis niloticus',
      description: 'Vigorous, health-certified all-male Nile Tilapia fingerlings (average weight 5g). Specially conditioned in our Busiime nursery for excellent survival rates.',
      price: 0.15,
      unit: 'whole',
      category: 'Fingerlings',
      image: 'https://images.unsplash.com/photo-1505244760054-0255a24172e8?auto=format&fit=crop&q=80&w=400',
      sustainabilityScore: 99,
      origin: 'Olayo Busia Hatchery, Uganda',
      method: 'Controlled Spawning',
      nutrients: {
        protein: '0g',
        fat: '0g',
        omega3: '0g',
        calories: 0,
      },
      availability: 'in-stock',
      currentTemp: 22.0,
      freshnessStatus: 'prime',
    },
    {
      id: 'prod_olayo_06',
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
      nutrients: {
        protein: '38.0g',
        fat: '6.5g',
        omega3: '1.5g',
        calories: 320,
      },
      availability: 'in-stock',
      currentTemp: 20.0,
      freshnessStatus: 'prime',
    },
    {
      id: 'prod_olayo_07',
      name: 'Organic Liquid Fish Fertilizer',
      scientificName: 'NPK Liquid Fertilizer',
      description: 'All-natural cold-processed liquid fish hydrolysate. Packed with trace minerals, amino acids, and nutrients from sustainable processing bi-products.',
      price: 3.50,
      unit: 'whole',
      category: 'Organic',
      image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&q=80&w=600',
      sustainabilityScore: 100,
      origin: 'Olayo Recycler, Busiime',
      method: 'Enzymatic Hydrolysis',
      nutrients: {
        protein: '0g',
        fat: '0g',
        omega3: '0g',
        calories: 0,
      },
      availability: 'in-stock',
      currentTemp: 18.0,
      freshnessStatus: 'prime',
    },
    {
      id: 'prod_01',
      name: 'Premium Bluefin Tuna',
      scientificName: 'Thunnus thynnus',
      description: 'Sashimi-grade, sustainably line-caught Bluefin Tuna. Pristine marbled texture, packed with healthy Omega-3 fatty acids and blast-frozen at sea to lock in maximum freshness.',
      price: 45.0,
      unit: 'kg',
      category: 'Pelagic',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
      sustainabilityScore: 95,
      origin: 'Atlantic FAO 27',
      method: 'Line Caught (One-by-One)',
      nutrients: {
        protein: '23.3g',
        fat: '4.9g',
        omega3: '1.2g',
        calories: 144,
      },
      availability: 'in-stock',
      currentTemp: -2.5,
      freshnessStatus: 'prime',
    },
    {
      id: 'prod_02',
      name: 'Atlantic Cod Fillets',
      scientificName: 'Gadus morhua',
      description: 'Flaky, wild-caught skinless Atlantic Cod fillets. Perfect for baking or frying. Caught using responsible bottom-longlines that minimize ecological impact.',
      price: 18.5,
      unit: 'kg',
      category: 'Demersal',
      image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=600',
      sustainabilityScore: 88,
      origin: 'North Sea FAO 27.IV',
      method: 'Longline',
      nutrients: {
        protein: '17.8g',
        fat: '0.7g',
        omega3: '0.3g',
        calories: 82,
      },
      availability: 'in-stock',
      currentTemp: -1.8,
      freshnessStatus: 'excellent',
    },
    {
      id: 'prod_03',
      name: 'Alaskan King Crab Legs',
      scientificName: 'Paralithodes camtschaticus',
      description: 'Colossal king crab legs with sweet, juicy meat. Sustainably trap-caught in the icy depths. Fully pre-cooked and flash frozen to secure sweet ocean flavor.',
      price: 75.0,
      unit: 'kg',
      category: 'Crustacean',
      image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=600',
      sustainabilityScore: 90,
      origin: 'Barents Sea FAO 27.I',
      method: 'Pots & Traps',
      nutrients: {
        protein: '19.4g',
        fat: '1.5g',
        omega3: '0.5g',
        calories: 97,
      },
      availability: 'in-stock',
      currentTemp: -4.2,
      freshnessStatus: 'prime',
    },
    {
      id: 'prod_04',
      name: 'Wild Atlantic Sea Scallops',
      scientificName: 'Placopecten magellanicus',
      description: 'Plump, sweet, and dry-caught giant sea scallops. Hand-shucked on the boat. Sourced using eco-responsible dredging quotas.',
      price: 52.0,
      unit: 'kg',
      category: 'Mollusk',
      image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=600',
      sustainabilityScore: 85,
      origin: 'Northwest Atlantic FAO 21',
      method: 'Hand-Harvested / Diver',
      nutrients: {
        protein: '16.7g',
        fat: '0.8g',
        omega3: '0.2g',
        calories: 88,
      },
      availability: 'low-stock',
      currentTemp: -2.0,
      freshnessStatus: 'excellent',
    },
    {
      id: 'prod_05',
      name: 'Norway Red Lobster',
      scientificName: 'Homarus gammarus',
      description: 'Delectable whole European lobster. Rich, firm meat with unmatched flavor profile. Caught off the rocky shores of Norway using artisanal basket traps.',
      price: 64.0,
      unit: 'whole',
      category: 'Crustacean',
      image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&q=80&w=600',
      sustainabilityScore: 92,
      origin: 'Skagerrak FAO 27.IIIa',
      method: 'Pots & Traps',
      nutrients: {
        protein: '20.5g',
        fat: '0.9g',
        omega3: '0.4g',
        calories: 90,
      },
      availability: 'in-stock',
      currentTemp: -3.0,
      freshnessStatus: 'prime',
    }
  ],
  orders: [
    {
      id: 'ord_1001',
      userId: 'usr_retail',
      userName: 'Henri Dubois',
      items: [
        {
          product: {
            id: 'prod_01',
            name: 'Premium Bluefin Tuna',
            scientificName: 'Thunnus thynnus',
            description: 'Sashimi-grade, sustainably line-caught Bluefin Tuna.',
            price: 45.0,
            unit: 'kg',
            category: 'Pelagic',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
            sustainabilityScore: 95,
            origin: 'Atlantic FAO 27',
            method: 'Line Caught',
            nutrients: { protein: '23.3g', fat: '4.9g', omega3: '1.2g', calories: 144 },
            availability: 'in-stock',
            currentTemp: -2.5,
            freshnessStatus: 'prime'
          },
          quantity: 20
        },
        {
          product: {
            id: 'prod_02',
            name: 'Atlantic Cod Fillets',
            scientificName: 'Gadus morhua',
            description: 'Flaky wild-caught skinless Atlantic Cod fillets.',
            price: 18.5,
            unit: 'kg',
            category: 'Demersal',
            image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=600',
            sustainabilityScore: 88,
            origin: 'North Sea FAO 27.IV',
            method: 'Longline',
            nutrients: { protein: '17.8g', fat: '0.7g', omega3: '0.3g', calories: 82 },
            availability: 'in-stock',
            currentTemp: -1.8,
            freshnessStatus: 'excellent'
          },
          quantity: 50
        }
      ],
      total: 1825.0,
      status: 'shipped',
      date: '2026-06-30T11:00:00Z',
      trackingStage: 'Transport',
      deliveryRoute: ['Atlantic FAO 27 Port', 'Bilbao Cold Storage', 'Paris Central Depot', 'Dubois Retail Shop'],
      invoiceUrl: '/api/orders/invoice/ord_1001',
    }
  ],
  facilities: [
    {
      id: 'fac_01',
      name: 'Vigo Port Cold Facility',
      type: 'Storage',
      temp: -24.5,
      minAllowedTemp: -28,
      maxAllowedTemp: -18,
      status: 'optimal',
      capacity: '150 Tons',
      usage: 74,
      alerts: [],
    },
    {
      id: 'fac_02',
      name: 'Ocean Express Truck #4',
      type: 'Logistics',
      temp: -15.8, // EXCEEDED maximum temperature of -18°C!
      minAllowedTemp: -25,
      maxAllowedTemp: -18,
      status: 'alert',
      capacity: '8 Tons',
      usage: 85,
      alerts: ['Temperature leak: Cargo hold breach reported. Inspect insulation seals immediately.'],
    },
    {
      id: 'fac_03',
      name: 'Reykjavik Processing Depot',
      type: 'Processing',
      temp: -21.2,
      minAllowedTemp: -25,
      maxAllowedTemp: -15,
      status: 'optimal',
      capacity: '80 Tons',
      usage: 42,
      alerts: [],
    },
    {
      id: 'fac_04',
      name: 'Hamburg Distribution Center',
      type: 'Warehouse',
      temp: -19.0,
      minAllowedTemp: -22,
      maxAllowedTemp: -18,
      status: 'warning',
      capacity: '200 Tons',
      usage: 91,
      alerts: ['Approaching load capacity (91%). Automated cold-airflow redirected.'],
    }
  ],
  lessons: [
    {
      id: 'les_01',
      title: 'Combating Overfishing: Understanding TAC and Fishing Quotas',
      category: 'Regulations',
      readTime: '4 mins',
      excerpt: 'Discover how Total Allowable Catches (TAC) and individual quotas ensure that our ocean populations remain robust for generations.',
      content: `Sustainable fishing starts with mathematics. Scientists and marine authorities determine the Total Allowable Catch (TAC) for specific commercial fish populations each season. These figures are calculated using acoustic surveys, historical catch log analysis, and age-structure models of fish cohorts.

Once the TAC is set, individual quotas are distributed among certified fisheries, like Olayo Fisheries. This prevents "the race to fish," where vessels compete to harvest as much as possible, causing dangerous market gluts and depleting species below their recovery thresholds. 

By tracking catches in real-time on Olayo, we guarantee that our vessels never exceed their legal limits, aiding international marine recovery frameworks and maintaining premium market value through high quality controls.`,
      points: 100,
      questions: [
        {
          id: 'les_01_q1',
          question: 'What does TAC stand for in fisheries management?',
          options: [
            'Total Active Catch',
            'Total Allowable Catch',
            'Tactical Aquaculture Control',
            'Thermal Aquifer Concentration'
          ],
          correctIndex: 1,
        },
        {
          id: 'les_01_q2',
          question: 'How do individual quotas combat "the race to fish"?',
          options: [
            'By requiring vessels to speed up their harvest',
            'By assigning a fixed, safe harvest allocation to each vessel',
            'By banning boats from entering the deep ocean',
            'By restricting the sales to retail outlets only'
          ],
          correctIndex: 1,
        }
      ]
    },
    {
      id: 'les_02',
      title: 'Artisanal Gear Selection: The Power of Longlining vs Trawling',
      category: 'Methods',
      readTime: '5 mins',
      excerpt: 'Explore how longline and trap-caught fishing dramatically decrease accidental bycatch and safeguard delicate seafloor habitats.',
      content: `Standard industrial bottom-trawling drags heavy weighted nets along the seafloor. This can destroy centuries-old deep-sea coral ecosystems and scoop up random species, generating a high percentage of bycatch that is discarded dead back into the water.

In contrast, Olayo Fisheries advocates for low-impact gear. Longlining utilizes a single main line with baited hooks spaced far apart, drifting gently above the ocean floor. Trap fishing uses mesh pots designed with selective escape openings, allowing smaller, juvenile crabs and non-target species to walk out unharmed before retrieval.

Using these methods keeps the oceans balanced, protects the benthos (sea bed), and delivers a far higher-quality fish. Cod and tuna caught on hooks undergo less physical stress than those squeezed in trawler nets, yielding cleaner lactic-acid levels and firmer, premium meat.`,
      points: 120,
      questions: [
        {
          id: 'les_02_q1',
          question: 'Why is bottom-trawling considered ecologically hazardous?',
          options: [
            'It consumes too little diesel fuel',
            'It damages deep-sea coral habitats and creates high bycatch',
            'It frightens fish away to deeper regions',
            'It only works during daylight hours'
          ],
          correctIndex: 1,
        },
        {
          id: 'les_02_q2',
          question: 'Why does hook-and-line fishing result in better meat quality?',
          options: [
            'Fish are fed special vitamins on the line',
            'Fish experience less physical stress, maintaining firm meat texture',
            'The hooks sanitize the fish skin automatically',
            'It cools down the fish water temperature'
          ],
          correctIndex: 1,
        }
      ]
    },
    {
      id: 'les_03',
      title: 'The Super-Chilled Cold Chain: Why -18°C Is Not Negotiable',
      category: 'Cooking',
      readTime: '3 mins',
      excerpt: 'Learn the scientific foundation of seafood preservation: from super-chilled holds to ultra-rapid blast freezing.',
      content: `Seafood contains high amounts of water, protein, and amino acids that degrade rapidly at room temperature. Bacteria thrive on damp fish surfaces, and lipids oxidize quickly, producing a strong fishy smell and soft texture.

To combat this, the cold chain must never rise above -18°C. Better yet, Olayo sashimi-grade tuna is blast-frozen to -60°C on board. This ultra-fast temperature drop prevents water molecules from forming large ice crystals. Large crystals puncture the cell membranes of the fish muscle; when thawed, these ruptured cells leak fluid, causing 'drip loss' and ruining the fish's buttery texture.

Maintaining solid thermal logging from vessel GPS logs, truck RFID tags, to warehouse sensors ensures that your seafood retains peak oceanic freshness and nutritional value.`,
      points: 80,
      questions: [
        {
          id: 'les_03_q1',
          question: 'What is the maximum standard temperature allowed in deep-freeze logistics?',
          options: [
            '0°C',
            '-5°C',
            '-18°C',
            '10°C'
          ],
          correctIndex: 2,
        },
        {
          id: 'les_03_q2',
          question: 'Why does super-fast blast-freezing preserve texture better than standard freezing?',
          options: [
            'It changes the color of the scales',
            'It prevents large ice crystals from rupturing cell membranes',
            'It cooks the fish gently while freezing',
            'It dissolves extra fish bones'
          ],
          correctIndex: 1,
        }
      ]
    }
  ],
  notifications: [
    {
      id: 'not_01',
      title: 'Critical Cold Chain Alarm',
      description: 'Ocean Express Truck #4 hold has risen to -15.8°C. Inspect cooling unit and door seal immediately!',
      type: 'coldchain',
      isRead: false,
      timestamp: '2026-07-01T00:15:00Z',
    },
    {
      id: 'not_02',
      title: 'Fleet Schedule Notice',
      description: 'Boat Ocean Sentinel has returned from trip #47 and docked at Vigo Port. 1,420kg wild species ready for grading.',
      type: 'fleet',
      isRead: false,
      timestamp: '2026-06-30T22:40:00Z',
    },
    {
      id: 'not_03',
      title: 'Ecosystem Sustainability Goal Met',
      description: 'Silva Seafood Harvests logged a 100% longline catch! Environmental Health score increased by +2 points.',
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
