from pypdf import PdfReader

pdf = PdfReader(r"C:\Codex\苗栗文學\客家文化事典-全.pdf")
names = "阮蔡文 黃清泰 黎瑩 吳子光 張維垣 蔡啟運 丘逢甲 陳滄玉 羅福星 張漢文 賴江質 吳濁流 李喬 田敏忠 王幼華 梁寒衣 甘耀明 沉櫻 林海音 江上 謝霜天 陳朝棟 陌上塵 詹冰 羅浪 莫渝 劉毓秀 黃恆秋 路寒袖 李渡愁 邱一帆 解昆樺 鍾喬 黎煥雄 陳正治 杜榮琛 洪志明 張典婉 藍博洲".split()

seen = set()
for index, page in enumerate(pdf.pages, start=1):
    text = (page.extract_text() or "").replace("\n", " ")
    for name in names:
        if name in seen:
            continue
        position = text.find(name)
        if position >= 0:
            seen.add(name)
            start = max(0, position - 100)
            end = min(len(text), position + 500)
            print(f"{name}\tPDF頁{index}\t{text[start:end]}")
