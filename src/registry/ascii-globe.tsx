"use client";
import { useEffect, useRef, useState } from "react";
import "./ascii-globe.css";

const ocean = " .,:";
const land = "-=+*#%@";
const hash = (x: number, y: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};
export function AsciiGlobe({
  color = "#8fd3ff",
  speed = 1,
  label = "Rotating ASCII globe",
}: {
  color?: string;
  speed?: number;
  label?: string;
}) {
  const root = useRef<HTMLDivElement>(null),
    output = useRef<HTMLPreElement>(null);
  const view = useRef({ yaw: 0, pitch: 0.35, spin: 0, dragging: false, x: 0, y: 0 });
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = root.current!,
      pre = output.current!,
      media = matchMedia("(prefers-reduced-motion:reduce)"),
      v = view.current;
    let frame = 0,
      visible = false,
      last = 0,
      cols = 96,
      rows = 44,
      clock = 0;
    const paint = () => {
      const R = rows * 0.44;
      const sy = Math.sin(v.yaw), cy = Math.cos(v.yaw);
      const sp = Math.sin(v.pitch), cp = Math.cos(v.pitch);
      let text = "";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nx = (c - cols / 2) / (R * 2.05),
            ny = (rows / 2 - r) / R,
            d2 = nx * nx + ny * ny;
          if (d2 > 1) {
            text += d2 < 1.05 ? "." : " ";
            continue;
          }
          const nz = Math.sqrt(1 - d2);
          const py = ny * cp - nz * sp, pz = ny * sp + nz * cp;
          const wx = nx * cy + pz * sy, wz = -nx * sy + pz * cy;
          const lon = Math.atan2(wx, wz), lat = Math.asin(Math.max(-1, Math.min(1, py)));
          const light = Math.max(0, -0.45 * nx + 0.45 * ny + 0.77 * nz);
          const gx = Math.abs(((lon / Math.PI) * 9 + 9) % 1 - 0.5),
            gy = Math.abs(((lat / Math.PI) * 9 + 9) % 1 - 0.5);
          const mass =
            Math.sin(lon * 2.3 + 1.1) * Math.sin(lat * 3.1 + lon * 0.9) +
            0.55 * Math.sin(lon * 5.7 - lat * 2.4);
          const cell = hash(Math.floor(lon * 6), Math.floor(lat * 6));
          if (mass > 0.38 && cell > 0.94 && Math.sin(clock * 3 + cell * 90) > 0.2)
            text += "@";
          else if (gx > 0.47 && gy > 0.47) text += "+";
          else if (mass > 0.38)
            text += land[Math.min(land.length - 1, Math.floor(light * land.length))];
          else if (gy > 0.485) text += "-";
          else if (gx > 0.485) text += "|";
          else text += ocean[Math.min(ocean.length - 1, Math.floor(light * ocean.length))];
        }
        text += "\n";
      }
      pre.textContent = text;
    };
    const tick = (now: number) => {
      if (now - last >= 50) {
        const moving = !paused && !media.matches;
        if (moving && !v.dragging) v.yaw += 0.018 * Math.max(0, Math.min(speed, 3)) + v.spin;
        v.spin *= 0.92;
        if (moving) clock += 0.05;
        last = now;
        paint();
      }
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      paint();
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(() => {
      const height = node.clientHeight - 40;
      rows = Math.max(26, Math.min(64, Math.floor(height / 7)));
      cols = Math.max(60, Math.min(180, Math.floor((node.clientWidth / height) * rows * 1.9)));
      pre.style.fontSize = `${Math.min(node.clientWidth / (cols * 0.6), height / (rows * 1.05))}px`;
      start();
    });
    resize.observe(node);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    observer.observe(node);
    document.addEventListener("visibilitychange", start);
    media.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", start);
      media.removeEventListener("change", start);
    };
  }, [paused, speed]);
  const v = view.current;
  return (
    <div
      ref={root}
      className="forme-ascii-globe"
      style={{ color }}
      tabIndex={0}
      role="img"
      aria-label={`${label}. Drag or use the arrow keys to rotate.`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        Object.assign(v, { dragging: true, x: e.clientX, y: e.clientY });
      }}
      onPointerMove={(e) => {
        if (!v.dragging) return;
        v.spin = (e.clientX - v.x) * 0.004;
        v.yaw += v.spin;
        v.pitch = Math.max(-1.2, Math.min(1.2, v.pitch + (e.clientY - v.y) * 0.006));
        v.x = e.clientX;
        v.y = e.clientY;
      }}
      onPointerUp={() => {
        v.dragging = false;
      }}
      onPointerCancel={() => {
        v.dragging = false;
      }}
      onKeyDown={(e) => {
        const step = { ArrowLeft: [-0.2, 0], ArrowRight: [0.2, 0], ArrowUp: [0, -0.15], ArrowDown: [0, 0.15] }[e.key];
        if (!step) return;
        e.preventDefault();
        v.yaw += step[0];
        v.pitch = Math.max(-1.2, Math.min(1.2, v.pitch + step[1]));
      }}
    >
      <pre ref={output} aria-hidden="true" />
      <div className="forme-ascii-globe-footer">
        <button
          aria-pressed={paused}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setPaused(!paused)}
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
