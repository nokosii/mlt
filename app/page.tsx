import WriterExplorer from "./WriterExplorer";
import TrailGallery from "./TrailGallery";
import "./enhancements.css";

const directions = [
  ["文學教育", "講座、閱讀、賞析與教師研習"],
  ["在地導覽", "培訓志工，串聯校園與社區"],
  ["數位典藏", "作家資料庫、QR Code 與語音導覽"],
  ["地方共創", "連結作家、文化工作者與地方團隊"],
];

const founders = [
  "何修仁", "何照清", "何莉珠",
  "吳文章", "吳宛玉", "吳翠松", "吳貴俐",
  "李筑軒", "李羿慧", "周念湘",
  "侯帝光", "胡淑連", "張陳基", "黃勝銘",
  "潘玲玲", "賴俊宏", "蔡豐任", "鄭正德",
];

export default function Home() {
  return (
    <main>
      <header className="nav-shell">
        <a className="brand" href="#top" aria-label="苗栗文學步道首頁"><span className="brand-mark">MLT</span><span>苗栗文學步道<small>推廣協會（籌備中）</small></span></a>
        <nav aria-label="主要選單"><a href="#archive">作家資料庫</a><a href="#story">步道緣起</a><a href="#association">關於協會</a><a href="#founders">發起人</a><a className="nav-cta" href="#join">加入我們</a></nav>
      </header>

      <section id="top" className="hero">
        <img src="/images/trail-hero-identity.png" alt="國立聯合大學八甲校區湖畔的苗栗文學步道入口、湖景與校舍" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">MIAOLI LITERARY TRAIL</p>
          <h1>讓文學，<br />走進地方的風景。</h1>
          <p>沿著聯大湖畔，閱讀橫跨古典詩、小說、散文與新詩的苗栗文學。</p>
          <a className="primary" href="#archive">探索作家資料庫 <span>↓</span></a>
        </div>
        <div className="hero-stats" aria-label="資料庫統計"><span><strong>39</strong> 網站名錄</span><span><strong>7</strong> 種文類</span><span><strong>38</strong> 步道現地作家</span></div>
        <p className="photo-credit">影像／苗栗文學步道實景照片・主視覺調色設計</p>
      </section>

      <section className="intro-strip" aria-label="協會簡介"><p>一條步道，串起苗栗的人文風景</p><p>我們以研究、導覽與數位典藏，讓在地文學走出書頁，走進校園與生活。</p></section>

      <section id="archive" className="section archive-section">
        <div className="section-heading"><div><p className="kicker">WRITER ARCHIVE</p><h2>苗栗作家資料庫</h2></div><div className="heading-note"><span>全面清查版 2026.08</span><p>39位作家逐筆核對生平、代表作品、主要作品目錄與資料來源；年代異說及公開書目限制均明確註記。</p><a className="download-link" href="./downloads/苗栗文學作家資料庫.xlsx" download>下載完整作家資料 Excel <b>↓</b></a></div></div>
        <WriterExplorer />
      </section>

      <section id="story" className="story-section">
        <div className="story-copy"><p className="kicker light">THE BEGINNING</p><h2>從五十週年校慶，<br />走出一條文學的路。</h2><p>2012年，國立聯合大學迎接建校五十週年。為強化在地連結與人文教育，校友募款、學者與校內團隊共同規劃，在八甲校區大學湖畔建置約六百公尺的苗栗文學步道。</p><p>諮詢小組以「書寫苗栗、作品優良」為選錄原則，兼顧清代、日治與戰後，涵蓋古典詩、小說、散文、新詩、戲劇、兒童文學與報導文學。因授權與聯繫因素，現地最終呈現38位作家作品。</p><div className="story-links"><a href="https://hakkanews.tw/2022/12/23/hos-beauty-column-united-university-literature-trail-to-praise-the-people-of-miaoli-and-miaoli/" target="_blank" rel="noreferrer">客新聞專題 ↗</a><a href="https://youtu.be/KuIbCRVktIc" target="_blank" rel="noreferrer">步道參考影片 ↗</a></div></div>
        <div className="story-number"><strong>600</strong><span>公尺的閱讀風景</span><div className="timeline"><p><b>2012</b> 校慶規劃啟動</p><p><b>38</b> 位作家作品落地</p><p><b>NOW</b> 數位資料庫延伸</p></div></div>
      </section>

      <section className="gallery-section" aria-labelledby="gallery-title">
        <div className="gallery-title"><p className="kicker">WALK &amp; READ</p><h2 id="gallery-title">文字就在湖畔發生</h2><p>作品以玻璃噴砂、大理石雕刻、金屬板與水泥基座等形式，融入八甲校區的湖光與綠意。</p></div>
        <TrailGallery />
      </section>

      <section id="association" className="section association-section">
        <div className="association-lead"><p className="kicker">ABOUT THE ASSOCIATION</p><h2>守護一條步道，<br />也守護地方的記憶。</h2><p>「台灣苗栗文學步道推廣協會」正在籌備中。我們期待結合校園、社區、文化工作者與社會各界，讓苗栗文學成為可閱讀、可行走、可傳承的公共文化資產。</p><div className="mission-quote">讓文學走進校園<br />走進地方 · 走進生活</div></div>
        <div className="direction-list">{directions.map(([title, detail], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{detail}</p></div><b>↗</b></article>)}</div>
      </section>

      <section id="founders" className="section founders-section">
        <div className="founders-heading"><p className="kicker">FOUNDING MEMBERS</p><h2>發起人名單</h2><p>依姓氏筆畫排列；僅列華語姓名。</p></div>
        <div className="founders-grid">{founders.map((name, index) => <article key={name}><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong></article>)}</div>
      </section>

      <section className="charter-section">
        <div><p className="kicker">CHARTER DRAFT</p><h2>協會章程草案摘要</h2></div>
        <div className="charter-grid"><article><span>01</span><h3>宗旨與區域</h3><p>以苗栗縣為組織區域，推廣在地文學、人文教育、步道維護、文化觀光與地方創生。</p></article><article><span>02</span><h3>會員與治理</h3><p>規劃個人、團體與贊助會員；會員大會為最高權力機構，設理事9人、監事3人。</p></article><article><span>03</span><h3>四類委員會</h3><p>步道規劃、教育推廣、導覽與志工發展、數位與出版，依業務需要推進工作。</p></article><article><span>04</span><h3>財務與公益</h3><p>經費來自會費、捐款、補助與活動；解散後剩餘財產不得分配會員，歸屬公益用途。</p></article></div>
        <p className="charter-note">本摘要依使用者提供的26條章程草案整理；正式版本須經會員大會通過並報主管機關核備。</p>
      </section>

      <section className="source-section">
        <div><p className="kicker light">SOURCE POLICY</p><h2>每一筆資料，<br />都應該找得到來處。</h2></div>
        <div className="source-policy"><p>本資料庫是可持續校訂的全面清查版。內容優先採用文化部國家文化記憶庫、國立臺灣文學館、國家圖書館、客家委員會、地方政府、正式出版及學術研究資料。</p><p>本地參考文獻包括使用者提供的《客家文化事典》與苗栗文學步道相簿。姓名、年代或版本有異說時，卡片中直接註明；目前收錄的252筆作品是「已查證主要作品」，作家作品極多或公開書目有限時不宣稱完整全集。</p><div className="policy-tags"><span>官方資料優先</span><span>逐筆附連結</span><span>異說明確註記</span><span>252筆作品索引</span></div></div>
      </section>

      <section id="join" className="join-section"><div><p className="kicker">TAKE PART</p><h2>一起，為苗栗留下<br />更深的人文風景。</h2></div><div><p>我們正在招募發起人會員、籌備委員、一般會員、志工夥伴與顧問。歡迎教師、校友、文化工作者與關心苗栗的朋友加入。</p><a className="join-action" href="https://forms.gle/otkC9QQo6Hp31ShK6" target="_blank" rel="noreferrer">填寫「加入我們」表單 <span>↗</span></a><small>表單將在新視窗開啟；協會其他聯絡方式待籌備處確認。</small></div></section>

      <footer><a className="brand footer-brand" href="#top"><span className="brand-mark">MLT</span><span>苗栗文學步道<small>推廣協會（籌備中）</small></span></a><div className="footer-meta"><p>本網站為協會籌備版 · 作家資料庫持續校訂中</p><a className="visitor-count" href="https://hits.sh/nokosii.github.io/mlt/" target="_blank" rel="noreferrer"><img src="https://hits.sh/nokosii.github.io/mlt.svg?view=total&amp;style=flat-square&amp;label=%E5%88%B0%E8%A8%AA%E4%BA%BA%E6%AC%A1&amp;color=%23d4693e&amp;labelColor=%2317352e" alt="到訪人次；每次重新載入頁面加一" /></a></div><div><a href="#archive">作家資料庫</a><a href="#story">步道緣起</a><a href="#founders">發起人</a><a href="#association">關於協會</a></div></footer>
    </main>
  );
}
