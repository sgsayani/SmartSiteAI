import { GoogleGenAI, type Content } from "@google/genai";

// Constructed on first use, not at import: without GEMINI_API_KEY the
// constructor throws, and at module scope that would take down the whole
// server — including sign-in, which needs no AI at all.
let client: GoogleGenAI | undefined;

const getClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set, so websites cannot be generated yet."
    );
  }

  client ??= new GoogleGenAI({ apiKey });
  return client;
};

/** Free tier: 10 requests/minute, 250/day. */
const MODEL = "gemini-2.5-flash";
/** Free tier: 15 requests/minute, 1000/day — used for the cheap title call. */
const NAMING_MODEL = "gemini-2.5-flash-lite";

const SYSTEM_PROMPT = `You generate complete, production-ready websites as a SINGLE self-contained HTML file.

Hard requirements:
- Output ONE full HTML document: <!DOCTYPE html> through </html>. Nothing before or after it.
- No markdown fences, no commentary, no explanation — the response is written straight to a .html file.
- Style with Tailwind via <script src="https://cdn.tailwindcss.com"></script>. Any extra CSS goes in an inline <style>.
- All JavaScript inline in <script> tags. No build step, no local file imports, no bundler.
- Images: use https://images.unsplash.com/... URLs or inline SVG. Never reference local image paths.
- Responsive on mobile, tablet, and desktop. Semantic HTML, real accessible labels, sensible <title> and meta description.
- Write real, specific copy for the subject — never lorem ipsum or "Your text here" placeholders.`;

/** The model occasionally wraps output in a fence despite instructions. */
const stripCodeFence = (text: string): string => {
  const fenced = text.match(/```(?:html)?\s*\n([\s\S]*?)\n?```/i);
  return (fenced ? fenced[1] : text).trim();
};

const runPrompt = async (contents: Content[]): Promise<string> => {
  const response = await getClient().models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      maxOutputTokens: 32768,
      // Thinking tokens are billed against the same output budget and against
      // the free tier's daily request quota. A single-file page is a
      // well-specified task, so the budget is better spent on the HTML itself.
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const finishReason = response.candidates?.[0]?.finishReason;

  if (finishReason === "MAX_TOKENS") {
    throw new Error(
      "The generated website was too long and got cut off. Try a simpler description."
    );
  }

  if (finishReason === "SAFETY" || finishReason === "PROHIBITED_CONTENT") {
    throw new Error(
      "That request was blocked by the AI's safety filter. Try describing the website differently."
    );
  }

  const code = response.text;

  if (!code?.trim()) {
    throw new Error("The AI returned an empty response. Please try again.");
  }

  return stripCodeFence(code);
};

export const generateWebsite = (prompt: string) =>
  runPrompt([
    {
      role: "user",
      parts: [{ text: `Build a complete website for this request:\n\n${prompt}` }],
    },
  ]);

export const reviseWebsite = (currentCode: string, instruction: string) =>
  runPrompt([
    {
      role: "user",
      parts: [{ text: `Here is the current website:\n\n${currentCode}` }],
    },
    {
      role: "model",
      parts: [{ text: "I have the current website. What change would you like?" }],
    },
    {
      role: "user",
      parts: [
        {
          text: `Apply this change and return the COMPLETE updated HTML document:\n\n${instruction}`,
        },
      ],
    },
  ]);

/** Short, human label for a project, derived from the prompt. */
export const generateProjectName = async (prompt: string): Promise<string> => {
  try {
    const response = await getClient().models.generateContent({
      model: NAMING_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction:
          "Reply with a 2-4 word title for the website being described. Title case, no quotes, no punctuation, nothing else.",
        maxOutputTokens: 32,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    return response.text?.trim().slice(0, 60) || fallbackName(prompt);
  } catch {
    // A missing title must never block project creation.
    return fallbackName(prompt);
  }
};

const fallbackName = (prompt: string): string =>
  prompt.trim().split(/\s+/).slice(0, 4).join(" ").slice(0, 60) ||
  "Untitled Project";
