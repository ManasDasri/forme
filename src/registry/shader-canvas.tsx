"use client";
import { useEffect, useRef, useState } from "react";
import "./shader-canvas.css";

export interface ShaderCanvasProps {
  fragment: string;
  color?: string;
  speed?: number;
  label?: string;
  interactive?: boolean;
}
const toRgb = (color: string) => {
  const hex = /^#[0-9a-f]{6}$/i.test(color) ? color : "#5376ff";
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
};
/** Small shared WebGL runtime. Offscreen and hidden canvases stop rendering.
 * Color and speed are uniforms: changing them never recompiles the program. */
export function ShaderCanvas({
  fragment,
  color = "#5376ff",
  speed = 1,
  label = "Interactive shader",
  interactive = true,
}: ShaderCanvasProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ rgb: toRgb(color), speed, redraw: () => {} });
  live.current.rgb = toRgb(color);
  live.current.speed = Math.max(0, Math.min(speed, 3));
  const [fallback, setFallback] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const node = canvas.current!;
    const gl = node.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      setFallback(true);
      return;
    }
    let disposed = false,
      frame = 0,
      visible = false,
      last = 0,
      phase = 0;
    let pointer = [0.5, 0.5];
    const media = matchMedia("(prefers-reduced-motion:reduce)");
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      shaders.push(shader);
      return shader;
    };
    const vertex = compile(
      gl.VERTEX_SHADER,
      "attribute vec2 a_position; void main(){gl_Position=vec4(a_position,0.0,1.0);}",
    );
    const pixel = compile(gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const release = () => {
      shaders.forEach((s) => gl.deleteShader(s));
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
    };
    if (!vertex || !pixel || !program || !buffer) {
      release();
      setFallback(true);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, pixel);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      release();
      setFallback(true);
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "u_resolution"),
      time = gl.getUniformLocation(program, "u_time"),
      mouse = gl.getUniformLocation(program, "u_mouse"),
      tint = gl.getUniformLocation(program, "u_color");
    const render = () => {
      if (disposed || gl.isContextLost()) return;
      const { rgb } = live.current;
      gl.viewport(0, 0, node.width, node.height);
      gl.uniform2f(resolution, node.width, node.height);
      gl.uniform1f(time, media.matches ? 0 : phase);
      gl.uniform2f(mouse, pointer[0], pointer[1]);
      gl.uniform3f(tint, rgb[0], rgb[1], rgb[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    const draw = (now: number) => {
      if (disposed || gl.isContextLost()) return;
      if (now - last >= 32) {
        // Accumulate phase so speed changes never jump the animation.
        phase += Math.min(now - last, 100) * 0.001 * live.current.speed;
        last = now;
        render();
      }
      if (visible && !document.hidden && !media.matches)
        frame = requestAnimationFrame(draw);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      if (visible && !document.hidden && !media.matches)
        frame = requestAnimationFrame(draw);
      else render();
    };
    live.current.redraw = render;
    const resize = new ResizeObserver(() => {
      const r = node.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, 1.25);
      node.width = Math.max(1, Math.round(r.width * ratio));
      node.height = Math.max(1, Math.round(r.height * ratio));
      render();
    });
    resize.observe(node);
    const intersection = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      start();
    });
    intersection.observe(node);
    const move = (event: PointerEvent) => {
      if (media.matches) return;
      const r = node.getBoundingClientRect();
      pointer = [
        (event.clientX - r.left) / r.width,
        1 - (event.clientY - r.top) / r.height,
      ];
    };
    const lost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      setFallback(true);
    };
    const restored = () => {
      setFallback(false);
      setRevision((v) => v + 1);
    };
    if (interactive) node.addEventListener("pointermove", move);
    node.addEventListener("webglcontextlost", lost);
    node.addEventListener("webglcontextrestored", restored);
    document.addEventListener("visibilitychange", start);
    media.addEventListener("change", start);
    setFallback(false);
    return () => {
      disposed = true;
      live.current.redraw = () => {};
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      node.removeEventListener("pointermove", move);
      node.removeEventListener("webglcontextlost", lost);
      node.removeEventListener("webglcontextrestored", restored);
      document.removeEventListener("visibilitychange", start);
      media.removeEventListener("change", start);
      if (!gl.isContextLost()) release();
    };
  }, [fragment, revision, interactive]);
  // Paused or reduced-motion canvases still reflect a new color immediately.
  useEffect(() => live.current.redraw(), [color]);
  return (
    <div
      className="forme-shader"
      data-fallback={fallback || undefined}
      style={{
        background: `radial-gradient(ellipse at 65% 35%,${color},#070912 75%)`,
      }}
    >
      <canvas ref={canvas} role="img" aria-label={label} />
      <span className="forme-shader-caption">
        {label}
        <span>
          {fallback
            ? "Static fallback"
            : interactive
              ? "Move to explore"
              : "Ambient shader"}
        </span>
      </span>
    </div>
  );
}
