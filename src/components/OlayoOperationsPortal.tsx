import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Waves, Ship, Sun, Sunset, Moon, Anchor, Compass, Heart, BookOpen, 
  Calendar, MapPin, ShieldCheck, Flame, Users, Sparkles, Phone, FileText, 
  Download, Briefcase, Award, ArrowRight, Activity, Info, Droplets, 
  Landmark, BarChart3, LineChart, Globe, HelpCircle, MessageSquare, 
  Plus, Check, UserPlus, CheckCircle2, AlertCircle, RefreshCw, Send, 
  ChevronRight, Bookmark, Search, Wifi, WifiOff, Bell, Trash2, CheckSquare, 
  Square, Clock, Filter, FileSpreadsheet, Lock, Settings, ChevronDown, 
  DollarSign, TrendingUp, ShieldAlert, Thermometer, UserCheck
} from 'lucide-react';
import { Product, UserProfile, Order } from '../types';
import CommandCenterView from './CommandCenterView';

interface OlayoOperationsPortalProps {
  products: Product[];
  currentUser?: UserProfile;
  sustainabilityScore: number;
  onSustainbilityIncrease?: (amount: number) => void;
}

// Interfaces
interface OperationalNotification {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'System' | 'Weather' | 'Feed' | 'Health' | 'Logistics';
  isRead: boolean;
  isPinned: boolean;
  timestamp: string;
}

interface SearchRecord {
  id: string;
  type: 'Fish' | 'Customer' | 'Order' | 'Employee' | 'Cage' | 'Equipment' | 'Document' | 'Inventory';
  title: string;
  subtitle: string;
  meta: string;
}

interface FeedBatch {
  id: string;
  supplier: string;
  proteinContent: number; // %
  initialWeightKg: number;
  currentWeightKg: number;
  purchaseDate: string;
  costPerKg: number;
  expiryDate: string;
  status: 'optimal' | 'low' | 'expired';
}

interface HealthRecord {
  id: string;
  cageId: string;
  date: string;
  inspector: string;
  mortalityCount: number;
  observedStatus: 'Excellent' | 'Minor Stress' | 'Action Needed';
  diagnosis: string;
  treatmentAdministered: string;
}

interface StaffProfile {
  id: string;
  name: string;
  role: string;
  shift: string;
  attendanceStatus: 'Present' | 'Absent' | 'On Leave' | 'Standby';
  phone: string;
  emergencyContact: string;
  certified: boolean;
}

interface AssetRecord {
  id: string;
  name: string;
  category: 'Vessel' | 'Engine' | 'Aerator' | 'Net' | 'Cage' | 'Sensor';
  purchaseDate: string;
  condition: 'Excellent' | 'Good' | 'Needs Service' | 'Critical';
  hoursLogged: number;
  nextServiceHours: number;
  warrantyExpiry: string;
  estimatedReplacement: string;
}

interface ProcurementRequest {
  id: string;
  item: string;
  category: 'Feed' | 'Equipment' | 'Medical' | 'Safety' | 'Fuel';
  quantity: string;
  estimatedCost: number;
  requestedBy: string;
  status: 'Pending Approval' | 'Approved' | 'Ordered' | 'Delivered' | 'Rejected';
  supplier: string;
}

interface CRMClient {
  id: string;
  name: string;
  segment: 'Wholesaler' | 'Restaurant' | 'Hotel' | 'Exporter';
  contact: string;
  location: string;
  preferredProduct: string;
  totalVolumeKg: number;
  outstandingBalance: number;
  lastOrderDate: string;
}

interface BiosecurityCheck {
  id: string;
  timestamp: string;
  inspector: string;
  visitorLogsVerified: boolean;
  footbathSanitization: boolean;
  protectiveGearChecked: boolean;
  cageGridsDisinfected: boolean;
  restrictedAccessLocked: boolean;
  complianceRating: number; // %
}

interface SmartTask {
  id: string;
  department: 'Feeds' | 'Security' | 'Logistics' | 'Veterinary' | 'Maintenance';
  assignedTo: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  notes?: string;
  approvedBy?: string;
}

export default function OlayoOperationsPortal({
  products,
  currentUser,
  sustainabilityScore,
  onSustainbilityIncrease
}: OlayoOperationsPortalProps) {
  
  // Tab State
  const [activePortalTab, setActivePortalTab] = useState<'command' | 'daily' | 'feeds' | 'health' | 'staff' | 'assets' | 'finance' | 'crm' | 'procure' | 'biosecurity' | 'docs'>('command');

  // Search everything state
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Offline Sync State
  const [isOnline, setIsOnline] = useState(true);
  const [syncQueue, setSyncQueue] = useState<{ id: string; action: string; timestamp: string }[]>([]);
  const [showSyncLog, setShowSyncLog] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<OperationalNotification[]>([
    { id: 'n-1', title: 'Strong Winds Alert', description: 'Wind speeds rising to 24 knots in Busiime Bay. Secure cage net perimeter rings.', priority: 'high', category: 'Weather', isRead: false, isPinned: false, timestamp: '10 mins ago' },
    { id: 'n-2', title: 'Low Feed Alert (insect micro-crumbles)', description: 'Nursery feed stock level dropped below 150 kg limit.', priority: 'critical', category: 'Feed', isRead: false, isPinned: true, timestamp: '1 hour ago' },
    { id: 'n-3', title: 'Completed Health Audit: Cage-02', description: 'Prime Nile Tilapia showing high active feeding and solid standard weight curves.', priority: 'low', category: 'Health', isRead: true, isPinned: false, timestamp: '3 hours ago' },
    { id: 'n-4', title: 'Scheduled Aerator Service Overdue', description: 'Oxygen Aerator Pump P-34 requires secondary filter replacement.', priority: 'medium', category: 'System', isRead: false, isPinned: false, timestamp: 'Yesterday' },
  ]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // Subsystem States
  // 1. Feed Inventory
  const [feedInventory, setFeedInventory] = useState<FeedBatch[]>([
    { id: 'FB-983', supplier: 'Uganda Organic Feeds Ltd', proteinContent: 38, initialWeightKg: 5000, currentWeightKg: 1250, purchaseDate: '2026-06-10', costPerKg: 1.60, expiryDate: '2026-12-10', status: 'optimal' },
    { id: 'FB-984', supplier: 'Olayo Bio-insect Mill', proteinContent: 42, initialWeightKg: 2000, currentWeightKg: 180, purchaseDate: '2026-06-15', costPerKg: 1.95, expiryDate: '2026-11-15', status: 'low' },
    { id: 'FB-985', supplier: 'Entebbe Aqua Nutrients', proteinContent: 32, initialWeightKg: 4000, currentWeightKg: 3850, purchaseDate: '2026-06-25', costPerKg: 1.40, expiryDate: '2027-02-25', status: 'optimal' },
  ]);
  const [fcrModel, setFcrModel] = useState({ feedFedKg: 1250, biomassGainedKg: 910 }); // FCR = 1.37
  const [newFeedCost, setNewFeedCost] = useState('');
  const [feedLogs, setFeedLogs] = useState([
    { id: 'FL-01', date: '2026-07-01', shift: 'Morning', cageId: 'CAGE-01', feedUsedKg: 60, wastageKg: 1.2 },
    { id: 'FL-02', date: '2026-07-01', shift: 'Morning', cageId: 'CAGE-02', feedUsedKg: 70, wastageKg: 1.8 },
    { id: 'FL-03', date: '2026-06-30', shift: 'Afternoon', cageId: 'CAGE-03', feedUsedKg: 160, wastageKg: 4.5 },
  ]);

  // 2. Veterinary Health Records
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    { id: 'VR-201', cageId: 'CAGE-01', date: '2026-06-28', inspector: 'Warden Marcus Vance', mortalityCount: 2, observedStatus: 'Excellent', diagnosis: 'Optimal gill structure and dynamic oxygen intake.', treatmentAdministered: 'Routine biological inspection.' },
    { id: 'VR-202', cageId: 'CAGE-05', date: '2026-06-29', inspector: 'Dr. Abdul Wandera', mortalityCount: 8, observedStatus: 'Minor Stress', diagnosis: 'Mild fungal patch on caudal fins due to debris build-up.', treatmentAdministered: 'Conducted manual net cleaning and applied organic salinity buffer.' },
  ]);
  const [newHealthRecord, setNewHealthRecord] = useState({ cageId: 'CAGE-01', observedStatus: 'Excellent' as const, diagnosis: '', treatmentAdministered: '', mortalityCount: 0 });

  // 3. Staff Portal
  const [staffList, setStaffList] = useState<StaffProfile[]>([
    { id: 'ST-001', name: 'Dr. Abdul Wandera', role: 'Founder & CEO', shift: 'Day Shift', attendanceStatus: 'Present', phone: '+256 700 123456', emergencyContact: '+256 701 987654', certified: true },
    { id: 'ST-002', name: 'Elena Rostova', role: 'Head of Operations', shift: 'Day Shift', attendanceStatus: 'Present', phone: '+256 772 555888', emergencyContact: '+256 772 999111', certified: true },
    { id: 'ST-003', name: 'Warden Marcus Vance', role: 'Chief Lake Warden', shift: 'Day Shift', attendanceStatus: 'Present', phone: '+256 781 444333', emergencyContact: '+256 781 888777', certified: true },
    { id: 'ST-004', name: 'Robert Okello', role: 'Aquacultural Assistant', shift: 'Day Shift', attendanceStatus: 'Present', phone: '+256 752 111222', emergencyContact: '+256 752 333444', certified: true },
    { id: 'ST-005', name: 'Sarah Namubiru', role: 'Hatchery Supervisor', shift: 'Day Shift', attendanceStatus: 'Standby', phone: '+256 704 666777', emergencyContact: '+256 704 888999', certified: true },
    { id: 'ST-006', name: 'Juma Kigozi', role: 'Vessel Pilot', shift: 'Night Shift', attendanceStatus: 'On Leave', phone: '+256 711 222333', emergencyContact: '+256 711 444555', certified: true },
  ]);
  const [staffLeaveRequest, setStaffLeaveRequest] = useState({ employeeId: 'ST-004', days: '3', reason: '' });
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  // 4. Equipment Asset Records
  const [assets, setAssets] = useState<AssetRecord[]>([
    { id: 'AST-BOAT-01', name: 'MV Busia Voyager (Support Boat)', category: 'Vessel', purchaseDate: '2023-04-12', condition: 'Excellent', hoursLogged: 840, nextServiceHours: 1000, warrantyExpiry: '2027-04-12', estimatedReplacement: '2033-04-12' },
    { id: 'AST-ENG-02', name: 'Yamaha 60HP Outboard Engine', category: 'Engine', purchaseDate: '2024-02-10', condition: 'Good', hoursLogged: 420, nextServiceHours: 500, warrantyExpiry: '2026-02-10', estimatedReplacement: '2030-02-10' },
    { id: 'AST-AER-12', name: 'Nursery Fine-Bubble Aerator Grid', category: 'Aerator', purchaseDate: '2025-05-18', condition: 'Needs Service', hoursLogged: 3100, nextServiceHours: 3000, warrantyExpiry: '2026-11-18', estimatedReplacement: '2029-05-18' },
    { id: 'AST-NET-34', name: 'Knotless Polyethylene Predator Netting', category: 'Net', purchaseDate: '2024-06-20', condition: 'Excellent', hoursLogged: 0, nextServiceHours: 1200, warrantyExpiry: '2026-06-20', estimatedReplacement: '2028-06-20' },
    { id: 'AST-SENS-08', name: 'SatLink-V2 Dissolved Oxygen Sensor', category: 'Sensor', purchaseDate: '2025-11-05', condition: 'Excellent', hoursLogged: 4800, nextServiceHours: 5000, warrantyExpiry: '2027-11-05', estimatedReplacement: '2029-11-05' },
  ]);
  const [maintenanceTickets, setMaintenanceTickets] = useState([
    { id: 'TKT-101', assetId: 'AST-AER-12', date: '2026-06-25', description: 'Aspirator filter blockage resulting in minor backpressure.', cost: 120, status: 'Completed' },
    { id: 'TKT-102', assetId: 'AST-ENG-02', date: '2026-06-29', description: 'Scheduled spark plug and gear oil replacement.', cost: 85, status: 'In Progress' },
  ]);
  const [newMaintenanceRequest, setNewMaintenanceRequest] = useState({ assetId: 'AST-BOAT-01', description: '' });

  // 5. Smart Tasks list
  const [tasks, setTasks] = useState<SmartTask[]>([
    { id: 'TSK-12', department: 'Feeds', assignedTo: 'Robert Okello', title: 'Feed Ring Calibration Cage-02', description: 'Verify standard pellet delivery limits and check for bird deterrence mesh security.', deadline: '12:00 Today', priority: 'high', isCompleted: false },
    { id: 'TSK-13', department: 'Veterinary', assignedTo: 'Dr. Abdul Wandera', title: 'Nursery Spawn Water Audit', description: 'Analyze nutrient coefficient balance and conduct random gill sweep analysis on 5g Tilapia fingerlings.', deadline: '15:30 Today', priority: 'medium', isCompleted: true, approvedBy: 'Elena Rostova' },
    { id: 'TSK-14', department: 'Maintenance', assignedTo: 'Warden Marcus Vance', title: 'Anchor Chain Anchor Corrosion Check', description: 'Inspect sub-surface grid tension in Cage Rings 8-10 using underwater telemetry cameras.', deadline: '17:00 Today', priority: 'high', isCompleted: false },
    { id: 'TSK-15', department: 'Logistics', assignedTo: 'Elena Rostova', title: 'Prepare Kampala Refrigerated Dispatch', description: 'Seal shipping containers and certify sub-zero temperature logs for Hilton Delivery.', deadline: '18:00 Today', priority: 'low', isCompleted: false },
  ]);

  // 6. Procurement
  const [procurementRequests, setProcurementRequests] = useState<ProcurementRequest[]>([
    { id: 'PR-401', item: 'Extruded Tilapia Pellets (38% CP)', category: 'Feed', quantity: '5,000 kg', estimatedCost: 8000, requestedBy: 'Sarah Namubiru', status: 'Approved', supplier: 'Uganda Organic Feeds Ltd' },
    { id: 'PR-402', item: 'Yamaha Outboard Spares Kit', category: 'Equipment', quantity: '2 Packs', estimatedCost: 450, requestedBy: 'Marcus Vance', status: 'Pending Approval', supplier: 'Yamaha Motors Kampala' },
  ]);
  const [newProcRequest, setNewProcRequest] = useState({ item: '', category: 'Feed' as const, quantity: '', estimatedCost: '', supplier: '' });

  // 7. CRM Clients
  const [clients, setClients] = useState<CRMClient[]>([
    { id: 'CLI-01', name: 'Kampala Hilton DoubleTree', segment: 'Hotel', contact: 'Chef Michael Okot', location: 'Kampala', preferredProduct: 'Nile Perch Fillets', totalVolumeKg: 4500, outstandingBalance: 1250.00, lastOrderDate: '2026-06-28' },
    { id: 'CLI-02', name: 'Victoria Seafoods Wholesaler', segment: 'Wholesaler', contact: 'Haji Ibrahim Ssewankambo', location: 'Busia', preferredProduct: 'Premium Tilapia (Whole)', totalVolumeKg: 12500, outstandingBalance: 0.00, lastOrderDate: '2026-06-30' },
    { id: 'CLI-03', name: 'Serena Hotels Dining Hub', segment: 'Hotel', contact: 'Procurement Specialist Alice', location: 'Entebbe', preferredProduct: 'Smoked Nile Tilapia', totalVolumeKg: 2800, outstandingBalance: 450.00, lastOrderDate: '2026-06-15' },
  ]);
  const [newClient, setNewClient] = useState({ name: '', segment: 'Hotel' as const, contact: '', location: '', preferredProduct: '' });

  // 8. Biosecurity Log
  const [biosecurityLogs, setBiosecurityLogs] = useState<BiosecurityCheck[]>([
    { id: 'BIO-101', timestamp: '2026-06-30 08:30', inspector: 'Warden Marcus Vance', visitorLogsVerified: true, footbathSanitization: true, protectiveGearChecked: true, cageGridsDisinfected: true, restrictedAccessLocked: true, complianceRating: 100 },
    { id: 'BIO-102', timestamp: '2026-07-01 07:15', inspector: 'Robert Okello', visitorLogsVerified: true, footbathSanitization: true, protectiveGearChecked: true, cageGridsDisinfected: false, restrictedAccessLocked: true, complianceRating: 85 },
  ]);

  // Master documents lists
  const documents = [
    { name: 'NEMA Uganda Cage Permit (NEMA-2026-L-VIC)', type: 'License', size: '2.4 MB', updated: '2026-01-15' },
    { name: 'Hatchery Health Certification - Busia District', type: 'Certificate', size: '1.1 MB', updated: '2026-03-10' },
    { name: 'Olayo Fisheries Biosecurity Standards Manual v4', type: 'Policy', size: '5.8 MB', updated: '2026-05-01' },
    { name: 'EAC Customs Export Declaration - Kenya/Tanzania', type: 'Template', size: '850 KB', updated: '2026-04-18' },
    { name: 'Hilton Seafood Delivery Terms & Cold Chain Agreement', type: 'Contract', size: '3.2 MB', updated: '2026-02-12' },
  ];

  // Weather Intelligence
  const weatherState = {
    windSpeedKnots: 14.5,
    waveHeightMeters: 0.45,
    waterTempCelsius: 26.2,
    rainfallMm: 2.5,
    dissolvedOxygenLevel: 6.8,
    operationalRiskRating: 'LOW' as 'LOW' | 'MEDIUM' | 'HIGH',
    recommendations: 'Wind and wave limits are optimal for scheduled vessel operations. Feed Ring deliveries in all Lake Victoria cages are permitted.'
  };

  // Weather dynamic adjustment (Wind simulation)
  const currentRisk = weatherState.windSpeedKnots > 20 ? 'HIGH' : weatherState.windSpeedKnots > 15 ? 'MEDIUM' : 'LOW';

  // Master records for Search Bar
  const searchIndex = useMemo<SearchRecord[]>(() => {
    const results: SearchRecord[] = [];
    
    // 1. Fish
    results.push({ id: 'sp-01', type: 'Fish', title: 'Nile Tilapia (Ngege)', subtitle: 'Oreochromis niloticus', meta: 'Reared in floating rings, sweet mild flavor' });
    results.push({ id: 'sp-02', type: 'Fish', title: 'Nile Perch (Mputa)', subtitle: 'Lates niloticus', meta: 'Meaty boneless white fillets' });
    results.push({ id: 'sp-03', type: 'Fish', title: 'African Catfish (Male)', subtitle: 'Clarias gariepinus', meta: 'Robust freshwater species' });

    // 2. Customers
    clients.forEach(c => {
      results.push({ id: c.id, type: 'Customer', title: c.name, subtitle: `${c.segment} • ${c.location}`, meta: `Contact: ${c.contact} • Volume: ${c.totalVolumeKg}kg` });
    });

    // 3. Employees
    staffList.forEach(s => {
      results.push({ id: s.id, type: 'Employee', title: s.name, subtitle: s.role, meta: `${s.shift} • Phone: ${s.phone}` });
    });

    // 4. Equipment
    assets.forEach(a => {
      results.push({ id: a.id, type: 'Equipment', title: a.name, subtitle: `Category: ${a.category}`, meta: `Condition: ${a.condition} • Hours: ${a.hoursLogged}h` });
    });

    // 5. Documents
    documents.forEach((d, i) => {
      results.push({ id: `doc-${i}`, type: 'Document', title: d.name, subtitle: d.type, meta: `Size: ${d.size} • Updated: ${d.updated}` });
    });

    // 6. Cages
    results.push({ id: 'cage-1', type: 'Cage', title: 'Busiime Alpha', subtitle: 'Cage-01 (Tilapia)', meta: '15,400 fish stocked' });
    results.push({ id: 'cage-2', type: 'Cage', title: 'Busiime Beta', subtitle: 'Cage-02 (Tilapia)', meta: '14,800 fish stocked' });
    results.push({ id: 'cage-3', type: 'Cage', title: 'Busiime Gamma', subtitle: 'Cage-03 (Nile Perch)', meta: '5,200 fish stocked' });

    return results;
  }, [clients, staffList, assets]);

  // Filter matched records
  const matchedRecords = useMemo(() => {
    if (!globalSearch.trim()) return [];
    const term = globalSearch.toLowerCase();
    return searchIndex.filter(r => 
      r.title.toLowerCase().includes(term) || 
      r.subtitle.toLowerCase().includes(term) || 
      r.meta.toLowerCase().includes(term) ||
      r.type.toLowerCase().includes(term)
    );
  }, [globalSearch, searchIndex]);

  // Toggle Online / Offline Status
  const handleConnectionToggle = () => {
    setIsOnline(prev => {
      const next = !prev;
      if (!next) {
        // Just went offline
        addToSyncLog('Simulating Offline Mode. Subsequent changes are queued.');
      } else {
        // Just went online
        addToSyncLog('Synchronizing state. Compiling queued inputs...');
        setTimeout(() => {
          setSyncQueue([]);
          addToSyncLog('Synchronization fully compiled! No merge conflicts reported.');
        }, 1500);
      }
      return next;
    });
  };

  const addToSyncLog = (action: string) => {
    setSyncQueue(prev => [
      { id: 'sync-' + Math.floor(Math.random() * 10000), action, timestamp: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  // Add notification function
  const pushNotification = (title: string, desc: string, priority: OperationalNotification['priority'], cat: OperationalNotification['category']) => {
    const newN: OperationalNotification = {
      id: 'n-' + Math.floor(Math.random() * 10000),
      title,
      description: desc,
      priority,
      category: cat,
      isRead: false,
      isPinned: false,
      timestamp: 'Just now'
    };
    setNotifications(prev => [newN, ...prev]);
  };

  // Mark all read
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...withCategory(n), isRead: true })));
  };

  const withCategory = (n: OperationalNotification) => n;

  // Sync state helpers
  const handleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted, approvedBy: currentUser?.name || 'Dr. Abdul Wandera' } : t));
    const t = tasks.find(tsk => tsk.id === id);
    if (!isOnline) {
      addToSyncLog(`Task updated: ${t?.title}`);
    } else {
      pushNotification('Task Complete', `Task "${t?.title}" completed by staff.`, 'low', 'System');
    }
    if (onSustainbilityIncrease) onSustainbilityIncrease(0.5);
  };

  // Add Procurement request
  const handleAddProcurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProcRequest.item || !newProcRequest.quantity || !newProcRequest.estimatedCost) return;
    const req: ProcurementRequest = {
      id: 'PR-' + Math.floor(100 + Math.random() * 900),
      item: newProcRequest.item,
      category: newProcRequest.category,
      quantity: newProcRequest.quantity,
      estimatedCost: parseFloat(newProcRequest.estimatedCost) || 0,
      requestedBy: currentUser?.name || 'Elena Rostova',
      status: 'Pending Approval',
      supplier: newProcRequest.supplier || 'Unassigned'
    };
    setProcurementRequests(prev => [req, ...prev]);
    setNewProcRequest({ item: '', category: 'Feed', quantity: '', estimatedCost: '', supplier: '' });
    if (!isOnline) {
      addToSyncLog(`Procurement raised: ${req.item}`);
    } else {
      pushNotification('New Procurement Request', `Request raised for "${req.item}" totaling $${req.estimatedCost}.`, 'medium', 'System');
    }
  };

  // Feed conversion live calculator
  const computedFCR = useMemo(() => {
    if (fcrModel.biomassGainedKg === 0) return 0;
    return parseFloat((fcrModel.feedFedKg / fcrModel.biomassGainedKg).toFixed(2));
  }, [fcrModel]);

  // Finance aggregation metrics
  const financialTotals = useMemo(() => {
    const outstanding = clients.reduce((sum, c) => sum + c.outstandingBalance, 0);
    const feedExpenses = feedInventory.reduce((sum, b) => sum + (b.initialWeightKg * b.costPerKg), 0);
    const completedProcurementCost = procurementRequests
      .filter(p => p.status === 'Approved' || p.status === 'Delivered')
      .reduce((sum, p) => sum + p.estimatedCost, 0);

    return {
      estimatedWholesaleRev: 68500,
      outstandingInvoices: outstanding,
      totalProcurementApprovals: completedProcurementCost,
      feedInventoryAssetVal: feedExpenses,
      operatingCashFlow: 45000
    };
  }, [clients, feedInventory, procurementRequests]);

  // Biosecurity compliance logging
  const handleBiosecurityCheck = () => {
    const check: BiosecurityCheck = {
      id: 'BIO-' + Math.floor(100 + Math.random() * 900),
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(0,5),
      inspector: currentUser?.name || 'Warden Marcus Vance',
      visitorLogsVerified: true,
      footbathSanitization: true,
      protectiveGearChecked: true,
      cageGridsDisinfected: true,
      restrictedAccessLocked: true,
      complianceRating: 100
    };
    setBiosecurityLogs(prev => [check, ...prev]);
    pushNotification('Biosecurity Compliance High', 'All barriers, footwear disinfections, and locks checked and recorded.', 'low', 'Health');
    if (onSustainbilityIncrease) onSustainbilityIncrease(1.5);
  };

  return (
    <div className="space-y-8 relative">
      
      {/* ENTERPRISE PLATFORM STATUS BAR & UNIVERSAL SEARCH BAR */}
      <section className="bg-slate-900/60 border border-cyan-500/15 rounded-3xl p-5 backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        {/* Brand identity info & Offline indicator */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
            <Landmark className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white text-base">Olayo Operations Control</span>
              <div 
                onClick={handleConnectionToggle}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono cursor-pointer font-bold transition-all ${isOnline ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-400/30' : 'bg-amber-500/15 text-amber-400 border border-amber-400/30 animate-pulse'}`}
                title="Click to toggle simulated connection status"
              >
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isOnline ? 'ONLINE (CLOUD)' : 'OFFLINE MODE'}
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-none mt-1">Busia District Hub • Lake Victoria Cages Telemetry Link</p>
          </div>
        </div>

        {/* Universal search input */}
        <div className="relative w-full md:max-w-md z-30">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search fish, customers, orders, employees, cages, reports, certificates..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full bg-slate-950 border border-cyan-500/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-cyan-300 placeholder-slate-500 focus:border-cyan-400 outline-none transition-all shadow-inner"
            />
          </div>

          {/* Search match dropdown */}
          <AnimatePresence>
            {searchFocused && globalSearch.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-13 left-0 right-0 max-h-80 overflow-y-auto bg-slate-950 border border-cyan-500/20 rounded-2xl shadow-2xl p-2 space-y-1 scrollbar-thin z-50 backdrop-blur-xl"
              >
                <div className="text-[10px] font-mono text-slate-500 uppercase px-3 py-1 bg-slate-900/40 rounded-lg">
                  Matched Records ({matchedRecords.length})
                </div>
                {matchedRecords.length > 0 ? (
                  matchedRecords.map(r => (
                    <div 
                      key={r.id}
                      className="p-2.5 rounded-xl hover:bg-cyan-500/10 cursor-pointer text-left transition-all space-y-0.5 border border-transparent hover:border-cyan-500/10"
                      onClick={() => {
                        // Actionable selection response
                        setGlobalSearch('');
                        if (r.type === 'Employee') setActivePortalTab('staff');
                        if (r.type === 'Customer') setActivePortalTab('crm');
                        if (r.type === 'Equipment') setActivePortalTab('assets');
                        if (r.type === 'Document') setActivePortalTab('docs');
                        if (r.type === 'Inventory') setActivePortalTab('feeds');
                        if (r.type === 'Cage') setActivePortalTab('daily');
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white line-clamp-1">{r.title}</span>
                        <span className="text-[9px] font-mono uppercase bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                          {r.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{r.subtitle}</p>
                      <p className="text-[9px] text-slate-500 font-mono italic">{r.meta}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-500 font-mono">
                    No matching records found. Try "Tilapia", "Hilton", or "Okello".
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Synchronization Status / Logs trigger & Notifications Icon */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {syncQueue.length > 0 && (
            <button 
              onClick={() => setShowSyncLog(prev => !prev)}
              className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-xl text-xs font-mono font-bold hover:bg-amber-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Sync ({syncQueue.filter(q => q.action.includes('Task') || q.action.includes('Procurement')).length})
            </button>
          )}

          {/* Notifications Center Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationCenter(prev => !prev)}
              className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/20 text-cyan-300 hover:text-white transition-all relative cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              {notifications.some(n => !n.isRead) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>

            {/* Notification Center Tray */}
            <AnimatePresence>
              {showNotificationCenter && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-950 border border-cyan-500/20 rounded-2xl shadow-2xl p-4 space-y-3 z-50 backdrop-blur-xl"
                >
                  <div className="flex justify-between items-center border-b border-cyan-500/10 pb-2">
                    <div>
                      <h4 className="font-display font-bold text-white text-xs">Enterprise Alerts Feed</h4>
                      <p className="text-[10px] text-slate-500 font-sans">Live priority logs for Lake Victoria cages</p>
                    </div>
                    <button 
                      onClick={markAllRead} 
                      className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-3 rounded-xl border flex gap-2.5 items-start transition-all ${n.isRead ? 'bg-slate-900/20 border-cyan-500/5' : 'bg-slate-900/60 border-cyan-500/25 shadow-lg'}`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${n.priority === 'critical' ? 'bg-red-500/10 text-red-400' : n.priority === 'high' ? 'bg-orange-500/10 text-orange-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-white leading-tight">{n.title}</span>
                            <span className="text-[8px] font-mono text-slate-500 shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="text-[10px] text-slate-300 leading-relaxed font-sans">{n.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-2 border-t border-cyan-500/10">
                    <button 
                      onClick={() => {
                        setNotifications(prev => prev.filter(n => !n.isRead));
                        setShowNotificationCenter(false);
                      }} 
                      className="text-[10px] font-mono text-slate-500 hover:text-white uppercase flex items-center gap-1.5 justify-center mx-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear Read Alerts
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* OFFLINE SYNC CONFLICT LOG MODAL */}
      <AnimatePresence>
        {showSyncLog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-left">
              <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                <h4 className="font-display font-bold text-white text-base flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                  Simulated State Synchronization Log
                </h4>
                <button onClick={() => setShowSyncLog(false)} className="text-slate-400 hover:text-white text-xs font-mono font-bold">✕ Close</button>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                When offline, all tasks completed, feed logs entered, and procurements raised are saved inside localized indexDB caches. Once connectivity restores, Olayo's synchronization pipeline auto-reconciles transactions.
              </p>
              
              <div className="bg-slate-900/60 p-3 rounded-xl border border-cyan-500/5 max-h-48 overflow-y-auto space-y-2 font-mono text-[10px]">
                {syncQueue.length > 0 ? (
                  syncQueue.map(q => (
                    <div key={q.id} className="flex justify-between border-b border-cyan-500/5 pb-1 last:border-b-0">
                      <span className="text-amber-400">⚡ {q.action}</span>
                      <span className="text-slate-500">{q.timestamp}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500">No cached transactions pending sync.</div>
                )}
              </div>

              <button 
                onClick={handleConnectionToggle} 
                className="w-full py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl text-xs hover:opacity-90"
              >
                Simulate Cloud Sync Merge ({syncQueue.length} items)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OPERATIONS CATEGORY TABS CONTAINER */}
      <section className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-1.5 pb-4 border-b border-cyan-500/10">
        {[
          { id: 'command', label: 'Command Center', icon: Activity },
          { id: 'daily', label: 'Daily Operations', icon: Clock },
          { id: 'feeds', label: 'Feed Platform', icon: Flame },
          { id: 'health', label: 'Health & Vet', icon: Heart },
          { id: 'staff', label: 'Staff Shift Portal', icon: Users },
          { id: 'assets', label: 'Equipment & Log', icon: Ship },
          { id: 'procure', label: 'Procurement', icon: Landmark },
          { id: 'crm', label: 'CRM & Clients', icon: Award },
          { id: 'biosecurity', label: 'Biosecurity', icon: ShieldCheck },
          { id: 'docs', label: 'Document Locker', icon: FileText },
          { id: 'finance', label: 'Finance Overview', icon: DollarSign },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activePortalTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePortalTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-bold transition-all border ${isActive ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md' : 'bg-slate-900/40 border-cyan-500/10 text-slate-400 hover:text-white hover:bg-slate-900/60'}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </section>

      {/* CORE SUBSYSTEM RENDERING */}
      <div className="min-h-[450px]">
        <AnimatePresence mode="wait">
          
          {/* FLAGSHIP COMMAND CENTER */}
          {activePortalTab === 'command' && (
            <motion.div
              key="command"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <CommandCenterView
                products={products}
                currentUser={currentUser}
                sustainabilityScore={sustainabilityScore}
                onSustainbilityIncrease={onSustainbilityIncrease}
              />
            </motion.div>
          )}
          
          {/* SUBSYSTEM 1: DAILY OPERATIONS & WEATHER ALERTS */}
          {activePortalTab === 'daily' && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left"
            >
              {/* Daily Feed Routine list & smart tasks */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Weather warnings alerts */}
                <div className={`p-4 rounded-2xl border transition-all ${currentRisk === 'HIGH' ? 'bg-red-950/20 border-red-500/40 text-red-200' : 'bg-cyan-950/20 border-cyan-500/25 text-cyan-200'}`}>
                  <div className="flex items-center gap-2 border-b border-cyan-500/10 pb-2.5">
                    <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <h4 className="font-display font-bold text-xs">Lake Victoria Weather Intelligence & Risk Assessment</h4>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">Automated SatLink early warning diagnostics</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs font-mono">
                    <div className="bg-slate-950/40 p-2.5 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase block">Wind Velocity</span>
                      <span className="text-xs font-bold text-white block mt-0.5">{weatherState.windSpeedKnots} knots</span>
                    </div>
                    <div className="bg-slate-950/40 p-2.5 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase block">Lake Wave Height</span>
                      <span className="text-xs font-bold text-white block mt-0.5">{weatherState.waveHeightMeters}m</span>
                    </div>
                    <div className="bg-slate-950/40 p-2.5 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase block">Oxygen DO Level</span>
                      <span className="text-xs font-bold text-emerald-400 block mt-0.5">{weatherState.dissolvedOxygenLevel} mg/L</span>
                    </div>
                    <div className="bg-slate-950/40 p-2.5 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase block">Operational Risk</span>
                      <span className={`text-xs font-bold block mt-0.5 ${currentRisk === 'HIGH' ? 'text-red-400' : 'text-emerald-400'}`}>{currentRisk} RISK</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 font-sans mt-3 leading-relaxed">
                    <strong>Operational Recommendation:</strong> {weatherState.recommendations}
                  </p>
                </div>

                {/* Smart task list assigned across departments */}
                <div className="bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                    <h3 className="font-display font-bold text-white text-base flex items-center gap-1.5">
                      <CheckSquare className="w-5 h-5 text-cyan-400" />
                      Assigned Department Tasks & Active Approvals
                    </h3>
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full">
                      {tasks.filter(t => !t.isCompleted).length} pending
                    </span>
                  </div>

                  <div className="space-y-3">
                    {tasks.map(task => (
                      <div 
                        key={task.id}
                        className={`p-3.5 rounded-xl border flex gap-3 items-start justify-between transition-all ${task.isCompleted ? 'bg-slate-950/40 border-cyan-500/5' : 'bg-slate-950 border-cyan-500/25 shadow'}`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <button 
                            onClick={() => handleCompleteTask(task.id)}
                            className="p-1 rounded bg-slate-900 border border-cyan-500/20 text-cyan-400 hover:text-white mt-0.5 cursor-pointer"
                          >
                            {task.isCompleted ? <Check className="w-4 h-4 bg-cyan-500 text-slate-950 rounded" /> : <div className="w-4 h-4 border border-cyan-500/30 rounded" />}
                          </button>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{task.title}</span>
                              <span className="text-[8px] font-mono uppercase bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">
                                {task.department}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{task.description}</p>
                            
                            <div className="flex gap-4 text-[10px] font-mono text-slate-400 pt-1">
                              <span>Assignee: <strong className="text-white">{task.assignedTo}</strong></span>
                              <span>•</span>
                              <span>Due: <strong className="text-cyan-400">{task.deadline}</strong></span>
                              {task.approvedBy && (
                                <span className="text-emerald-400 font-bold">✓ Approved: {task.approvedBy}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${task.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : task.priority === 'medium' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-slate-900 text-slate-400'}`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sub-system sidebar with today's metrics and custom quick action */}
              <div className="space-y-6">
                <div className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-5 space-y-4">
                  <h3 className="font-display font-bold text-white text-sm flex items-center gap-2 border-b border-cyan-500/10 pb-2.5">
                    <Activity className="w-4.5 h-4.5 text-cyan-400" />
                    Today's Operations Summary
                  </h3>

                  <div className="space-y-3.5 text-xs font-mono">
                    <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg">
                      <span className="text-slate-400">Total feed deployed:</span>
                      <span className="text-white font-bold">480 kg</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg">
                      <span className="text-slate-400">Active personnel:</span>
                      <span className="text-emerald-400 font-bold">8 Wardens On-site</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg">
                      <span className="text-slate-400">Inspected cages:</span>
                      <span className="text-white font-bold">7 of 10</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg">
                      <span className="text-slate-400">Biosecurity clearance:</span>
                      <span className="text-emerald-400 font-bold">100% compliant</span>
                    </div>
                  </div>
                </div>

                {/* Immersion component: visual boat logs and workers */}
                <div className="bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
                  
                  <h3 className="font-display font-bold text-white text-sm flex items-center gap-2 border-b border-cyan-500/10 pb-2">
                    <Ship className="w-4.5 h-4.5 text-cyan-400" />
                    Live Logistics & Boat Logs
                  </h3>

                  <div className="space-y-3 font-mono text-[10px]">
                    <div className="bg-slate-950/60 p-2 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="text-white font-bold block">MV Olayo-01 (Feeder)</span>
                        <span className="text-slate-500">Departed: 08:15 AM</span>
                      </div>
                      <span className="text-emerald-400 font-semibold uppercase">● IN TRANSIT</span>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="text-white font-bold block">MV Busiime-03 (Harvest)</span>
                        <span className="text-slate-500">Docked: 09:30 AM</span>
                      </div>
                      <span className="text-cyan-400 font-semibold uppercase">● SECURED</span>
                    </div>
                  </div>

                  <div className="text-[10px] font-sans text-slate-400 italic">
                    💡 Re-calibrate coordinates inside the "SatLink Map" tab for active GPS tracking on Lake Victoria.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUBSYSTEM 2: FEED MANAGEMENT PLATFORM */}
          {activePortalTab === 'feeds' && (
            <motion.div
              key="feeds"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-left"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Inventory List */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                    <div>
                      <h3 className="font-display font-bold text-white text-base">Active Feed Inventory & Supplier Batches</h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">Manage and check chemical-free, organic insect-based protein stocks</p>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full font-bold">
                      Organic Grade
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {feedInventory.map(batch => (
                      <div 
                        key={batch.id}
                        className={`p-4 rounded-xl border flex flex-col justify-between h-40 ${batch.currentWeightKg < 200 ? 'bg-red-950/20 border-red-500/40' : 'bg-slate-950 border-cyan-500/10'}`}
                      >
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[9px]">
                            <span className="text-slate-500">{batch.id}</span>
                            <span className={batch.currentWeightKg < 200 ? 'text-red-400 font-bold' : 'text-cyan-300'}>
                              {batch.proteinContent}% Crude Protein
                            </span>
                          </div>
                          <h4 className="font-display font-bold text-white text-xs mt-1">{batch.supplier}</h4>
                        </div>

                        <div>
                          <div className="flex justify-between items-end">
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase">Stock Level</span>
                              <span className="text-base font-extrabold text-white block font-mono">{batch.currentWeightKg.toLocaleString()} kg</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              of {batch.initialWeightKg}kg
                            </span>
                          </div>

                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
                            <div 
                              className={`h-full rounded-full ${batch.currentWeightKg < 200 ? 'bg-red-500' : 'bg-cyan-400'}`} 
                              style={{ width: `${(batch.currentWeightKg / batch.initialWeightKg) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FCR & Nutritional Composition Tracker */}
                  <div className="bg-slate-950/40 p-4 border border-cyan-500/10 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Computed FCR (Conversion index)</span>
                      <span className="text-2xl font-extrabold text-emerald-400 mt-1 block font-mono">{computedFCR}</span>
                      <span className="text-[10px] text-slate-400 font-sans mt-1 block">Ideal target FCR: 1.20 - 1.45</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Feed Administered:</span>
                        <input
                          type="number"
                          value={fcrModel.feedFedKg}
                          onChange={(e) => setFcrModel(prev => ({ ...prev, feedFedKg: parseFloat(e.target.value) || 0 }))}
                          className="w-16 bg-slate-900 border border-cyan-500/10 rounded text-right px-1 text-white font-mono"
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Biomass Gained (kg):</span>
                        <input
                          type="number"
                          value={fcrModel.biomassGainedKg}
                          onChange={(e) => setFcrModel(prev => ({ ...prev, biomassGainedKg: parseFloat(e.target.value) || 0 }))}
                          className="w-16 bg-slate-900 border border-cyan-500/10 rounded text-right px-1 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      💡 A Feed Conversion Ratio of <strong>{computedFCR}</strong> indicates highly active nutrient assimilation inside Lake Victoria cages with minimum wastage.
                    </div>
                  </div>
                </div>

                {/* Daily Feeding Logs input */}
                <div className="bg-slate-900/60 border border-cyan-500/15 rounded-2xl p-5 space-y-4">
                  <h3 className="font-display font-bold text-white text-sm border-b border-cyan-500/10 pb-2 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Record Daily Feed Logs
                  </h3>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    pushNotification('Feed Log Appended', 'Logged 65kg feed delivery for Cage-02.', 'low', 'Feed');
                    alert('Feed logs successfully recorded.');
                  }} className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-mono block">Select Cage Location</label>
                      <select className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-slate-300">
                        <option>Cage-01 (Busiime Alpha)</option>
                        <option>Cage-02 (Busiime Beta)</option>
                        <option>Cage-03 (Busiime Gamma)</option>
                        <option>Cage-05 (Majanji Shallows)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-400 font-mono block">Weight Fed (kg)</label>
                        <input type="number" placeholder="e.g. 60" className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-white outline-none" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-400 font-mono block">Wastage (kg)</label>
                        <input type="number" step="0.1" placeholder="e.g. 1.2" className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-white outline-none" required />
                      </div>
                    </div>

                    <button type="submit" className="w-full py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-400 shadow-md">
                      Append to Feed Ledger
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUBSYSTEM 3: VETERINARY HEALTH & BIOSECURITY */}
          {activePortalTab === 'health' && (
            <motion.div
              key="health"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-left"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Vet Audits list */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                    <div>
                      <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose-400" />
                        Aquaculture Veterinary Health Logbook
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">Audit biological indicators, caudal structures, and safe organic diagnostic notes</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {healthRecords.map(rec => (
                      <div key={rec.id} className="bg-slate-950 border border-cyan-500/10 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            📌 Location: {rec.cageId}
                          </span>
                          <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${rec.observedStatus === 'Excellent' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-400/20' : 'bg-orange-500/15 text-orange-400 border border-orange-400/20'}`}>
                            {rec.observedStatus}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 font-sans space-y-1">
                          <div><strong>Diagnosis:</strong> {rec.diagnosis}</div>
                          <div><strong>Treatment:</strong> {rec.treatmentAdministered}</div>
                        </div>

                        <div className="flex justify-between font-mono text-[10px] text-slate-500 pt-2 border-t border-cyan-500/5">
                          <span>Inspector: <strong className="text-white">{rec.inspector}</strong></span>
                          <span>Mortality Count: <strong className="text-red-400">{rec.mortalityCount} fish</strong></span>
                          <span>Date: {rec.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raise Vet Incident */}
                <div className="bg-slate-900/60 border border-cyan-500/15 rounded-2xl p-5 space-y-4">
                  <h3 className="font-display font-bold text-white text-sm border-b border-cyan-500/10 pb-2">
                    Record Health Inspection
                  </h3>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const rec: HealthRecord = {
                      id: 'VR-' + Math.floor(200 + Math.random() * 800),
                      cageId: newHealthRecord.cageId,
                      date: new Date().toLocaleDateString(),
                      inspector: currentUser?.name || 'Warden Marcus Vance',
                      mortalityCount: newHealthRecord.mortalityCount,
                      observedStatus: newHealthRecord.observedStatus,
                      diagnosis: newHealthRecord.diagnosis || 'Standard active swim response. Safe margins.',
                      treatmentAdministered: newHealthRecord.treatmentAdministered || 'None required.'
                    };
                    setHealthRecords(prev => [rec, ...prev]);
                    setNewHealthRecord({ cageId: 'CAGE-01', observedStatus: 'Excellent', diagnosis: '', treatmentAdministered: '', mortalityCount: 0 });
                    pushNotification('Veterinary Audit Registered', `Logged health check for ${rec.cageId}.`, 'low', 'Health');
                    alert('Veterinary log recorded.');
                  }} className="space-y-3 text-xs">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-mono block">Cage Target</label>
                      <select 
                        value={newHealthRecord.cageId}
                        onChange={(e) => setNewHealthRecord(prev => ({ ...prev, cageId: e.target.value }))}
                        className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="CAGE-01">CAGE-01 (Tilapia)</option>
                        <option value="CAGE-02">CAGE-02 (Tilapia)</option>
                        <option value="CAGE-05">CAGE-05 (Tilapia)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-mono block">Observed Condition</label>
                      <select 
                        value={newHealthRecord.observedStatus}
                        onChange={(e) => setNewHealthRecord(prev => ({ ...prev, observedStatus: e.target.value as any }))}
                        className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Minor Stress">Minor Stress</option>
                        <option value="Action Needed">Action Needed</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-mono block">Mortality Count (24h)</label>
                      <input 
                        type="number" 
                        value={newHealthRecord.mortalityCount}
                        onChange={(e) => setNewHealthRecord(prev => ({ ...prev, mortalityCount: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-white" 
                        required 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-mono block">Diagnosis Notes</label>
                      <textarea 
                        value={newHealthRecord.diagnosis}
                        onChange={(e) => setNewHealthRecord(prev => ({ ...prev, diagnosis: e.target.value }))}
                        placeholder="e.g. Normal gill structure..." 
                        className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-white" 
                      />
                    </div>

                    <button type="submit" className="w-full py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-400 shadow-md">
                      Commit Vet Entry
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUBSYSTEM 4: STAFF & SHIFT MANAGEMENT PORTAL */}
          {activePortalTab === 'staff' && (
            <motion.div
              key="staff"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-left"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Roster list */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                    <div>
                      <h3 className="font-display font-bold text-white text-base">Employee Roster & Attendance Check-In</h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">Manage wardens, technicians, and operations personnel certifications</p>
                    </div>
                    <button 
                      onClick={() => {
                        // Mock CSV generator
                        alert('Payroll metrics compiled and exported successfully to CSV layout! (Sent to wanderaabdulwahab4@gmail.com)');
                      }}
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-cyan-400 border border-cyan-500/20 rounded-xl text-xs flex items-center gap-1.5 font-bold"
                    >
                      <FileSpreadsheet className="w-4 h-4" /> Export Payroll
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {staffList.map(s => (
                      <div key={s.id} className="bg-slate-950 p-4 rounded-xl border border-cyan-500/5 flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-display font-bold text-white text-xs">{s.name}</h4>
                          <span className="text-[10px] font-mono text-cyan-300 block">{s.role}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{s.shift} • ID: {s.id}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">Emergency: {s.emergencyContact}</span>
                        </div>

                        <div className="text-right space-y-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${s.attendanceStatus === 'Present' ? 'bg-emerald-500/15 text-emerald-400' : s.attendanceStatus === 'Standby' ? 'bg-cyan-500/15 text-cyan-300' : 'bg-slate-900 text-slate-500'}`}>
                            {s.attendanceStatus}
                          </span>
                          {s.certified && (
                            <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full block text-center font-bold">
                              ✓ Certified
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leave Requests form */}
                <div className="bg-slate-900/60 border border-cyan-500/15 rounded-2xl p-5 space-y-4">
                  <h3 className="font-display font-bold text-white text-sm border-b border-cyan-500/10 pb-2 flex items-center gap-1.5">
                    <UserCheck className="w-4.5 h-4.5 text-cyan-400" />
                    Request Shift Adjust / Leave
                  </h3>

                  {leaveSubmitted ? (
                    <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-400 font-bold space-y-2">
                      <CheckCircle2 className="w-6 h-6 mx-auto" />
                      <div>Leave Request Registered!</div>
                      <p className="text-[10px] font-normal text-slate-400">Under evaluation by Elena Rostova (Operations Head).</p>
                    </div>
                  ) : (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      setLeaveSubmitted(true);
                      pushNotification('Leave Request Filed', 'Okello Robert requested 3 days leave for urgent personal reasons.', 'low', 'System');
                    }} className="space-y-3.5 text-xs">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-400 font-mono block">Employee Name</label>
                        <select 
                          value={staffLeaveRequest.employeeId}
                          onChange={(e) => setStaffLeaveRequest(prev => ({ ...prev, employeeId: e.target.value }))}
                          className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-white"
                        >
                          {staffList.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-slate-400 font-mono block">Duration (Days)</label>
                          <input 
                            type="number" 
                            value={staffLeaveRequest.days}
                            onChange={(e) => setStaffLeaveRequest(prev => ({ ...prev, days: e.target.value }))}
                            className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-white" 
                            required 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-slate-400 font-mono block">Shift Type</label>
                          <select className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-white">
                            <option>Standard Day Shift</option>
                            <option>Night Watchman</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-400 font-mono block">Reason / Description</label>
                        <textarea 
                          placeholder="Provide details..." 
                          value={staffLeaveRequest.reason}
                          onChange={(e) => setStaffLeaveRequest(prev => ({ ...prev, reason: e.target.value }))}
                          className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-white" 
                          required 
                        />
                      </div>

                      <button type="submit" className="w-full py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-400 shadow-md">
                        Submit Leave Application
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* SUBSYSTEM 5: EQUIPMENT & LOGBOOK */}
          {activePortalTab === 'assets' && (
            <motion.div
              key="assets"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-left"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Equipment asset manager */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                    <div>
                      <h3 className="font-display font-bold text-white text-base">Commercial Equipment Ledger & Predictive Maintenance</h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">Asset logs, logged operational hours, and sub-surface cages grid monitoring</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {assets.map(asset => {
                      const ratio = asset.hoursLogged / asset.nextServiceHours;
                      return (
                        <div key={asset.id} className="bg-slate-950 p-4 rounded-xl border border-cyan-500/5 flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-display font-bold text-white text-xs">{asset.name}</h4>
                              <span className="text-[9px] font-mono uppercase bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded">
                                {asset.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {asset.id} • Warranty Expiry: {asset.warrantyExpiry}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Replacement target date: {asset.estimatedReplacement}</p>
                          </div>

                          <div className="w-full sm:w-48 space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-slate-500">Service Hours:</span>
                              <span className="text-white font-bold">{asset.hoursLogged} / {asset.nextServiceHours}h</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${ratio >= 0.9 ? 'bg-orange-500' : 'bg-cyan-400'}`} 
                                style={{ width: `${Math.min(100, ratio * 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[9px] pt-1">
                              <span className="text-slate-500">Condition:</span>
                              <span className={`font-mono font-bold ${asset.condition === 'Excellent' ? 'text-emerald-400' : asset.condition === 'Good' ? 'text-cyan-300' : 'text-orange-400 animate-pulse'}`}>
                                {asset.condition}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Report repair */}
                <div className="bg-slate-900/60 border border-cyan-500/15 rounded-2xl p-5 space-y-4">
                  <h3 className="font-display font-bold text-white text-sm border-b border-cyan-500/10 pb-2">
                    Submit Repair Ticket
                  </h3>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newMaintenanceRequest.description) return;
                    const ticket = {
                      id: 'TKT-' + Math.floor(100 + Math.random() * 900),
                      assetId: newMaintenanceRequest.assetId,
                      date: new Date().toLocaleDateString(),
                      description: newMaintenanceRequest.description,
                      cost: 150,
                      status: 'In Progress'
                    };
                    setMaintenanceTickets(prev => [ticket, ...prev]);
                    setNewMaintenanceRequest({ assetId: 'AST-BOAT-01', description: '' });
                    pushNotification('Repair Ticket Filed', `Raised request for ${ticket.assetId}.`, 'medium', 'System');
                    alert('Repair ticket registered.');
                  }} className="space-y-3.5 text-xs">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-mono block">Asset Target</label>
                      <select 
                        value={newMaintenanceRequest.assetId}
                        onChange={(e) => setNewMaintenanceRequest(prev => ({ ...prev, assetId: e.target.value }))}
                        className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-white"
                      >
                        {assets.map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-mono block">Repair / Malfunction Description</label>
                      <textarea 
                        placeholder="Detailed diagnostics..." 
                        value={newMaintenanceRequest.description}
                        onChange={(e) => setNewMaintenanceRequest(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-white h-24" 
                        required 
                      />
                    </div>

                    <button type="submit" className="w-full py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-400 shadow-md">
                      Register Ticket
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUBSYSTEM 6: PROCUREMENT */}
          {activePortalTab === 'procure' && (
            <motion.div
              key="procure"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-left"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active requests */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                    <div>
                      <h3 className="font-display font-bold text-white text-base">Aquaculture Procurement Workflows</h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">Manage, review, and approve supply chain purchase orders</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {procurementRequests.map(req => (
                      <div key={req.id} className="bg-slate-950 p-4 rounded-xl border border-cyan-500/5 flex justify-between items-center">
                        <div className="space-y-1">
                          <h4 className="font-display font-bold text-white text-xs">{req.item}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">Category: {req.category} • Supplier: {req.supplier}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Requested by: {req.requestedBy} • Volume: {req.quantity}</p>
                        </div>

                        <div className="text-right space-y-2">
                          <span className="text-sm font-bold text-white block font-mono">${req.estimatedCost.toLocaleString()}</span>
                          <span className={`text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold ${req.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-400/20' : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 animate-pulse'}`}>
                            {req.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raise Procurement Request form */}
                <div className="bg-slate-900/60 border border-cyan-500/15 rounded-2xl p-5 space-y-4">
                  <h3 className="font-display font-bold text-white text-sm border-b border-cyan-500/10 pb-2">
                    New Purchase Order Request
                  </h3>

                  <form onSubmit={handleAddProcurement} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-slate-400 font-mono block">Item name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Nursery Spawn Net Rings" 
                        value={newProcRequest.item}
                        onChange={(e) => setNewProcRequest(prev => ({ ...prev, item: e.target.value }))}
                        className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-white" 
                        required 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-400 font-mono block">Category</label>
                        <select 
                          value={newProcRequest.category}
                          onChange={(e) => setNewProcRequest(prev => ({ ...prev, category: e.target.value as any }))}
                          className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="Feed">Feed</option>
                          <option value="Equipment">Equipment</option>
                          <option value="Medical">Medical</option>
                          <option value="Safety">Safety</option>
                          <option value="Fuel">Fuel</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-400 font-mono block">Volume / Qty</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 5,000 kg" 
                          value={newProcRequest.quantity}
                          onChange={(e) => setNewProcRequest(prev => ({ ...prev, quantity: e.target.value }))}
                          className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-white" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-400 font-mono block">Cost Estimate ($)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 8000" 
                          value={newProcRequest.estimatedCost}
                          onChange={(e) => setNewProcRequest(prev => ({ ...prev, estimatedCost: e.target.value }))}
                          className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-white" 
                          required 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-400 font-mono block">Supplier Target</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Uganda Organic Feeds" 
                          value={newProcRequest.supplier}
                          onChange={(e) => setNewProcRequest(prev => ({ ...prev, supplier: e.target.value }))}
                          className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-white" 
                          required 
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-400 shadow-md">
                      Submit Procurement
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUBSYSTEM 7: CRM & EXPORT MANIFESTS */}
          {activePortalTab === 'crm' && (
            <motion.div
              key="crm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-left"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Client roster */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                    <div>
                      <h3 className="font-display font-bold text-white text-base">Customer Relations & Export Manifests</h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">Track commercial client metrics, hotel delivery agreements, and export custom declarations</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {clients.map(c => (
                      <div key={c.id} className="bg-slate-950 p-4 rounded-xl border border-cyan-500/5 flex flex-col justify-between h-44">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-display font-bold text-white text-xs">{c.name}</h4>
                            <span className="text-[8px] font-mono uppercase bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                              {c.segment}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-sans">Contact: {c.contact} • Location: {c.location}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Preferred: {c.preferredProduct}</p>
                        </div>

                        <div className="pt-2 border-t border-cyan-500/5 flex justify-between items-end text-[11px] font-mono">
                          <div>
                            <span className="text-slate-500 text-[9px] block">Outstanding Balance</span>
                            <span className={`font-bold ${c.outstandingBalance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                              ${c.outstandingBalance.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 text-[9px] block">Total Volume Reared</span>
                            <span className="text-white font-bold">{c.totalVolumeKg.toLocaleString()} kg</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Export Custom Manifest Generator */}
                <div className="bg-slate-900/60 border border-cyan-500/15 rounded-2xl p-5 space-y-4">
                  <h3 className="font-display font-bold text-white text-sm border-b border-cyan-500/10 pb-2 flex items-center gap-1.5">
                    <Globe className="w-4.5 h-4.5 text-cyan-400 animate-spin" />
                    Export Manifest Pack Generator
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-normal font-sans">
                    Generate packing list indices, commercial customs declarations, and sub-zero health certifications for customs at Vigo Customs Port (Vigo, Spain).
                  </p>

                  <div className="space-y-3.5 text-xs font-mono">
                    <button 
                      onClick={() => {
                        pushNotification('Export Manifest Generated', 'Assembled cargo manifest pack. Saved 3 certificates.', 'low', 'Logistics');
                        alert('Commercial Invoice, packing lists, and export declarations generated! File package: [OLAYO-EXP-9921-VIGO.pdf] compiled for downloads.');
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold rounded-xl text-xs hover:opacity-90 flex justify-center items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4 shrink-0" /> Generate Vigo Cargo Deck Manifest
                    </button>
                    
                    <button 
                      onClick={() => {
                        alert('EAC Customs Regional Clearance certificate registered for Kenyan Border customs posts (Busia/Malaba).');
                      }}
                      className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-cyan-500/20 text-cyan-400 font-bold rounded-xl text-xs flex justify-center items-center gap-1.5 cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-cyan-400 shrink-0" /> Raise Regional EAC Permit
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUBSYSTEM 8: BIOSECURITY BARRIER MANAGEMENT */}
          {activePortalTab === 'biosecurity' && (
            <motion.div
              key="biosecurity"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-left"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Audit checklist logs */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                    <div>
                      <h3 className="font-display font-bold text-white text-base">Biosecurity & Shoreline Disinfection Barrier Checks</h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">Track footbaths sanitizations, restricted access containment, and vehicle control logs</p>
                    </div>
                  </div>

                  <div className="space-y-3 font-sans">
                    {biosecurityLogs.map(log => (
                      <div key={log.id} className="bg-slate-950 p-4 rounded-xl border border-cyan-500/5 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white">Incident Compliance ID: {log.id}</span>
                          <span className="font-mono text-[10px] text-slate-500">{log.timestamp}</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] font-mono text-cyan-300">
                          <div className={`p-1.5 rounded text-center ${log.visitorLogsVerified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400'}`}>✓ Visitors Verified</div>
                          <div className={`p-1.5 rounded text-center ${log.footbathSanitization ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400'}`}>✓ Footbaths sanit</div>
                          <div className={`p-1.5 rounded text-center ${log.protectiveGearChecked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400'}`}>✓ Gear Cleared</div>
                          <div className={`p-1.5 rounded text-center ${log.cageGridsDisinfected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-900 text-slate-500 border border-transparent'}`}>✓ Net disinfected</div>
                          <div className={`p-1.5 rounded text-center ${log.restrictedAccessLocked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400'}`}>✓ Portals Locked</div>
                        </div>

                        <div className="flex justify-between font-mono text-[10px] text-slate-500 pt-2 border-t border-cyan-500/5">
                          <span>Inspector: <strong className="text-white">{log.inspector}</strong></span>
                          <span>Audit Rating: <strong className="text-emerald-400">{log.complianceRating}% Passing</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conduct manual biosecurity sweep */}
                <div className="bg-slate-900/60 border border-cyan-500/15 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-white text-sm border-b border-cyan-500/10 pb-2">
                      Biosecurity Command Check
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      Aquacultural safety requires strict preventative controls to isolate outside biological pathogens from nursery fingerlings and floating cage perimeters. Conduct a physical shoreline barrier audit now.
                    </p>

                    <div className="p-3 bg-slate-950/60 rounded-xl space-y-2 text-[11px] font-sans">
                      <div className="flex items-center gap-2 text-white">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Inspect nursery entry water locks.</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Validate footbath disinfection levels.</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Audit restricted access padlocks.</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleBiosecurityCheck}
                    className="w-full py-2.5 mt-4 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-cyan-400 shadow-md flex justify-center items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4.5 h-4.5" /> Log Biosecurity Sweep
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUBSYSTEM 9: DOCUMENT MANAGEMENT LOCKER */}
          {activePortalTab === 'docs' && (
            <motion.div
              key="docs"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5 space-y-4 text-left"
            >
              <div className="border-b border-cyan-500/10 pb-3">
                <h3 className="font-display font-bold text-white text-base">Olayo Document Management & Archive Locker</h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">Audit compliance licenses, NEMA environmental permissions, and certified training procedures</p>
              </div>

              <div className="space-y-2">
                {documents.map((doc, i) => (
                  <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/5 flex justify-between items-center hover:bg-slate-900/60 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg shrink-0">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-white text-xs">{doc.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">Category: {doc.type} • Updated: {doc.updated}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 font-mono text-[11px]">
                      <span className="text-slate-400">{doc.size}</span>
                      <button 
                        onClick={() => {
                          alert(`Downloading file component: [${doc.name}] from secure bucket...`);
                        }}
                        className="p-1.5 rounded bg-slate-900 hover:bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SUBSYSTEM 10: FINANCE OVERVIEW */}
          {activePortalTab === 'finance' && (
            <motion.div
              key="finance"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-left"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 border border-cyan-500/10 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400/60 uppercase">Estimated Month Revenue</span>
                    <div className="font-display font-extrabold text-2xl text-emerald-400 mt-2">
                      ${financialTotals.estimatedWholesaleRev.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-normal mt-2">Aggregated hotel, wholesaler, and restaurant invoices.</p>
                </div>

                <div className="bg-slate-900/80 border border-cyan-500/10 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400/60 uppercase">Outstanding Invoices</span>
                    <div className="font-display font-extrabold text-2xl text-rose-400 mt-2">
                      ${financialTotals.outstandingInvoices.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-normal mt-2">Client bills pending payment reconciliation.</p>
                </div>

                <div className="bg-slate-900/80 border border-cyan-500/10 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400/60 uppercase">Active Feed Asset Value</span>
                    <div className="font-display font-extrabold text-2xl text-white mt-2">
                      ${financialTotals.feedInventoryAssetVal.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-normal mt-2">Estimated cost asset values of pellet feeds currently stored.</p>
                </div>

                <div className="bg-slate-900/80 border border-cyan-500/10 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400/60 uppercase">Ecosystem Cash Reserve</span>
                    <div className="font-display font-extrabold text-2xl text-white mt-2">
                      ${financialTotals.operatingCashFlow.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-normal mt-2">Local operative banking cache reserved for Busia operations.</p>
                </div>
              </div>

              {/* Feed Conversion Efficiency & Cost graph analysis card placeholder */}
              <div className="bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-5">
                <h3 className="font-display font-bold text-white text-sm border-b border-cyan-500/10 pb-2.5 mb-4 flex items-center gap-1.5">
                  <TrendingUp className="w-4.5 h-4.5 text-cyan-400" />
                  Wholesale Procurement Cost / Margin Trends
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
                  <div className="p-4 bg-slate-950/60 rounded-xl space-y-1">
                    <span className="text-slate-500">Tilapia Farm Gate Price:</span>
                    <span className="text-base text-emerald-400 font-bold block">$5.80 / kg</span>
                    <span className="text-[10px] text-slate-400 font-sans block">Production cost ratio: 42%</span>
                  </div>
                  <div className="p-4 bg-slate-950/60 rounded-xl space-y-1">
                    <span className="text-slate-500">Nile Perch Export Price:</span>
                    <span className="text-base text-cyan-300 font-bold block">$12.50 / kg</span>
                    <span className="text-[10px] text-slate-400 font-sans block">Production cost ratio: 38%</span>
                  </div>
                  <div className="p-4 bg-slate-950/60 rounded-xl space-y-1">
                    <span className="text-slate-500">Fingerling Retail price:</span>
                    <span className="text-base text-white font-bold block">$0.15 / whole</span>
                    <span className="text-[10px] text-slate-400 font-sans block">Production cost ratio: 15%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
