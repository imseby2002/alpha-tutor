import type { SchoolGrade, Subject } from "@/lib/education";

export type QuizQuestion = {
  text: string;
  options: string[];
  correct: number;
  difficulty: "Medium" | "Hard";
};

export type LearningScenario = {
  diagnostic: {
    title: string;
    questions: [QuizQuestion, QuizQuestion];
  };
  teaching: {
    topic: string;
    remedialTopic: string;
  };
  adaptive: {
    questions: QuizQuestion[];
  };
};

type GradeBand = "elementary" | "junior" | "senior";

function gradeBand(grade: SchoolGrade): GradeBand {
  const year = Number.parseInt(grade.slice(1), 10);
  if (year <= 6) return "elementary";
  if (year <= 9) return "junior";
  return "senior";
}

function q(
  text: string,
  options: string[],
  correct: number,
  difficulty: "Medium" | "Hard" = "Medium"
): QuizQuestion {
  return { text, options, correct, difficulty };
}

const MATH_SCENARIOS: Record<SchoolGrade, LearningScenario> = {
  G1: {
    diagnostic: {
      title: "10 以內加法",
      questions: [
        q("3 + 4 = ?", ["6", "7", "8", "9"], 1),
        q("5 + 2 = ?", ["6", "7", "8", "9"], 1),
      ],
    },
    teaching: { topic: "湊十法與心算", remedialTopic: "用數線理解加法" },
    adaptive: { questions: [q("6 + 3 = ?", ["8", "9", "10", "11"], 1), q("7 + 1 = ?", ["6", "7", "8", "9"], 2)] },
  },
  G2: {
    diagnostic: {
      title: "20 以內減法",
      questions: [
        q("12 - 5 = ?", ["6", "7", "8", "9"], 1),
        q("15 - 8 = ?", ["5", "6", "7", "8"], 2),
      ],
    },
    teaching: { topic: "借位減法概念", remedialTopic: "分解減數（湊整）" },
    adaptive: { questions: [q("18 - 9 = ?", ["7", "8", "9", "10"], 2), q("14 - 6 = ?", ["6", "7", "8", "9"], 2)] },
  },
  G3: {
    diagnostic: {
      title: "乘法口诀",
      questions: [
        q("7 × 8 = ?", ["48", "54", "56", "63"], 2),
        q("9 × 6 = ?", ["45", "54", "56", "63"], 1),
      ],
    },
    teaching: { topic: "乘法分配律入門", remedialTopic: "用圖形理解乘法" },
    adaptive: { questions: [q("6 × 7 = ?", ["36", "42", "48", "49"], 1), q("8 × 9 = ?", ["63", "64", "72", "81"], 2)] },
  },
  G4: {
    diagnostic: {
      title: "除法與餘數",
      questions: [
        q("47 ÷ 5 的商與餘數？", ["商 8 餘 7", "商 9 餘 2", "商 9 餘 3", "商 10 餘 2"], 1),
        q("63 ÷ 7 = ?", ["7", "8", "9", "10"], 2),
      ],
    },
    teaching: { topic: "除法直式與驗算", remedialTopic: "餘數的意義" },
    adaptive: { questions: [q("56 ÷ 8 = ?", ["6", "7", "8", "9"], 1), q("85 ÷ 9 的餘數？", ["4", "5", "6", "7"], 0)] },
  },
  G5: {
    diagnostic: {
      title: "分數加減",
      questions: [
        q("1/4 + 1/4 = ?", ["1/8", "1/2", "2/4", "1/4"], 1),
        q("3/5 - 1/5 = ?", ["1/5", "2/5", "3/5", "4/5"], 1),
      ],
    },
    teaching: { topic: "通分與約分", remedialTopic: "分數在數線上的位置" },
    adaptive: { questions: [q("2/3 + 1/3 = ?", ["1/3", "2/3", "1", "3/3"], 2), q("5/6 - 1/6 = ?", ["1/3", "2/3", "4/6", "5/6"], 1)] },
  },
  G6: {
    diagnostic: {
      title: "比與比例",
      questions: [
        q("比例 2:3，若前項是 8，後項是？", ["10", "12", "14", "16"], 1),
        q("0.5 化成分數？", ["1/4", "1/2", "2/3", "3/4"], 1),
      ],
    },
    teaching: { topic: "比例式應用題", remedialTopic: "小數與分數換算" },
    adaptive: { questions: [q("3:4 = 9:?", ["10", "11", "12", "13"], 2), q("25% 等於？", ["1/2", "1/3", "1/4", "1/5"], 2)] },
  },
  G7: {
    diagnostic: {
      title: "一次方程式",
      questions: [
        q("解 x：x + 9 = 15", ["x = 4", "x = 5", "x = 6", "x = 7"], 2),
        q("解 x：3x + 7 = 25", ["x = 4", "x = 6", "x = 7", "x = 9"], 1),
      ],
    },
    teaching: { topic: "移項與同類項整理", remedialTopic: "等式兩邊同加同減" },
    adaptive: { questions: [q("解 x：5x - 10 = 15", ["x = 1", "x = 3", "x = 5", "x = 7"], 2), q("解 x：2(x + 4) = 18", ["x = 3", "x = 5", "x = 7", "x = 9"], 1)] },
  },
  G8: {
    diagnostic: {
      title: "聯立方程式",
      questions: [
        q("解聯立：x + y = 10，x - y = 2", ["(6,4)", "(5,5)", "(4,6)", "(7,3)"], 0),
        q("解 x：4x - 3 = 13", ["x = 2", "x = 3", "x = 4", "x = 5"], 2),
      ],
    },
    teaching: { topic: "代入消去法", remedialTopic: "一方程式圖像直覺" },
    adaptive: { questions: [q("2x + y = 8，y = 2，x = ?", ["2", "3", "4", "5"], 1), q("3x - 2y = 4，x = 2，y = ?", ["0", "1", "2", "3"], 1)] },
  },
  G9: {
    diagnostic: {
      title: "二次方程式",
      questions: [
        q("解 x：x² - 5x + 6 = 0", ["x = 2 或 3", "x = -2 或 -3", "x = 1 或 6", "無實數解"], 0),
        q("展開 (x+2)(x-3) = ?", ["x² - x - 6", "x² + x - 6", "x² - 5x + 6", "x² + 5x - 6"], 0),
      ],
    },
    teaching: { topic: "因式分解與公式", remedialTopic: "配方法與頂點式" },
    adaptive: { questions: [q("求頂點：y = x² - 4x + 3", ["(2,-1)", "(2,1)", "(-2,-1)", "(0,3)"], 0), q("解 x：x² = 9", ["x = 3", "x = ±3", "x = -3", "x = 0"], 1)] },
  },
  G10: {
    diagnostic: {
      title: "指數與對數",
      questions: [
        q("2³ × 2² = ?", ["2⁵", "2⁶", "4⁵", "4⁶"], 0),
        q("log₁₀(100) = ?", ["1", "2", "10", "100"], 1),
      ],
    },
    teaching: { topic: "指數律應用", remedialTopic: "對數與指數互換" },
    adaptive: { questions: [q("√16 = ?", ["2", "4", "8", "16"], 1), q("3⁰ = ?", ["0", "1", "3", "未定義"], 1)] },
  },
  G11: {
    diagnostic: {
      title: "三角函數",
      questions: [
        q("sin 30° = ?", ["1/2", "√2/2", "√3/2", "1"], 0),
        q("直角三角形，對邊 3、斜邊 5，sin θ = ?", ["3/5", "4/5", "5/3", "3/4"], 0),
      ],
    },
    teaching: { topic: "三角比與單位圓", remedialTopic: "特殊角三角值" },
    adaptive: { questions: [q("cos 60° = ?", ["1/2", "√2/2", "√3/2", "0"], 0), q("tan 45° = ?", ["0", "1", "√2", "√3"], 1)] },
  },
  G12: {
    diagnostic: {
      title: "微積分入門",
      questions: [
        q("f(x)=x²，f'(2) = ?", ["2", "4", "6", "8"], 1),
        q("∫₀¹ x dx = ?", ["0", "1/2", "1", "2"], 1),
      ],
    },
    teaching: { topic: "導數幾何意義", remedialTopic: "極限直覺" },
    adaptive: { questions: [q("f(x)=3x，f'(1)=?", ["1", "2", "3", "4"], 2), q("(x²)' = ?", ["x", "2x", "x²", "2"], 1)] },
  },
};

const ENGLISH_BY_BAND: Record<GradeBand, LearningScenario> = {
  elementary: {
    diagnostic: {
      title: "基礎單字",
      questions: [
        q("「蘋果」的英文是？", ["apple", "orange", "banana", "grape"], 0),
        q("選出正確句子：", ["I am happy.", "I is happy.", "I are happy.", "I be happy."], 0),
      ],
    },
    teaching: { topic: "be 動詞 am/is/are", remedialTopic: "主詞人稱對應" },
    adaptive: { questions: [q("「狗」的英文是？", ["cat", "dog", "bird", "fish"], 1), q("She ___ a student.", ["am", "is", "are", "be"], 1)] },
  },
  junior: {
    diagnostic: {
      title: "文法時態",
      questions: [
        q("選出正確句子：", ["He go to school.", "He goes to school.", "He going to school.", "He goed to school."], 1),
        q("Yesterday I ___ to the park.", ["go", "goes", "went", "going"], 2),
      ],
    },
    teaching: { topic: "第三人稱單數與過去式", remedialTopic: "動詞變化表" },
    adaptive: { questions: [q("She ___ apples.", ["like", "likes", "liking", "liked (現在式)"], 1), q("They ___ TV now.", ["watch", "watches", "are watching", "watched"], 2)] },
  },
  senior: {
    diagnostic: {
      title: "閱讀理解",
      questions: [
        q("The word 'benefit' is closest to:", ["harm", "advantage", "delay", "cost"], 1),
        q("選出最合文法的句子：", ["If I was you, I would go.", "If I were you, I would go.", "If I am you, I will go.", "If I be you, I go."], 1),
      ],
    },
    teaching: { topic: "假設語氣與學術字彙", remedialTopic: "上下文猜字義" },
    adaptive: { questions: [q("'Nevertheless' means:", ["因此", "然而", "而且", "因為"], 1), q("He suggested that she ___ early.", ["leave", "leaves", "left", "leaving"], 0)] },
  },
};

const CHINESE_BY_BAND: Record<GradeBand, LearningScenario> = {
  elementary: {
    diagnostic: {
      title: "注音與字詞",
      questions: [
        q("「快樂」的「樂」讀音是？", ["yuè", "lè", "yuě", "lě"], 1),
        q("下列哪個是量詞用法正確？", ["一條魚", "一個魚", "一雙魚", "一張魚"], 0),
      ],
    },
    teaching: { topic: "多音字與量詞", remedialTopic: "注音辨音" },
    adaptive: { questions: [q("「美麗」的近義詞？", ["醜陋", "漂亮", "奇怪", "遙遠"], 1), q("「他跑得很快」的「得」用法？", ["的", "地", "得", "都對"], 2)] },
  },
  junior: {
    diagnostic: {
      title: "成語與修辭",
      questions: [
        q("「一鼓作氣」最接近？", ["慢慢來", "趁勢完成", "反覆嘗試", "先休息"], 1),
        q("「畫蛇添足」的意思是？", ["多此一舉", "精益求精", "半途而廢", "急中生智"], 0),
      ],
    },
    teaching: { topic: "成語語境判讀", remedialTopic: "上下文抓關鍵詞" },
    adaptive: { questions: [q("「按部就班」最接近？", ["急於求成", "循序漸進", "隨心所欲", "半途而廢"], 1), q("下列何者為譬喻？", ["他很高", "他是巨人", "他170公分", "他站著"], 1)] },
  },
  senior: {
    diagnostic: {
      title: "文言文入門",
      questions: [
        q("「學而時習之」的「習」最接近？", ["習慣", "練習、溫習", "學習", "考試"], 1),
        q("「之」在此作何解？", ["的", "他", "去、往", "語氣詞"], 0),
      ],
    },
    teaching: { topic: "文言虛字與句型", remedialTopic: "白話對照閱讀" },
    adaptive: { questions: [q("「吾」指的是？", ["你", "我", "他", "他們"], 1), q("「不以物喜」的「以」？", ["因為", "用、憑", "把", "在"], 1)] },
  },
};

const SCIENCE_BY_BAND: Record<GradeBand, LearningScenario> = {
  elementary: {
    diagnostic: {
      title: "觀察與測量",
      questions: [
        q("下列哪個是固態？", ["水蒸氣", "冰", "水", "雨"], 1),
        q("1 公斤等於多少公克？", ["10", "100", "1000", "10000"], 2),
      ],
    },
    teaching: { topic: "物質三態", remedialTopic: "單位換算" },
    adaptive: { questions: [q("植物進行光合作用需要？", ["陽光", "黑暗", "鹽巴", "石頭"], 0), q("磁鐵能吸引？", ["銅片", "鐵釘", "木棒", "塑膠"], 1)] },
  },
  junior: {
    diagnostic: {
      title: "力與運動",
      questions: [
        q("下列何者描述「慣性」？", ["物體會自己停下", "傾向保持原運動狀態", "一定往下掉", "越重越快"], 1),
        q("施力 10N，移動 2m，作功？", ["5 J", "10 J", "20 J", "40 J"], 2),
      ],
    },
    teaching: { topic: "牛頓運動定律", remedialTopic: "受力圖" },
    adaptive: { questions: [q("急煞時人往前傾主因？", ["重力", "慣性", "摩擦力消失", "空氣阻力"], 1), q("電流單位是？", ["伏特", "安培", "歐姆", "瓦特"], 1)] },
  },
  senior: {
    diagnostic: {
      title: "理化進階",
      questions: [
        q("理想氣體 PV=nRT，溫度升高且體積固定，壓力？", ["變小", "不變", "變大", "無法判斷"], 2),
        q("酸鹼中和反應產物常見？", ["鹽與水", "只有水", "只有鹽", "氫氣"], 0),
      ],
    },
    teaching: { topic: "氣體定律與滴定", remedialTopic: "化學方程式配平" },
    adaptive: { questions: [q("DNA 雙螺旋由何組成？", ["胺基酸", "核苷酸", "脂肪酸", "葡萄糖"], 1), q("電阻 R=10Ω，I=2A，V=?", ["5V", "10V", "20V", "40V"], 2)] },
  },
};

const SOCIAL_BY_BAND: Record<GradeBand, LearningScenario> = {
  elementary: {
    diagnostic: {
      title: "地理常識",
      questions: [
        q("台灣最高峰是？", ["玉山", "阿里山", "雪山", "合歡山"], 0),
        q("下列哪個是直轄市？", ["新竹縣", "台北市", "宜蘭縣", "花蓮縣"], 1),
      ],
    },
    teaching: { topic: "台灣地形與行政區", remedialTopic: "地圖閱讀" },
    adaptive: { questions: [q("赤道附近氣候通常？", ["寒冷", "炎熱多雨", "乾燥少雨", "四季分明"], 1), q("河流由高地往？", ["高地", "低地", "原地", "隨機"], 1)] },
  },
  junior: {
    diagnostic: {
      title: "公民素養",
      questions: [
        q("下列何者屬於「權利」？", ["依法納稅", "受國民教育", "選舉與被選舉", "服兵役"], 2),
        q("三權分立不包括？", ["行政", "立法", "司法", "軍事"], 3),
      ],
    },
    teaching: { topic: "權利義務與政府分工", remedialTopic: "生活案例討論" },
    adaptive: { questions: [q("言論自由屬於？", ["經濟權", "政治權", "社會權", "環境權"], 1), q("法律由哪一機關制定？", ["行政院", "立法院", "司法院", "考試院"], 1)] },
  },
  senior: {
    diagnostic: {
      title: "歷史與國際",
      questions: [
        q("二戰結束年份？", ["1918", "1939", "1945", "1989"], 2),
        q("聯合國主要宗旨包括？", ["發動戰爭", "維護和平", "控制貿易", "統一語言"], 1),
      ],
    },
    teaching: { topic: "近代史與國際組織", remedialTopic: "時間軸整理" },
    adaptive: { questions: [q("全球化常見特徵？", ["完全隔絕", "跨國貿易增加", "無科技", "無人口流動"], 1), q("民主政治核心精神？", ["一人專政", "人民參與", "世襲", "秘密決策"], 1)] },
  },
};

export function getScenario(grade: SchoolGrade, subject: Subject): LearningScenario {
  if (subject === "math") {
    return MATH_SCENARIOS[grade];
  }
  const band = gradeBand(grade);
  if (subject === "english") return ENGLISH_BY_BAND[band];
  if (subject === "chinese") return CHINESE_BY_BAND[band];
  if (subject === "science") return SCIENCE_BY_BAND[band];
  return SOCIAL_BY_BAND[band];
}
