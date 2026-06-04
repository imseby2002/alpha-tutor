import { createClient } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/supabase/profile';
import {
  type CurriculumResource,
  isValidCurriculumResourceType,
  mapCurriculumResourceTypeToDb,
  normalizeCurriculumResourceRow,
  SUBJECT_LABEL as CURRICULUM_SUBJECT_LABEL,
} from '@/lib/curriculum';
import { type SchoolGrade } from '@/lib/education';
import { NextResponse } from 'next/server';

const MATERIAL_BUCKET = 'materials';

function validateGrade(value: string | null): value is SchoolGrade {
  return Boolean(value && /^G\d{1,2}$/.test(value));
}

function validateSubject(value: string | null): value is keyof typeof CURRICULUM_SUBJECT_LABEL {
  return Boolean(value && Object.prototype.hasOwnProperty.call(CURRICULUM_SUBJECT_LABEL, value));
}

function normalizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9_.-]/g, '_');
}

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== 'guide' && profile.role !== 'admin')) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('curriculum_resources')
    .select('*')
    .eq('created_by', profile.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const resources: CurriculumResource[] = Array.isArray(data)
    ? data.map((row) => normalizeCurriculumResourceRow(row as Record<string, unknown>))
    : [];

  return NextResponse.json({ resources });
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== 'guide' && profile.role !== 'admin')) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const formData = await request.formData();
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const resourceType = String(formData.get('type') ?? '').trim();
  const grade = String(formData.get('grade') ?? '').trim();
  const subject = String(formData.get('subject') ?? '').trim();
  const sourceUrl = String(formData.get('sourceUrl') ?? '').trim();
  const publisher = String(formData.get('publisher') ?? '').trim();
  const license = String(formData.get('license') ?? '').trim();
  const yearValue = Number(formData.get('year') ?? '');
  const file = formData.get('file') as File | null;

  if (!title) {
    return NextResponse.json({ error: 'missing_title' }, { status: 400 });
  }

  if (!isValidCurriculumResourceType(resourceType)) {
    return NextResponse.json({ error: 'invalid_resource_type' }, { status: 400 });
  }

  if (!validateGrade(grade) || !validateSubject(subject)) {
    return NextResponse.json({ error: 'invalid_grade_or_subject' }, { status: 400 });
  }

  if (!file && !sourceUrl) {
    return NextResponse.json({ error: 'missing_resource' }, { status: 400 });
  }

  const supabase = await createClient();
  let storagePath: string | undefined;
  let fileSizeBytes: number | undefined;

  if (file && file.size > 0) {
    const safeFileName = `${Date.now()}-${normalizeFileName(file.name)}`;
    storagePath = `uploads/${profile.id}/${safeFileName}`;
    const { error: uploadError } = await supabase.storage.from(MATERIAL_BUCKET).upload(storagePath, file, {
      upsert: false,
    });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }
    fileSizeBytes = file.size;
  }

  const insertPayload: Record<string, unknown> = {
    country_code: 'TW',
    grade,
    subject,
    resource_type: mapCurriculumResourceTypeToDb(resourceType),
    title,
    description: description || null,
    source_url: sourceUrl || null,
    publisher: publisher || null,
    license: license || null,
    year: Number.isNaN(yearValue) ? null : yearValue,
    storage_path: storagePath || null,
    file_size_bytes: fileSizeBytes ?? null,
    created_by: profile.id,
  };

  const { data, error } = await supabase
    .from('curriculum_resources')
    .insert([insertPayload])
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const resource = normalizeCurriculumResourceRow(data as Record<string, unknown>);
  return NextResponse.json({ resource });
}
