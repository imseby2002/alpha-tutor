import { createClient } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/supabase/profile';
import {
  normalizeNotebookEntryRow,
  normalizeNotebookEntryWithResourceRow,
  type NotebookEntry,
  type NotebookEntryWithResource,
} from '@/lib/notebook';
import { chatCompletion, type OpenRouterMessage } from '@/lib/openrouter';
import { NextResponse } from 'next/server';

function validateUuid(value: string | null): value is string {
  return Boolean(value && /^[0-9a-fA-F-]{36}$/.test(value));
}

export async function GET(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const url = new URL(request.url);
  const resourceId = url.searchParams.get('resourceId');
  const listParam = url.searchParams.get('list');

  const supabase = await createClient();

  if (resourceId) {
    if (!validateUuid(resourceId)) {
      return NextResponse.json({ error: 'invalid_resource_id' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('notebook_entries')
      .select('*')
      .eq('student_id', profile.id)
      .eq('resource_id', resourceId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ note: null });
    }

    const note: NotebookEntry = normalizeNotebookEntryRow(data as Record<string, unknown>);
    return NextResponse.json({ note });
  }

  if (listParam === 'true') {
    const { data, error } = await supabase
      .from('notebook_entries')
      .select('*, curriculum_resources(*)')
      .eq('student_id', profile.id)
      .order('updated_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const notes: NotebookEntryWithResource[] = Array.isArray(data)
      ? data
          .map((row) => normalizeNotebookEntryWithResourceRow(row as Record<string, unknown>))
          .filter((note): note is NotebookEntryWithResource => note !== null)
      : [];

    return NextResponse.json({ notes });
  }

  return NextResponse.json({ error: 'invalid_resource_id' }, { status: 400 });
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const resourceId = String(body.resourceId ?? '').trim();
  const noteText = String(body.noteText ?? '').trim();

  if (!validateUuid(resourceId)) {
    return NextResponse.json({ error: 'invalid_resource_id' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase
    .from('notebook_entries')
    .select('id')
    .eq('student_id', profile.id)
    .eq('resource_id', resourceId)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existing && existing.id) {
    const { data, error } = await supabase
      .from('notebook_entries')
      .update({ note_text: noteText, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ note: normalizeNotebookEntryRow(data as Record<string, unknown>) });
  }

  const { data, error } = await supabase
    .from('notebook_entries')
    .insert([
      {
        student_id: profile.id,
        resource_id: resourceId,
        note_text: noteText,
      },
    ])
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ note: normalizeNotebookEntryRow(data as Record<string, unknown>) });
}

/**
 * AI 辅助功能：分析笔记内容，提取重点、生成复习题等
 */
export async function PUT(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const resourceId = String(body.resourceId ?? '').trim();
  const noteText = String(body.noteText ?? '').trim();
  const action = String(body.action ?? '').trim(); // 'summarize' | 'generateQuestions' | 'extractKeywords'

  if (!validateUuid(resourceId)) {
    return NextResponse.json({ error: 'invalid_resource_id' }, { status: 400 });
  }

  if (!noteText) {
    return NextResponse.json({ error: 'note_text_required' }, { status: 400 });
  }

  try {
    let messages: OpenRouterMessage[] = [];

    switch (action) {
      case 'summarize':
        messages = [
          {
            role: 'system',
            content: '你是一个专业的学习助手。请帮助学生总结笔记的重点，使用清晰的条列式格式，突出关键概念。用繁体中文回答。',
          },
          {
            role: 'user',
            content: `请帮我总结以下学习笔记的重点：\n\n${noteText}`,
          },
        ];
        break;

      case 'generateQuestions':
        messages = [
          {
            role: 'system',
            content: '你是一个专业的教师。根据学生的笔记内容，生成 3-5 个有助于复习和理解的练习题。题目应该涵盖主要概念，难度适中。用繁体中文出题，并附上答案。',
          },
          {
            role: 'user',
            content: `根据以下笔记内容，生成复习练习题：\n\n${noteText}`,
          },
        ];
        break;

      case 'extractKeywords':
        messages = [
          {
            role: 'system',
            content: '你是一个学习分析专家。从学生的笔记中提取最重要的关键词和概念（5-10个），按照重要性排序。用繁体中文回答，每个关键词附带简短说明。',
          },
          {
            role: 'user',
            content: `从以下笔记中提取关键概念：\n\n${noteText}`,
          },
        ];
        break;

      default:
        return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
    }

    const aiResponse = await chatCompletion(messages, 'openai/gpt-4o-mini');

    return NextResponse.json({ 
      result: aiResponse,
      action,
    });
  } catch (error) {
    console.error('AI assistance error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI 处理失败' },
      { status: 500 }
    );
  }
}
