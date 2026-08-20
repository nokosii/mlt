"use client";

import { useRef } from "react";

const photos = Array.from({ length: 52 }, (_, index) => ({
  number: index + 1,
  src: `/images/trail-gallery/trail-${String(index + 1).padStart(2, "0")}.jpg`,
}));

export default function TrailGallery() {
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.82, behavior: "smooth" });
  };

  return (
    <div className="gallery-carousel">
      <div className="gallery-controls">
        <span>完整相簿 · 52 張</span>
      </div>
      <div className="gallery-viewport">
        <button className="gallery-arrow gallery-arrow-previous" type="button" onClick={() => move(-1)} aria-label="瀏覽上一批步道照片">←</button>
        <div
          ref={trackRef}
          className="gallery-track"
          role="region"
          aria-label="苗栗文學步道52張實景照片"
        >
          {photos.map((photo) => (
            <figure key={photo.src}>
              <img
                src={photo.src}
                alt={`苗栗文學步道實景照片，第 ${photo.number} 張`}
                loading={photo.number <= 3 ? "eager" : "lazy"}
                decoding="async"
              />
              <figcaption>{String(photo.number).padStart(2, "0")} / 52</figcaption>
            </figure>
          ))}
        </div>
        <button className="gallery-arrow gallery-arrow-next" type="button" onClick={() => move(1)} aria-label="瀏覽下一批步道照片">→</button>
      </div>
      <p className="gallery-hint">拖曳、滑動或使用左右按鈕瀏覽完整相簿</p>
    </div>
  );
}
