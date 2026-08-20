import fs from "node:fs/promises";

const writers = JSON.parse(await fs.readFile(new URL("../app/data/writers.json", import.meta.url), "utf8"));
const unique = [...new Map(writers.flatMap((writer) => writer.links.map((link) => [link.url, { ...link, writer: writer.name }]))).values()];
const queue = [...unique];
const results = [];

async function worker() {
  while (queue.length) {
    const item = queue.shift();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch(item.url, {
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "Mozilla/5.0 MLT source audit" },
      });
      results.push({ ...item, status: response.status, finalUrl: response.url });
    } catch (error) {
      results.push({ ...item, status: "ERR", error: error.name });
    } finally {
      clearTimeout(timeout);
    }
  }
}

await Promise.all(Array.from({ length: 8 }, worker));
results.sort((a, b) => a.writer.localeCompare(b.writer, "zh-Hant"));

for (const result of results) {
  const flag = typeof result.status === "number" && result.status < 400 ? "OK" : "CHECK";
  console.log(`${flag}\t${result.status}\t${result.writer}\t${result.label}\t${result.url}${result.error ? `\t${result.error}` : ""}`);
}

const ok = results.filter((result) => typeof result.status === "number" && result.status < 400).length;
console.log(`SUMMARY\t${ok}/${results.length} reachable without HTTP error`);
