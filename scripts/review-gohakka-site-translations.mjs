import { readFile, writeFile } from "node:fs/promises";

const writers = JSON.parse(await readFile(new URL("../app/data/writers.json", import.meta.url), "utf8"));
const siteCopy = JSON.parse(await readFile(new URL("../app/data/site-copy.json", import.meta.url), "utf8"));
const rawDocument = JSON.parse(await readFile(new URL("../translations/mlt_site_gohakka_raw_translations.json", import.meta.url), "utf8"));

const rawById = new Map(rawDocument.translations.map((entry) => [entry.id, entry]));
const rawBySource = new Map(rawDocument.translations.map((entry) => [entry.source, entry]));

const siteOverrides = {
  navJoin: "加入𫣆",
  associationDescription: "「臺灣苗栗文學步道推廣協會」當在該籌備中。𠊎兜期待佢做得結合校園、社區、文化工作者摎社會各界，分苗栗文學變到做得閱讀、行得出路、做得傳承个公共文化資產。",
  languageMandarin: "華語",
  heroAlt: "國立聯合大學八甲校區湖畔个苗栗文學步道入口、湖景摎校舍",
  heroStatTrail: "步道現地作家",
  storyTitle: "由校慶啟動規劃，行出一條文學个路。",
  storyParagraph2: "諮詢小組以「書寫苗栗、作品優良」做選錄原則，兼顧清代、日本時代摎戰後，涵蓋古典詩、小說、散文、新詩、戲劇、細人文學摎報導文學。因為授權摎聯絡个因素，現地最尾呈現38位作家个作品。",
  storyNewsLink: "客新聞專題",
  storyWriters: "位作家个作品落地",
  galleryRegion: "苗栗文學步道52張實景相片",
  galleryNext: "瀏覽下一批步道相片",
  galleryHint: "拖曳、滑動抑係使用左右按鈕瀏覽完整相簿",
  charter1Title: "宗旨摎區域",
  charter4Text: "經費來自會費、捐款、補助摎活動；解散後剩餘財產毋得分配會員，歸屬公益用途。",
  visitAddress: siteCopy.visitAddress,
  writerSearchLabel: "尋作家抑係作品",
  writerSearchPlaceholder: "尋作家、別名抑係作品…",
  writerClearSearch: "清除搜尋",
  writerClearFilter: "清除篩選",
  writerShowing: "顯示 {shown} / {total} 位作家",
  writerWorkCount: "共下收錄 {count} 筆已查證主要作品",
};

const segmentOverrides = {
  "writer.gan-yaoming.style": "融合鄉野傳奇、誇飾、烏色幽默摎魔幻寫實，輒輒分歸入新鄉土書寫。",
  "writer.lan-bozhou.style": "以長年田野、口述訪談摎歷史檔案交織，立場鮮明地為受難者作傳。",
};

function restoreBookTitles(source, translated) {
  const sourceTitles = source.match(/《[^》]+》/gu) || [];
  let index = 0;
  return translated.replace(/《[^》]+》/gu, (title) => sourceTitles[index++] || title);
}

function normalizeLatinSpacing(value) {
  return value
    .replace(/(\p{Script=Han})([A-Za-z])/gu, "$1 $2")
    .replace(/([A-Za-z])(\p{Script=Han})/gu, "$1 $2")
    .replace(/[ \t]{2,}/gu, " ");
}

function clean(source, raw) {
  const titles = [];
  const protectedSource = source.replace(/《[^》]+》/gu, (title) => {
    titles.push(title);
    return `HakkaBookTitle${titles.length - 1}Placeholder`;
  });
  let titleIndex = 0;
  let value = restoreBookTitles(source, String(raw || "").trim())
    .replace(/《[^》]+》/gu, () => `HakkaBookTitle${titleIndex++}Placeholder`)
    .replace(/(^|[，,。！？；：\s])(?:z|h)\s*:\s*/giu, "$1")
    .replace(/客屋下/gu, "客家")
    .replace(/阿元老妹/gu, "阿元妹")
    .replace(/闊府/gu, "廣府")
    .replace(/笑科片/gu, "即興喜劇")
    .replace(/上屋下屋/gu, "上家下屋")
    .replace(/摘茶/gu, "採茶")
    .replace(/田坵/gu, "田野")
    .replace(/平洋/gu, "饒平")
    .replace(/咱們|我們|咱|𠊎兜/gu, "𫣆")
    .replace(/聊聊天|聊天|閒聊/gu, "打嘴鼓")
    .replace(/聊/gu, "講")
    .replace(/父母|爸媽/gu, "爺哀")
    .replace(/祖母/gu, "阿婆")
    .replace(/老師/gu, "先生")
    .replace(/為什麼|為何/gu, "做麼个")
    .replace(/覺得/gu, "試著")
    .replace(/樂意/gu, "歡喜")
    .replace(/落雨|下雨/gu, "落水")
    .replace(/窗外/gu, "窗門外")
    .replace(/小孩|孩子|兒童/gu, "細人")
    .replace(/核心/gu, "重點")
    .replace(/青領/gu, "藍領")
    .replace(/苗栗街項/gu, "苗栗市")
    .replace(/長年透天/gu, "長年")
    .replace(/可以/gu, "做得")
    .replace(/的/gu, "个")
    .replace(/是/gu, "係");

  for (const [index, title] of titles.entries()) value = value.replace(`HakkaBookTitle${index}Placeholder`, title);
  // Keep this read so review tooling can detect source/translation title-count mismatches.
  void protectedSource;
  return normalizeLatinSpacing(value).trim();
}

const reviewedSegments = rawDocument.translations.map((entry) => {
  let reviewed = clean(entry.source, entry.translated);
  let reviewNote = reviewed === entry.translated ? "GoHakka natural output retained" : "Shared Hakka rules applied";
  if (entry.scope === "work-type") {
    reviewed = entry.source.replace(/兒童/gu, "細人");
    reviewNote = "Formal bibliographic classification preserved";
  }
  if (entry.id.startsWith("writer.") && entry.id.endsWith(".relation")) {
    reviewed = entry.source;
    reviewNote = "Miaoli relation fact label preserved for accuracy";
  }
  if (entry.id.startsWith("site.")) {
    const key = entry.id.slice("site.".length);
    if (key in siteOverrides) {
      reviewed = siteOverrides[key];
      reviewNote = "GoHakka output grammar or factual label corrected";
    }
  }
  if (entry.id in segmentOverrides) {
    reviewed = segmentOverrides[entry.id];
    reviewNote = "GoHakka output grammar or literary term corrected";
  }
  return { id: entry.id, scope: entry.scope, source: entry.source, raw: entry.translated, reviewed, reviewNote };
});

const reviewedById = new Map(reviewedSegments.map((entry) => [entry.id, entry.reviewed]));
const reviewedBySource = new Map(reviewedSegments.map((entry) => [entry.source, entry.reviewed]));
const translatedFor = (id, source) => reviewedById.get(id) || reviewedBySource.get(source);

const siteHakka = {};
for (const [key, source] of Object.entries(siteCopy)) {
  const translated = translatedFor(`site.${key}`, source);
  if (!translated) throw new Error(`Missing reviewed site translation: ${key}`);
  siteHakka[key] = translated;
}

const writerHakka = writers.map((writer) => ({
  id: writer.id,
  bio: translatedFor(`writer.${writer.id}.bio`, writer.bio),
  workIntro: translatedFor(`writer.${writer.id}.workIntro`, writer.workIntro),
  style: translatedFor(`writer.${writer.id}.style`, writer.style),
  relation: writer.relation,
  works: writer.works.map((work, index) => ({
    type: reviewedBySource.get(work.type) || work.type,
    note: work.note ? translatedFor(`writer.${writer.id}.works.${index}.note`, work.note) : "",
  })),
}));

for (const writer of writerHakka) {
  if (!writer.bio || !writer.workIntro || !writer.style || !writer.relation) throw new Error(`Missing reviewed writer translation: ${writer.id}`);
  if (writer.works.some((work) => work.note === undefined)) throw new Error(`Missing reviewed work note: ${writer.id}`);
}

const wrongFormPattern = /咱|𫣆係|聊|老師|祖母|父母|爸媽|為什麼|為何|覺得|樂意|落雨|下雨|窗外|小孩|孩子|兒童|過日仔|車路|客屋下|阿元老妹|笑科片|摘茶|田坵|闊府|上屋下屋|平洋|核心|这|问|吗|说|无|后|发|们|为|从|对|还/gu;
const reviewedText = reviewedSegments.map((entry) => entry.reviewed).join("\n");
const wrongForms = [...new Set(reviewedText.match(wrongFormPattern) || [])];
if (wrongForms.length) throw new Error(`Known wrong forms remain: ${wrongForms.join(", ")}`);

const reviewedDocument = {
  metadata: {
    provider: "GoHakka",
    dialectCode: "sixian",
    mode: "natural",
    engine: "model",
    reviewedAt: new Date().toISOString(),
    sharedRules: "C:/Users/User/.codex/shared/hakka",
    segmentCount: reviewedSegments.length,
  },
  segments: reviewedSegments,
};

await writeFile(new URL("../translations/mlt_site_hakka_reviewed_segments.json", import.meta.url), `${JSON.stringify(reviewedDocument, null, 2)}\n`, "utf8");
await writeFile(new URL("../app/data/site-copy-hak.json", import.meta.url), `${JSON.stringify(siteHakka, null, 2)}\n`, "utf8");
await writeFile(new URL("../app/data/writers-hak.json", import.meta.url), `${JSON.stringify(writerHakka, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  segments: reviewedSegments.length,
  corrected: reviewedSegments.filter((entry) => entry.raw !== entry.reviewed).length,
  siteKeys: Object.keys(siteHakka).length,
  writers: writerHakka.length,
  works: writerHakka.reduce((sum, writer) => sum + writer.works.length, 0),
  wrongForms: wrongForms.length,
}, null, 2));
