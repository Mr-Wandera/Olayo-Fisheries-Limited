import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Users, Radio, Send, CheckCheck, Paperclip, Ticket, ShieldAlert, AtSign, Bell, AlertTriangle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  content: string;
  time: string;
  read: boolean;
  attachment?: string;
}

interface SupportTicket {
  id: string;
  title: string;
  priority: 'CRITICAL' | 'MEDIUM' | 'LOW';
  status: 'Open' | 'Pending' | 'Closed';
  date: string;
}

export default function PlatformComms() {
  const [activePane, setActivePane] = useState<'messages' | 'tickets' | 'announcements'>('messages');

  // Messages database
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'msg-01', sender: 'Capt. Marcus Vance', role: 'Fleet Captain', content: 'Catch report verified and synced to SatLink. Bluefin holds are locked at -2.0°C. ETA harbor in 45 minutes.', time: '00:32', read: true },
    { id: 'msg-02', sender: 'Chef Akira Sato', role: 'Sashimi Curator', content: 'Need another premium sashimi grade tuna batch of >95% sensory clarity for the Vigo Sushi Expo next Friday. Can you secure it?', time: '00:15', read: true },
  ]);

  const [messageText, setMessageText] = useState('');
  const [activeChannel, setActiveChannel] = useState<'Vance' | 'Sato'>('Vance');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  // Tickets database
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: 'TCK-4810', title: 'Deep Freeze A thermal sensor drift audit', priority: 'CRITICAL', status: 'Open', date: '2026-06-29' },
    { id: 'TCK-4812', title: 'GPS tracking satellite telemetry lag', priority: 'MEDIUM', status: 'Pending', date: '2026-06-28' },
  ]);

  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState<'CRITICAL' | 'MEDIUM' | 'LOW'>('MEDIUM');

  // Interactive instant response simulator when user chats
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !attachedFileName) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      role: 'Silva Seafoods',
      content: messageText || `Shared file attachment: ${attachedFileName}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
      attachment: attachedFileName || undefined,
    };

    setMessages(prev => [...prev, userMsg]);
    setMessageText('');
    setAttachedFileName(null);

    // Simulate other user typing and responding
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyContent = '';
      if (activeChannel === 'Vance') {
        replyContent = 'Understood. Coordinates locked. Will ensure the dry-ice levels are verified again before offloading at Vigo.';
      } else {
        replyContent = 'Sourcing looks exquisite! The temperature stability log gives our chefs perfect confidence. Standardizing delivery.';
      }

      const responderMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: activeChannel === 'Vance' ? 'Capt. Marcus Vance' : 'Chef Akira Sato',
        role: activeChannel === 'Vance' ? 'Fleet Captain' : 'Sashimi Curator',
        content: replyContent,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };

      setMessages(prev => [...prev, responderMsg]);
    }, 2500);
  };

  const handleSimulateAttachment = () => {
    setAttachedFileName('invoice_manifest_vigo_signed.pdf');
    alert('Document attachment mock successfully cached. Click Send to transmit.');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim()) return;

    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(Math.random() * 9000) + 1000}`,
      title: newTicketTitle,
      priority: newTicketPriority,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
    };

    setTickets([newTicket, ...tickets]);
    setNewTicketTitle('');
    alert('Operational support ticket registered with Olayo Core engineers.');
  };

  return (
    <div className="bg-slate-900/60 border border-cyan-500/15 p-5 sm:p-6 rounded-3xl backdrop-blur-md space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-cyan-500/10 pb-4">
        <div>
          <h3 className="font-display font-black text-white text-base sm:text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400 animate-pulse" />
            Vessel SatLink & Platform Comms
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Dual-cryptography satellite chat rooms, announcements, and support logs</p>
        </div>

        <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-cyan-500/15">
          <button
            onClick={() => setActivePane('messages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activePane === 'messages' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Direct Channels
          </button>
          <button
            onClick={() => setActivePane('tickets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activePane === 'tickets' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Support Tickets
          </button>
          <button
            onClick={() => setActivePane('announcements')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activePane === 'announcements' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Announcements
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activePane === 'messages' && (
          <motion.div
            key="messages"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Direct Contacts list */}
            <div className="bg-slate-950/40 border border-cyan-500/5 p-4 rounded-2xl space-y-3">
              <span className="text-[9px] font-mono text-cyan-400 uppercase block mb-1">Direct Channels</span>

              <button
                onClick={() => setActiveChannel('Vance')}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border flex items-center gap-3 ${activeChannel === 'Vance' ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300' : 'bg-slate-950/40 border-cyan-500/5 text-slate-300 hover:border-cyan-500/15'}`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-cyan-400 shrink-0">MV</div>
                <div>
                  <span className="font-bold block">Capt. Marcus Vance</span>
                  <span className="text-[10px] text-slate-500 font-sans">Fleet Operations</span>
                </div>
              </button>

              <button
                onClick={() => setActiveChannel('Sato')}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border flex items-center gap-3 ${activeChannel === 'Sato' ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300' : 'bg-slate-950/40 border-cyan-500/5 text-slate-300 hover:border-cyan-500/15'}`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-cyan-400 shrink-0">AS</div>
                <div>
                  <span className="font-bold block">Chef Akira Sato</span>
                  <span className="text-[10px] text-slate-500 font-sans">Umi Zen Restaurant</span>
                </div>
              </button>
            </div>

            {/* Chat Conversation pane */}
            <div className="lg:col-span-3 bg-slate-950/60 rounded-2xl border border-cyan-500/10 p-5 flex flex-col justify-between h-[340px]">
              {/* Messages list */}
              <div className="overflow-y-auto space-y-3 flex-1 pr-1">
                {messages
                  .filter(m => (activeChannel === 'Vance' && (m.sender.includes('Vance') || m.sender === 'You')) ||
                              (activeChannel === 'Sato' && (m.sender.includes('Sato') || m.sender === 'You')))
                  .map((m) => {
                    const isUser = m.sender === 'You';
                    return (
                      <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                          <span>{m.sender}</span>
                          <span className="text-[8px] text-slate-600">({m.role})</span>
                        </div>
                        <div className={`p-2.5 rounded-2xl max-w-sm text-xs mt-1 relative leading-relaxed ${isUser ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none' : 'bg-slate-900 border border-cyan-500/10 text-white rounded-tl-none'}`}>
                          {m.content}
                          {m.attachment && (
                            <div className="mt-1 text-[9px] font-mono border-t border-cyan-950/10 pt-1 flex items-center gap-1 opacity-90">
                              <Paperclip className="w-3 h-3" /> {m.attachment}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[8px] font-mono text-slate-600 mt-0.5">
                          <span>{m.time}</span>
                          <span>{isUser && <CheckCheck className="w-3 h-3 text-cyan-400 inline" />}</span>
                        </div>
                      </div>
                    );
                  })}

                {isTyping && (
                  <div className="text-[10px] font-mono text-cyan-400 animate-pulse flex items-center gap-1.5 py-1">
                    <Radio className="w-3.5 h-3.5 animate-spin" /> {activeChannel === 'Vance' ? 'Captain Vance' : 'Chef Sato'} is typing secure response...
                  </div>
                )}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-cyan-500/10 flex gap-2">
                <button
                  type="button"
                  onClick={handleSimulateAttachment}
                  title="Simulate secure file attach"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/10 text-cyan-400 cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Secure message to ${activeChannel === 'Vance' ? 'Capt. Marcus Vance' : 'Chef Akira Sato'}...`}
                  className="flex-1 bg-slate-950 border border-cyan-500/15 rounded-xl px-3 text-xs text-white placeholder-cyan-100/20 focus:border-cyan-400 outline-none"
                />

                <button
                  type="submit"
                  className="p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold text-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {activePane === 'tickets' && (
          <motion.div
            key="tickets"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Tickets logging form */}
            <div className="bg-slate-950/60 border border-cyan-500/10 p-5 rounded-2xl space-y-4">
              <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/10 pb-2 flex items-center gap-1.5 uppercase">
                <Ticket className="w-4 h-4 text-cyan-400" /> Log Operational Ticket
              </h4>

              <form onSubmit={handleCreateTicket} className="space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-cyan-400/60 uppercase">Hardware / IoT Issue Description</label>
                  <input
                    type="text"
                    value={newTicketTitle}
                    onChange={(e) => setNewTicketTitle(e.target.value)}
                    placeholder="e.g. Vessel GPS antenna lag"
                    className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-cyan-400/60 uppercase">Priority Rating</label>
                  <select
                    value={newTicketPriority}
                    onChange={(e) => setNewTicketPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  >
                    <option value="LOW">Low Threshold (Operational)</option>
                    <option value="MEDIUM">Medium Severity (Telemetry)</option>
                    <option value="CRITICAL">Critical Severity (Thermal/Siren)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all cursor-pointer"
                >
                  COMMIT SECURE TICKET
                </button>
              </form>
            </div>

            {/* List of active tickets */}
            <div className="lg:col-span-2 bg-slate-950/40 border border-cyan-500/10 p-5 rounded-2xl space-y-4">
              <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/10 pb-2 flex items-center gap-1.5 uppercase">
                <ShieldAlert className="w-4 h-4 text-cyan-400" /> Active Platform Support Queue
              </h4>

              <div className="space-y-3 font-mono text-xs">
                {tickets.map((t) => (
                  <div key={t.id} className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/5 flex justify-between items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-cyan-400 font-bold text-xs">{t.id}</span>
                      <div className="text-white font-sans font-semibold text-xs">{t.title}</div>
                      <div className="text-[9px] text-slate-500">Logged: {t.date}</div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${t.priority === 'CRITICAL' ? 'bg-red-950 text-red-400' : 'bg-orange-950 text-orange-400'}`}>
                        {t.priority}
                      </span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${t.status === 'Open' ? 'bg-blue-950 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activePane === 'announcements' && (
          <motion.div
            key="announcements"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Announcements Board */}
            <div className="lg:col-span-3 bg-slate-950/40 border border-cyan-500/10 p-5 rounded-2xl space-y-4">
              <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/10 pb-2 flex items-center gap-1.5 uppercase">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" /> Harbor Announcements & Storm Signals
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-950/20 border border-red-500/15 rounded-xl space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-red-400 font-bold">
                    <span>⚠️ FAO BASIN 27 WAVE HEIGHT ADVISORY</span>
                    <span>00:10</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-normal">
                    Severe atmospheric depressional swell approaching northern shelf corridors. Swells exceeding 4.5m expected. Small artisanal vessels advised to seek docking in Vigo harbor.
                  </p>
                </div>

                <div className="p-4 bg-cyan-950/20 border border-cyan-500/15 rounded-xl space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-cyan-400 font-bold">
                    <span>📢 CUSTOMS CLEARANCE AUDIT SHIFT</span>
                    <span>Yesterday</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-normal">
                    EU maritime customs has implemented automatic sanitary certificate validation for shellfish consignments. Signed PDF manifests will authorize instant border clearance gates.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
