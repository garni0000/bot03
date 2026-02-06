
import { BetStatus, SelectionStatus, BetSlip } from './types';

export const DEFAULT_SLIP: BetSlip = {
  date: "04.02.2026 (23:10)",
  type: "Combiné",
  ticketId: "76837757121",
  totalEvents: 8,
  eventsFinished: 7,
  totalOdds: 318.476,
  stake: 2000,
  taxPercent: 20,
  status: BetStatus.WINNING,
  selections: [
    {
      id: "1",
      sport: "Football",
      league: "Coupe d'Italie",
      date: "05 févr. 2026 (20:00)",
      teamA: { name: "Atalanta", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/u2p_0Y_p96yq97p6o0.png", score: 3 },
      teamB: { name: "Juventus", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/9696.png", score: 0 },
      scoreDetail: "3:0 (1:0, 2:0)",
      market: "Total. (1.5) Plus de",
      odds: 1.33,
      status: SelectionStatus.WON
    },
    {
      id: "2",
      sport: "Football",
      league: "Espagne. Coupe du Roi",
      date: "05 févr. 2026 (20:00)",
      teamA: { name: "Real Betis Balompié", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/8712.png", score: 0 },
      teamB: { name: "Atlético de Madrid", logo: "https://ssl.gstatic.com/onebox/media/sports/logos/811.png", score: 5 },
      scoreDetail: "0:5 (0:3, 0:2)",
      market: "Total. (2) Plus de",
      odds: 1.37,
      status: SelectionStatus.WON
    }
  ]
};

export const THEME_COLORS = [
  { name: 'Vert', value: '#10b981' },
  { name: 'Rouge', value: '#ef4444' },
  { name: 'Bleu', value: '#3b82f6' }
];
