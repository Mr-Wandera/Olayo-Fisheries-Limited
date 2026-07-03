import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Boat, CatchReport, Order, ColdChainFacility, SustainabilityMetrics, UserProfile, Lesson, Notification, FarmStatus } from './types';
import LivingFarmBackground from './components/LivingFarmBackground';
import Sidebar from './components/Sidebar';
import TopCommandBar from './components/TopCommandBar';
import ContextPanel from './components/ContextPanel';
import MissionControl from './components/MissionControl';
import FarmTwin from './components/FarmTwin';
import Marketplace from './components/Marketplace';
import Intelligence from './components/Intelligence';
import LearningCenter from './components/LearningCenter';
import AIPlayground from './components/AIPlayground';
import SplashExperience from './components/SplashExperience';
import CommandPalette from './components/CommandPalette';
import AmbientOI from './components/AmbientOI';
import { RippleProvider } from './components/LiquidUX';
import { CircleAlert as AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('mission');
  const [products, setProducts] = useState<Product[]>([]);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [catchReports, setCatchReports] = useState<CatchReport[]>([]);
  const [facilities, setFacilities] = useState<ColdChainFacility[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sustainability, setSustainability] = useState<SustainabilityMetrics>({
    environmentalScore: 78, carbonFootprint: 1.82, fishingQuotaUsed: 62.4, wasteReducedKg: 4250, responsibleQuotaProgress: 75
  });
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [farmStatus, setFarmStatus] = useState<FarmStatus | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr_cons', email: 'consumer@olayo.com', name: 'Sarah Jenkins', role: 'Consumer', createdAt: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);
  const [oiQuery, setOiQuery] = useState<string | undefined>(undefined);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [contextPanelOpen, setContextPanelOpen] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      const [prodsRes, boatsRes, catchesRes, facRes, ordersRes, sustRes, lessonsRes, notsRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/boats').then(r => r.json()),
        fetch('/api/catches').then(r => r.json()),
        fetch('/api/facilities').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/sustainability').then(r => r.json()),
        fetch('/api/lessons').then(r => r.json()),
        fetch('/api/notifications').then(r => r.json())
      ]);
      setProducts(prodsRes); setBoats(boatsRes); setCatchReports(catchesRes); setFacilities(facRes);
      setOrders(ordersRes); setSustainability(sustRes); setLessons(lessonsRes); setNotifications(notsRes);
    } catch (err) { console.error('Data loading error:', err); }
    finally { setLoading(false); }
  }, []);

  const fetchFarmStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/farm-status');
      const data = await res.json();
      setFarmStatus(data);
    } catch (e) { console.error('farm-status error', e); }
  }, []);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);
  useEffect(() => {
    fetchFarmStatus();
    const t = setInterval(fetchFarmStatus, 15000);
    return () => clearInterval(t);
  }, [fetchFarmStatus]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleUserCertified = async (points: number) => {
    try {
      await fetch('/api/sustainability/increase', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: 1.5 }) });
      const newCertStatus = currentUser.certified || points >= 150;
      const res = await fetch('/api/auth/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: currentUser.id, updates: { certified: newCertStatus, certifiedAt: newCertStatus ? new Date().toISOString() : undefined } }) });
      const data = await res.json();
      if (data.success) { setCurrentUser(data.user); fetchAllData(); }
    } catch (e) { console.error(e); }
  };

  const markNotificationRead = async (notId: string) => {
    try {
      await fetch('/api/notifications/read', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: notId }) });
      setNotifications(prev => prev.map(n => n.id === notId ? { ...n, isRead: true } : n));
    } catch (e) { console.error(e); }
  };

  const handleAskOI = useCallback((prompt: string) => {
    setOiQuery(prompt);
    setRecentSearches(prev => [prompt, ...prev.filter(s => s !== prompt)].slice(0, 5));
    setActiveTab('intelligence');
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  if (showSplash) {
    return (
      <RippleProvider>
        <SplashExperience onComplete={() => setShowSplash(false)} />
      </RippleProvider>
    );
  }

  // Calculate dynamic margins based on sidebar/context panel state
  const leftMargin = sidebarCollapsed ? 64 : 240;
  const rightMargin = contextPanelOpen ? 320 : 48;

  return (
    <RippleProvider>
    <div className="min-h-screen text-slate-100 font-sans relative">
      <LivingFarmBackground farmStatus={farmStatus} sustainabilityScore={sustainability.environmentalScore} />

      {/* Left sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChanged={setActiveTab}
        onAskOI={handleAskOI}
        recentSearches={recentSearches}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Top AI command bar */}
      <div style={{ marginLeft: leftMargin, marginRight: rightMargin }}>
        <TopCommandBar
          activeTab={activeTab}
          onOpenCommand={() => setCommandOpen(true)}
          onAskOI={handleAskOI}
          farmStatus={farmStatus ? { weather: farmStatus.weather, dissolvedOxygenMgL: farmStatus.dissolvedOxygenMgL, staffOnDuty: farmStatus.staffOnDuty, boatsActive: farmStatus.boatsActive, timeOfDay: farmStatus.timeOfDay, windKnots: farmStatus.windKnots, lakeTempC: farmStatus.lakeTempC } : null}
          recentSearches={recentSearches}
        />
      </div>

      {/* Right context panel */}
      <ContextPanel
        activeTab={activeTab}
        farmStatus={farmStatus}
        sustainabilityScore={sustainability.environmentalScore}
        facilities={facilities}
        onAskOI={handleAskOI}
        onNavigate={setActiveTab}
        isOpen={contextPanelOpen}
        onToggle={() => setContextPanelOpen(!contextPanelOpen)}
      />

      {/* Ambient OI orb */}
      <AmbientOI
        activeTab={activeTab}
        farmStatus={farmStatus}
        sustainabilityScore={sustainability.environmentalScore}
        onAskOI={handleAskOI}
        onNavigate={setActiveTab}
      />

      {/* Command palette */}
      <CommandPalette
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        onNavigate={setActiveTab}
        onAskOI={handleAskOI}
        recentSearches={recentSearches}
      />

      {/* Center workspace — the primary canvas */}
      <main
        className="pt-20 pb-8 z-10 transition-all duration-300"
        style={{ marginLeft: leftMargin, marginRight: rightMargin }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {activeTab === 'mission' && (
              <motion.div
                key="mission"
                initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
                exit={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                {/* Hero — minimal */}
                <section className="text-center space-y-4 max-w-3xl mx-auto py-4">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold font-mono"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> AI-First Aquaculture OS · Lake Victoria
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight"
                  >
                    The Living Enterprise <span className="text-aurora-gradient">Aquaculture OS</span>
                  </motion.h1>
                </section>

                <MissionControl sustainabilityScore={sustainability.environmentalScore} onAskOI={handleAskOI} onNavigate={setActiveTab} />

                {/* Sustainability bento */}
                <section className="space-y-4">
                  <h3 className="font-display text-white font-bold text-base sm:text-lg">Sustainability & Environmental Ledger</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Environmental Score', value: `${sustainability.environmentalScore.toFixed(1)}%`, color: 'text-emerald-400', desc: 'NEMA compliance index reflecting water quality, feed efficiency, and responsible cage management.' },
                      { label: 'Feed Conversion Ratio', value: '1.32', color: 'text-white', desc: 'Kg of feed per kg of fish produced. Industry benchmark is 1.5-2.0.' },
                      { label: 'Waste Reduced', value: `${sustainability.wasteReducedKg} kg`, color: 'text-cyan-300', desc: 'Processing byproduct redirected to fish fertilizer and animal feed.' },
                      { label: 'Carbon Footprint', value: `${sustainability.carbonFootprint} kg`, sub: 'CO₂/kg', color: 'text-white', desc: 'Cage aquaculture has significantly lower carbon footprint than wild-catch fisheries.' },
                    ].map((s, i) => (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ y: -3 }}
                        className="glass rounded-2xl p-5 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-mono text-cyan-400/60 uppercase">{s.label}</span>
                          <div className={`font-display font-extrabold text-3xl ${s.color} mt-2`}>{s.value} {s.sub && <span className="text-xs text-slate-400 font-sans">{s.sub}</span>}</div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans leading-normal mt-2">{s.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'farm' && (
              <motion.div
                key="farm"
                initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
                exit={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <FarmTwin boats={boats} facilities={facilities} onAskOI={handleAskOI} />
              </motion.div>
            )}

            {activeTab === 'marketplace' && (
              <motion.div
                key="marketplace"
                initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
                exit={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Marketplace
                  products={products}
                  currentUser={currentUser}
                  onOrderCompleted={(order) => setOrders(prev => [order, ...prev])}
                  onProductsUpdated={fetchAllData}
                  onAskOI={handleAskOI}
                />
              </motion.div>
            )}

            {activeTab === 'intelligence' && (
              <motion.div
                key="intelligence"
                initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
                exit={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <Intelligence
                  sustainabilityScore={sustainability.environmentalScore}
                  initialQuery={oiQuery}
                  onQueryConsumed={() => setOiQuery(undefined)}
                />
                {/* AI Playground — Google AI Studio inspired */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-display font-semibold text-white text-sm">AI Playground</h3>
                    <span className="text-[10px] font-mono text-slate-500">· System instructions · Thoughts · Export · Dual-panel</span>
                  </div>
                  <AIPlayground
                    initialQuery={oiQuery}
                    onQueryConsumed={() => setOiQuery(undefined)}
                    farmContext={farmStatus ? `Biomass ${(farmStatus.totalBiomassKg / 1000).toFixed(1)}t, O₂ ${farmStatus.dissolvedOxygenMgL} mg/L, ${farmStatus.activeCages} cages` : undefined}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'academy' && (
              <motion.div
                key="academy"
                initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
                exit={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <LearningCenter
                  lessons={lessons}
                  currentUser={currentUser}
                  onUserCertified={handleUserCertified}
                  onAskOI={handleAskOI}
                />
              </motion.div>
            )}

            {/* Generic workspaces — OI handles these */}
            {['reports', 'operations', 'customers', 'fleet', 'research', 'settings'].includes(activeTab) && (
              <motion.div
                key={activeTab}
                initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
                animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
                exit={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <GenericWorkspace tab={activeTab} onAskOI={handleAskOI} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Notification toast */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 max-w-xs sm:max-w-sm pointer-events-auto" style={{ marginRight: rightMargin }}>
        <AnimatePresence>
          {unreadNotificationsCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-strong rounded-2xl p-4 flex items-start gap-3 text-left border-red-500/40"
            >
              <div className="p-1.5 bg-red-500/10 rounded-lg text-red-400">
                <AlertCircle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-xs font-bold text-white flex justify-between items-center">
                  <span>Operational Alert</span>
                  <button onClick={() => markNotificationRead(notifications[0].id)} className="text-[10px] text-slate-500 hover:text-white font-mono uppercase">Dismiss</button>
                </div>
                <p className="text-[10px] text-slate-300 leading-normal font-sans">
                  {notifications.find(n => !n.isRead)?.description || 'Alert: Temperature anomaly detected.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer
        className="z-10 bg-slate-950/50 border-t border-cyan-500/15 py-4 px-6 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-center gap-2"
        style={{ marginLeft: leftMargin, marginRight: rightMargin }}
      >
        <div>© 2026 Olayo Fisheries Limited. All rights reserved.</div>
        <div className="flex gap-4">
          <span className="text-cyan-400">Busiime, Busia District, Uganda</span>
          <span>●</span>
          <span>NEMA Compliant · LVBC Accredited</span>
        </div>
      </footer>
    </div>
    </RippleProvider>
  );
}

/* ============ GENERIC WORKSPACE ============ */
function GenericWorkspace({ tab, onAskOI }: { tab: string; onAskOI: (p: string) => void }) {
  const labels: Record<string, { title: string; desc: string; icon: string }> = {
    reports: { title: 'Reports & Documents', desc: 'Generate, export, and manage operational reports.', icon: 'FileText' },
    operations: { title: 'Operations Hub', desc: 'Daily operations management — staff, feed, harvest, maintenance.', icon: 'Activity' },
    customers: { title: 'Customer Relations', desc: 'Manage buyer relationships, track orders, analyze segments.', icon: 'Users' },
    fleet: { title: 'Fleet Management', desc: 'Vessel tracking, maintenance, crew, and fuel optimization.', icon: 'Ship' },
    research: { title: 'R&D Laboratory', desc: 'Feed conversion research, water quality studies, species health.', icon: 'FlaskConical' },
    settings: { title: 'System Settings', desc: 'Configure OI behavior, preferences, permissions, integrations.', icon: 'Settings' },
  };
  const info = labels[tab] || labels.reports;

  // Tab-specific KPI data
  const kpiData: Record<string, { label: string; value: string; trend: string; color: string }[]> = {
    reports: [
      { label: 'Reports Generated', value: '47', trend: '+12 this week', color: 'text-cyan-400' },
      { label: 'Pending Exports', value: '3', trend: 'PDF, Excel, CSV', color: 'text-amber-400' },
      { label: 'Auto-Scheduled', value: '8', trend: 'Weekly + monthly', color: 'text-emerald-400' },
      { label: 'Compliance Filed', value: '100%', trend: 'NEMA + LVBC', color: 'text-teal-400' },
    ],
    operations: [
      { label: 'Staff On Duty', value: '12', trend: '2 shifts active', color: 'text-cyan-400' },
      { label: 'Feed Distributed', value: '340kg', trend: 'Today', color: 'text-emerald-400' },
      { label: 'Maintenance Open', value: '2', trend: '1 urgent', color: 'text-orange-400' },
      { label: 'Harvest Queue', value: '1', trend: 'Cage Alpha-1', color: 'text-amber-400' },
    ],
    customers: [
      { label: 'Active Customers', value: '47', trend: '+3 this month', color: 'text-cyan-400' },
      { label: 'Pending Orders', value: '12', trend: '$8,400 value', color: 'text-amber-400' },
      { label: 'Avg Order Value', value: '$839', trend: '+5.2%', color: 'text-emerald-400' },
      { label: 'Retention Rate', value: '94%', trend: 'Above target', color: 'text-teal-400' },
    ],
    fleet: [
      { label: 'Active Vessels', value: '4', trend: 'On lake now', color: 'text-emerald-400' },
      { label: 'In Maintenance', value: '1', trend: 'MV Busiime', color: 'text-orange-400' },
      { label: 'Avg Fuel', value: '72%', trend: 'Efficient', color: 'text-cyan-400' },
      { label: 'Trips Today', value: '8', trend: '+2 vs yesterday', color: 'text-amber-400' },
    ],
    research: [
      { label: 'Active Studies', value: '3', trend: 'FCR, water, disease', color: 'text-cyan-400' },
      { label: 'Data Points', value: '12.4k', trend: 'Collected', color: 'text-emerald-400' },
      { label: 'Trials Running', value: '2', trend: 'Feed formulation', color: 'text-amber-400' },
      { label: 'Publications', value: '5', trend: 'Peer-reviewed', color: 'text-teal-400' },
    ],
    settings: [
      { label: 'OI Agents', value: '6', trend: 'All active', color: 'text-cyan-400' },
      { label: 'Data Refresh', value: '15s', trend: 'Real-time', color: 'text-emerald-400' },
      { label: 'Integrations', value: '4', trend: 'NEMA, LVBC, GPS, NFC', color: 'text-amber-400' },
      { label: 'Uptime', value: '99.9%', trend: '30-day', color: 'text-teal-400' },
    ],
  };

  // Tab-specific action items
  const actionItems: Record<string, { label: string; detail: string; prompt: string; color: string }[]> = {
    reports: [
      { label: 'Generate Monthly Report', detail: 'Comprehensive operational + financial summary', prompt: 'Generate a comprehensive monthly operations report with financial analysis, environmental metrics, and production data.', color: 'text-cyan-400' },
      { label: 'NEMA Compliance Report', detail: 'Environmental compliance filing', prompt: 'Generate a NEMA environmental compliance report for this quarter.', color: 'text-emerald-400' },
      { label: 'Export Data (CSV)', detail: 'Raw telemetry export', prompt: 'Export all cage telemetry data as CSV format.', color: 'text-amber-400' },
      { label: 'Executive Summary', detail: 'Board-ready briefing', prompt: 'Create an executive summary for the board of directors covering Q2 performance.', color: 'text-teal-400' },
    ],
    operations: [
      { label: 'Staff Schedule', detail: 'View and adjust shift rotations', prompt: 'Show me the current staff schedule and suggest optimizations.', color: 'text-cyan-400' },
      { label: 'Feed Distribution Plan', detail: 'Today\'s feeding schedule', prompt: 'Generate today\'s feed distribution plan for all cages.', color: 'text-emerald-400' },
      { label: 'Maintenance Tickets', detail: '2 open — 1 urgent', prompt: 'List all open maintenance tickets and prioritize by urgency.', color: 'text-orange-400' },
      { label: 'Harvest Planning', detail: 'Cage Alpha-1 ready', prompt: 'Plan the harvest schedule for Cage Alpha-1 with logistics coordination.', color: 'text-amber-400' },
    ],
    customers: [
      { label: 'Top Buyers', detail: 'Restaurant segment analysis', prompt: 'Analyze top customers by order volume and segment by type (restaurant, retailer, exporter).', color: 'text-cyan-400' },
      { label: 'Pending Orders', detail: '12 awaiting fulfillment', prompt: 'Review all pending orders and prioritize fulfillment by urgency and value.', color: 'text-amber-400' },
      { label: 'Churn Risk Analysis', detail: 'OI predicts 2 at-risk', prompt: 'Identify customers at risk of churning and recommend retention actions.', color: 'text-orange-400' },
      { label: 'Upsell Opportunities', detail: '3 identified', prompt: 'Identify upsell opportunities for existing customers based on order history.', color: 'text-emerald-400' },
    ],
    fleet: [
      { label: 'Vessel Status', detail: '4 active, 1 maintenance', prompt: 'Provide a detailed status report for all vessels including fuel, crew, and maintenance needs.', color: 'text-cyan-400' },
      { label: 'Route Optimization', detail: 'OI fuel savings', prompt: 'Optimize vessel routes for tomorrow\'s operations to minimize fuel consumption.', color: 'text-emerald-400' },
      { label: 'Maintenance Schedule', detail: 'MV Busiime in dock', prompt: 'Generate a maintenance schedule for all vessels with priority ranking.', color: 'text-orange-400' },
      { label: 'Crew Management', detail: '12 crew across fleet', prompt: 'Review crew assignments and recommend rotations for efficiency.', color: 'text-amber-400' },
    ],
    research: [
      { label: 'FCR Study', detail: 'Feed conversion trial', prompt: 'Summarize the current feed conversion ratio study results and recommendations.', color: 'text-cyan-400' },
      { label: 'Water Quality Research', detail: 'Seasonal variation analysis', prompt: 'Analyze water quality data for seasonal patterns and predict trends.', color: 'text-emerald-400' },
      { label: 'Disease Resistance', detail: 'Selective breeding trial', prompt: 'Review the disease resistance breeding trial and provide interim analysis.', color: 'text-amber-400' },
      { label: 'Experimental Design', detail: 'OI can design trials', prompt: 'Design a new experiment to test alternative feed formulations with control groups.', color: 'text-teal-400' },
    ],
    settings: [
      { label: 'OI Behavior', detail: 'Customize system instructions', prompt: 'Help me configure OI system instructions for different roles.', color: 'text-cyan-400' },
      { label: 'Data Refresh Rate', detail: 'Currently 15 seconds', prompt: 'Explain the data refresh settings and recommend optimal intervals.', color: 'text-emerald-400' },
      { label: 'Integrations', detail: 'NEMA, LVBC, GPS, NFC', prompt: 'Review all system integrations and their current status.', color: 'text-amber-400' },
      { label: 'User Permissions', detail: 'Role-based access', prompt: 'Explain the user permission system and available roles.', color: 'text-teal-400' },
    ],
  };

  const kpis = kpiData[tab] || kpiData.reports;
  const actions = actionItems[tab] || actionItems.reports;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="font-display font-bold text-white text-lg sm:text-xl">{info.title}</h2>
          <p className="text-xs text-slate-400 font-sans mt-1">{info.desc}</p>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 200, damping: 25 }}
            whileHover={{ y: -3 }}
            className="glass-panel rounded-2xl p-4 relative overflow-hidden group cursor-default"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{k.label}</span>
            </div>
            <div className={`font-display font-extrabold text-2xl ${k.color}`}>{k.value}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">{k.trend}</div>
          </motion.div>
        ))}
      </div>

      {/* Action items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {actions.map((a, i) => (
          <motion.button
            key={a.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 + 0.2 }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onAskOI(a.prompt)}
            className="glass rounded-2xl p-4 text-left hover:border-cyan-400/30 transition-all relative overflow-hidden group"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl bg-slate-950/60 border border-cyan-500/10 shrink-0`}>
                <Sparkles className={`w-4 h-4 ${a.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{a.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{a.detail}</div>
              </div>
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                →
              </motion.div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* OI Assistant */}
      <div className="glass-luminous rounded-3xl p-5 space-y-3 liquid-glow">
        <div className="flex items-center gap-2">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30">
            <Sparkles className="w-5 h-5 text-cyan-300" />
          </motion.div>
          <div>
            <div className="font-display font-bold text-white text-sm">OI Workspace Assistant</div>
            <div className="text-[10px] font-mono text-cyan-400/60">Ask anything about {info.title}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            `Provide an overview of ${info.title}`,
            'Analyze current status',
            'Recommend next actions',
          ].map(q => (
            <button
              key={q}
              onClick={() => onAskOI(q)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/40 border border-cyan-500/10 hover:border-cyan-400/30 hover:bg-cyan-500/5 text-[11px] text-slate-300 transition-all"
            >
              {q}
              <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
