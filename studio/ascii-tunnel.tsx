"use client";
import { useEffect, useRef, useState } from "react";
import "./ascii-tunnel.css";

const ramp = " .:-=+*#%@";
export function AsciiTunnel({
  color = "#ffb86b",
  speed = 1,
  label = "An endless ASCII tunnel",
}: {
  color?: string;
  speed?: number;
  label?: string;
}) {
  const root = useRef<HTMLDivElement>(null),
    output = useRef<HTMLPreElement>(null),
    aim = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = root.current!,
      pre = output.current!,
      media = matchMedia("(prefers-reduced-motion:reduce)"),
      a = aim.current;
    let frame = 0,
      visible = false,
      last = 0,
      t = 0,
      cols = 110,
      rows = 44;
    const paint = () => {
      a.x += (a.tx - a.x) * 0.08;
      a.y += (a.ty - a.y) * 0.08;
      let text = "";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ((c / cols - 0.5) * cols * 0.55) / rows - a.x * 0.35,
            y = r / rows - 0.5 - a.y * 0.25;
          const dist = Math.hypot(x, y) + 0.0001;
          const angle = Math.atan2(y, x) / Math.PI;
          const depth = 0.42 / dist + t * 1.8;
          const twist = angle * 4 + depth * 0.12 + t * 0.2;
          const tile = (Math.floor(depth * 2) + Math.floor(twist * 2)) & 1;
          const ring = Math.abs(((depth * 2) % 1) - 0.5) > 0.42 ? 1 : 0;
          // Far walls fade into darkness; near walls carry the pattern.
          const fog = Math.min(1, Math.pow(dist * 2.1, 1.6));
          const value = fog * (tile ? 0.78 : 0.22) + ring * fog * 0.35;
          text += ramp[Math.min(ramp.length - 1, Math.floor(value * ramp.length))];
        }
        text += "\n";
      }
      pre.textContent = text;
    };
    const tick = (now: number) => {
      if (now - last >= 45) {
        last = now;
        t += 0.045 * Math.max(0, Math.min(speed, 3));
        paint();
      }
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      paint();
      if (visible && !document.hidden && !paused && !media.matches)
        frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(() => {
      const height = node.clientHeight - 40;
      rows = Math.max(26, Math.min(70, Math.floor(height / 7)));
      cols = Math.max(60, Math.min(200, Math.floor((node.clientWidth / height) * rows * 1.75)));
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
  return (
    <div
      ref={root}
      className="forme-ascii-tunnel"
      style={{ color }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        aim.current.tx = (e.clientX - r.left) / r.width - 0.5;
        aim.current.ty = (e.clientY - r.top) / r.height - 0.5;
      }}
      onPointerLeave={() => {
        aim.current.tx = aim.current.ty = 0;
      }}
    >
      <pre ref={output} role="img" aria-label={label} />
      <div className="forme-ascii-tunnel-footer">
        <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
