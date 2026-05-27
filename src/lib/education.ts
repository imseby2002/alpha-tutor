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
  G1: "國小一年級",
  G2: "國小二年級",
  G3: "國小三年級",
  G4: "國小四年級",
  G5: "國小五年級",
  G6: "國小六年級",
  G7: "國中一年級",
  G8: "國中二年級",
  G9: "國中三年級",
  G10: "高中一年級",
  G11: "高中二年級",
  G12: "高中三年級",
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

