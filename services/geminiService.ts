
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAICoachingResponse = async (userMessage: string, context: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tu es un coach académique et bien-être expert. 
    Contexte actuel de l'étudiant: ${context}
    Utilisateur dit: ${userMessage}
    Réponds de manière empathique, encourageante et concise.`,
  });
  return response.text;
};

export const summarizeNotes = async (notes: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Résume les notes suivantes sous forme de points clés clairs et structurés pour un étudiant:
    ---
    ${notes}
    ---`,
  });
  return response.text;
};

export const generateQuiz = async (content: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Génère un quiz de 3 questions basées sur ce contenu. Retourne un JSON uniquement.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.INTEGER, description: "Index de la réponse correcte" }
          },
          required: ["question", "options", "answer"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};
