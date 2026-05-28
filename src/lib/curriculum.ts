import type { SchoolGrade } from "@/lib/education";

export type CountryCode = "TW" | "US" | "CN" | "HK" | "JP" | "KR";

export const COUNTRY_LABEL: Record<CountryCode, string> = {
  TW: "台灣",
  US: "美國",
  CN: "中國",
  HK: "香港",
  JP: "日本",
  KR: "韓國",
};

export type CurriculumSubject =
  | "chinese"
  | "english"
  | "math"
  | "physics"
  | "chemistry"
  | "biology"
  | "geography"
  | "history";

export const SUBJECT_LABEL: Record<CurriculumSubject, string> = {
  chinese: "國文",
  english: "英文",
  math: "數學",
  physics: "物理",
  chemistry: "化學",
  biology: "生物",
  geography: "地理",
  history: "歷史",
};

export const TAIWAN_CORE_SUBJECTS: CurriculumSubject[] = [
  "chinese",
  "english",
  "math",
  "physics",
  "chemistry",
  "biology",
  "geography",
  "history",
];

export const SUBJECTS_BY_COUNTRY: Record<CountryCode, CurriculumSubject[]> = {
  TW: TAIWAN_CORE_SUBJECTS,
  US: ["english", "math", "physics", "chemistry", "biology", "geography", "history"],
  CN: ["chinese", "english", "math", "physics", "chemistry", "biology", "geography", "history"],
  HK: ["chinese", "english", "math", "physics", "chemistry", "biology", "geography", "history"],
  JP: ["english", "math", "physics", "chemistry", "biology", "geography", "history"],
  KR: ["english", "math", "physics", "chemistry", "biology", "geography", "history"],
};

export type CurriculumResourceType = "textbook" | "questionBank" | "exam" | "lessonNotes";

export const CURRICULUM_RESOURCE_DB_TYPE: Record<CurriculumResourceType, string> = {
  textbook: "textbook",
  questionBank: "question_bank",
  exam: "exam",
  lessonNotes: "lesson_notes",
};

const DB_TYPE_TO_CURRICULUM_RESOURCE: Record<string, CurriculumResourceType> = {
  textbook: "textbook",
  question_bank: "questionBank",
  exam: "exam",
  lesson_notes: "lessonNotes",
};

export function isValidCurriculumResourceType(
  value: string | null
): value is CurriculumResourceType {
  return Boolean(value && Object.keys(CURRICULUM_RESOURCE_DB_TYPE).includes(value));
}

export function mapCurriculumResourceTypeToDb(
  type: CurriculumResourceType
): string {
  return CURRICULUM_RESOURCE_DB_TYPE[type];
}

export function mapDbResourceTypeToCurriculum(
  value: string
): CurriculumResourceType {
  return DB_TYPE_TO_CURRICULUM_RESOURCE[value] ?? "textbook";
}

export type CurriculumResource = {
  id: string;
  country: CountryCode;
  grade: SchoolGrade;
  subject: CurriculumSubject;
  type: CurriculumResourceType;
  title: string;
  publisher?: string;
  year?: number;
  sourceUrl?: string;
  license?: string;
  fileSizeBytes?: number;
  storagePath?: string;
  language?: string;
  description?: string;
  metadata?: Record<string, unknown>;
};

export const DEFAULT_COUNTRY: CountryCode = "TW";

export const DEFAULT_CURRICULUM_RESOURCE: CurriculumResource = {
  id: "template-tw-g1-chinese-textbook",
  country: "TW",
  grade: "G1",
  subject: "chinese",
  type: "textbook",
  title: "國小一年級國語教材（示範）",
  publisher: "教育部國教署",
  year: 2024,
  sourceUrl: "",
  license: "請依原始授權使用",
  fileSizeBytes: 0,
  description: "這是一個教材資料模型示範，實際教材應依授權來源補齊。",
};

export function getSubjectsForCountry(country: CountryCode): CurriculumSubject[] {
  return SUBJECTS_BY_COUNTRY[country] ?? TAIWAN_CORE_SUBJECTS;
}

export function normalizeCurriculumResourceRow(
  row: Record<string, unknown>
): CurriculumResource {
  return {
    id: String(row.id),
    country: String(row.country_code) as CountryCode,
    grade: String(row.grade) as SchoolGrade,
    subject: String(row.subject) as CurriculumSubject,
    type: mapDbResourceTypeToCurriculum(String(row.resource_type)),
    title: String(row.title),
    publisher: row.publisher ? String(row.publisher) : undefined,
    year: row.year ? Number(row.year) : undefined,
    sourceUrl: row.source_url ? String(row.source_url) : undefined,
    license: row.license ? String(row.license) : undefined,
    fileSizeBytes: row.file_size_bytes ? Number(row.file_size_bytes) : undefined,
    storagePath: row.storage_path ? String(row.storage_path) : undefined,
    language: row.language ? String(row.language) : undefined,
    description: row.description ? String(row.description) : undefined,
    metadata:
      typeof row.metadata === "object" && row.metadata !== null
        ? (row.metadata as Record<string, unknown>)
        : {},
  };
}

export function isPublicCurriculumPath(pathname: string): boolean {
  return pathname === "/forgot" || pathname === "/forgt";
}
