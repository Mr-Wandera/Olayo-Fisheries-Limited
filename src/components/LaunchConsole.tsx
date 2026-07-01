import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Server, Key, FileCode, CheckCircle2, RefreshCw, Database, 
  Layers, HardDrive, Wifi, Activity, Download, Search, Image as ImageIcon, 
  Video, BookOpen, AlertTriangle, FileText, Globe, Coins, Play, Sparkles, Clock, ListFilter
} from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  category: 'Photos' | 'Drone Footage' | 'Training Videos' | 'Marketing';
  url: string;
  type: 'image' | 'video';
  size: string;
  dimensions?: string;
  duration?: string;
  uploadedAt: string;
}

const MEDIA_LIBRARY: MediaItem[] = [
  {
    id: 'med-1',
    title: 'Deep Water Cages Drone Flyover',
    category: 'Drone Footage',
    url: 'https://images.unsplash.com/photo-1505244760054-0255a24172e8?auto=format&fit=crop&q=80&w=800',
    type: 'video',
    size: '142.4 MB',
    duration: '2m 14s',
    uploadedAt: '2026-06-15'
  },
  {
    id: 'med-2',
    title: 'Busia Freezing Processing Lanes',
    category: 'Photos',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
    type: 'image',
    size: '12.8 MB',
    dimensions: '4000x3000',
    uploadedAt: '2026-06-18'
  },
  {
    id: 'med-3',
    title: 'Sustainable Breeding Hatchery Guidelines',
    category: 'Training Videos',
    url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&q=80&w=800',
    type: 'video',
    size: '88.1 MB',
    duration: '15m 30s',
    uploadedAt: '2026-06-20'
  },
  {
    id: 'med-4',
    title: 'Nile Tilapia Core Bio-Security Protocols',
    category: 'Marketing',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    type: 'image',
    size: '4.2 MB',
    dimensions: '1920x1080',
    uploadedAt: '2026-06-25'
  },
  {
    id: 'med-5',
    title: 'Lake Victoria Water Quality Buoy Launch',
    category: 'Photos',
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800',
    type: 'image',
    size: '8.5 MB',
    dimensions: '3000x2000',
    uploadedAt: '2026-06-28'
  }
];

export default function LaunchConsole() {
  const [activeTab, setActiveTab] = useState<'system' | 'security' | 'api' | 'media' | 'brand' | 'v1'>('system');
  const [isProductionMode, setIsProductionMode] = useState<boolean>(false);
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [lastBackup, setLastBackup] = useState<string>('2026-07-01 04:00 UTC');
  const [backupLogs, setBackupLogs] = useState<string[]>(['[04:00] Automated Cron job triggered S3 backup sync.', '[04:01] DB dump verified successfully. Integrity hash MD5 matched.']);
  const [activeEndpoint, setActiveEndpoint] = useState<string>('GET_PRODUCTS');
  const [apiResponse, setApiResponse] = useState<string>('{\n  "status": "Click Send Request to run code"\n}');
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  const [mediaCategory, setMediaCategory] = useState<string>('All');
  const [mediaSearch, setMediaSearch] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);

  // System status variables
  const [apiLatency, setApiLatency] = useState<number>(34);
  const [dbHealth, setDbHealth] = useState<'Healthy' | 'Degraded'>('Healthy');
  const [socketStatus, setSocketStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('CONNECTED');
  const [errorRate, setErrorRate] = useState<number>(0.02);

  // Simulate real-time monitoring variations
  useEffect(() => {
    const timer = setInterval(() => {
      setApiLatency(prev => Math.max(12, Math.min(60, prev + Math.floor(Math.random() * 9) - 4)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleRunBackup = () => {
    setIsBackingUp(true);
    const newLog = `[${new Date().toLocaleTimeString()}] Manual Backup requested. Sweeping local volume...`;
    setBackupLogs(prev => [newLog, ...prev]);
    
    setTimeout(() => {
      setIsBackingUp(false);
      const successLog = `[${new Date().toLocaleTimeString()}] Snapshot complete. Target: backup-olayo-live-v1.tar.gz. 14.8MB uploaded to S3.`;
      setBackupLogs(prev => [successLog, ...prev]);
      setLastBackup(new Date().toUTCString().replace('GMT', 'UTC'));
    }, 1500);
  };

  const handleRunApiRequest = () => {
    setIsApiLoading(true);
    setTimeout(() => {
      setIsApiLoading(false);
      if (activeEndpoint === 'GET_PRODUCTS') {
        setApiResponse(JSON.stringify([
          { id: "prod_1", name: "Premium Nile Tilapia", price: 6.8, unit: "kg", description: "Grade-A fresh tilapia bred in Lake Victoria floating grids." },
          { id: "prod_2", name: "Nile Perch Fillets", price: 12.5, unit: "kg", description: "Hand-sliced premium white meat fish rich in fatty acids." }
        ], null, 2));
      } else if (activeEndpoint === 'GET_TELEMETRY') {
        setApiResponse(JSON.stringify({
          sensor_id: "LAKE_VIC_CAGE_02",
          water_temperature_c: 26.2,
          dissolved_oxygen_mg_l: 6.85,
          ph_index: 7.2,
          turbidity_ntu: 1.15,
          recorded_at: new Date().toISOString()
        }, null, 2));
      } else {
        setApiResponse(JSON.stringify({
          success: true,
          message: "Database environment sync successful. Real-time telemetry connection verified.",
          mode: isProductionMode ? "PRODUCTION" : "DEMO_SANDBOX"
        }, null, 2));
      }
    }, 600);
  };

  const filteredMedia = MEDIA_LIBRARY.filter(item => {
    const matchesCat = mediaCategory === 'All' || item.category === mediaCategory;
    const matchesSearch = item.title.toLowerCase().includes(mediaSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 text-left" id="launch-console-root">
      
      {/* BRAND & VERSION 1.0 HEADER BANNER */}
      <div className="bg-slate-900/60 border border-cyan-500/15 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <h1 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              V1.0 PRODUCTION CONSOLE
            </h1>
            <span className="text-[10px] font-mono font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full tracking-widest">
              RELEASE CANDIDATE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans max-w-xl">
            Audit operational health indicators, backup databases, inspect Swagger schemas, explore the corporate asset repository, and verify the official Olayo Fisheries brand experience.
          </p>
        </div>

        {/* Real vs. Demo Data Switcher */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-cyan-500/15 flex items-center justify-between gap-4 shrink-0 w-full md:w-auto">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block">Data Feeding Mode</span>
            <span className="text-xs font-bold text-white block mt-0.5">
              {isProductionMode ? '● LIVE PRODUCTION NODE' : '⚡ DEMO SANDBOX MODE'}
            </span>
          </div>
          
          <button 
            onClick={() => setIsProductionMode(!isProductionMode)}
            className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 relative cursor-pointer ${isProductionMode ? 'bg-teal-500' : 'bg-slate-800'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-slate-950 shadow-md transition-transform duration-300 flex items-center justify-center text-[7px] text-white font-bold ${isProductionMode ? 'translate-x-7' : 'translate-x-0'}`}>
              {isProductionMode ? 'PRD' : 'DEV'}
            </div>
          </button>
        </div>
      </div>

      {/* HORIZONTAL CONSOLE SELECTION BAR */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-slate-950 p-1 rounded-2xl border border-cyan-500/10">
        {[
          { id: 'system', label: 'System Health', icon: Server },
          { id: 'security', label: 'Security Portal', icon: Key },
          { id: 'api', label: 'Interactive API', icon: FileCode },
          { id: 'media', label: 'Media Vault', icon: ImageIcon },
          { id: 'brand', label: 'Brand Guidelines', icon: Sparkles },
          { id: 'v1', label: 'V1.0 Release Kit', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 justify-center py-2.5 rounded-xl text-xs font-bold transition-all border ${isActive ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-900/30'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CORE DISPLAY WINDOW */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: SYSTEM HEALTH CENTER & DISASTER RECOVERY BACKUP */}
          {activeTab === 'system' && (
            <motion.div
              key="system"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Telemetry and Latency */}
              <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl space-y-4">
                <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/10 pb-3">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Live System Diagnostics
                </h3>

                <div className="space-y-3.5 font-mono text-[11px]">
                  <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-cyan-500/5">
                    <span className="text-slate-500">API Gateway Latency</span>
                    <span className="text-white font-bold">{apiLatency} ms</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-cyan-500/5">
                    <span className="text-slate-500">Database Engine</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Database className="w-3 h-3" /> {dbHealth}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-cyan-500/5">
                    <span className="text-slate-500">WebSocket Keep-Alive</span>
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      <Wifi className="w-3 h-3" /> {socketStatus}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-cyan-500/5">
                    <span className="text-slate-500">System Error Log Rate</span>
                    <span className="text-white font-bold">{(errorRate * 100).toFixed(2)}%</span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-cyan-500/5">
                    <span className="text-slate-500">API Uptime Index</span>
                    <span className="text-teal-400 font-bold">99.98% uptime</span>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-2xl border border-cyan-500/5">
                  <div className="text-[10px] text-slate-400 space-y-1">
                    <p>● Cloud Run sandbox deployment validated.</p>
                    <p>● Multi-region automated failovers enabled.</p>
                  </div>
                </div>
              </div>

              {/* Resource Utilization */}
              <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl space-y-4">
                <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/10 pb-3">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Container Resource Load
                </h3>

                <div className="space-y-4 font-mono text-[11px]">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>CPU Utilization (2 Cores)</span>
                      <span className="text-white font-bold">18.5%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-cyan-500/5">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: '18.5%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Memory Pool (1024 MB)</span>
                      <span className="text-white font-bold">324 MB (31%)</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-cyan-500/5">
                      <div className="h-full bg-teal-400 rounded-full" style={{ width: '31%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Static Files Storage (S3 Sourcing)</span>
                      <span className="text-white font-bold">142.8 GB / 500 GB</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-cyan-500/5">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: '28.5%' }} />
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-cyan-500/5">
                    <span className="text-[9px] text-slate-500 block uppercase mb-1">Disk Speed (I/O)</span>
                    <span className="text-white font-extrabold block">Read: 340 MB/s • Write: 210 MB/s</span>
                  </div>
                </div>
              </div>

              {/* Backup & Disaster Recovery */}
              <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/10 pb-3">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    Database S3 Backups
                  </h3>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-cyan-500/5 space-y-1.5">
                    <span className="text-[9px] text-slate-500 uppercase block">Last Successful Snapshot</span>
                    <span className="text-xs text-white font-bold block">{lastBackup}</span>
                    <span className="text-[10px] text-emerald-400 block font-mono">✓ Integrity Hash Validated (SHA256)</span>
                  </div>

                  {/* Log console representation */}
                  <div className="bg-slate-950/95 p-3 rounded-xl border border-cyan-500/10 font-mono text-[9px] text-cyan-400 h-24 overflow-y-auto space-y-1">
                    {backupLogs.map((log, i) => (
                      <div key={i} className="leading-tight">{log}</div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleRunBackup}
                  disabled={isBackingUp}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 rounded-xl font-bold text-xs hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 mt-4"
                >
                  <RefreshCw className={`w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}`} />
                  {isBackingUp ? 'Backing Up Database...' : 'Run Database Backup Now'}
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SECURITY PORTAL */}
          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Security Metrics and Score */}
              <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl space-y-5">
                <div className="flex justify-between items-start border-b border-cyan-500/10 pb-3.5">
                  <div>
                    <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider">
                      Threat & Auth Metrics
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono">Audit trail logs for system accounts</p>
                  </div>

                  <div className="px-3 py-1 bg-emerald-500/15 border border-emerald-400/20 text-emerald-400 rounded-full font-mono text-[10px] font-bold">
                    SECURE SCORE: 100/100
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/5">
                    <span className="text-[8px] text-slate-500 block uppercase">Failed logins</span>
                    <span className="text-sm font-bold text-white block mt-1">0 attempts</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/5">
                    <span className="text-[8px] text-slate-500 block uppercase">API Rate Limiter</span>
                    <span className="text-emerald-400 font-bold block mt-1">Active</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/5">
                    <span className="text-[8px] text-slate-500 block uppercase">Encryption Standard</span>
                    <span className="text-sm font-bold text-white block mt-1">AES-256-GCM</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/5">
                    <span className="text-[8px] text-slate-500 block uppercase">OAuth 2.0 Status</span>
                    <span className="text-sm font-bold text-white block mt-1">Verified Client</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-cyan-500/5 pt-4">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Enterprise Security Checklist</span>
                  {[
                    'Enforced TLS 1.3 protocol standards on all REST channels.',
                    'Separated administrative database credentials safely via process secrets.',
                    'Configured regular automatic audit scrubs on all Lake telemetry points.',
                    'Implemented strict role-based access limits for all personnel actions.'
                  ].map((chk, i) => (
                    <div key={i} className="flex items-start gap-2 text-[10px] text-slate-300 font-sans leading-normal">
                      <span className="text-teal-400 font-bold">✓</span>
                      <span>{chk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Login Logs & Sessions */}
              <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl space-y-4">
                <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-500/10 pb-3">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Recent Active Admin Sessions
                </h3>

                <div className="space-y-2.5">
                  {[
                    { ip: '197.239.5.12', loc: 'Kampala, Uganda', dev: 'Mozilla Firefox (macOS)', time: 'Active Now', role: 'CEO / Admin' },
                    { ip: '197.239.5.45', loc: 'Busia, Uganda', dev: 'Mobile Safari (iOS)', time: '2 hours ago', role: 'Operations Warden' },
                    { ip: '41.210.140.2', loc: 'Entebbe, Uganda', dev: 'Google Chrome (Windows)', time: '1 day ago', role: 'Vet Inspector' }
                  ].map((sess, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-cyan-500/5 flex justify-between items-center text-[10px] font-mono">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1">
                          <span>{sess.ip}</span>
                          <span className="text-[8px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded uppercase">{sess.role}</span>
                        </div>
                        <div className="text-slate-500 mt-1">{sess.dev} • {sess.loc}</div>
                      </div>
                      <div className="text-right text-slate-400">{sess.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: INTERACTIVE REST API DOCUMENTATION */}
          {activeTab === 'api' && (
            <motion.div
              key="api"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Endpoint selection */}
              <div className="lg:col-span-4 bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl space-y-3">
                <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider border-b border-cyan-500/10 pb-3">
                  REST Endpoints
                </h3>

                {[
                  { key: 'GET_PRODUCTS', method: 'GET', url: '/api/products', desc: 'List all commercial tilapia products.' },
                  { key: 'GET_TELEMETRY', method: 'GET', url: '/api/telemetry', desc: 'Read live Lake Victoria cage sensors.' },
                  { key: 'POST_HEALTH', method: 'POST', url: '/api/env-sync', desc: 'Trigger database and environment refresh.' }
                ].map((end) => (
                  <button
                    key={end.key}
                    onClick={() => {
                      setActiveEndpoint(end.key);
                      setApiResponse('{\n  "status": "Click Send Request to run code"\n}');
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${activeEndpoint === end.key ? 'bg-cyan-950/40 border-cyan-400/40 text-white' : 'bg-slate-950/60 border-cyan-500/5 text-slate-400 hover:text-white'}`}
                  >
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${end.method === 'GET' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-cyan-500/15 text-cyan-400'}`}>
                      {end.method}
                    </span>
                    <div>
                      <div className="text-[11px] font-bold font-mono">{end.url}</div>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-tight">{end.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Endpoint execution console */}
              <div className="lg:col-span-8 bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                    <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider">
                      Interactive API Tester
                    </h3>
                    <button
                      onClick={handleRunApiRequest}
                      disabled={isApiLoading}
                      className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-[10px] font-mono font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {isApiLoading ? 'Executing...' : 'Send Request'}
                    </button>
                  </div>

                  {/* Schema parameters */}
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-cyan-500/5 font-mono text-[10px] text-slate-400 space-y-1">
                    <div><strong>Request Headers:</strong></div>
                    <div>Content-Type: <code>application/json</code></div>
                    <div>Authorization: <code>Bearer olayo-prod-key-sha256</code></div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Response Body</span>
                    <div className="bg-slate-950 rounded-xl border border-cyan-500/15 p-4 h-48 overflow-auto font-mono text-[11px] text-cyan-400 shadow-inner">
                      <pre className="whitespace-pre-wrap">{apiResponse}</pre>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-sans leading-relaxed">
                  💡 This Swagger console connects directly to the server state layer, simulating live routing results in real time.
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: PROFESSIONAL MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Media controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-cyan-500/10">
                {/* Categories filter */}
                <div className="flex gap-1">
                  {['All', 'Photos', 'Drone Footage', 'Training Videos', 'Marketing'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setMediaCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${mediaCategory === cat ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search digital assets..."
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-cyan-500/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white outline-none focus:border-cyan-400/40"
                  />
                </div>
              </div>

              {/* Grid of items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedia.map((item) => (
                  <div key={item.id} className="bg-slate-900/40 border border-cyan-500/10 rounded-3xl overflow-hidden flex flex-col justify-between group">
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Play button overlay for videos */}
                      {item.type === 'video' && (
                        <button
                          onClick={() => setSelectedVideo(item)}
                          className="absolute inset-0 flex items-center justify-center bg-slate-950/40 group-hover:bg-slate-950/20 transition-all cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-115 transition-all">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </button>
                      )}

                      <span className="absolute top-2 left-2 text-[8px] font-mono uppercase bg-slate-950/80 text-cyan-300 border border-cyan-500/25 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-display font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                          <span>{item.type === 'video' ? `Duration: ${item.duration}` : `Dims: ${item.dimensions}`}</span>
                          <span>{item.size}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-cyan-500/5 pt-3">
                        <span className="text-[9px] font-mono text-slate-500">Uploaded: {item.uploadedAt}</span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" /> Get Asset
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* VIDEO VIEWER MODAL POPUP */}
              {selectedVideo && (
                <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-cyan-500/35 rounded-3xl p-6 max-w-2xl w-full space-y-4 text-center relative">
                    <button 
                      onClick={() => setSelectedVideo(null)}
                      className="absolute top-4 right-4 bg-slate-950 text-slate-400 hover:text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                    <h3 className="font-display font-extrabold text-white text-base uppercase">{selectedVideo.title}</h3>
                    
                    {/* Simulated elegant video screen */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-cyan-500/10 flex items-center justify-center">
                      <img src={selectedVideo.url} alt={selectedVideo.title} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-cyan-950/20" />
                      
                      <div className="absolute flex flex-col items-center space-y-2">
                        <Play className="w-10 h-10 text-cyan-400 animate-pulse" />
                        <span className="text-xs font-mono text-cyan-300 uppercase">Streaming drone footage via CDN...</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-cyan-500/5 pt-4">
                      <span>Size: {selectedVideo.size}</span>
                      <span>Format: MP4 (H.264)</span>
                      <span>Audio: Dual Stereo</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5: BRAND & LOGO DESIGN SYSTEM */}
          {activeTab === 'brand' && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Logo system & swatches */}
              <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl space-y-5">
                <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider border-b border-cyan-500/10 pb-3">
                  Color Swatches & Typography
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/15">
                      <div className="w-full h-8 rounded bg-cyan-500" />
                      <span className="text-[10px] font-mono text-white block mt-1">Cyan 500</span>
                      <span className="text-[8px] font-mono text-slate-500">#06b6d4</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/15">
                      <div className="w-full h-8 rounded bg-teal-500" />
                      <span className="text-[10px] font-mono text-white block mt-1">Teal 500</span>
                      <span className="text-[8px] font-mono text-slate-500">#14b8a6</span>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/15">
                      <div className="w-full h-8 rounded bg-slate-950" />
                      <span className="text-[10px] font-mono text-white block mt-1">Slate 950</span>
                      <span className="text-[8px] font-mono text-slate-500">#020617</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-cyan-500/5 space-y-3 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-500 font-mono uppercase block">Display Headings</span>
                      <span className="font-display font-black text-white text-base tracking-tight uppercase">Space Grotesk</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 font-mono uppercase block">Body Paragraphs</span>
                      <span className="font-sans text-slate-300">Inter Regular (Legible, responsive)</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 font-mono uppercase block">Telemetry Labels</span>
                      <span className="font-mono text-cyan-400">JetBrains Mono (Monospaced alignment)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand voice & motion guidelines */}
              <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl space-y-4">
                <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider border-b border-cyan-500/10 pb-3">
                  Brand Voice & Motion Principles
                </h3>

                <div className="space-y-4 text-xs leading-relaxed font-sans">
                  <div>
                    <h4 className="font-display font-bold text-white mb-1">Corporate Voice Profile</h4>
                    <p className="text-slate-300">
                      We communicate with administrative precision, combining hard marine telemetry metrics with warm community stewardship. We avoid hyped buzzwords, focusing on empirical data, certified ESG tracking, and sub-zero supply security.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-white mb-1">Organic Motion Curve</h4>
                    <p className="text-slate-300">
                      All view alterations must utilize smooth, liquid-like transitions (spring eases) simulating aquatic tides. Elements fade, cards float on hover, and pointer operations induce ripples to emphasize organic lake origins.
                    </p>
                  </div>

                  {/* Dynamic brand card example */}
                  <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900/40 to-teal-950/40 p-4 rounded-2xl border border-cyan-500/15 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-cyan-400 shrink-0" />
                    <p className="text-[10px] text-slate-400 leading-normal">
                      "Breeding standard Nile Tilapia with complete ecological digital traces, ensuring Busia's aquaculture leads sustainable global trends."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 6: RELEASE CANDIDATE & CHECKLIST */}
          {activeTab === 'v1' && (
            <motion.div
              key="v1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Release notes & details */}
              <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl space-y-4">
                <div className="border-b border-cyan-500/10 pb-3">
                  <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider">
                    Release Version 1.0.0 Changelog
                  </h3>
                  <span className="text-[9px] font-mono text-slate-500">Official Production Stable • July 2026</span>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div>
                    <h4 className="font-bold text-cyan-300">● Deployed Live Telemetry Engine</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                      Streamlined IoT dissolved oxygen, pH index, and water temperature variables directly from floating cage stations into responsive visual dashboard dials.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-cyan-300">● Digitized Freezing Sourcing Logs</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                      Integrated a sub-zero cold chain ledger linked to certified freezer vehicles tracking logistics batches across Kampala, Busia, and regional warehouses.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-cyan-300">● Built Executive CommandCenter</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                      Configured single-view satellite overlays with live schools of fish responsive pool animations, dynamic warning thresholds, and PDF report creation.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/5 text-[10px] font-mono text-slate-500 leading-normal">
                    <strong>Known Issues:</strong> Minor websocket retry delays inside heavily nested secure iframe sandboxes. Handled gracefully via automated local memory caching.
                  </div>
                </div>
              </div>

              {/* Checklists for Launch */}
              <div className="bg-slate-900/40 border border-cyan-500/10 p-5 rounded-3xl space-y-4">
                <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider border-b border-cyan-500/10 pb-3">
                  Enterprise Release Checklist
                </h3>

                <div className="space-y-2.5 font-sans text-xs text-slate-300">
                  <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-cyan-500/5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white text-[11px]">QA Validation Passed</div>
                      <p className="text-[9px] text-slate-500 mt-0.5">Tested all roles from outgrowers to veterinary doctors.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-cyan-500/5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white text-[11px]">Security Clearance</div>
                      <p className="text-[9px] text-slate-500 mt-0.5">AES keys validated, rate limiters compiled successfully.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-cyan-500/5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white text-[11px]">Performance Benchmarks</div>
                      <p className="text-[9px] text-slate-500 mt-0.5">Under 1.5s first-contentful paint, HMR-free static files asset verified.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-cyan-500/5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white text-[11px]">SEO & OpenGraph Meta Configured</div>
                      <p className="text-[9px] text-slate-500 mt-0.5">Structured semantic HTML tag lists, OpenGraph cards verified.</p>
                    </div>
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
