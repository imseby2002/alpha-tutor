import type { CurriculumSubject } from "@/lib/curriculum";

// 不分年級的科目分類：科目 → 大類（strand）→ 小類（topic）
// 「自然」與「社會」拆成各自獨立的科目，不再作為單一品項。
// 依台灣 12 年國教課綱（108 課綱）整理，涵蓋國小到高中常見單元。

export type TaxonomySubject =
  | "math"
  | "english"
  | "chinese"
  | "physics"
  | "chemistry"
  | "biology"
  | "earth"
  | "history"
  | "geography"
  | "civics";

export type TaxonomyTopic = {
  id: string;
  label: string;
};

export type TaxonomyCategory = {
  id: string;
  label: string;
  topics: TaxonomyTopic[];
};

export const TAXONOMY_SUBJECTS: TaxonomySubject[] = [
  "math",
  "english",
  "chinese",
  "physics",
  "chemistry",
  "biology",
  "earth",
  "history",
  "geography",
  "civics",
];

export const TAXONOMY_SUBJECT_LABEL: Record<TaxonomySubject, string> = {
  math: "數學",
  english: "英文",
  chinese: "國文",
  physics: "物理",
  chemistry: "化學",
  biology: "生物",
  earth: "地球科學",
  history: "歷史",
  geography: "地理",
  civics: "公民",
};

// 對應到課程資源（curriculum_resources）篩選用的科目代碼
export const TAXONOMY_SUBJECT_TO_CURRICULUM: Record<TaxonomySubject, CurriculumSubject> = {
  math: "math",
  english: "english",
  chinese: "chinese",
  physics: "physics",
  chemistry: "chemistry",
  biology: "biology",
  earth: "earth_science",
  history: "history",
  geography: "geography",
  civics: "civics",
};

function makeCategory(
  subject: TaxonomySubject,
  id: string,
  label: string,
  topics: string[]
): TaxonomyCategory {
  return {
    id: `${subject}-${id}`,
    label,
    topics: topics.map((t, i) => ({ id: `${subject}-${id}-${i}`, label: t })),
  };
}

const MATH: TaxonomyCategory[] = [
  makeCategory("math", "number", "數與量", [
    "整數與因數倍數",
    "分數",
    "小數",
    "負數與絕對值",
    "比與比例",
    "百分率",
    "指數與科學記號",
    "根號與無理數",
    "對數",
    "複數",
  ]),
  makeCategory("math", "algebra", "代數", [
    "一元一次方程式",
    "二元一次聯立方程式",
    "一元一次不等式",
    "多項式運算",
    "乘法公式與因式分解",
    "一元二次方程式",
    "二次不等式",
    "分式與根式運算",
    "數列",
    "級數與數學歸納法",
  ]),
  makeCategory("math", "function", "函數", [
    "坐標平面",
    "線性函數（一次函數）",
    "二次函數與拋物線",
    "指數函數",
    "對數函數",
    "三角函數圖形",
    "函數的合成與反函數",
  ]),
  makeCategory("math", "geometry", "幾何", [
    "基本圖形與角",
    "三角形性質",
    "全等與相似",
    "畢氏定理",
    "四邊形與多邊形",
    "圓的性質",
    "尺規作圖",
    "面積與體積",
    "坐標幾何（直線與圓）",
    "空間中的直線與平面",
  ]),
  makeCategory("math", "trig", "三角", [
    "銳角三角比",
    "廣義角與弧度",
    "正弦定理與餘弦定理",
    "和差角公式",
    "三角測量應用",
  ]),
  makeCategory("math", "vector", "向量與線性代數", [
    "平面向量",
    "空間向量",
    "內積與外積",
    "行列式",
    "矩陣運算",
    "線性方程組",
  ]),
  makeCategory("math", "prob", "機率與統計", [
    "資料整理與統計圖表",
    "平均數、中位數與眾數",
    "百分位數與四分位數",
    "標準差與變異數",
    "集合與計數原理",
    "排列",
    "組合",
    "機率",
    "條件機率",
    "期望值",
  ]),
  makeCategory("math", "calculus", "微積分", [
    "數列與函數的極限",
    "連續",
    "導數與微分",
    "微分的應用（極值）",
    "不定積分",
    "定積分與面積",
  ]),
];

const ENGLISH: TaxonomyCategory[] = [
  makeCategory("english", "vocab", "字彙 Vocabulary", [
    "基礎 1200 字",
    "進階主題字彙",
    "字根、字首、字尾",
    "片語動詞",
    "同義詞與反義詞",
    "搭配詞 Collocation",
  ]),
  makeCategory("english", "grammar", "文法 Grammar", [
    "詞性與句子結構",
    "現在式與過去式",
    "未來式",
    "完成式",
    "進行式",
    "被動語態",
    "不定詞與動名詞",
    "形容詞與副詞比較級",
    "關係子句",
    "名詞子句",
    "副詞子句",
    "假設語氣",
    "介系詞",
    "連接詞",
  ]),
  makeCategory("english", "reading", "閱讀 Reading", [
    "看圖辨義",
    "主旨大意",
    "細節理解",
    "推論與態度",
    "克漏字",
    "文意選填",
    "長篇文章閱讀",
    "圖表判讀",
  ]),
  makeCategory("english", "listening", "聽力 Listening", [
    "單句聽解",
    "對話理解",
    "短文聽解",
    "看圖回答",
  ]),
  makeCategory("english", "writing", "寫作 Writing", [
    "句型重組與翻譯",
    "段落寫作",
    "看圖寫作",
    "主題作文",
    "書信與電子郵件",
  ]),
  makeCategory("english", "speaking", "口說 Speaking", [
    "發音與語調",
    "日常會話",
    "看圖敘述",
    "口頭簡報",
  ]),
];

const CHINESE: TaxonomyCategory[] = [
  makeCategory("chinese", "language", "字詞與語文常識", [
    "注音與字音字形",
    "部首與筆順",
    "詞語辨析",
    "成語",
    "六書與造字原則",
    "標點符號",
    "語法（詞性與句型）",
  ]),
  makeCategory("chinese", "rhetoric", "修辭與閱讀策略", [
    "譬喻、轉化、誇飾",
    "排比、對偶、映襯",
    "設問、引用、雙關",
    "文章結構分析",
    "段落大意與主旨",
  ]),
  makeCategory("chinese", "modern", "現代文學", [
    "記敘文",
    "抒情文",
    "說明文",
    "議論文",
    "現代詩",
    "現代散文",
    "現代小說",
  ]),
  makeCategory("chinese", "classical", "文言文", [
    "文言虛字與句讀",
    "先秦諸子（論語、孟子）",
    "史傳散文（左傳、史記）",
    "唐宋古文（韓愈、柳宗元、蘇軾）",
    "明清小品",
    "寓言與筆記",
  ]),
  makeCategory("chinese", "poetry", "古典詩詞曲", [
    "詩經與樂府",
    "唐詩（近體詩）",
    "宋詞",
    "元曲",
    "格律與押韻",
  ]),
  makeCategory("chinese", "writing", "寫作", [
    "記敘文寫作",
    "抒情文寫作",
    "議論文寫作",
    "應用文（書信、便條、啟事）",
    "看圖與引導寫作",
  ]),
  makeCategory("chinese", "knowledge", "國學與文學常識", [
    "重要作家與作品",
    "文體流變",
    "經史子集",
    "文化基本教材",
  ]),
];

const PHYSICS: TaxonomyCategory[] = [
  makeCategory("physics", "mechanics", "力學", [
    "測量與單位",
    "速度與加速度",
    "直線運動",
    "牛頓運動定律",
    "力的合成與分解",
    "摩擦力",
    "拋體運動",
    "圓周運動",
    "萬有引力與重力",
  ]),
  makeCategory("physics", "energy", "功與能量", [
    "功與功率",
    "動能與位能",
    "力學能守恆",
    "動量與衝量",
    "碰撞",
  ]),
  makeCategory("physics", "thermal", "熱學", [
    "溫度與熱量",
    "比熱與潛熱",
    "熱膨脹",
    "氣體動力論",
    "熱力學定律",
  ]),
  makeCategory("physics", "wave", "波動與聲音", [
    "振動與簡諧運動",
    "波的性質",
    "聲波與共振",
    "都卜勒效應",
  ]),
  makeCategory("physics", "optics", "光學", [
    "光的反射",
    "平面鏡與球面鏡",
    "光的折射",
    "透鏡成像",
    "光的干涉與繞射",
    "色散與光譜",
  ]),
  makeCategory("physics", "em", "電磁學", [
    "靜電與庫侖定律",
    "電場與電位",
    "電容",
    "電流與電阻",
    "歐姆定律與電路",
    "電功率",
    "磁場與磁力",
    "電磁感應",
    "交流電",
  ]),
  makeCategory("physics", "modern", "近代物理", [
    "光電效應",
    "原子模型",
    "量子論初步",
    "原子核與放射性",
    "相對論初步",
  ]),
];

const CHEMISTRY: TaxonomyCategory[] = [
  makeCategory("chemistry", "matter", "物質與分類", [
    "物質的三態與變化",
    "純物質與混合物",
    "分離技術",
    "物理變化與化學變化",
  ]),
  makeCategory("chemistry", "atom", "原子與週期表", [
    "原子結構",
    "電子組態",
    "元素週期表",
    "同位素",
  ]),
  makeCategory("chemistry", "bond", "化學鍵與結構", [
    "離子鍵",
    "共價鍵",
    "金屬鍵",
    "分子形狀與極性",
    "分子間作用力",
  ]),
  makeCategory("chemistry", "stoich", "化學計量", [
    "莫耳概念",
    "化學式與化學方程式",
    "反應的質量關係",
    "溶液濃度",
    "氣體定律",
  ]),
  makeCategory("chemistry", "reaction", "反應速率與平衡", [
    "反應速率",
    "影響速率的因素",
    "化學平衡",
    "勒沙特列原理",
  ]),
  makeCategory("chemistry", "acidbase", "酸鹼鹽", [
    "酸鹼的定義",
    "pH 值與指示劑",
    "中和反應",
    "鹽類",
    "緩衝溶液",
  ]),
  makeCategory("chemistry", "redox", "氧化還原與電化學", [
    "氧化數",
    "氧化還原反應",
    "電池（化學電池）",
    "電解",
  ]),
  makeCategory("chemistry", "organic", "有機化學", [
    "碳氫化合物（烷烯炔）",
    "官能基",
    "醇、醛、酮、酸、酯",
    "聚合物",
    "生物有機分子",
  ]),
];

const BIOLOGY: TaxonomyCategory[] = [
  makeCategory("biology", "cell", "生命的組成", [
    "細胞構造",
    "細胞膜與物質運輸",
    "生物分子（醣、脂質、蛋白質、核酸）",
    "酵素",
  ]),
  makeCategory("biology", "metabolism", "能量與代謝", [
    "光合作用",
    "呼吸作用",
    "營養與消化",
  ]),
  makeCategory("biology", "homeostasis", "恆定與運輸", [
    "循環系統",
    "呼吸系統",
    "排泄與滲透調節",
    "神經系統",
    "內分泌系統",
    "免疫系統",
  ]),
  makeCategory("biology", "genetics", "生殖與遺傳", [
    "細胞分裂（有絲、減數）",
    "有性與無性生殖",
    "孟德爾遺傳",
    "染色體與性別決定",
    "DNA 與基因表現",
    "生物技術與基因工程",
  ]),
  makeCategory("biology", "evolution", "演化與多樣性", [
    "天擇與演化證據",
    "物種形成",
    "生物分類與命名",
    "五界與三域系統",
  ]),
  makeCategory("biology", "plant", "植物的構造與功能", [
    "根、莖、葉",
    "水分與養分運輸",
    "開花與繁殖",
    "植物激素與感應",
  ]),
  makeCategory("biology", "ecology", "生態學", [
    "族群與群落",
    "生態系結構",
    "能量流與食物鏈",
    "物質循環",
    "生物多樣性與保育",
  ]),
];

const EARTH: TaxonomyCategory[] = [
  makeCategory("earth", "solid", "固體地球", [
    "地球的構造",
    "板塊運動",
    "岩石與礦物",
    "地震",
    "火山",
    "風化、侵蝕與沉積",
  ]),
  makeCategory("earth", "atmosphere", "大氣", [
    "大氣組成與結構",
    "氣溫與氣壓",
    "風與氣團",
    "鋒面與天氣系統",
    "雲與降水",
    "氣象觀測與預報",
  ]),
  makeCategory("earth", "ocean", "水圈與海洋", [
    "水循環",
    "海水的性質",
    "洋流",
    "潮汐與波浪",
  ]),
  makeCategory("earth", "climate", "氣候與環境變遷", [
    "氣候帶與成因",
    "聖嬰與反聖嬰現象",
    "全球暖化與溫室效應",
    "自然災害與防治",
  ]),
  makeCategory("earth", "astronomy", "天文", [
    "地球運動與四季",
    "月相、日食與月食",
    "太陽系",
    "恆星與星系",
    "宇宙的起源與演化",
  ]),
];

const HISTORY: TaxonomyCategory[] = [
  makeCategory("history", "method", "史學方法", [
    "史料與證據",
    "歷史分期",
    "歷史解釋與多元觀點",
  ]),
  makeCategory("history", "taiwan", "台灣史", [
    "史前文化與原住民族",
    "荷西與明鄭時期",
    "清領時期",
    "日治時期",
    "戰後台灣與民主化",
  ]),
  makeCategory("history", "china", "中國史", [
    "先秦（夏商周）",
    "秦漢",
    "魏晉南北朝",
    "隋唐",
    "宋元",
    "明清",
    "近現代中國",
  ]),
  makeCategory("history", "world", "世界史", [
    "上古文明（兩河、埃及）",
    "希臘與羅馬",
    "中古歐洲與伊斯蘭",
    "文藝復興與宗教改革",
    "大航海與帝國主義",
    "兩次世界大戰",
    "冷戰與當代世界",
  ]),
];

const GEOGRAPHY: TaxonomyCategory[] = [
  makeCategory("geography", "skill", "地理技能", [
    "地圖判讀",
    "比例尺與方位",
    "地理資訊系統 GIS",
    "遙測與航照",
  ]),
  makeCategory("geography", "physical", "自然地理", [
    "地形",
    "氣候",
    "水文",
    "土壤與生物分布",
  ]),
  makeCategory("geography", "human", "人文地理", [
    "人口",
    "聚落與都市",
    "第一級產業（農林漁牧）",
    "第二級產業（工業）",
    "第三級產業（服務業）",
    "交通與運輸",
  ]),
  makeCategory("geography", "region", "區域地理", [
    "台灣地理",
    "中國地理",
    "亞洲與世界區域",
  ]),
  makeCategory("geography", "issue", "應用與議題", [
    "環境保育",
    "資源與永續發展",
    "自然災害",
    "全球化與區域發展",
  ]),
];

const CIVICS: TaxonomyCategory[] = [
  makeCategory("civics", "self", "自我與社會", [
    "個人與社會化",
    "家庭與婚姻",
    "社會團體與組織",
    "多元文化與族群",
    "性別與平權",
  ]),
  makeCategory("civics", "politics", "政治與民主", [
    "國家與政府",
    "憲法與政府體制",
    "民主政治",
    "政黨與選舉",
    "人權保障",
  ]),
  makeCategory("civics", "law", "法律", [
    "法律的基本概念",
    "權利與義務",
    "民法概要",
    "刑法概要",
    "行政與救濟",
  ]),
  makeCategory("civics", "economy", "經濟", [
    "市場與供需",
    "價格機能",
    "貨幣與金融",
    "政府的經濟角色",
    "國際貿易",
  ]),
  makeCategory("civics", "global", "全球關聯", [
    "全球化",
    "國際組織與關係",
    "永續發展",
    "公民參與",
  ]),
];

export const SUBJECT_TAXONOMY: Record<TaxonomySubject, TaxonomyCategory[]> = {
  math: MATH,
  english: ENGLISH,
  chinese: CHINESE,
  physics: PHYSICS,
  chemistry: CHEMISTRY,
  biology: BIOLOGY,
  earth: EARTH,
  history: HISTORY,
  geography: GEOGRAPHY,
  civics: CIVICS,
};

export function getTaxonomy(subject: TaxonomySubject): TaxonomyCategory[] {
  return SUBJECT_TAXONOMY[subject] ?? [];
}
