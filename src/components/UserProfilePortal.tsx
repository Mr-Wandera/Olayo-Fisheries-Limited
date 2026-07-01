import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Order, CatchReport, Notification } from '../types';
import { Award, User, Target, ShieldCheck, Heart, UserPlus, Users, Flame, Calendar, MapPin, Activity, LayoutGrid, Palette, ToggleLeft, ToggleRight, Sparkles, BookOpen, Clock, HeartHandshake } from 'lucide-react';
import { FloatingCard, SwipeContainer } from './InteractionEngine';

interface UserProfilePortalProps {
  currentUser?: UserProfile;
  orders?: Order[];
  catchReports?: CatchReport[];
  notifications?: Notification[];
  sustainabilityScore?: number;
  onProfileUpdated?: (updates: Partial<UserProfile>) => void;
}

export default function UserProfilePortal({
  currentUser = { id: 'usr_mock', email: 'captain@olayo.com', name: 'Capt. Marcus Vance', role: 'Fleet Manager', createdAt: new Date().toISOString() },
  orders = [],
  catchReports = [],
  notifications = [],
  sustainabilityScore = 78,
  onProfileUpdated = () => {},
}: UserProfilePortalProps) {
  // Bio & cover state
  const [bio, setBio] = useState('Sustainable seafood advocate, oceanographer enthusiast, and Olayo Certified curator.');
  const [editingBio, setEditingBio] = useState(false);
  const [coverPreset, setCoverPreset] = useState('reef'); // 'reef', 'harbor', 'arctic', 'sunset'
  const [avatarPreset, setAvatarPreset] = useState('avatar1');
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Follow states
  const [followedIds, setFollowedIds] = useState<string[]>(['usr_fleet', 'usr_prod']);

  // Experience & level state
  const [xp, setXp] = useState(3840);
  const level = useMemo(() => Math.floor(xp / 1000) + 1, [xp]);
  const xpNeeded = useMemo(() => level * 1000, [level]);
  const xpProgress = useMemo(() => ((xp % 1000) / 1000) * 100, [xp, level]);

  // Cover photo presets
  const covers: Record<string, string> = {
    reef: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
    harbor: 'https://images.unsplash.com/photo-1505244760054-0255a24172e8?auto=format&fit=crop&q=80&w=800',
    arctic: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&q=80&w=800',
    sunset: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800',
  };

  const avatars: Record<string, string> = {
    avatar1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    avatar2: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    avatar3: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    avatar4: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
  };

  // Gamified achievements
  const achievements = useMemo(() => [
    {
      id: 'ach_01',
      title: 'FAO Custodian',
      description: 'Log 5 line-caught catches with certified scores.',
      icon: ShieldCheck,
      points: 150,
      unlocked: catchReports.length >= 2,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'ach_02',
      title: 'Thermal Sentry',
      description: 'Audit sub-zero vehicle controls below -18°C.',
      icon: Award,
      points: 100,
      unlocked: true,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'ach_03',
      title: 'Michelin Partner',
      description: 'Establish forward logistics with Chef Akira Sato.',
      icon: Sparkles,
      points: 200,
      unlocked: orders.length > 0,
      color: 'from-orange-500 to-rose-600',
    },
    {
      id: 'ach_04',
      title: 'Carbon Neutralist',
      description: 'Reach a sustainability contribution score above 80%.',
      icon: Flame,
      points: 300,
      unlocked: sustainabilityScore >= 80,
      color: 'from-purple-500 to-indigo-600',
    },
  ], [catchReports, orders, sustainabilityScore]);

  // Leaderboard data
  const leaderboard = [
    { id: 'usr_admin', name: 'Elena Rostova', role: 'Administrator', score: 9800, badge: '⭐ Captain rank' },
    { id: 'usr_fleet', name: 'Marcus Vance', role: 'Fleet Manager', score: 8200, badge: '⚓ Admiral rank' },
    { id: 'usr_prod', name: 'Mateo Silva', role: 'Producer', score: 6500, badge: '🌿 Sustainable Sentry' },
    { id: currentUser.id, name: currentUser.name, role: currentUser.role, score: xp, badge: '🎓 Certified Master', isUser: true },
    { id: 'usr_chef', name: 'Akira Sato', role: 'Restaurant Chef', score: 3200, badge: '🍣 Sashimi Scholar' },
  ].sort((a, b) => b.score - a.score);

  const toggleFollow = (id: string) => {
    setFollowedIds(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
    setXp(prev => prev + 50); // XP reward for networking!
  };

  // Static stats
  const totalWeightLogged = useMemo(() => {
    return catchReports.reduce((sum, cr) => sum + cr.quantity, 0);
  }, [catchReports]);

  const totalCarbonSaved = useMemo(() => {
    return orders.reduce((sum, o) => sum + Math.floor(o.total * 0.12), 125);
  }, [orders]);

  return (
    <div className={`space-y-6 ${isDarkTheme ? 'text-slate-100' : 'text-slate-800 bg-white/95 p-6 rounded-3xl border border-slate-200 text-slate-800'}`}>
      {/* Visual Cover card */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl bg-slate-900/60 backdrop-blur-md">
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 relative bg-slate-950">
          <img src={covers[coverPreset]} alt="cover" className="w-full h-full object-cover brightness-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
          
          {/* Cover photo selectors */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-950/70 backdrop-blur p-1.5 rounded-xl border border-white/10">
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <button onClick={() => setCoverPreset('reef')} className={`w-3.5 h-3.5 rounded-full bg-teal-500 ${coverPreset === 'reef' ? 'ring-2 ring-white' : ''}`} title="Deep Reef" />
            <button onClick={() => setCoverPreset('harbor')} className={`w-3.5 h-3.5 rounded-full bg-blue-500 ${coverPreset === 'harbor' ? 'ring-2 ring-white' : ''}`} title="Harbor" />
            <button onClick={() => setCoverPreset('arctic')} className={`w-3.5 h-3.5 rounded-full bg-slate-300 ${coverPreset === 'arctic' ? 'ring-2 ring-white' : ''}`} title="Glacier" />
            <button onClick={() => setCoverPreset('sunset')} className={`w-3.5 h-3.5 rounded-full bg-orange-500 ${coverPreset === 'sunset' ? 'ring-2 ring-white' : ''}`} title="Sunset" />
          </div>
        </div>

        {/* Profile Details Overlay */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between -mt-16 sm:-mt-20 gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            {/* Avatar picker */}
            <div className="relative group cursor-pointer shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-slate-900 bg-slate-950 overflow-hidden shadow-2xl relative">
                <img src={avatars[avatarPreset]} alt="Avatar" className="w-full h-full object-cover" />
                {/* Overlay with cycle option */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-[9px] font-mono font-bold text-cyan-300 uppercase">Change</span>
                </div>
              </div>
              {/* Invisible trigger to cycle avatar */}
              <button
                onClick={() => {
                  const keys = Object.keys(avatars);
                  const currentIdx = keys.indexOf(avatarPreset);
                  const nextKey = keys[(currentIdx + 1) % keys.length];
                  setAvatarPreset(nextKey);
                  setXp(prev => prev + 10);
                }}
                className="absolute inset-0 w-full h-full opacity-0"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h2 className={`font-display text-xl sm:text-2xl font-black ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>{currentUser.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-mono font-bold text-[9px] uppercase tracking-wider">
                  Level {level}
                </span>
              </div>
              <p className="text-xs text-cyan-400 font-mono flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5" /> Vigo, Galicia (Spain) — Cert #3810
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Role: <strong className="text-white">{currentUser.role}</strong></p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="md:max-w-xs w-full bg-slate-950/75 border border-cyan-500/10 p-4 rounded-2xl backdrop-blur">
            <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400/80 mb-2">
              <span>PROGRESS TO LEVEL {level + 1}</span>
              <span>{xp % 1000} / 1000 XP</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left Bio & Achievements (2/3) + Right Leaderboard/Network (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Bio update card */}
          <div className="bg-slate-900/60 border border-cyan-500/15 p-5 rounded-2xl backdrop-blur-md space-y-3">
            <div className="flex justify-between items-center border-b border-cyan-500/10 pb-2">
              <h4 className="font-display font-semibold text-white text-xs sm:text-sm flex items-center gap-1.5">
                <User className="w-4 h-4 text-cyan-400" /> Bio & Organization Customizer
              </h4>
              <button
                onClick={() => setEditingBio(!editingBio)}
                className="text-[10px] font-mono text-cyan-400 hover:underline"
              >
                {editingBio ? 'Save bio' : 'Edit bio'}
              </button>
            </div>

            {editingBio ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl p-3 text-xs text-white placeholder-cyan-100/20 focus:border-cyan-400 outline-none"
                rows={3}
              />
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{bio}</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-950/40 p-2.5 rounded-xl border border-cyan-500/5 text-xs">
                <span className="text-[10px] text-slate-500 block font-mono">COMPANY</span>
                <span className="font-semibold text-white">{currentUser.companyName || 'Artisanal Sourcing'}</span>
              </div>
              <div className="bg-slate-950/40 p-2.5 rounded-xl border border-cyan-500/5 text-xs">
                <span className="text-[10px] text-slate-500 block font-mono">PHONE TELEMETRY</span>
                <span className="font-semibold text-white">{currentUser.phone || '+34 612 90 91'}</span>
              </div>
              <div className="bg-slate-950/40 p-2.5 rounded-xl border border-cyan-500/5 text-xs col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 block font-mono">THEME SCHEME</span>
                <button
                  onClick={() => setIsDarkTheme(!isDarkTheme)}
                  className="flex items-center gap-1.5 text-cyan-400 font-semibold"
                >
                  {isDarkTheme ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                  {isDarkTheme ? 'Dark Mode' : 'Light Theme'}
                </button>
              </div>
            </div>
          </div>

          {/* Gamified stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-cyan-500/15 p-4 rounded-2xl backdrop-blur-md flex flex-col justify-between">
              <span className="text-[9px] font-mono text-cyan-400 uppercase">Catches Logged</span>
              <div className="text-2xl font-display font-extrabold text-white mt-1">
                {totalWeightLogged > 0 ? `${(totalWeightLogged / 1000).toFixed(1)}t` : '0.0t'}
              </div>
              <span className="text-[9px] text-slate-500 mt-1">Sustainable quota checked</span>
            </div>
            <div className="bg-slate-900/60 border border-cyan-500/15 p-4 rounded-2xl backdrop-blur-md flex flex-col justify-between">
              <span className="text-[9px] font-mono text-cyan-400 uppercase">Carbon Prevented</span>
              <div className="text-2xl font-display font-extrabold text-emerald-400 mt-1">
                {totalCarbonSaved} kg
              </div>
              <span className="text-[9px] text-slate-500 mt-1">FOB logistics efficiency</span>
            </div>
            <div className="bg-slate-900/60 border border-cyan-500/15 p-4 rounded-2xl backdrop-blur-md flex flex-col justify-between">
              <span className="text-[9px] font-mono text-cyan-400 uppercase">Mastered Badges</span>
              <div className="text-2xl font-display font-extrabold text-amber-400 mt-1">
                {achievements.filter(a => a.unlocked).length} / 4
              </div>
              <span className="text-[9px] text-slate-500 mt-1">Interactive certificates</span>
            </div>
            <div className="bg-slate-900/60 border border-cyan-500/15 p-4 rounded-2xl backdrop-blur-md flex flex-col justify-between">
              <span className="text-[9px] font-mono text-cyan-400 uppercase">Followers network</span>
              <div className="text-2xl font-display font-extrabold text-cyan-400 mt-1">
                {followedIds.length + 3}
              </div>
              <span className="text-[9px] text-slate-500 mt-1">Simulated sea captains</span>
            </div>
          </div>

          {/* Interactive Badges & Achievements (Gamification) */}
          <div className="bg-slate-900/60 border border-cyan-500/15 p-5 rounded-2xl backdrop-blur-md space-y-4">
            <h3 className="font-display font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 border-b border-cyan-500/10 pb-3">
              <Award className="w-5 h-5 text-amber-400" />
              Achievements & Unlockable Badges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((a) => {
                const Icon = a.icon;
                return (
                  <FloatingCard key={a.id}>
                    <div
                      className={`p-3.5 rounded-xl border flex gap-3 items-center transition-all h-full ${a.unlocked ? 'bg-slate-950/50 border-cyan-500/15 shadow-md hover:border-cyan-400/40' : 'bg-slate-950/10 border-slate-800 opacity-50'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} p-0.5 flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{a.title}</span>
                          {a.unlocked && <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/10 px-1 rounded uppercase font-semibold">Unlocked</span>}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{a.description}</p>
                        <span className="text-[9px] font-mono text-amber-400 font-bold">+{a.points} XP</span>
                      </div>
                    </div>
                  </FloatingCard>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Leaderboards and networks */}
        <div className="space-y-6">
          {/* Eco Points Leaderboard */}
          <div className="bg-slate-900/80 border border-cyan-500/20 p-5 rounded-2xl backdrop-blur-md space-y-4">
            <h3 className="font-display font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 border-b border-cyan-500/10 pb-2.5">
              <Target className="w-4.5 h-4.5 text-cyan-400" />
              Olayo Eco Leaderboard
            </h3>

            <div className="space-y-2">
              {leaderboard.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${item.isUser ? 'bg-cyan-500 border-cyan-300 text-slate-950 font-bold shadow-md' : 'bg-slate-950/40 border-cyan-500/5 hover:border-cyan-500/15'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs w-4 text-center">{idx + 1}</span>
                    <div>
                      <div className={`text-xs ${item.isUser ? 'text-slate-950' : 'text-white font-semibold'}`}>{item.name}</div>
                      <div className={`text-[9px] ${item.isUser ? 'text-slate-900' : 'text-slate-500 font-mono'}`}>{item.badge}</div>
                    </div>
                  </div>
                  <div className="font-mono text-xs font-bold text-right">
                    {item.score} XP
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Network / Captains & Chefs */}
          <div className="bg-slate-900/80 border border-cyan-500/20 p-5 rounded-2xl backdrop-blur-md space-y-4">
            <h3 className="font-display font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 border-b border-cyan-500/10 pb-2.5">
              <Users className="w-4.5 h-4.5 text-cyan-400" />
              Connected Sea Network
            </h3>

            <div className="space-y-3">
              {[
                { id: 'usr_fleet', name: 'Capt. Marcus Vance', desc: 'Ocean Sentinel', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' },
                { id: 'usr_prod', name: 'Mateo Silva', desc: 'Coral Guardian', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100' },
                { id: 'usr_chef', name: 'Chef Akira Sato', desc: 'Umi Zen Sushi', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100' }
              ].map(actor => {
                const isFollowed = followedIds.includes(actor.id);
                return (
                  <SwipeContainer
                    key={actor.id}
                    onSwipeLeft={() => toggleFollow(actor.id)}
                    onSwipeRight={() => alert(`SATLINK connection established with ${actor.name}. Safe channels verified.`)}
                    leftIcon={<UserPlus className={`w-5 h-5 ${isFollowed ? 'text-red-400' : 'text-cyan-400'}`} />}
                    leftText={isFollowed ? "Unfollow" : "Follow Captain"}
                    rightIcon={<Activity className="w-5 h-5 text-emerald-400" />}
                    rightText="Ping SatLink"
                  >
                    <div className="flex justify-between items-center gap-3 bg-slate-950/20 p-2.5 border border-cyan-500/5 rounded-xl hover:border-cyan-500/15 transition-colors">
                      <div className="flex items-center gap-2.5 text-xs">
                        <img src={actor.avatar} alt={actor.name} className="w-8 h-8 rounded-full object-cover border border-cyan-500/10" />
                        <div>
                          <div className="font-semibold text-white">{actor.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{actor.desc}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFollow(actor.id)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 ${isFollowed ? 'bg-slate-800 border border-cyan-500/15 text-cyan-400' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'}`}
                      >
                        {isFollowed ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  </SwipeContainer>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Chronological Platform Ledger (Timelines) */}
      <div className="bg-slate-900/60 border border-cyan-500/15 p-5 rounded-2xl backdrop-blur-md space-y-4">
        <h3 className="font-display font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 border-b border-cyan-500/10 pb-3">
          <Activity className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
          Certified Activity Ledger & Chronology
        </h3>

        <div className="relative border-l border-cyan-500/20 pl-4 ml-2.5 space-y-5">
          <div className="relative">
            {/* Dot marker */}
            <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-4 ring-slate-900" />
            <div className="text-xs font-mono text-cyan-400">TODAY AT 00:47</div>
            <h4 className="text-xs font-bold text-white mt-0.5">Profile Sourcing Customization Logged</h4>
            <p className="text-[10px] text-slate-400 mt-1 max-w-xl leading-normal">
              Updated company parameters to Silva Seafood Harvests. Sourcing keys aligned with Vigo Customs central ledger.
            </p>
          </div>

          <div className="relative">
            <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-slate-900" />
            <div className="text-xs font-mono text-emerald-400">YESTERDAY AT 11:00</div>
            <h4 className="text-xs font-bold text-white mt-0.5">Seafood Sourcing Order Authenticated [Invoice ord_1001]</h4>
            <p className="text-[10px] text-slate-400 mt-1 max-w-xl leading-normal">
              Purchased 20kg Premium Bluefin Tuna and 50kg Atlantic Cod Fillets. Sub-zero cold logs locked at -1.8°C.
            </p>
          </div>

          <div className="relative">
            <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-slate-600 ring-4 ring-slate-900" />
            <div className="text-xs font-mono text-slate-500">2026-06-29</div>
            <h4 className="text-xs font-bold text-white mt-0.5">Ecosystem Sustainability Milestone Earned</h4>
            <p className="text-[10px] text-slate-400 mt-1 max-w-xl leading-normal">
              Silva Seafood Harvests logged a 100% selective longline catch, improving regional bycatch stats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
