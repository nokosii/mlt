import fs from "node:fs/promises";

const relations = {
  "ruan-caiwen": "福建漳浦｜曾任臺灣北路營參將",
  "huang-qingtai": "苗栗頭份｜曾居頭份",
  "li-ying": "苗栗西湖｜定居三湖村",
  "wu-ziguang": "苗栗銅鑼｜定居雙峰山",
  "zhang-weiyuan": "苗栗頭份｜辭官後定居",
  "cai-qiyun": "苗栗苑裡｜出生",
  "qiu-fengjia": "苗栗銅鑼｜出生",
  "chen-hu": "苗栗苑裡｜出生",
  "luo-fuxing": "苗栗｜青年時居住、參與抗日",
  "zhang-hanwen": "苗栗頭份｜地方文人",
  "lai-jiangzhi": "苗栗縣｜出生、長期書寫地方",
  "wu-zhuoliu": "苗栗西湖｜曾任教",
  "li-qiao": "苗栗大湖｜出生",
  "tian-minzhong": "苗栗泰安｜天狗部落出生",
  "wang-youhua": "苗栗頭份｜出生",
  "liang-hanyi": "苗栗縣籍｜小說家、散文家",
  "gan-yaoming": "苗栗獅潭｜出生、成長",
  "chen-ying": "苗栗頭份｜曾居頭份",
  "lin-haiyin": "苗栗頭份｜父親故鄉",
  "jiang-shang": "苗栗頭份｜任教大成高中",
  "xie-shuangtian": "苗栗銅鑼｜出生",
  "chen-chaodong": "苗栗後龍｜出生、返鄉書寫",
  "moshang-chen": "苗栗縣籍｜工人文學作家",
  "zhan-bing": "苗栗卓蘭｜出生",
  "luo-lang": "苗栗市｜出生",
  "mo-yu": "苗栗竹南｜出生",
  "liu-yuxiu": "苗栗頭份｜成長",
  "huang-hengqiu": "苗栗銅鑼｜出生",
  "lu-hanshou": "苗栗苑裡｜出生",
  "li-duchou": "苗栗縣籍｜現代詩人",
  "qiu-yifan": "苗栗南庄｜出生",
  "xie-kunhua": "苗栗籍｜出生臺北",
  "zhong-qiao": "苗栗三義｜出身",
  "li-huanxiong": "苗栗大湖｜出生",
  "chen-zhengzhi": "苗栗縣｜出生",
  "du-rongchen": "苗栗後龍｜出生、任教",
  "hong-zhiming": "苗栗縣｜出生",
  "zhang-dianwan": "苗栗頭份｜成長",
  "lan-bozhou": "苗栗西湖｜出生",
};

const relationSources = {
  "gan-yaoming": {
    label: "臺中文學館・甘耀明作家小傳",
    url: "https://www.tlm.taichung.gov.tw/tour/Details.aspx?Parser=13%2C8%2C85%2C95%2C%2C%2C66",
  },
  "zhan-bing": {
    label: "臺灣文學虛擬博物館・詹冰文學故事館",
    url: "https://tlvm.nmtl.gov.tw/zh/Travel/TravelFamilyCont?Familyid=10",
  },
};

const appPath = new URL("../app/data/writers.json", import.meta.url);
const publicPath = new URL("../public/data/writers.json", import.meta.url);
const writers = JSON.parse(await fs.readFile(appPath, "utf8"));

if (writers.length !== Object.keys(relations).length) {
  throw new Error(`Writer/relation count mismatch: ${writers.length}/${Object.keys(relations).length}`);
}

const updated = writers.map((writer) => {
  const relation = relations[writer.id];
  if (!relation) throw new Error(`Missing relation for ${writer.id}`);
  const extraSource = relationSources[writer.id];
  const links = extraSource && !writer.links.some((link) => link.url === extraSource.url)
    ? [...writer.links, extraSource]
    : writer.links;
  return { ...writer, relation, links };
});

const output = `${JSON.stringify(updated, null, 2)}\n`;
await fs.writeFile(appPath, output, "utf8");
await fs.writeFile(publicPath, output, "utf8");
console.log(`Added verified Miaoli relations to ${updated.length} writers.`);
