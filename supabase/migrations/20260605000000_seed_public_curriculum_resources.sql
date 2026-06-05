-- Seed a starter set of public / open-licensed curriculum resources (Taiwan).
-- Sources are free-to-access public platforms; licenses noted per row.
-- Safe to re-run: conflicts on the unique (country_code, grade, subject, resource_type, title) index are ignored.

insert into public.curriculum_resources
  (country_code, grade, subject, resource_type, title, publisher, year, source_url, license, language, description)
values
('TW','G7','math','reference','均一教育平台｜國中數學','均一平台教育基金會',2024,'https://www.junyiacademy.org/cooc-jun-math','免費資源（須註冊），著作權屬原平台','zh-TW','國中數學影片、習題與講義，對應 108 課綱。'),
('TW','G9','math','reference','可汗學院（中文）｜數學','Khan Academy',2024,'https://zh.khanacademy.org/','CC BY-NC-SA 3.0','zh-TW','免費數學課程影片與互動練習，含即時回饋。'),
('TW','G10','math','reference','PhET 互動模擬｜數學與統計','PhET, University of Colorado Boulder',2024,'https://phet.colorado.edu/zh_TW/simulations/filter?subjects=math-and-statistics&type=html','CC BY 4.0','zh-TW','數學與統計互動模擬教學。'),
('TW','G7','english','reference','Cool English 酷英｜英語線上學習','教育部國教署 / 臺師大',2024,'https://www.coolenglish.edu.tw/','免費資源，著作權屬原平台','zh-TW','國中小到高中職聽說讀寫、字彙文法與會考專區。'),
('TW','G8','english','reference','可汗學院（中文）｜文法與英語','Khan Academy',2024,'https://zh.khanacademy.org/','CC BY-NC-SA 3.0','zh-TW','英語文法與閱讀課程。'),
('TW','G9','english','lesson_notes','臺北酷課雲｜英語線上課程','臺北市政府教育局',2024,'https://learning.cooc.tp.edu.tw/coocLearning/','免費資源，著作權屬原平台','zh-TW','免登入即可觀看的英語教學影片。'),
('TW','G7','chinese','lesson_notes','臺北酷課雲｜國語文線上課程','臺北市政府教育局',2024,'https://learning.cooc.tp.edu.tw/coocLearning/','免費資源，著作權屬原平台','zh-TW','國語文教學影片。'),
('TW','G8','chinese','reference','均一教育平台｜國中國語文','均一平台教育基金會',2024,'https://www.junyiacademy.org/junyi-chinese/jun-c','免費資源（須註冊），著作權屬原平台','zh-TW','國語文影片與習題。'),
('TW','G10','chinese','textbook','維基教科書｜國文／中文','Wikibooks 維基教科書',2024,'https://zh.wikibooks.org/','CC BY-SA 4.0','zh-TW','開放授權的中文教材與閱讀資源。'),
('TW','G10','physics','reference','PhET 互動模擬｜物理','PhET, University of Colorado Boulder',2024,'https://phet.colorado.edu/zh_TW/simulations/filter?subjects=physics&type=html','CC BY 4.0','zh-TW','力學、電磁、光學等物理互動模擬。'),
('TW','G11','physics','reference','可汗學院（中文）｜物理','Khan Academy',2024,'https://zh.khanacademy.org/','CC BY-NC-SA 3.0','zh-TW','物理課程影片與練習。'),
('TW','G11','physics','lesson_notes','臺北酷課雲｜物理線上課程','臺北市政府教育局',2024,'https://learning.cooc.tp.edu.tw/coocLearning/','免費資源，著作權屬原平台','zh-TW','物理教學影片。'),
('TW','G10','chemistry','reference','PhET 互動模擬｜化學','PhET, University of Colorado Boulder',2024,'https://phet.colorado.edu/zh_TW/simulations/filter?subjects=chemistry&type=html','CC BY 4.0','zh-TW','化學反應、平衡與週期表互動模擬。'),
('TW','G11','chemistry','reference','可汗學院（中文）｜化學','Khan Academy',2024,'https://zh.khanacademy.org/','CC BY-NC-SA 3.0','zh-TW','化學課程影片與練習。'),
('TW','G11','chemistry','lesson_notes','臺北酷課雲｜化學線上課程','臺北市政府教育局',2024,'https://learning.cooc.tp.edu.tw/coocLearning/','免費資源，著作權屬原平台','zh-TW','化學教學影片。'),
('TW','G9','biology','reference','PhET 互動模擬｜生物','PhET, University of Colorado Boulder',2024,'https://phet.colorado.edu/zh_TW/simulations/filter?subjects=biology&type=html','CC BY 4.0','zh-TW','生物相關互動模擬教學。'),
('TW','G10','biology','reference','可汗學院（中文）｜生物','Khan Academy',2024,'https://zh.khanacademy.org/','CC BY-NC-SA 3.0','zh-TW','生物課程影片與練習。'),
('TW','G10','biology','lesson_notes','臺北酷課雲｜生物線上課程','臺北市政府教育局',2024,'https://learning.cooc.tp.edu.tw/coocLearning/','免費資源，著作權屬原平台','zh-TW','生物教學影片。'),
('TW','G10','earth_science','reference','PhET 互動模擬｜地球與太空','PhET, University of Colorado Boulder',2024,'https://phet.colorado.edu/zh_TW/simulations/filter?subjects=earth-and-space&type=html','CC BY 4.0','zh-TW','地球科學與天文互動模擬。'),
('TW','G10','earth_science','lesson_notes','臺北酷課雲｜地球科學線上課程','臺北市政府教育局',2024,'https://learning.cooc.tp.edu.tw/coocLearning/','免費資源，著作權屬原平台','zh-TW','地球科學教學影片。'),
('TW','G9','earth_science','reference','均一教育平台｜自然科學','均一平台教育基金會',2024,'https://www.junyiacademy.org/','免費資源（須註冊），著作權屬原平台','zh-TW','自然科學（含地科）影片與習題。'),
('TW','G8','history','lesson_notes','臺北酷課雲｜歷史線上課程','臺北市政府教育局',2024,'https://learning.cooc.tp.edu.tw/coocLearning/','免費資源，著作權屬原平台','zh-TW','歷史教學影片。'),
('TW','G7','history','reference','均一教育平台｜社會','均一平台教育基金會',2024,'https://www.junyiacademy.org/junyi-society','免費資源（須註冊），著作權屬原平台','zh-TW','社會（含歷史）影片與習題。'),
('TW','G10','history','textbook','維基教科書｜歷史','Wikibooks 維基教科書',2024,'https://zh.wikibooks.org/','CC BY-SA 4.0','zh-TW','開放授權的歷史教材。'),
('TW','G7','geography','reference','均一教育平台｜地理','均一平台教育基金會',2024,'https://www.junyiacademy.org/h-ge-j','免費資源（須註冊），著作權屬原平台','zh-TW','地理影片與習題。'),
('TW','G8','geography','lesson_notes','臺北酷課雲｜地理線上課程','臺北市政府教育局',2024,'https://learning.cooc.tp.edu.tw/coocLearning/','免費資源，著作權屬原平台','zh-TW','地理教學影片。'),
('TW','G10','geography','textbook','維基教科書｜地理','Wikibooks 維基教科書',2024,'https://zh.wikibooks.org/','CC BY-SA 4.0','zh-TW','開放授權的地理教材。'),
('TW','G8','civics','lesson_notes','臺北酷課雲｜公民線上課程','臺北市政府教育局',2024,'https://learning.cooc.tp.edu.tw/coocLearning/','免費資源，著作權屬原平台','zh-TW','公民與社會教學影片。'),
('TW','G9','civics','reference','均一教育平台｜社會（公民）','均一平台教育基金會',2024,'https://www.junyiacademy.org/junyi-society','免費資源（須註冊），著作權屬原平台','zh-TW','公民與社會影片與習題。'),
('TW','G11','civics','textbook','維基教科書｜公民與社會','Wikibooks 維基教科書',2024,'https://zh.wikibooks.org/','CC BY-SA 4.0','zh-TW','開放授權的公民與社會教材。')
on conflict (country_code, grade, subject, resource_type, title) do nothing;
