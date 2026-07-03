import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson, UserProfile } from '../types';
import {
  BookOpen, Award, CircleCheck as CheckCircle, ArrowRight, Play, Sparkles, Bookmark,
  BrainCircuit, GraduationCap, Fish, Droplets, Activity, Shield, X, Trophy, Target,
  Lightbulb, Eye, ChevronRight, Clock, Leaf, Zap, Microscope, FlaskConical,
  Stethoscope, Compass, Lock, Star, TrendingUp, Atom, Thermometer, Beaker, AlertTriangle
} from 'lucide-react';

interface LearningCenterProps {
  lessons: Lesson[];
  currentUser: UserProfile;
  onUserCertified: (pointsEarned: number) => void;
  onAskOI?: (prompt: string) => void;
}

type LabView = 'lessons' | 'anatomy' | 'water' | 'disease' | 'walkthrough';

export default function LearningCenter({ lessons, currentUser, onUserCertified, onAskOI }: LearningCenterProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(-1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>([]);
  const [view, setView] = useState<LabView>('lessons');

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

  const labTabs: { id: LabView; label: string; icon: React.ElementType; hint: string }[] = [
    { id: 'lessons', label: 'Lessons', icon: BookOpen, hint: 'Certification courses' },
    { id: 'anatomy', label: 'Anatomy', icon: Fish, hint: 'Virtual dissection lab' },
    { id: 'water', label: 'Water Lab', icon: Droplets, hint: 'Chemistry simulator' },
    { id: 'disease', label: 'Disease Lab', icon: Stethoscope, hint: 'Diagnostic lab' },
    { id: 'walkthrough', label: 'Cage Walk', icon: Compass, hint: 'Virtual farm tour' },
  ];

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
          <p className="text-xs text-slate-400 font-sans">Immersive labs · AI tutor · Certification journeys · Gamified progress</p>
        </div>
        {/* Lab switcher */}
        <div className="flex items-center bg-slate-950/60 border border-cyan-500/10 p-1 rounded-xl flex-wrap gap-0.5">
          {labTabs.map(v => {
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === v.id ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {v.label}
              </button>
            );
          })}
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
              {/* Gamified progress bar */}
              <GamifiedProgress points={points} completedCount={completedLessons.length} totalLessons={lessons.length} />

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
                                <Star className="w-2.5 h-2.5 fill-current" /> Saved
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
                {selectedLesson && activeQuestionIdx !== -1 ? (
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
                ) : (
                  <AITutorCard onAskOI={onAskOI} />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {view === 'anatomy' && (
          <motion.div key="anatomy" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <FishAnatomyLab onAskOI={onAskOI} />
          </motion.div>
        )}

        {view === 'water' && (
          <motion.div key="water" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <WaterQualityLab onAskOI={onAskOI} />
          </motion.div>
        )}

        {view === 'disease' && (
          <motion.div key="disease" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <DiseaseDiagnosisLab onAskOI={onAskOI} />
          </motion.div>
        )}

        {view === 'walkthrough' && (
          <motion.div key="walkthrough" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <CageWalkthrough onAskOI={onAskOI} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============ GAMIFIED PROGRESS ============ */
function GamifiedProgress({ points, completedCount, totalLessons }: { points: number; completedCount: number; totalLessons: number }) {
  const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
  const level = Math.floor(points / 50) + 1;
  const nextLevelPoints = level * 50;
  const levelProgress = ((points % 50) / 50) * 100;

  const badges = [
    { icon: Seedling, label: 'First Steps', earned: completedCount >= 1, color: 'text-emerald-400' },
    { icon: Droplets, label: 'Water Steward', earned: completedCount >= 2, color: 'text-cyan-400' },
    { icon: Fish, label: 'Fish Expert', earned: completedCount >= 3, color: 'text-teal-400' },
    { icon: Trophy, label: 'Master', earned: completedCount >= 5, color: 'text-amber-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong rounded-2xl p-5 border border-cyan-500/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30">
            <Trophy className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Level {level} · Aquaculture Scholar</div>
            <div className="text-[10px] font-mono text-slate-500">{points} total points · {completedCount}/{totalLessons} mastered</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-500">Next: Lv {level + 1}</div>
          <div className="text-[10px] font-mono text-cyan-400">{nextLevelPoints - points} pts to go</div>
        </div>
      </div>

      {/* Level progress bar */}
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${levelProgress}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400"
        />
      </div>

      {/* Badges */}
      <div className="flex items-center gap-3">
        {badges.map((b, i) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col items-center gap-1 ${b.earned ? '' : 'opacity-30'}`}
            >
              <div className={`p-2 rounded-xl border ${b.earned ? `border-cyan-500/30 bg-cyan-500/5 ${b.color}` : 'border-slate-700 bg-slate-900 text-slate-600'}`}>
                {b.earned ? <Icon className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <span className="text-[8px] font-mono text-slate-500">{b.label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function Seedling({ className }: { className?: string }) {
  return <Leaf className={className} />;
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
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [dissectMode, setDissectMode] = useState(false);

  const parts = [
    { id: 'gills', label: 'Gills', desc: 'Respiratory organ — extracts dissolved oxygen from water. Healthy gills are bright red. Pale or eroded gills indicate ammonia toxicity or bacterial infection.', x: 35, y: 50, layer: 'external' },
    { id: 'dorsal', label: 'Dorsal Fin', desc: 'Provides stability while swimming. Damage indicates poor water quality or aggressive behavior in overcrowded cages.', x: 50, y: 25, layer: 'external' },
    { id: 'scales', label: 'Scales', desc: 'Protective armor. Bright, intact scales indicate freshness and health. Scale loss suggests stress, parasites, or handling damage.', x: 60, y: 50, layer: 'external' },
    { id: 'eye', label: 'Eye', desc: 'Clear, bulbous eyes indicate prime freshness. Cloudy eyes suggest degradation post-harvest. Exophthalmia (pop-eye) signals bacterial infection.', x: 25, y: 40, layer: 'external' },
    { id: 'tail', label: 'Caudal Fin', desc: 'Propulsion. Firm tail texture indicates proper cold chain handling. Eroded fins suggest poor water quality or fin rot disease.', x: 85, y: 50, layer: 'external' },
    { id: 'swim_bladder', label: 'Swim Bladder', desc: 'Internal gas-filled organ regulating buoyancy. Disorders cause floating or sinking abnormalities — often linked to water pressure or feed issues.', x: 55, y: 55, layer: 'internal' },
    { id: 'intestine', label: 'Intestine', desc: 'Digestive tract. Healthy intestine is pale pink. Inflammation or reddening suggests enteritis from contaminated feed or parasites.', x: 65, y: 60, layer: 'internal' },
    { id: 'liver', label: 'Liver', desc: 'Detoxification and metabolism. Pale, fatty liver indicates nutritional imbalance. Dark, enlarged liver suggests toxin exposure or fatty liver disease.', x: 45, y: 58, layer: 'internal' },
  ];

  const visibleParts = dissectMode ? parts : parts.filter(p => p.layer === 'external');
  const activePart = hoveredPart || selectedPart;

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Fish className="w-5 h-5 text-cyan-400" />
          <h3 className="font-display font-semibold text-white text-sm">Interactive Fish Anatomy — Nile Tilapia</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500">Dissection mode</span>
          <button
            onClick={() => setDissectMode(!dissectMode)}
            className={`relative w-10 h-5 rounded-full transition-colors ${dissectMode ? 'bg-cyan-500' : 'bg-slate-700'}`}
          >
            <motion.div
              animate={{ x: dissectMode ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SVG fish */}
        <div className="relative bg-slate-950/40 rounded-2xl p-6 border border-cyan-500/10 min-h-[320px] flex items-center justify-center overflow-hidden">
          {/* Water ambient */}
          <motion.div
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 to-transparent"
          />
          <svg viewBox="0 0 300 150" className="w-full max-w-md relative z-10">
            {/* Fish body */}
            <motion.path
              d="M30,75 C50,40 100,30 150,40 C200,30 250,50 270,75 C250,100 200,120 150,110 C100,120 50,110 30,75 Z M270,75 L290,60 L290,90 Z"
              fill={dissectMode ? 'rgba(34,211,238,0.03)' : 'rgba(34,211,238,0.1)'}
              stroke="rgba(34,211,238,0.4)"
              strokeWidth="1.5"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            {/* Internal organs (visible in dissect mode) */}
            <AnimatePresence>
              {dissectMode && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                >
                  <ellipse cx={135} cy={87} rx="20" ry="8" fill="rgba(239,68,68,0.3)" stroke="rgba(239,68,68,0.5)" strokeWidth="0.5" />
                  <ellipse cx={165} cy={90} rx="15" ry="6" fill="rgba(245,158,11,0.3)" stroke="rgba(245,158,11,0.5)" strokeWidth="0.5" />
                  <ellipse cx={195} cy={85} rx="12" ry="5" fill="rgba(168,85,247,0.2)" stroke="rgba(168,85,247,0.4)" strokeWidth="0.5" />
                </motion.g>
              )}
            </AnimatePresence>
            {/* Interactive hotspots */}
            {visibleParts.map(p => (
              <g key={p.id}>
                <motion.circle
                  cx={p.x * 3}
                  cy={p.y * 1.5}
                  r={activePart === p.id ? 8 : 5}
                  fill={activePart === p.id ? 'rgba(34,211,238,0.8)' : p.layer === 'internal' ? 'rgba(245,158,11,0.5)' : 'rgba(34,211,238,0.4)'}
                  stroke="white"
                  strokeWidth="1"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPart(p.id)}
                  onMouseLeave={() => setHoveredPart(null)}
                  onClick={() => setSelectedPart(p.id)}
                  animate={{ r: activePart === p.id ? 8 : 5 }}
                />
                {activePart === p.id && (
                  <text x={p.x * 3} y={p.y * 1.5 - 12} fill="white" fontSize="9" textAnchor="middle" className="font-mono">
                    {p.label}
                  </text>
                )}
              </g>
            ))}
          </svg>
          {/* Layer indicator */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[9px] font-mono">
            <span className={`px-2 py-0.5 rounded ${!dissectMode ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-600'}`}>External</span>
            <span className={`px-2 py-0.5 rounded ${dissectMode ? 'bg-orange-500/20 text-orange-300' : 'text-slate-600'}`}>Internal</span>
          </div>
        </div>

        {/* Info panel */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono text-cyan-400/60 uppercase">
            {dissectMode ? 'Click hotspots to explore internal anatomy' : 'Click hotspots to explore external anatomy'}
          </div>
          <AnimatePresence mode="wait">
            {activePart ? (
              <motion.div
                key={activePart}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-slate-950/40 rounded-xl p-4 border border-cyan-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${parts.find(p => p.id === activePart)?.layer === 'internal' ? 'bg-orange-500/10' : 'bg-cyan-500/10'}`}>
                    {parts.find(p => p.id === activePart)?.layer === 'internal' ? <Microscope className="w-3 h-3 text-orange-400" /> : <Eye className="w-3 h-3 text-cyan-400" />}
                  </div>
                  <h4 className="font-display font-bold text-white text-sm">{parts.find(p => p.id === activePart)?.label}</h4>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{parts.find(p => p.id === activePart)?.desc}</p>
              </motion.div>
            ) : (
              <div className="bg-slate-950/40 rounded-xl p-4 border border-cyan-500/10 text-center text-xs text-slate-500">
                Click on the markers to learn about each anatomical feature. Toggle dissection mode to see internal organs.
              </div>
            )}
          </AnimatePresence>
          <button
            onClick={() => onAskOI?.('Explain the anatomy of Nile Tilapia and how each feature relates to freshness assessment and disease diagnosis.')}
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
  const [ammonia, setAmmonia] = useState(0.1);
  const [turbidity, setTurbidity] = useState(5);

  const status = useMemo(() => {
    const issues: string[] = [];
    if (oxygen < 4) issues.push('Critical: O₂ below mortality threshold');
    else if (oxygen < 5.5) issues.push('Warning: O₂ trending low');
    if (ph < 6.5) issues.push('pH too acidic — gill irritation risk');
    else if (ph > 9.5) issues.push('pH too alkaline — ammonia toxicity risk');
    if (temp > 28) issues.push('Temperature high — reduced oxygen capacity');
    if (temp < 20) issues.push('Temperature low — reduced feeding');
    if (ammonia > 0.5) issues.push('Critical: Ammonia toxicity — gill damage imminent');
    else if (ammonia > 0.2) issues.push('Warning: Ammonia elevated — monitor closely');
    if (turbidity > 30) issues.push('Turbidity high — reduced light penetration, feed detection impaired');
    return issues;
  }, [oxygen, ph, temp, ammonia, turbidity]);

  const healthScore = useMemo(() => {
    let s = 100;
    if (oxygen < 4) s -= 40;
    else if (oxygen < 5.5) s -= 20;
    if (ph < 6.5 || ph > 9.5) s -= 25;
    if (temp > 28 || temp < 20) s -= 15;
    if (ammonia > 0.5) s -= 30;
    else if (ammonia > 0.2) s -= 10;
    if (turbidity > 30) s -= 10;
    return Math.max(0, s);
  }, [oxygen, ph, temp, ammonia, turbidity]);

  // Visual water color based on parameters
  const waterColor = useMemo(() => {
    let r = 34, g = 211, b = 238, a = 0.15;
    if (turbidity > 20) { r = 100; g = 90; b = 60; a = 0.3; }
    if (ammonia > 0.3) { g = Math.max(80, g - 100); }
    if (oxygen < 4) { b = Math.max(60, b - 100); }
    return `rgba(${r},${g},${b},${a})`;
  }, [turbidity, ammonia, oxygen]);

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Droplets className="w-5 h-5 text-cyan-400" />
        <h3 className="font-display font-semibold text-white text-sm">Water Quality Simulation Lab</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders + visual */}
        <div className="space-y-5">
          {/* Visual beaker */}
          <div className="relative bg-slate-950/40 rounded-2xl p-4 border border-cyan-500/10 h-32 overflow-hidden">
            <div className="absolute inset-0 flex items-end justify-center">
              <motion.div
                animate={{ height: `${Math.max(20, healthScore)}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                className="w-full relative overflow-hidden"
                style={{ background: waterColor }}
              >
                {/* Bubbles */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/20"
                    style={{ width: 4 + i * 2, height: 4 + i * 2, left: `${15 + i * 20}%` }}
                    animate={{ y: [40, -60], opacity: [0, 0.6, 0] }}
                    transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
                  />
                ))}
              </motion.div>
            </div>
            <div className="relative z-10 flex items-center justify-between h-full">
              <div className="flex items-center gap-1.5">
                <Beaker className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono text-slate-400">Live Simulation</span>
              </div>
              <div className={`text-lg font-display font-bold ${healthScore >= 80 ? 'text-emerald-400' : healthScore >= 50 ? 'text-orange-400' : 'text-red-400'}`}>
                {healthScore}
              </div>
            </div>
          </div>

          <SliderControl label="Dissolved Oxygen" value={oxygen} min={0} max={10} step={0.1} unit="mg/L" onChange={setOxygen} color={oxygen < 4 ? 'red' : oxygen < 5.5 ? 'orange' : 'emerald'} />
          <SliderControl label="pH Level" value={ph} min={4} max={11} step={0.1} unit="" onChange={setPh} color={ph < 6.5 || ph > 9.5 ? 'red' : 'emerald'} />
          <SliderControl label="Water Temperature" value={temp} min={15} max={32} step={0.5} unit="°C" onChange={setTemp} color={temp > 28 || temp < 20 ? 'orange' : 'emerald'} />
          <SliderControl label="Ammonia (NH₃)" value={ammonia} min={0} max={1} step={0.01} unit="mg/L" onChange={setAmmonia} color={ammonia > 0.5 ? 'red' : ammonia > 0.2 ? 'orange' : 'emerald'} />
          <SliderControl label="Turbidity" value={turbidity} min={0} max={50} step={1} unit="NTU" onChange={setTurbidity} color={turbidity > 30 ? 'orange' : 'emerald'} />
        </div>

        {/* Status panel */}
        <div className="space-y-3">
          <div className={`rounded-2xl p-4 border ${healthScore >= 80 ? 'bg-emerald-950/30 border-emerald-500/30' : healthScore >= 50 ? 'bg-orange-950/30 border-orange-500/30' : 'bg-red-950/30 border-red-500/30'}`}>
            <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">Health Score</div>
            <div className={`font-display font-extrabold text-3xl ${healthScore >= 80 ? 'text-emerald-400' : healthScore >= 50 ? 'text-orange-400' : 'text-red-400'}`}>{healthScore}<span className="text-base text-slate-500">/100</span></div>
            <div className="text-[10px] font-mono text-slate-500 mt-1">
              {healthScore >= 80 ? 'Optimal conditions' : healthScore >= 50 ? 'Suboptimal — interventions needed' : 'Critical — immediate action required'}
            </div>
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
            onClick={() => onAskOI?.(`Analyze water quality: O₂ ${oxygen} mg/L, pH ${ph}, temp ${temp}°C, ammonia ${ammonia} mg/L, turbidity ${turbidity} NTU. Health score ${healthScore}/100. Recommend actions.`)}
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
        <span className={`text-sm font-mono font-bold ${color === 'emerald' ? 'text-emerald-400' : color === 'orange' ? 'text-orange-400' : 'text-red-400'}`}>{value.toFixed(step < 1 ? (step < 0.05 ? 2 : 1) : 0)}{unit}</span>
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

/* ============ DISEASE DIAGNOSIS LAB ============ */
interface Symptom {
  id: string;
  label: string;
  selected: boolean;
}

const DISEASES = [
  {
    id: 'fin_rot',
    name: 'Fin Rot',
    symptoms: ['fin_erosion', 'lethargy', 'appetite_loss'],
    severity: 'moderate',
    treatment: 'Improve water quality, salt bath (5g/L for 30 min), antibiotic medicated feed for 7 days.',
    prevention: 'Maintain optimal water quality, avoid overcrowding, regular water changes.',
    icon: Activity,
    color: 'text-orange-400',
  },
  {
    id: 'bacterial_gill',
    name: 'Bacterial Gill Disease',
    symptoms: ['gill_paleness', 'lethargy', 'rapid_breathing'],
    severity: 'severe',
    treatment: 'Potassium permanganate bath (2mg/L), oxytetracycline medicated feed, improve aeration immediately.',
    prevention: 'Maintain dissolved oxygen >5mg/L, reduce ammonia, regular gill health inspections.',
    icon: AlertTriangle,
    color: 'text-red-400',
  },
  {
    id: 'parasitic',
    name: 'Parasitic Infection (Ich)',
    symptoms: ['white_spots', 'flashing', 'fin_clamp'],
    severity: 'moderate',
    treatment: 'Raise temperature gradually to 30°C, formalin bath (25mg/L), repeat treatment after 48h to target lifecycle.',
    prevention: 'Quarantine new stock, maintain water quality, avoid temperature shocks.',
    icon: Microscope,
    color: 'text-amber-400',
  },
  {
    id: 'ammonia_poisoning',
    name: 'Ammonia Poisoning',
    symptoms: ['gill_paleness', 'rapid_breathing', 'lethargy', 'appetite_loss'],
    severity: 'critical',
    treatment: 'Immediate water change (50%), stop feeding for 24h, add zeolite, check biofilter function.',
    prevention: 'Monitor ammonia daily, avoid overfeeding, ensure biofilter is cycled and functional.',
    icon: Droplets,
    color: 'text-red-400',
  },
  {
    id: 'swim_bladder',
    name: 'Swim Bladder Disorder',
    symptoms: ['floating', 'appetite_loss'],
    severity: 'mild',
    treatment: 'Fast for 48h, then feed peeled peas, maintain stable water temperature.',
    prevention: 'Avoid overfeeding, soak dry feed before use, maintain consistent water temperature.',
    icon: Fish,
    color: 'text-yellow-400',
  },
  {
    id: 'healthy',
    name: 'Healthy — No Disease Detected',
    symptoms: [],
    severity: 'none',
    treatment: 'No treatment needed. Continue regular monitoring and preventive care.',
    prevention: 'Maintain current water quality standards, regular health inspections, balanced feed.',
    icon: CheckCircle,
    color: 'text-emerald-400',
  },
];

const ALL_SYMPTOMS = [
  { id: 'fin_erosion', label: 'Fin erosion / fraying', icon: Activity },
  { id: 'lethargy', label: 'Lethargy / inactivity', icon: Eye },
  { id: 'appetite_loss', label: 'Appetite loss', icon: FlaskConical },
  { id: 'gill_paleness', label: 'Pale or red gills', icon: Droplets },
  { id: 'rapid_breathing', label: 'Rapid breathing / gasping', icon: Activity },
  { id: 'white_spots', label: 'White spots on body', icon: Microscope },
  { id: 'flashing', label: 'Flashing / rubbing on cage', icon: Zap },
  { id: 'fin_clamp', label: 'Clamped fins', icon: Fish },
  { id: 'floating', label: 'Abnormal floating / sinking', icon: Atom },
];

function DiseaseDiagnosisLab({ onAskOI }: { onAskOI?: (p: string) => void }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState<typeof DISEASES[0] | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    setDiagnosis(null);
  };

  const runDiagnosis = () => {
    setIsDiagnosing(true);
    setDiagnosis(null);
    setTimeout(() => {
      if (selectedSymptoms.length === 0) {
        setDiagnosis(DISEASES.find(d => d.id === 'healthy')!);
      } else {
        // Find best match
        let bestMatch = DISEASES[0];
        let bestScore = -1;
        for (const disease of DISEASES) {
          if (disease.id === 'healthy') continue;
          const matchCount = disease.symptoms.filter(s => selectedSymptoms.includes(s)).length;
          const totalSymptoms = disease.symptoms.length;
          const score = totalSymptoms > 0 ? matchCount / totalSymptoms : 0;
          if (matchCount > 0 && score > bestScore) {
            bestScore = score;
            bestMatch = disease;
          }
        }
        if (bestScore < 0) {
          setDiagnosis(DISEASES.find(d => d.id === 'healthy')!);
        } else {
          setDiagnosis(bestMatch);
        }
      }
      setIsDiagnosing(false);
    }, 1500);
  };

  const severityColors: Record<string, string> = {
    none: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    mild: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    moderate: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    severe: 'bg-red-500/10 text-red-400 border-red-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  };

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Stethoscope className="w-5 h-5 text-cyan-400" />
        <h3 className="font-display font-semibold text-white text-sm">Disease Diagnosis Lab</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom selector */}
        <div className="space-y-4">
          <div className="text-[10px] font-mono text-cyan-400/60 uppercase">Select observed symptoms</div>
          <div className="grid grid-cols-1 gap-2">
            {ALL_SYMPTOMS.map(s => {
              const Icon = s.icon;
              const isSelected = selectedSymptoms.includes(s.id);
              return (
                <motion.button
                  key={s.id}
                  onClick={() => toggleSymptom(s.id)}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all text-left ${isSelected ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300' : 'bg-slate-950/40 border-cyan-500/5 text-slate-300 hover:border-cyan-400/20'}`}
                >
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-cyan-500/20' : 'bg-slate-900'}`}>
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`} />
                  </div>
                  <span className="flex-1">{s.label}</span>
                  {isSelected && <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />}
                </motion.button>
              );
            })}
          </div>
          <button
            onClick={runDiagnosis}
            disabled={isDiagnosing}
            className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isDiagnosing ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <FlaskConical className="w-3.5 h-3.5" />
                </motion.div>
                Analyzing...
              </>
            ) : (
              <>
                <Stethoscope className="w-3.5 h-3.5" /> Run Diagnosis
              </>
            )}
          </button>
        </div>

        {/* Diagnosis result */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono text-cyan-400/60 uppercase">Diagnosis Result</div>
          <AnimatePresence mode="wait">
            {isDiagnosing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-950/40 rounded-2xl p-6 border border-cyan-500/10 flex flex-col items-center justify-center min-h-[200px]"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Microscope className="w-8 h-8 text-cyan-400" />
                </motion.div>
                <div className="text-xs text-slate-400 mt-3 font-mono">Analyzing symptoms...</div>
                <div className="text-[10px] text-slate-600 mt-1 font-mono">Cross-referencing pathology database</div>
              </motion.div>
            ) : diagnosis ? (
              <motion.div
                key={diagnosis.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-3"
              >
                <div className={`rounded-2xl p-4 border ${severityColors[diagnosis.severity]}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <diagnosis.icon className={`w-5 h-5 ${diagnosis.color}`} />
                    <h4 className="font-display font-bold text-white text-sm">{diagnosis.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${severityColors[diagnosis.severity]}`}>
                      {diagnosis.severity}
                    </span>
                    {selectedSymptoms.length > 0 && (
                      <span className="text-[10px] font-mono text-slate-500">
                        {diagnosis.symptoms.filter(s => selectedSymptoms.includes(s)).length}/{diagnosis.symptoms.length} symptoms matched
                      </span>
                    )}
                  </div>
                </div>

                {diagnosis.id !== 'healthy' && (
                  <>
                    <div className="bg-slate-950/40 rounded-xl p-3 border border-cyan-500/10">
                      <div className="text-[10px] font-mono text-cyan-400/60 uppercase mb-1">Recommended Treatment</div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">{diagnosis.treatment}</p>
                    </div>
                    <div className="bg-slate-950/40 rounded-xl p-3 border border-emerald-500/10">
                      <div className="text-[10px] font-mono text-emerald-400/60 uppercase mb-1">Prevention</div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">{diagnosis.prevention}</p>
                    </div>
                  </>
                )}

                <button
                  onClick={() => onAskOI?.(`I diagnosed my fish with ${diagnosis.name} (severity: ${diagnosis.severity}). Symptoms: ${selectedSymptoms.map(s => ALL_SYMPTOMS.find(a => a.id === s)?.label).join(', ')}. Treatment: ${diagnosis.treatment}. Give me a detailed treatment plan and timeline.`)}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 flex items-center justify-center gap-1.5"
                >
                  <BrainCircuit className="w-3.5 h-3.5" /> Ask OI for detailed treatment plan
                </button>
              </motion.div>
            ) : (
              <div className="bg-slate-950/40 rounded-2xl p-6 border border-cyan-500/10 text-center min-h-[200px] flex flex-col items-center justify-center">
                <Stethoscope className="w-8 h-8 text-slate-700 mb-2" />
                <div className="text-xs text-slate-500">Select symptoms and run diagnosis</div>
                <div className="text-[10px] text-slate-600 mt-1 font-mono">OI will cross-reference the pathology database</div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ============ INTERACTIVE CAGE WALKTHROUGH ============ */
const WALKTHROUGH_STATIONS = [
  {
    id: 'dock',
    label: 'Dock & Loading',
    desc: 'The journey begins at the Busiime dock. Boats are loaded with feed and equipment. Staff check safety gear and weather conditions before departure.',
    icon: Compass,
    facts: ['6 vessels in fleet', 'Daily departures at 6:00 AM EAT', 'GPS-tracked routes'],
  },
  {
    id: 'approach',
    label: 'Lake Approach',
    desc: 'Boats navigate 2.4km to the cage grid. Wind conditions and wave height are continuously monitored. Approach speed reduced near cages to prevent wake damage.',
    icon: Activity,
    facts: ['2.4km from shore', 'Wind limit: 25 knots', 'Wake-restricted zone'],
  },
  {
    id: 'cage_grid',
    label: 'Cage Grid',
    desc: '12 active cages arranged in a 4x3 grid pattern. Each cage is 6m diameter x 4m depth, holding approximately 8,000 Nile Tilapia. Cages are rotated seasonally.',
    icon: Fish,
    facts: ['12 active cages', '6m diameter × 4m depth', '~8,000 fish per cage', 'Seasonal rotation'],
  },
  {
    id: 'feeding',
    label: 'Feeding Station',
    desc: 'Automated feeders dispense precision-calibrated pellets. Feed rate adjusted by OI based on water temperature, dissolved oxygen, and fish biomass data.',
    icon: Target,
    facts: ['FCR target: 1.3', '3 feedings per day', 'OI-optimized portions'],
  },
  {
    id: 'monitoring',
    label: 'Health Monitoring',
    desc: 'Staff inspect fish samples weekly. OI agents analyze underwater camera feeds for behavior anomalies, growth tracking, and early disease detection.',
    icon: Eye,
    facts: ['Weekly visual inspection', 'AI camera monitoring 24/7', 'Growth tracking every 2 weeks'],
  },
  {
    id: 'harvest',
    label: 'Harvest & Processing',
    desc: 'Selective harvest based on OI recommendations. Fish are immediately chilled, transported to processing facility, and enter the cold chain within 2 hours.',
    icon: Trophy,
    facts: ['Selective harvest', '2-hour cold chain entry', 'Quality grading at facility'],
  },
];

function CageWalkthrough({ onAskOI }: { onAskOI?: (p: string) => void }) {
  const [currentStation, setCurrentStation] = useState(0);
  const [direction, setDirection] = useState(1);
  const station = WALKTHROUGH_STATIONS[currentStation];
  const Icon = station.icon;

  const goToStation = (idx: number, dir: number) => {
    setDirection(dir);
    setCurrentStation(idx);
  };

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-5 h-5 text-cyan-400" />
        <h3 className="font-display font-semibold text-white text-sm">Interactive Cage Farm Walkthrough</h3>
      </div>

      {/* Station navigator */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
        {WALKTHROUGH_STATIONS.map((s, i) => {
          const SIcon = s.icon;
          const isActive = i === currentStation;
          const isPast = i < currentStation;
          return (
            <button
              key={s.id}
              onClick={() => goToStation(i, i > currentStation ? 1 : -1)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${isActive ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300' : isPast ? 'bg-slate-950/40 border-cyan-500/10 text-slate-500' : 'bg-slate-950/40 border-slate-800 text-slate-600'}`}
            >
              <SIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {WALKTHROUGH_STATIONS.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-colors ${i <= currentStation ? 'bg-cyan-400' : 'bg-slate-800'}`}
          />
        ))}
      </div>

      {/* Station content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={station.id}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Visual */}
          <div className="relative bg-slate-950/40 rounded-2xl p-6 border border-cyan-500/10 min-h-[240px] flex items-center justify-center overflow-hidden">
            {/* Ambient water effect */}
            <motion.div
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-b from-cyan-950/30 via-transparent to-slate-950/40"
            />
            {/* Station-specific SVG scene */}
            <svg viewBox="0 0 300 200" className="w-full max-w-sm relative z-10">
              {/* Water line */}
              <motion.path
                d="M0,100 Q75,90 150,100 T300,100 L300,200 L0,200 Z"
                fill="rgba(34,211,238,0.08)"
                stroke="rgba(34,211,238,0.2)"
                strokeWidth="1"
                animate={{ d: ["M0,100 Q75,90 150,100 T300,100 L300,200 L0,200 Z", "M0,100 Q75,110 150,100 T300,100 L300,200 L0,200 Z", "M0,100 Q75,90 150,100 T300,100 L300,200 L0,200 Z"] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              {/* Station icon */}
              <motion.g
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <circle cx="150" cy="80" r="30" fill="rgba(34,211,238,0.1)" stroke="rgba(34,211,238,0.3)" strokeWidth="1.5" />
                <foreignObject x="135" y="65" width="30" height="30">
                  <div className="flex items-center justify-center w-full h-full">
                    <Icon className="w-6 h-6 text-cyan-300" />
                  </div>
                </foreignObject>
              </motion.g>
              {/* Station number */}
              <text x="150" y="140" fill="rgba(34,211,238,0.3)" fontSize="40" textAnchor="middle" className="font-mono font-bold">
                {String(currentStation + 1).padStart(2, '0')}
              </text>
            </svg>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-mono text-cyan-400/60 uppercase mb-1">
                Station {currentStation + 1} of {WALKTHROUGH_STATIONS.length}
              </div>
              <h4 className="font-display font-bold text-white text-base mb-2">{station.label}</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{station.desc}</p>
            </div>

            {/* Facts */}
            <div className="space-y-2">
              {station.facts.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-cyan-500/10"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-xs text-slate-300 font-mono">{f}</span>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => currentStation > 0 && goToStation(currentStation - 1, -1)}
                disabled={currentStation === 0}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-cyan-500/20 text-cyan-300 text-xs font-semibold hover:bg-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Previous
              </button>
              <button
                onClick={() => currentStation < WALKTHROUGH_STATIONS.length - 1 && goToStation(currentStation + 1, 1)}
                disabled={currentStation === WALKTHROUGH_STATIONS.length - 1}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next Station <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => onAskOI?.(`Tell me more about the ${station.label} stage of cage aquaculture at Olayo Fisheries. What are the key operational considerations and best practices?`)}
              className="w-full py-2.5 rounded-xl bg-slate-950 border border-cyan-500/20 text-cyan-300 text-xs font-bold hover:bg-slate-900 flex items-center justify-center gap-1.5"
            >
              <BrainCircuit className="w-3.5 h-3.5" /> Ask OI about this station
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
