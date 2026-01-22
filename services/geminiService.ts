
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectPlan, TaskStatus, Priority } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateProjectPlan = async (requirement: string): Promise<ProjectPlan> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following project requirement and generate a comprehensive project plan including phases, tasks, resource needs, and timeline. 
    Requirement: "${requirement}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          projectName: { type: Type.STRING },
          description: { type: Type.STRING },
          suggestedTeam: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                avatar: { type: Type.STRING }
              },
              required: ["id", "name", "role", "avatar"]
            }
          },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                tasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      status: { type: Type.STRING, description: "One of: TODO, IN_PROGRESS, REVIEW, DONE" },
                      priority: { type: Type.STRING, description: "One of: LOW, MEDIUM, HIGH, CRITICAL" },
                      startDate: { type: Type.STRING, description: "ISO date string starting from today" },
                      durationDays: { type: Type.NUMBER },
                      dependencies: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["id", "title", "status", "priority", "startDate", "durationDays"]
                  }
                }
              },
              required: ["name", "tasks"]
            }
          }
        },
        required: ["projectName", "description", "suggestedTeam", "phases"]
      }
    }
  });

  return JSON.parse(response.text);
};
