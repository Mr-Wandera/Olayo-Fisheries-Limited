import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Sparkles, Send, Paperclip, Mic, Camera, FileText, ChevronDown, ChevronUp, Download, Code, FileSpreadsheet, FileType, Printer, X, Eye, GitBranch, Database, Network, Target, Lightbulb, Settings2, Zap, TrendingUp, ShieldCheck, Fish, Droplets, Activity, RefreshCw, CircleCheck as CheckCircle, ArrowRight, Layers, FileJson, FileCode } from 'lucide-react';

interface AIPlaygroundProps {
  initialQuery?: string;
  onQueryConsumed?: () => void;
  farmContext?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  thoughts?: ThoughtStep[];
  timestamp: string;
}

interface ThoughtStep {
  icon: React.ElementType;
  label: string;
  desc: string;
}

const SYSTEM_PRESETS = [
  { id: 'ops', label: 'Operations Director', icon: Activity, instruction: 'You are the Operations Director for Olayo Fisheries. Prioritize operational efficiency, staff safety, and daily production targets. Respond with actionable recommendations.' },
  { id: 'sci', label: 'Fisheries Scientist', icon: Droplets, instruction: 'You are a fisheries scientist specializing in Nile Tilapia cage aquaculture on Lake Victoria. Answer with scientific rigor, cite water quality parameters, and reference NEMA standards.' },
  { id: 'sust', label: 'Sustainability Officer', icon: Leaf, instruction: 'Prioritize sustainability and environmental impact. Focus on ESG metrics, NEMA compliance, and carbon footprint reduction. Suggest eco-friendly alternatives.' },
  { id: 'profit', label: 'Profitability Analyst', icon: TrendingUp, instruction: 'Focus on profitability and revenue optimization. Analyze margins, pricing strategies, and cost reduction. Provide financial projections.' },
  { id: 'simple', label: 'Simple English', icon: Sparkles, instruction: 'Respond in simple, clear English. Avoid jargon. Explain like you are talking to a new fish farm worker.' },
];

const THOUGHT_STEPS: ThoughtStep[] = [
  { icon: Database, label: 'Data Collection', desc: 'Aggregating telemetry from cages, vessels, and facilities' },
  { icon: Network, label: 'Pattern Recognition', desc: 'Cross-referencing biomass, water quality, and market data' },
  { icon: GitBranch, label: 'Trade-off Analysis', desc: 'Weighing operational, financial, and environmental factors' },
  { icon: Target, label: 'Decision', desc: 'Formulating recommendation with confidence score' },
];

const EXPORT_FORMATS = [
  { id: 'pdf', label: 'PDF', icon: FileType },
  { id: 'word', label: 'Word', icon: FileText },
  { id: 'excel', label: 'Excel', icon: FileSpreadsheet },
  { id: 'csv', label: 'CSV', icon: FileText },
  { id: 'json', label: 'JSON', icon: FileJson },
  { id: 'code', label: 'Go Code', icon: FileCode },
  { id: 'api', label: 'REST API', icon: Code },
  { id: 'print', label: 'Print', icon: Printer },
];

export default function AIPlayground({ initialQuery, onQueryConsumed, farmContext }: AIPlaygroundProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSystem, setShowSystem] = useState(false);
  const [showThoughts, setShowThoughts] = useState(false);
  const [systemInstruction, setSystemInstruction] = useState(SYSTEM_PRESETS[0].instruction);
  const [activePreset, setActivePreset] = useState('ops');
  const [activeThoughtStep, setActiveThoughtStep] = useState(0);
  const [showExport, setShowExport] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
      onQueryConsumed?.();
    }
  }, [initialQuery]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // Animate thought steps
  useEffect(() => {
    if (!loading || !showThoughts) return;
    const t = setInterval(() => {
      setActiveThoughtStep(s => (s + 1) % THOUGHT_STEPS.length);
    }, 1200);
    return () => clearInterval(t);
  }, [loading, showThoughts]);

  const handleSend = async (overridePrompt?: string) => {
    const prompt = overridePrompt || input;
    if (!prompt.trim()) return;

    const userMsg: Message = { role: 'user', content: prompt, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setShowThoughts(true);

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode: 'search', systemInstruction, farmContext }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.success ? data.text : 'Unable to retrieve OI analysis. Check connection.',
        thoughts: THOUGHT_STEPS,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setPreviewContent(data.success ? data.text : '');
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please retry.', timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
      setShowThoughts(false);
    }
  };

  const applyPreset = (preset: typeof SYSTEM_PRESETS[0]) => {
    setSystemInstruction(preset.instruction);
    setActivePreset(preset.id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-200px)] min-h-[500px]">
      {/* LEFT: Conversation */}
      <div className="glass-strong rounded-3xl flex flex-col overflow-hidden border border-cyan-500/15">
        {/* Header */}
        <div className="px-4 py-3 border-b border-cyan-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30">
              <BrainCircuit className="w-4 h-4 text-cyan-300" />
            </motion.div>
            <div>
              <div className="font-display font-bold text-white text-sm">OI Playground</div>
              <div className="text-[9px] font-mono text-cyan-400/60">Powered by Gemini · Context-aware</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowThoughts(!showThoughts)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-semibold transition-all ${showThoughts ? 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-300' : 'bg-slate-950/60 border border-cyan-500/10 text-slate-400 hover:text-cyan-300'}`}
            >
              <Eye className="w-3 h-3" /> Thoughts
            </button>
            <button
              onClick={() => setShowSystem(!showSystem)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-semibold transition-all ${showSystem ? 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-300' : 'bg-slate-950/60 border border-cyan-500/10 text-slate-400 hover:text-cyan-300'}`}
            >
              <Settings2 className="w-3 h-3" /> System
            </button>
          </div>
        </div>

        {/* System instructions panel */}
        <AnimatePresence>
          {showSystem && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-cyan-500/10"
            >
              <div className="p-3 space-y-2 bg-slate-950/40">
                <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/60">System Instructions</div>
                <div className="flex flex-wrap gap-1.5">
                  {SYSTEM_PRESETS.map(p => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => applyPreset(p)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${activePreset === p.id ? 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-300' : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-cyan-300'}`}
                      >
                        <Icon className="w-3 h-3" /> {p.label}
                      </button>
                    );
                  })}
                </div>
                <textarea
                  value={systemInstruction}
                  onChange={(e) => setSystemInstruction(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-cyan-500/10 focus:border-cyan-400 rounded-xl p-2.5 text-[11px] text-white outline-none resize-none font-sans leading-relaxed"
                  placeholder="Customize OI behavior..."
                />
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> OI remembers this instruction for all responses
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-400/30">
                <BrainCircuit className="w-8 h-8 text-cyan-300" />
              </motion.div>
              <div>
                <div className="font-display font-bold text-white text-sm">Ask Olayo Intelligence</div>
                <div className="text-[11px] text-slate-400 mt-1">Analyze data · Generate reports · Predict outcomes</div>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center max-w-sm">
                {['Prepare executive briefing', 'Predict harvest readiness', 'Analyze water quality', 'Generate monthly report'].map(q => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-950/60 border border-cyan-500/10 hover:border-cyan-400/30 text-[10px] text-slate-300 hover:text-cyan-300 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${msg.role === 'user' ? 'bg-slate-800' : 'bg-cyan-500/15 border border-cyan-400/30'}`}>
                {msg.role === 'user' ? <Sparkles className="w-3.5 h-3.5 text-slate-400" /> : <BrainCircuit className="w-3.5 h-3.5 text-cyan-300" />}
              </div>
              <div className={`flex-1 max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block text-left p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-slate-800/60 text-slate-200' : 'bg-slate-950/60 border border-cyan-500/10 text-cyan-100'}`}>
                  {msg.content}
                </div>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => { setPreviewContent(msg.content); setShowPreview(true); }}
                      className="text-[9px] font-mono text-cyan-400/60 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Layers className="w-2.5 h-2.5" /> Preview
                    </button>
                    <button
                      onClick={() => setShowExport(true)}
                      className="text-[9px] font-mono text-cyan-400/60 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Download className="w-2.5 h-2.5" /> Export
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Loading with thoughts */}
          {loading && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 shrink-0">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <BrainCircuit className="w-3.5 h-3.5 text-cyan-300" />
                </motion.div>
              </div>
              <div className="flex-1 space-y-2">
                {showThoughts && (
                  <div className="space-y-1.5">
                    {THOUGHT_STEPS.map((step, i) => {
                      const Icon = step.icon;
                      const isActive = i === activeThoughtStep;
                      const isPast = i < activeThoughtStep;
                      return (
                        <motion.div
                          key={i}
                          animate={isActive ? { scale: 1.02 } : { scale: 1 }}
                          className={`flex items-center gap-2 p-2 rounded-lg text-[10px] ${isActive ? 'bg-cyan-500/10 border border-cyan-400/30' : isPast ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-slate-950/40 border border-slate-800'}`}
                        >
                          <Icon className={`w-3 h-3 ${isActive ? 'text-cyan-300' : isPast ? 'text-emerald-400' : 'text-slate-600'}`} />
                          <span className={isActive ? 'text-white font-semibold' : isPast ? 'text-emerald-300' : 'text-slate-500'}>{step.label}</span>
                          <span className="text-slate-600 truncate hidden sm:inline">· {step.desc}</span>
                          {isPast && <CheckCircle className="w-3 h-3 text-emerald-400 ml-auto" />}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
                <div className="text-[11px] text-cyan-400/70 font-mono animate-pulse">OI is reasoning...</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input bar */}
        <div className="p-3 border-t border-cyan-500/10">
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-1.5">
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-300 transition-colors"><Paperclip className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-300 transition-colors"><Camera className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-300 transition-colors"><Mic className="w-3.5 h-3.5" /></button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) handleSend(); }}
              placeholder="Ask OI anything... (e.g., analyze this fish image, generate a supplier contract)"
              className="flex-1 bg-transparent border-0 outline-none text-xs text-white placeholder-slate-500 px-2"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Live preview / dual panel */}
      <div className="glass-strong rounded-3xl flex flex-col overflow-hidden border border-cyan-500/15">
        <div className="px-4 py-3 border-b border-cyan-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-400/20">
              <Layers className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm">Live Preview</div>
              <div className="text-[9px] font-mono text-emerald-400/60">Real-time document generation</div>
            </div>
          </div>
          <button
            onClick={() => setShowExport(!showExport)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-950/60 border border-cyan-500/10 text-[10px] font-mono text-cyan-300 hover:bg-cyan-500/10 transition-all"
          >
            <Download className="w-3 h-3" /> Export
          </button>
        </div>

        {/* Export menu */}
        <AnimatePresence>
          {showExport && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-cyan-500/10"
            >
              <div className="p-3 bg-slate-950/40">
                <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/60 mb-2">Export Format</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {EXPORT_FORMATS.map(f => {
                    const Icon = f.icon;
                    return (
                      <button
                        key={f.id}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-950/60 border border-cyan-500/10 hover:border-cyan-400/30 hover:bg-cyan-500/5 transition-all"
                      >
                        <Icon className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[9px] font-mono text-slate-300">{f.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview content */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-4">
          {previewContent ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-invert prose-sm max-w-none"
            >
              <div className="text-xs text-cyan-100 font-sans leading-relaxed whitespace-pre-line">
                {previewContent}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-cyan-500/10">
                <FileText className="w-8 h-8 text-slate-600" />
              </div>
              <div>
                <div className="font-display font-bold text-white text-sm">Document Preview</div>
                <div className="text-[11px] text-slate-400 mt-1">Ask OI to generate a report, and the formatted preview appears here in real-time</div>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center max-w-xs">
                {['Monthly report', 'Supplier contract', 'Feeding schedule', 'Biomass prediction'].map(q => (
                  <button
                    key={q}
                    onClick={() => handleSend(`Generate a ${q.toLowerCase()} document.`)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-950/60 border border-cyan-500/10 hover:border-cyan-400/30 text-[10px] text-slate-300 hover:text-cyan-300 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Layout variations */}
        <div className="p-3 border-t border-cyan-500/10">
          <div className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/60 mb-2 flex items-center gap-1.5">
            <RefreshCw className="w-2.5 h-2.5" /> Try another layout
          </div>
          <div className="flex gap-1.5">
            {['Executive', 'Dashboard', 'Report', 'Presentation'].map(layout => (
              <button
                key={layout}
                onClick={() => handleSend(`Regenerate this as a ${layout} layout.`)}
                className="flex-1 px-2 py-1.5 rounded-lg bg-slate-950/60 border border-cyan-500/10 hover:border-cyan-400/30 text-[9px] font-mono text-slate-300 hover:text-cyan-300 transition-all"
              >
                {layout}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
