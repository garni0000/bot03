
export enum BetStatus {
  WINNING = 'Payé',
  LOST = 'Perdu',
  PENDING = 'En attente'
}

export enum SelectionStatus {
  WON = 'Gagné',
  LOST = 'Perdu',
  PENDING = 'En cours'
}

export interface BetSelection {
  id: string;
  sport: string;
  league: string;
  date: string;
  teamA: { name: string; logo: string; score: number };
  teamB: { name: string; logo: string; score: number };
  scoreDetail: string;
  market: string;
  odds: number;
  status: SelectionStatus;
  screenshot?: string; // Base64 or URL of the raw match screenshot
}

export interface BetSlip {
  date: string;
  type: string; // e.g., "Combiné"
  ticketId: string;
  totalEvents: number;
  eventsFinished: number;
  totalOdds: number;
  stake: number;
  taxPercent: number;
  status: BetStatus;
  selections: BetSelection[];
  watermark?: {
    image: string;
    enabled: boolean;
    opacity: number;
  };
  textWatermark?: {
    text: string;
    enabled: boolean;
    opacity: number;
    color: string;
    fontSize: number;
  };
}

export interface AppState {
  slip: BetSlip;
  isAILoading: boolean;
  themeColor: string;
}
