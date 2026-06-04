export type SchoolGrade =
  | "G1"
  | "G2"
  | "G3"
  | "G4"
  | "G5"
  | "G6"
  | "G7"
  | "G8"
  | "G9"
  | "G10"
  | "G11"
  | "G12";

export type Subject = "math" | "english" | "chinese" | "science" | "social";

export const GRADE_LABEL: Record<SchoolGrade, string> = {
  G1: "1年級",
  G2: "2年級",
  G3: "3年級",
  G4: "4年級",
  G5: "5年級",
  G6: "6年級",
  G7: "7（初一）",
  G8: "8（初二）",
  G9: "9（初三）",
  G10: "10（高一）",
  G11: "11（高二）",
  G12: "12（高三）",
};

export const SUBJECT_LABEL: Record<Subject, string> = {
  math: "數學",
  english: "英文",
  chinese: "國文",
  science: "自然",
  social: "社會",
};

export const ALL_GRADES: SchoolGrade[] = [
  "G1",
  "G2",
  "G3",
  "G4",
  "G5",
  "G6",
  "G7",
  "G8",
  "G9",
  "G10",
  "G11",
  "G12",
];

export const ALL_SUBJECTS: Subject[] = [
  "math",
  "english",
  "chinese",
  "science",
  "social",
];

