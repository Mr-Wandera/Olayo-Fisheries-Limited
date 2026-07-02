import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BrainCircuit, Search, Circle as HelpCircle, CircleAlert as AlertCircle, ChefHat, Fish, Scale, ShieldCheck } from 'lucide-react';

interface AiAssistantProps {
  onSearchResult?: (matchedText: string) => void;
}

const SAMPLE_IMAGES = [
  {
    name: 'Nile Tilapia',
    img: 'https://images.pexels.com/photos/3296286/pexels-photo-3296286.jpeg?auto=compress&fit=crop&w=200',
    prompt: 'Identify this Nile Tilapia from Busiime cage grid on Lake Victoria.'
  },
  {
    name: 'Nile Perch',
    img: 'https://images.pexels.com/photos/3296286/pexels-photo-3296286.jpeg?auto=compress&fit=crop&w=200',
    prompt: 'Identify this Nile Perch, a large predatory fish from Lake Victoria cages.'
  },
  {
    name: 'African Catfish',
    img: 'https://images.pexels.com/photos/3296286/pexels-photo-3296286.jpeg?auto=compress&fit=crop&w=200',
    prompt: 'Identify this African Catfish from Busiime cage grid, Lake Victoria.'
  },
  {
    name: 'Tilapia Fillet',
    img: 'https://images.pexels.com/photos/3296286/pexels-photo-3296286.jpeg?auto=compress&fit=crop&w=200',
    prompt: 'Identify this fresh tilapia fillet from Olayo Fisheries processing hub.'
  }
];

export default function AiAssistant({ onSearchResult }: AiAssistantProps) {
  const [activeTab, setActiveTab] = useState<'identify' | 'freshness' | 'price' | 'recipe' | 'search'>('identify');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleAnalyze = async (overridePrompt?: string, overrideImg?: string) => {
    setLoading(true);
    setResponse(null);
    try {
      const payload = {
        prompt: overridePrompt || prompt,
        imageBase64: overrideImg || selectedImage || '',
        mode: activeTab
      };

      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setResponse(data.text);
        if (activeTab === 'search' && onSearchResult) {
          onSearchResult(data.text);
        }
      } else {
        setResponse('Unable to retrieve Olayo AI analysis. Check network bindings.');
      }
    } catch (err) {
      console.error(err);
      setResponse('Connection timed out. Gemini API is operating on secondary satellite redundancy.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-5 backdrop-blur-md shadow-2xl flex flex-col h-[560px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-base">Olayo Intelligence (OI)</h3>
            <p className="text-[10px] text-cyan-300/60 font-mono">Powered by Google Gemini 3.5 Flash</p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-cyan-400 animate-spin-slow" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-cyan-500/10 pb-2 mb-4 scrollbar-none">
        {[
          { id: 'identify', label: 'Identify Species', icon: Fish },
          { id: 'freshness', label: 'Freshness Assay', icon: ShieldCheck },
          { id: 'price', label: 'Price Index', icon: Scale },
          { id: 'recipe', label: 'Chef Kitchen', icon: ChefHat },
          { id: 'search', label: 'Semantic Search', icon: Search }
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => {
              setActiveTab(tb.id as any);
              setResponse(null);
              setSelectedImage(null);
              setPrompt('');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300 whitespace-nowrap ${activeTab === tb.id ? 'bg-cyan-500 border-cyan-300 text-slate-950 font-bold' : 'bg-slate-950/60 border-cyan-500/10 text-cyan-300 hover:border-cyan-400/30'}`}
          >
            <tb.icon className="w-3.5 h-3.5" />
            {tb.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content input according to Tab */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto space-y-4">
        {/* If Identify tab, show preset images option */}
        {activeTab === 'identify' && !response && !loading && (
          <div className="space-y-3">
            <div className="text-[11px] font-mono text-cyan-300/80">Select aquaculture sample to analyze:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_IMAGES.map(img => (
                <button
                  key={img.name}
                  onClick={() => {
                    setSelectedImage(img.img);
                    handleAnalyze(img.prompt, img.img);
                  }}
                  className="group relative rounded-xl overflow-hidden border border-cyan-500/20 hover:border-cyan-400/60 transition-all duration-300 h-20 text-left"
                >
                  <img src={img.img} alt={img.name} className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-1.5 flex items-end">
                    <span className="text-[9px] font-sans font-semibold text-white leading-tight">{img.name}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="text-center text-xs text-slate-400 my-2">-- OR type organic traits --</div>
          </div>
        )}

        {/* Response / Loading Canvas */}
        <div className="flex-1 min-h-[160px] bg-slate-950/85 border border-cyan-500/10 rounded-xl p-4 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-3 text-cyan-400 p-6 text-center"
              >
                {/* Swim-cycle loading spinner of fish as requested! */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute w-12 h-12 rounded-full border-t-2 border-cyan-400 animate-spin" />
                  <Fish className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
                <div className="text-xs font-mono font-semibold animate-pulse">
                  STREAMS INITIATED... Analyzing aquaculture telemetry data & grading quality...
                </div>
              </motion.div>
            ) : response ? (
              <motion.div
                key="response"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-cyan-100 font-sans leading-relaxed space-y-2 whitespace-pre-line"
              >
                {response}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="text-center py-10 text-cyan-100/30 text-xs flex flex-col items-center justify-center space-y-2"
              >
                <HelpCircle className="w-8 h-8 text-cyan-500/20" />
                <div>
                  {activeTab === 'identify' && 'Select a photo above or type fish characteristics to identify the species.'}
                  {activeTab === 'freshness' && 'Type quality data (gill color, eye clarity, firmness) to assess freshness grade.'}
                  {activeTab === 'price' && 'Specify species and origin to get market pricing and demand forecasts.'}
                  {activeTab === 'recipe' && 'Enter fish species for East African recipe suggestions.'}
                  {activeTab === 'search' && 'Type keywords like "high protein, fresh water fish" to search our aquaculture catalog.'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input box */}
        {!loading && (
          <div className="flex gap-2 items-center bg-slate-950/80 border border-cyan-500/20 p-1.5 rounded-xl">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && prompt.trim()) {
                  handleAnalyze();
                }
              }}
              placeholder={
                activeTab === 'identify' ? 'Describe body markings, fins, or gills...' :
                activeTab === 'freshness' ? 'Enter gill color, odor level, or firmness...' :
                activeTab === 'price' ? 'Enter species and origin for market pricing...' :
                activeTab === 'recipe' ? 'Tilapia, Nile perch, catfish...' :
                'Query, e.g., "high protein, fresh water fish"...'
              }
              className="flex-1 bg-transparent border-0 ring-0 outline-none text-xs text-white px-3 py-2 font-sans placeholder-cyan-100/30"
            />
            <button
              onClick={() => handleAnalyze()}
              disabled={!prompt.trim() && !selectedImage}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 font-display flex items-center gap-1 ${prompt.trim() || selectedImage ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              Consult AI
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
