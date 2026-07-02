import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson, QuizQuestion, UserProfile } from '../types';
import { BookOpen, Award, CircleCheck as CheckCircle, Circle as HelpCircle, ArrowRight, Play, Sparkles, Bookmark } from 'lucide-react';
import { FloatingCard, SwipeContainer } from './InteractionEngine';

interface LearningCenterProps {
  lessons: Lesson[];
  currentUser: UserProfile;
  onUserCertified: (pointsEarned: number) => void;
}

export default function LearningCenter({ lessons, currentUser, onUserCertified }: LearningCenterProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  // Quiz taking state
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(-1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  
  // Progress tracker
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(0);

  // Bookmarks state
  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>([]);

  const toggleBookmark = (id: string) => {
    setBookmarkedLessons(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
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
    
    // Check answer
    if (selectedOption === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }

    const nextIdx = activeQuestionIdx + 1;
    if (nextIdx < selectedLesson.questions.length) {
      setActiveQuestionIdx(nextIdx);
      setSelectedOption(null);
    } else {
      // Quiz complete
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lessons List (2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-display font-semibold text-white text-base">Olayo Aquaculture Academy</h3>
            <p className="text-xs text-cyan-300/60 font-sans">Learn cage aquaculture, water quality management, and cold chain standards</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {lessons.map(les => {
            const isCompleted = completedLessons.includes(les.id);
            const isBookmarked = bookmarkedLessons.includes(les.id);
            return (
              <FloatingCard key={les.id}>
                <SwipeContainer
                  onSwipeLeft={() => toggleBookmark(les.id)}
                  onSwipeRight={() => startQuiz(les)}
                  leftIcon={<Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-orange-400 fill-orange-400' : 'text-slate-400'}`} />}
                  leftText={isBookmarked ? "Bookmarked" : "Bookmark"}
                  rightIcon={<Play className="w-5 h-5 text-cyan-400 fill-current" />}
                  rightText="Start Audit"
                >
                  <div className="bg-slate-900/60 border border-cyan-500/10 rounded-2xl p-5 hover:border-cyan-400/40 transition-all shadow-lg flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 px-2.5 py-0.5 rounded border border-cyan-500/20 font-bold">
                            {les.category}
                          </span>
                          {isBookmarked && (
                            <span className="text-[9px] font-mono uppercase bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20 font-bold flex items-center gap-0.5">
                              ★ Bookmarked
                            </span>
                          )}
                        </div>
                        <h4 className="font-display font-bold text-white text-sm sm:text-base mt-2">{les.title}</h4>
                        <p className="text-xs text-slate-400 font-sans mt-1">{les.excerpt}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 font-mono block">{les.readTime}</span>
                        <span className="text-xs text-emerald-400 font-mono block font-semibold mt-1">+{les.points} pts</span>
                      </div>
                    </div>

                    <div className="border-t border-cyan-500/10 pt-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4.5 h-4.5 text-cyan-400" />
                        <span className="text-xs text-slate-400">{les.questions.length} Audit Questions</span>
                      </div>

                      {isCompleted ? (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Lesson Passed
                        </span>
                      ) : (
                        <button
                          onClick={() => startQuiz(les)}
                          className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 flex items-center gap-1 shadow-md shadow-cyan-500/10 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" /> Study & Audit
                        </button>
                      )}
                    </div>
                  </div>
                </SwipeContainer>
              </FloatingCard>
            );
          })}
        </div>
      </div>

      {/* Interactive Quiz Console / Certification Scoreboard (1 col) */}
      <div className="space-y-6">
        {/* Scoreboard */}
        <div className="bg-slate-900/80 border border-cyan-500/20 p-5 rounded-2xl backdrop-blur-md space-y-4">
          <h4 className="font-display font-semibold text-white text-xs border-b border-cyan-500/15 pb-2">Your Certification Status</h4>
          
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-cyan-500/10 border ${currentUser.certified ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5 animate-pulse' : 'border-cyan-500/20 text-cyan-400'}`}>
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{currentUser.name}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{currentUser.role}</div>
            </div>
          </div>

          <div className="space-y-2 pt-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Academy Points:</span>
              <span className="font-mono text-cyan-300 font-bold">{points} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Lessons Mastered:</span>
              <span className="font-mono text-cyan-300 font-bold">{completedLessons.length} / {lessons.length}</span>
            </div>
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
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex gap-2 items-start mt-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[10px] text-emerald-200 font-sans leading-normal">
                Congratulations! You are officially recognized as an Olayo Certified Aquaculture Professional. The certified crest is now visible in your transaction logs.
              </div>
            </div>
          )}
        </div>

        {/* Live Quiz Console */}
        <AnimatePresence mode="wait">
          {selectedLesson && activeQuestionIdx !== -1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/80 border border-cyan-500/30 p-5 rounded-2xl backdrop-blur-md relative"
            >
              <button
                onClick={() => { setSelectedLesson(null); setActiveQuestionIdx(-1); }}
                className="absolute top-3 right-3 text-slate-400 hover:text-white text-xs font-mono"
              >
                Exit [x]
              </button>

              {!quizFinished ? (
                <div className="space-y-4">
                  <div className="text-[10px] font-mono text-cyan-400/70 uppercase">Interactive Competency Audit</div>
                  <h4 className="font-display font-semibold text-white text-xs sm:text-sm">{selectedLesson.title}</h4>
                  
                  {/* Progress dot */}
                  <div className="flex gap-1.5 h-1 bg-slate-800 rounded overflow-hidden">
                    {selectedLesson.questions.map((_, qIdx) => (
                      <div key={qIdx} className={`flex-1 transition-colors duration-300 ${qIdx <= activeQuestionIdx ? 'bg-cyan-400' : 'bg-slate-800'}`} />
                    ))}
                  </div>

                  <p className="text-xs text-cyan-100 font-sans leading-relaxed pt-2">
                    {selectedLesson.questions[activeQuestionIdx].question}
                  </p>

                  <div className="space-y-2 pt-2">
                    {selectedLesson.questions[activeQuestionIdx].options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setSelectedOption(optIdx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all duration-300 flex items-center justify-between ${selectedOption === optIdx ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300' : 'bg-slate-950/40 border-cyan-500/5 text-slate-300 hover:border-cyan-400/20'}`}
                      >
                        <span>{opt}</span>
                        {selectedOption === optIdx && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedOption === null}
                    className={`w-full py-2 rounded-xl text-xs font-semibold font-display flex items-center justify-center gap-1 transition-all ${selectedOption !== null ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
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
                    <h4 className="font-display font-bold text-white text-sm">Competency Audit Concluded</h4>
                    <p className="text-xs text-slate-400 font-sans mt-1">
                      You scored {score} out of {selectedLesson.questions.length} questions correctly.
                    </p>
                  </div>

                  {score === selectedLesson.questions.length ? (
                    <div className="p-3 bg-emerald-950/35 rounded-xl border border-emerald-500/20 text-xs text-emerald-200">
                      🌟 Perfect Score! You unlocked **+{selectedLesson.points} points** toward Olayo Certification.
                    </div>
                  ) : (
                    <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-500/20 text-xs text-cyan-300">
                      Great effort. To master this biological standard and secure certification points, you must answer all questions correctly.
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => startQuiz(selectedLesson)}
                      className="flex-1 py-1.5 rounded-lg border border-cyan-500/20 text-cyan-300 hover:bg-slate-900 transition-all text-xs"
                    >
                      Retry Audit
                    </button>
                    <button
                      onClick={() => { setSelectedLesson(null); setActiveQuestionIdx(-1); }}
                      className="flex-1 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all text-xs"
                    >
                      Academy Home
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
