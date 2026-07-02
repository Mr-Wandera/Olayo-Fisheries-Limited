import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Boat, CatchReport, Order, ColdChainFacility, SustainabilityMetrics, UserProfile, Lesson, Notification, UserRole } from './types';
import OceanBackground from './components/OceanBackground';
import Navigation from './components/Navigation';
import OceanMap from './components/OceanMap';
import SupplyChain from './components/SupplyChain';
import Marketplace from './components/Marketplace';
import LearningCenter from './components/LearningCenter';
import DashboardRoles from './components/DashboardRoles';
import AiAssistant from './components/AiAssistant';
import OlayoEcosystem from './components/OlayoEcosystem';
import CompanyProfile from './components/CompanyProfile';
import OlayoOperationsPortal from './components/OlayoOperationsPortal';
import MissionControl from './components/MissionControl';
import SplashExperience from './components/SplashExperience';
import LaunchConsole from './components/LaunchConsole';
import OlayoIntelligence from './components/OlayoIntelligence';
import { WaterRippleEffect } from './components/InteractionEngine';
import { Ship, Thermometer, ShieldCheck, Award, Info, CircleAlert as AlertCircle, Sparkles, User, BrainCircuit, Bell, Heart } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState('home');

  // Core full-stack state
  const [products, setProducts] = useState<Product[]>([]);
  const [boats, setBoats] = useState<Boat[]>([]);
  const [catchReports, setCatchReports] = useState<CatchReport[]>([]);
  const [facilities, setFacilities] = useState<ColdChainFacility[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sustainability, setSustainability] = useState<SustainabilityMetrics>({
    environmentalScore: 78,
    carbonFootprint: 1.82,
    fishingQuotaUsed: 62.4,
    wasteReducedKg: 4250,
    responsibleQuotaProgress: 75
  });
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Current logged actor state
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr_cons',
    email: 'consumer@olayo.com',
    name: 'Sarah Jenkins',
    role: 'Consumer',
    createdAt: new Date().toISOString()
  });

  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // Fetch all database metrics from backend on mount
  const fetchAllData = async () => {
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

      setProducts(prodsRes);
      setBoats(boatsRes);
      setCatchReports(catchesRes);
      setFacilities(facRes);
      setOrders(ordersRes);
      setSustainability(sustRes);
      setLessons(lessonsRes);
      setNotifications(notsRes);
    } catch (err) {
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Sync role updates on server
  const handleRoleChanged = async (newRole: UserRole) => {
    try {
      const res = await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          updates: { role: newRole }
        })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
      }
    } catch (e) {
      console.error(e);
      // Fallback local update
      setCurrentUser(prev => ({ ...prev, role: newRole }));
    }
  };

  // Submit new catch to server
  const handleCatchSubmitted = async (report: Partial<CatchReport>) => {
    try {
      const res = await fetch('/api/catches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData(); // reload
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update facility temperature on server
  const handleFacilityTempChanged = async (facId: string, temp: number) => {
    // Optimistic local update for responsive sliders
    setFacilities(prev => prev.map(f => f.id === facId ? { ...f, temp } : f));
    
    try {
      await fetch('/api/facilities/temp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: facId, temp })
      });
      // reload alerts/notifications
      const notsRes = await fetch('/api/notifications').then(r => r.json());
      setNotifications(notsRes);
    } catch (e) {
      console.error(e);
    }
  };

  // Boat drydock maintenance schedule update
  const handleBoatMaintenanceSubmitted = async (boatId: string, date: string, status: Boat['status']) => {
    try {
      const res = await fetch('/api/boats/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: boatId, date, status })
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle points earned / certificate status update
  const handleUserCertified = async (points: number) => {
    // Increase platform sustainability score as users complete courses
    try {
      await fetch('/api/sustainability/increase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1.5 })
      });
      
      const newCertStatus = currentUser.certified || points >= 150;
      
      const res = await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          updates: { 
            certified: newCertStatus,
            certifiedAt: newCertStatus ? new Date().toISOString() : undefined
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Mark notification read on server
  const markNotificationRead = async (notId: string) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notId })
      });
      setNotifications(prev => prev.map(n => n.id === notId ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  if (showSplash) {
    return <SplashExperience onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans relative flex flex-col justify-between">
      {/* Immersive Ocean Canvas background */}
      <OceanBackground sustainabilityScore={sustainability.environmentalScore} />

      {/* Global Interactive Water Ripple Engine */}
      <WaterRippleEffect />

      {/* Top sticky navigation bar */}
      <Navigation
        activeTab={activeTab}
        onTabChanged={setActiveTab}
        cartCount={0} // Marketplace will manage its own inner cart visual for responsiveness
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 z-10 space-y-8">
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Cinematic Hero */}
            <section className="text-center space-y-6 max-w-4xl mx-auto py-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold font-mono"
              >
                <Sparkles className="w-3.5 h-3.5" /> FAO-Zone Certified Sourcing
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight uppercase"
              >
                From Ocean <br />
                <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">To Plate.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-sm sm:text-base text-cyan-100/70 font-sans leading-relaxed max-w-2xl mx-auto"
              >
                Olayo Fisheries Limited is a modern, full-scale seafood enterprise platform. 
                Integrating GPS fleet telemetry, automated sub-zero cold chains, marine ecological quotas, and direct Michelin-grade digital transactions.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-wrap justify-center gap-3 pt-2"
              >
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-1 cursor-pointer"
                >
                  Procure Seafood Stock
                </button>
                <button
                  onClick={() => setActiveTab('dashboards')}
                  className="px-6 py-3 rounded-xl bg-slate-900 border border-cyan-500/20 text-cyan-300 text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                >
                  Log Vessel Catch
                </button>
              </motion.div>
            </section>

            {/* Living Mission Control — continuous farm operations */}
            <MissionControl sustainabilityScore={sustainability.environmentalScore} />

            {/* Platform Sustainability stats bento dashboard */}
            <section className="space-y-4">
              <h3 className="font-display text-white font-bold text-base sm:text-lg">Platform Ecology & Carbon Ledger</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Score */}
                <div className="bg-slate-900/80 border border-cyan-500/10 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400/60 uppercase">Oceanic Health Rating</span>
                    <div className="font-display font-extrabold text-3xl text-emerald-400 mt-2">{sustainability.environmentalScore.toFixed(1)}%</div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-normal mt-2">Scale index reflecting sustainable gear use, bycatch reductions, and healthy marine coral growth.</p>
                </div>

                {/* Quota */}
                <div className="bg-slate-900/80 border border-cyan-500/10 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400/60 uppercase">Ecosystem Quotas Used</span>
                    <div className="font-display font-extrabold text-3xl text-white mt-2">{sustainability.fishingQuotaUsed.toFixed(1)}%</div>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-3 border border-cyan-500/5">
                    <div className="h-full rounded-full bg-cyan-400" style={{ width: `${sustainability.fishingQuotaUsed}%` }} />
                  </div>
                </div>

                {/* Waste */}
                <div className="bg-slate-900/80 border border-cyan-500/10 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400/60 uppercase">Plastic Waste Reduced</span>
                    <div className="font-display font-extrabold text-3xl text-cyan-300 mt-2">{sustainability.wasteReducedKg} kg</div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-normal mt-2">Weight of single-use shipping containers replaced by Olayo biodegradable vacuum packs.</p>
                </div>

                {/* Carbon footprint */}
                <div className="bg-slate-900/80 border border-cyan-500/10 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400/60 uppercase">Carbon Footprint Index</span>
                    <div className="font-display font-extrabold text-3xl text-white mt-2">{sustainability.carbonFootprint} kg <span className="text-xs text-slate-400 font-sans">CO₂/kg</span></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-normal mt-2">Averaged transport carbon footprint audited from landing ports to dinner tables.</p>
                </div>
              </div>
            </section>

            {/* Split row: Boats telemetry summary & AI chat Co-pilot teaser */}
            <section className="pt-4">
              <OlayoEcosystem
                products={products}
                currentUser={currentUser}
                onOrderCompleted={(order) => {
                  setOrders(prev => [order, ...prev]);
                  setActiveTab('supply');
                }}
                sustainabilityScore={sustainability.environmentalScore}
                onSustainbilityIncrease={(amount) => {
                  setSustainability(prev => ({
                    ...prev,
                    environmentalScore: Math.min(100, prev.environmentalScore + amount)
                  }));
                }}
              />
            </section>
          </div>
        )}

        {/* About tab route */}
        {activeTab === 'about' && (
          <CompanyProfile />
        )}

        {/* Tab content integrations */}
        {activeTab === 'marketplace' && (
          <Marketplace
            products={products}
            currentUser={currentUser}
            onOrderCompleted={(order) => {
              setOrders(prev => [order, ...prev]);
              setActiveTab('supply');
            }}
            onProductsUpdated={fetchAllData}
          />
        )}

        {activeTab === 'map' && (
          <OceanMap
            boats={boats}
            catchReports={catchReports}
          />
        )}

        {activeTab === 'supply' && (
          <div className="space-y-6">
            <SupplyChain
              orders={orders}
            />
          </div>
        )}

        {activeTab === 'academy' && (
          <LearningCenter
            lessons={lessons}
            currentUser={currentUser}
            onUserCertified={handleUserCertified}
          />
        )}

        {activeTab === 'operations' && (
          <OlayoOperationsPortal
            products={products}
            currentUser={currentUser}
            sustainabilityScore={sustainability.environmentalScore}
            onSustainbilityIncrease={(amount) => {
              setSustainability(prev => ({
                ...prev,
                environmentalScore: Math.min(100, prev.environmentalScore + amount)
              }));
            }}
          />
        )}

        {activeTab === 'oi' && (
          <OlayoIntelligence
            products={products}
            currentUser={currentUser}
            sustainabilityScore={sustainability.environmentalScore}
            onSustainbilityIncrease={(amount) => {
              setSustainability(prev => ({
                ...prev,
                environmentalScore: Math.min(100, prev.environmentalScore + amount)
              }));
            }}
          />
        )}

        {activeTab === 'dashboards' && (
          <DashboardRoles
            currentUser={currentUser}
            boats={boats}
            catchReports={catchReports}
            facilities={facilities}
            orders={orders}
            onRoleChanged={handleRoleChanged}
            onCatchSubmitted={handleCatchSubmitted}
            onFacilityTempChanged={handleFacilityTempChanged}
            onBoatMaintenanceSubmitted={handleBoatMaintenanceSubmitted}
          />
        )}

        {activeTab === 'console' && (
          <LaunchConsole />
        )}
      </main>

      {/* Embedded Floating AI Copilot assistant inside tabs (Shows on non-homepage tabs for immediate utility!) */}
      {activeTab !== 'home' && (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-12 z-10">
          <div className="border-t border-cyan-500/10 pt-8 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h4 className="font-display font-semibold text-white text-sm flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-cyan-400" />
                  Live AI Co-Pilot Integration
                </h4>
                <p className="text-xs text-slate-400 leading-normal max-w-xl font-sans">
                  The Olayo Marine AI assistant integrates directly with the seafood catalog, vessel records, and temperature logs. Try selecting a preloaded image of a fish or typing semantic questions to test its neural response.
                </p>
              </div>
              <AiAssistant />
            </div>
          </div>
        </div>
      )}

      {/* Floating alert notifications toast feed */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-xs sm:max-w-sm pointer-events-auto">
        <AnimatePresence>
          {unreadNotificationsCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-2xl bg-slate-950/95 border border-red-500/40 shadow-2xl backdrop-blur-md flex items-start gap-3 text-left"
            >
              <div className="p-1.5 bg-red-500/10 rounded-lg text-red-400">
                <AlertCircle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-xs font-bold text-white flex justify-between items-center">
                  <span>Critical Fleet Warning</span>
                  <button onClick={() => markNotificationRead(notifications[0].id)} className="text-[10px] text-slate-500 hover:text-white font-mono uppercase">Dismiss</button>
                </div>
                <p className="text-[10px] text-slate-300 leading-normal font-sans">
                  {notifications.find(n => !n.isRead)?.description || 'Alert: Temperature leak inside logistics truck hold reported.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clean elegant Footer */}
      <footer className="z-10 bg-slate-950/50 border-t border-cyan-500/15 py-6 px-6 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          © 2026 Olayo Fisheries Limited. All rights reserved.
        </div>
        <div className="flex gap-4">
          <span className="text-cyan-400">FAO Certified Platform</span>
          <span>●</span>
          <span>Vigo Customs Port, Spain</span>
        </div>
      </footer>
    </div>
  );
}
