// Private capture page: renders one Studio piece full-frame for scripts/capture-studio.mjs.
// It is never part of the site build, so Studio source stays out of public bundles.
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/instrument-sans/standard.css";
import { CausticShader } from "./caustic-shader";
import { SingularityShader } from "./singularity-shader";
import { ShutterButton } from "./shutter-button";
import { AsciiSurface } from "./ascii-surface";
import { AsciiTunnel } from "./ascii-tunnel";
import { HoloCard } from "./holo-card";

const pieces: Record<string, () => ReactNode> = {
  "caustic-shader": () => <CausticShader />,
  "singularity-shader": () => <SingularityShader />,
  "ascii-surface": () => <AsciiSurface />,
  "ascii-tunnel": () => <AsciiTunnel />,
  "shutter-button": () => (
    <div className="center">
      <ShutterButton>Open the future</ShutterButton>
    </div>
  ),
  "holo-card": () => (
    <div className="center">
      <HoloCard>
        <div className="id">
          <small>Forme / Access 07</small>
          <span className="chip" />
          <div>
            <small>Clearance</small>
            <br />
            <strong>Signal Operator</strong>
          </div>
          <small>ID 0x4F-2E-91 · Valid 2031</small>
        </div>
      </HoloCard>
    </div>
  ),
};
const slug = new URLSearchParams(location.search).get("slug") || "";
createRoot(document.getElementById("root")!).render(
  pieces[slug]?.() ?? <p>Unknown slug: {slug}</p>,
);
