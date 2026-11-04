import { useEffect, useState, type ReactNode } from "react";
import { catalog } from "./catalog";
import { SilkShader } from "./registry/silk-shader";
import { DitherShader } from "./registry/dither-shader";
import { HorizonShader } from "./registry/horizon-shader";
import { AuroraShader } from "./registry/aurora-shader";
import { ChromeShader } from "./registry/chrome-shader";
import { PrismButton } from "./registry/prism-button";
import { MagneticButton } from "./registry/magnetic-button";
import { LensButton } from "./registry/lens-button";
import { PlasmaButton } from "./registry/plasma-button";
import { HoldButton } from "./registry/hold-button";
import { ScrambleButton } from "./registry/scramble-button";
import { AsciiOrbit } from "./registry/ascii-orbit";
import { AsciiImage } from "./registry/ascii-image";
import { AsciiTide } from "./registry/ascii-tide";
import { EclipseHero } from "./registry/eclipse-hero";
import { SpotlightCard } from "./registry/spotlight-card";
import { BeamCard } from "./registry/beam-card";
import { CommandPalette } from "./registry/command-palette";
import { GlowInput } from "./registry/glow-input";
import { SegmentedSwitch } from "./registry/segmented-switch";
import { SignalSlider } from "./registry/signal-slider";
import { OrbitLoader } from "./registry/orbit-loader";
import { ShimmerText } from "./registry/shimmer-text";
import { ProgressBeam } from "./registry/progress-beam";
import { AsciiGlobe } from "./registry/ascii-globe";
import { AsciiBlackHole } from "./registry/ascii-black-hole";
import { AsciiSurface } from "./registry/ascii-surface";
import { CausticShader } from "./registry/caustic-shader";
import { SingularityShader } from "./registry/singularity-shader";
import { OrbitGauge } from "./registry/orbit-gauge";
import { ShutterButton } from "./registry/shutter-button";
import { AsciiDecode } from "./registry/ascii-decode";
import { TelemetryCard } from "./registry/telemetry-card";
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
  "aurora-shader": (p) => <AuroraShader color={p.color} speed={p.speed} />,
  "singularity-shader": (p) => <SingularityShader color={p.color} speed={p.speed} />,
  "caustic-shader": (p) => <CausticShader color={p.color} speed={p.speed} />,
  "ascii-black-hole": (p) => <AsciiBlackHole speed={p.speed} />,
  "ascii-surface": (p) => <AsciiSurface color={p.color} speed={p.speed} />,
  "orbit-gauge": () => <GaugeDemo />,
  "chrome-shader": (p) => <ChromeShader color={p.color} speed={p.speed} />,
  "ascii-orbit": (p) => <AsciiOrbit color={p.color} speed={p.speed} />,
  "ascii-tide": (p) => <AsciiTide color={p.color} speed={p.speed} />,
  "eclipse-hero": (p) => (
    <EclipseHero
      color={p.color}
      title={p.title || "Ship something worth looking at."}
      subtitle="Your one-line pitch goes here."
      actions={<LensButton>Get started</LensButton>}
    />
  ),
  "spotlight-card": () => (
    <div className="specimen">
      <SpotlightCard className="specimen-card">
        <CardBody title="Edge light" text="Move across this surface. The border and interior follow you." />
      </SpotlightCard>
    </div>
  ),
  "beam-card": () => (
    <div className="specimen">
      <BeamCard className="specimen-card">
        <CardBody title="Always on" text="A slow comet of light keeps circling, without demanding attention." />
      </BeamCard>
    </div>
  ),
  "command-palette": () => (
    <div className="specimen">
      <CommandPalette
        placeholder="Search commands"
        commands={[
          { id: "deploy", label: "Deploy to production", group: "Project", shortcut: "D" },
          { id: "invite", label: "Invite a teammate", group: "Team", shortcut: "I" },
          { id: "logs", label: "Open live logs", group: "Project", shortcut: "L" },
          { id: "theme", label: "Switch theme", group: "Settings", shortcut: "T" },
          { id: "keys", label: "Rotate API keys", group: "Settings" },
        ]}
      />
    </div>
  ),
  "glow-input": (p) => (
    <div className="specimen">
      <GlowInput label={p.title || "Work email"} type="email" hint="We only use this to reply." />
    </div>
  ),
  "segmented-switch": () => (
    <div className="specimen">
      <SegmentedSwitch label="Billing period" options={["Monthly", "Yearly", "Lifetime"]} />
    </div>
  ),
  "signal-slider": (p) => (
    <div className="specimen">
      <SignalSlider label="Output level" defaultValue={62} color={p.color} format={(v) => `${v}%`} />
    </div>
  ),
  "orbit-loader": (p) => (
    <div className="specimen">
      <OrbitLoader size={72} color={p.color} label="Loading preview" />
    </div>
  ),
  "shimmer-text": (p) => (
    <div className="specimen specimen-large">
      <ShimmerText>{p.title || "Generating your report"}</ShimmerText>
    </div>
  ),
  "progress-beam": (p) => <ProgressDemo color={p.color} />,
  "ascii-globe": (p) => <AsciiGlobe color={p.color} speed={p.speed} />,
  "radar-sweep": (p) => <RadarSweep color={p.color} speed={p.speed} />,
  oscilloscope: (p) => <Oscilloscope color={p.color} speed={p.speed} />,
  "ascii-image": (p) => {
    const src = p.image || "/images/architecture.jpg";
    return <AsciiImage src={src} alt={images[src]} color={p.color} />;
  },
  "ascii-decode": (p) => (
    <div className="decode-specimen">
      <AsciiDecode as="h3" text={p.title || "Signal acquired."} />
    </div>
  ),
  "telemetry-card": (p) => <TelemetryDemo color={p.color} />,
};
const buttons: Record<
  string,
  (label: ReactNode, select: () => void) => ReactNode
> = {
  "prism-button": (l, s) => <PrismButton onClick={s}>{l}</PrismButton>,
  "magnetic-button": (l, s) => <MagneticButton onClick={s}>{l}</MagneticButton>,
  "shutter-button": (l, s) => <ShutterButton onClick={s}>{l}</ShutterButton>,
  "lens-button": (l, s) => <LensButton onClick={s}>{l}</LensButton>,
  "plasma-button": (l, s) => <PlasmaButton onClick={s}>{l}</PlasmaButton>,
  "scramble-button": (l, s) => <ScrambleButton onClick={s}>{String(l)}</ScrambleButton>,
  "hold-button": (l, s) => <HoldButton onConfirm={s}>{l}</HoldButton>,
};

function CardBody({ title, text }: { title: string; text: string }) {
  return (
    <>
      <h3>{title}</h3>
      <p>{text}</p>
    </>
  );
}
function ProgressDemo({ color }: { color?: string }) {
  const [value, setValue] = useState(18);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 8 : Math.min(100, v + 9))), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="specimen">
      <div className="specimen-stack">
        <ProgressBeam value={value} label="Uploading" color={color} />
        <ProgressBeam label="Preparing" color={color} />
      </div>
    </div>
  );
}
/** Feeds the card a gentle random walk so the preview shows real updates. */
function TelemetryDemo({ color }: { color?: string }) {
  const [history, setHistory] = useState(() => {
    let v = 820;
    return Array.from({ length: 28 }, () => (v = Math.max(600, Math.min(999, v + (Math.random() - 0.45) * 40))));
  });
  useEffect(() => {
    const id = setInterval(
      () => setHistory((h) => [...h.slice(-39), Math.max(600, Math.min(999, h[h.length - 1] + (Math.random() - 0.45) * 40))]),
      1800,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <div className="telemetry-specimen">
      <TelemetryCard label="Throughput" value={history[history.length - 1]} history={history} unit="MB/s" color={color} />
    </div>
  );
}

function GaugeDemo() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((n) => n + 1), 2200);
    return () => clearInterval(id);
  }, []);
  const [cpu, memory, disk] = [
    [0.72, 0.48, 0.31],
    [0.86, 0.55, 0.36],
    [0.64, 0.61, 0.42],
    [0.91, 0.44, 0.33],
  ][step % 4];
  return (
    <div className="specimen">
      <OrbitGauge
        title="Capacity"
        metrics={[
          { label: "CPU", value: cpu, color: "#8ab4ff" },
          { label: "Memory", value: memory, color: "#c4b5fd" },
          { label: "Disk", value: disk, color: "#5eead4" },
        ]}
      />
    </div>
  );
}

export function Demo({
  slug,
  title,
  image,
  color,
  speed = 1,
  hint = false,
}: {
  slug: string;
  title?: string;
  image?: string;
  color?: string;
  speed?: number;
  hint?: boolean;
}) {
  const [selected, setSelected] = useState(false);
  const item = catalog.find((c) => c.slug === slug);
  if (live[slug]) return live[slug]({ color, speed, title, image });
  const label = title || item?.text || "Activate";
  return (
    <div className={`button-specimen specimen-${slug}`}>
      {buttons[slug]?.(label, () => setSelected((s) => !s))}
      {hint && (
        <span className="specimen-hint" role="status">
          {selected
            ? slug === "hold-button"
              ? "Confirmed. Wire onConfirm to your action."
              : "Clicked. Wire onClick to your action."
            : slug === "hold-button"
              ? "Press and hold, or hold Space."
              : "Hover, focus, or click."}
        </span>
      )}
    </div>
  );
}
