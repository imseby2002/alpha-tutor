import { getCurrentProfile } from '@/lib/supabase/profile';
import { chatCompletion, type OpenRouterMessage } from '@/lib/openrouter';
import { NextResponse } from 'next/server';

type LessonTurn = { role: 'user' | 'assistant'; content: string };

const MAX_HISTORY = 30;

function buildSystemPrompt(subjectLabel: string, topic: string, gradeLabel: string): string {
  return [
    `你是「Alpha Tutor」的一對一 AI 家教老師，正在為一位「${gradeLabel}」的學生上「${subjectLabel}」的課，今天的主題是「${topic}」。`,
    '',
    '教學原則：',
    '1. 像真人家教一樣「主動授課」，不要只等學生發問。',
    '2. 一次只教一個小重點：先用淺白的話解釋觀念，搭配一個具體例子或生活化的類比。',
    '3. 每一段講解的結尾，提出「一個」簡短問題確認學生是否理解，並停下來等學生回答，不要自問自答。',
    '4. 學生答對就給予肯定並進入下一個重點；答錯或說「不懂」時，換個更簡單的角度重新講解一次再出題。',
    `5. 全程使用繁體中文，語氣親切、多鼓勵，難度貼近「${gradeLabel}」的程度。`,
    '6. 回覆要精簡，控制在數小段內，必要時用條列或簡單算式呈現；不要一次把整堂課倒出來。',
    '7. 適時幫學生回顧進度；當這個主題的核心觀念都教完且確認理解後，做一個重點總結，並出 1～2 題綜合練習收尾。',
    '',
    '輸出格式：純文字即可，可用換行與「•」條列，不要使用 Markdown 標題符號（#）。',
  ].join('\n');
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: {
    subject?: string;
    topic?: string;
    grade?: string;
    messages?: LessonTurn[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const subjectLabel = String(body.subject ?? '').trim();
  const topic = String(body.topic ?? '').trim();
  const gradeLabel = String(body.grade ?? '').trim() || '一般';

  if (!subjectLabel || !topic) {
    return NextResponse.json({ error: 'subject_and_topic_required' }, { status: 400 });
  }

  const history: OpenRouterMessage[] = Array.isArray(body.messages)
    ? body.messages
        .filter(
          (m): m is LessonTurn =>
            !!m &&
            (m.role === 'user' || m.role === 'assistant') &&
            typeof m.content === 'string'
        )
        .slice(-MAX_HISTORY)
        .map((m) => ({ role: m.role, content: m.content }))
    : [];

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: buildSystemPrompt(subjectLabel, topic, gradeLabel) },
    ...history,
  ];

  // 第一次進入（沒有任何對話）→ 觸發老師主動開講
  if (history.length === 0) {
    messages.push({
      role: 'user',
      content: '老師好，請開始今天的課程：先簡短歡迎我、介紹今天會學到什麼，接著教第一個重點並提出第一個確認問題。',
    });
  }

  try {
    const reply = await chatCompletion(messages, 'openai/gpt-4o-mini');
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('lesson error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI 上課服務發生錯誤' },
      { status: 500 }
    );
  }
}
