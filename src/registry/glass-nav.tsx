"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import "./glass-nav.css";

export interface GlassNavLink {
  label: string;
  href: string;
  active?: boolean;
}

// Liquid glass: an SVG displacement filter used as a backdrop-filter bends whatever is behind
// the bar at its rim, magnifying toward the edge like a lens. Only Chromium supports url() in
// backdrop-filter; everywhere else the frosted CSS glass stays as it is.
const BEZEL = 22; // px width of the refracting rim
const SCALE = 18; // max displacement in px: enough to bend, not enough to mirror

// Signed distance to a rounded rectangle centred in a w×h box (negative inside).
function sdf(x: number, y: number, w: number, h: number, r: number) {
  const px = Math.abs(x - w / 2) - (w / 2 - r),
    py = Math.abs(y - h / 2) - (h / 2 - r);
  return Math.hypot(Math.max(px, 0), Math.max(py, 0)) + Math.min(Math.max(px, py), 0) - r;
}
function lensMap(w: number, h: number, r: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext("2d");
  if (!context) return "";
  const image = context.createImageData(w, h),
    d = image.data;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4,
        dist = -sdf(x + 0.5, y + 0.5, w, h, r);
      let dx = 0,
        dy = 0;
      if (dist > 0 && dist < BEZEL) {
        const gx = sdf(x + 1.5, y + 0.5, w, h, r) - sdf(x - 0.5, y + 0.5, w, h, r);
        const gy = sdf(x + 0.5, y + 1.5, w, h, r) - sdf(x + 0.5, y - 0.5, w, h, r);
        const len = Math.hypot(gx, gy) || 1,
          t = 1 - dist / BEZEL;
        const mag = t * t * (3 - 2 * t); // strongest right at the rim
        dx = (-gx / len) * mag; // sample from further inside, so the edge magnifies
        dy = (-gy / len) * mag;
      }
      d[i] = 128 + dx * 127;
      d[i + 1] = 128 + dy * 127;
      d[i + 2] = 128;
      d[i + 3] = 255;
    }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL();
}
const chromium = () => {
  const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands ?? [];
  return brands.some((b) => /Chromium|Google Chrome|Microsoft Edge/.test(b.brand));
};

/** A floating glass navigation bar: frosted, rim-lit, and on Chromium it refracts what's behind it. */
export function GlassNav({
  brand,
  links,
  actions,
  label = "Main",
  liquid = true,
  className = "",
}: {
  brand: ReactNode;
  links: GlassNavLink[];
  /** Buttons or links on the right, such as a call to action. */
  actions?: ReactNode;
  label?: string;
  /** Refract the backdrop at the rim, where the browser supports it. */
  liquid?: boolean;
  className?: string;
}) {
  const bar = useRef<HTMLDivElement>(null);
  const filter = useRef<SVGFilterElement>(null);
  const image = useRef<SVGFEImageElement>(null);
  const id = `forme-glass-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const [open, setOpen] = useState(false);
  const [refracting, setRefracting] = useState(false);

  useEffect(() => {
    const el = bar.current;
    if (!liquid || !el || !chromium()) return;
    let last = "";
    const build = () => {
      const w = Math.round(el.offsetWidth),
        h = Math.round(el.offsetHeight);
      if (!w || !h || `${w}x${h}` === last) return;
      last = `${w}x${h}`;
      const r = Math.min(h / 2, parseFloat(getComputedStyle(el).borderTopLeftRadius) || h / 2);
      const map = lensMap(w, h, r);
      if (!map || !filter.current || !image.current) return;
      for (const node of [filter.current, image.current]) {
        node.setAttribute("width", String(w));
        node.setAttribute("height", String(h));
      }
      image.current.setAttribute("href", map);
      // Set inline: url(#id) inside a stylesheet would resolve against the stylesheet's URL.
      el.style.setProperty("backdrop-filter", `url(#${id})`);
      el.style.setProperty("-webkit-backdrop-filter", `url(#${id})`);
      setRefracting(true);
    };
    build();
    const resize = new ResizeObserver(build);
    resize.observe(el);
    return () => {
      resize.disconnect();
      el.style.removeProperty("backdrop-filter");
      el.style.removeProperty("-webkit-backdrop-filter");
      setRefracting(false);
    };
  }, [liquid, id]);

  // Close the narrow-screen menu on Escape and return focus to its button.
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open]);

  const menuId = `${id}-menu`;
  return (
    // The landmark wraps the bar and the narrow-screen menu. The menu sits outside the bar,
    // because a glass panel nested in the glass bar would lose its own blur.
    <nav aria-label={label} className={`forme-glass-nav ${className}`}>
      <div ref={bar} className={`forme-glass-bar${refracting ? " is-liquid" : ""}`}>
        <div className="forme-glass-brand">{brand}</div>
        <ul className="forme-glass-links">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} data-active={link.active || undefined} aria-current={link.active ? "page" : undefined}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="forme-glass-actions">
          {actions}
          <button
            ref={menuButton}
            type="button"
            className="forme-glass-menu-button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen(!open)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <filter
            ref={filter}
            id={id}
            x="0"
            y="0"
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="soft" />
            <feImage ref={image} result="map" x="0" y="0" preserveAspectRatio="none" />
            <feDisplacementMap in="soft" in2="map" scale={SCALE} xChannelSelector="R" yChannelSelector="G" result="bent" />
            <feColorMatrix in="bent" type="saturate" values="1.35" />
          </filter>
        </svg>
      </div>
      <ul id={menuId} className="forme-glass-menu" hidden={!open}>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} aria-current={link.active ? "page" : undefined} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
