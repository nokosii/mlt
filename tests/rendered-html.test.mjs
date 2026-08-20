import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("writer archive has the requested 39 records and genre counts", async () => {
  const writers = JSON.parse(await readFile(new URL("public/data/writers.json", root), "utf8"));
  assert.equal(writers.length, 39);
  const counts = Object.fromEntries(Object.entries(Object.groupBy(writers, (writer) => writer.genre)).map(([genre, rows]) => [genre, rows.length]));
  assert.deepEqual(counts, { 古典文學: 11, 小說: 6, 散文: 6, 新詩: 9, 劇作: 2, 兒童文學: 3, 報導文學: 2 });
  for (const writer of writers) {
    assert.ok(writer.name && writer.bio && writer.workTitle && writer.links.length, `${writer.id} is incomplete`);
    assert.ok(writer.relation, `${writer.id} has no Miaoli relation`);
    assert.ok(Array.isArray(writer.works) && writer.works.length, `${writer.id} has no audited works`);
    for (const work of writer.works) assert.ok(work.title && work.type, `${writer.id} has an incomplete work entry`);
  }
  assert.equal(writers.reduce((sum, writer) => sum + writer.works.length, 0), 252);
  assert.equal(new Set(writers.map((writer) => writer.relation)).size > 20, true);
  assert.equal(writers.find((writer) => writer.id === "zhang-hanwen").relation, "苗栗頭份｜地方文人");
  assert.equal(writers.find((writer) => writer.id === "gan-yaoming").relation, "苗栗獅潭｜出生、成長");
  assert.equal(writers.find((writer) => writer.id === "du-rongchen").relation, "苗栗後龍｜出生、任教");
  const chenHu = writers.find((writer) => writer.id === "chen-hu");
  assert.equal(chenHu.name, "陳瑚");
  assert.match(chenHu.alias, /字滄玉/);
  const zhangHanwen = writers.find((writer) => writer.id === "zhang-hanwen");
  assert.equal(zhangHanwen.years, "1902—1979");
  assert.deepEqual(zhangHanwen.links, [{
    label: "國家文化記憶庫・張漢文",
    url: "https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_People&id=333870",
  }]);
  assert.ok(!JSON.stringify(zhangHanwen).includes("lin.nmtl.gov.tw"));
});

test("GitHub Pages snapshot contains the finished site", async () => {
  const html = await readFile(new URL("docs/index.html", root), "utf8");
  assert.match(html, /苗栗文學步道/);
  assert.match(html, /苗栗作家資料庫/);
  assert.doesNotMatch(html, /苗栗淵源/);
  assert.equal((html.match(/class="writer-relation"/g) ?? []).length, 39);
  assert.match(html, /苗栗頭份｜地方文人/);
  assert.match(html, /苗栗獅潭｜出生、成長/);
  assert.doesNotMatch(html, /<span class="status(?: pending)?">/);
  assert.doesNotMatch(html, /已核對・|史料待補強/);
  assert.match(html, /href="#news">最新消息/);
  assert.match(html, /2022年，國立聯合大學於校慶期間啟動苗栗文學步道規劃/);
  assert.doesNotMatch(html, /2012/);
  assert.match(html, /title="苗栗文學步道—國立聯合大學大學湖 Google 地圖"/);
  assert.match(html, /output=embed/);
  assert.match(html, /使用 Google Maps 導航/);
  assert.match(html, /<h3>陳瑚<\/h3><p class="alias">字滄玉/);
  assert.doesNotMatch(html, /<h3>陳瑚（字滄玉）<\/h3>/);
  assert.match(html, /gallery-arrow gallery-arrow-previous/);
  assert.match(html, /gallery-arrow gallery-arrow-next/);
  assert.match(html, /https:\/\/forms\.gle\/otkC9QQo6Hp31ShK6/);
  assert.match(html, /\.\/downloads\/苗栗文學作家資料庫\.xlsx/);
  assert.match(html, /trail-hero-identity\.png/);
  assert.match(html, /完整相簿 · 52 張/);
  assert.match(html, /trail-gallery\/trail-01\.jpg/);
  assert.match(html, /發起人名單/);
  assert.match(html, /何修仁/);
  assert.match(html, /鄭正德/);
  assert.doesNotMatch(html, />Ray</);
  assert.match(html, /hits\.sh\/nokosii\.github\.io\/mlt\.svg/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/);
  assert.doesNotMatch(html, /(?:src|href)="\/(?:_next|images)\//);
  assert.ok((await readFile(new URL("docs/downloads/苗栗文學作家資料庫.xlsx", root))).length > 10_000);
  assert.ok((await readFile(new URL("docs/images/trail-hero-identity.png", root))).length > 1_000_000);
  assert.equal((await readdir(new URL("docs/images/trail-gallery/", root))).filter((name) => name.endsWith(".jpg")).length, 52);
});
