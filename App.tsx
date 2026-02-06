
import React, { useState, useCallback } from 'react';
import { AppState, BetSlip, BetSelection } from './types';
import { DEFAULT_SLIP, THEME_COLORS } from './constants';
import { generateSlipContent, analyzeMatchImage } from './services/geminiService';
import BetSlipPreview from './components/BetSlipPreview';
import EditorPanel from './components/EditorPanel';
import { Download, Share2, Camera, Github, Settings2, Eye } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    slip: DEFAULT_SLIP,
    isAILoading: false,
    themeColor: THEME_COLORS[0].value
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const updateSlip = useCallback((updates: Partial<BetSlip>) => {
    setState(prev => ({
      ...prev,
      slip: { ...prev.slip, ...updates }
    }));
  }, []);

  const handleAIRequest = async (prompt: string) => {
    setState(prev => ({ ...prev, isAILoading: true }));
    const result = await generateSlipContent(prompt);
    if (result) {
      setState(prev => ({
        ...prev,
        isAILoading: false,
        slip: { ...prev.slip, ...result }
      }));
    } else {
      setState(prev => ({ ...prev, isAILoading: false }));
      alert("Something went wrong with the AI generation. Please try again.");
    }
  };

  const handleImageAnalysis = async (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const result = await analyzeMatchImage(base64);
      if (result) {
        setState(prev => ({
          ...prev,
          slip: {
            ...prev.slip,
            selections: prev.slip.selections.map(s => 
              s.id === id ? { ...s, ...result, screenshot: undefined } : s
            )
          }
        }));
      } else {
        alert("Impossible d'analyser l'image. Assure-toi qu'elle est claire.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUploadOnly = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setState(prev => ({
        ...prev,
        slip: {
          ...prev.slip,
          selections: prev.slip.selections.map(s => 
            s.id === id ? { ...s, screenshot: base64 } : s
          )
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    alert("Préparation de l'image en haute résolution... (Simulation)");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b0f19]" style={{ '--theme-color': state.themeColor } as React.CSSProperties}>
      <nav className="md:w-20 w-full bg-[#161b2a] border-b md:border-b-0 md:border-r border-slate-800 flex md:flex-col items-center justify-between md:justify-start p-4 md:py-8 gap-8 z-50">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: state.themeColor }}>
          <Settings2 className="text-slate-900 w-6 h-6" />
        </div>
        
        <div className="flex md:flex-col gap-6">
          <button 
            onClick={() => setActiveTab('editor')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'editor' ? 'bg-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
            style={activeTab === 'editor' ? { color: state.themeColor } : {}}
          >
            <Settings2 className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`p-3 rounded-xl transition-all md:hidden ${activeTab === 'preview' ? 'bg-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
            style={activeTab === 'preview' ? { color: state.themeColor } : {}}
          >
            <Eye className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-auto hidden md:flex flex-col gap-6">
           <div className="w-1 bg-slate-800 h-10 self-center rounded-full" />
           <button className="text-slate-600 hover:text-slate-400"><Github className="w-6 h-6" /></button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-72px)] md:h-screen">
        <div className={`flex-1 overflow-hidden p-6 md:p-10 flex flex-col gap-8 ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'}`}>
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white mb-2">BetMaster <span style={{ color: state.themeColor }}>Editor</span></h1>
              <p className="text-slate-400 text-sm">Créez et modifiez des tickets de paris professionnels avec l'IA.</p>
            </div>
            <div className="flex gap-2 bg-slate-800/50 p-2 rounded-full border border-slate-700/50">
              {THEME_COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setState(prev => ({ ...prev, themeColor: c.value }))}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${state.themeColor === c.value ? 'border-white scale-125 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </header>

          <EditorPanel 
            slip={state.slip} 
            onUpdate={updateSlip}
            onAIRequest={handleAIRequest}
            onImageAnalysis={handleImageAnalysis}
            onImageUploadOnly={handleImageUploadOnly}
            isAILoading={state.isAILoading}
            themeColor={state.themeColor}
          />
        </div>

        <div className={`w-full md:w-[450px] bg-[#111827] border-l border-slate-800 p-6 md:p-10 flex flex-col items-center justify-center gap-8 shadow-2xl z-10 ${activeTab === 'editor' ? 'hidden md:flex' : 'flex'}`}>
          <div className="w-full flex justify-between items-center mb-4 md:hidden">
             <button onClick={() => setActiveTab('editor')} className="text-slate-400 flex items-center gap-1 text-sm">
                <Settings2 className="w-4 h-4" /> Retour au Mode Edition
             </button>
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Aperçu en Direct</span>
          </div>

          <div className="flex-1 flex items-center justify-center w-full">
             <BetSlipPreview slip={state.slip} themeColor={state.themeColor} />
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            <button 
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 hover:brightness-110"
              style={{ backgroundColor: state.themeColor }}
            >
              <Download className="w-5 h-5" /> Télécharger
            </button>
            <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95">
              <Share2 className="w-5 h-5" /> Partager
            </button>
            <button className="col-span-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 text-sm">
              <Camera className="w-4 h-4" /> Mode Présentation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
