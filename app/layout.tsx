import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import "./charter.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const title = "苗栗文學步道（MLT）推廣協會";
  const description = "查找39位苗栗文學作家的生平、代表作品與可追溯資料來源，認識國立聯合大學苗栗文學步道。";
  const image = new URL("/og.png", base).toString();
  return { metadataBase: base, title, description, openGraph: { title, description, type: "website", locale: "zh_TW", images: [{ url: image, width: 1200, height: 630, alt: "苗栗文學步道 MLT 推廣協會" }] }, twitter: { card: "summary_large_image", title, description, images: [image] } };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-Hant"><body>{children}</body></html>; }
