"use client";

import { useEffect, useMemo, useState } from "react";
import type { Language } from "./page";
import writersData from "./data/writers.json";
import writersHak from "./data/writers-hak.json";
import siteZh from "./data/site-copy.json";
import siteHak from "./data/site-copy-hak.json";

type Writer = (typeof writersData)[number];
type HakkaWriter = (typeof writersHak)[number];

const genres = ["全部", "古典文學", "小說", "散文", "新詩", "劇作", "兒童文學", "報導文學"] as const;
const genreKeys = {
  全部: "genreAll", 古典文學: "genreClassical", 小說: "genreNovel", 散文: "genreProse",
  新詩: "genrePoetry", 劇作: "genreDrama", 兒童文學: "genreChildren", 報導文學: "genreReportage",
} as const;

function format(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((result, [key, value]) => result.replace(`{${key}}`, String(value)), template);
}

export default function WriterExplorer({ language }: { language: Language }) {
  const [genre, setGenre] = useState<(typeof genres)[number]>("全部");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Writer | null>(null);
  const c = language === "hak" ? siteHak : siteZh;
  const hakkaById = useMemo(() => new Map<string, HakkaWriter>(writersHak.map((writer) => [writer.id, writer])), []);

  const writers = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("zh-Hant");
    return writersData.filter((writer) => {
      const genreMatch = genre === "全部" || writer.genre === genre;
      const hakka = hakkaById.get(writer.id);
      const works = writer.works.map((work, index) => `${work.title} ${work.type} ${work.note} ${hakka?.works[index]?.type ?? ""} ${hakka?.works[index]?.note ?? ""}`).join(" ");
      const text = `${writer.name} ${writer.alias} ${writer.relation} ${writer.bio} ${writer.workTitle} ${writer.workIntro} ${writer.style} ${hakka?.bio ?? ""} ${hakka?.workIntro ?? ""} ${hakka?.style ?? ""} ${works}`.toLocaleLowerCase("zh-Hant");
      return genreMatch && (!needle || text.includes(needle));
    });
  }, [genre, query, hakkaById]);

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

  const activeHak = active ? hakkaById.get(active.id) : undefined;
  const displayGenre = (item: (typeof genres)[number]) => c[genreKeys[item]];

  return (
    <>
      <div className="archive-tools">
        <div className="genre-tabs" aria-label={c.writerFilterLabel}>
          {genres.map((item) => (
            <button className={genre === item ? "active" : ""} key={item} onClick={() => setGenre(item)} type="button">
              {displayGenre(item)}
              {item !== "全部" && <span>{writersData.filter((writer) => writer.genre === item).length}</span>}
            </button>
          ))}
        </div>
        <label className="search-box">
          <span className="sr-only">{c.writerSearchLabel}</span><span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={c.writerSearchPlaceholder} />
          {query && <button type="button" onClick={() => setQuery("")} aria-label={c.writerClearSearch}>×</button>}
        </label>
      </div>

      <div className="results-bar"><span>{format(c.writerShowing, { shown: writers.length, total: writersData.length })}</span><span>{format(c.writerWorkCount, { count: writersData.reduce((sum, writer) => sum + writer.works.length, 0) })}</span></div>

      {writers.length ? (
        <div className="writer-grid">
          {writers.map((writer, index) => (
            <button className="writer-card" type="button" key={writer.id} onClick={() => setActive(writer)}>
              <span className="writer-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="card-meta"><span>{displayGenre(writer.genre as (typeof genres)[number])}</span><small>{writer.years}</small></div>
              <h3>{writer.name}</h3><p className="alias">{writer.alias}</p><p className="writer-relation">{writer.relation}</p><div className="card-rule" />
              <p className="work-label">{c.writerFeatured}</p><p className="work-title">{writer.workTitle}</p><div className="card-foot card-foot-detail"><b aria-hidden="true">↗</b></div>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state"><span>{c.writerNoResults}</span><button type="button" onClick={() => { setGenre("全部"); setQuery(""); }}>{c.writerClearFilter}</button></div>
      )}

      {active && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setActive(null)}>
          <section className="writer-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="modal-close" type="button" onClick={() => setActive(null)} aria-label={c.writerClose}>×</button>
            <div className="modal-header"><p>{displayGenre(active.genre as (typeof genres)[number])} · {active.years}</p><h2 id="modal-title">{active.name}</h2><span>{active.alias}</span><strong className="modal-relation">{active.relation}</strong></div>
            <div className="modal-body">
              <div className="bio-block"><p className="modal-label">01 / {c.writerBio}</p><p>{language === "hak" ? activeHak?.bio : active.bio}</p></div>
              <div className="work-block"><p className="modal-label">02 / {c.writerFeaturedWork}</p><h3>{active.workTitle}</h3><p>{language === "hak" ? activeHak?.workIntro : active.workIntro}</p></div>
              <div className="works-block">
                <p className="modal-label">03 / {c.writerWorks}</p><p className="works-note">{c.writerWorksNote}</p>
                <ol className="works-list">{active.works.map((work, index) => { const hakkaWork = activeHak?.works[index]; return <li key={`${work.title}-${index}`}><span className="work-index">{String(index + 1).padStart(2, "0")}</span><div><h4>{work.title}</h4><p><b>{language === "hak" ? hakkaWork?.type : work.type}</b>{work.note && <> · {language === "hak" ? hakkaWork?.note : work.note}</>}</p></div></li>; })}</ol>
              </div>
              <div className="style-block"><p className="modal-label">04 / {c.writerStyle}</p><p>{language === "hak" ? activeHak?.style : active.style}</p></div>
              <div className="source-block"><p className="modal-label">05 / {c.writerSources}</p><div className="source-links">{active.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}<span>↗</span></a>)}</div><p className="source-note">{c.writerSourceNote}</p></div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
