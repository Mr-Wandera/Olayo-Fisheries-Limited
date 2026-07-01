import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, Sparkles, Send, ShieldAlert, Cpu, Activity, Database, Leaf, HelpCircle, 
  Search, Upload, Image as ImageIcon, Volume2, VolumeX, BookOpen, Scale, Landmark, Ship, 
  Layers, Clock, FileText, CheckCircle2, ChevronRight, AlertTriangle, Play, RefreshCw, BarChart2,
  Users, ClipboardList, Lightbulb, TrendingUp, Compass, Check, X, ShieldCheck, UserCheck, Eye
} from 'lucide-react';
import { Product, UserProfile, Order } from '../types';

interface OlayoIntelligenceProps {
  products: Product[];
  currentUser: UserProfile | null;
  sustainabilityScore: number;
  onSustainbilityIncrease: (amount: number) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'oi';
  text: string;
  timestamp: string;
  context?: string;
  decisionSupport?: {
    recommendation: string;
    reason: string;
    expectedOutcome: string;
    risks: string;
    alternatives: string;
    id: string; // Action reference ID for approval states
    type: 'purchase_order' | 'inspection' | 'postpone_harvest' | 'solar_timing';
  };
  confidence?: number;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  personality: string;
  expertise: string[];
  responsibilities: string[];
  status: 'Idle' | 'Working' | 'Reviewing' | 'Monitoring';
  statusText: string;
  workload: number; // percentage
  confidence: number; // percentage
  decisionsCount: number;
  recentAction: string;
}

export default function OlayoIntelligence({ 
  products, 
  currentUser, 
  sustainabilityScore, 
  onSustainbilityIncrease 
}: OlayoIntelligenceProps) {
  
  // States
  const [activeTab, setActiveTab] = useState<'workspace' | 'workforce' | 'strategy' | 'ask_farm' | 'document' | 'image' | 'reality'>('workspace');
  const [currentContext, setCurrentContext] = useState<'Operations' | 'Marketplace' | 'Learning' | 'Finance' | 'Fleet'>('Operations');
  const [activeRole, setActiveRole] = useState<'Producer' | 'Fleet Manager' | 'Quality Inspector' | 'Finance' | 'Consumer' | 'Administrator'>('Producer');
  
  // Reality 2.0 Simulation & Twin States
  const [simulationSeason, setSimulationSeason] = useState<'rainy' | 'dry'>('dry');
  const [windSpeedKnots, setWindSpeedKnots] = useState<number>(12);
  const [waveHeightMeters, setWaveHeightMeters] = useState<number>(0.4);
  const [whatIfScenario, setWhatIfScenario] = useState<'none' | 'feed_reduction' | 'aeration_boost' | 'new_cages'>('none');
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(true);
  const [simulationTimeMultiplier, setSimulationTimeMultiplier] = useState<number>(1);
  const [selectedCageId, setSelectedCageId] = useState<number>(3);
  const [operationalReplayDay, setOperationalReplayDay] = useState<number>(0); // 0 = present, negative is rewind
  const [activeCrisis, setActiveCrisis] = useState<'none' | 'algae' | 'storm' | 'feed_delay' | 'outbreak'>('none');
  const [traceGraphOpen, setTraceGraphOpen] = useState<boolean>(false);
  const [activeTraceNode, setActiveTraceNode] = useState<number>(0);

  // Evolving digital twin database
  const [cages, setCages] = useState([
    { id: 1, name: "Cage 1 - Fingerling Hub", fishType: "Nile Tilapia", count: 45000, avgWeight: 120, dissolvedOxygen: 6.8, temperature: 26.5, pH: 7.2, algaeIndex: 12, mortalityRate: 0.02, fcr: 1.15, feedAmountKg: 45, biomass: 5400, valuation: 16200 },
    { id: 2, name: "Cage 2 - Nursery Sector", fishType: "Nile Tilapia", count: 35000, avgWeight: 280, dissolvedOxygen: 6.6, temperature: 26.4, pH: 7.1, algaeIndex: 14, mortalityRate: 0.03, fcr: 1.20, feedAmountKg: 78, biomass: 9800, valuation: 29400 },
    { id: 3, name: "Cage 3 - Sector A East", fishType: "Nile Tilapia", count: 30000, avgWeight: 654, dissolvedOxygen: 5.4, temperature: 26.8, pH: 7.2, algaeIndex: 25, mortalityRate: 0.08, fcr: 1.28, feedAmountKg: 156, biomass: 19620, valuation: 68670 },
    { id: 4, name: "Cage 4 - Deep Sector", fishType: "Nile Tilapia", count: 40000, avgWeight: 510, dissolvedOxygen: 6.2, temperature: 26.2, pH: 7.3, algaeIndex: 15, mortalityRate: 0.01, fcr: 1.21, feedAmountKg: 160, biomass: 20400, valuation: 61200 },
    { id: 5, name: "Cage 5 - West Buffer", fishType: "Nile Tilapia", count: 30000, avgWeight: 420, dissolvedOxygen: 6.4, temperature: 26.3, pH: 7.2, algaeIndex: 18, mortalityRate: 0.04, fcr: 1.23, feedAmountKg: 100, biomass: 12600, valuation: 37800 },
    { id: 6, name: "Cage 6 - Harvest Ready", fishType: "Nile Tilapia", count: 25000, avgWeight: 680, dissolvedOxygen: 5.8, temperature: 26.7, pH: 7.2, algaeIndex: 22, mortalityRate: 0.05, fcr: 1.25, feedAmountKg: 125, biomass: 17000, valuation: 62900 },
    { id: 7, name: "Cage 7 - Sector B Shallow", fishType: "Nile Tilapia", count: 32000, avgWeight: 310, dissolvedOxygen: 5.1, temperature: 26.9, pH: 7.4, algaeIndex: 28, mortalityRate: 0.09, fcr: 1.42, feedAmountKg: 95, biomass: 9920, valuation: 29760 },
    { id: 8, name: "Cage 8 - Outer Perimeter", fishType: "Nile Tilapia", count: 28000, avgWeight: 590, dissolvedOxygen: 6.0, temperature: 26.1, pH: 7.1, algaeIndex: 19, mortalityRate: 0.06, fcr: 1.26, feedAmountKg: 110, biomass: 16520, valuation: 49560 }
  ]);

  // Reality 2.0 Farm Simulation Loop
  useEffect(() => {
    if (!isSimulationActive) return;

    const interval = setInterval(() => {
      setCages(prevCages => {
        return prevCages.map(cage => {
          let growthIncrement = 0.45; 
          let oxygenModifier = 0;
          let algaeModifier = 0.15;
          let mortalityModifier = 0;

          if (simulationSeason === 'rainy') {
            growthIncrement *= 0.75; 
            oxygenModifier -= 0.1;
            algaeModifier -= 0.1;
          } else {
            growthIncrement *= 1.1; 
            oxygenModifier -= 0.05;
            algaeModifier += 0.2;
          }

          if (activeCrisis === 'algae') {
            if (cage.id === 3 || cage.id === 7) {
              algaeModifier += 3.5;
              oxygenModifier -= 0.5;
              mortalityModifier += 0.01;
            }
          } else if (activeCrisis === 'storm') {
            oxygenModifier += 0.2; 
            growthIncrement *= 0.2; 
          } else if (activeCrisis === 'outbreak') {
            if (cage.id === 2) {
              mortalityModifier += 0.015;
            }
          }

          if (whatIfScenario === 'feed_reduction') {
            growthIncrement *= 0.65; 
          } else if (whatIfScenario === 'aeration_boost') {
            oxygenModifier += 0.4; 
            algaeModifier -= 0.3;
          }

          const newWeight = Math.round((cage.avgWeight + growthIncrement * simulationTimeMultiplier) * 10) / 10;
          const newOxygen = Math.max(2.0, Math.min(8.5, Math.round((cage.dissolvedOxygen + oxygenModifier * simulationTimeMultiplier) * 10) / 10));
          const newAlgae = Math.max(5, Math.min(100, Math.round(cage.algaeIndex + algaeModifier * simulationTimeMultiplier)));
          const newMortality = Math.max(0.01, Math.min(5.0, Math.round((cage.mortalityRate + mortalityModifier * simulationTimeMultiplier) * 100) / 100));

          const newBiomass = Math.round((cage.count * newWeight) / 1000);
          const rate = newWeight >= 680 ? 3.7 : newWeight >= 500 ? 3.1 : 2.5;
          const newValuation = Math.round(newBiomass * rate);

          return {
            ...cage,
            avgWeight: newWeight,
            dissolvedOxygen: newOxygen,
            algaeIndex: newAlgae,
            mortalityRate: newMortality,
            biomass: newBiomass,
            valuation: newValuation
          };
        });
      });
    }, 2000 / simulationTimeMultiplier);

    return () => clearInterval(interval);
  }, [isSimulationActive, simulationSeason, activeCrisis, whatIfScenario, simulationTimeMultiplier]);

  // Memory and preferences
  const [userPreferences, setUserPreferences] = useState({
    preferredDashboard: 'Main Operational Hub',
    harvestThresholdGrams: 680, // Memory: manager prefers 680g instead of 650g
    pinnedInsight: 'Dissolved oxygen aeration protocol for grid #2 is highly optimized.',
  });

  // Dynamic system approvals state
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 'PO-2026-154',
      type: 'purchase_order',
      title: 'Feed Purchase Order PO-2026-154',
      details: 'Drafted PO for 2.5 tonnes of Floating Feed from GreenFeed Uganda Ltd. Total amount: $3,200.',
      status: 'pending', // pending, approved, declined
      agent: 'Finance Agent'
    },
    {
      id: 'INSP-2026-89',
      type: 'inspection',
      title: 'Cage 8 Bio-Security Inspection',
      details: 'Inspect mesh net integrity and record oxygen level. Scheduled for 8:00 AM tomorrow, assigned to James (Quality Inspector).',
      status: 'pending',
      agent: 'Operations Agent'
    },
    {
      id: 'HRVST-2026-12',
      type: 'postpone_harvest',
      title: 'Postpone Cage 6 Harvest',
      details: 'Postpone harvest from Friday 3 AM to Saturday 6 AM due to predicted 24-knot Lake Victoria wind advisories.',
      status: 'pending',
      agent: 'Fleet Agent'
    }
  ]);

  const [auditLog, setAuditLog] = useState([
    { timestamp: '01:10 AM', message: 'System boot and satellite data synchronization initialized.', level: 'INFO' },
    { timestamp: '01:15 AM', message: 'Operations Agent generated telemetry alert for Cage 3 water oxygen.', level: 'WARN' },
    { timestamp: '01:22 AM', message: 'Sustainability Agent assessed Lake Victoria bio-oxygen coefficient as stable.', level: 'INFO' }
  ]);

  // Conversational Messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init-1',
      sender: 'oi',
      text: "Greetings, Wahab. I am Olayo Intelligence (OI), the central brain of Olayo Fisheries. I have unified all operational sensors, market logs, and fleet parameters.\n\nNotice: I detected feed inventory is dropping quickly. I've prepared a draft Purchase Order PO-2026-154 for manager review. Let me know what you would like to prioritize today.",
      timestamp: '01:37 AM',
      confidence: 1.0,
      decisionSupport: {
        id: 'PO-2026-154',
        type: 'purchase_order',
        recommendation: "Feed inventory will reach the minimum threshold in four days. I have prepared Purchase Order PO-2026-154 for GreenFeed Uganda Ltd.",
        reason: "Active feeding rate of Nile Tilapia is 15% higher than baseline due to warm water surface currents (26.8°C).",
        expectedOutcome: "Replenish Busia Silo 2 with 2.5 Tonnes before depletion, avoiding growth interruption.",
        risks: "Feed cost shows minor 2% logistics surcharge due to East African regional transit updates.",
        alternatives: "Reduce current feeding rate to 80%, which will delay optimal harvest weight by 5 days."
      }
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiStreaming, setIsAiStreaming] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [globalSearchRes, setGlobalSearchRes] = useState<string | null>(null);

  // Document states
  const [uploadedDocName, setUploadedDocName] = useState<string | null>(null);
  const [isScanningDoc, setIsScanningDoc] = useState(false);
  const [docSummary, setDocSummary] = useState<any | null>(null);

  // Image states
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState<any | null>(null);

  // Collaboration visualizer animation
  const [isSimulatingCollab, setIsSimulatingCollab] = useState(false);
  const [currentCollabStep, setCurrentCollabStep] = useState(0);
  const [collabType, setCollabType] = useState<'order' | 'weather'>('order');

  // Strategy planner state
  const [strategyPrompt, setStrategyPrompt] = useState('How can we double production within two years?');
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [strategicRoadmap, setStrategicRoadmap] = useState<any | null>(null);

  // Meeting mode state
  const [meetingNotes, setMeetingNotes] = useState(
    `Olayo Team sync. Attending: Wahab, James, Phoebe.\nJames noted that Nile Tilapia in Cage 6 are reaching 650g but we want to maximize pricing. Phoebe recommended waiting a few extra days for 680g standard weight. James confirmed Feed Batch #24 from Busia supplier is performing well. We need to schedule boat maintenance for Vessel twin soon. James will verify net mesh integrity on Cage 8 before noon.`
  );
  const [isAnalyzingMeeting, setIsAnalyzingMeeting] = useState(false);
  const [meetingSummary, setMeetingSummary] = useState<any | null>(null);

  // Reference for message scroll
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiStreaming]);

  // AI Workforce Database
  const [agentsList, setAgentsList] = useState<Agent[]>([
    {
      id: 'ops_agent',
      name: 'Nekesa Phoebe',
      role: 'Operations Agent',
      avatar: '👩‍🌾',
      personality: 'Diligent, analytical, and risk-averse. Always grounded in physical sensor readings.',
      expertise: ['Telemetry Monitoring', 'Growth Projections', 'Harvest Timing', 'Biosecurity'],
      responsibilities: ['Task management schedules', 'Water oxygen logs', 'Feeding rate audits', 'Mortality risk analysis'],
      status: 'Monitoring',
      statusText: 'Analyzing Cage 6 sensor streams...',
      workload: 34,
      confidence: 98,
      decisionsCount: 142,
      recentAction: 'Created Cage 8 biosecurity inspection task.'
    },
    {
      id: 'fin_agent',
      name: 'Wekesa Barnabas',
      role: 'Finance Agent',
      avatar: '👨‍💼',
      personality: 'Pragmatic, cost-conscious, and compliant. Focuses on margins, cash-flows, and return ratios.',
      expertise: ['Budget Forecasting', 'Invoice Extraction', 'Feed PO Optimization', 'Profitability Audits'],
      responsibilities: ['Purchase orders automation', 'EAC tax compliance', 'Operating cash reserves', 'FCR expense metrics'],
      status: 'Reviewing',
      statusText: 'Auditing Busia Feed Batch invoices...',
      workload: 15,
      confidence: 99,
      decisionsCount: 98,
      recentAction: 'Drafted Feed PO-2026-154 for manager approval.'
    },
    {
      id: 'mkt_agent',
      name: 'Arikose Andrew',
      role: 'Marketplace Agent',
      avatar: '📈',
      personality: 'Adaptive, market-savvy, energetic. Focuses on retail trends and cold-chain dispatches.',
      expertise: ['Demand Prediction', 'B2B Bundle Pricing', 'Cold Storage Logistics', 'Restocking Cycles'],
      responsibilities: ['Restaurant contract pricing', 'Kampala distribution logistics', 'Customer behavior analysis'],
      status: 'Working',
      statusText: 'Recommending tilapia retail bundles...',
      workload: 45,
      confidence: 95,
      decisionsCount: 110,
      recentAction: 'Optimized fresh bundle retail promotion pricing.'
    },
    {
      id: 'sust_agent',
      name: 'Alividza Joy',
      role: 'Sustainability Agent',
      avatar: '🌱',
      personality: 'Eco-centric, visionary, regulatory expert. Guards Lake Victoria ecosystem health.',
      expertise: ['Carbon Footprint Metrics', 'Ecosystem Impact Projections', 'NEMA compliance', 'Community Programs'],
      responsibilities: ['Oxygen saturation models', 'Algae turbidity tracking', 'Outgrower green bonuses'],
      status: 'Monitoring',
      statusText: 'Checking lake bio-oxygen saturation...',
      workload: 12,
      confidence: 97,
      decisionsCount: 65,
      recentAction: 'Calculated positive score gain for shoreline planting.'
    },
    {
      id: 'learn_agent',
      name: 'Prof. Wandera',
      role: 'Learning Agent',
      avatar: '🎓',
      personality: 'Encouraging, pedagogical, structured. Inspires aquaculture mastery.',
      expertise: ['Adaptive Curriculum', 'Quiz Design', 'Flashcard Creation', 'Strengths Analysis'],
      responsibilities: ['Outgrower study guides', 'Biosecurity practice tests', 'NEMA regulation cards'],
      status: 'Idle',
      statusText: 'Awaiting student study queries...',
      workload: 8,
      confidence: 99,
      decisionsCount: 220,
      recentAction: 'Compiled biosecurity crash-course lessons.'
    },
    {
      id: 'fleet_agent',
      name: 'Okello Peter',
      role: 'Fleet Agent',
      avatar: '🚢',
      personality: 'Vigilant, safety-first, climate-conscious. Always tracking winds and vessel hulls.',
      expertise: ['Vessel Twin Analytics', 'Fuel Conservation Routing', 'Weather Risk Adjustments', 'Marine Safety'],
      responsibilities: ['Boat dispatch schedules', 'Engine warning metrics', 'Ferry route wave profiles'],
      status: 'Working',
      statusText: 'Monitoring wave heights on Entebbe route...',
      workload: 58,
      confidence: 94,
      decisionsCount: 88,
      recentAction: 'Triggered harvest postponement recommendation due to wind advisory.'
    },
    {
      id: 'exec_agent',
      name: 'Executive Brain',
      role: 'Executive Agent',
      avatar: '🦁',
      personality: 'Decisive, high-level, corporate COO. Orchestrates overall platform wellness.',
      expertise: ['Multi-Agent Coordination', 'Daily CEO Briefs', 'Risk Remediation', 'Strategic Roadmaps'],
      responsibilities: ['Daily briefings formulation', 'Risk index dashboard', 'Approval log updates', 'Audit compliance'],
      status: 'Working',
      statusText: 'Formulating daily operations executive summary...',
      workload: 8,
      confidence: 100,
      decisionsCount: 300,
      recentAction: 'Compiled morning executive summary for director Wahab.'
    }
  ]);

  // Collab steps
  const orderCollabSteps = [
    {
      agent: 'Marketplace Agent (Andrew 📈)',
      action: 'Analyzed Kampala Retail Contract',
      detail: 'Received B2B purchase inquiry from Kampala Fish House for 500kg Premium Tilapia.',
      icon: '📈'
    },
    {
      agent: 'Operations Agent (Phoebe 👩‍🌾)',
      action: 'Checked Active Grid Inventories',
      detail: 'Scanned Cage 6 biomass. Confirmed Nile Tilapia average weight is 680g with 4.8 tonnes total ready capacity.',
      icon: '👩‍🌾'
    },
    {
      agent: 'Fleet Agent (Peter 🚢)',
      action: 'Assessed Wave Height & Boat Twin',
      detail: 'Checked Vessel twin and wind speeds. Favorable weather window is open between 6:00 AM and noon.',
      icon: '🚢'
    },
    {
      agent: 'Finance Agent (Barnabas 👨‍💼)',
      action: 'Audited Margin & Delivery Pricing',
      detail: 'Calculated expected margin: 68% after fuel and ice deductions. Payment cleared on smart ledger.',
      icon: '👨‍💼'
    },
    {
      agent: 'Executive Agent (🦁 COO Brain)',
      action: 'Synthesized Final Dispatch Order',
      detail: 'Compiled complete dispatch workflow: Approved Kampala Fish House Delivery (500kg) via Vessel Twin #2 at 8:00 AM.',
      icon: '🦁'
    }
  ];

  const weatherCollabSteps = [
    {
      agent: 'Fleet Agent (Peter 🚢)',
      action: 'Detected Severe Wind Wave Advisory',
      detail: 'Lake Victoria wave sensors project 1.8-meter waves and 24-knot winds starting Thursday morning.',
      icon: '🚢'
    },
    {
      agent: 'Operations Agent (Phoebe 👩‍🌾)',
      action: 'Postponed Cage 6 Harvest Window',
      detail: 'Rescheduled Cage 6 harvest to Friday 6 AM. Logged safety warning on supervisor bulletin.',
      icon: '👩‍🌾'
    },
    {
      agent: 'Marketplace Agent (Andrew 📈)',
      action: 'Notified B2B Hospitality Clients',
      detail: 'Dispatched automated updates to Kampala and Nairobi hotel depots adjusting fresh fish delivery window.',
      icon: '📈'
    },
    {
      agent: 'Executive Agent (🦁 COO Brain)',
      action: 'Formulated Incident Safety Brief',
      detail: 'Drafted incident safety brief and action checklist for COO Wahab. All boats flagged inside Busia harbour.',
      icon: '🦁'
    }
  ];

  // Simulated collaboration ticker
  useEffect(() => {
    let interval: any;
    if (isSimulatingCollab) {
      const steps = collabType === 'order' ? orderCollabSteps : weatherCollabSteps;
      interval = setInterval(() => {
        setCurrentCollabStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsSimulatingCollab(false);
            // Post collaborative response to workspace
            const answer = collabType === 'order' 
              ? `### 🤝 Multi-Agent Consolidated Order Verification:\n\n* **Client**: Kampala Fish House\n* **Required Product**: 500kg Premium Nile Tilapia\n* **Stock Status**: Verified by **Operations Agent** in Cage 6 (tilapia are at optimized harvest weight of 680g).\n* **Dispatch Status**: Approved by **Fleet Agent** (Vessel Twin #2 clear, weather window favorable).\n* **Financial Audit**: Verified by **Finance Agent** (expected net profit of $1,840, payment escrowed).\n\n**Consolidated Recommendation**: Dispatch approved. Click 'Authorize Delivery' below to dispatch boat orders.`
              : `### 🚨 Multi-Agent Incident Safety Postponement:\n\n* **Weather Event**: 24-knot wind advisory detected by **Fleet Agent**.\n* **Operational Shift**: **Operations Agent** postponed the harvest schedule to Friday 6:00 AM.\n* **Logistics Shift**: **Marketplace Agent** synchronized delay bulletins to restaurant delivery managers.\n\n**Consolidated Status**: Safe harbor protocol activated. Failsafe logistics successfully deployed across all modules.`;

            setMessages(prevMsgs => [
              ...prevMsgs,
              {
                id: `collab-${Date.now()}`,
                sender: 'oi',
                text: answer,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                confidence: 0.99
              }
            ]);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isSimulatingCollab, collabType]);

  // Execute Simulation Trigger
  const triggerCollaborationSimulation = (type: 'order' | 'weather') => {
    setCollabType(type);
    setCurrentCollabStep(0);
    setIsSimulatingCollab(true);
    setActiveTab('workforce');
  };

  // Pre-seed some default conversational questions depending on active tab
  const getSuggestedQuestions = () => {
    if (currentContext === 'Operations') {
      return [
        "What needs attention today?",
        "When should Cage 6 be harvested?",
        "Ask the farm for live status overview.",
        "Which cages have highest mortality risk?"
      ];
    } else if (currentContext === 'Marketplace') {
      return [
        "Recommend bundles for Tilapia.",
        "Analyse customer purchase behavior last quarter.",
        "Generate pricing for Kampala restaurant chain."
      ];
    } else if (currentContext === 'Learning') {
      return [
        "Explain Feed Conversion Ratio simply.",
        "Give me adaptive study plans for sustainable breeding.",
        "Create biosecurity revision flashcards."
      ];
    } else if (currentContext === 'Finance') {
      return [
        "Why did feed costs increase?",
        "Verify Feed PO-2026-154 profitability parameters.",
        "Compare costs of Cage 4 vs Cage 7."
      ];
    } else {
      return [
        "Schedule boat inspections for Vessel twin.",
        "Are there critical vessel warning lights active?",
        "Explain the harvest wind safety protocol."
      ];
    }
  };

  // Global Search
  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setGlobalSearchRes("Scanning Olayo operational databases...");
    setTimeout(() => {
      const q = searchQuery.toLowerCase();
      if (q.includes('inspection') || q.includes('june')) {
        setGlobalSearchRes("🔍 Executive Search matched 3 results:\n1. Vet Inspection - Cage 2 [June 12] - Score: 98% (Translucent eyes)\n2. Water Quality Sample [June 18] - pH: 7.2\n3. Vessel Hull Cleansing Certificate [June 24] - Signed by Dr. Abdul.");
      } else if (q.includes('catfish') || q.includes('purchased')) {
        setGlobalSearchRes("🔍 Executive Search matched 1 result:\n1. Order ord_1002 - customer: J. Mukasa purchased 50kg Fresh Tilapia & Catfish elements - $420 total.");
      } else if (q.includes('mortality') || q.includes('threshold')) {
        setGlobalSearchRes("🔍 Executive Search matched 2 warnings:\n1. Cage 3 breached 2% mortality threshold due to dissolved oxygen dips on June 28.\n2. Hatchery Pond B warning index active (Turbidity high).");
      } else if (q.includes('supplier') || q.includes('feed')) {
        setGlobalSearchRes("🔍 Executive Search matched 1 record:\n1. Supplier: Busia Marine Feed Mills Ltd. Delivered Feed Batch #24 - 50 Bags of High Protein Cichlid Crumbles on June 29.");
      } else {
        setGlobalSearchRes(`🔍 Executive Search for "${searchQuery}" returned 1 match:\n1. Dynamic digital twin record for current ${currentContext} node. No safety breach detected.`);
      }
    }, 800);
  };

  // Conversational response handler
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    // "Ask the farm" syntax trigger
    if (textToSend.toLowerCase().includes('ask the farm') || textToSend.toLowerCase().includes('ask_farm')) {
      setActiveTab('ask_farm');
      setInputMessage('');
      return;
    }

    // Add user message
    const userMsg: Message = {
      id: `usr-msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      context: currentContext
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsAiStreaming(true);

    try {
      const payload = {
        prompt: `[Role: ${activeRole}, Context: ${currentContext}, Preference: Tilapia harvest standard at ${userPreferences.harvestThresholdGrams}g] ${textToSend}`,
        mode: 'general'
      };

      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      let aiText = '';
      let decisionSupport = undefined;
      let confidence = 0.95;

      if (data.success && data.text) {
        aiText = data.text;
      } else {
        const q = textToSend.toLowerCase();
        confidence = 0.94 + Math.random() * 0.05;

        if (q.includes('attention') || q.includes('prioritise') || q.includes('prioritize')) {
          aiText = `According to live telemetry analyzed by Phoebe (Operations Agent), Cage 3 requires dissolved oxygen aeration before noon (oxygen has declined to 4.2 mg/L). 

I've also logged that feed inventory will hit the minimum safety threshold in four days. I have prepared Purchase Order PO-2026-154 for GreenFeed Uganda Ltd. Would you like me to submit it for manager approval? You can approve it instantly in the Workspace pane.`;
          decisionSupport = {
            id: 'PO-2026-154',
            type: 'purchase_order',
            recommendation: "Purchase Order PO-2026-154 is prepared for GreenFeed Uganda Ltd.",
            reason: "Current feed stock depleted to 1.8 tonnes, sufficient for only 4 days under current feeding rates.",
            expectedOutcome: "Ensure continuous supply of High-Protein Floating Crumbles without stockouts.",
            risks: "Slight diesel fuel surcharge expected for Kampala-Busia haulage route.",
            alternatives: "Trigger emergency purchase from Jinja local feed hubs, which has an 8% higher spot pricing."
          };
        } else if (q.includes('harvest') || q.includes('cage 6')) {
          // Long-term memory integration: manager prefers 680g standard weight
          aiText = `Cage 6 Nile Tilapia average weight is registered at 654g. However, looking at your historical harvesting decisions, you consistently prefer waiting for Tilapia to reach 680g standard weight to maximize B2B wholesale pricing.

Therefore, I recommend waiting three more days. This extra time is projected to yield an additional $740 in revenue across the entire cage batch.`;
          decisionSupport = {
            id: 'HRVST-2026-12',
            type: 'postpone_harvest',
            recommendation: "Postpone Cage 6 harvest by 3 days.",
            reason: "Tilapia is currently at 654g. Waiting till Friday allows fish to hit your preferred 680g standard premium retail bracket.",
            expectedOutcome: "Optimize price-per-kg margins, yielding +$740 in revenue.",
            risks: "Requires feeding for 3 more days, consuming 240kg of high-protein stock.",
            alternatives: "Harvest immediately today at 654g, accepting minor wholesale discount values."
          };
        } else if (q.includes('cage 8') || q.includes('inspect')) {
          aiText = `I have already created a Cage 8 biosecurity inspection task, assigned it to James (Quality Inspector), scheduled it for 8:00 AM tomorrow, and sent an automated SMS/app notification to the Operations Manager Phoebe.`;
          decisionSupport = {
            id: 'INSP-2026-89',
            type: 'inspection',
            recommendation: "Create and assign biosecurity inspection for Cage 8 mesh frames.",
            reason: "Slight wind ripples on grid #3 require frame tension alignment validation to prevent fingerling leakage.",
            expectedOutcome: "Verify mesh integrity, keeping bio-security compliance score at 100%.",
            risks: "Diver operations require 30 minutes of cage down-time.",
            alternatives: "Perform remote camera inspection using water drone."
          };
        } else if (q.includes('weather') || q.includes('dangerous') || q.includes('storm')) {
          aiText = `Severe wave conditions are predicted for Friday morning on Lake Victoria (wave heights exceeding 1.6 meters, wind gusts up to 24 knots). 

I have postponed tomorrow's harvest schedule, informed our regional logistics carriers, updated Entebbe customer delivery estimates, and prepared an executive safety summary for your immediate review.`;
          decisionSupport = {
            id: 'HRVST-2026-12',
            type: 'postpone_harvest',
            recommendation: "Postpone tomorrow's harvest to Saturday morning due to high wind warnings.",
            reason: "24-knot wind advisories make cage maneuvering and sorting boats dangerous for crew safety.",
            expectedOutcome: "Maintain zero accident record and avoid stressful feed-rejection loops.",
            risks: "Slight delivery delay for Kampala market bookings.",
            alternatives: "Harvest tonight under night spotlights, which increases crew risk indices."
          };
        } else if (q.includes('fcr') || q.includes('feed conversion')) {
          aiText = `**Feed Conversion Ratio (FCR) Analysis**:\n\nOur current consolidated FCR across the 12 floating grids stands at **1.28**, which is exceptional. Phoebe (Operations Agent) reports that Cage 4 has the lowest FCR (1.21), whereas Cage 7 is slightly higher (1.42).\n\nThis discrepancy is caused by minor water temperature variance near the shallow grid line. I recommend keeping Cage 7 automated feed timers to early-morning cycles only.`;
        } else if (q.includes('report') || q.includes('executive')) {
          aiText = `### Olayo Fisheries Executive Summary Brief\n\n* **Reporting Cycle**: Daily Operations Overview\n* **Live Biomass**: 184.2 Tonnes across 12 floating grids\n* **Water Safety Index**: 98% (Healthy levels)\n* **Expected Yield**: 15 Tonnes next harvest cycle\n\n#### Recommended Executive Actions\n1. **Approve purchase order** for 2.5 tonnes of High-Protein Floating Crumbles from Busia Mills.\n2. **Authorize structural validation checks** on Cage 8 following wave patterns.\n3. **Postpone tomorrow's Cage 6 harvest** due to Friday wave advisories.`;
        } else {
          aiText = `I have logged your query under Olayo's central intelligence module. After collaborating across all digital employee agents (Operations, Finance, Fleet, Marketplace, and Sustainability), we verified that the platform is operating smoothly. Telemetry is healthy with 0.02% error rates. Let me know what specific action I can assist you with!`;
        }
      }

      // Voice synthesises if enabled
      if (isSpeechEnabled && window.speechSynthesis) {
        const speechText = aiText.replace(/[#*`_]/g, '');
        const utter = new SpeechSynthesisUtterance(speechText);
        utter.rate = 1.05;
        window.speechSynthesis.speak(utter);
      }

      // Stream response
      setMessages(prev => [...prev, {
        id: `oi-msg-${Date.now()}`,
        sender: 'oi',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        decisionSupport,
        confidence
      }]);

    } catch (err) {
      console.error(err);
    } finally {
      setIsAiStreaming(false);
    }
  };

  // Run Strategic Planning Simulation
  const handleGenerateStrategy = () => {
    setIsGeneratingStrategy(true);
    setStrategicRoadmap(null);

    setTimeout(() => {
      setIsGeneratingStrategy(false);
      setStrategicRoadmap({
        objective: "Double Nile Tilapia production from 184 tonnes to 370 tonnes within 24 months.",
        confidenceScore: "92%",
        roadmap: [
          {
            phase: "Phase 1: Grid Expansion (Months 1-6)",
            capitalRequired: "$45,000",
            actions: "Install 4 additional deep-water HDPE floating cages (8m diameter) in Sector C. Deploy advanced solar-powered automatic feed timers.",
            projectedIncrease: "+40 Tonnes ready capacity"
          },
          {
            phase: "Phase 2: Feed Optimization (Months 7-12)",
            capitalRequired: "$20,000",
            actions: "Negotiate high-volume contract with Busia Marine Feed Mills Ltd. target FCR lower margin (1.20). Deploy acoustic feed sensors to eliminate waste.",
            projectedIncrease: "+60 Tonnes biomass weight gain"
          },
          {
            phase: "Phase 3: Outgrower Network Scaling (Months 13-18)",
            capitalRequired: "$35,000",
            actions: "Incorporate 15 new certified outgrower farm units near Kisumu and Entebbe. Distribute high-lipid fingerlings and biosecurity study guides.",
            projectedIncrease: "+80 Tonnes outsourced logistics capacity"
          },
          {
            phase: "Phase 4: Cold-Chain Logistics Hub (Months 19-24)",
            capitalRequired: "$25,000",
            actions: "Acquire two temperature-controlled hybrid delivery vessels. Integrate cold storage digital twins with Nairobi restaurant demand portal.",
            projectedIncrease: "Secure Grade-A premium pricing lock on entire 370-tonne annual yield."
          }
        ],
        financialModel: {
          totalInvestment: "$125,000 USD",
          paybackPeriod: "18 Months from Phase 4 completion",
          expectedROI: "240% Net Yield Margin growth"
        }
      });
    }, 1800);
  };

  // Summarize meeting notes
  const handleAnalyzeMeeting = () => {
    setIsAnalyzingMeeting(true);
    setMeetingSummary(null);

    setTimeout(() => {
      setIsAnalyzingMeeting(false);
      setMeetingSummary({
        title: "Olayo Core Management Team Sync - Extracted Decisions",
        duration: "30 Mins",
        attendance: "Wahab, James, Phoebe",
        summary: "OI successfully summarized discussions regarding tilapia harvest standards, feed efficiency margins, and scheduled biosecurity checks on Lake Victoria.",
        actionItems: [
          {
            task: "Inspect Cage 8 net mesh frame tension and record oxygen levels.",
            owner: "James (Quality Inspector)",
            deadline: "Tomorrow 8:00 AM",
            status: "Assigned & Reminded via SMS"
          },
          {
            task: "Delay Nile Tilapia harvest window for Cage 6 until average weight hits optimal 680g standard.",
            owner: "Phoebe (Operations Agent)",
            deadline: "Friday 6:00 AM",
            status: "Postponement Logged"
          },
          {
            task: "Order Feed Batch #25 from Busia Feed Mills.",
            owner: "Barnabas (Finance Agent)",
            deadline: "Monday morning",
            status: "Draft PO Created"
          }
        ]
      });

      // Add to audit trail
      setAuditLog(prev => [
        { timestamp: '01:43 AM', message: 'Analyzed sync meeting notes and automatically delegated 3 action items.', level: 'INFO' },
        ...prev
      ]);
    }, 1500);
  };

  // Document intelligence summary
  const handleDocUpload = (docType: string) => {
    setUploadedDocName(`${docType}_Document_${Math.floor(Math.random() * 900) + 100}.pdf`);
    setIsScanningDoc(true);
    setDocSummary(null);

    setTimeout(() => {
      setIsScanningDoc(false);
      if (docType === 'Invoice') {
        setDocSummary({
          title: "Silo Feed Invoice #84920",
          extracted: {
            supplier: "Busia Marine Feed Mills Ltd.",
            totalAmount: "$2,450.00 USD",
            items: "50 Bags of High Protein Cichlid Starter Crumbles",
            date: "2026-06-28",
            verificationStatus: "✓ MD5 Hash Matched. Clear from billing disputes."
          },
          insights: "Pricing matches pre-negotiated wholesale contract margins. Cash flow depletion scheduled for next Tuesday."
        });
      } else if (docType === 'Inspection') {
        setDocSummary({
          title: "Busiime Cage 2 Veterinary Report",
          extracted: {
            inspector: "Dr. Abdul Wandera",
            healthIndex: "98% Stable",
            observations: "Zero parasite markers found. Gills bright crimson. High lipid density observed in fingerlings.",
            date: "2026-06-25",
            verificationStatus: "✓ NEMA Certified Environmental Compliance Verified."
          },
          insights: "Excellent bio-barrier compliance. Gills show high dissolved oxygen intake efficiency."
        });
      } else {
        setDocSummary({
          title: "Uganda Marine Export Clearance Certificate",
          extracted: {
            authority: "Ministry of Agriculture, Animal Industry & Fisheries",
            permitId: "UGA-AQ-2026-8841",
            destination: "Nairobi logistics cooling depot",
            date: "2026-06-30",
            verificationStatus: "✓ Digital Signatures Checked (SSL Authenticated)."
          },
          insights: "Full regional tax exemptions applied under East African Trade Accord protocols."
        });
      }
    }, 1500);
  };

  // Image intelligence analysis
  const handleImageUpload = (imageType: string) => {
    setUploadedImageName(`${imageType}_Capture_Live.png`);
    setIsScanningImage(true);
    setImageAnalysis(null);

    let imgUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800";
    if (imageType === 'Cage') {
      imgUrl = "https://images.unsplash.com/photo-1505244760054-0255a24172e8?auto=format&fit=crop&q=80&w=800";
    } else if (imageType === 'Drone') {
      imgUrl = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800";
    }

    setUploadedImageUrl(imgUrl);

    setTimeout(() => {
      setIsScanningImage(false);
      if (imageType === 'Fish') {
        setImageAnalysis({
          estimatedSpecies: "Oreochromis niloticus (Nile Tilapia)",
          weightRange: "410g - 435g (Grade-A Standard)",
          condition: "Optimal. Streamlined build, scales fully sealed, zero skin discoloration.",
          diseaseIndicators: "None detected (Skin healthy)",
          confidenceScore: "98.4%",
          recommendedActions: "Proceed with scheduled Cage 6 commercial harvest as planned."
        });
      } else if (imageType === 'Cage') {
        setImageAnalysis({
          estimatedSpecies: "Cage Grid Structural Scan",
          weightRange: "Net Tension: 94% Stable",
          condition: "Excellent. Marine plastic frames are aligned, zero mesh-tears or micro-plastic debris found.",
          diseaseIndicators: "Algae bio-fouling: 8% (Low)",
          confidenceScore: "96.2%",
          recommendedActions: "No brush cleaning required this week. Maintain current grid positioning."
        });
      } else {
        setImageAnalysis({
          estimatedSpecies: "Satellite/Drone Surface Survey",
          weightRange: "Silt Concentration: Normal",
          condition: "Water quality normal. Visible schools of fish swimming behavior registers active feeding state.",
          diseaseIndicators: "Water temperature: 26.4°C • Turbidity: low",
          confidenceScore: "94.8%",
          recommendedActions: "Configure solar aerators for afternoon solar charging cycles."
        });
      }
    }, 1800);
  };

  // Action approval / reject
  const handleApproveAction = (id: string, actionType: string) => {
    // Update Pending Approvals State
    setPendingApprovals(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    
    // Log in Audit Ledger
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAuditLog(prev => [
      { timestamp: time, message: `AUTHORIZED: User Wahab approved operation action ${id}. Task committed to blockchain service.`, level: 'SUCCESS' },
      ...prev
    ]);

    // Send visual message confirming approval
    setMessages(prev => [
      ...prev,
      {
        id: `approve-msg-${Date.now()}`,
        sender: 'oi',
        text: `✅ **Operational Directive Authorized**: ${id} has been fully approved and submitted for execution. James has been notified, logistics carriers updated, and the digital ledger has archived this approval signature under transaction hash *0x88d4...*`,
        timestamp: time,
        confidence: 1.0
      }
    ]);
  };

  const handleDeclineAction = (id: string) => {
    setPendingApprovals(prev => prev.map(p => p.id === id ? { ...p, status: 'declined' } : p));
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAuditLog(prev => [
      { timestamp: time, message: `DECLINED: User Wahab declined operational action ${id}. Work order rolled back.`, level: 'WARN' },
      ...prev
    ]);
  };

  return (
    <div className="space-y-6 text-left" id="olayo-intelligence-root">
      
      {/* BRAND HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 border border-cyan-500/15 p-6 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl text-slate-950 shadow-lg shadow-cyan-400/20">
            <BrainCircuit className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-xl sm:text-2xl text-white tracking-wider uppercase">
                OLAYO INTELLIGENCE (OI)
              </h1>
              <span className="text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full tracking-widest uppercase animate-pulse">
                AGENT WORKFORCE V2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl font-sans mt-1">
              Central operational COO brain of Olayo Fisheries. Powered by a collaborative team of digital employee agents orchestrating Lake Victoria cages, finances, carbon ratings, and Kampala transport twins.
            </p>
          </div>
        </div>

        {/* Global Stats indicators */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0 font-mono text-[11px]">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-cyan-500/10 text-center">
            <span className="text-slate-500 block text-[9px] uppercase">OI AGENTS</span>
            <span className="text-cyan-400 font-extrabold text-sm block mt-0.5">7 ACTIVE</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-cyan-500/10 text-center">
            <span className="text-slate-500 block text-[9px] uppercase">SYS CONTROL</span>
            <span className="text-teal-400 font-extrabold text-sm block mt-0.5">AUTONOMOUS</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-cyan-500/10 text-center">
            <span className="text-slate-500 block text-[9px] uppercase">SUSTAIN SCORE</span>
            <span className="text-amber-400 font-extrabold text-sm block mt-0.5">{sustainabilityScore}/100</span>
          </div>
        </div>
      </div>

      {/* QUICK SIMULATION TRIGGERS FOR INTER-AGENT COLLABORATION */}
      <div className="bg-slate-950/40 p-3.5 border border-cyan-500/10 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span className="text-[11px] font-mono text-slate-300 uppercase font-semibold">Consolidated Simulation Deck:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => triggerCollaborationSimulation('order')}
            className="px-3 py-1.5 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] rounded-lg cursor-pointer flex items-center gap-1.5"
          >
            <Play className="w-3 h-3 text-cyan-400" />
            Simulate Collaborative Order Flow
          </button>
          <button
            onClick={() => triggerCollaborationSimulation('weather')}
            className="px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-400/30 text-amber-300 font-mono text-[10px] rounded-lg cursor-pointer flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Simulate Severe Wave Alert
          </button>
        </div>
      </div>

      {/* HORIZONTAL CONTEXT & PERSONA CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Context Awareness buttons */}
        <div className="lg:col-span-6 bg-slate-950/80 p-2.5 rounded-2xl border border-cyan-500/10 flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase px-2 w-full lg:w-auto">OI Current Context:</span>
          {[
            { id: 'Operations', icon: Activity, label: 'Farm Operations' },
            { id: 'Marketplace', icon: Scale, label: 'Marketplace' },
            { id: 'Learning', icon: BookOpen, label: 'Academy' },
            { id: 'Finance', icon: Landmark, label: 'Finance Engine' },
            { id: 'Fleet', icon: Ship, label: 'Fleet Twin' }
          ].map((ctx) => {
            const Icon = ctx.icon;
            const isMatched = currentContext === ctx.id;
            return (
              <button
                key={ctx.id}
                onClick={() => setCurrentContext(ctx.id as any)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isMatched ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-transparent text-slate-400 hover:text-white'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{ctx.label}</span>
              </button>
            );
          })}
        </div>

        {/* Role-Based Intelligence selection */}
        <div className="lg:col-span-6 bg-slate-950/80 p-2.5 rounded-2xl border border-cyan-500/10 flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase px-2 w-full lg:w-auto">Advice Persona:</span>
          {['Producer', 'Fleet Manager', 'Quality Inspector', 'Finance', 'Consumer', 'Administrator'].map((role) => {
            const isMatched = activeRole === role;
            return (
              <button
                key={role}
                onClick={() => {
                  setActiveRole(role as any);
                  setMessages(prev => [
                    ...prev,
                    {
                      id: `persona-${Date.now()}`,
                      sender: 'oi',
                      text: `OI system updated to specialized **${role}** intelligence model. Ready to provide targeted guidance, risk analysis, and automated logistics support for this specific scope.`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      confidence: 0.99
                    }
                  ]);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${isMatched ? 'bg-teal-500 text-slate-950' : 'bg-transparent text-slate-400 hover:text-white'}`}
              >
                {role}
              </button>
            );
          })}
        </div>

      </div>

      {/* ADVANCED GLOBAL EXECUTIVE SEARCH */}
      <form onSubmit={handleGlobalSearch} className="bg-slate-900/40 p-4 rounded-3xl border border-cyan-500/10 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder='Ask global intelligence, e.g., "Show all inspections from June" or "Which cages exceeded mortality thresholds?"'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-cyan-500/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400/40 font-sans"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-95 text-slate-950 font-bold text-xs rounded-xl cursor-pointer w-full sm:w-auto shrink-0 transition-all uppercase tracking-wider"
        >
          Executive Search
        </button>
      </form>

      {/* Global Search Results Popup */}
      {globalSearchRes && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-cyan-950/40 border border-cyan-400/30 rounded-2xl relative font-mono text-[11px] text-cyan-300 flex justify-between items-start"
        >
          <div className="whitespace-pre-line leading-relaxed">{globalSearchRes}</div>
          <button 
            onClick={() => setGlobalSearchRes(null)}
            className="text-cyan-400/70 hover:text-white font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* CORE WORKSPACE SPLIT PANELS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE DIAGNOSTICS & PROACTIVE ADVICE (5 cols) */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Active Approvals Action Panel - "OI performs work" */}
          <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl space-y-4">
            <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
              <h3 className="font-display font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 animate-pulse" />
                Active OI Command Directives
              </h3>
              <span className="text-[8px] font-mono text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                PENDING MANAGER OK
              </span>
            </div>

            <div className="space-y-3 font-sans">
              {pendingApprovals.filter(p => p.status === 'pending').length === 0 ? (
                <div className="py-4 text-center text-slate-500 text-xs font-mono">
                  ✓ All prepared operational actions have been approved/audited.
                </div>
              ) : (
                pendingApprovals.filter(p => p.status === 'pending').map((appr) => (
                  <div key={appr.id} className="bg-slate-950/80 p-3.5 rounded-xl border border-cyan-500/10 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono text-cyan-300 uppercase block tracking-wider bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10">
                        {appr.id} • prepared by {appr.agent}
                      </span>
                    </div>
                    <strong className="text-white text-xs block">{appr.title}</strong>
                    <p className="text-[11px] text-slate-400 leading-normal">{appr.details}</p>
                    
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleApproveAction(appr.id, appr.type)}
                        className="flex-1 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-slate-950 font-black text-[10px] uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Approve & Execute
                      </button>
                      <button
                        onClick={() => handleDeclineAction(appr.id)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-red-500/20 text-red-400 font-mono text-[10px] rounded-lg transition-all cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Daily Operations Brief / Operational Advisor */}
          <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl space-y-4">
            <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
              <h3 className="font-display font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                Live Daily Operations Brief
              </h3>
              <span className="text-[8px] font-mono text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                ACTIVE BRIEF
              </span>
            </div>

            <div className="space-y-3 font-sans text-xs text-slate-300">
              <div className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-cyan-500/5">
                <span className="text-teal-400 font-black mt-0.5">●</span>
                <div>
                  <strong className="text-white block font-display">Auxiliary Cage Inspections Priority</strong>
                  <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                    Cage 3 should be inspected before noon because dissolved oxygen has gradually declined to 4.2 mg/L.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-cyan-500/5">
                <span className="text-amber-400 font-black mt-0.5">●</span>
                <div>
                  <strong className="text-white block font-display">Busia Harbour Climate Alert</strong>
                  <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                    Strong afternoon winds (gusts up to 22 knots) make harvesting unsafe after 3:00 PM today.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-cyan-500/5">
                <span className="text-cyan-400 font-black mt-0.5">●</span>
                <div>
                  <strong className="text-white block font-display">Inventory Exhaustion Warning</strong>
                  <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                    Premium floating feed inventory will reach minimum safety levels within five days.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-cyan-500/5 pt-3 flex justify-between items-center text-[10px] font-mono">
              <span className="text-slate-500 font-bold uppercase">Long-Term Memory Mode: Enabled</span>
              <button 
                onClick={() => handleSendMessage("Generate today's executive report.")}
                className="text-cyan-400 hover:text-cyan-300 font-bold"
              >
                Compile Report →
              </button>
            </div>
          </div>

          {/* Audit & Compliance Traceability ledger */}
          <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl space-y-3">
            <h3 className="font-display font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/10 pb-2">
              <Database className="w-4 h-4 text-teal-400" />
              OI Enterprise Audit Ledger
            </h3>
            <div className="space-y-2 h-[150px] overflow-y-auto pr-1">
              {auditLog.map((log, idx) => (
                <div key={idx} className="text-[10px] font-mono flex items-start gap-2 text-slate-400">
                  <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                  <span className={`px-1 py-0.2 rounded font-bold shrink-0 ${log.level === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : log.level === 'WARN' ? 'bg-amber-500/10 text-amber-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                    {log.level}
                  </span>
                  <span className="leading-normal">{log.message}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE VIEWPORTS & CONVERSATION WORKSPACE (7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Horizontal tabs menu */}
          <div className="flex gap-1 overflow-x-auto bg-slate-950 p-1 rounded-2xl border border-cyan-500/10">
            {[
              { id: 'workspace', label: 'Conversational Workspace', icon: BrainCircuit },
              { id: 'workforce', label: 'AI Workforce', icon: Users },
              { id: 'strategy', label: 'Strategic Roadmap', icon: Lightbulb },
              { id: 'ask_farm', label: 'Ask the Farm', icon: Compass },
              { id: 'reality', label: 'Farm Simulation & Twin', icon: Cpu },
              { id: 'document', label: 'Document Intelligence', icon: FileText },
              { id: 'image', label: 'Image Analyzer', icon: ImageIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${isActive ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900/30'}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE TAB VIEWPORTS */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: CONVERSATIONAL WORKSPACE */}
              {activeTab === 'workspace' && (
                <motion.div
                  key="workspace"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-slate-900/40 border border-cyan-500/10 rounded-3xl p-5 flex flex-col justify-between h-[520px]"
                >
                  {/* Messages Feed View */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 h-[350px]">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        {/* Sender Label */}
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1 px-1">
                          {msg.sender === 'user' ? 'Authorized Operator' : 'OI Core Brain'} • {msg.timestamp}
                        </span>

                        {/* Content bubble */}
                        <div className={`p-4 rounded-2xl text-xs max-w-[90%] leading-relaxed ${msg.sender === 'user' ? 'bg-cyan-950/50 border border-cyan-500/20 text-cyan-100' : 'bg-slate-950 border border-cyan-500/10 text-slate-200'}`}>
                          
                          {/* Markdown formatted printout */}
                          <div className="space-y-2 whitespace-pre-wrap leading-relaxed font-sans prose-invert">
                            {msg.text}
                          </div>

                          {/* Confidence score metadata */}
                          {msg.confidence !== undefined && (
                            <div className="mt-2.5 pt-2 border-t border-cyan-500/5 flex justify-between items-center text-[9px] font-mono text-slate-500">
                              <span>Calculation Grounded: Real Telemetry</span>
                              <span>OI Conf Score: {(msg.confidence * 100).toFixed(1)}%</span>
                            </div>
                          )}

                          {/* Proactive Decision Support Card */}
                          {msg.decisionSupport && (
                            <div className="mt-4 p-3.5 bg-gradient-to-br from-slate-950 to-cyan-950/20 rounded-xl border border-cyan-500/15 space-y-2 text-[11px] font-sans">
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] font-mono text-amber-400 uppercase tracking-widest block font-bold">Action Prepared - Requires Approval</span>
                                <span className="text-[9px] font-mono bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">{msg.decisionSupport.id}</span>
                              </div>
                              <div className="font-bold text-white leading-normal">{msg.decisionSupport.recommendation}</div>
                              
                              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-cyan-500/5 mt-1 text-[10px] text-slate-400">
                                <div>
                                  <strong className="text-slate-300 block">Why? (Explainability)</strong>
                                  {msg.decisionSupport.reason}
                                </div>
                                <div>
                                  <strong className="text-slate-300 block">Expected Outcome</strong>
                                  {msg.decisionSupport.expectedOutcome}
                                </div>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                <strong className="text-slate-300 block">Assumptions & Risks</strong>
                                {msg.decisionSupport.risks} • <span className="text-cyan-400 font-bold">Alternative:</span> {msg.decisionSupport.alternatives}
                              </div>

                              <div className="pt-2 flex gap-2">
                                <button
                                  onClick={() => handleApproveAction(msg.decisionSupport!.id, msg.decisionSupport!.type)}
                                  className="flex-1 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] uppercase rounded cursor-pointer"
                                >
                                  Authorize Now
                                </button>
                                <button
                                  onClick={() => handleDeclineAction(msg.decisionSupport!.id)}
                                  className="px-3 py-1 bg-slate-900 border border-slate-700 text-slate-400 text-[10px] uppercase rounded cursor-pointer"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    ))}
                    
                    {/* Streaming indicator */}
                    {isAiStreaming && (
                      <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] animate-pulse">
                        <Activity className="w-3.5 h-3.5 animate-spin" />
                        <span>OI brain computing vector weights...</span>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Suggested Quick Questions */}
                  <div className="flex gap-2 overflow-x-auto pb-3 border-b border-cyan-500/5 mb-3">
                    {getSuggestedQuestions().map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="bg-slate-950/80 hover:bg-slate-950 text-slate-400 hover:text-white border border-cyan-500/5 rounded-lg px-2.5 py-1.5 text-[10px] font-mono tracking-tight shrink-0 cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Input container */}
                  <div className="flex gap-2 items-center bg-slate-950 border border-cyan-500/15 p-1.5 rounded-2xl relative">
                    <button
                      onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-all ${isSpeechEnabled ? 'bg-cyan-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}
                      title="Toggle Speech Output Voice synthesis"
                    >
                      {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>

                    <input
                      type="text"
                      placeholder={`Ask OI anything about current ${currentContext} status...`}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                      }}
                      className="flex-1 bg-transparent border-none ring-0 outline-none text-xs text-white px-3 font-sans placeholder-slate-500"
                    />

                    <button
                      onClick={() => handleSendMessage()}
                      className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl cursor-pointer transition-all shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: AI WORKFORCE (ORGANIZATION SYSTEM) */}
              {activeTab === 'workforce' && (
                <motion.div
                  key="workforce"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-slate-900/40 border border-cyan-500/10 rounded-3xl p-5 space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                    <div>
                      <h3 className="font-display font-black text-white text-sm uppercase">Olayo Intelligence AI Workforce</h3>
                      <p className="text-[10px] text-slate-400 font-sans">A specialized team of digital employee agents collaborating behind the scenes on Olayo protocols.</p>
                    </div>
                    <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
                      7 AGENTS ONLINE
                    </span>
                  </div>

                  {/* Collaboration Ticker animation if active */}
                  {isSimulatingCollab && (
                    <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/20 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-cyan-300 animate-pulse flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 animate-spin" />
                          Multi-Agent Collaboration Ticker running ({collabType === 'order' ? ' Kampala Order Dispatch Protocol' : ' Severe Wave Mitigation Protocol'})...
                        </span>
                        <span className="font-mono text-slate-500 text-[10px]">Step {currentCollabStep + 1} of {collabType === 'order' ? orderCollabSteps.length : weatherCollabSteps.length}</span>
                      </div>

                      {/* Timeline flow visualizer */}
                      <div className="relative pl-6 space-y-4">
                        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-cyan-500 to-teal-500" />
                        
                        {(collabType === 'order' ? orderCollabSteps : weatherCollabSteps).map((step, idx) => {
                          const isActive = idx === currentCollabStep;
                          const isCompleted = idx < currentCollabStep;
                          return (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: isActive || isCompleted ? 1 : 0.3, x: 0 }}
                              className="relative"
                            >
                              <div className={`absolute -left-5 top-0 w-3 h-3 rounded-full flex items-center justify-center text-[7px] ${isActive ? 'bg-cyan-400 text-slate-950 animate-ping' : isCompleted ? 'bg-teal-500 text-slate-950' : 'bg-slate-800'}`}>
                                {isCompleted ? '✓' : ''}
                              </div>
                              <div className={`p-2.5 rounded-xl border ${isActive ? 'bg-cyan-950/40 border-cyan-400/40' : 'bg-slate-950/40 border-transparent'} text-xs font-sans`}>
                                <div className="flex items-center gap-1.5 font-bold text-white">
                                  <span>{step.icon}</span>
                                  <span>{step.agent}</span>
                                  <span className="text-[10px] font-mono text-cyan-300 ml-auto">{step.action}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-normal mt-0.5">{step.detail}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Grid of digital employees */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agentsList.map((agent) => (
                      <div 
                        key={agent.id}
                        className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/10 space-y-3 flex flex-col justify-between"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{agent.avatar}</span>
                            <div>
                              <strong className="text-white text-xs block font-display">{agent.name}</strong>
                              <span className="text-[10px] font-mono text-cyan-300 uppercase font-semibold">{agent.role}</span>
                            </div>
                          </div>
                          
                          {/* Live Status beacon */}
                          <div className="text-right">
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              ONLINE
                            </span>
                            <span className="text-[9px] block text-slate-500 font-mono mt-0.5">Conf: {agent.confidence}%</span>
                          </div>
                        </div>

                        {/* Personality and Expertise tags */}
                        <div className="space-y-1.5">
                          <p className="text-[11px] text-slate-400 font-sans italic">"{agent.personality}"</p>
                          <div className="flex flex-wrap gap-1">
                            {agent.expertise.map((exp, idx) => (
                              <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-500 px-2 py-0.5 rounded text-[9px] font-mono">
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Live operations details */}
                        <div className="bg-slate-900/60 p-2.5 rounded-xl space-y-1.5 text-[11px] font-sans border border-cyan-500/5">
                          <div className="flex justify-between text-slate-400">
                            <span>Current Activity:</span>
                            <span className="text-cyan-400 font-bold font-mono">{agent.statusText}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Recent Decision committed:</span>
                            <span className="text-slate-300 font-semibold">{agent.recentAction}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Current Workload index:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div className="bg-cyan-400 h-full" style={{ width: `${agent.workload}%` }} />
                              </div>
                              <span className="font-mono text-[9px] text-cyan-300">{agent.workload}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Inline custom button to consult specifically */}
                        <button
                          onClick={() => handleSendMessage(`Consult ${agent.role} regarding current ${currentContext} indicators.`)}
                          className="w-full py-1.5 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/15 text-cyan-300 font-mono text-[10px] uppercase rounded-lg transition-all cursor-pointer text-center"
                        >
                          Dispatch Consultation Directive
                        </button>
                      </div>
                    ))}
                  </div>

                </motion.div>
              )}

              {/* TAB 3: STRATEGIC ROADMAP & MEETING MODE */}
              {activeTab === 'strategy' && (
                <motion.div
                  key="strategy"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-slate-900/40 border border-cyan-500/10 rounded-3xl p-5 space-y-6"
                >
                  
                  {/* Two columns: 1. Strategic roadmap planner, 2. Meeting mode */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Strategic Planner (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="border-b border-cyan-500/10 pb-2">
                        <h3 className="font-display font-black text-white text-sm uppercase flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" />
                          OI Strategy Advisory Mode
                        </h3>
                        <p className="text-[10px] text-slate-400 font-sans">Simulate multi-year strategic roadmaps for infrastructure capital, feed optimizations, and scaling outcomes.</p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Input Strategic Objective:</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={strategyPrompt}
                            onChange={(e) => setStrategyPrompt(e.target.value)}
                            className="flex-1 bg-slate-950 border border-cyan-500/15 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                          />
                          <button
                            onClick={handleGenerateStrategy}
                            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 text-slate-950 font-black text-xs rounded-xl cursor-pointer uppercase tracking-wider shrink-0"
                          >
                            Generate Plan
                          </button>
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {isGeneratingStrategy ? (
                          <div className="py-12 flex flex-col items-center justify-center space-y-2 text-amber-400 font-mono text-xs">
                            <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                            <span>Computing multi-year capital depreciation values...</span>
                          </div>
                        ) : strategicRoadmap ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-950 p-4 rounded-2xl border border-amber-500/20 space-y-4 text-xs font-sans"
                          >
                            <div className="flex justify-between items-center border-b border-amber-500/15 pb-2">
                              <span className="font-bold text-white text-[11px] uppercase">Roadmap: {strategicRoadmap.objective}</span>
                              <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                Feasibility: {strategicRoadmap.confidenceScore}
                              </span>
                            </div>

                            <div className="space-y-3">
                              {strategicRoadmap.roadmap.map((phase: any, index: number) => (
                                <div key={index} className="border-l-2 border-amber-500/20 pl-3 space-y-1">
                                  <div className="flex justify-between font-bold text-amber-300 text-[11px]">
                                    <span>{phase.phase}</span>
                                    <span>{phase.capitalRequired}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-300 leading-normal">{phase.actions}</p>
                                  <div className="text-[10px] text-emerald-400 font-mono">Projected Impact: {phase.projectedIncrease}</div>
                                </div>
                              ))}
                            </div>

                            <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 flex justify-between items-center text-[11px]">
                              <div>
                                <span className="text-[9px] text-slate-400 font-mono uppercase block">Total Capital Commitment</span>
                                <strong className="text-white text-xs">{strategicRoadmap.financialModel.totalInvestment}</strong>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] text-slate-400 font-mono uppercase block">Expected Payback Cycle</span>
                                <strong className="text-emerald-400 text-xs">{strategicRoadmap.financialModel.paybackPeriod}</strong>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="py-12 text-center text-slate-600 text-xs bg-slate-950/40 border border-slate-800 rounded-2xl">
                            💡 Enter a custom growth target and click "Generate Plan" to compute an executive production roadmap.
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Meeting Mode (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="border-b border-cyan-500/10 pb-2">
                        <h3 className="font-display font-black text-white text-sm uppercase flex items-center gap-1.5">
                          <ClipboardList className="w-4 h-4 text-cyan-400" />
                          OI Meeting Intelligence Mode
                        </h3>
                        <p className="text-[10px] text-slate-400 font-sans">Paste sync-meeting transcripts. OI automatically extracts decisions, assigns tasks, and notifies team members.</p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Attending & Discussion Notes:</span>
                        <textarea
                          rows={4}
                          value={meetingNotes}
                          onChange={(e) => setMeetingNotes(e.target.value)}
                          className="w-full bg-slate-950 border border-cyan-500/15 rounded-xl p-3 text-xs text-white outline-none resize-none"
                        />
                      </div>

                      <button
                        onClick={handleAnalyzeMeeting}
                        className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer uppercase tracking-wider"
                      >
                        Extract Action Items & Remind
                      </button>

                      <AnimatePresence mode="wait">
                        {isAnalyzingMeeting ? (
                          <div className="py-6 flex flex-col items-center justify-center space-y-2 text-cyan-400 font-mono text-xs">
                            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                            <span>Summarizing sync voice feeds...</span>
                          </div>
                        ) : meetingSummary ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/15 space-y-3 text-xs font-sans"
                          >
                            <strong className="text-white text-[11px] uppercase block border-b border-cyan-500/10 pb-2">
                              {meetingSummary.title}
                            </strong>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{meetingSummary.summary}</p>
                            
                            <div className="space-y-2.5">
                              {meetingSummary.actionItems.map((item: any, idx: number) => (
                                <div key={idx} className="bg-slate-900 p-2.5 rounded-xl space-y-1 border border-slate-800">
                                  <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400">
                                    <span>Owner: {item.owner}</span>
                                    <span>Due: {item.deadline}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-200 font-sans leading-normal font-semibold">{item.task}</p>
                                  <span className="text-[8px] font-mono text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded">
                                    {item.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>

                  </div>

                </motion.div>
              )}

              {/* TAB 4: ASK THE FARM (LIVING SENSOR ENGINE) */}
              {activeTab === 'ask_farm' && (() => {
                const averageDO = (cages.reduce((acc, c) => acc + c.dissolvedOxygen, 0) / cages.length).toFixed(1);
                const averagepH = (cages.reduce((acc, c) => acc + c.pH, 0) / cages.length).toFixed(1);
                const overallHealth = Math.min(100, Math.max(20, Math.round(98.5 - cages.reduce((acc, c) => acc + c.mortalityRate, 0) * 8 - (activeCrisis !== 'none' ? 15 : 0))));
                const biomassGain = Math.round(cages.reduce((sum, c) => sum + c.biomass, 0) * 0.002);
                
                return (
                  <motion.div
                    key="ask_farm"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950 border border-cyan-400/30 rounded-3xl p-6 space-y-6"
                  >
                    <div className="flex justify-between items-start border-b border-cyan-500/15 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl text-slate-950">
                          <Compass className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="font-display font-black text-white text-base uppercase tracking-wider">Olayo Living Farm Protocol</h3>
                          <p className="text-[10px] text-emerald-400 font-mono tracking-tight uppercase">Speaking with the voice of Lake Victoria Aquaculture</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                        ● CAGES TRANSMITTING
                      </span>
                    </div>

                    <div className="space-y-6 text-slate-200 font-sans leading-relaxed text-sm max-w-2xl">
                      <p className="text-slate-300 font-bold">
                        "Good morning, Wahab. While you were away:
                      </p>

                      <div className="space-y-3 pl-3 border-l-2 border-emerald-500/20 font-mono text-xs text-slate-300">
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold shrink-0">05:42</span>
                          <span>• Feeding completed successfully in Cages 1, 2, 4 and 5.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold shrink-0">03:12</span>
                          <span>
                            • Overnight dissolved oxygen in Cage 3 dipped briefly to <strong className="text-amber-400">{cages[2].dissolvedOxygen} mg/L</strong> before recovering naturally.
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold shrink-0">02:15</span>
                          <span>
                            • Overnight ambient water temperature is <strong className="text-white">{cages[0].temperature}°C</strong>.
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold shrink-0">01:00</span>
                          <span>
                            • Fish cumulative biomass increased by an estimated <strong className="text-teal-400">{biomassGain} kg</strong> across our floating grids.
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold shrink-0">Status</span>
                          <span>
                            • Wind conditions are currently <strong className="text-white">{windSpeedKnots} knots</strong>. Harvest conditions remain suitable.
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold shrink-0">Outreach</span>
                          <span>• Two university group bookings confirmed for our academy platform next Tuesday.</span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-900/60 rounded-2xl border border-cyan-500/10 flex items-center justify-between">
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-mono block">Overall Farm Health Score</span>
                          <strong className="text-emerald-400 font-display font-black text-xl">{overallHealth}% ({overallHealth > 90 ? 'Excellent' : overallHealth > 75 ? 'Good' : 'Needs Attention'})</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 text-[10px] uppercase font-mono block">Evolving Biomass Potential</span>
                          <strong className="text-cyan-400 font-display font-black text-lg">{(cages.reduce((sum, c) => sum + c.biomass, 0) / 1000).toFixed(1)} Tonnes</strong>
                        </div>
                      </div>

                      <div className="border-t border-cyan-500/10 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                        <div>
                          <span className="text-slate-500 block uppercase text-[9px]">Mean Dissolved O2</span>
                          <strong className="text-emerald-400 uppercase">{averageDO} mg/L</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block uppercase text-[9px]">Water pH Mean</span>
                          <strong className="text-white">{averagepH} (Balanced)</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block uppercase text-[9px]">Escaped Fingerlings</span>
                          <strong className="text-teal-400">0% (Intact nets)</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block uppercase text-[9px]">Lake Turbidity Index</span>
                          <strong className="text-white">Optimal (Clean water)</strong>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-xs flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <p className="text-slate-300 font-sans">
                        The farm is breathing naturally. The digital twin 2.0 system is calculating growth curves and water parameters in the background continuously.
                      </p>
                    </div>
                  </motion.div>
                );
              })()}

              {/* TAB 5: DOCUMENT INTELLIGENCE */}
              {activeTab === 'document' && (
                <motion.div
                  key="document"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-slate-900/40 border border-cyan-500/10 rounded-3xl p-5 space-y-6"
                >
                  <div className="border-b border-cyan-500/10 pb-3">
                    <h3 className="font-display font-black text-white text-sm uppercase">Olayo Document Intelligence Center</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Upload invoices, inspection sheets, or export permits. OI will read, summarize and verify integrity.</p>
                  </div>

                  {/* Mock file upload selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { type: 'Invoice', label: 'Upload Feed Invoice', desc: 'Scan bills from Busia Mills' },
                      { type: 'Inspection', label: 'Upload Cage Vet Report', desc: 'Read health compliance logs' },
                      { type: 'ExportClearance', label: 'Upload Export Permit', desc: 'Extract EAC border clearances' }
                    ].map((doc) => (
                      <button
                        key={doc.type}
                        onClick={() => handleDocUpload(doc.type)}
                        className="bg-slate-950 hover:bg-slate-900 p-4 rounded-2xl border border-cyan-500/10 text-left cursor-pointer transition-all group space-y-1"
                      >
                        <Upload className="w-4 h-4 text-cyan-400 group-hover:animate-bounce" />
                        <div className="font-bold text-white text-[11px] font-sans">{doc.label}</div>
                        <p className="text-[10px] text-slate-500 leading-normal">{doc.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Scan outcomes */}
                  <AnimatePresence mode="wait">
                    {isScanningDoc ? (
                      <div className="py-12 flex flex-col items-center space-y-2 text-cyan-400 font-mono text-xs">
                        <RefreshCw className="w-8 h-8 animate-spin" />
                        <span>OCR engine digitizing metadata values...</span>
                      </div>
                    ) : docSummary ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-950 p-5 rounded-2xl border border-cyan-500/15 space-y-4 text-xs"
                      >
                        <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                          <span className="font-display font-black text-white text-xs uppercase">{docSummary.title}</span>
                          <span className="text-[9px] font-mono text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                            {docSummary.extracted.verificationStatus}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-sans">
                          <div className="space-y-2">
                            <div>
                              <span className="text-[9px] text-slate-500 font-mono uppercase block">Sourcing Agent / Issuer</span>
                              <strong className="text-white font-bold">{docSummary.extracted.supplier || docSummary.extracted.inspector || docSummary.extracted.authority}</strong>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-500 font-mono uppercase block">Date Recorded</span>
                              <strong className="text-white font-bold">{docSummary.extracted.date}</strong>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="text-[9px] text-slate-500 font-mono uppercase block">Extracted Core Metrics</span>
                              <strong className="text-cyan-300 font-bold">{docSummary.extracted.totalAmount || docSummary.extracted.healthIndex || docSummary.extracted.destination}</strong>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-500 font-mono uppercase block">Description / Items</span>
                              <p className="text-slate-400 mt-0.5 leading-relaxed">{docSummary.extracted.items || docSummary.extracted.observations || docSummary.extracted.permitId}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/10 rounded-xl space-y-1">
                          <span className="text-[9px] text-cyan-300 font-mono uppercase block">OI Strategic Insight</span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{docSummary.insights}</p>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="py-12 text-center text-slate-600 text-xs font-sans">
                        ⚠️ No invoice or regulatory certificate selected. Click a button above to run real-time document extraction.
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* TAB 6: IMAGE INTELLIGENCE */}
              {activeTab === 'image' && (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-slate-900/40 border border-cyan-500/10 rounded-3xl p-5 space-y-6"
                >
                  <div className="border-b border-cyan-500/10 pb-3">
                    <h3 className="font-display font-black text-white text-sm uppercase">Olayo Computer Vision (CV) Analyzer</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Diagnose fish photos, net damage, cage stability, or satellite algae turbidity patterns directly.</p>
                  </div>

                  {/* Interactive uploads */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { type: 'Fish', label: 'Scan Nile Tilapia Photo', desc: 'Estimate species weight & quality' },
                      { type: 'Cage', label: 'Scan Grid Struct photo', desc: 'Inspect net tension & frame health' },
                      { type: 'Drone', label: 'Scan Satellite / Drone Grid', desc: 'Analyze lake water conditions' }
                    ].map((imgOpt) => (
                      <button
                        key={imgOpt.type}
                        onClick={() => handleImageUpload(imgOpt.type)}
                        className="bg-slate-950 hover:bg-slate-900 p-4 rounded-2xl border border-cyan-500/10 text-left cursor-pointer transition-all group space-y-1"
                      >
                        <ImageIcon className="w-4 h-4 text-teal-400 group-hover:rotate-12" />
                        <div className="font-bold text-white text-[11px] font-sans">{imgOpt.label}</div>
                        <p className="text-[10px] text-slate-500 leading-normal">{imgOpt.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Analysis outcome */}
                  <AnimatePresence mode="wait">
                    {isScanningImage ? (
                      <div className="py-12 flex flex-col items-center space-y-2 text-teal-400 font-mono text-xs">
                        <Activity className="w-8 h-8 animate-pulse text-teal-400" />
                        <span>OI computer vision neural pipeline running segmentation...</span>
                      </div>
                    ) : imageAnalysis ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs"
                      >
                        {/* Left image display (4 cols) */}
                        <div className="md:col-span-4 rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/10 relative h-48 md:h-full aspect-video md:aspect-auto">
                          <img 
                            src={uploadedImageUrl!} 
                            alt={uploadedImageName!} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                          <span className="absolute bottom-2 left-2 font-mono text-[8px] bg-slate-950/80 text-cyan-300 px-1.5 py-0.5 rounded uppercase">
                            CV INPUT FEED
                          </span>
                        </div>

                        {/* Right analysis list (8 cols) */}
                        <div className="md:col-span-8 bg-slate-950 p-5 rounded-2xl border border-cyan-500/15 space-y-4">
                          <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                            <span className="font-display font-black text-white text-xs uppercase">Vision Assessment Results</span>
                            <span className="text-[9px] font-mono text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                              OI Confidence: {imageAnalysis.confidenceScore}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-sans">
                            <div>
                              <span className="text-[9px] text-slate-500 font-mono uppercase block">Identified Subject</span>
                              <strong className="text-white font-bold">{imageAnalysis.estimatedSpecies}</strong>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-500 font-mono uppercase block">Physical Weight / Metrics</span>
                              <strong className="text-white font-bold">{imageAnalysis.weightRange}</strong>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-500 font-mono uppercase block">Physical Condition Assessment</span>
                              <p className="text-slate-400 mt-0.5 leading-relaxed">{imageAnalysis.condition}</p>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-500 font-mono uppercase block">Pathology / Safety Warnings</span>
                              <p className="text-slate-400 mt-0.5 leading-relaxed">{imageAnalysis.diseaseIndicators}</p>
                            </div>
                          </div>

                          <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/10 rounded-xl space-y-1">
                            <span className="text-[9px] text-cyan-300 font-mono uppercase block">OI Recommended Direct Workflows</span>
                            <p className="text-slate-300 text-[11px] leading-relaxed">{imageAnalysis.recommendedActions}</p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="py-12 text-center text-slate-600 text-xs font-sans">
                        📸 Click a physical aquaculture sensor scan button above to run computer vision diagnostic extraction.
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* TAB 7: DIGITAL TWIN & REALITY SIMULATION */}
              {activeTab === 'reality' && (
                <motion.div
                  key="reality"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-slate-900/40 border border-cyan-500/10 rounded-3xl p-5 space-y-6"
                >
                  {/* SIMULATOR HEADER */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cyan-500/10 pb-4 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
                        <h3 className="font-display font-black text-white text-base uppercase tracking-wider">Lake Victoria Living Farm Twin 2.0</h3>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Interactive physical simulation representing actual environmental variables, seasonal cycles, and what-if scenarios in real-time.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                      <button
                        onClick={() => setIsSimulationActive(!isSimulationActive)}
                        className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition-all flex items-center gap-1.5 ${isSimulationActive ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                      >
                        <Play className={`w-3 h-3 ${isSimulationActive ? 'animate-spin' : ''}`} />
                        <span>{isSimulationActive ? 'SIMULATION RUNNING' : 'SIMULATION PAUSED'}</span>
                      </button>

                      <div className="bg-slate-950 rounded-lg border border-cyan-500/10 p-0.5 flex gap-1">
                        {[1, 5, 25].map((mult) => (
                          <button
                            key={mult}
                            onClick={() => setSimulationTimeMultiplier(mult)}
                            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${simulationTimeMultiplier === mult ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-black' : 'text-slate-500 hover:text-white'}`}
                          >
                            {mult}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* OPERATIONAL REPLAY TIMELINE SLIDER */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/10 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-[10px] text-slate-400 uppercase flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        Operational Replay Timeline
                      </span>
                      <span className="font-mono text-cyan-400 font-bold uppercase text-[10px]">
                        {operationalReplayDay === 0 ? '● LIVE PRESENT DAY (JULY 1, 2026)' : `⏪ HISTORIC RECORD: ${Math.abs(operationalReplayDay)} DAYS AGO`}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-500 font-mono">-5 Days (June 26)</span>
                      <input
                        type="range"
                        min="-5"
                        max="0"
                        step="1"
                        value={operationalReplayDay}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setOperationalReplayDay(val);
                          if (val < 0) {
                            setIsSimulationActive(false); 
                            setCages(prev => prev.map(c => ({
                              ...c,
                              avgWeight: Math.max(10, Math.round((c.avgWeight + val * 15) * 10) / 10),
                              dissolvedOxygen: Math.max(3.5, Math.min(8.2, c.dissolvedOxygen - val * 0.2)),
                              algaeIndex: Math.max(5, Math.min(100, c.algaeIndex + val * 1))
                            })));
                          } else {
                            setIsSimulationActive(true);
                          }
                          setAuditLog(prev => [
                            { timestamp: '01:48 AM', message: val === 0 ? 'Returned to live farm digital twin coordinates.' : `Rewound digital twin state to ${Math.abs(val)} days in the past. Environmental conditions loaded.`, level: 'INFO' },
                            ...prev
                          ]);
                        }}
                        className="flex-1 accent-cyan-400 h-1.5 rounded-lg bg-slate-900 cursor-pointer"
                      />
                      <span className="text-[10px] text-cyan-400 font-mono">Present</span>
                    </div>
                  </div>

                  {/* MAIN SPLIT GRID: CONTROLS & TWIN MONITOR */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT PANEL: SANBOX SETTINGS & CRISES (5 cols) */}
                    <div className="lg:col-span-5 space-y-5">
                      
                      {/* SEASONAL ENVIRONMENT MODEL */}
                      <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/10 space-y-3">
                        <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/10 pb-2">
                          <Leaf className="w-3.5 h-3.5 text-teal-400" />
                          Seasonal Environmental Matrix
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setSimulationSeason('dry');
                              setWindSpeedKnots(12);
                              setWaveHeightMeters(0.4);
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${simulationSeason === 'dry' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-transparent border-slate-800 text-slate-500'}`}
                          >
                            <span className="text-xs font-bold block">☀️ Dry / Warm Season</span>
                            <span className="text-[9px] block opacity-80 font-sans mt-0.5">Water: 26.8°C • Growth fast • Algae risks rise</span>
                          </button>
                          <button
                            onClick={() => {
                              setSimulationSeason('rainy');
                              setWindSpeedKnots(22);
                              setWaveHeightMeters(1.4);
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${simulationSeason === 'rainy' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-transparent border-slate-800 text-slate-500'}`}
                          >
                            <span className="text-xs font-bold block">🌧️ Rainy / Monsoon Season</span>
                            <span className="text-[9px] block opacity-80 font-sans mt-0.5">Water: 24.2°C • Growth slower • High winds</span>
                          </button>
                        </div>

                        {/* Interactive wind/wave sliders */}
                        <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-[9px] text-slate-400">
                          <div className="space-y-1">
                            <span>Wind Speed: <strong className="text-white">{windSpeedKnots} Knots</strong></span>
                            <input
                              type="range"
                              min="0"
                              max="35"
                              value={windSpeedKnots}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setWindSpeedKnots(val);
                                setWaveHeightMeters(Math.round((val * 0.06) * 10) / 10);
                              }}
                              className="w-full accent-teal-400"
                            />
                          </div>
                          <div className="space-y-1">
                            <span>Wave Height: <strong className="text-white">{waveHeightMeters} Meters</strong></span>
                            <input
                              type="range"
                              min="0"
                              max="3"
                              step="0.1"
                              value={waveHeightMeters}
                              onChange={(e) => setWaveHeightMeters(parseFloat(e.target.value))}
                              className="w-full accent-teal-400"
                            />
                          </div>
                        </div>
                      </div>

                      {/* WHAT-IF OPERATIONS SANDBOX */}
                      <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/10 space-y-3">
                        <div className="flex justify-between items-center border-b border-cyan-500/10 pb-2">
                          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                            What-If Sandbox Planner
                          </h4>
                          <span className="text-[8px] font-mono text-cyan-400 uppercase bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                            PROJECTIONS
                          </span>
                        </div>

                        <div className="space-y-2">
                          {[
                            { id: 'none', label: 'Baseline (Standard Operations)', desc: 'Standard feeding schedules and default solar aerators.' },
                            { id: 'feed_reduction', label: 'Reduce Feed by 5% (to save cost)', desc: 'Saves immediate cash flow but increases FCR & delays growth by 4 days.' },
                            { id: 'aeration_boost', label: 'Boost Aerator Timing by 2 hrs', desc: 'Increases dissolved oxygen (+0.8 mg/L) but requires +15% grid energy.' },
                            { id: 'new_cages', label: 'Incorporate 5 HDPE Deep Cages', desc: 'Adds $55k capital expense, triples output biomass within 18 months.' }
                          ].map((scen) => (
                            <button
                              key={scen.id}
                              onClick={() => {
                                setWhatIfScenario(scen.id as any);
                                setAuditLog(prev => [
                                  { timestamp: '01:48 AM', message: `What-If sandbox loaded scenario parameters: "${scen.label}". Projections recalculated.`, level: 'INFO' },
                                  ...prev
                                ]);
                              }}
                              className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col ${whatIfScenario === scen.id ? 'bg-cyan-500/10 border-cyan-500/30 text-white' : 'bg-transparent border-slate-900 text-slate-400 hover:border-slate-800'}`}
                            >
                              <span className="text-[11px] font-bold block">{scen.label}</span>
                              <span className="text-[9px] text-slate-500 leading-normal mt-0.5">{scen.desc}</span>
                            </button>
                          ))}
                        </div>

                        {/* Real-time What-If Projection comparison ledger */}
                        {whatIfScenario !== 'none' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-3 bg-cyan-950/20 rounded-xl border border-cyan-500/10 text-[10px] space-y-1.5 font-mono"
                          >
                            <span className="text-cyan-400 block uppercase font-bold">Recalculated Impact Ledger:</span>
                            {whatIfScenario === 'feed_reduction' && (
                              <div className="space-y-1 text-slate-300">
                                <div className="flex justify-between"><span>Immediate Feed Savings:</span><span className="text-emerald-400 font-bold">+$1,450/month</span></div>
                                <div className="flex justify-between"><span>Tilapia weight penalty:</span><span className="text-amber-400 font-bold">-32g / tilapia</span></div>
                                <div className="flex justify-between"><span>Days to target 680g:</span><span className="text-red-400 font-bold">+5 additional days</span></div>
                              </div>
                            )}
                            {whatIfScenario === 'aeration_boost' && (
                              <div className="space-y-1 text-slate-300">
                                <div className="flex justify-between"><span>O2 Saturated Index:</span><span className="text-emerald-400 font-bold">+0.8 mg/L optimal</span></div>
                                <div className="flex justify-between"><span>Biosecurity Margin:</span><span className="text-teal-400 font-bold">+4% safety buffer</span></div>
                                <div className="flex justify-between"><span>Solar Grid Draw:</span><span className="text-amber-400 font-bold">+180W carbon profile</span></div>
                              </div>
                            )}
                            {whatIfScenario === 'new_cages' && (
                              <div className="space-y-1 text-slate-300">
                                <div className="flex justify-between"><span>CAPEX Required:</span><span className="text-amber-400 font-bold">$55,000 USD</span></div>
                                <div className="flex justify-between"><span>Capacity delta:</span><span className="text-emerald-400 font-bold">+110 Tonnes ready yield</span></div>
                                <div className="flex justify-between"><span>Payback Period:</span><span className="text-teal-400 font-bold">14.8 Months from deploy</span></div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>

                      {/* INCIDENT & CRISIS SIMULATOR */}
                      <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/10 space-y-3">
                        <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/10 pb-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          Incident & Crisis Injector
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          {[
                            { id: 'algae', label: 'Algae Oxygen Plunge', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
                            { id: 'storm', label: 'Lake Victoria Storm', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' },
                            { id: 'feed_delay', label: 'Supplier Feed Delay', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
                            { id: 'outbreak', label: 'Hatchery Pathogen', color: 'text-red-400 border-red-500/20 bg-red-500/5' }
                          ].map((crisis) => (
                            <button
                              key={crisis.id}
                              onClick={() => {
                                if (activeCrisis === crisis.id) {
                                  setActiveCrisis('none');
                                  setAuditLog(prev => [{ timestamp: '01:48 AM', message: `Crisis "${crisis.label}" cleared. Restored standard parameters.`, level: 'SUCCESS' }, ...prev]);
                                } else {
                                  setActiveCrisis(crisis.id as any);
                                  if (crisis.id === 'storm') {
                                    setWindSpeedKnots(28);
                                    setWaveHeightMeters(1.9);
                                  }
                                  setAuditLog(prev => [
                                    { timestamp: '01:48 AM', message: `CRITICAL INCIDENT TRIGGERED: ${crisis.label} activated across digital twin.`, level: 'WARN' },
                                    ...prev
                                  ]);
                                }
                              }}
                              className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all font-bold ${activeCrisis === crisis.id ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-500/30' : 'border-slate-900 text-slate-400 hover:border-slate-800'}`}
                            >
                              <span>{crisis.label}</span>
                            </button>
                          ))}
                        </div>

                        {/* Crisis Coordinated Agent Response Feed */}
                        {activeCrisis !== 'none' && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-amber-950/20 p-3.5 rounded-xl border border-amber-500/30 text-[10px] space-y-2 font-mono text-amber-300"
                          >
                            <span className="font-extrabold flex items-center gap-1.5 uppercase">
                              <ShieldAlert className="w-4 h-4 animate-bounce" />
                              Coordinated Agent Safety Deployment:
                            </span>
                            {activeCrisis === 'algae' && (
                              <p className="leading-relaxed">
                                🟢 **Operations Agent**: Activated backup solar-powered aeration units on grid #3 and #7.<br/>
                                🟢 **Sustainability Agent**: Calculating lake water recovery index. Turbidity sensors engaged.
                              </p>
                            )}
                            {activeCrisis === 'storm' && (
                              <p className="leading-relaxed">
                                🟢 **Fleet Agent**: All vessels ordered into harbor. Postponed morning dispatches.<br/>
                                🟢 **Marketplace Agent**: Dispatched automated SMS updates to Entebbe B2B hospitality centers adjusting deliveries.
                              </p>
                            )}
                            {activeCrisis === 'feed_delay' && (
                              <p className="leading-relaxed">
                                🟢 **Finance Agent**: Automatically calculated cash-on-hand reserves and triggered emergency 1.5-tonne order from Jinja seed mills at localized EAC spot rates.
                              </p>
                            )}
                            {activeCrisis === 'outbreak' && (
                              <p className="leading-relaxed">
                                🟢 **Operations Agent**: Configured strict biosecurity quarantine net grids around Cage 2 nursery. Diver scheduled for veterinary cell audit tomorrow 8:00 AM.
                              </p>
                            )}
                          </motion.div>
                        )}
                      </div>

                    </div>

                    {/* RIGHT PANEL: LIVE TWIN GRID & CAGE VIEWER (7 cols) */}
                    <div className="lg:col-span-7 space-y-5">
                      
                      {/* Live Twin Grid Cards */}
                      <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/10 space-y-3">
                        <div className="flex justify-between items-center border-b border-cyan-500/10 pb-2">
                          <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-teal-400" />
                            Live Twin Telemetry Grids (8 Floating Cages)
                          </h4>
                          <span className="text-[8px] font-mono text-emerald-400 animate-pulse uppercase">
                            ● 1 Hz TRANSMITTING
                          </span>
                        </div>

                        {/* Cage Bento Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {cages.map((cage) => {
                            const isSelected = selectedCageId === cage.id;
                            const isAlarmState = cage.dissolvedOxygen < 5.5 || cage.algaeIndex > 30;
                            return (
                              <button
                                key={cage.id}
                                onClick={() => {
                                  setSelectedCageId(cage.id);
                                  setActiveTraceNode(0);
                                }}
                                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-[105px] relative overflow-hidden ${isSelected ? 'border-cyan-400 bg-cyan-500/5 ring-1 ring-cyan-500/20' : isAlarmState ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-900 bg-transparent hover:bg-slate-900/30'}`}
                              >
                                {isAlarmState && (
                                  <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                                )}
                                
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-mono text-slate-500">C-0{cage.id}</span>
                                  <div className="font-bold text-white text-[10px] truncate leading-tight">{cage.name}</div>
                                </div>

                                <div className="space-y-1 mt-1 font-mono text-[9px]">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Weight:</span>
                                    <strong className="text-cyan-300">{cage.avgWeight}g</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">O2:</span>
                                    <strong className={cage.dissolvedOxygen < 5.5 ? "text-amber-400" : "text-emerald-400"}>
                                      {cage.dissolvedOxygen} mg/L
                                    </strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">FCR:</span>
                                    <strong className="text-teal-400">{cage.fcr}</strong>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* SELECTED CAGE SPECIFIC ACTIVE TWIN LOGS */}
                      {(() => {
                        const cage = cages.find(c => c.id === selectedCageId) || cages[2];
                        return (
                          <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/10 space-y-4">
                            <div className="flex justify-between items-start border-b border-cyan-500/10 pb-3">
                              <div>
                                <span className="text-[8px] font-mono text-cyan-300 uppercase tracking-widest bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10">
                                  Active Twin: {cage.name}
                                </span>
                                <h4 className="text-white font-bold text-xs font-sans mt-1">Real-time Biology & Margin Diagnostic</h4>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] text-slate-500 font-mono uppercase block">Estimated Stock Value</span>
                                <strong className="text-emerald-400 text-sm font-mono font-black">${cage.valuation.toLocaleString()}</strong>
                              </div>
                            </div>

                            {/* Diagnostics grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                              <div className="bg-slate-900/40 p-2.5 rounded-xl border border-cyan-500/5">
                                <span className="text-slate-500 text-[8px] block uppercase">Live Biomass</span>
                                <strong className="text-white text-xs block mt-0.5">{cage.biomass.toLocaleString()} kg</strong>
                              </div>
                              <div className="bg-slate-900/40 p-2.5 rounded-xl border border-cyan-500/5">
                                <span className="text-slate-500 text-[8px] block uppercase">Water Temp</span>
                                <strong className="text-white text-xs block mt-0.5">{cage.temperature}°C</strong>
                              </div>
                              <div className="bg-slate-900/40 p-2.5 rounded-xl border border-cyan-500/5">
                                <span className="text-slate-500 text-[8px] block uppercase">Mortality Rate</span>
                                <strong className="text-red-400 text-xs block mt-0.5">{cage.mortalityRate}%</strong>
                              </div>
                              <div className="bg-slate-900/40 p-2.5 rounded-xl border border-cyan-500/5">
                                <span className="text-slate-500 text-[8px] block uppercase">Algae Saturation</span>
                                <strong className="text-white text-xs block mt-0.5">{cage.algaeIndex}%</strong>
                              </div>
                            </div>

                            {/* EXPLAINABLE DECISION TRACEABILITY GRAPH */}
                            <div className="border border-cyan-500/10 rounded-xl p-3.5 bg-cyan-950/5 space-y-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5">
                                  <BrainCircuit className="w-4 h-4 text-cyan-400 animate-pulse" />
                                  <span className="text-[10px] font-mono text-cyan-300 uppercase font-black">Explainable Recommendation Trace</span>
                                </div>
                                <button
                                  onClick={() => setTraceGraphOpen(!traceGraphOpen)}
                                  className="text-[9px] font-mono text-cyan-400 hover:text-white underline cursor-pointer"
                                >
                                  {traceGraphOpen ? 'Collapse Data Sources' : 'Trace Data Sources & Models'}
                                </button>
                              </div>

                              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                                {cage.avgWeight >= 680 
                                  ? `💡 **OI Recommendation**: Prepare harvest order immediately for **${cage.name}**. Nile Tilapia average weight (${cage.avgWeight}g) is at your preferred 680g premium price threshold.`
                                  : `💡 **OI Recommendation**: Postpone harvest of **${cage.name}** for 3 more days. Current average weight (${cage.avgWeight}g) is 5% away from your preferred 680g standard weight.`}
                              </p>

                              {traceGraphOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="pt-2 border-t border-cyan-500/15 space-y-4"
                                >
                                  {/* Visual flow diagram */}
                                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-3 bg-slate-950/80 rounded-xl px-2">
                                    {[
                                      { id: 0, title: 'Physical Sensors', desc: 'DO, Temp, pH, Weight', icon: Activity },
                                      { id: 1, title: 'Digital Twin Model', desc: 'Biological FCR projections', icon: Cpu },
                                      { id: 2, title: 'Workforce Council', desc: 'Agents cross-verify safety', icon: Users },
                                      { id: 3, title: 'CEO Gateway', desc: 'Executive profitability check', icon: ShieldCheck }
                                    ].map((node) => {
                                      const NodeIcon = node.icon;
                                      const isSelected = activeTraceNode === node.id;
                                      return (
                                        <React.Fragment key={node.id}>
                                          <button
                                            onClick={() => setActiveTraceNode(node.id)}
                                            className={`flex-1 p-2 rounded-lg text-left transition-all border cursor-pointer ${isSelected ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-transparent border-slate-900 text-slate-400 hover:border-slate-800'}`}
                                          >
                                            <div className="flex items-center gap-1">
                                              <NodeIcon className="w-3.5 h-3.5" />
                                              <span className="text-[9px] font-black uppercase tracking-wider block">{node.title}</span>
                                            </div>
                                            <p className="text-[8px] leading-tight opacity-85 mt-0.5 font-sans truncate">{node.desc}</p>
                                          </button>
                                          {node.id < 3 && <ChevronRight className="w-3 h-3 text-slate-700 shrink-0 hidden sm:block" />}
                                        </React.Fragment>
                                      );
                                    })}
                                  </div>

                                  {/* Node details */}
                                  <div className="bg-slate-950 p-3 rounded-lg border border-cyan-500/10 text-[10px] font-mono text-slate-400 leading-relaxed">
                                    {activeTraceNode === 0 && (
                                      <p>
                                        📡 **Node 0: Telemetry Inputs**: Sourced from live water level probes, fiberoptic weight grids, and dissolved oxygen sensors. Input accuracy: <strong className="text-emerald-400">99.8%</strong>. Values verified: pH {cage.pH}, Temp {cage.temperature}°C, DO {cage.dissolvedOxygen} mg/L.
                                      </p>
                                    )}
                                    {activeTraceNode === 1 && (
                                      <p>
                                        🧮 **Node 1: Digital Twin Projections**: Feeds telemetry data into biological growth models. Solves standard FCR differential equations to forecast Nile Tilapia daily weight progression. Projected error margin: <strong className="text-cyan-400">±1.4%</strong>.
                                      </p>
                                    )}
                                    {activeTraceNode === 2 && (
                                      <p>
                                        🤝 **Node 2: Multi-Agent Coordinated Verification**: **Operations Agent** checks cage density compliance; **Fleet Agent** checks Lake Victoria wave profiles; **Finance Agent** audits expected fuel/ice margin ratios.
                                      </p>
                                    )}
                                    {activeTraceNode === 3 && (
                                      <p>
                                        🦁 **Node 3: Executive Approval Gateway**: Synthesizes the decision path and packages recommendation details into a draft directive (e.g. PO or inspection schedule) waiting for director Wahab's biometric approval signature.
                                      </p>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                    </div>

                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
