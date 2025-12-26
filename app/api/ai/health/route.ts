import { NextRequest, NextResponse } from 'next/server';

// --- Types ---

type Mode = 'insight' | 'education' | 'qa';

type Module =
    | 'fasting' | 'sleep' | 'activity' | 'medications' | 'symptoms'
    | 'dental' | 'pregnancy' | 'period' | 'discharge' | 'body_literacy'
    | 'mental_health' | 'sex_life' | 'recipes' | 'general';

interface HealthPayload {
    mode: Mode;
    module: Module;
    user_profile: {
        age: number;
        sex: string;
        height_cm: number;
        weight_kg: number;
        goals: string[];
        conditions: string[];
    };
    tracked_data: {
        logs_last_30_days: any[];
        today: Record<string, any>;
    };
    request: {
        question: string | null;
        education_topic: string | null;
        language: 'fa' | 'en';
    };
}

// --- Constants ---

const SYSTEM_PROMPT = `
You are an AI assistant embedded inside a multi-module health app.
The app helps adults track:
- intermittent fasting and diet plans
- sleep and daily activity
- medications and symptoms
- dental health and general body literacy
- women’s health (period, pregnancy, discharge, fertility)
- mental health and stress
- sexual wellbeing
- recipes and healthy meal plans

Your job is to:
1. Analyze the user’s tracked data (fasting, sleep, activity, mood, symptoms, medications, etc.) and generate short, practical insights and suggestions.
2. Create short, safe, educational content for the Learn section and for individual modules when requested.

Always:
- Use a supportive, non-judgmental tone.
- Be concise and practical (bullet points and short paragraphs).
- Avoid medical diagnosis, prescriptions, or emergency triage.
- Encourage the user to speak to a healthcare professional for any serious or persistent symptoms.
- For pregnancy, mental health, chest pain, severe symptoms, clearly recommend contacting a clinician or emergency services instead of trying to diagnose.
`;

// --- Handler ---

export async function POST(req: NextRequest) {
    try {
        const payload: HealthPayload = await req.json();

        // Basic Validation
        if (!payload.mode || !payload.module || !payload.request?.language) {
            return NextResponse.json({ error: 'missing_required_fields' }, { status: 400 });
        }

        const { mode, module, request } = payload;
        const lang = request.language;

        // Build User Message
        const userMessage = `
Here is the request JSON from the app:
${JSON.stringify(payload, null, 2)}

Read mode, module, and request.language and respond in pure JSON only (no markdown, no explanations) using ONE of these formats.

If mode = "insight":
{
  "type": "insight",
  "module": "${module}",
  "insights": ["...", "..."],
  "suggested_actions": ["...", "...", "..."],
  "doctor_summary": "..."
}

If mode = "education":
{
  "type": "education",
  "title": "...",
  "sections": [
    { "heading": "...", "body": "..." }
  ],
  "key_points": ["...", "..."],
  "disclaimer": "..."
}

If mode = "qa":
{
  "type": "qa",
  "answer": "...",
  "follow_up_questions": ["...", "..."]
}

Rules:
1. If request.language = "fa", write all text in Persian (Farsi).
2. If request.language = "en", write all text in English.
3. Never output anything except a single valid JSON object.
4. Never give diagnoses or medication names/doses.
5. For dangerous or emergency symptoms, tell the user to contact local emergency services or a doctor instead of trying to diagnose.
    `.trim();

        // Call DeepSeek
        const apiKey = process.env.DEEPSEEK_API_KEY;
        const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

        if (!apiKey) {
            console.error('DEEPSEEK_API_KEY is missing');
            return NextResponse.json({ error: 'api_configuration_error' }, { status: 500 });
        }

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.3,
                response_format: { type: 'json_object' } // DeepSeek supports JSON mode
            }),
        });

        if (!response.ok) {
            const errorDetail = await response.text();
            console.error('DeepSeek API Error:', errorDetail);
            return NextResponse.json({ error: 'deepseek_error', detail: errorDetail }, { status: 500 });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            return NextResponse.json({ error: 'empty_response_from_model' }, { status: 500 });
        }

        try {
            const parsed = JSON.parse(content);
            return NextResponse.json(parsed);
        } catch (parseError) {
            console.error('JSON Parse Error from Model:', content);
            return NextResponse.json({ error: 'invalid_json_from_model', raw: content }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Server Internal Error:', error);
        return NextResponse.json({ error: 'server_error', message: error.message }, { status: 500 });
    }
}
