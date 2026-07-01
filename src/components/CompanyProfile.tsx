import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info, History, Heart, Users, MapPin, Award, BookOpen, HelpCircle, 
  ChevronDown, ArrowRight, ShieldCheck, Waves, Target, Star, Globe
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  { question: "Where is Olayo Fisheries located?", answer: "Our main aquaculture farm operates floating cages on Lake Victoria in Busiime, Busia District, Uganda. Our central processing, packaging, and logistics hub is located in Busia, providing rapid cold-chain transport across East Africa and beyond." },
  { question: "How sustainable are your cage fish farming operations?", answer: "Sustainability is at our core. We operate zero-plastic cage floating grids, use 100% organic feeds derived from insect proteins, and actively plant shoreline trees to prevent soil run-off. We maintain a live sustainability index monitored by our SatLink telemetry." },
  { question: "How can I purchase wholesale seafood from Olayo?", answer: "Wholesalers, restaurants, and export clients can browse real-time inventory under the 'Seafood Market' tab. We support custom quotation requests, bulk logistics tracking, automated sub-zero cold chains, and digitally signed invoices." },
  { question: "Does Olayo offer outgrower programs for local Ugandan farmers?", answer: "Yes! We run an active Outgrower Program supplying high-survival Nile Tilapia fingerlings, floating feeds, and full technical extension training to local smallholder farmers, and we guarantee purchase buybacks at stable prices." },
  { question: "Can schools or researchers visit your Lake Victoria farm?", answer: "Absolutely. We host regular school fields trips, university practicals, and international research attachments. You can schedule your visit online and generate a digital boarding ticket with an entrance QR code under 'Visits & Consulting'." },
];

export default function CompanyProfile() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const coreValues = [
    { title: "Environmental Stewardship", desc: "Protecting the ecological integrity of Lake Victoria through circular nutrient modeling and zero-plastic cage designs." },
    { title: "Quality & Traceability", desc: "Ensuring every fish harvested has a verifiable digital footprint from breeding to distribution." },
    { title: "Community empowerment", desc: "Creating secure local jobs, empowering youth/women, and training smallholder outgrowers in Busia." },
    { title: "Technological innovation", desc: "Pioneering IoT telemetry, automated cold chains, and smart data-led aquaculture in East Africa." },
  ];

  const timelineSteps = [
    { year: "2021", title: "Inception & Licensing", desc: "Olayo Fisheries was founded in Busiime, Busia District, securing primary cage farming licenses on Lake Victoria." },
    { year: "2023", title: "Grid Expansion", desc: "Grew from 2 experimental cages to a fully fledged commercial floating grid of 10 cages with a modern land hatchery." },
    { year: "2024", title: "Outgrower Launch", desc: "Officially launched our Outgrower Network, bringing over 40 local smallholder farmers under the Olayo support system." },
    { year: "2025", title: "Digital Twin Integration", desc: "Deployed real-time water quality IoT diagnostic sensors and launched our digital sub-zero cold chain logistics ledger." },
    { year: "2026", title: "Ecosystem Maturation", desc: "Achieved full capacity production of 120+ Tons annually, with integrated learning centers, research programs, and global certification." },
  ];

  const leaders = [
    { name: "Dr. Abdul Wandera", role: "Founder & CEO", bio: "Ph.D. in Aquaculture & Freshwater Ecology. 15+ years managing sustainable fisheries projects across Lake Victoria.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=200" },
    { name: "Engineer Elena Rostova", role: "Head of Operations & Logistics", bio: "Former cold-chain logistics architect. Designs automated telemetry, sub-zero warehouse links, and vessel fleet sensors.", image: "https://images.unsplash.com/photo-1505244760054-0255a24172e8?auto=format&fit=crop&q=80&w=200" },
    { name: "Warden Marcus Vance", role: "Chief Lake Warden & Hatchery lead", bio: "Aquaculture warden with 12 years expert focus on Nile Tilapia breeding cycles, fingerling survival indexes, and cage maintenance.", image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&q=80&w=200" },
  ];

  return (
    <div className="space-y-12">
      {/* SECTION 1: HERO / STATEMENT */}
      <section className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold font-mono">
          <Info className="w-3.5 h-3.5" /> Our Heritage & Mission
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
          Empowering Lake Victoria <br />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Sustainable Aquaculture.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto font-sans">
          Olayo Fisheries Limited is a pioneering cage aquaculture enterprise operating in Busiime, Busia District, Uganda. We combine professional marine science, dynamic IoT telemetry, and fair community contracts to produce premium seafood for East Africa.
        </p>
      </section>

      {/* SECTION 2: VISION, MISSION & VALUES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-cyan-500/15 p-6 rounded-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-cyan-500/10 pb-3">
            <Target className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-white text-base">Our Vision</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            To be the leading benchmark platform for sustainable cage aquaculture in East Africa—safeguarding Lake Victoria's natural biodiversity while delivering nutritious, premium, and fully traceable cichlid species to local and export markets.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-cyan-500/15 p-6 rounded-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-cyan-500/10 pb-3">
            <Heart className="w-5 h-5 text-rose-400" />
            <h3 className="font-display font-bold text-white text-base">Our Mission</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            To cultivate premium Nile Tilapia and Nile Perch using scientifically optimized deep-water floating cages; to train, supply, and support smallholder farmers through inclusive outgrower networks; and to validate every link of our cold-chain distribution via blockchain-inspired telemetry.
          </p>
        </div>
      </section>

      {/* SECTION 3: CORE VALUES */}
      <section className="space-y-4">
        <h3 className="font-display text-white font-bold text-base sm:text-lg text-center">Our Core Operating Values</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coreValues.map(val => (
            <div key={val.title} className="bg-slate-950/60 border border-cyan-500/10 p-5 rounded-xl backdrop-blur-md space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <h4 className="font-display font-bold text-white text-xs">{val.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE GROWTH TIMELINE */}
      <section className="bg-slate-900/40 border border-cyan-500/15 rounded-2xl p-6 backdrop-blur-md space-y-6">
        <div className="border-b border-cyan-500/10 pb-3">
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Our Corporate Growth Timeline
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Our progressive journey from a pioneering local project to Uganda's premier digital aquaculture ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-slate-800 z-0" />

          {timelineSteps.map((step) => (
            <div key={step.year} className="bg-slate-950/60 border border-cyan-500/5 p-4 rounded-xl z-10 space-y-2 relative">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full inline-block">
                {step.year}
              </span>
              <h4 className="text-xs font-bold text-white">{step.title}</h4>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: LEADERSHIP TEAM */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="font-display font-bold text-white text-base sm:text-lg">Our Leadership Team</h3>
          <p className="text-xs text-slate-400 font-sans leading-normal">
            Driven by a shared passion for marine research, technology, and inclusive community growth in Busia District.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaders.map(ld => (
            <div key={ld.name} className="bg-slate-900/60 border border-cyan-500/10 rounded-2xl overflow-hidden backdrop-blur-md flex items-center p-4 gap-4">
              <img 
                src={ld.image} 
                alt={ld.name} 
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-cyan-500/20" 
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1 text-left">
                <h4 className="text-xs font-bold text-white">{ld.name}</h4>
                <span className="text-[10px] font-mono text-cyan-300 block">{ld.role}</span>
                <p className="text-[10px] text-slate-400 leading-normal font-sans line-clamp-2">{ld.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: PARTNERS & FAQS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategic Partners & Certs */}
        <div className="bg-slate-900/60 border border-cyan-500/15 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h4 className="font-display font-bold text-white text-sm flex items-center gap-2 border-b border-cyan-500/10 pb-2">
              <Award className="w-4.5 h-4.5 text-cyan-400" />
              Strategic Partnerships
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal font-sans">
              Olayo Fisheries operates in strict compliance with the National Environment Management Authority (NEMA) Uganda, Makerere University Research Faculty, and the East African Community Lake Victoria Basin Commission.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-cyan-300">
            <div className="bg-slate-950/40 p-2 rounded border border-cyan-500/5">✓ NEMA Audited</div>
            <div className="bg-slate-950/40 p-2 rounded border border-cyan-500/5">✓ LVBC Accredited</div>
            <div className="bg-slate-950/40 p-2 rounded border border-cyan-500/5">✓ Makerere Partner</div>
            <div className="bg-slate-950/40 p-2 rounded border border-cyan-500/5">✓ EAC Certified</div>
          </div>
        </div>

        {/* FAQ collapse */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-cyan-500/15 p-5 rounded-2xl backdrop-blur-md space-y-3">
          <h4 className="font-display font-bold text-white text-sm flex items-center gap-2 border-b border-cyan-500/10 pb-2">
            <HelpCircle className="w-4.5 h-4.5 text-cyan-400" />
            Frequently Asked Questions
          </h4>

          <div className="space-y-2">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border border-cyan-500/5 rounded-xl bg-slate-950/40 overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left px-4 py-2.5 flex justify-between items-center text-xs font-semibold text-white hover:bg-slate-900 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-3.5 pt-1 text-[11px] text-slate-400 font-sans leading-relaxed border-t border-cyan-500/5 bg-slate-950/20"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
