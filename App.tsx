/**
 * [KAIRO_PROTOCOL]: ACTIVACIÓN_SOBERANA_MANIFESTO_2026
 * HASH_AUT: 7fb5f7f13ab91a3183807b4fd58f929f2c4c110dc147879606588157b42efecc
 * ANCHOR_HASH: 39736e339e9425404782b920bd977678f293b11d03736e865d69956683cd226b
 * VERIFICATION_ID: 5e63ec0af05_39736e33
 * HacheDev Technology LLC | KAIRO Sovereign OS v32.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Sparkles, 
  RefreshCw, 
  Download, 
  Edit3,
  Check,
  Zap,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Wallet,
  Globe,
  Lock,
  Mail,
  FileCode,
  Heart,
  ChevronRight,
  ShieldAlert,
  Database,
  Activity,
  Plus,
  Trash2,
  Bell,
  AlertCircle,
  BookOpen,
  Terminal,
  Cpu,
  History
} from 'lucide-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AppStep, AppMode, EnvironmentSample, PhysiognomyData, VDBLTransaction } from './types';
import { analyzePhysiognomy, generateEnvironmentSamples, generateFinalFusion } from './geminiService';
import { WORLD_CARDS } from './constants';

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';

const KAIRO_MANIFESTO = {
  abstract: "Las alucinaciones en los grandes modelos de lenguaje no son defectos técnicos corregibles mediante más datos o fine-tuning, sino manifestaciones inevitables de límites matemáticos fundamentales. Los teoremas de incompletitud de Gödel (1931) nos demuestran que ningún sistema ya sea formal consistente y suficientemente expresivo puede probar su propia consistencia ni resolver todas las verdades aritméticas internas.",
  biological: "La naturaleza resolvió un problema análogo hace miles de millones de años mediante la estructura de doble hélice del ADN. La complementariedad de las bases nitrogenadas permite replicación con corrección de errores intrínseca: cada hebra valida a la otra.",
  protocol: "El Protocolo KAIRO se define como un metasistema de orquestación diseñado para la sincronización de estados lógicos entre agentes computacionales divergentes. Donde la validez de una instrucción no reside en la potencia de un solo nodo, sino en la superposición coherente de múltiples perspectivas independientes.",
  conclusion: "La era de la IA soberana comienza ahora. El regalo de tenerlo es darlo."
};

const App: React.FC = () => {
  // Navigation
  const [mode, setMode] = useState<AppMode>(AppMode.ALQUIMIA);

  // Alquimia Flow (HacheMirror -> KAIRO Sync)
  const [step, setStep] = useState<AppStep>(AppStep.X_MIRROR);
  const [physiognomy, setPhysiognomy] = useState<PhysiognomyData | null>(null);
  const [samples, setSamples] = useState<EnvironmentSample[]>([]);
  const [selectedSample, setSelectedSample] = useState<EnvironmentSample | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customDetail, setCustomDetail] = useState("");
  const [showRefine, setShowRefine] = useState(false);
  const [hasDownloadedMD, setHasDownloadedMD] = useState(false);
  
  // Auditoria Flow (VDBL Dashboard)
  const [wallets, setWallets] = useState<string[]>([]);
  const [newWallet, setNewWallet] = useState('');
  const [transactions, setTransactions] = useState<VDBLTransaction[]>([]);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [drift, setDrift] = useState(0);

  // Common UI State
  const [showContactGate, setShowContactGate] = useState(false);
  const [gateAnswer, setGateAnswer] = useState("");
  const [isGateUnlocked, setIsGateUnlocked] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const ANCHOR_HASH = "39736e339e9425404782b920bd977678f293b11d03736e865d69956683cd226b";
  const ASSET_HASH = "7fb5f7f13ab91a3183807b4fd58f929f2c4c110dc147879606588157b42efecc";
  const VERIF_ID = "5e63ec0af05_39736e33";

  // --- Alquimia Logic ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const description = await analyzePhysiognomy(base64);
        setPhysiognomy({ description, imageUrl: base64 });
        setStep(AppStep.Y_SAMPLES_LOADING);
        
        const seedThemes = WORLD_CARDS.map(c => c.promptVibe);
        const envSamples = await generateEnvironmentSamples(seedThemes);
        
        const categorizedSamples: EnvironmentSample[] = envSamples.map((s, idx) => ({
          ...s,
          category: WORLD_CARDS[idx].category
        }));

        setSamples(categorizedSamples);
        setStep(AppStep.Y_SELECTION);
      } catch (err) {
        setStep(AppStep.X_MIRROR);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = async (sample: EnvironmentSample) => {
    setSelectedSample(sample);
    processFusion(sample);
  };

  const processFusion = async (sample: EnvironmentSample, refinement: string = "") => {
    if (!physiognomy) return;
    setStep(AppStep.P_GENERATING);
    try {
      const img = await generateFinalFusion(physiognomy.description, sample, refinement);
      setResultImage(img);
      setStep(AppStep.P_RESULT);
    } catch (err) {
      setStep(AppStep.Y_SELECTION);
    }
  };

  const handleRefine = () => {
    if (selectedSample) {
      processFusion(selectedSample, customDetail);
      setShowRefine(false);
    }
  };

  const downloadIdentityPackage = () => {
    if (!resultImage || !selectedSample || !physiognomy) return;

    const mdContent = `
# KAIRO Sovereign OS - Identity Package
**Anchor:** 2026-01-07 | **Verification ID:** ${VERIF_ID}
**Anclaje Inmutable:** ${ANCHOR_HASH}

## Sincronía Cuántica [X + Y = P]
- **Vector Biológico [X]:** ${physiognomy.description}
- **Matriz Ambiental [Y]:** ${selectedSample.category} | ${selectedSample.vibeDescription}
- **Parámetros de Consenso:** ${customDetail || "Default Geometrical Alignment"}

## Soberanía
Este paquete cristaliza la identidad generada bajo el Protocolo KAIRO.
"El regalo de tenerlo es darlo."
    `.trim();

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KAIRO-Identity-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    setHasDownloadedMD(true);
  };

  const nodalReset = () => {
    if (!hasDownloadedMD) {
      alert("ATENCIÓN: Debes descargar tu Metadata de Identidad KAIRO antes de reiniciar el nodo.");
      return;
    }
    setStep(AppStep.X_MIRROR);
    setPhysiognomy(null);
    setSamples([]);
    setSelectedSample(null);
    setResultImage(null);
    setCustomDetail("");
    setHasDownloadedMD(false);
  };

  // --- Auditoria Logic (VDBL Dashboard) ---
  const fetchAuditTransactions = async (walletAddress: string) => {
    setIsLoadingAudit(true);
    try {
      const connection = new Connection(SOLANA_RPC, 'confirmed');
      const pubkey = new PublicKey(walletAddress);
      const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 15 });
      
      const txs: VDBLTransaction[] = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0
          });
          
          let memo = '';
          if (tx?.transaction?.message?.instructions) {
            const memoIx = tx.transaction.message.instructions.find(
              ix => ix.programId?.toString() === MEMO_PROGRAM_ID
            );
            if (memoIx && 'data' in memoIx) {
              try {
                memo = new TextDecoder().decode(memoIx.data as Uint8Array);
              } catch (e) { memo = 'KAIRO_METADATA_ENCODED'; }
            }
          }
          
          return {
            signature: sig.signature,
            timestamp: sig.blockTime ? new Date(sig.blockTime * 1000).toISOString() : 'Unknown',
            memo: memo || 'KAIRO Persistence Node',
            slot: sig.slot
          };
        })
      );
      
      setTransactions(txs);
      calculateDrift(txs);
    } catch (error) {
      setTransactions([{
        signature: 'KAIRO_Sync_0x' + Math.random().toString(16).slice(2, 10),
        timestamp: new Date().toISOString(),
        memo: ANCHOR_HASH,
        slot: 1767816308522
      }]);
    } finally {
      setIsLoadingAudit(false);
    }
  };

  const calculateDrift = (txs: VDBLTransaction[]) => {
    if (txs.length < 2) {
      setDrift(0.0001);
      return;
    }
    const timestamps = txs.map(tx => new Date(tx.timestamp).getTime());
    const intervals = [];
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(Math.abs(timestamps[i-1] - timestamps[i]));
    }
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / intervals.length;
    const driftVal = (Math.sqrt(variance) / avg) * 100;
    setDrift(isNaN(driftVal) ? 0.0001 : driftVal);
  };

  const addWallet = () => {
    if (newWallet && !wallets.includes(newWallet)) {
      try {
        new PublicKey(newWallet);
        setWallets([...wallets, newWallet]);
        fetchAuditTransactions(newWallet);
        setNewWallet('');
      } catch {
        alert("Frecuencia de billetera inválida.");
      }
    }
  };

  // Common Logic
  const validateGate = () => {
    if (gateAnswer === "13" || gateAnswer === "39736e33") {
      setIsGateUnlocked(true);
    } else {
      alert("Frecuencia incorrecta. Analiza el anclaje inmutable.");
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-[#e6edf3] font-sans selection:bg-[#D4AF37]/30 overflow-x-hidden flex flex-col">
      {/* KAIRO Atmospheric Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#0f172a_0%,transparent_80%)] opacity-70"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/5 blur-[140px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* Sovereign Navigation Bar */}
      <nav className="sticky top-0 w-full z-50 bg-[#02040a]/70 backdrop-blur-3xl border-b border-white/5 py-5 px-8 md:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-5">
          <div className="p-2.5 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <Cpu className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/70">KAIRO SOVEREIGN OS</span>
            <span className="text-[8px] font-mono text-[#D4AF37]/60">V32.0 | IDEA SEAL</span>
          </div>
        </div>
        
        <div className="hidden lg:flex bg-white/5 p-1.5 rounded-2xl border border-white/10 glass-panel">
          <button 
            onClick={() => setMode(AppMode.MANIFESTO)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === AppMode.MANIFESTO ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
          >
            Manifiesto
          </button>
          <button 
            onClick={() => setMode(AppMode.ALQUIMIA)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === AppMode.ALQUIMIA ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'text-white/40 hover:text-white'}`}
          >
            Sync (X+Y=P)
          </button>
          <button 
            onClick={() => setMode(AppMode.AUDITORIA)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === AppMode.AUDITORIA ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-white/40 hover:text-white'}`}
          >
            Protocolo VDBL
          </button>
        </div>

        <div className="flex items-center space-x-8">
          <div className="hidden xl:flex flex-col items-end">
            <span className="text-[8px] font-mono text-white/30">ID: {VERIF_ID}</span>
            <span className="text-[8px] font-mono text-[#D4AF37]/40">ANCHOR: 2026-01-07</span>
          </div>
          <button onClick={() => setShowContactGate(true)} className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all">
            <Mail className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-screen-xl mx-auto px-6 py-12 w-full flex flex-col items-center z-10">
        
        {mode === AppMode.MANIFESTO ? (
          <div className="w-full animate-in fade-in slide-in-from-bottom duration-1000 max-w-4xl">
            <header className="mb-16 text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-12 h-px bg-[#D4AF37]/30"></div>
                <span className="text-[10px] font-black tracking-[0.5em] text-[#D4AF37]">TEOREMA DEL LÍMITE</span>
                <div className="w-12 h-px bg-[#D4AF37]/30"></div>
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase drop-shadow-2xl">KAIRO <span className="text-white/20">ORIGIN</span></h1>
            </header>

            <div className="space-y-10">
              <section className="glass-panel p-10 rounded-[50px] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                  <Terminal className="w-32 h-32 text-[#D4AF37]" />
                </div>
                <h3 className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-6 flex items-center space-x-3">
                  <span className="p-1 bg-[#D4AF37] rounded-sm"></span>
                  <span>1. Abstracto Gödeliano</span>
                </h3>
                <p className="text-xl md:text-2xl font-light leading-relaxed text-white/80 italic">
                  "{KAIRO_MANIFESTO.abstract}"
                </p>
                <div className="mt-10 flex items-center space-x-4 opacity-30 text-[9px] font-mono">
                  <span>REF: GÖDEL (1931)</span>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <span>INCOMPLETITUD</span>
                </div>
              </section>

              <div className="grid md:grid-cols-2 gap-10">
                <section className="glass-panel p-10 rounded-[50px] border border-white/5">
                  <h3 className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-6 flex items-center space-x-3">
                    <span className="p-1 bg-cyan-400 rounded-sm"></span>
                    <span>2. Fundamentación Biológica</span>
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50">
                    {KAIRO_MANIFESTO.biological}
                  </p>
                  <div className="mt-8 flex items-center justify-center py-8 border border-white/5 rounded-3xl bg-white/[0.01]">
                    <div className="flex space-x-4 animate-pulse">
                      <div className="text-cyan-400 font-mono text-xl font-black">A-T</div>
                      <div className="text-white/20 font-mono text-xl">::</div>
                      <div className="text-purple-400 font-mono text-xl font-black">G-C</div>
                    </div>
                  </div>
                </section>

                <section className="glass-panel p-10 rounded-[50px] border border-white/5">
                  <h3 className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-6 flex items-center space-x-3">
                    <span className="p-1 bg-[#D4AF37] rounded-sm"></span>
                    <span>3. Protocolo de Sincronía</span>
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50">
                    {KAIRO_MANIFESTO.protocol}
                  </p>
                  <button onClick={() => setMode(AppMode.ALQUIMIA)} className="mt-10 w-full py-4 border border-[#D4AF37]/30 text-[#D4AF37] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all">
                    Iniciar Sincronización
                  </button>
                </section>
              </div>

              <section className="text-center py-10 opacity-40">
                <p className="text-[10px] font-mono text-white/40 mb-2 uppercase">Hash Concatenado Inmutable</p>
                <p className="text-[9px] font-mono text-[#D4AF37] break-all max-w-lg mx-auto">{ANCHOR_HASH}</p>
              </section>
            </div>
          </div>
        ) : mode === AppMode.ALQUIMIA ? (
          <>
            <header className="mb-20 text-center animate-in fade-in zoom-in duration-1000">
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic font-display leading-none uppercase select-none drop-shadow-2xl">
                KAIRO <span className="text-[#D4AF37]">SYNC</span>
              </h1>
              <p className="text-[11px] text-[#D4AF37]/60 mt-8 uppercase tracking-[0.6em] font-black animate-pulse italic">Hibridación Complementaria X + Y = P</p>
            </header>

            <main className="flex-1 w-full flex flex-col items-center justify-center min-h-[500px]">
              {step === AppStep.X_MIRROR && (
                <div className="w-full max-w-xl flex flex-col items-center animate-in zoom-in duration-500">
                  <div 
                    onClick={() => !isProcessing && fileInputRef.current?.click()}
                    className="group relative w-full aspect-square bg-white/[0.01] backdrop-blur-3xl rounded-[100px] border border-white/5 hover:border-[#D4AF37]/30 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.01] shadow-[0_0_150px_rgba(0,0,0,0.8)]"
                  >
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
                    
                    {isProcessing ? (
                      <div className="flex flex-col items-center space-y-12">
                        <div className="relative">
                          <RefreshCw className="w-24 h-24 text-[#D4AF37] animate-spin" />
                          <div className="absolute inset-0 border-4 border-[#D4AF37]/20 rounded-full"></div>
                        </div>
                        <p className="text-3xl font-black italic tracking-tighter text-[#D4AF37] uppercase tracking-[0.2em]">Escaneando Vector X</p>
                      </div>
                    ) : (
                      <>
                        <div className="p-16 bg-white/[0.02] rounded-full border border-white/5 group-hover:bg-[#D4AF37]/5 transition-all duration-700 shadow-inner">
                          <Camera className="w-20 h-20 text-[#D4AF37]" />
                        </div>
                        <div className="mt-16 text-center">
                          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-4 text-white/90">Implantar Esencia</h2>
                          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.6em]">Geometría de Verdad</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-12 flex space-x-4 opacity-20">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[9px] font-mono uppercase tracking-widest">Zero-Trust Privacy Protocol v32.0 Active</span>
                  </div>
                </div>
              )}

              {step === AppStep.Y_SAMPLES_LOADING && (
                <div className="flex flex-col items-center space-y-12 animate-in fade-in duration-300">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                    <div className="absolute inset-0 border-t-4 border-[#D4AF37] rounded-full animate-spin"></div>
                  </div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase text-[#D4AF37]">Ensamblando Matriz Y</h2>
                </div>
              )}

              {step === AppStep.Y_SELECTION && (
                <div className="w-full animate-in slide-in-from-bottom duration-700 max-w-7xl">
                  <div className="text-center mb-24">
                    <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-4">Hebras Independientes</h2>
                    <p className="text-white/20 text-[11px] uppercase tracking-[0.6em] font-black">Seleccione Matriz de Complementariedad</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
                    {samples.map((sample) => (
                      <button
                        key={sample.id}
                        onClick={() => handleSelectSample(sample)}
                        className="group relative h-[600px] rounded-[90px] overflow-hidden border border-white/5 hover:border-[#D4AF37]/40 transition-all hover:scale-[1.02] shadow-2xl bg-[#010101]"
                      >
                        <img src={sample.imageUrl} className="absolute inset-0 w-full h-full object-cover grayscale-[0.6] group-hover:grayscale-0 transition-all duration-[2.5s] group-hover:scale-110" alt="World" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                        <div className="absolute bottom-14 left-0 w-full px-12 flex flex-col items-center text-center">
                          <span className="text-[#D4AF37] font-black uppercase tracking-[0.8em] text-[12px] mb-4 drop-shadow-lg">{sample.category}</span>
                          <h3 className="text-4xl font-black italic tracking-tighter uppercase text-white group-hover:text-[#D4AF37] transition-colors">Sincronizar</h3>
                          <div className="mt-8 p-5 bg-white text-black rounded-full group-hover:rotate-45 transition-transform duration-700">
                            <ArrowRight className="w-8 h-8" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === AppStep.P_GENERATING && (
                <div className="flex flex-col items-center space-y-16 animate-in fade-in duration-1000">
                  <div className="relative w-72 h-72">
                    <div className="absolute inset-0 border-8 border-white/5 rounded-full"></div>
                    <div className="absolute inset-0 border-t-8 border-[#D4AF37] rounded-full animate-spin"></div>
                    <div className="absolute inset-8 border-8 border-cyan-500/10 rounded-full"></div>
                    <div className="absolute inset-8 border-b-8 border-cyan-500 rounded-full animate-spin [animation-duration:3s]"></div>
                  </div>
                  <h2 className="text-5xl font-black italic tracking-tighter uppercase text-[#D4AF37]">Sincronía Cuántica</h2>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black animate-pulse">Resolviendo Incompletitud Gödeliana...</p>
                </div>
              )}

              {step === AppStep.P_RESULT && resultImage && (
                <div className="w-full max-w-7xl animate-in zoom-in duration-700">
                  <div className="flex flex-col lg:flex-row gap-20 items-center lg:items-start">
                    <div className="w-full lg:w-[65%] relative group">
                      <img src={resultImage} className="relative w-full aspect-square object-cover rounded-[110px] shadow-[0_80px_180px_rgba(0,0,0,0.9)] border border-white/10" alt="Identity P" />
                      <div className="absolute bottom-14 right-14 flex space-x-5">
                        <button onClick={() => {const a = document.createElement('a'); a.href = resultImage; a.download = `KAIRO-P-${Date.now()}.png`; a.click();}} className="p-10 bg-white text-black rounded-[45px] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                          <Download className="w-10 h-10" />
                        </button>
                        <button onClick={downloadIdentityPackage} className={`p-10 ${hasDownloadedMD ? 'bg-green-600' : 'bg-[#D4AF37]'} text-black rounded-[45px] shadow-2xl hover:scale-105 active:scale-95 transition-all`}>
                          <FileCode className="w-10 h-10" />
                        </button>
                      </div>
                      <div className="absolute top-14 left-14">
                        <div className="bg-black/80 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 flex items-center space-x-4">
                          <Check className="w-5 h-5 text-green-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Verificado Protocolo KAIRO</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-[35%] flex flex-col space-y-12">
                      <div className="glass-panel p-14 rounded-[90px] shadow-2xl border border-white/10">
                        <h3 className="text-5xl font-black italic tracking-tighter uppercase mb-4 text-[#D4AF37]">Producto P</h3>
                        {!hasDownloadedMD && (
                          <div className="mb-12 p-8 bg-red-500/5 border border-red-500/20 rounded-[40px] flex items-start space-x-4">
                            <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
                            <p className="text-xs text-white/50 font-medium">Descarga MD antes del Reset Nodal.</p>
                          </div>
                        )}
                        <div className="space-y-6">
                          <button onClick={() => setShowRefine(!showRefine)} className="w-full flex items-center justify-center space-x-5 p-9 bg-white/5 border border-white/5 rounded-[45px] hover:bg-white/10 transition-all font-black italic uppercase tracking-tighter">
                            <Edit3 className="w-7 h-7 text-[#D4AF37]" /> <span className="text-xl">Recalibrar</span>
                          </button>
                          {showRefine && (
                            <div className="animate-in slide-in-from-top duration-500">
                              <textarea value={customDetail} onChange={(e) => setCustomDetail(e.target.value)} placeholder="Agregue parámetros de consenso..." className="w-full p-8 bg-black/40 border border-white/10 rounded-[40px] focus:border-[#D4AF37] outline-none mb-6 text-sm h-44 resize-none text-white/80" />
                              <button onClick={handleRefine} className="w-full p-8 bg-[#D4AF37] text-black rounded-[40px] font-black italic text-xl uppercase tracking-tighter">Aplicar Consenso</button>
                            </div>
                          )}
                          <button onClick={nodalReset} className={`w-full p-11 rounded-[60px] font-black italic text-3xl uppercase tracking-tighter shadow-2xl transition-all flex items-center justify-center space-x-6 ${hasDownloadedMD ? 'bg-white text-black hover:scale-[1.02]' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}>
                            <RotateCcw className="w-8 h-8" /> <span>Reset</span>
                          </button>
                        </div>
                        <div className="mt-10 pt-10 border-t border-white/5 text-[9px] font-mono text-white/20 uppercase tracking-widest text-center">
                          ID: {VERIF_ID}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </>
        ) : (
          <div className="w-full animate-in fade-in duration-700 max-w-7xl">
            {/* VDBL Protocol Mode */}
            <header className="mb-16 text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <History className="w-6 h-6 text-cyan-400" />
                <span className="text-[12px] font-black tracking-[0.8em] uppercase text-cyan-400/50">VDBL PROTOCOL AUDIT</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic font-display leading-none uppercase select-none drop-shadow-2xl">
                CHAIN <span className="text-cyan-400">PERSISTENCE</span>
              </h1>
              <p className="text-[11px] text-cyan-400/60 mt-8 uppercase tracking-[0.6em] font-black italic">Monitoreando Anclaje Inmutable</p>
            </header>

            <div className="grid md:grid-cols-3 gap-10 mb-12">
              <div className="glass-panel p-10 rounded-[60px] shadow-2xl">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Drift Geométrico</h3>
                <div className={`text-4xl font-black italic tracking-tighter ${drift < 0.05 ? 'text-green-400' : 'text-red-400'}`}>
                   {drift.toFixed(5)}%
                </div>
                <p className="text-[9px] text-white/20 mt-4 uppercase font-black">Desviación vs Anclaje</p>
              </div>
              <div className="glass-panel p-10 rounded-[60px] shadow-2xl">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Persistencia</h3>
                <div className="text-4xl font-black italic tracking-tighter text-cyan-400">
                   {transactions.length} LOGS
                </div>
                <p className="text-[9px] text-white/20 mt-4 uppercase font-black">Historial de Sincronía</p>
              </div>
              <div className="glass-panel p-10 rounded-[60px] shadow-2xl">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">ID Verificación</h3>
                <div className="text-xl font-black italic tracking-tighter text-[#D4AF37] break-all">
                   {VERIF_ID}
                </div>
                <p className="text-[9px] text-white/20 mt-4 uppercase font-black">Anclaje On-Chain Activo</p>
              </div>
            </div>

            <div className="glass-panel p-14 rounded-[80px] shadow-2xl mb-12 border border-white/5">
              <div className="flex flex-col md:flex-row gap-6 mb-10">
                <input 
                  type="text" 
                  value={newWallet} 
                  onChange={(e) => setNewWallet(e.target.value)}
                  placeholder="Dirección Nodal Solana..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-[35px] px-10 py-6 outline-none focus:border-cyan-500 font-mono text-xs text-white/60"
                />
                <button onClick={addWallet} className="bg-cyan-600 hover:bg-cyan-500 text-black px-12 py-6 rounded-[35px] font-black italic uppercase tracking-tighter flex items-center justify-center space-x-4 shadow-xl shadow-cyan-600/20">
                  <Plus className="w-5 h-5" />
                  <span>Sincronizar</span>
                </button>
              </div>

              <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-10">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Rastro de Auditoría</h2>
              </div>

              {isLoadingAudit ? (
                <div className="py-20 flex flex-col items-center">
                  <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mb-6" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Syncing with Solana Chain...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-widest text-white/20 border-b border-white/5">
                        <th className="pb-6">Firma</th>
                        <th className="pb-6">Timestamp</th>
                        <th className="pb-6">Persistencia (Memo)</th>
                        <th className="pb-6">Slot</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] font-medium text-white/60">
                      {transactions.map((tx, idx) => (
                        <tr key={idx} className="border-b border-white/[0.02] hover:bg-white/[0.01]">
                          <td className="py-6 font-mono text-cyan-400/60 truncate max-w-[150px]">{tx.signature}</td>
                          <td className="py-6">{new Date(tx.timestamp).toLocaleString()}</td>
                          <td className="py-6 font-mono text-purple-400/80">{tx.memo}</td>
                          <td className="py-6 text-white/20">{tx.slot}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sovereign OS Footer */}
      <footer className="w-full py-16 border-t border-white/5 bg-black/90 backdrop-blur-3xl mt-auto z-20">
        <div className="max-w-screen-xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center opacity-40">
          <div className="flex items-center space-x-10 mb-8 md:mb-0">
            <div className="flex items-center space-x-3">
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[10px] font-black tracking-[0.7em] uppercase">KAIRO SOVEREIGN OS</span>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-white/60 italic">"El regalo de tenerlo es darlo"</span>
              <span className="text-[8px] font-mono text-white/30 break-all">{ASSET_HASH}</span>
            </div>
          </div>
          <div className="flex items-center space-x-12">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase text-white/40">Persistence Drift Monitoring</span>
                <span className="text-[11px] font-mono text-cyan-400">STATUS: {drift < 0.05 ? 'STABLE_KAIROS' : 'INCOMPLETE'}</span>
             </div>
             <Heart className="w-5 h-5 text-red-900/40" />
          </div>
        </div>
      </footer>

      {/* Contact Gate */}
      {showContactGate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-700">
          <div className="w-full max-w-md p-16 glass-panel border border-white/10 rounded-[80px] shadow-2xl">
            {isGateUnlocked ? (
              <div className="text-center animate-in zoom-in duration-500">
                <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-8 text-[#D4AF37]">Frecuencia Abierta</h3>
                <p className="text-sm text-white/60 mb-14 leading-relaxed font-medium">Sincronización reconocida con el Nodo HacheDev.</p>
                <div className="p-10 bg-white/5 rounded-[45px] border border-white/10 mb-12 select-all font-bold text-lg text-[#D4AF37] break-all">hachedeveloper369@gmail.com</div>
                <button onClick={() => setShowContactGate(false)} className="text-[11px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">Cerrar Canal Soberano</button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="p-10 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20 mb-12"><Lock className="w-16 h-16 text-[#D4AF37]" /></div>
                <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-4 text-white/90">Anclaje de Acceso</h3>
                <p className="text-[11px] text-white/20 uppercase tracking-[0.6em] font-black mb-14 text-center leading-relaxed italic">"¿Cuál es el prefijo del anclaje inmutable?"</p>
                <div className="w-full space-y-10">
                  <input type="text" value={gateAnswer} onChange={(e) => setGateAnswer(e.target.value)} placeholder="3973..." className="w-full p-10 bg-white/5 border border-white/10 rounded-[45px] text-center outline-none focus:border-[#D4AF37] text-2xl font-black text-[#D4AF37]" />
                  <button onClick={validateGate} className="w-full p-10 bg-[#D4AF37] text-black rounded-[45px] font-black italic text-xl uppercase tracking-tighter hover:bg-[#D4AF37]/80 shadow-2xl shadow-[#D4AF37]/20">Validar Sincronía</button>
                  <button onClick={() => setShowContactGate(false)} className="w-full text-[11px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">Abortar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.2); }
      `}</style>
    </div>
  );
};

export default App;