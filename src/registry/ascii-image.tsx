"use client";
import { useEffect, useRef, useState } from "react";
import "./ascii-image.css";
export function AsciiImage({
  src,
  alt,
  color = "#b7c3df",
}: {
  src: string;
  alt: string;
  color?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    root = useRef<HTMLButtonElement>(null);
  const [pinned, setPinned] = useState(false),
    [hover, setHover] = useState(false),
    [error, setError] = useState(false);
  useEffect(() => {
    let disposed = false;
    const node = canvas.current!;
    const image = new Image();
    image.crossOrigin = "anonymous";
    const paint = () => {
      if (disposed || !image.complete || !image.naturalWidth) return;
      const width = root.current!.clientWidth,
        height = root.current!.clientHeight;
      if (!width || !height) return;
      const cols = Math.max(24, Math.floor(width / 6)),
        rows = Math.max(18, Math.floor(height / 8));
      const sample = document.createElement("canvas");
      sample.width = cols;
      sample.height = rows;
      const context = sample.getContext("2d"),
        draw = node.getContext("2d");
      if (!context || !draw) return;
      const ratio = Math.max(
        cols / image.naturalWidth,
        rows / image.naturalHeight,
      );
      const w = image.naturalWidth * ratio,
        h = image.naturalHeight * ratio;
      context.drawImage(image, (cols - w) / 2, (rows - h) / 2, w, h);
      try {
        const pixels = context.getImageData(0, 0, cols, rows).data;
        node.width = width;
        node.height = height;
        draw.fillStyle = "#0b0d13";
        draw.fillRect(0, 0, width, height);
        draw.font = `${Math.ceil(width / cols)}px monospace`;
        draw.textBaseline = "top";
        const chars = " .:-=+*#%@";
        for (let y = 0; y < rows; y++)
          for (let x = 0; x < cols; x++) {
            const i = (y * cols + x) * 4;
            const light =
              (pixels[i] * 0.2126 +
                pixels[i + 1] * 0.7152 +
                pixels[i + 2] * 0.0722) /
              255;
            draw.globalAlpha = 0.25 + light * 0.75;
            draw.fillStyle = color;
            draw.fillText(
              chars[Math.floor(light * (chars.length - 1))],
              (x * width) / cols,
              (y * height) / rows,
            );
          }
        draw.globalAlpha = 1;
        setError(false);
      } catch {
        setError(true);
      }
    };
    image.onload = paint;
    image.onerror = () => setError(true);
    image.src = src;
    const resize = new ResizeObserver(paint);
    resize.observe(root.current!);
    return () => {
      disposed = true;
      image.onload = null;
      image.onerror = null;
      resize.disconnect();
    };
  }, [src, color]);
  return (
    <button
      ref={root}
      className="forme-ascii-image"
      aria-label={`${pinned ? "Hide" : "Reveal"} image: ${alt}`}
      aria-pressed={pinned}
      onPointerMove={(event) => {
        if (
          pinned ||
          event.pointerType !== "mouse" ||
          matchMedia("(prefers-reduced-motion:reduce)").matches
        )
          return;
        const r = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          "--x",
          `${event.clientX - r.left}px`,
        );
        event.currentTarget.style.setProperty(
          "--y",
          `${event.clientY - r.top}px`,
        );
        setHover(true);
      }}
      onPointerLeave={() => setHover(false)}
      onClick={(event) => {
        event.currentTarget.style.setProperty("--x", "50%");
        event.currentTarget.style.setProperty("--y", "50%");
        setPinned(!pinned);
      }}
    >
      <canvas ref={canvas} aria-hidden="true" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          clipPath: error
            ? "none"
            : `circle(${hover || pinned ? "85px" : "0px"} at var(--x,50%) var(--y,50%))`,
        }}
      />
      <span>
        Behind the characters.
        <span>{pinned ? "Tap to close" : "Move to discover"}</span>
      </span>
    </button>
  );
}
