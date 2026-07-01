import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CheckCircle2, ClipboardCheck, FileText, AlertTriangle, PenTool, CheckSquare, RefreshCw, Eye, Camera } from 'lucide-react';

interface InspectionReport {
  id: string;
  batchId: string;
  species: string;
  inspectorName: string;
  date: string;
  status: 'ACCEPTED' | 'REJECTED' | 'PENDING';
  sensoryScore: number;
  temperatureLog: string;
  findings: string;
  correctiveAction?: string;
}

export default function QualityAssurance() {
  const [reports, setReports] = useState<InspectionReport[]>([
    { id: 'QA-LOG-102', batchId: 'BAT-2026-A1', species: 'Bluefin Tuna', inspectorName: 'Sarah Connor', date: '2026-06-29', status: 'ACCEPTED', sensoryScore: 98, temperatureLog: '-1.8°C stable', findings: 'Flesh lipids are optimal. Clear cornea, firm muscle tissues, gills are bright crimson.' },
    { id: 'QA-LOG-103', batchId: 'BAT-2026-X4', species: 'Atlantic Cod', inspectorName: 'Sarah Connor', date: '2026-06-27', status: 'REJECTED', sensoryScore: 68, temperatureLog: '3.5°C registered at Vigo harbor dock', findings: 'Rigor mortis broken prematurely. Eyeballs display mild opacity, gill color is grey-brown. Temperature spikes detected.', correctiveAction: 'Divert from fresh sashimi grade to local canning lines. Audit delivery truck refrigeration seal gaskets.' },
  ]);

  // Sensory checklist variables
  const [activeBatchId, setActiveBatchId] = useState('BAT-2026-A3');
  const [activeSpecies, setActiveSpecies] = useState('Red King Crab');
  const [eyeClarity, setEyeClarity] = useState<'clear' | 'hazy' | 'opaque'>('clear');
  const [gillColor, setGillColor] = useState<'crimson' | 'pink' | 'grey-brown'>('crimson');
  const [fleshRigidity, setFleshRigidity] = useState<'firm' | 'soft' | 'flaccid'>('firm');
  const [lipidPercent, setLipidPercent] = useState<number>(24);

  // Digital Signature state
  const [signedName, setSignedName] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [mockPhotoUploaded, setMockPhotoUploaded] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Sensory score calculate
  const calculatedScore = useMemo(() => {
    let score = 100;
    if (eyeClarity === 'hazy') score -= 15;
    if (eyeClarity === 'opaque') score -= 35;
    if (gillColor === 'pink') score -= 10;
    if (gillColor === 'grey-brown') score -= 30;
    if (fleshRigidity === 'soft') score -= 15;
    if (fleshRigidity === 'flaccid') score -= 40;
    return Math.max(40, score);
  }, [eyeClarity, gillColor, fleshRigidity]);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signedName) {
      alert('Please provide a digital inspector signature to certify this compliance audit.');
      return;
    }

    const newReport: InspectionReport = {
      id: `QA-LOG-${Math.floor(Math.random() * 900) + 200}`,
      batchId: activeBatchId,
      species: activeSpecies,
      inspectorName: signedName,
      date: new Date().toISOString().split('T')[0],
      status: calculatedScore >= 75 ? 'ACCEPTED' : 'REJECTED',
      sensoryScore: calculatedScore,
      temperatureLog: '-2.0°C hold sensor',
      findings: `Eyeballs: ${eyeClarity.toUpperCase()}. Gills: ${gillColor.toUpperCase()}. Flesh: ${fleshRigidity.toUpperCase()}. Lipid: ${lipidPercent}%.`,
      correctiveAction: calculatedScore < 75 ? 'Divert batch to backup canning facilities and replace vehicle logistics thermal tags.' : undefined
    };

    setReports([newReport, ...reports]);
    setIsSigned(false);
    setSignedName('');
    setMockPhotoUploaded(false);
    alert('Quality assurance certificate generated and securely appended to the digital registry.');
  };

  const handleSimulatePhoto = () => {
    setIsUploadingPhoto(true);
    setTimeout(() => {
      setIsUploadingPhoto(false);
      setMockPhotoUploaded(true);
    }, 1500);
  };

  return (
    <div className="bg-slate-900/60 border border-cyan-500/15 p-5 sm:p-6 rounded-3xl backdrop-blur-md space-y-6">
      <div className="border-b border-cyan-500/10 pb-4">
        <h3 className="font-display font-black text-white text-base sm:text-lg flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-cyan-400" />
          Quality Assurance & Sensory Auditing Desk
        </h3>
        <p className="text-xs text-slate-400 font-sans mt-0.5">Sensory scores, cold-chain temperature logs, and corrective actions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Validation Auditing Form */}
        <div className="lg:col-span-2 bg-slate-950/60 border border-cyan-500/10 p-5 rounded-2xl space-y-4">
          <h4 className="font-display font-semibold text-white text-xs flex items-center gap-1.5 uppercase border-b border-cyan-500/10 pb-2">
            <PenTool className="w-4 h-4 text-cyan-400" /> Draft Digital Inspection Certificate
          </h4>

          <form onSubmit={handleCreateReport} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-cyan-400/60 uppercase">Batch Ref ID</label>
              <input
                type="text"
                value={activeBatchId}
                onChange={(e) => setActiveBatchId(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-cyan-400/60 uppercase">Species Name</label>
              <select
                value={activeSpecies}
                onChange={(e) => setActiveSpecies(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              >
                <option value="Red King Crab">Red King Crab</option>
                <option value="Bluefin Tuna">Bluefin Tuna</option>
                <option value="Atlantic Cod">Atlantic Cod</option>
                <option value="Sea Scallops">Sea Scallops</option>
              </select>
            </div>

            {/* Sensory variables */}
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-cyan-400/60 uppercase">Gills Coloration</label>
              <select
                value={gillColor}
                onChange={(e) => setGillColor(e.target.value as any)}
                className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              >
                <option value="crimson">Bright Crimson Red (Optimal)</option>
                <option value="pink">Pink / Pale (Acceptable)</option>
                <option value="grey-brown">Grey / Brown (Spike - Warning)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-cyan-400/60 uppercase">Cornea Eyeball Clarity</label>
              <select
                value={eyeClarity}
                onChange={(e) => setEyeClarity(e.target.value as any)}
                className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              >
                <option value="clear">Perfect Spherical Clarity</option>
                <option value="hazy">Hazy / Clouded Cornea</option>
                <option value="opaque">Sunken Opaque Eyeball</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-cyan-400/60 uppercase">Flesh Rigidity & Skin</label>
              <select
                value={fleshRigidity}
                onChange={(e) => setFleshRigidity(e.target.value as any)}
                className="w-full bg-slate-950 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              >
                <option value="firm">Firm Rigorous Muscle (Optimal)</option>
                <option value="soft">Soft / Elastic indentation</option>
                <option value="flaccid">Flaccid / Decayed muscle fiber</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-cyan-400/60 uppercase">Lipid Score Range ({lipidPercent}%)</label>
              <input
                type="range"
                min="5"
                max="45"
                value={lipidPercent}
                onChange={(e) => setLipidPercent(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Photo upload simulator */}
            <div className="space-y-1 sm:col-span-2">
              <span className="text-[9px] font-mono text-cyan-400/60 uppercase block mb-1">Crate Photography Upload Audit</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSimulatePhoto}
                  disabled={isUploadingPhoto}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-cyan-500/10 rounded-xl text-xs text-white flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-cyan-400" />
                  {isUploadingPhoto ? 'UPLOADING...' : 'SIMULATE CRATE PHOTO'}
                </button>
                {mockPhotoUploaded && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <CheckSquare className="w-4 h-4" /> photo_audit_lat_42.png locked (GPS verified)
                  </span>
                )}
              </div>
            </div>

            {/* Electronic Signature Box */}
            <div className="space-y-2 sm:col-span-2 bg-slate-950 p-4 rounded-xl border border-cyan-500/15">
              <label className="text-[9px] font-mono text-cyan-400/60 uppercase block">Certified Inspector Signature</label>
              <input
                type="text"
                value={signedName}
                onChange={(e) => {
                  setSignedName(e.target.value);
                  setIsSigned(e.target.value.length > 2);
                }}
                placeholder="Type full legal name to generate electronic signature hash"
                className="w-full bg-slate-900 border border-cyan-500/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
              />

              {isSigned && (
                <div className="pt-2 border-t border-cyan-500/5 flex justify-between items-center">
                  <span className="text-[14px] font-serif italic text-cyan-300">Signed: {signedName}</span>
                  <span className="text-[8px] font-mono text-slate-500">SHA-256 HASH: 9bc7...a3f2</span>
                </div>
              )}
            </div>

            {/* Sensory Grade Outcome */}
            <div className="sm:col-span-2 p-3.5 bg-slate-950 rounded-xl border border-cyan-500/5 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block">SENSORY OUTCOME</span>
                <span className={`text-sm font-bold ${calculatedScore >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {calculatedScore}% Sensory Score — {calculatedScore >= 75 ? 'APPROVED SASHIMI GRADE' : 'REJECTED FOR RAW USE'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="sm:col-span-2 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all flex justify-center items-center gap-1 shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> LOCK COMPLIANCE CERTIFICATE
            </button>
          </form>
        </div>

        {/* Compliance Historic Logs Feed & Corrective Action Desk */}
        <div className="space-y-4">
          <div className="bg-slate-950/40 border border-cyan-500/10 p-5 rounded-2xl space-y-4">
            <h4 className="font-display font-semibold text-white text-xs flex items-center gap-1.5 uppercase border-b border-cyan-500/10 pb-2">
              <FileText className="w-4 h-4 text-cyan-400" /> Historic Audit Records
            </h4>

            <div className="space-y-4 overflow-y-auto max-h-[360px] pr-1">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/5 text-xs font-mono space-y-2 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-cyan-400 font-bold block">{rep.id}</span>
                      <span className="text-slate-500 text-[10px]">Batch: {rep.batchId}</span>
                    </div>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${rep.status === 'ACCEPTED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/10' : 'bg-red-950 text-red-400 border border-red-500/10'}`}>
                      {rep.status}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-300 font-sans leading-relaxed">
                    {rep.findings}
                  </div>

                  <div className="flex justify-between items-end border-t border-cyan-500/5 pt-1.5 text-[9px] text-slate-500">
                    <span>Inspector: <strong className="text-slate-400 font-sans">{rep.inspectorName}</strong></span>
                    <span>Score: <strong className="text-cyan-400">{rep.sensoryScore}%</strong></span>
                  </div>

                  {rep.correctiveAction && (
                    <div className="bg-red-950/20 border border-red-500/15 rounded p-2 text-[9px] text-red-300 space-y-1">
                      <div className="flex items-center gap-1 font-bold text-red-400"><ShieldAlert className="w-3.5 h-3.5" /> CORRECTIVE ACTION PLAN</div>
                      <p className="font-sans leading-normal">{rep.correctiveAction}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
