import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Boat, CatchReport, Order, ColdChainFacility, SustainabilityMetrics, UserProfile, Lesson, Notification, FarmStatus } from './types';
import LivingFarmBackground from './components/LivingFarmBackground';
import CommandDock from './components/CommandDock';
import AmbientOI from './components/AmbientOI';
import MissionControl from './components/MissionControl';
import FarmTwin from './components/FarmTwin';
import Marketplace from './components/Marketplace';
import Intelligence from './components/Intelligence';
import LearningCenter from './components/LearningCenter';
import SplashExperience from './components/SplashExperience';
import CommandPalette from './components/CommandPalette';
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

  // Command palette keyboard shortcut
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

  return (
    <div className="min-h-screen text-slate-100 font-sans relative flex flex-col justify-between">
      <LivingFarmBackground farmStatus={farmStatus} sustainabilityScore={sustainability.environmentalScore} />

      <CommandDock
        activeTab={activeTab}
        onTabChanged={setActiveTab}
        onOpenCommand={() => setCommandOpen(true)}
        farmStatus={farmStatus ? { weather: farmStatus.weather, dissolvedOxygenMgL: farmStatus.dissolvedOxygenMgL, staffOnDuty: farmStatus.staffOnDuty, boatsActive: farmStatus.boatsActive, timeOfDay: farmStatus.timeOfDay, windKnots: farmStatus.windKnots, lakeTempC: farmStatus.lakeTempC } : null}
        recentSearches={recentSearches}
        onAskOI={handleAskOI}
      />

      <AmbientOI
        activeTab={activeTab}
        farmStatus={farmStatus}
        sustainabilityScore={sustainability.environmentalScore}
        onAskOI={handleAskOI}
        onNavigate={setActiveTab}
      />

      <CommandPalette
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        onNavigate={setActiveTab}
        onAskOI={handleAskOI}
        recentSearches={recentSearches}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 z-10">
        {activeTab === 'mission' && (
          <div className="space-y-10">
            {/* Hero */}
            <section className="text-center space-y-6 max-w-4xl mx-auto py-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold font-mono"
              >
                <Sparkles className="w-3.5 h-3.5" /> Cage Aquaculture · Lake Victoria · Uganda
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight"
              >
                The Living Enterprise <br />
                <span className="text-aurora-gradient">Aquaculture OS</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-sm sm:text-base text-cyan-100/70 font-sans leading-relaxed max-w-2xl mx-auto"
              >
                Olayo Fisheries Limited operates a 24/7 cage aquaculture farm on Lake Victoria in Busiime, Busia District, Uganda.
                This is the digital headquarters — live farm telemetry, digital twin, AI workforce, and marketplace in one platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-wrap justify-center gap-3 pt-2"
              >
                <button
                  onClick={() => setActiveTab('farm')}
                  className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-1 cursor-pointer"
                >
                  View Farm Digital Twin
                </button>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="px-6 py-3 rounded-xl bg-slate-900 border border-cyan-500/20 text-cyan-300 text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                >
                  Browse Marketplace
                </button>
                <button
                  onClick={() => setCommandOpen(true)}
                  className="px-6 py-3 rounded-xl bg-slate-950 border border-cyan-500/10 text-slate-400 text-xs font-bold hover:text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="font-mono">⌘K</span> Search · Ask OI
                </button>
              </motion.div>
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
          </div>
        )}

        {activeTab === 'farm' && (
          <FarmTwin boats={boats} facilities={facilities} onAskOI={handleAskOI} />
        )}

        {activeTab === 'marketplace' && (
          <Marketplace
            products={products}
            currentUser={currentUser}
            onOrderCompleted={(order) => setOrders(prev => [order, ...prev])}
            onProductsUpdated={fetchAllData}
            onAskOI={handleAskOI}
          />
        )}

        {activeTab === 'intelligence' && (
          <Intelligence
            sustainabilityScore={sustainability.environmentalScore}
            initialQuery={oiQuery}
            onQueryConsumed={() => setOiQuery(undefined)}
          />
        )}

        {activeTab === 'academy' && (
          <LearningCenter
            lessons={lessons}
            currentUser={currentUser}
            onUserCertified={handleUserCertified}
            onAskOI={handleAskOI}
          />
        )}
      </main>

      {/* Notification toast */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 max-w-xs sm:max-w-sm pointer-events-auto">
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
      <footer className="z-10 bg-slate-950/50 border-t border-cyan-500/15 py-6 px-6 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-center gap-4">
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
