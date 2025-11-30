import { GoogleGenerativeAI } from '@google/generative-ai';
import type { StoryContextSnapshot, StoryVariable, ContinuityIssue } from '@/types';

export interface AiRequestPayload {
  projectId: string;
  userMessage: string;
  mode: 'brainstorm' | 'continuity' | 'character' | 'scene' | 'generic';
  contextSnapshot: StoryContextSnapshot;
  apiKey: string;
}

export interface AiResponse {
  message: string;
  suggestedVariables?: StoryVariable[];
  suggestedIssues?: ContinuityIssue[];
  suggestedNextSteps?: string[];
}

const API_KEY_STORAGE_KEY = 'storyforge_gemini_api_key';

export const getApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const setApiKey = (key: string) => {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
};

export const clearApiKey = () => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

export async function generateAiResponse(payload: AiRequestPayload): Promise<AiResponse> {
  if (!payload.apiKey) {
    throw new Error('API Key is missing');
  }

  const genAI = new GoogleGenerativeAI(payload.apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const systemPrompt = constructSystemPrompt(payload);

  try {
    const result = await model.generateContent([systemPrompt, payload.userMessage]);
    const response = result.response;
    const text = response.text();

    // Parse the response to extract structured data if present
    // For now, we'll assume the model returns JSON if we ask it to, or just text
    // To keep it robust, we'll ask for JSON in the prompt for structured data
    // But for this initial version, let's just return the text as the message

    const responseData: AiResponse = {
      message: text,
      suggestedNextSteps: ['Ask about character motivations', 'Explore alternative endings'],
    };

    if (payload.mode === 'continuity') {
      responseData.suggestedIssues = [
        {
          id: crypto.randomUUID(),
          projectId: payload.projectId,
          type: 'logic',
          description: 'Potential timeline inconsistency: The hero is in two places at once.',
          severity: 'major',
          createdAt: new Date().toISOString(),
          resolved: false,
          suggestedFix: 'Check the travel time between locations.',
        },
        {
          id: crypto.randomUUID(),
          projectId: payload.projectId,
          type: 'character',
          description: 'Character voice mismatch in dialogue.',
          severity: 'minor',
          createdAt: new Date().toISOString(),
          resolved: false,
        },
      ];
    }

    if (payload.mode === 'brainstorm') {
      responseData.suggestedVariables = [
        {
          id: crypto.randomUUID(),
          projectId: payload.projectId,
          key: 'mystery_level',
          label: 'Mystery Level',
          type: 'number',
          value: '1',
          description: 'Tracks the current level of mystery in the story.',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          projectId: payload.projectId,
          key: 'hero_trust',
          label: 'Hero Trust',
          type: 'number',
          value: '50',
          description: 'How much the hero trusts their companion.',
          lastUpdated: new Date().toISOString(),
        },
      ];
    }

    return responseData;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate response from AI');
  }
}

function constructSystemPrompt(payload: AiRequestPayload): string {
  const { contextSnapshot, mode } = payload;

  let basePrompt = `You are an expert creative writing assistant for the project "${contextSnapshot.projectSummary}".
    
Context:
${contextSnapshot.projectSummary}

Key Characters:
${contextSnapshot.keyCharacters.join('\n')}

Current Scene Context:
${contextSnapshot.currentPlotNodeSummary || 'No specific scene selected.'}

Named Variables:
${JSON.stringify(contextSnapshot.namedVariables, null, 2)}

Mode: ${mode.toUpperCase()}
`;

  switch (mode) {
    case 'brainstorm':
      basePrompt +=
        '\nYour goal is to generate creative ideas, plot twists, and options. Be expansive and imaginative.';
      break;
    case 'continuity':
      basePrompt +=
        '\nYour goal is to check for consistency errors, timeline issues, and character contradictions. Be critical and precise.';
      break;
    case 'character':
      basePrompt +=
        '\nYour goal is to deepen character psychology, voice, and relationships. Focus on emotional truth and motivation.';
      break;
    case 'scene':
      basePrompt +=
        '\nYour goal is to help write or refine the current scene. Focus on pacing, sensory details, and dialogue.';
      break;
    case 'generic':
    default:
      basePrompt += '\nYour goal is to be a helpful writing partner.';
      break;
  }

  return basePrompt;
}
