"use client";
// One sample render per component, used by the install smoke test in CI.
// scripts/smoke.test.mjs fails if a catalog component has no entry here.
import type { ReactNode } from "react";
import { HorizonShader } from "@/components/forme/horizon-shader";
import { LensButton } from "@/components/forme/lens-button";
import { HoldButton } from "@/components/forme/hold-button";
import { RadarSweep } from "@/components/forme/radar-sweep";
import { EclipseHero } from "@/components/forme/eclipse-hero";
import { SpotlightCard } from "@/components/forme/spotlight-card";
import { BeamCard } from "@/components/forme/beam-card";
import { CommandPalette } from "@/components/forme/command-palette";
import { GlowInput } from "@/components/forme/glow-input";
import { SegmentedSwitch } from "@/components/forme/segmented-switch";
import { SignalSlider } from "@/components/forme/signal-slider";
import { OrbitLoader } from "@/components/forme/orbit-loader";
import { ShimmerText } from "@/components/forme/shimmer-text";
import { ProgressBeam } from "@/components/forme/progress-beam";
import { Dock } from "@/components/forme/dock";
import { AnimatedTabs } from "@/components/forme/animated-tabs";
import { Toaster, toast } from "@/components/forme/toast";
import { Tooltip } from "@/components/forme/tooltip";
import { TextReveal } from "@/components/forme/text-reveal";
import { NumberTicker } from "@/components/forme/number-ticker";
import { OtpInput } from "@/components/forme/otp-input";
import { CopyButton } from "@/components/forme/copy-button";
import { Accordion } from "@/components/forme/accordion";
import { Marquee } from "@/components/forme/marquee";
import { ImageCompare } from "@/components/forme/image-compare";
import { MeshGradientShader } from "@/components/forme/mesh-gradient-shader";
import { LightRaysShader } from "@/components/forme/light-rays-shader";
import { DotGrid } from "@/components/forme/dot-grid";
import { GradientText } from "@/components/forme/gradient-text";
import { TypingDots } from "@/components/forme/typing-dots";
import { Spinner } from "@/components/forme/spinner";
import { Skeleton, SkeletonGroup } from "@/components/forme/skeleton";
import { InfinityLoader } from "@/components/forme/infinity-loader";
import { Equalizer } from "@/components/forme/equalizer";
import { SilkShader } from "@/components/forme/silk-shader";
import { PlasmaButton } from "@/components/forme/plasma-button";
import { AsciiTide } from "@/components/forme/ascii-tide";
import { TelemetryCard } from "@/components/forme/telemetry-card";
import { ScrambleButton } from "@/components/forme/scramble-button";
import { AsciiOrbit } from "@/components/forme/ascii-orbit";
import { Oscilloscope } from "@/components/forme/oscilloscope";
import { AuroraShader } from "@/components/forme/aurora-shader";
import { PrismButton } from "@/components/forme/prism-button";
import { AsciiDecode } from "@/components/forme/ascii-decode";
import { DitherShader } from "@/components/forme/dither-shader";
import { MagneticButton } from "@/components/forme/magnetic-button";
import { AsciiImage } from "@/components/forme/ascii-image";
import { AsciiBlackHole } from "@/components/forme/ascii-black-hole";
import { CausticShader } from "@/components/forme/caustic-shader";
import { ShutterButton } from "@/components/forme/shutter-button";
import { ContoursShader } from "@/components/forme/contours-shader";

const pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

export const fixtures: Record<string, () => ReactNode> = {
  "horizon-shader": () => <HorizonShader />,
  "lens-button": () => <LensButton>Lens</LensButton>,
  "hold-button": () => <HoldButton onConfirm={() => toast("Held")}>Hold</HoldButton>,
  "radar-sweep": () => <RadarSweep />,
  "eclipse-hero": () => <EclipseHero title="Hero" subtitle="Subtitle" actions={<a href="#">Go</a>} />,
  "spotlight-card": () => <SpotlightCard>Spotlight</SpotlightCard>,
  "beam-card": () => <BeamCard>Beam</BeamCard>,
  "command-palette": () => <CommandPalette commands={[{ id: "a", label: "Alpha" }, { id: "b", label: "Beta" }]} />,
  "glow-input": () => <GlowInput label="Email" hint="Hint" />,
  "segmented-switch": () => <SegmentedSwitch label="Plan" options={["One", "Two"]} />,
  "signal-slider": () => <SignalSlider label="Level" defaultValue={40} />,
  "orbit-loader": () => <OrbitLoader />,
  "shimmer-text": () => <ShimmerText>Working</ShimmerText>,
  "progress-beam": () => <ProgressBeam value={40} />,
  dock: () => <Dock items={[{ label: "Home", icon: <span>H</span>, href: "#", active: true }, { label: "Mail", icon: <span>M</span> }]} />,
  "animated-tabs": () => <AnimatedTabs tabs={[{ id: "a", label: "One", content: <p>First</p> }, { id: "b", label: "Two", content: <p>Second</p> }]} />,
  toast: () => <Toaster />,
  tooltip: () => (
    <Tooltip content="Tip">
      <button>Trigger</button>
    </Tooltip>
  ),
  "text-reveal": () => <TextReveal text="Words light up as you scroll." />,
  "number-ticker": () => <NumberTicker value={1234} format={{ style: "currency", currency: "USD" }} />,
  "otp-input": () => <OtpInput />,
  "copy-button": () => <CopyButton value="copied" />,
  accordion: () => <Accordion items={[{ id: "q", title: "Question", content: "Answer" }]} defaultOpen={["q"]} />,
  marquee: () => (
    <Marquee label="Logos">
      <span>Alpha</span>
      <span>Beta</span>
    </Marquee>
  ),
  "image-compare": () => <ImageCompare before={pixel} beforeAlt="Before" after={pixel} afterAlt="After" />,
  "mesh-gradient-shader": () => <MeshGradientShader />,
  "light-rays-shader": () => <LightRaysShader />,
  "dot-grid": () => <DotGrid />,
  "gradient-text": () => <GradientText text="Gradient" />,
  "typing-dots": () => <TypingDots />,
  spinner: () => <Spinner />,
  skeleton: () => (
    <SkeletonGroup>
      <Skeleton width="60%" />
    </SkeletonGroup>
  ),
  "infinity-loader": () => <InfinityLoader />,
  equalizer: () => <Equalizer />,
  "silk-shader": () => <SilkShader />,
  "plasma-button": () => <PlasmaButton>Plasma</PlasmaButton>,
  "ascii-tide": () => <AsciiTide />,
  "telemetry-card": () => <TelemetryCard value={42.5} unit="MB/s" />,
  "scramble-button": () => <ScrambleButton>Scramble</ScrambleButton>,
  "ascii-orbit": () => <AsciiOrbit />,
  oscilloscope: () => <Oscilloscope />,
  "aurora-shader": () => <AuroraShader />,
  "prism-button": () => <PrismButton>Prism</PrismButton>,
  "ascii-decode": () => <AsciiDecode text="Decoded" />,
  "dither-shader": () => <DitherShader />,
  "magnetic-button": () => <MagneticButton>Magnetic</MagneticButton>,
  "ascii-image": () => <AsciiImage src={pixel} alt="Pixel" />,
  "ascii-black-hole": () => <AsciiBlackHole />,
  "caustic-shader": () => <CausticShader />,
  "shutter-button": () => <ShutterButton>Shutter</ShutterButton>,
  "contours-shader": () => <ContoursShader />,
};

export function Smoke() {
  return (
    <main style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 8, background: "#000", color: "#eee" }}>
      {Object.entries(fixtures).map(([slug, render]) => (
        <section key={slug} data-slug={slug} style={{ position: "relative", width: 300, height: 200, overflow: "hidden" }}>
          {render()}
        </section>
      ))}
    </main>
  );
}
