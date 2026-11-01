import { useEffect, useRef, useState, type ReactNode } from "react";
import { catalog } from "./catalog";
import { SilkShader } from "./registry/silk-shader";
import { DitherShader } from "./registry/dither-shader";
import { HorizonShader } from "./registry/horizon-shader";
import { WarpShader } from "./registry/warp-shader";
import { HologramShader } from "./registry/hologram-shader";
import { PrismButton } from "./registry/prism-button";
import { MagneticButton } from "./registry/magnetic-button";
import { GlitchButton } from "./registry/glitch-button";
import { PlasmaButton } from "./registry/plasma-button";
import { HoldButton } from "./registry/hold-button";
import { ScrambleButton } from "./registry/scramble-button";
import { AsciiOrbit } from "./registry/ascii-orbit";
import { AsciiImage } from "./registry/ascii-image";
import { AsciiRain } from "./registry/ascii-rain";
import { AsciiGlobe } from "./registry/ascii-globe";
import { AsciiDecode } from "./registry/ascii-decode";
import { HudFrame } from "./registry/hud-frame";
import { RadarSweep } from "./registry/radar-sweep";
import { Oscilloscope } from "./registry/oscilloscope";

type Props = { color?: string; speed: number; title?: string; image?: string };
const images: Record<string, string> = {
  "/images/architecture.jpg": "A stepped glass building viewed from below",
  "/images/interior.jpg": "A bright living room with sculptural furniture",
  "/images/landscape.jpg": "Mountains reflected in a lake",
};
const live: Record<string, (p: Props) => ReactNode> = {
  "silk-shader": (p) => <SilkShader color={p.color} speed={p.speed} />,
  "dither-shader": (p) => <DitherShader color={p.color} speed={p.speed} />,
  "horizon-shader": (p) => <HorizonShader color={p.color} speed={p.speed} />,
  "warp-shader": (p) => <WarpShader color={p.color} speed={p.speed} />,
  "hologram-shader": (p) => <HologramShader color={p.color} speed={p.speed} />,
  "ascii-orbit": (p) => <AsciiOrbit color={p.color} speed={p.speed} />,
  "ascii-rain": (p) => <AsciiRain color={p.color} speed={p.speed} />,
  "ascii-globe": (p) => <AsciiGlobe color={p.color} speed={p.speed} />,
  "radar-sweep": (p) => <RadarSweep color={p.color} speed={p.speed} />,
  oscilloscope: (p) => <Oscilloscope color={p.color} speed={p.speed} />,
  "ascii-image": (p) => {
    const src = p.image || "/images/architecture.jpg";
    return <AsciiImage src={src} alt={images[src]} color={p.color} />;
  },
  "ascii-decode": (p) => (
    <div className="decode-specimen" style={{ color: p.color }}>
      <span className="specimen-kicker">Incoming transmission</span>
      <AsciiDecode as="h3" text={p.title || "Signal acquired."} />
      <span className="specimen-kicker">Hover to decode again</span>
    </div>
  ),
  "hud-frame": () => (
    <div className="hud-specimen">
      <HudFrame label="Uplink" status="Live" code="SIG-01">
        <div className="hud-specimen-readout">
          <strong>042.7</strong>
          <span>kHz · carrier locked</span>
        </div>
      </HudFrame>
    </div>
  ),
};
const buttons: Record<
  string,
  (label: ReactNode, select: () => void) => ReactNode
> = {
  "prism-button": (l, s) => <PrismButton onClick={s}>{l}</PrismButton>,
  "magnetic-button": (l, s) => <MagneticButton onClick={s}>{l}</MagneticButton>,
  "glitch-button": (l, s) => <GlitchButton onClick={s}>{l}</GlitchButton>,
  "plasma-button": (l, s) => <PlasmaButton onClick={s}>{l}</PlasmaButton>,
  "scramble-button": (l, s) => <ScrambleButton onClick={s}>{String(l)}</ScrambleButton>,
  "hold-button": (l, s) => <HoldButton onConfirm={s}>{l}</HoldButton>,
};

/** Studio pieces ship as recordings: their source never enters this bundle. */
export function StudioPreview({ slug }: { slug: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const name = catalog.find((c) => c.slug === slug)?.name;
  useEffect(() => {
    const node = video.current!;
    const media = matchMedia("(prefers-reduced-motion:reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !media.matches) node.play().catch(() => {});
      else node.pause();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="studio-preview">
      <video
        ref={video}
        src={`/studio/${slug}.mp4`}
        poster={`/studio/${slug}.jpg`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`Recorded preview of ${name}`}
      />
      <span className="studio-preview-tag">Recorded preview</span>
    </div>
  );
}

export function Demo({
  slug,
  title,
  image,
  color,
  speed = 1,
}: {
  slug: string;
  title?: string;
  image?: string;
  color?: string;
  speed?: number;
}) {
  const [selected, setSelected] = useState(false);
  const item = catalog.find((c) => c.slug === slug);
  if (item?.access === "studio") return <StudioPreview slug={slug} />;
  if (live[slug]) return live[slug]({ color, speed, title, image });
  const label = title || item?.text || "Activate";
  return (
    <div className={`button-specimen specimen-${slug}`}>
      <span className="specimen-kicker">{item?.name}</span>
      {buttons[slug]?.(label, () => setSelected((s) => !s))}
      <span className="specimen-hint" role="status">
        {selected
          ? slug === "hold-button"
            ? "Confirmed. Wire onConfirm to your action."
            : "Received. Connect this to your own action."
          : slug === "hold-button"
            ? "Press and hold, or hold Space."
            : "Hover, focus, or press."}
      </span>
    </div>
  );
}
