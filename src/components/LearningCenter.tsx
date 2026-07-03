import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson, UserProfile } from '../types';
import { BookOpen, Award, CircleCheck as CheckCircle, ArrowRight, Play, Sparkles, Bookmark, BrainCircuit, GraduationCap, Fish, Droplets, Activity, Shield, ChefHat, X, Trophy, Target, Lightbulb, Eye, ChevronRight, Clock, Leaf, Zap } from 'lucide-react';

interface LearningCenterProps {
  lessons: Lesson[];
  currentUser: UserProfile;
  onUserCertified: (pointsEarned: number) => void;
  onAskOI?: (prompt: string) => void;
}

export default function LearningCenter({ lessons, currentUser, onUserCertified, onAskOI }: LearningCenterProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(-1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>([]);
  const [view, setView] = useState<'lessons' | 'anatomy' | 'water'>('lessons');

  const toggleBookmark = (id: string) => {
    setBookmarkedLessons(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const startQuiz = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setActiveQuestionIdx(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  const handleNextQuestion = () => {
    if (!selectedLesson) return;
    const currentQuestion = selectedLesson.questions[activeQuestionIdx];
    if (selectedOption === currentQuestion.correctIndex) setScore(prev => prev + 1);
    const nextIdx = activeQuestionIdx + 1;
    if (nextIdx < selectedLesson.questions.length) {
      setActiveQuestionIdx(nextIdx);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
      const passed = score + (selectedOption === currentQuestion.correctIndex ? 1 : 0) === selectedLesson.questions.length;
      if (passed && !completedLessons.includes(selectedLesson.id)) {
        setCompletedLessons(prev => [...prev, selectedLesson.id]);
        setPoints(prev => prev + selectedLesson.points);
        onUserCertified(selectedLesson.points);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display font-bold text-white text-lg sm:text-xl">Olayo Aquaculture Academy</h2>
          </div>
          <p className="text-xs text-slate-400 font-sans">Immersive learning · AI tutor · Certification programs</p>
        </div>
        {/* View switcher */}
        <div className="flex items-center bg-slate-950/60 border border-cyan-500/10 p-1 rounded-xl">
          {[
            { id: 'lessons', label: 'Lessons', icon: BookOpen },
            { id: 'anatomy', label: 'Anatomy', icon: Fish },
            { id: 'water', label: 'Water Lab', icon: Droplets },
          ].map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === v.id ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <v.icon className="w-3.5 h-3.5" />
              {v.label}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {view === 'lessons' && (
          <motion.div
            key="lessons"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {lessons.map((les, i) => {
                  const isCompleted = completedLessons.includes(les.id);
                  const isBookmarked = bookmarkedLessons.includes(les.id);
                  return (
                    <motion.div
                      key={les.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -2 }}
                      className="glass rounded-2xl p-5 hover:border-cyan-400/30 transition-all relative overflow-hidden group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 px-2.5 py-0.5 rounded border border-cyan-500/20 font-bold">
                              {les.category}
                            </span>
                            {isBookmarked && (
                              <span className="text-[9px] font-mono uppercase bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20 font-bold flex items-center gap-0.5">
                                ★ Saved
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold flex items-center gap-0.5">
                                <CheckCircle className="w-2.5 h-2.5" /> Passed
                              </span>
                            )}
                          </div>
                          <h4 className="font-display font-bold text-white text-sm sm:text-base">{les.title}</h4>
                          <p className="text-xs text-slate-400 font-sans mt-1">{les.excerpt}</p>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <span className="text-[11px] text-slate-500 font-mono block">{les.readTime}</span>
                          <span className="text-xs text-emerald-400 font-mono block font-semibold mt-1">+{les.points} pts</span>
                        </div>
                      </div>

                      <div className="border-t border-cyan-500/10 pt-3 mt-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs text-slate-400">{les.questions.length} audit questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleBookmark(les.id)}
                            className={`p-1.5 rounded-lg border transition-all ${isBookmarked ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-slate-950/40 border-cyan-500/10 text-slate-400 hover:text-orange-400'}`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => startQuiz(les)}
                            className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 flex items-center gap-1 shadow-md shadow-cyan-500/10"
                          >
                            <Play className="w-3 h-3 fill-current" /> {isCompleted ? 'Review' : 'Study & Audit'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <CertificationStatus currentUser={currentUser} points={points} completedCount={completedLessons.length} totalLessons={lessons.length} />
              <AnimatePresence mode="wait">
                {selectedLesson && activeQuestionIdx !== -1 && (
                  <QuizConsole
                    lesson={selectedLesson}
                    activeQuestionIdx={activeQuestionIdx}
                    selectedOption={selectedOption}
                    score={score}
                    quizFinished={quizFinished}
                    onSelectOption={setSelectedOption}
                    onNext={handleNextQuestion}
                    onRetry={() => startQuiz(selectedLesson)}
                    onClose={() => { setSelectedLesson(null); setActiveQuestionIdx(-1); }}
                  />
                )}
              </AnimatePresence>
              <AITutorCard onAskOI={onAskOI} />
            </div>
          </motion.div>
        )}

        {view === 'anatomy' && (
          <motion.div
            key="anatomy"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <FishAnatomyLab onAskOI={onAskOI} />
          </motion.div>
        )}

        {view === 'water' && (
          <motion.div
            key="water"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <WaterQualityLab onAskOI={onAskOI} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============ CERTIFICATION STATUS ============ */
function CertificationStatus({ currentUser, points, completedCount, totalLessons }: { currentUser: UserProfile; points: number; completedCount: number; totalLessons: number }) {
  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/15 pb-2">Your Certification Status</h4>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl border ${currentUser.certified ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5 animate-pulse' : 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5'}`}>
          <Award className="w-8 h-8" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">{currentUser.name}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{currentUser.role}</div>
        </div>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between"><span className="text-slate-400">Academy Points:</span><span className="font-mono text-cyan-300 font-bold">{points} pts</span></div>
        <div className="flex justify-between"><span className="text-slate-400">Lessons Mastered:</span><span className="font-mono text-cyan-300 font-bold">{completedCount} / {totalLessons}</span></div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Olayo Expert Stamp:</span>
          {currentUser.certified ? (
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">Certified</span>
          ) : (
            <span className="text-[10px] font-mono text-slate-500 bg-slate-950 border border-slate-900 px-2 py-0.5 rounded-full uppercase">Uncertified (Req. 150pts)</span>
          )}
        </div>
      </div>
      {currentUser.certified && (
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex gap-2 items-start">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[10px] text-emerald-200 font-sans leading-normal">
            Congratulations! You are officially recognized as an Olayo Certified Aquaculture Professional.
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ QUIZ CONSOLE ============ */
function QuizConsole({ lesson, activeQuestionIdx, selectedOption, score, quizFinished, onSelectOption, onNext, onRetry, onClose }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass rounded-2xl p-5 relative"
    >
      <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white text-xs font-mono">Exit [x]</button>
      {!quizFinished ? (
        <div className="space-y-4">
          <div className="text-[10px] font-mono text-cyan-400/70 uppercase">Interactive Competency Audit</div>
          <h4 className="font-display font-semibold text-white text-xs sm:text-sm">{lesson.title}</h4>
          <div className="flex gap-1.5 h-1 bg-slate-800 rounded overflow-hidden">
            {lesson.questions.map((_: any, qIdx: number) => (
              <div key={qIdx} className={`flex-1 transition-colors duration-300 ${qIdx <= activeQuestionIdx ? 'bg-cyan-400' : 'bg-slate-800'}`} />
            ))}
          </div>
          <p className="text-xs text-cyan-100 font-sans leading-relaxed pt-2">{lesson.questions[activeQuestionIdx].question}</p>
          <div className="space-y-2 pt-2">
            {lesson.questions[activeQuestionIdx].options.map((opt: string, optIdx: number) => (
              <button
                key={optIdx}
                onClick={() => onSelectOption(optIdx)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${selectedOption === optIdx ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300' : 'bg-slate-950/40 border-cyan-500/5 text-slate-300 hover:border-cyan-400/20'}`}
              >
                <span>{opt}</span>
                {selectedOption === optIdx && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
              </button>
            ))}
          </div>
          <button
            onClick={onNext}
            disabled={selectedOption === null}
            className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 ${selectedOption !== null ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold' : 'bg-slate-800 text-slate-500'}`}
          >
            Confirm Answer <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4 py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-sm">Audit Concluded</h4>
            <p className="text-xs text-slate-400 mt-1">Scored {score} of {lesson.questions.length} correctly.</p>
          </div>
          {score === lesson.questions.length ? (
            <div className="p-3 bg-emerald-950/35 rounded-xl border border-emerald-500/20 text-xs text-emerald-200">
              Perfect score! +{lesson.points} points toward Olayo Certification.
            </div>
          ) : (
            <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-500/20 text-xs text-cyan-300">
              Great effort. Master all questions to earn certification points.
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={onRetry} className="flex-1 py-1.5 rounded-lg border border-cyan-500/20 text-cyan-300 hover:bg-slate-900 text-xs">Retry</button>
            <button onClick={onClose} className="flex-1 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 text-xs">Done</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ============ AI TUTOR CARD ============ */
function AITutorCard({ onAskOI }: { onAskOI?: (p: string) => void }) {
  const prompts = [
    'Explain cage aquaculture basics',
    'How does dissolved oxygen affect fish?',
    'Why is cold chain important?',
  ];
  return (
    <div className="glass-luminous rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30"
        >
          <BrainCircuit className="w-4 h-4 text-cyan-300" />
        </motion.div>
        <h4 className="font-display font-semibold text-white text-xs">AI Tutor</h4>
      </div>
      <p className="text-[11px] text-slate-300 font-sans">Ask OI to explain any aquaculture concept.</p>
      <div className="space-y-1.5">
        {prompts.map(p => (
          <button
            key={p}
            onClick={() => onAskOI?.(p)}
            className="w-full text-left p-2 rounded-lg bg-slate-950/40 border border-cyan-500/10 hover:border-cyan-400/30 hover:bg-cyan-500/5 text-[11px] text-slate-300 transition-all flex items-center justify-between"
          >
            {p}
            <ChevronRight className="w-3 h-3 text-slate-600" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============ FISH ANATOMY LAB ============ */
function FishAnatomyLab({ onAskOI }: { onAskOI?: (p: string) => void }) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const parts = [
    { id: 'gills', label: 'Gills', desc: 'Respiratory organ — extracts dissolved oxygen from water. Healthy gills are bright red.', x: 35, y: 50 },
    { id: 'dorsal', label: 'Dorsal Fin', desc: 'Provides stability while swimming. Damage indicates poor water quality.', x: 50, y: 25 },
    { id: 'scales', label: 'Scales', desc: 'Protective armor. Bright, intact scales indicate freshness and health.', x: 60, y: 50 },
    { id: 'eye', label: 'Eye', desc: 'Clear, bulbous eyes indicate prime freshness. Cloudy eyes suggest degradation.', x: 25, y: 40 },
    { id: 'tail', label: 'Caudal Fin', desc: 'Propulsion. Firm tail texture indicates proper cold chain handling.', x: 85, y: 50 },
  ];

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Fish className="w-5 h-5 text-cyan-400" />
        <h3 className="font-display font-semibold text-white text-sm">Interactive Fish Anatomy — Nile Tilapia</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SVG fish */}
        <div className="relative bg-slate-950/40 rounded-2xl p-6 border border-cyan-500/10 min-h-[280px] flex items-center justify-center">
          <svg viewBox="0 0 300 150" className="w-full max-w-md">
            {/* Fish body */}
            <motion.path
              d="M30,75 C50,40 100,30 150,40 C200,30 250,50 270,75 C250,100 200,120 150,110 C100,120 50,110 30,75 Z M270,75 L290,60 L290,90 Z"
              fill="rgba(34,211,238,0.1)"
              stroke="rgba(34,211,238,0.4)"
              strokeWidth="1.5"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            {/* Interactive hotspots */}
            {parts.map(p => (
              <g key={p.id}>
                <motion.circle
                  cx={p.x * 3}
                  cy={p.y * 1.5}
                  r={hoveredPart === p.id ? 8 : 5}
                  fill={hoveredPart === p.id ? 'rgba(34,211,238,0.8)' : 'rgba(34,211,238,0.4)'}
                  stroke="white"
                  strokeWidth="1"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPart(p.id)}
                  onMouseLeave={() => setHoveredPart(null)}
                  animate={{ r: hoveredPart === p.id ? 8 : 5 }}
                />
                {hoveredPart === p.id && (
                  <text x={p.x * 3} y={p.y * 1.5 - 12} fill="white" fontSize="9" textAnchor="middle" className="font-mono">
                    {p.label}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Info panel */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono text-cyan-400/60 uppercase">Hover the hotspots to explore</div>
          {hoveredPart ? (
            <motion.div
              key={hoveredPart}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-950/40 rounded-xl p-4 border border-cyan-500/20"
            >
              <h4 className="font-display font-bold text-white text-sm mb-1">{parts.find(p => p.id === hoveredPart)?.label}</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{parts.find(p => p.id === hoveredPart)?.desc}</p>
            </motion.div>
          ) : (
            <div className="bg-slate-950/40 rounded-xl p-4 border border-cyan-500/10 text-center text-xs text-slate-500">
              Hover over the markers to learn about each anatomical feature
            </div>
          )}
          <button
            onClick={() => onAskOI?.('Explain the anatomy of Nile Tilapia and how each feature relates to freshness assessment.')}
            className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 flex items-center justify-center gap-1.5"
          >
            <BrainCircuit className="w-3.5 h-3.5" /> Ask OI to explain anatomy
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ WATER QUALITY LAB ============ */
function WaterQualityLab({ onAskOI }: { onAskOI?: (p: string) => void }) {
  const [oxygen, setOxygen] = useState(6.5);
  const [ph, setPh] = useState(7.5);
  const [temp, setTemp] = useState(25);

  const status = useMemo(() => {
    const issues: string[] = [];
    if (oxygen < 4) issues.push('Critical: O₂ below mortality threshold');
    else if (oxygen < 5.5) issues.push('Warning: O₂ trending low');
    if (ph < 6.5) issues.push('pH too acidic — gill irritation risk');
    else if (ph > 9.5) issues.push('pH too alkaline — ammonia toxicity risk');
    if (temp > 28) issues.push('Temperature high — reduced oxygen capacity');
    if (temp < 20) issues.push('Temperature low — reduced feeding');
    return issues;
  }, [oxygen, ph, temp]);

  const healthScore = useMemo(() => {
    let s = 100;
    if (oxygen < 4) s -= 40;
    else if (oxygen < 5.5) s -= 20;
    if (ph < 6.5 || ph > 9.5) s -= 25;
    if (temp > 28 || temp < 20) s -= 15;
    return Math.max(0, s);
  }, [oxygen, ph, temp]);

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Droplets className="w-5 h-5 text-cyan-400" />
        <h3 className="font-display font-semibold text-white text-sm">Water Quality Simulation Lab</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders */}
        <div className="space-y-5">
          <SliderControl
            label="Dissolved Oxygen"
            value={oxygen}
            min={0} max={10} step={0.1}
            unit="mg/L"
            onChange={setOxygen}
            color={oxygen < 4 ? 'red' : oxygen < 5.5 ? 'orange' : 'emerald'}
          />
          <SliderControl
            label="pH Level"
            value={ph}
            min={4} max={11} step={0.1}
            unit=""
            onChange={setPh}
            color={ph < 6.5 || ph > 9.5 ? 'red' : 'emerald'}
          />
          <SliderControl
            label="Water Temperature"
            value={temp}
            min={15} max={32} step={0.5}
            unit="°C"
            onChange={setTemp}
            color={temp > 28 || temp < 20 ? 'orange' : 'emerald'}
          />
        </div>

        {/* Status panel */}
        <div className="space-y-3">
          <div className={`rounded-2xl p-4 border ${healthScore >= 80 ? 'bg-emerald-950/30 border-emerald-500/30' : healthScore >= 50 ? 'bg-orange-950/30 border-orange-500/30' : 'bg-red-950/30 border-red-500/30'}`}>
            <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">Health Score</div>
            <div className={`font-display font-extrabold text-3xl ${healthScore >= 80 ? 'text-emerald-400' : healthScore >= 50 ? 'text-orange-400' : 'text-red-400'}`}>{healthScore}<span className="text-base text-slate-500">/100</span></div>
          </div>
          {status.length === 0 ? (
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-200">All parameters within optimal range</span>
            </div>
          ) : (
            <div className="space-y-2">
              {status.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2 p-2 rounded-lg bg-orange-950/30 border border-orange-500/30"
                >
                  <Zap className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-orange-200">{s}</span>
                </motion.div>
              ))}
            </div>
          )}
          <button
            onClick={() => onAskOI?.(`Analyze water quality: O₂ ${oxygen} mg/L, pH ${ph}, temp ${temp}°C. Health score ${healthScore}/100. Recommend actions.`)}
            className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 flex items-center justify-center gap-1.5"
          >
            <BrainCircuit className="w-3.5 h-3.5" /> Ask OI to analyze
          </button>
        </div>
      </div>
    </div>
  );
}

function SliderControl({ label, value, min, max, step, unit, onChange, color }: any) {
  const colorMap: Record<string, string> = {
    emerald: 'accent-emerald-400',
    orange: 'accent-orange-400',
    red: 'accent-red-400',
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono text-slate-400">{label}</span>
        <span className={`text-sm font-mono font-bold ${color === 'emerald' ? 'text-emerald-400' : color === 'orange' ? 'text-orange-400' : 'text-red-400'}`}>{value.toFixed(1)}{unit}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-2 rounded-full bg-slate-800 ${colorMap[color]}`}
      />
    </div>
  );
}
