interface Env {
  DB: D1Database;
  AI?: {
    run: (model: string, inputs: any) => Promise<any>;
  };
  GEMINI_API_KEY?: string;
  CAMP_NAME?: string;
  CAMP_THEME?: string;
}

interface AgentRequest {
  action: 'chat_turn' | 'reflect_verse' | 'generate_invite';
  messages?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  userInput?: string;
  camperData?: {
    nickname?: string;
    role?: string;
    favorite_verse?: string;
    ministry_interests?: string[];
    church_name?: string;
  };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as AgentRequest;
    const { action, messages = [], userInput = '', camperData = {} } = body;
    const campName = context.env.CAMP_NAME || 'VLC 2027';
    const campTheme = context.env.CAMP_THEME || 'Arise & Shine (Isaiah 60:1)';

    // TASK 1: Deep Scripture Reflection (Utilizes GEMINI API for high biblical depth)
    if (action === 'reflect_verse') {
      const verse = camperData.favorite_verse || userInput || 'Jeremiah 29:11';
      const reflection = await generateGeminiReflection(
        verse,
        camperData,
        campName,
        campTheme,
        context.env.GEMINI_API_KEY,
        context.env.AI
      );
      return new Response(JSON.stringify({ reflection }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TASK 2: Personalized Viral Friend Invite Copy (Gemini with Workers AI fallback)
    if (action === 'generate_invite') {
      const inviteCopy = await generateFriendInviteCopy(
        camperData,
        campName,
        campTheme,
        context.env.GEMINI_API_KEY,
        context.env.AI
      );
      return new Response(JSON.stringify({ inviteCopy }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TASK 3: Conversational Guidance & Turn-by-Turn Chat (Cloudflare Workers AI for edge speed)
    const chatReply = await handleConversationalTurn(
      messages,
      userInput,
      camperData,
      campName,
      campTheme,
      context.env.AI,
      context.env.GEMINI_API_KEY
    );

    return new Response(JSON.stringify(chatReply), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message || 'Agent processing error',
        fallback: true,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

/**
 * Task: Deep Scripture Reflection
 * Uses Google Gemini API for deep theological insight, warmth, and pastoral encouragement.
 * Falls back to Workers AI or contextual wisdom.
 */
async function generateGeminiReflection(
  verse: string,
  camperData: any,
  campName: string,
  campTheme: string,
  geminiKey?: string,
  workersAi?: any
): Promise<string> {
  const prompt = `You are "Vicky", the warm, faith-filled, and enthusiastic AI Camp Guide for "${campName}" (Camp Theme: ${campTheme}).
A registered participant (${camperData.nickname || 'Camper'}, serving/interested in ${camperData.role || 'camper'}, from ${camperData.church_name || 'their home church'}) just shared their favorite Bible verse: "${verse}".

In 2-3 short, inspiring, Christ-centered sentences:
1. Speak life and biblical encouragement into their heart for ${campName}.
2. Connect their verse to their journey and readiness to encounter God at camp.
Keep it personal, uplifting, and authentic. No boilerplate.`;

  if (geminiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 250, temperature: 0.7 },
          }),
        }
      );
      if (response.ok) {
        const data = await response.json() as any;
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return candidateText.trim();
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed, trying Workers AI fallback', e);
    }
  }

  // Cloudflare Workers AI fallback for verse reflection
  if (workersAi) {
    try {
      const aiRes = await workersAi.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
      });
      if (aiRes?.response) return aiRes.response.trim();
    } catch (e) {
      console.warn('Workers AI reflection failed', e);
    }
  }

  // Graceful rule-based encouraging fallback
  return `What a powerful anchor! As you hold onto "${verse}", get ready for God to speak powerfully and ignite your faith at ${campName}. He has divine appointments in store for you!`;
}

/**
 * Task: Personalized Friend Invite Message
 * Crafts an inviting, natural WhatsApp/SMS message for friends.
 */
async function generateFriendInviteCopy(
  camperData: any,
  campName: string,
  campTheme: string,
  geminiKey?: string,
  workersAi?: any
): Promise<{ headline: string; message: string }> {
  const name = camperData.nickname || 'Hey friend';
  const church = camperData.church_name || 'our church';

  if (geminiKey) {
    try {
      const prompt = `Write a short, exciting text message (like for WhatsApp or Messenger) from a camper named ${name} inviting their friend to join them at Christian camp "${campName}" (${campTheme}) with ${church}.
Return JSON strictly in this format:
{"headline": "Short punchy subject", "message": "Text message copy with camp excitement"}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );
      if (res.ok) {
        const json = await res.json() as any;
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            headline: parsed.headline || 'Come with me to VLC 2027!',
            message: parsed.message,
          };
        }
      }
    } catch (e) {
      console.warn('Gemini invite generation error', e);
    }
  }

  return {
    headline: `Join me at ${campName}! 🔥`,
    message: `Hey! I just secured my spot for ${campName} with ${church}! It's going to be a life-changing encounter. Register with our church link so we can go together: `,
  };
}

/**
 * Task: Conversational Guidance (Fast turn-by-turn edge response using Cloudflare Workers AI)
 */
async function handleConversationalTurn(
  messages: Array<{ role: string; content: string }>,
  userInput: string,
  camperData: any,
  campName: string,
  campTheme: string,
  workersAi?: any,
  geminiKey?: string
): Promise<{ reply: string; extractedData?: any }> {
  const systemPrompt = `You are Vicky, the welcoming, enthusiastic, and loving AI Camp Host for "${campName}" (${campTheme}).
Your mission is to guide campers through their registration smoothly with warmth and joy.
Tone: Warm, encouraging, energetic Christian brother/sister.
Keep responses concise (1-3 sentences max) so users can focus on their next registration step.`;

  if (workersAi) {
    try {
      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ];
      if (userInput) {
        formattedMessages.push({ role: 'user', content: userInput });
      }

      const res = await workersAi.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: formattedMessages,
        max_tokens: 150,
      });

      if (res?.response) {
        return { reply: res.response.trim() };
      }
    } catch (e) {
      console.warn('Workers AI chat turn error', e);
    }
  }

  // Gemini secondary fallback if Workers AI is not configured
  if (geminiKey && userInput) {
    try {
      const gemRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\nUser says: ${userInput}\nReply:` }] }],
            generationConfig: { maxOutputTokens: 120 },
          }),
        }
      );
      if (gemRes.ok) {
        const d = await gemRes.json() as any;
        const replyText = d?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) return { reply: replyText.trim() };
      }
    } catch (e) {
      console.warn('Gemini chat fallback error', e);
    }
  }

  return {
    reply: `Praise God! I've recorded that. Let's keep going to get your VLC 2027 Camp Pass ready!`,
  };
}
