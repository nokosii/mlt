"use client";

import { useEffect, useMemo, useState } from "react";
import writersData from "./data/writers.json";

type Writer = (typeof writersData)[number];

const genres = ["全部", "古典文學", "小說", "散文", "新詩", "劇作", "兒童文學", "報導文學"];

export default function WriterExplorer() {
  const [genre, setGenre] = useState("全部");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Writer | null>(null);

  const writers = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("zh-Hant");
    return writersData.filter((writer) => {
      const genreMatch = genre === "全部" || writer.genre === genre;
      const workText = writer.works.map((work) => `${work.title} ${work.type} ${work.note}`).join(" ");
      const text = `${writer.name} ${writer.alias} ${writer.relation} ${writer.bio} ${writer.workTitle} ${writer.workIntro} ${workText}`.toLocaleLowerCase("zh-Hant");
      return genreMatch && (!needle || text.includes(needle));
    });
  }, [genre, query]);

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setActive(null);
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      <div className="archive-tools">
        <div className="genre-tabs" aria-label="依文類篩選">
          {genres.map((item) => (
            <button className={genre === item ? "active" : ""} key={item} onClick={() => setGenre(item)} type="button">
              {item}
              {item !== "全部" && <span>{writersData.filter((writer) => writer.genre === item).length}</span>}
            </button>
          ))}
        </div>
        <label className="search-box">
          <span className="sr-only">搜尋作家或作品</span>
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋作家、別名或作品…" />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="清除搜尋">×</button>}
        </label>
      </div>

      <div className="results-bar"><span>顯示 <strong>{writers.length}</strong> / {writersData.length} 位作家</span><span>共收錄 {writersData.reduce((sum, writer) => sum + writer.works.length, 0)} 筆已查證主要作品</span></div>

      {writers.length ? (
        <div className="writer-grid">
          {writers.map((writer, index) => (
            <button className="writer-card" type="button" key={writer.id} onClick={() => setActive(writer)}>
              <span className="writer-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="card-meta"><span>{writer.genre}</span><small>{writer.years}</small></div>
              <h3>{writer.name}</h3>
              <p className="alias">{writer.alias}</p>
              <p className="writer-relation"><span>苗栗淵源</span>{writer.relation}</p>
              <div className="card-rule" />
              <p className="work-label">代表作品</p>
              <p className="work-title">{writer.workTitle}</p>
              <div className="card-foot card-foot-detail"><b aria-hidden="true">↗</b></div>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state"><span>找不到相符資料</span><button type="button" onClick={() => { setGenre("全部"); setQuery(""); }}>清除篩選</button></div>
      )}

      {active && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setActive(null)}>
          <section className="writer-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modal-close" type="button" onClick={() => setActive(null)} aria-label="關閉作家資料">×</button>
            <div className="modal-header"><p>{active.genre} · {active.years}</p><h2 id="modal-title">{active.name}</h2><span>{active.alias}</span><strong className="modal-relation">苗栗淵源 · {active.relation}</strong></div>
            <div className="modal-body">
              <div className="bio-block"><p className="modal-label">01 / 生平簡介</p><p>{active.bio}</p></div>
              <div className="work-block"><p className="modal-label">02 / 代表作品</p><h3>{active.workTitle}</h3><p>{active.workIntro}</p></div>
              <div className="works-block">
                <p className="modal-label">03 / 已查證主要作品</p>
                <p className="works-note">依目前可公開查核之官方、館藏、出版與學術書目整理；作品極多者採主要作品選列，不宣稱完整全集。</p>
                <ol className="works-list">
                  {active.works.map((work, index) => (
                    <li key={`${work.title}-${index}`}>
                      <span className="work-index">{String(index + 1).padStart(2, "0")}</span>
                      <div><h4>{work.title}</h4><p><b>{work.type}</b>{work.note && <> · {work.note}</>}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="style-block"><p className="modal-label">04 / 文學風格</p><p>{active.style}</p></div>
              <div className="source-block"><p className="modal-label">05 / 資料來源與連結</p><div className="source-links">{active.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}<span>↗</span></a>)}</div><p className="source-note">另交叉參考使用者提供之《客家文化事典》文學類條目與苗栗文學步道名錄；年代或版本有異說者已在卡片內標示。</p></div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
