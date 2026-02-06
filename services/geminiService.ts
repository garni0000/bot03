
import { GoogleGenAI, Type } from "@google/genai";
import { BetSlip, BetStatus, SelectionStatus, BetSelection } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSlipContent = async (prompt: string): Promise<Partial<BetSlip> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a realistic betting slip configuration for a mobile app (1xBet style) based on: "${prompt}". 
      Respond ONLY with valid JSON.
      Include team names, scores, score details (half-time results), realistic odds, and logos from Wikipedia/Google logo URLs if possible.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            ticketId: { type: Type.STRING },
            totalEvents: { type: Type.NUMBER },
            eventsFinished: { type: Type.NUMBER },
            status: { type: Type.STRING },
            selections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sport: { type: Type.STRING },
                  league: { type: Type.STRING },
                  date: { type: Type.STRING },
                  teamA: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      logo: { type: Type.STRING },
                      score: { type: Type.NUMBER }
                    }
                  },
                  teamB: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      logo: { type: Type.STRING },
                      score: { type: Type.NUMBER }
                    }
                  },
                  scoreDetail: { type: Type.STRING },
                  market: { type: Type.STRING },
                  odds: { type: Type.NUMBER },
                  status: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const analyzeMatchImage = async (base64Image: string): Promise<Partial<BetSelection> | null> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          imagePart,
          { text: "Extract match details from this betting slip screenshot. Return JSON with: sport, league, date, teamA (name, score), teamB (name, score), scoreDetail (e.g. 1:0 (1:0)), market, odds, and status (Gagné, Perdu, En cours). Try to find official logos URLs if possible, otherwise use placeholders." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sport: { type: Type.STRING },
            league: { type: Type.STRING },
            date: { type: Type.STRING },
            teamA: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                logo: { type: Type.STRING },
                score: { type: Type.NUMBER }
              }
            },
            teamB: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                logo: { type: Type.STRING },
                score: { type: Type.NUMBER }
              }
            },
            scoreDetail: { type: Type.STRING },
            market: { type: Type.STRING },
            odds: { type: Type.NUMBER },
            status: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Image Error:", error);
    return null;
  }
};
