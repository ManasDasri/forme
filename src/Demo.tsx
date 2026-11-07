import { useEffect, useState, type ReactNode } from "react";
import { catalog } from "./catalog";
import { SilkShader } from "./registry/silk-shader";
import { DitherShader } from "./registry/dither-shader";
import { HorizonShader } from "./registry/horizon-shader";
import { AuroraShader } from "./registry/aurora-shader";
import { PrismButton } from "./registry/prism-button";
import { MagneticButton } from "./registry/magnetic-button";
import { LensButton } from "./registry/lens-button";
import { PlasmaButton } from "./registry/plasma-button";
import { HoldButton } from "./registry/hold-button";
import { ScrambleButton } from "./registry/scramble-button";
import { AsciiBanner } from "./registry/ascii-banner";
import { WordRotator } from "./registry/word-rotator";
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
import { AsciiBlackHole } from "./registry/ascii-black-hole";
import { ContoursShader } from "./registry/contours-shader";
import { CausticShader } from "./registry/caustic-shader";
import { ShutterButton } from "./registry/shutter-button";
import { Dock } from "./registry/dock";
import { AnimatedTabs } from "./registry/animated-tabs";
import { toast } from "./registry/toast";
import { Tooltip } from "./registry/tooltip";
import { TextReveal } from "./registry/text-reveal";
import { NumberTicker } from "./registry/number-ticker";
import { OtpInput } from "./registry/otp-input";
import { CopyButton } from "./registry/copy-button";
import { Accordion } from "./registry/accordion";
import { Marquee } from "./registry/marquee";
import { ImageCompare } from "./registry/image-compare";
import { MeshGradientShader } from "./registry/mesh-gradient-shader";
import { LightRaysShader } from "./registry/light-rays-shader";
import { DotGrid } from "./registry/dot-grid";
import { GradientText } from "./registry/gradient-text";
import { TypingDots } from "./registry/typing-dots";
import { Spinner } from "./registry/spinner";
import { Skeleton, SkeletonGroup } from "./registry/skeleton";
import { InfinityLoader } from "./registry/infinity-loader";
import { Equalizer } from "./registry/equalizer";
import { TelemetryCard } from "./registry/telemetry-card";
import { RadarSweep } from "./registry/radar-sweep";
import { Oscilloscope } from "./registry/oscilloscope";

type Props = { color?: string; speed: number; title?: string; image?: string };
const images: Record<string, string> = {
  "/images/architecture.jpg": "A stepped glass building viewed from below",
  "/images/interior.jpg": "A bright living room with sculptural furniture",
  "/images/landscape.jpg": "Mountains reflected in a lake",
};
const glyph = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const dockIcons = {
  Home: glyph("M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"),
  Search: glyph("M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4 4"),
  Projects: glyph("M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"),
  Inbox: glyph("M4 13h4l2 3h4l2-3h4M4 13l2-7h12l2 7v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"),
  Calendar: glyph("M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm-1 5h16M8 3v4m8-4v4"),
  Settings: glyph("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7-3 2-1-1-3-2 .5-1.5-1.5L17 5l-3-1-1 2h-2L10 4 7 5l.5 2L6 8.5 4 8l-1 3 2 1v0l-2 1 1 3 2-.5 1.5 1.5L7 19l3 1 1-2h2l1 2 3-1-.5-2 1.5-1.5 2 .5 1-3z"),
};
const live: Record<string, (p: Props) => ReactNode> = {
  "mesh-gradient-shader": (p) => <MeshGradientShader speed={p.speed} />,
  "light-rays-shader": (p) => <LightRaysShader color={p.color} speed={p.speed} />,
  "dot-grid": () => (
    <div className="specimen dot-specimen">
      <DotGrid />
      <p className="dot-specimen-copy">Move across the grid</p>
    </div>
  ),
  "gradient-text": (p) => (
    <div className="specimen">
      <GradientText as="h3" className="gradient-specimen" text={p.title || "Build something unforgettable."} />
    </div>
  ),
  "typing-dots": () => (
    <div className="specimen">
      <div className="chat-specimen">
        <p className="chat-bubble">Can you summarize the launch notes?</p>
        <TypingDots label="Assistant is typing" />
      </div>
    </div>
  ),
  spinner: () => (
    <div className="specimen">
      <div className="row loader-row">
        <Spinner size={18} />
        <Spinner size={28} />
        <Spinner size={44} />
        <button className="btn btn-secondary" disabled>
          <Spinner size={14} label="Saving" /> Saving
        </button>
      </div>
    </div>
  ),
  skeleton: () => (
    <div className="specimen">
      <div className="specimen-card skeleton-card">
        <SkeletonGroup label="Loading profile">
          <div className="skeleton-head">
            <Skeleton width={44} height={44} radius="50%" />
            <div className="skeleton-lines">
              <Skeleton width="55%" height={13} />
              <Skeleton width="35%" height={11} />
            </div>
          </div>
          <Skeleton height={84} radius={12} />
          <Skeleton width="92%" />
          <Skeleton width="78%" />
        </SkeletonGroup>
      </div>
    </div>
  ),
  "infinity-loader": (p) => (
    <div className="specimen">
      <InfinityLoader size={96} color={p.color} />
    </div>
  ),
  equalizer: () => (
    <div className="specimen">
      <div className="row loader-row">
        <Equalizer />
        <Equalizer bars={7} height={40} />
        <span className="now-playing">
          <Equalizer bars={3} height={14} label="Now playing" /> Now playing
        </span>
      </div>
    </div>
  ),
  dock: () => (
    <div className="specimen dock-specimen">
      <Dock
        items={Object.entries(dockIcons).map(([label, icon], i) => ({
          label,
          icon,
          active: i === 0,
          onClick: () => toast(label, { description: "Dock items are real links or buttons." }),
        }))}
      />
    </div>
  ),
  "animated-tabs": () => (
    <div className="specimen">
      <div className="specimen-wide">
        <AnimatedTabs
          label="Plan details"
          tabs={[
            { id: "overview", label: "Overview", content: <p>Everything you need to ship a polished interface, in one place.</p> },
            { id: "pricing", label: "Pricing", content: <p>Free for every component. Keep the source, change anything.</p> },
            { id: "changelog", label: "Changelog", content: <p>Eleven new components this week, from Dock to Toast.</p> },
            { id: "faq", label: "FAQ", content: <p>Use the arrow keys, Home, and End to move between tabs.</p> },
          ]}
        />
      </div>
    </div>
  ),
  toast: () => (
    <div className="specimen">
      <div className="specimen-card toast-scene">
        <div className="toast-scene-row">
          <div>
            <strong>Launch checklist</strong>
            <span>Edited 2 minutes ago</span>
          </div>
          <button className="toast-scene-button is-primary" onClick={() => toast("Changes saved", { description: "Launch checklist is up to date.", tone: "success" })}>
            Save
          </button>
        </div>
        <div className="toast-scene-row">
          <div>
            <strong>Q3 report.pdf</strong>
            <span>2.4 MB</span>
          </div>
          <button
            className="toast-scene-button"
            onClick={() =>
              toast("File deleted", {
                description: "Q3 report.pdf",
                action: { label: "Undo", onClick: () => toast("File restored", { tone: "success" }) },
              })
            }
          >
            Delete
          </button>
        </div>
        <div className="toast-scene-row">
          <div>
            <strong>Production</strong>
            <span>Build 412</span>
          </div>
          <button className="toast-scene-button" onClick={() => toast("Deploy failed", { description: "Build 412 exited with code 1.", tone: "error" })}>
            Deploy
          </button>
        </div>
      </div>
    </div>
  ),
  tooltip: () => (
    <div className="specimen">
      <div className="row">
        <Tooltip content="Copy link to this page">
          <button className="btn btn-secondary">Share</button>
        </Tooltip>
        <Tooltip content="Saved drafts stay for 30 days" side="bottom">
          <button className="btn btn-secondary">Drafts</button>
        </Tooltip>
        <Tooltip content="Archive (E)">
          <button className="btn btn-secondary">Archive</button>
        </Tooltip>
      </div>
    </div>
  ),
  "text-reveal": (p) => (
    <div className="specimen">
      <TextReveal as="h3" className="reveal-specimen" text={p.title || "We build tools for people who sweat the details, and it shows in every one of them."} />
    </div>
  ),
  "number-ticker": () => (
    <div className="specimen">
      <div className="stats">
        <div>
          <strong>
            <NumberTicker value={12480} format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} />
          </strong>
          <span className="stat-label">Monthly revenue</span>
        </div>
        <div>
          <strong>
            <NumberTicker value={0.9987} format={{ style: "percent", minimumFractionDigits: 2 }} />
          </strong>
          <span className="stat-label">Uptime</span>
        </div>
        <div>
          <strong>
            <NumberTicker value={1240000} format={{ notation: "compact", maximumFractionDigits: 1 }} />
          </strong>
          <span className="stat-label">Requests</span>
        </div>
      </div>
    </div>
  ),
  "otp-input": () => (
    <div className="specimen">
      <OtpInput onComplete={(code) => toast("Code entered", { description: `${code}. Wire onComplete to your check.`, tone: "success" })} />
    </div>
  ),
  "copy-button": () => (
    <div className="specimen">
      <div className="code-line">
        <code>npx shadcn@latest add forme/copy-button</code>
        <CopyButton value="npx shadcn@latest add https://forme.vercel.app/r/copy-button.json" label="Copy install command" />
      </div>
    </div>
  ),
  accordion: () => (
    <div className="specimen">
      <div className="specimen-wide">
        <Accordion
          defaultOpen={["free"]}
          items={[
            { id: "free", title: "Is everything really free?", content: "Yes. Every component installs with its full source, and nothing phones home." },
            { id: "frameworks", title: "Which frameworks does it work with?", content: "Any React app. It has been installed and tested in Next.js and Vite projects." },
            { id: "themes", title: "Will it match my site?", content: "Components like this one draw from your text color, so they follow light and dark pages." },
            { id: "a11y", title: "What about accessibility?", content: "Real buttons, labelled regions, and closed panels that keyboard focus skips." },
          ]}
        />
      </div>
    </div>
  ),
  marquee: () => (
    <div className="specimen">
      <div className="specimen-wide" style={{ width: "100%" }}>
        <Marquee label="Teams using the product" duration={28}>
          {["Northwind", "Lumen", "Halcyon", "Parallax", "Quill & Co", "Meridian", "Arcadia", "Foundry"].map((name) => (
            <span key={name} className="wordmark-chip">
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  ),
  "image-compare": () => (
    <div className="specimen">
      <div className="specimen-wide">
        <ImageCompare
          before="/images/landscape-raw.jpg"
          beforeAlt="Mountains reflected in a lake, as shot: flat and grey"
          after="/images/landscape.jpg"
          afterAlt="The same photo after color grading, with deep blues and warm light"
          beforeLabel="As shot"
          afterLabel="Graded"
        />
      </div>
    </div>
  ),
  "silk-shader": (p) => <SilkShader color={p.color} speed={p.speed} />,
  "dither-shader": (p) => <DitherShader color={p.color} speed={p.speed} />,
  "horizon-shader": (p) => <HorizonShader color={p.color} speed={p.speed} />,
  "aurora-shader": (p) => <AuroraShader color={p.color} speed={p.speed} />,
  "caustic-shader": (p) => <CausticShader color={p.color} speed={p.speed} />,
  "ascii-black-hole": (p) => <AsciiBlackHole speed={p.speed} />,
  "contours-shader": (p) => <ContoursShader color={p.color} speed={p.speed} />,
  "ascii-banner": (p) => <AsciiBanner text={p.title || "FORME"} color={p.color} speed={p.speed} />,
  "word-rotator": () => (
    <div className="specimen">
      <h3 className="rotator-specimen">
        Build interfaces <WordRotator words={["faster", "together", "that feel alive the moment they load", "people remember"]} from="#a5b4fc" to="#f0abfc" />
      </h3>
    </div>
  ),
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
  "radar-sweep": (p) => <RadarSweep color={p.color} speed={p.speed} />,
  oscilloscope: (p) => <Oscilloscope color={p.color} speed={p.speed} />,
  "ascii-image": (p) => {
    const src = p.image || "/images/architecture.jpg";
    return <AsciiImage src={src} alt={images[src]} color={p.color} />;
  },

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
