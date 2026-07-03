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
    return <SplashExperience onComplete={() => setShowSplash(false)} />;
  }

  // Calculate dynamic margins based on sidebar/context panel state
  const leftMargin = sidebarCollapsed ? 64 : 240;
  const rightMargin = contextPanelOpen ? 320 : 48;

  return (
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              >
                <FarmTwin boats={boats} facilities={facilities} onAskOI={handleAskOI} />
              </motion.div>
            )}

            {activeTab === 'marketplace' && (
              <motion.div
                key="marketplace"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
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
  );
}

/* ============ GENERIC WORKSPACE ============ */
function GenericWorkspace({ tab, onAskOI }: { tab: string; onAskOI: (p: string) => void }) {
  const labels: Record<string, { title: string; desc: string }> = {
    reports: { title: 'Reports & Documents', desc: 'Generate, export, and manage operational reports. OI can create PDF, Excel, CSV, and Word documents on demand.' },
    operations: { title: 'Operations Hub', desc: 'Daily operations management — staff schedules, feed distribution, harvest planning, and maintenance tracking.' },
    customers: { title: 'Customer Relations', desc: 'Manage buyer relationships, track orders, and analyze customer segments. OI provides churn predictions and upsell recommendations.' },
    fleet: { title: 'Fleet Management', desc: 'Vessel tracking, maintenance schedules, crew management, and fuel optimization across the Busiime fleet.' },
    research: { title: 'R&D Laboratory', desc: 'Feed conversion research, water quality studies, and species health analysis. OI assists with experimental design and data analysis.' },
    settings: { title: 'System Settings', desc: 'Configure OI behavior, system preferences, user permissions, and integration settings.' },
  };
  const info = labels[tab] || labels.reports;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3 py-8">
        <h2 className="font-display font-bold text-white text-2xl">{info.title}</h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">{info.desc}</p>
      </div>

      <div className="glass-luminous rounded-3xl p-6 space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30">
            <Sparkles className="w-5 h-5 text-cyan-300" />
          </motion.div>
          <div>
            <div className="font-display font-bold text-white text-sm">OI Workspace Assistant</div>
            <div className="text-[10px] font-mono text-cyan-400/60">Ask OI to generate content for this workspace</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            `Provide an overview of ${info.title}`,
            'Generate a detailed report',
            'Analyze current status',
            'Recommend next actions',
          ].map(q => (
            <button
              key={q}
              onClick={() => onAskOI(q)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-cyan-500/10 hover:border-cyan-400/30 hover:bg-cyan-500/5 text-xs text-slate-300 transition-all text-left"
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
