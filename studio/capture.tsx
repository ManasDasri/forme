// Private capture page: renders one Studio piece full-frame for scripts/capture-studio.mjs.
// It is never part of the site build, so Studio source stays out of public bundles.
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/instrument-sans/standard.css";
import { CausticShader } from "./caustic-shader";
import { SingularityShader } from "./singularity-shader";
import { ShutterButton } from "./shutter-button";
import { AsciiSurface } from "./ascii-surface";
import { useEffect, useState } from "react";
import { AsciiBlackHole } from "./ascii-black-hole";
import { OrbitGauge } from "./orbit-gauge";

const pieces: Record<string, () => ReactNode> = {
  "caustic-shader": () => <CausticShader />,
  "singularity-shader": () => <SingularityShader />,
  "ascii-surface": () => <AsciiSurface />,
  "ascii-black-hole": () => <AsciiBlackHole />,
  "shutter-button": () => (
    <div className="center">
      <ShutterButton>Open the future</ShutterButton>
    </div>
  ),
  "orbit-gauge": () => (
    <div className="center">
      <GaugeDemo />
    </div>
  ),
};
function GaugeDemo() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((n) => n + 1), 1500);
    return () => clearInterval(id);
  }, []);
  const sets = [
    [0.72, 0.48, 0.31],
    [0.86, 0.55, 0.36],
    [0.64, 0.61, 0.42],
    [0.91, 0.44, 0.33],
  ];
  const [a, b, c] = sets[step % sets.length];
  return (
    <OrbitGauge
      title="Capacity"
      metrics={[
        { label: "CPU", value: a, color: "#8ab4ff" },
        { label: "Memory", value: b, color: "#c4b5fd" },
        { label: "Disk", value: c, color: "#5eead4" },
      ]}
    />
  );
}
const slug = new URLSearchParams(location.search).get("slug") || "";
createRoot(document.getElementById("root")!).render(
  pieces[slug]?.() ?? <p>Unknown slug: {slug}</p>,
);
