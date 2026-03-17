import type { MoodCategory } from '@/types/emotion';
import type { AIGeneratedContent } from '@/types/ai';
import { buildPromptContext } from '@/lib/emotion-engine';

/** Supported AI providers */
export type AIProvider = 'gemini' | 'claude';

const SYSTEM_PROMPT = `Tu es le moteur créatif de Framood, une app de création visuelle émotionnelle.

L'utilisateur vient de décrire son humeur. Tu dois générer :
1. Un texte principal court et percutant (max 12 mots) — c'est ce qui sera affiché en grand
2. Un texte secondaire optionnel (max 20 mots) — sous-titre ou contexte
3. Un tag court (max 2 mots) — catégorisation poétique

Règles absolues :
- Jamais de guillemets dans le texte principal
- Jamais de hashtags
- Jamais de ponctuation excessive
- Toujours en accord avec l'émotion décrite — ne pas édulcorer
- Les textes doivent avoir de l'impact visuel (mots forts, rythme)
- Style : authentique, pas générique — évite les clichés comme "croire en soi", "ne jamais abandonner"

Réponds UNIQUEMENT en JSON, sans markdown, sans explications :
{
  "main_text": "...",
  "sub_text": "...",
  "tag": "...",
  "suggested_mood": "melancholie|energie|paix|colere|nostalgie|amour|anxiete|gratitude",
  "suggested_style": "polaroid|typo|elegant|bold|cinema|poetique|minimal|journal|manuscrit|aquarelle|glitch|cosmos|vhs|retrowave|luxe|sms|neon|magazine|brule|street|retro|presse|liquid|zen|blueprint|postit|gothic|lofi|ticket|miami|encre|paris|broadcast|craie|sticker|philo|tropical|argentique|mono|crystal",
  "confidence": 0.0
}`;

function buildUserPrompt(description: string, mood: MoodCategory, intensity: number): string {
  const emotionContext = buildPromptContext(mood, intensity);
  return `${emotionContext}
Description de l'utilisateur : "${description}"
Génère 1 création unique adaptée.`;
}

/** Parse the AI response, stripping markdown fences if present */
function parseAIResponse(raw: string): AIGeneratedContent {
  const clean = raw.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean) as AIGeneratedContent;

  if (!parsed.main_text || typeof parsed.main_text !== 'string') {
    throw new Error('Invalid AI response: missing main_text');
  }

  return {
    main_text: parsed.main_text,
    sub_text: parsed.sub_text || '',
    tag: parsed.tag || '',
    suggested_mood: parsed.suggested_mood || 'paix',
    suggested_style: parsed.suggested_style || 'minimal',
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
  };
}

/** Create a fallback content when all AI providers fail */
export function createFallbackContent(
  description: string,
  mood: MoodCategory,
): AIGeneratedContent {
  const words = description.split(/\s+/);
  const mainText = words.slice(0, 12).join(' ');

  const moodStyleMap: Record<MoodCategory, string> = {
    melancholie: 'cinema',
    energie: 'bold',
    paix: 'minimal',
    colere: 'bold',
    nostalgie: 'polaroid',
    amour: 'elegant',
    anxiete: 'typo',
    gratitude: 'minimal',
  };

  return {
    main_text: mainText || 'Sans titre',
    sub_text: '',
    tag: '',
    suggested_mood: mood,
    suggested_style: moodStyleMap[mood],
    confidence: 0,
  };
}

// ─── Provider: Gemini ────────────────────────────────────────────────

async function callGemini(
  description: string,
  mood: MoodCategory,
  intensity: number,
): Promise<AIGeneratedContent> {
  const apiKey = import.meta.env.VITE_GEMINI_KEY as string | undefined;
  if (!apiKey) throw new Error('No VITE_GEMINI_KEY configured');

  const userPrompt = buildUserPrompt(description, mood, intensity);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 500,
          responseMimeType: 'application/json',
        },
      }),
    },
  );

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    let message = `Erreur API Gemini ${response.status}`;
    try {
      const errJson = JSON.parse(errBody) as { error?: { message?: string } };
      if (errJson?.error?.message) message = errJson.error.message;
    } catch { /* use default message */ }
    throw new Error(message);
  }

  const data = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!raw) {
    console.warn('[Framood] Gemini returned empty content:', JSON.stringify(data).slice(0, 200));
    throw new Error('Gemini returned empty content');
  }

  return parseAIResponse(raw);
}

// ─── Provider: Claude ────────────────────────────────────────────────

async function callClaude(
  description: string,
  mood: MoodCategory,
  intensity: number,
): Promise<AIGeneratedContent> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_KEY as string | undefined;
  if (!apiKey) throw new Error('No VITE_ANTHROPIC_KEY configured');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: buildUserPrompt(description, mood, intensity) },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err?.error?.message || `Erreur API Claude ${response.status}`);
  }

  const data = await response.json() as {
    content?: Array<{ text?: string }>;
  };
  const raw = data.content?.[0]?.text || '';

  return parseAIResponse(raw);
}

// ─── Main entry point ────────────────────────────────────────────────

/** Provider registry — order defines fallback priority */
const PROVIDERS: Array<{ id: AIProvider; call: typeof callGemini }> = [
  { id: 'gemini', call: callGemini },
  { id: 'claude', call: callClaude },
];

/**
 * Generate AI content using the best available provider.
 * Priority: Gemini → Claude → fallback (user text as-is).
 * Each provider is tried in order; if one fails, the next is attempted.
 */
export async function generateContent(
  description: string,
  mood: MoodCategory,
  intensity: number,
): Promise<AIGeneratedContent> {
  const errors: string[] = [];

  for (const provider of PROVIDERS) {
    try {
      const result = await provider.call(description, mood, intensity);
      console.log(`[Framood] AI generated via ${provider.id}`);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Framood] ${provider.id} failed: ${msg}`);
      errors.push(`${provider.id}: ${msg}`);
    }
  }

  // All providers failed — use fallback
  console.warn('[Framood] All AI providers failed, using fallback mode');
  throw new Error(errors.join(' | '));
}
