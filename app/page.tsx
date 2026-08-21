"use client";

import { useEffect, useState } from "react";
import WriterExplorer from "./WriterExplorer";
import TrailGallery from "./TrailGallery";
import siteZh from "./data/site-copy.json";
import siteHak from "./data/site-copy-hak.json";
import "./enhancements.css";

export type Language = "zh" | "hak";

const founders = [
  "何修仁", "何照清", "何莉珠", "吳文章", "吳宛玉", "吳翠松", "吳貴俐", "李筑軒", "李羿慧",
  "周念湘", "侯帝光", "胡淑連", "張陳基", "黃勝銘", "潘玲玲", "賴俊宏", "蔡豐任", "鄭正德",
];

export default function Home() {
  const [language, setLanguage] = useState<Language>("zh");
  const c = language === "hak" ? siteHak : siteZh;
  const directions = [
    [c.directionEducationTitle, c.directionEducationDetail],
    [c.directionGuideTitle, c.directionGuideDetail],
    [c.directionDigitalTitle, c.directionDigitalDetail],
    [c.directionLocalTitle, c.directionLocalDetail],
  ];

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("lang");
    const saved = window.localStorage.getItem("mlt-language");
    if (requested === "hak" || requested === "zh") setLanguage(requested);
    else if (saved === "hak") setLanguage("hak");
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "hak" ? "hak-TW" : "zh-Hant";
    window.localStorage.setItem("mlt-language", language);
    const url = new URL(window.location.href);
    if (language === "hak") url.searchParams.set("lang", "hak");
    else url.searchParams.delete("lang");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [language]);

  return (
    <main data-language={language}>
      <header className="nav-shell">
        <a className="brand" href="#top" aria-label={c.brandHomeLabel}><span className="brand-mark">MLT</span><span>{c.brandName}<small>{c.brandStatus}</small></span></a>
        <div className="nav-actions">
          <nav aria-label={c.navLabel}><a href="#news">{c.navNews}</a><a href="#archive">{c.navArchive}</a><a href="#story">{c.navStory}</a><a href="#visit">{c.navVisit}</a><a href="#association">{c.navAssociation}</a><a href="#founders">{c.navFounders}</a><a className="nav-cta" href="#join">{c.navJoin}</a></nav>
          <div className="language-switch" role="group" aria-label={c.languageLabel}>
            <button type="button" aria-pressed={language === "zh"} onClick={() => setLanguage("zh")}>{c.languageMandarin}</button>
            <button type="button" aria-pressed={language === "hak"} onClick={() => setLanguage("hak")}>{c.languageHakka}</button>
          </div>
        </div>
      </header>

      <section id="top" className="hero">
        <img src="/images/trail-hero-identity.png" alt={c.heroAlt} />
        <div className="hero-shade" />
        <div className="hero-copy"><p className="eyebrow">MIAOLI LITERARY TRAIL</p><h1>{c.heroTitle}</h1><p>{c.heroDescription}</p><a className="primary" href="#archive">{c.heroAction} <span>↓</span></a></div>
        <div className="hero-stats" aria-label={c.heroStatsLabel}><span><strong>39</strong> {c.heroStatCatalog}</span><span><strong>7</strong> {c.heroStatGenres}</span><span><strong>38</strong> {c.heroStatTrail}</span></div>
        <p className="photo-credit">{c.photoCredit}</p>
      </section>

      <section id="news" className="intro-strip" aria-label={c.navNews}><p>{c.newsLabel}</p><p>{c.newsText}</p></section>

      <section id="archive" className="section archive-section">
        <div className="section-heading"><div><p className="kicker">WRITER ARCHIVE</p><h2>{c.archiveTitle}</h2></div><div className="heading-note"><span>{c.archiveVersion}</span><p>{c.archiveDescription}</p><a className="download-link" href="./downloads/苗栗文學作家資料庫.xlsx" download>{c.archiveDownload} <b>↓</b></a></div></div>
        <WriterExplorer language={language} />
      </section>

      <section id="story" className="story-section">
        <div className="story-copy"><p className="kicker light">THE BEGINNING</p><h2>{c.storyTitle}</h2><p>{c.storyParagraph1}</p><p>{c.storyParagraph2}</p><div className="story-links"><a href="https://hakkanews.tw/2022/12/23/hos-beauty-column-united-university-literature-trail-to-praise-the-people-of-miaoli-and-miaoli/" target="_blank" rel="noreferrer">{c.storyNewsLink} ↗</a><a href="https://youtu.be/KuIbCRVktIc" target="_blank" rel="noreferrer">{c.storyVideoLink} ↗</a></div></div>
        <div className="story-number"><strong>600</strong><span>{c.storyMeters}</span><div className="timeline"><p><b>2022</b> {c.storyStart}</p><p><b>38</b> {c.storyWriters}</p><p><b>NOW</b> {c.storyNow}</p></div></div>
      </section>

      <section className="gallery-section" aria-labelledby="gallery-title"><div className="gallery-title"><p className="kicker">WALK &amp; READ</p><h2 id="gallery-title">{c.galleryTitle}</h2><p>{c.galleryDescription}</p></div><TrailGallery language={language} /></section>

      <section id="association" className="section association-section">
        <div className="association-lead"><p className="kicker">ABOUT THE ASSOCIATION</p><h2>{c.associationTitle}</h2><p>{c.associationDescription}</p><div className="mission-quote">{c.associationQuote}</div></div>
        <div className="direction-list">{directions.map(([title, detail], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{detail}</p></div><b>↗</b></article>)}</div>
      </section>

      <section id="founders" className="section founders-section"><div className="founders-heading"><p className="kicker">FOUNDING MEMBERS</p><h2>{c.foundersTitle}</h2><p>{c.foundersNote}</p></div><div className="founders-grid">{founders.map((name, index) => <article key={name}><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong></article>)}</div></section>

      <section className="charter-section">
        <div><p className="kicker">CHARTER DRAFT</p><h2>{c.charterTitle}</h2></div>
        <div className="charter-grid"><article><span>01</span><h3>{c.charter1Title}</h3><p>{c.charter1Text}</p></article><article><span>02</span><h3>{c.charter2Title}</h3><p>{c.charter2Text}</p></article><article><span>03</span><h3>{c.charter3Title}</h3><p>{c.charter3Text}</p></article><article><span>04</span><h3>{c.charter4Title}</h3><p>{c.charter4Text}</p></article></div>
        <p className="charter-note">{c.charterNote}</p>
      </section>

      <section className="source-section"><div><p className="kicker light">SOURCE POLICY</p><h2>{c.sourceTitle}</h2></div><div className="source-policy"><p>{c.sourceParagraph1}</p><p>{c.sourceParagraph2}</p><div className="policy-tags"><span>{c.sourceTagOfficial}</span><span>{c.sourceTagLinks}</span><span>{c.sourceTagVariants}</span><span>{c.sourceTagWorks}</span></div></div></section>

      <section id="join" className="join-section"><div><p className="kicker">TAKE PART</p><h2>{c.joinTitle}</h2></div><div><p>{c.joinText}</p><a className="join-action" href="https://forms.gle/otkC9QQo6Hp31ShK6" target="_blank" rel="noreferrer">{c.joinAction} <span>↗</span></a><small>{c.joinNote}</small></div></section>

      <section id="visit" className="visit-section" aria-labelledby="visit-title">
        <div className="visit-copy"><p className="kicker">VISIT THE TRAIL</p><h2 id="visit-title">{c.visitTitle}</h2><p>{c.visitText}</p><address>{c.visitAddress}</address><div className="visit-actions"><a className="map-action" href="https://www.google.com/maps/dir/?api=1&amp;destination=%E5%9C%8B%E7%AB%8B%E8%81%AF%E5%90%88%E5%A4%A7%E5%AD%B8%E5%A4%A7%E5%AD%B8%E6%B9%96" target="_blank" rel="noreferrer">{c.visitMapAction} <span>↗</span></a><a href="https://www.nuu.edu.tw/p/412-1000-3769.php?Lang=zh-tw" target="_blank" rel="noreferrer">{c.visitSchoolLink} ↗</a></div></div>
        <div className="map-frame"><iframe title={c.visitMapTitle} src="https://www.google.com/maps?q=%E5%9C%8B%E7%AB%8B%E8%81%AF%E5%90%88%E5%A4%A7%E5%AD%B8%E5%A4%A7%E5%AD%B8%E6%B9%96&amp;output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>
      </section>

      <footer><a className="brand footer-brand" href="#top"><span className="brand-mark">MLT</span><span>{c.brandName}<small>{c.brandStatus}</small></span></a><div className="footer-meta"><p>{c.footerNote}</p><p className="translation-credit">{c.translationCredit} <a href="https://gohakka.org/" target="_blank" rel="noreferrer">GoHakka.org ↗</a></p><a className="visitor-count" href="https://hits.sh/nokosii.github.io/mlt/" target="_blank" rel="noreferrer"><img src={`https://hits.sh/nokosii.github.io/mlt.svg?view=total&style=flat-square&label=${language === "hak" ? "%E4%BE%86%E8%A8%AA%E4%BA%BA%E6%AC%A1" : "%E5%88%B0%E8%A8%AA%E4%BA%BA%E6%AC%A1"}&color=%23d4693e&labelColor=%2317352e`} alt={c.visitorAlt} /></a></div><div><a href="#archive">{c.navArchive}</a><a href="#story">{c.navStory}</a><a href="#founders">{c.navFounders}</a><a href="#association">{c.navAssociation}</a></div></footer>
    </main>
  );
}
