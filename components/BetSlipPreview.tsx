
import React from 'react';
import { BetSlip, BetStatus, SelectionStatus } from '../types';
import { ChevronLeft, Bell, MoreHorizontal, Trophy, History, Star, Flame, Menu as MenuIcon } from 'lucide-react';

interface BetSlipPreviewProps {
  slip: BetSlip;
  themeColor: string;
}

const BetSlipPreview: React.FC<BetSlipPreviewProps> = ({ slip, themeColor }) => {
  const payment = slip.stake * slip.totalOdds;
  const taxAmount = (payment * slip.taxPercent) / 100;
  const netGains = payment - taxAmount;

  return (
    <div className="mx-auto w-full max-w-[375px] bg-[#F4F6F8] text-[#111111] shadow-2xl rounded-[40px] overflow-hidden flex flex-col h-[780px] border-[8px] border-[#1e293b] select-none font-['Inter',_sans-serif] relative">
      
      {/* Image Watermark Overlay */}
      {slip.watermark?.enabled && slip.watermark.image && (
        <div 
          className="absolute inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden"
          style={{ opacity: slip.watermark.opacity }}
        >
          <img 
            src={slip.watermark.image} 
            className="w-[150%] max-w-none transform -rotate-12 object-contain" 
            alt="Filigrane Image" 
          />
        </div>
      )}

      {/* Text Watermark Overlay */}
      {slip.textWatermark?.enabled && slip.textWatermark.text && (
        <div 
          className="absolute inset-0 pointer-events-none z-[101] flex items-center justify-center overflow-hidden whitespace-nowrap"
          style={{ 
            opacity: slip.textWatermark.opacity,
            color: slip.textWatermark.color,
            fontSize: `${slip.textWatermark.fontSize}px`,
            fontWeight: 900,
            textTransform: 'uppercase'
          }}
        >
          <div className="transform -rotate-45 font-black">
            {slip.textWatermark.text}
          </div>
        </div>
      )}

      {/* iOS Style Status Bar */}
      <div className="flex justify-between items-center px-8 pt-4 pb-1 bg-white text-[13px] font-semibold text-black shrink-0">
        <span>23:10</span>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5 items-end">
            <div className="w-[3px] h-[4px] bg-black rounded-full" />
            <div className="w-[3px] h-[6px] bg-black rounded-full" />
            <div className="w-[3px] h-[8px] bg-black rounded-full" />
            <div className="w-[3px] h-[10px] bg-[#d1d5db] rounded-full" />
          </div>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.007 18.93c4.992 0 9.513-3.07 11.257-7.662a.75.75 0 0 0 0-.536c-1.744-4.592-6.265-7.662-11.257-7.662-4.992 0-9.513 3.07-11.257 7.662a.75.75 0 0 0 0 .536c1.744 4.592 6.265 7.662 11.257 7.662zm0-2.25a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/></svg>
          <div className="w-[20px] h-[10px] relative border border-[#d1d5db] rounded-[2px] flex items-center p-[1px]">
             <div className="h-full bg-red-500 rounded-[1px]" style={{ width: '14%' }} />
             <div className="absolute -right-[3px] w-[2px] h-[4px] bg-[#d1d5db] rounded-r-full" />
          </div>
          <span className="text-[10px] ml-0.5">14%</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white px-4 py-2.5 flex items-center justify-between border-b border-[#f1f5f9] shrink-0">
        <ChevronLeft className="w-6 h-6 text-[#9AA0A6] stroke-[2.5]" />
        <h1 className="text-[17px] font-semibold text-[#1C1C1E]">Informations sur le pari</h1>
        <div className="flex items-center gap-3.5">
          <Bell className="w-[20px] h-[20px] text-[#9AA0A6]" strokeWidth={2} />
          <MoreHorizontal className="w-[20px] h-[20px] text-[#9AA0A6]" strokeWidth={2} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="bg-white mb-3 pb-2">
          {/* Bet Type Header */}
          <div className="px-5 py-4 flex items-center gap-3.5">
            <div className="w-[44px] h-[44px] bg-[#EEF1F4] rounded-[12px] flex items-center justify-center relative">
              <div className="flex flex-col gap-[2.5px]">
                 <div className="w-5 h-[1.8px] bg-[#cbd5e1] rounded-full" />
                 <div className="w-5 h-[1.8px] bg-[#cbd5e1] rounded-full" />
                 <div className="w-5 h-[1.8px] bg-[#cbd5e1] rounded-full" />
              </div>
              {slip.status === BetStatus.WINNING && (
                <div className="absolute -bottom-1 -right-1 bg-[#1FAF38] rounded-full p-[2.5px] border-[2px] border-white shadow-sm">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#8E8E93] font-normal leading-none mb-1">{slip.date}</span>
              <h2 className="text-[16px] font-semibold text-[#111111] leading-tight">{slip.type}</h2>
              <span className="text-[12px] text-[#8A8A8E] mt-0.5">№ {slip.ticketId}</span>
            </div>
          </div>

          {/* Stats Summary Section */}
          <div className="px-5 pb-5 space-y-[6px]">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <svg className="w-[14px] h-[14px] text-[#8E8E93]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                <span className="text-[13px] font-normal text-[#111111]">Événements : {slip.totalEvents}</span>
              </div>
              <span className="text-[13px] font-semibold text-[#111111]">{slip.eventsFinished} sur {slip.totalEvents} terminés</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[13px] font-normal text-[#8E8E93]">Cotes:</span>
              <span className="text-[14px] font-semibold text-[#111111]">{slip.totalOdds.toLocaleString('fr-FR', { minimumFractionDigits: 3 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-normal text-[#8E8E93]">Mise:</span>
              <span className="text-[14px] font-semibold text-[#111111]">{slip.stake.toLocaleString('fr-FR')} ₣</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-normal text-[#8E8E93]">Paiement:</span>
              <span className="text-[14px] font-semibold text-[#111111]">{payment.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ₣</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-normal text-[#8E8E93]">Tax {slip.taxPercent}%:</span>
              <span className="text-[14px] font-semibold text-[#111111]">{taxAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ₣</span>
            </div>
            <div className="flex justify-between items-center pt-0.5">
              <span className="text-[13px] font-normal text-[#8E8E93]">Gains:</span>
              <span className="text-[14px] font-semibold text-[#1FAF38]">{netGains.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} ₣</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-normal text-[#8E8E93]">Statut:</span>
              <span className="text-[14px] font-semibold text-[#1FAF38]">{slip.status}</span>
            </div>
          </div>
        </div>

        {/* Individual Match Cards */}
        <div className="px-4 space-y-3 pb-24">
          {slip.selections.map((sel) => (
            <div key={sel.id} className="bg-white rounded-[14px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] relative">
              {sel.screenshot ? (
                /* Mode Capture Directe */
                <div className="w-full h-auto">
                  <img 
                    src={sel.screenshot} 
                    className="w-full h-auto block" 
                    alt="Capture de match" 
                    style={{ display: 'block' }}
                  />
                </div>
              ) : (
                /* Standard Mode */
                <>
                  <div className="bg-[#F7F8FA] p-3 mx-2.5 mt-2.5 rounded-[10px]">
                    <div className="flex items-start gap-2.5 mb-3.5">
                      <div className="w-[18px] h-[18px] opacity-25 mt-0.5">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v6h-2zm0 8h2v2h-2z"/></svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] text-[#9AA0A6] font-medium leading-none mb-0.5 uppercase tracking-tight">{sel.sport} . {sel.league}</span>
                        <span className="text-[11px] text-[#9AA0A6] font-medium leading-none">{sel.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-2 mb-1.5">
                      <div className="flex flex-col items-center w-[35%]">
                        <span className="text-[13px] font-semibold text-[#111111] text-center mb-1.5 min-h-[16px] leading-tight">{sel.teamA.name}</span>
                        <img src={sel.teamA.logo} className="w-[28px] h-[28px] object-contain" alt="" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[22px] text-[#1C1C1E] tracking-[0.5px] leading-[1] text-center font-bold">{sel.teamA.score}:{sel.teamB.score}</span>
                      </div>
                      <div className="flex flex-col items-center w-[35%]">
                        <span className="text-[13px] font-semibold text-[#111111] text-center mb-1.5 min-h-[16px] leading-tight">{sel.teamB.name}</span>
                        <img src={sel.teamB.logo} className="w-[28px] h-[28px] object-contain" alt="" />
                      </div>
                    </div>
                    <div className="text-[11px] text-[#8E8E93] text-center mb-3 font-normal">{sel.scoreDetail}</div>
                  </div>
                  <div className="px-4 py-3 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-normal text-[#111]">{sel.market}</span>
                      <span className="text-[13px] font-semibold text-[#111]">{sel.odds.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-[#8E8E93] font-normal">Statut:</span>
                      <span className="text-[13px] text-[#1FAF38] font-semibold">{sel.status}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t border-[#ECECEC] pt-1 pb-7 px-4 flex justify-between items-end shrink-0">
        <div className="flex flex-col items-center gap-1 opacity-100">
          <Flame className="w-[22px] h-[22px] text-[#9AA0A6]" />
          <span className="text-[10px] font-medium text-[#9AA0A6]">Populaire</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-100">
          <Star className="w-[22px] h-[22px] text-[#9AA0A6]" />
          <span className="text-[10px] font-medium text-[#9AA0A6]">Favoris</span>
        </div>
        <div className="flex flex-col items-center mb-1">
           <div className="w-[48px] h-[48px] bg-[#F5A623] rounded-full flex items-center justify-center shadow-lg relative -top-3">
              <Trophy className="w-6 h-6 text-white stroke-[2.5]" />
           </div>
           <span className="text-[10px] font-semibold text-[#F5A623] -mt-3.5">Coupon</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-[22px] h-[22px] rounded-full bg-[#F5A623] flex items-center justify-center">
            <History className="w-3.5 h-3.5 text-white stroke-[3]" />
          </div>
          <span className="text-[10px] font-semibold text-[#F5A623]">Historique</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-100">
          <MenuIcon className="w-[22px] h-[22px] text-[#9AA0A6]" />
          <span className="text-[10px] font-medium text-[#9AA0A6]">Menu</span>
        </div>
      </div>
    </div>
  );
};

export default BetSlipPreview;
