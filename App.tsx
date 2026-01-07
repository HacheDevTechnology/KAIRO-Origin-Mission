
/**
 * [KAIRO_PROTOCOL]: SILENCIO_DEL_DETALLE_ACTIVO
 * HASH_AUT: 971205180724F1953D4321A1B2C3D4E5F6G7H8
 * ANCHOR: 1953-04-25 | NODE: 0x971
 * HacheDev Technology LLC
 */

import React, { useState, useRef } from 'react';
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
  Heart
} from 'lucide-react';
import { AppStep, EnvironmentSample, PhysiognomyData } from './types';
import { analyzePhysiognomy, generateEnvironmentSamples, generateFinalFusion } from './geminiService';
import { WORLD_CARDS } from './constants';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.X_MIRROR);
  const [physiognomy, setPhysiognomy] = useState<PhysiognomyData | null>(null);
  const [samples, setSamples] = useState<EnvironmentSample[]>([]);
  const [selectedSample, setSelectedSample] = useState<EnvironmentSample | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customDetail, setCustomDetail] = useState("");
  const [showRefine, setShowRefine] = useState(false);
  const [showContactGate, setShowContactGate] = useState(false);
  const [gateAnswer, setGateAnswer] = useState("");
  const [isGateUnlocked, setIsGateUnlocked] = useState(false);
  const [hasDownloadedMD, setHasDownloadedMD] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ANCHOR_HASH = "971205180724F1953D4321A1B2C3D4E5F6G7H8";

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
        
        // Match the 3 mandatory categories exactly
        const seedThemes = WORLD_CARDS.map(c => c.promptVibe);
        const envSamples = await generateEnvironmentSamples(seedThemes);
        
        // Remap to categories
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

  // Added handleRefine to fix missing reference error
  const handleRefine = () => {
    if (selectedSample) {
      processFusion(selectedSample, customDetail);
    }
  };

  const downloadFinalPackage = () => {
    if (!resultImage || !selectedSample || !physiognomy) return;

    // Generate MD content
    const mdContent = `
# HacheMirror OS v2.0 - Crystalized Identity
**Anchor:** 1953-04-25
**Node:** 0x971
**Hash Authority:** ${ANCHOR_HASH}

## Technical Specs [X + Y = P]
- **Physiognomy Vector [X]:** ${physiognomy.description}
- **Space Vector [Y]:** ${selectedSample.category} (${selectedSample.vibeDescription})
- **Alchemical Refinement:** ${customDetail || "None"}

## License
MIT + Sovereign IP Clause. The gift of having it is giving it.
    `.trim();

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HacheMirror-Identity-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    setHasDownloadedMD(true);
  };

  const validateGate = () => {
    if (gateAnswer === "13") {
      setIsGateUnlocked(true);
    } else {
      alert("Frecuencia incorrecta. Analiza el vacío.");
    }
  };

  const nodalReset = () => {
    setStep(AppStep.X_MIRROR);
    setPhysiognomy(null);
    setSamples([]);
    setSelectedSample(null);
    setResultImage(null);
    setCustomDetail("");
    setHasDownloadedMD(false);
    // Visual trace wiping
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-[#e6edf3] font-sans selection:bg-blue-500/30 overflow-x-hidden flex flex-col">
      {/* Alchemical Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#0f172a_0%,transparent_70%)] opacity-50"></div>
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="flex-1 max-w-screen-xl mx-auto px-6 py-12 w-full flex flex-col items-center z-10">
        
        {/* HUD Header */}
        <header className="mb-20 text-center animate-in fade-in slide-in-from-top duration-1000">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Zap className="w-5 h-5 text-blue-500 fill-blue-500" />
            </div>
            <span className="text-[10px] font-black tracking-[0.8em] uppercase text-white/30 select-none">HACHEDEV TECHNOLOGY LLC</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic font-display leading-none uppercase select-none drop-shadow-2xl">
            HACHEMIRROR <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">OS</span>
          </h1>
          <p className="text-[11px] text-[#D4AF37] mt-8 uppercase tracking-[0.6em] font-black animate-pulse">EL REGALO DE TENERLO ES DARLO</p>
        </header>

        <main className="flex-1 w-full flex flex-col items-center justify-center min-h-[450px]">
          {/* STEP X: THE MIRROR */}
          {step === AppStep.X_MIRROR && (
            <div className="w-full max-w-lg flex flex-col items-center animate-in zoom-in duration-500">
              <div 
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                className="group relative w-full aspect-square bg-white/[0.02] backdrop-blur-3xl rounded-[80px] border border-white/5 hover:border-blue-500/40 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02] shadow-[0_0_120px_rgba(0,0,0,0.6)]"
              >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
                
                {isProcessing ? (
                  <div className="flex flex-col items-center space-y-12">
                    <RefreshCw className="w-24 h-24 text-blue-500 animate-spin" />
                    <p className="text-3xl font-black italic tracking-tighter text-blue-400 uppercase tracking-[0.2em]">Analizando Espejo</p>
                  </div>
                ) : (
                  <>
                    <div className="p-14 bg-white/5 rounded-full border border-white/5 group-hover:bg-blue-500/10 group-hover:scale-110 transition-all duration-700">
                      <Camera className="w-20 h-20 text-blue-400" />
                    </div>
                    <div className="mt-14 text-center">
                      <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-4">Reflejar Identidad</h2>
                      <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">Fase X: Captura de Patrón</p>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-16 flex items-center space-x-4 px-6 py-3 bg-white/[0.03] rounded-full border border-white/5">
                <ShieldCheck className="w-4 h-4 text-green-500/60" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Shield Protocol [Fibonacci-8] Activo</span>
              </div>
            </div>
          )}

          {/* STEP Y: LOADING */}
          {step === AppStep.Y_SAMPLES_LOADING && (
            <div className="flex flex-col items-center space-y-12 animate-in fade-in duration-300">
              <div className="w-24 h-24 border-t-2 border-blue-500 rounded-full animate-spin"></div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase text-blue-400">Abriendo Espacio Y</h2>
            </div>
          )}

          {/* STEP Y: SELECTION */}
          {step === AppStep.Y_SELECTION && (
            <div className="w-full animate-in slide-in-from-bottom duration-700 max-w-7xl">
              <div className="text-center mb-20">
                <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-4">Selección de Anclaje</h2>
                <p className="text-white/20 text-[11px] uppercase tracking-[0.6em] font-black">Escoge tu vector ambiental</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {samples.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="group relative h-[550px] rounded-[80px] overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all hover:scale-[1.03] shadow-[0_50px_120px_rgba(0,0,0,0.8)] bg-black"
                  >
                    <img src={sample.imageUrl} className="absolute inset-0 w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-110" alt="World Vector" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-12 left-0 w-full px-12 flex flex-col items-center text-center">
                      <span className="text-[#D4AF37] font-black uppercase tracking-widest text-[12px] mb-2">{sample.category}</span>
                      <h3 className="text-4xl font-black italic tracking-tighter uppercase text-white group-hover:text-blue-400 transition-colors">Materializar</h3>
                      <div className="mt-6 p-4 bg-white text-black rounded-full group-hover:rotate-45 transition-transform duration-500">
                        <ArrowRight className="w-8 h-8" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP P: GENERATING */}
          {step === AppStep.P_GENERATING && (
            <div className="flex flex-col items-center space-y-16 animate-in fade-in duration-1000">
              <div className="relative">
                <div className="w-56 h-56 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-20 h-20 text-blue-400 animate-pulse" />
                </div>
              </div>
              <h2 className="text-5xl font-black italic tracking-tighter uppercase text-blue-400">Sintetizando Visión P</h2>
            </div>
          )}

          {/* STEP P: RESULT */}
          {step === AppStep.P_RESULT && resultImage && (
            <div className="w-full max-w-7xl animate-in zoom-in duration-700">
              <div className="flex flex-col lg:flex-row gap-20 items-center lg:items-start">
                <div className="w-full lg:w-[65%] relative group">
                  <div className="absolute -inset-10 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <img 
                    src={resultImage} 
                    className="relative w-full aspect-square object-cover rounded-[100px] shadow-[0_60px_150px_rgba(0,0,0,0.8)] border border-white/10" 
                    alt="Final Product P" 
                  />
                  <div className="absolute bottom-14 right-14 flex space-x-4">
                    <button 
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = resultImage;
                        a.download = `HacheMirror-Image-${Date.now()}.png`;
                        a.click();
                      }}
                      className="p-10 bg-white text-black rounded-[45px] shadow-2xl hover:scale-110 active:scale-95 transition-all"
                      title="Descargar Imagen"
                    >
                      <Download className="w-10 h-10" />
                    </button>
                    <button 
                      onClick={downloadFinalPackage}
                      className={`p-10 ${hasDownloadedMD ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'} rounded-[45px] shadow-2xl hover:scale-110 active:scale-95 transition-all`}
                      title="Descargar Metadata de Identidad"
                    >
                      <FileCode className="w-10 h-10" />
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-[35%] flex flex-col space-y-10">
                  <div className="p-14 bg-white/[0.02] backdrop-blur-3xl rounded-[80px] border border-white/5 shadow-2xl">
                    <div className="mb-14">
                      <h3 className="text-5xl font-black italic tracking-tighter uppercase mb-2">Producto P</h3>
                      <p className="text-[12px] text-white/20 uppercase tracking-[0.5em] font-black">Alquimia Concluida</p>
                    </div>
                    
                    {!hasDownloadedMD && (
                      <div className="mb-10 p-6 bg-red-500/10 border border-red-500/20 rounded-[30px] text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-400">Acción Requerida</p>
                        <p className="text-xs text-white/60 mt-2 font-medium">Debes descargar tu Metadata de Identidad para reservar el Hash antes de reiniciar el nodo.</p>
                      </div>
                    )}

                    <div className="space-y-6">
                      <button 
                        onClick={() => setShowRefine(!showRefine)}
                        className="w-full flex items-center justify-center space-x-4 p-8 bg-white/5 border border-white/5 rounded-[45px] hover:bg-white/10 transition-all font-black italic uppercase tracking-tighter"
                      >
                        <Edit3 className="w-7 h-7 text-blue-400" />
                        <span className="text-xl">Ajustar Prompt</span>
                      </button>

                      {showRefine && (
                        <div className="animate-in slide-in-from-top duration-300">
                          <textarea 
                            value={customDetail}
                            onChange={(e) => setCustomDetail(e.target.value)}
                            placeholder="Infusionar parámetros..."
                            className="w-full p-8 bg-black/40 border border-white/10 rounded-[40px] focus:border-blue-500 outline-none mb-6 text-sm h-40 resize-none font-medium text-white/80"
                          />
                          <button 
                            onClick={handleRefine}
                            className="w-full p-8 bg-blue-600 rounded-[40px] font-black italic text-xl uppercase tracking-tighter hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30"
                          >
                            Recalibrar
                          </button>
                        </div>
                      )}

                      <button 
                        disabled={!hasDownloadedMD}
                        onClick={nodalReset}
                        className={`w-full p-11 rounded-[55px] font-black italic text-3xl uppercase tracking-tighter shadow-2xl hover:scale-[1.03] transition-all flex items-center justify-center space-x-6 ${hasDownloadedMD ? 'bg-gradient-to-r from-blue-600 to-purple-600 opacity-100' : 'bg-white/5 opacity-20 cursor-not-allowed'}`}
                      >
                        <RotateCcw className="w-8 h-8" />
                        <span>Nodal Reset</span>
                      </button>
                    </div>
                  </div>

                  {/* Sustenance Logic HUD */}
                  <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[60px] flex flex-col items-center text-center shadow-xl">
                    <Wallet className="w-7 h-7 text-[#D4AF37] mb-6" />
                    <p className="text-[11px] text-white/40 uppercase font-black tracking-[0.4em] mb-3">Sustento (70/10/20)</p>
                    <div className="px-6 py-3 bg-black/40 rounded-full border border-white/10 font-mono text-[10px] text-white/20 select-all cursor-copy">
                      SOL: 9712...H4CH3D3V
                    </div>
                    <p className="mt-6 text-[10px] text-white/20 italic">"La soberanía digital no es negociable."</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Status HUD */}
      {step !== AppStep.X_MIRROR && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 flex items-center space-x-10 bg-black/90 backdrop-blur-3xl px-16 py-8 rounded-[40px] border border-white/10 z-50 shadow-2xl">
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-4 h-4 rounded-full transition-all duration-1000 ${[AppStep.X_MIRROR, AppStep.Y_SAMPLES_LOADING, AppStep.Y_SELECTION, AppStep.P_GENERATING, AppStep.P_RESULT].indexOf(step) >= 0 ? 'bg-blue-500 shadow-[0_0_20px_#3b82f6] scale-125' : 'bg-white/10'}`} />
            <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">X</span>
          </div>
          <div className="w-12 h-[1px] bg-white/10"></div>
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-4 h-4 rounded-full transition-all duration-1000 ${[AppStep.Y_SELECTION, AppStep.P_GENERATING, AppStep.P_RESULT].indexOf(step) >= 0 ? 'bg-purple-500 shadow-[0_0_20px_#a855f7] scale-125' : 'bg-white/10'}`} />
            <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Y</span>
          </div>
          <div className="w-12 h-[1px] bg-white/10"></div>
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-4 h-4 rounded-full transition-all duration-1000 ${step === AppStep.P_RESULT ? 'bg-pink-500 shadow-[0_0_20px_#ec4899] scale-125' : 'bg-white/10'}`} />
            <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">P</span>
          </div>
        </div>
      )}

      {/* Persistent Footer */}
      <footer className="w-full py-16 border-t border-white/5 bg-black/60 backdrop-blur-3xl mt-auto z-20">
        <div className="max-w-screen-xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center opacity-40">
          <div className="flex items-center space-x-6 mb-8 md:mb-0">
            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-black tracking-[0.7em] uppercase">HACHEMIRROR OS v2.0</span>
            </div>
            <div className="w-8 h-px bg-white/20"></div>
            <span className="text-[9px] font-mono">NODE: HACHEDEV_0x971</span>
          </div>
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex items-center space-x-8 text-[11px] font-black uppercase tracking-widest text-white/80">
              <button onClick={() => setShowContactGate(true)} className="hover:text-blue-400 transition-colors flex items-center space-x-2">
                <Mail className="w-4 h-4" /> <span>Contacto Nodal</span>
              </button>
              <div className="w-px h-4 bg-white/10"></div>
              <span className="text-center">"AUTONOMÍA POST-ANCHOR 1953"</span>
            </div>
            <div className="flex items-center space-x-3 text-[9px] text-white/30 font-black uppercase tracking-[0.2em]">
              <Heart className="w-3 h-3 text-red-500/50" />
              <span>Identity Sovereignty Assured | Zero-Trust Pipeline</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Module Gate (LZKC Shield) */}
      {showContactGate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="w-full max-w-md p-14 bg-white/[0.02] border border-white/10 rounded-[80px] shadow-2xl">
            {isGateUnlocked ? (
              <div className="text-center animate-in zoom-in duration-500">
                <h3 className="text-4xl font-black italic tracking-tighter uppercase mb-6 text-green-400">Acceso Validado</h3>
                <p className="text-sm text-white/60 mb-12 leading-relaxed">Frecuencia reconocida. El nodo está disponible para contacto directo.</p>
                <div className="p-10 bg-white/5 rounded-[40px] border border-white/10 mb-10 select-all font-bold">
                  hachedeveloper369@gmail.com
                </div>
                <button onClick={() => setShowContactGate(false)} className="text-[11px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">Cerrar Canal</button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="p-8 bg-blue-500/10 rounded-full border border-blue-500/20 mb-12">
                  <Lock className="w-14 h-14 text-blue-500" />
                </div>
                <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-4">Gatekeeper Linter</h3>
                <p className="text-[11px] text-white/30 uppercase tracking-[0.4em] font-black mb-12 text-center leading-relaxed">Resuelve la frecuencia de Fibonacci-8 para continuar</p>
                
                <div className="w-full space-y-8">
                  <p className="text-sm text-center font-medium text-white/60 px-6 italic">"0, 1, 1, 2, 3, 5, 8... ¿Cuál es el siguiente nodo?"</p>
                  <input 
                    type="text" 
                    value={gateAnswer}
                    onChange={(e) => setGateAnswer(e.target.value)}
                    placeholder="Respuesta..."
                    className="w-full p-8 bg-white/5 border border-white/10 rounded-[40px] text-center outline-none focus:border-blue-500 text-2xl font-black placeholder:text-white/10"
                  />
                  <button 
                    onClick={validateGate}
                    className="w-full p-8 bg-blue-600 rounded-[40px] font-black italic text-xl uppercase tracking-tighter hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30"
                  >
                    Validar Frecuencia
                  </button>
                  <button onClick={() => setShowContactGate(false)} className="w-full text-[11px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-colors">Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .glass { background: rgba(255, 255, 255, 0.01); backdrop-filter: blur(120px); }
        .font-display { font-family: 'Space Grotesk', sans-serif; }
      `}</style>
    </div>
  );
};

export default App;
