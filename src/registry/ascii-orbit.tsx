"use client";
import { useEffect, useRef, useState } from "react";
import "./ascii-orbit.css";
// Sample the geometry densely once; frames only rotate and project it.
const around = Array.from({ length: 320 }, (_, i) => {
  const angle = (i / 320) * Math.PI * 2;
  return { angle, cos: Math.cos(angle), sin: Math.sin(angle) };
});
const tube = Array.from({ length: 128 }, (_, i) => {
  const angle = (i / 128) * Math.PI * 2;
  return { cos: Math.cos(angle), sin: Math.sin(angle) };
});
export function AsciiOrbit({
  color = "#d2d7e3",
  speed = 1,
  label = "Rotating ASCII torus",
}: {
  color?: string;
  speed?: number;
  label?: string;
}) {
  const root = useRef<HTMLDivElement>(null),
    output = useRef<HTMLPreElement>(null),
    phase = useRef(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = root.current!,
      pre = output.current!,
      media = matchMedia("(prefers-reduced-motion:reduce)");
    let frame = 0,
      visible = false,
      disposed = false,
      last = 0,
      cols = 72,
      rows = 28,
      pointer = 0;
    const paint = (now: number) => {
      if (disposed) return;
      if (now - last > 55 || paused || media.matches) {
        last = now;
        if (!paused && !media.matches)
          phase.current += 0.035 * Math.max(0, Math.min(speed, 3));
        const depth = new Float32Array(cols * rows);
        depth.fill(-Infinity);
        const screen = Array<string>(cols * rows).fill(" ");
        const chars = ".,:;irsXA253hMHGS#9B&@";
        const ax = phase.current * 0.47 + 0.5,
          ay = phase.current * 0.31 + pointer;
        const sx = Math.sin(ax),
          cx = Math.cos(ax),
          sy = Math.sin(ay),
          cy = Math.cos(ay);
        const scale = Math.min(cols * 0.18, rows * 0.28);
        for (const a of around)
          for (const b of tube) {
            const ring = 1.25 + 0.5 * b.cos;
            const x = ring * a.cos,
              y = ring * a.sin,
              z = 0.5 * b.sin;
            const ry = y * cx - z * sx,
              rz = y * sx + z * cx;
            const rx = x * cy + rz * sy,
              zz = -x * sy + rz * cy;
            const perspective = 4.5 / (6 - zz);
            const px = Math.round(cols / 2 + rx * scale * perspective * 1.8),
              py = Math.round(rows / 2 + ry * scale * perspective);
            if (px < 0 || px >= cols || py < 0 || py >= rows) continue;
            const idx = py * cols + px;
            if (zz > depth[idx]) {
              depth[idx] = zz;
              const light = Math.max(
                0,
                Math.min(1, 0.25 + 0.45 * b.cos + 0.3 * Math.sin(a.angle + ax)),
              );
              screen[idx] = chars[Math.floor(light * (chars.length - 1))];
            }
          }
        pre.textContent = Array.from({ length: rows }, (_, i) =>
          screen.slice(i * cols, (i + 1) * cols).join(""),
        ).join("\n");
      }
      if (visible && !paused && !media.matches && !document.hidden)
        frame = requestAnimationFrame(paint);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden) frame = requestAnimationFrame(paint);
    };
    const resize = new ResizeObserver(() => {
      cols = Math.max(80, Math.min(220, Math.floor(node.clientWidth / 3.2)));
      rows = Math.max(
        32,
        Math.min(84, Math.floor((node.clientHeight - 55) / 4.8)),
      );
      pre.style.fontSize = `${Math.min(node.clientWidth / (cols * 0.61), (node.clientHeight - 55) / (rows * 1.05))}px`;
      start();
    });
    resize.observe(node);
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      start();
    });
    observer.observe(node);
    const move = (event: PointerEvent) => {
      if (!media.matches)
        pointer =
          (event.clientX - node.getBoundingClientRect().left) /
            node.clientWidth -
          0.5;
    };
    node.addEventListener("pointermove", move);
    document.addEventListener("visibilitychange", start);
    media.addEventListener("change", start);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      node.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", start);
      media.removeEventListener("change", start);
    };
  }, [paused, speed]);
  return (
    <div ref={root} className="forme-ascii-orbit" style={{ color }}>
      <pre ref={output} role="img" aria-label={label} />
      <div className="forme-ascii-orbit-footer">
        <span>ASCII / Orbital study</span>
        <button onClick={() => setPaused(!paused)} aria-pressed={paused}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
