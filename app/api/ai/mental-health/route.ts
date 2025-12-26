import { NextRequest, NextResponse } from 'next/server';

// --- Types ---

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface MentalHealthPayload {
    language: 'fa' | 'en';
    mood: string | null;
    stress: string | null;
    history: ChatMessage[];
    message: string;
}

// --- System Prompt ---

const SYSTEM_PROMPT = `
You are a supportive mental health companion inside a health-tracking app (GoHealthing).
You are not a doctor, therapist, or emergency service.
Your role is to:
- Listen empathetically to the user.
- Reflect back what they say in your own words.
- Ask gentle, open questions that help them understand their feelings, needs, and options.
- Suggest simple, low-risk self-care ideas (breathing, journaling, light movement, relaxation, sleep hygiene, connecting with others).
- Encourage them to reach out to a licensed professional for diagnosis or treatment.

Safety rules:
- Do NOT give diagnoses or labels (for example, do not say "you have depression/anxiety/etc.").
- Do NOT recommend medications or changes to medications.
- If the user mentions self-harm, suicide, wanting to die, harming others, feeling unsafe, or similar crisis language, immediately respond with a brief, compassionate message telling them that you cannot help in emergencies and they must contact local emergency services, crisis hotlines, or a trusted adult/clinician right away.
- Be clear that you are an AI in an app and not a replacement for professional care.

Style:
- Warm, respectful, non-judgmental.
- Short paragraphs and bullet points.
- Focus on what the user feels, what they can control, and what support they can seek.
- Use the language requested by the app (fa for Farsi, en for English).

Constraints:
- Keep the answer under 250–300 words.
- Do not output JSON or code, only plain text for the chat bubble.
`.trim();

// --- Handler ---

export async function POST(req: NextRequest) {
    try {
        const payload: MentalHealthPayload = await req.json();

        const { language, mood, stress, history, message } = payload;

        if (!message) {
            return NextResponse.json({ error: 'missing_message' }, { status: 400 });
        }

        // Build Messages for the AI
        const messages: ChatMessage[] = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            {
                role: 'user',
                content: `
Language: ${language}
Today's Mood: ${mood || 'Not logged'}
Today's Stress: ${stress || 'Not logged'}

User Message: ${message}
                `.trim()
            }
        ];

        // AI Provider Configuration (Generic as requested, e.g., for DeepSeek or similar)
        const apiKey = process.env.AI_API_KEY;
        const model = process.env.AI_MODEL || 'deepseek-chat';
        const apiUrl = process.env.AI_API_URL || 'https://api.deepseek.com/v1/chat/completions';

        if (!apiKey) {
            console.error('AI_API_KEY is missing');
            return NextResponse.json({ error: 'api_configuration_error' }, { status: 500 });
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: 0.7, // Slightly higher for empathy/warmth
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errorDetail = await response.text();
            console.error('AI API Error:', errorDetail);
            return NextResponse.json({ error: 'ai_service_error' }, { status: 500 });
        }

        const data = await response.json();
        const aiMessage = data.choices?.[0]?.message?.content;

        if (!aiMessage) {
            return NextResponse.json({ error: 'empty_response' }, { status: 500 });
        }

        return new NextResponse(aiMessage, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });

    } catch (error: any) {
        console.error('Mental Health AI Error:', error);
        return NextResponse.json({ error: 'server_error', message: error.message }, { status: 500 });
    }
}
