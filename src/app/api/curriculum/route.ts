import { createClient } from "@/lib/supabase/server";
import {
  CurriculumResource,
  CurriculumSubject,
  CurriculumResourceType,
  isValidCurriculumResourceType,
  mapCurriculumResourceTypeToDb,
  normalizeCurriculumResourceRow,
  SUBJECT_LABEL,
  COUNTRY_LABEL,
} from "@/lib/curriculum";
import { NextResponse } from "next/server";
import { type SchoolGrade } from "@/lib/education";

const VALID_SORT_FIELDS = new Set(["created_at", "updated_at", "year", "title"]);

function validateGrade(value: string | null): value is SchoolGrade {
  return Boolean(value && /^G\d{1,2}$/.test(value));
}

function validateCountry(value: string | null): value is keyof typeof COUNTRY_LABEL {
  return Boolean(value && Object.prototype.hasOwnProperty.call(COUNTRY_LABEL, value));
}

function validateSubject(value: string | null): value is CurriculumSubject {
  return Boolean(value && Object.prototype.hasOwnProperty.call(SUBJECT_LABEL, value));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const countryParam = url.searchParams.get("country");
  const gradeParam = url.searchParams.get("grade");
  const subjectParam = url.searchParams.get("subject");
  const typeParam = url.searchParams.get("type");
  const searchParam = url.searchParams.get("search");
  const limitParam = Number(url.searchParams.get("limit") ?? 20);
  const offsetParam = Number(url.searchParams.get("offset") ?? 0);
  const sortParam = url.searchParams.get("sort") ?? "created_at";

  if (typeParam && !isValidCurriculumResourceType(typeParam)) {
    return NextResponse.json({ error: "invalid_resource_type" }, { status: 400 });
  }

  if (sortParam && !VALID_SORT_FIELDS.has(sortParam)) {
    return NextResponse.json({ error: "invalid_sort" }, { status: 400 });
  }

  const supabase = await createClient();
  let query = supabase.from("curriculum_resources").select("*");

  if (countryParam) {
    if (!validateCountry(countryParam)) {
      return NextResponse.json({ error: "invalid_country" }, { status: 400 });
    }
    query = query.eq("country_code", countryParam);
  }

  if (gradeParam) {
    if (!validateGrade(gradeParam)) {
      return NextResponse.json({ error: "invalid_grade" }, { status: 400 });
    }
    query = query.eq("grade", gradeParam);
  }

  if (subjectParam) {
    if (!validateSubject(subjectParam)) {
      return NextResponse.json({ error: "invalid_subject" }, { status: 400 });
    }
    query = query.eq("subject", subjectParam);
  }

  if (typeParam) {
    query = query.eq(
      "resource_type",
      mapCurriculumResourceTypeToDb(typeParam as CurriculumResourceType)
    );
  }

  if (searchParam) {
    query = query.ilike("title", `%${searchParam}%`);
  }

  const { data, error } = await query.order(sortParam, { ascending: true }).range(offsetParam, offsetParam + Math.min(limitParam, 100) - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const resources: CurriculumResource[] = Array.isArray(data)
    ? data.map((row) => normalizeCurriculumResourceRow(row as Record<string, unknown>))
    : [];

  return NextResponse.json({ resources, count: resources.length });
}
