import { CageStatus, FarmEvent, FarmEventCategory, FarmStatus } from '../types';

const CAGE_DEFS = [
  { id: 'cage_01', name: 'Cage Alpha-1', species: 'Nile Tilapia', population: 4200, avgWeightG: 320 },
  { id: 'cage_02', name: 'Cage Alpha-2', species: 'Nile Tilapia', population: 3800, avgWeightG: 410 },
  { id: 'cage_03', name: 'Cage Beta-1', species: 'Nile Perch', population: 1200, avgWeightG: 1450 },
  { id: 'cage_04', name: 'Cage Beta-2', species: 'Nile Perch', population: 980, avgWeightG: 2100 },
  { id: 'cage_05', name: 'Cage Gamma-1', species: 'African Catfish', population: 2600, avgWeightG: 680 },
  { id: 'cage_06', name: 'Cage Gamma-2', species: 'African Catfish', population: 2400, avgWeightG: 540 },
];

const STAFF_NAMES = [
  'Warden Marcus Vance',
  'Dr. Amina Nakato',
  'Engineer Elena Rostova',
  'Joel Wandera',
  'Grace Akello',
  'Samuel Okello',
  'Dr. Abdul Wandera',
  'Mary Atimang',
];

const BOAT_NAMES = ['MV Nyanza', 'MV Busiime Star', 'MV Victoria Pride', 'MV Tilapia Express'];

const LOCATIONS = [
  'Busiime Cage Grid',
  'Busia Processing Hub',
  'Lake Victoria North Bay',
  'Hatchery Building A',
  'Feed Mill',
  'Outgrower Network',
  'Vigo Export Desk',
];

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function timeOfDayFor(date: Date): FarmStatus['timeOfDay'] {
  const h = date.getHours();
  if (h >= 5 && h < 8) return 'morning';
  if (h >= 8 && h < 12) return 'midday';
  if (h >= 12 && h < 16) return 'afternoon';
  if (h >= 16 && h < 18) return 'golden';
  if (h >= 18 && h < 20) return 'sunset';
  if (h >= 20 && h < 23) return 'night';
  return 'midnight';
}

function weatherFor(date: Date): FarmStatus['weather'] {
  // Seasonal-ish: July in Uganda is dry season, mostly clear/cloudy
  const r = Math.random();
  if (r < 0.55) return 'clear';
  if (r < 0.85) return 'cloudy';
  if (r < 0.97) return 'rain';
  return 'storm';
}

export function computeFarmStatus(date: Date): FarmStatus {
  const tod = timeOfDayFor(date);
  const weather = weatherFor(date);

  // Lake Victoria surface temps range ~23-27°C; cooler at night
  const baseTemp = 25.0;
  const todAdjust =
    tod === 'midday' || tod === 'afternoon' ? 1.8 :
    tod === 'morning' || tod === 'golden' ? 0.4 :
    tod === 'sunset' ? -0.3 : -1.6;
  const weatherAdjust = weather === 'rain' ? -0.6 : weather === 'storm' ? -1.2 : 0;
  const lakeTempC = +(baseTemp + todAdjust + weatherAdjust + rand(-0.3, 0.3)).toFixed(1);

  const ambientTempC = +(lakeTempC + 4 + rand(-1, 1)).toFixed(1);
  const dissolvedOxygenMgL = +(6.2 + rand(-0.6, 0.8) + (weather === 'storm' ? -1.2 : 0)).toFixed(2);
  const ph = +(7.1 + rand(-0.2, 0.3)).toFixed(2);
  const turbidityNTU = +(1.4 + rand(-0.4, 1.2) + (weather === 'rain' ? 1.5 : weather === 'storm' ? 3.0 : 0)).toFixed(2);
  const windKnots = Math.round((weather === 'storm' ? rand(18, 28) : weather === 'rain' ? rand(10, 16) : rand(3, 9)) * 10) / 10;

  const cages: CageStatus[] = CAGE_DEFS.map((c) => {
    const biomassKg = Math.round((c.population * c.avgWeightG) / 1000);
    const feedTodayKg = Math.round(biomassKg * 0.025 * 10) / 10;
    const mortalityToday = Math.max(0, Math.round(c.population * rand(0.0002, 0.0015)));
    const healthScore = Math.round(rand(82, 98));
    return {
      id: c.id,
      name: c.name,
      species: c.species,
      biomassKg,
      avgWeightG: c.avgWeightG + Math.round(rand(-8, 12)),
      population: c.population - mortalityToday,
      waterTempC: +(lakeTempC + rand(-0.4, 0.4)).toFixed(1),
      dissolvedOxygenMgL: +(dissolvedOxygenMgL + rand(-0.3, 0.3)).toFixed(2),
      ph: +(ph + rand(-0.1, 0.1)).toFixed(2),
      turbidityNTU: +(turbidityNTU + rand(-0.3, 0.5)).toFixed(2),
      feedTodayKg,
      mortalityToday,
      lastInspection: new Date(date.getTime() - rand(0, 6 * 3600_000)).toISOString(),
      healthScore,
    };
  });

  const totalBiomassKg = cages.reduce((s, c) => s + c.biomassKg, 0);
  const totalPopulation = cages.reduce((s, c) => s + c.population, 0);
  const todayFeedKg = +cages.reduce((s, c) => s + c.feedTodayKg, 0).toFixed(1);
  const todayMortality = cages.reduce((s, c) => s + c.mortalityToday, 0);

  const staffOnDuty =
    tod === 'midday' || tod === 'afternoon' ? 14 :
    tod === 'morning' || tod === 'golden' ? 9 :
    tod === 'sunset' ? 5 : 3;
  const boatsActive = weather === 'storm' ? 0 : tod === 'midday' || tod === 'afternoon' ? 3 : tod === 'morning' || tod === 'golden' ? 2 : 1;
  const pendingOrders = Math.round(rand(2, 9));
  const todayRevenue = Math.round(rand(1800, 6400) * 100) / 100;

  return {
    timestamp: date.toISOString(),
    lakeTempC,
    ambientTempC,
    dissolvedOxygenMgL,
    ph,
    turbidityNTU,
    windKnots,
    weather,
    timeOfDay: tod,
    totalBiomassKg,
    totalPopulation,
    activeCages: cages.length,
    staffOnDuty,
    boatsActive,
    pendingOrders,
    todayRevenue,
    todayFeedKg,
    todayMortality,
    cages,
  };
}

interface EventTemplate {
  category: FarmEventCategory;
  title: (ctx: { actor: string; location: string; boat: string; cage: string }) => string;
  description: (ctx: { actor: string; location: string; boat: string; cage: string; status: FarmStatus }) => string;
  severity: FarmEvent['severity'];
  windows: FarmStatus['timeOfDay'][]; // when this event tends to occur
  weight: number; // relative likelihood
}

const EVENT_TEMPLATES: EventTemplate[] = [
  {
    category: 'feeding',
    title: ({ cage }) => `Automated feeding completed — ${cage}`,
    description: ({ cage, status }) => `Floating feed pellets distributed across ${cage}. Total daily ration: ${status.todayFeedKg.toFixed(1)} kg across all cages. Feed conversion ratio holding at 1.32.`,
    severity: 'success',
    windows: ['morning', 'midday', 'afternoon'],
    weight: 3,
  },
  {
    category: 'water',
    title: () => 'Water quality telemetry sampled',
    description: ({ status }) => `Dissolved oxygen ${status.dissolvedOxygenMgL} mg/L, pH ${status.ph}, turbidity ${status.turbidityNTU} NTU. All parameters within NEMA compliance band.`,
    severity: 'info',
    windows: ['morning', 'midday', 'afternoon', 'night'],
    weight: 2,
  },
  {
    category: 'fleet',
    title: ({ boat }) => `Vessel ${boat} departed Busiime dock`,
    description: ({ boat }) => `${boat} underway for routine cage inspection and feeding run. ETA return 14:30 EAT. Crew of 4, fuel 78%.`,
    severity: 'info',
    windows: ['morning', 'midday'],
    weight: 2,
  },
  {
    category: 'fleet',
    title: ({ boat }) => `Vessel ${boat} returned to dock`,
    description: ({ boat }) => `${boat} moored at Busiime. Inspection log synced to SatLink. No anomalies reported.`,
    severity: 'success',
    windows: ['afternoon', 'golden', 'sunset'],
    weight: 2,
  },
  {
    category: 'harvest',
    title: ({ cage }) => `Partial harvest initiated — ${cage}`,
    description: ({ cage }) => `Selective harvest of market-size individuals from ${cage}. Target yield 480 kg destined for Busia processing hub. Ice slurry prepared at -1.5°C.`,
    severity: 'success',
    windows: ['morning', 'midday'],
    weight: 1.5,
  },
  {
    category: 'quality',
    title: () => 'Quality inspection passed',
    description: ({ actor }) => `${actor} completed sensory and microbiological audit. Batch cleared for wholesale distribution. Certificate QR generated.`,
    severity: 'success',
    windows: ['midday', 'afternoon'],
    weight: 1.5,
  },
  {
    category: 'marketplace',
    title: () => 'Marketplace order confirmed',
    description: ({ status }) => `Wholesale order from Kampala Fresh Distributors confirmed for 220 kg Nile Tilapia. Invoice ${'INV-' + Math.floor(rand(2000, 9999))}. Pending orders now ${status.pendingOrders}.`,
    severity: 'success',
    windows: ['midday', 'afternoon', 'morning'],
    weight: 2,
  },
  {
    category: 'finance',
    title: () => 'Daily revenue ledger updated',
    description: ({ status }) => `Today's confirmed revenue: $${status.todayRevenue.toFixed(2)} USD across ${status.pendingOrders} active orders. Cash flow healthy.`,
    severity: 'info',
    windows: ['sunset', 'night'],
    weight: 1.5,
  },
  {
    category: 'research',
    title: () => 'Makerere University research sample logged',
    description: ({ actor }) => `${actor} recorded water column sample for Makerere limnology study. Sample ID ${'MK-' + Math.floor(rand(100, 999))} archived in cold storage.`,
    severity: 'info',
    windows: ['midday', 'afternoon'],
    weight: 1,
  },
  {
    category: 'community',
    title: () => 'Outgrower visit completed',
    description: ({ actor }) => `${actor} conducted site visit with 3 outgrower farmers in Busia. Fingerling survival rates reviewed, feed supply scheduled.`,
    severity: 'info',
    windows: ['morning', 'midday', 'afternoon'],
    weight: 1.5,
  },
  {
    category: 'community',
    title: () => 'School farm tour arrived',
    description: () => `Busia Primary School group of 24 students arrived for educational tour. Hatchery and cage grid demonstration scheduled.`,
    severity: 'info',
    windows: ['morning', 'midday'],
    weight: 1,
  },
  {
    category: 'maintenance',
    title: () => 'Cage net inspection scheduled',
    description: ({ cage }) => `Preventive net integrity check queued for ${cage}. Diver dispatched. Last inspection 4 days ago — within protocol.`,
    severity: 'info',
    windows: ['morning', 'midday'],
    weight: 1,
  },
  {
    category: 'weather',
    title: () => 'Weather advisory issued',
    description: ({ status }) => `Lake conditions: ${status.weather}, wind ${status.windKnots} knots. ${status.weather === 'storm' ? 'All cage operations paused. Boats recalled.' : status.weather === 'rain' ? 'Feeding adjusted for runoff dilution.' : 'Operations nominal.'}`,
    severity: 'info',
    windows: ['morning', 'midday', 'afternoon', 'night'],
    weight: 1.5,
  },
  {
    category: 'water',
    title: () => 'Night oxygen monitoring increased',
    description: ({ status }) => `Dissolved oxygen trending ${status.dissolvedOxygenMgL} mg/L. Aeration standby engaged. Night watch rotation confirmed.`,
    severity: 'info',
    windows: ['night', 'midnight'],
    weight: 2,
  },
  {
    category: 'ai',
    title: () => 'OI generated operational recommendation',
    description: () => `Olayo Intelligence recommends shifting 15% of Cage Beta-2 ration to evening window based on 7-day growth variance analysis. Confidence 87%. Awaiting manager approval.`,
    severity: 'info',
    windows: ['midday', 'afternoon', 'morning'],
    weight: 1.5,
  },
  {
    category: 'ai',
    title: () => 'OI predictive alert: feed inventory',
    description: () => `Projected feed stock depletion in 6.2 days at current consumption. Auto-reorder draft prepared for procurement approval.`,
    severity: 'warning',
    windows: ['morning', 'midday'],
    weight: 1,
  },
  {
    category: 'water',
    title: () => 'Turbidity spike detected',
    description: ({ status }) => `Turbidity rose to ${status.turbidityNTU} NTU following rainfall runoff. Monitoring cages Alpha-1 and Alpha-2 for gill stress.`,
    severity: 'warning',
    windows: ['afternoon', 'sunset'],
    weight: 1,
  },
];

function weightedPick(templates: EventTemplate[]): EventTemplate {
  const total = templates.reduce((s, t) => s + t.weight, 0);
  let r = Math.random() * total;
  for (const t of templates) {
    r -= t.weight;
    if (r <= 0) return t;
  }
  return templates[0];
}

export function generateEvent(date: Date, status: FarmStatus): FarmEvent {
  const eligible = EVENT_TEMPLATES.filter((t) => t.windows.includes(status.timeOfDay));
  const template = weightedPick(eligible.length > 0 ? eligible : EVENT_TEMPLATES);
  const actor = pick(STAFF_NAMES);
  const location = pick(LOCATIONS);
  const boat = pick(BOAT_NAMES);
  const cage = pick(CAGE_DEFS).name;
  const ctx = { actor, location, boat, cage, status };

  return {
    id: 'evt_' + date.getTime() + '_' + Math.floor(Math.random() * 10000),
    timestamp: date.toISOString(),
    category: template.category,
    title: template.title(ctx),
    description: template.description(ctx),
    actor,
    location,
    severity: template.severity,
  };
}

/**
 * Backfill a realistic event history ending at `endDate`.
 * Produces roughly one event every 12-40 minutes over the window.
 */
export function backfillEvents(endDate: Date, hours: number): FarmEvent[] {
  const events: FarmEvent[] = [];
  const cursor = new Date(endDate.getTime() - hours * 3600_000);
  while (cursor < endDate) {
    const status = computeFarmStatus(cursor);
    events.push(generateEvent(new Date(cursor), status));
    cursor.setMinutes(cursor.getMinutes() + Math.floor(rand(12, 40)));
  }
  return events;
}
