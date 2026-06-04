import type { Subject } from "@/lib/education";

// 不分年級的科目分類：大類（strand）→ 小類（topic）
// 依台灣 12 年國教課綱整理，盡量涵蓋國小到高中的常見單元。

export type TaxonomyTopic = {
  id: string;
  label: string;
};

export type TaxonomyCategory = {
  id: string;
  label: string;
  topics: TaxonomyTopic[];
};

function makeCategory(
  subject: Subject,
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

const SCIENCE: TaxonomyCategory[] = [
  makeCategory("science", "physics", "物理", [
    "測量與單位",
    "力與運動（牛頓運動定律）",
    "功、能量與功率",
    "動量與碰撞",
    "簡諧運動",
    "熱學",
    "波動與聲音",
    "光學（反射與折射）",
    "靜電學",
    "電流與電路",
    "電磁感應",
    "近代物理（量子與原子）",
  ]),
  makeCategory("science", "chemistry", "化學", [
    "物質的組成與分類",
    "原子結構與週期表",
    "化學鍵",
    "化學計量（莫耳）",
    "溶液與濃度",
    "酸、鹼、鹽",
    "氧化還原反應",
    "反應速率",
    "化學平衡",
    "電化學",
    "有機化合物",
  ]),
  makeCategory("science", "biology", "生物", [
    "細胞的構造與功能",
    "生物分子與酵素",
    "光合作用與呼吸作用",
    "遺傳與基因",
    "生殖與發育",
    "演化與生物分類",
    "人體生理（消化、循環、神經）",
    "免疫與內分泌",
    "植物的構造與功能",
    "生態系與能量流動",
    "生物多樣性與保育",
  ]),
  makeCategory("science", "earth", "地球科學", [
    "地球的構造與板塊",
    "岩石與礦物",
    "地震與火山",
    "大氣與天氣",
    "氣候與全球變遷",
    "海洋",
    "天文（太陽系與星體）",
    "宇宙與星系",
  ]),
];

const SOCIAL: TaxonomyCategory[] = [
  makeCategory("social", "history", "歷史", [
    "史前與文明起源",
    "台灣史",
    "中國史（朝代演變）",
    "世界古文明",
    "中古與近代世界史",
    "兩次世界大戰與冷戰",
    "歷史探究方法",
  ]),
  makeCategory("social", "geography", "地理", [
    "地圖與 GIS 技能",
    "地形",
    "氣候",
    "水文與土壤",
    "人口與聚落",
    "產業與經濟活動",
    "區域地理（台灣與世界）",
    "環境議題與永續發展",
  ]),
  makeCategory("social", "civics", "公民與社會", [
    "自我、家庭與社會化",
    "社會群體與多元文化",
    "政府與政治制度",
    "民主與人權",
    "法律與權利義務",
    "經濟與市場",
    "全球化與國際關係",
  ]),
];

export const SUBJECT_TAXONOMY: Record<Subject, TaxonomyCategory[]> = {
  math: MATH,
  english: ENGLISH,
  chinese: CHINESE,
  science: SCIENCE,
  social: SOCIAL,
};

export function getTaxonomy(subject: Subject): TaxonomyCategory[] {
  return SUBJECT_TAXONOMY[subject] ?? [];
}
