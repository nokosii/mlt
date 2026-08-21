"use client";

import { useRef } from "react";
import type { Language } from "./page";
import siteZh from "./data/site-copy.json";
import siteHak from "./data/site-copy-hak.json";

const photos = Array.from({ length: 52 }, (_, index) => ({
  number: index + 1,
  src: `/images/trail-gallery/trail-${String(index + 1).padStart(2, "0")}.jpg`,
}));

export default function TrailGallery({ language }: { language: Language }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const c = language === "hak" ? siteHak : siteZh;

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.82, behavior: "smooth" });
  };

  return (
    <div className="gallery-carousel">
      <div className="gallery-controls">
        <span>{c.galleryAlbum}</span>
      </div>
      <div className="gallery-viewport">
        <button className="gallery-arrow gallery-arrow-previous" type="button" onClick={() => move(-1)} aria-label={c.galleryPrevious}>←</button>
        <div
          ref={trackRef}
          className="gallery-track"
          role="region"
          aria-label={c.galleryRegion}
        >
          {photos.map((photo) => (
            <figure key={photo.src}>
              <img
                src={photo.src}
                alt={c.galleryPhotoAlt.replace("{number}", String(photo.number))}
                loading={photo.number <= 3 ? "eager" : "lazy"}
                decoding="async"
              />
              <figcaption>{String(photo.number).padStart(2, "0")} / 52</figcaption>
            </figure>
          ))}
        </div>
        <button className="gallery-arrow gallery-arrow-next" type="button" onClick={() => move(1)} aria-label={c.galleryNext}>→</button>
      </div>
      <p className="gallery-hint">{c.galleryHint}</p>
    </div>
  );
}
