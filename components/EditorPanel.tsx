
import React, { useRef } from 'react';
import { BetSlip, BetStatus, BetSelection, SelectionStatus } from '../types';
import { Plus, Trash2, Sparkles, RefreshCcw, Trophy, Activity, Camera, Loader2, Image as ImageIcon, X, ShieldCheck, Type as TypeIcon } from 'lucide-react';

interface EditorPanelProps {
  slip: BetSlip;
  onUpdate: (updated: Partial<BetSlip>) => void;
  onAIRequest: (prompt: string) => void;
  onImageAnalysis: (id: string, file: File) => Promise<void>;
  onImageUploadOnly: (id: string, file: File) => void;
  isAILoading: boolean;
  themeColor: string;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ 
  slip, 
  onUpdate, 
  onAIRequest, 
  onImageAnalysis,
  onImageUploadOnly,
  isAILoading,
  themeColor
}) => {
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [processingMatchId, setProcessingMatchId] = React.useState<string | null>(null);

  const updateSelection = (id: string, field: string, value: any) => {
    const updatedSelections = slip.selections.map(s => {
      if (s.id !== id) return s;
      
      const newS = { ...s };
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        (newS as any)[parent] = { ...(newS as any)[parent], [child]: value };
      } else {
        (newS as any)[field] = value;
      }
      return newS;
    });
    
    let newTotalOdds = slip.totalOdds;
    if (field === 'odds') {
      newTotalOdds = updatedSelections.reduce((acc, s) => acc * s.odds, 1);
    }

    onUpdate({ 
      selections: updatedSelections,
      totalOdds: newTotalOdds
    });
  };

  const handleImageScan = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProcessingMatchId(id);
      await onImageAnalysis(id, file);
      setProcessingMatchId(null);
    }
  };

  const handleRawUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUploadOnly(id, file);
    }
  };

  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdate({ 
          watermark: { 
            image: reader.result as string, 
            enabled: true, 
            opacity: slip.watermark?.opacity ?? 0.15 
          } 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const enableTextWatermark = () => {
    onUpdate({
      textWatermark: {
        text: "BETMASTER EDITOR",
        enabled: true,
        opacity: 0.1,
        color: "#000000",
        fontSize: 40
      }
    });
  };

  const updateTextWatermark = (updates: Partial<NonNullable<BetSlip['textWatermark']>>) => {
    if (slip.textWatermark) {
      onUpdate({ textWatermark: { ...slip.textWatermark, ...updates } });
    }
  };

  const removeScreenshot = (id: string) => {
    updateSelection(id, 'screenshot', undefined);
  };

  const addSelection = () => {
    const newSel: BetSelection = {
      id: Math.random().toString(36).substr(2, 9),
      sport: "Football",
      league: "Nouvelle Ligue",
      date: "Aujourd'hui",
      teamA: { name: "Equipe A", logo: "https://via.placeholder.com/50", score: 0 },
      teamB: { name: "Equipe B", logo: "https://via.placeholder.com/50", score: 0 },
      scoreDetail: "0:0 (0:0)",
      market: "Nouveau Pari",
      odds: 1.50,
      status: SelectionStatus.WON
    };
    onUpdate({ 
      selections: [...slip.selections, newSel],
      totalEvents: slip.totalEvents + 1,
      eventsFinished: slip.eventsFinished + 1
    });
  };

  const addCaptureOnly = () => {
    const newSel: BetSelection = {
      id: Math.random().toString(36).substr(2, 9),
      sport: "",
      league: "",
      date: "",
      teamA: { name: "", logo: "", score: 0 },
      teamB: { name: "", logo: "", score: 0 },
      scoreDetail: "",
      market: "",
      odds: 1.00,
      status: SelectionStatus.WON,
      screenshot: ""
    };
    onUpdate({ 
      selections: [...slip.selections, newSel],
      totalEvents: slip.totalEvents + 1,
      eventsFinished: slip.eventsFinished + 1
    });
  };

  const removeSelection = (id: string) => {
    const updated = slip.selections.filter(s => s.id !== id);
    const newTotalOdds = updated.reduce((acc, s) => acc * s.odds, 1);
    onUpdate({ 
      selections: updated,
      totalOdds: newTotalOdds,
      totalEvents: Math.max(0, slip.totalEvents - 1),
      eventsFinished: Math.max(0, slip.eventsFinished - 1)
    });
  };

  return (
    <div className="h-full overflow-y-auto pr-4 space-y-8 pb-12 scrollbar-hide">
      
      {/* Header Actions */}
      <div className="flex gap-4 items-center justify-end">
        {!slip.textWatermark?.enabled && (
          <button 
            onClick={enableTextWatermark}
            className="cursor-pointer hover:brightness-110 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
            style={{ backgroundColor: themeColor }}
          >
            <TypeIcon className="w-4 h-4" />
            Filigrane Texte
          </button>
        )}
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95">
          <ShieldCheck className="w-4 h-4" />
          Ajouter mon filigrane
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleWatermarkUpload}
          />
        </label>
      </div>

      <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5" style={{ color: themeColor }} />
          <h3 className="font-bold text-lg text-white">Générateur par IA</h3>
        </div>
        <div className="relative">
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Décris le coupon complet (ex: Un combiné de 5 matchs gagnants)"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:outline-none min-h-[80px] text-white"
            style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
          />
          <button
            onClick={() => onAIRequest(aiPrompt)}
            disabled={isAILoading || !aiPrompt}
            className="absolute bottom-2 right-2 hover:brightness-110 disabled:bg-slate-700 text-slate-900 p-2 rounded-lg transition-colors"
            style={{ backgroundColor: themeColor }}
          >
            {isAILoading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          </button>
        </div>
      </section>

      {/* Text Watermark Control Section */}
      {slip.textWatermark && (
        <section className="bg-amber-900/20 p-5 rounded-2xl border border-amber-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TypeIcon className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white">Filigrane Texte</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => updateTextWatermark({ enabled: !slip.textWatermark?.enabled })}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${slip.textWatermark.enabled ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-400'}`}
              >
                {slip.textWatermark.enabled ? 'Activé' : 'Désactivé'}
              </button>
              <button 
                onClick={() => onUpdate({ textWatermark: undefined })}
                className="p-1 text-slate-500 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-slate-500 font-bold">Contenu du Texte</label>
              <input 
                type="text"
                value={slip.textWatermark.text}
                onChange={(e) => updateTextWatermark({ text: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:ring-1"
                style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
                placeholder="TON TEXTE ICI"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Opacité</label>
                  <span className="text-[10px] font-mono" style={{ color: themeColor }}>{(slip.textWatermark.opacity * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0.01" max="1" step="0.01" value={slip.textWatermark.opacity} 
                  onChange={(e) => updateTextWatermark({ opacity: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: themeColor }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Taille</label>
                  <span className="text-[10px] font-mono" style={{ color: themeColor }}>{slip.textWatermark.fontSize}px</span>
                </div>
                <input 
                  type="range" min="10" max="120" step="1" value={slip.textWatermark.fontSize} 
                  onChange={(e) => updateTextWatermark({ fontSize: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: themeColor }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Watermark Control Section */}
      {slip.watermark?.image && (
        <section className="bg-blue-900/20 p-5 rounded-2xl border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white">Gestion du Filigrane Image</h3>
            </div>
            <button 
              onClick={() => onUpdate({ watermark: { ...slip.watermark!, enabled: !slip.watermark?.enabled } })}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${slip.watermark.enabled ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-400'}`}
            >
              {slip.watermark.enabled ? 'Activé' : 'Désactivé'}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden p-1 shrink-0">
               <img src={slip.watermark.image} className="max-w-full max-h-full object-contain opacity-50" alt="" />
            </div>
            <div className="flex-1 space-y-2">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase text-slate-500 font-bold">Opacité</label>
                  <span className="text-[10px] text-blue-400 font-mono">{(slip.watermark.opacity * 100).toFixed(0)}%</span>
               </div>
               <input 
                 type="range" 
                 min="0.05" 
                 max="0.8" 
                 step="0.01" 
                 value={slip.watermark.opacity} 
                 onChange={(e) => onUpdate({ watermark: { ...slip.watermark!, opacity: parseFloat(e.target.value) } })}
                 className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
               />
            </div>
            <button 
              onClick={() => onUpdate({ watermark: undefined })}
              className="p-2 text-slate-500 hover:text-red-400 transition-colors"
              title="Supprimer filigrane"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Trophy className="w-4 h-4" /> Résumé du Ticket
        </h3>
        <div className="grid grid-cols-2 gap-4 bg-slate-800/30 p-5 rounded-2xl border border-slate-700/30">
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold">Type de pari</label>
            <input value={slip.type} onChange={(e) => onUpdate({ type: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold">Ticket ID</label>
            <input value={slip.ticketId} onChange={(e) => onUpdate({ ticketId: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm font-mono text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold">Date du Coupon</label>
            <input value={slip.date} onChange={(e) => onUpdate({ date: e.target.value })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold">Statut Slip</label>
            <select 
              value={slip.status} 
              onChange={(e) => onUpdate({ status: e.target.value as BetStatus })} 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white"
            >
              <option value={BetStatus.WINNING}>Payé (Gagné)</option>
              <option value={BetStatus.LOST}>Perdu</option>
              <option value={BetStatus.PENDING}>En attente</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold">Mise (₣)</label>
            <input type="number" value={slip.stake} onChange={(e) => onUpdate({ stake: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold">Tax (%)</label>
            <input type="number" value={slip.taxPercent} onChange={(e) => onUpdate({ taxPercent: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold">Total Matchs</label>
            <input type="number" value={slip.totalEvents} onChange={(e) => onUpdate({ totalEvents: parseInt(e.target.value) || 0 })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold">Matchs Terminés</label>
            <input type="number" value={slip.eventsFinished} onChange={(e) => onUpdate({ eventsFinished: parseInt(e.target.value) || 0 })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white" />
          </div>
          <div className="space-y-1 col-span-2">
            <label className="text-[10px] uppercase text-slate-500 font-bold">Cotes Totales (Manuel)</label>
            <input type="number" step="0.001" value={slip.totalOdds} onChange={(e) => onUpdate({ totalOdds: parseFloat(e.target.value) || 1 })} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm font-bold" style={{ color: themeColor }} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4" /> Matchs
          </h3>
          <div className="flex gap-2">
            <button onClick={addCaptureOnly} className="text-[10px] hover:brightness-110 px-3 py-1.5 rounded-lg text-slate-900 font-bold flex items-center gap-2 transition-all shadow-md" style={{ backgroundColor: themeColor }}>
              <ImageIcon className="w-3 h-3" /> Ajouter Capture
            </button>
            <button onClick={addSelection} className="text-[10px] bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-slate-200 flex items-center gap-2 transition-all">
              <Plus className="w-3 h-3" /> Ajouter Match
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {slip.selections.map((sel) => (
            <div key={sel.id} className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-2 transition-colors">
                    {processingMatchId === sel.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                    Scanne via Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageScan(sel.id, e)}
                    />
                  </label>
                  <label className="cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-2 transition-colors border border-white/10 font-bold" style={{ color: themeColor }}>
                    <ImageIcon className="w-3.5 h-3.5" />
                    Uploader Capture
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleRawUpload(sel.id, e)}
                    />
                  </label>
                </div>
                <button onClick={() => removeSelection(sel.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1.5 bg-slate-900/50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {sel.screenshot && (
                <div className="mb-4 relative group/img">
                  <img src={sel.screenshot} className="w-full h-auto max-h-60 object-contain rounded-lg border border-slate-700" alt="Capture match" />
                  <button 
                    onClick={() => removeScreenshot(sel.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {!sel.screenshot && (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase text-slate-500">Sport</label>
                      <input value={sel.sport} onChange={(e) => updateSelection(sel.id, 'sport', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase text-slate-500">Ligue</label>
                      <input value={sel.league} onChange={(e) => updateSelection(sel.id, 'league', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase text-slate-500">Date Match</label>
                      <input value={sel.date} onChange={(e) => updateSelection(sel.id, 'date', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <input placeholder="Logo URL" value={sel.teamA.logo} onChange={(e) => updateSelection(sel.id, 'teamA.logo', e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] text-white" />
                        <input placeholder="0" type="number" value={sel.teamA.score} onChange={(e) => updateSelection(sel.id, 'teamA.score', parseInt(e.target.value) || 0)} className="w-12 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-bold text-white" />
                      </div>
                      <input placeholder="Equipe A" value={sel.teamA.name} onChange={(e) => updateSelection(sel.id, 'teamA.name', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm font-bold text-white" />
                    </div>
                    
                    <div className="text-xl font-black text-slate-600">:</div>

                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <input placeholder="0" type="number" value={sel.teamB.score} onChange={(e) => updateSelection(sel.id, 'teamB.score', parseInt(e.target.value) || 0)} className="w-12 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-bold text-white" />
                        <input placeholder="Logo URL" value={sel.teamB.logo} onChange={(e) => updateSelection(sel.id, 'teamB.logo', e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] text-white" />
                      </div>
                      <input placeholder="Equipe B" value={sel.teamB.name} onChange={(e) => updateSelection(sel.id, 'teamB.name', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm font-bold text-right text-white" />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-4 gap-2">
                {!sel.screenshot && (
                  <div className="col-span-2 space-y-1">
                    <label className="text-[9px] uppercase text-slate-500">Marché / Type de pari</label>
                    <input value={sel.market} onChange={(e) => updateSelection(sel.id, 'market', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white" />
                  </div>
                )}
                <div className={`${sel.screenshot ? 'col-span-2' : ''} space-y-1`}>
                  <label className="text-[9px] uppercase text-slate-500">Cote</label>
                  <input type="number" step="0.01" value={sel.odds} onChange={(e) => updateSelection(sel.id, 'odds', parseFloat(e.target.value) || 1)} className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs font-bold text-center" style={{ color: themeColor }} />
                </div>
                <div className={`${sel.screenshot ? 'col-span-2' : ''} space-y-1`}>
                  <label className="text-[9px] uppercase text-slate-500">Statut</label>
                  <select 
                    value={sel.status} 
                    onChange={(e) => updateSelection(sel.id, 'status', e.target.value as SelectionStatus)} 
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-green-500 font-bold"
                  >
                    <option value={SelectionStatus.WON}>Gagné</option>
                    <option value={SelectionStatus.LOST}>Perdu</option>
                    <option value={SelectionStatus.PENDING}>En cours</option>
                  </select>
                </div>
              </div>
              {!sel.screenshot && (
                <div className="mt-2 space-y-1">
                  <label className="text-[9px] uppercase text-slate-500">Détails Score</label>
                  <input value={sel.scoreDetail} onChange={(e) => updateSelection(sel.id, 'scoreDetail', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EditorPanel;
