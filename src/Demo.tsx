import { useState } from "react";
import { SilkShader } from "./registry/silk-shader";
import { DitherShader } from "./registry/dither-shader";
import { CausticShader } from "./registry/caustic-shader";
import { PrismButton } from "./registry/prism-button";
import { MagneticButton } from "./registry/magnetic-button";
import { ShutterButton } from "./registry/shutter-button";
import { AsciiOrbit } from "./registry/ascii-orbit";
import { AsciiImage } from "./registry/ascii-image";
import { AsciiSurface } from "./registry/ascii-surface";
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
  expanded?: boolean;
}) {
  const [selected, setSelected] = useState(false);
  if (slug === "silk-shader") return <SilkShader color={color} speed={speed} />;
  if (slug === "dither-shader")
    return <DitherShader color={color} speed={speed} />;
  if (slug === "caustic-shader")
    return <CausticShader color={color} speed={speed} />;
  if (slug === "ascii-orbit") return <AsciiOrbit color={color} speed={speed} />;
  if (slug === "ascii-image")
    return (
      <AsciiImage
        src={image || "/images/architecture.jpg"}
        alt={
          image === "/images/interior.jpg"
            ? "A bright living room with sculptural furniture"
            : image === "/images/landscape.jpg"
              ? "Mountains reflected in a lake"
              : "A stepped glass building viewed from below"
        }
        color={color}
      />
    );
  if (slug === "ascii-surface")
    return <AsciiSurface color={color} speed={speed} />;
  const label = selected
    ? "Signal received"
    : title ||
      (slug === "prism-button"
        ? "Enter the experience"
        : slug === "shutter-button"
          ? "Open the future"
          : "Make contact");
  return (
    <div className={`button-specimen specimen-${slug}`}>
      <span className="button-specimen-label">
        {slug === "prism-button"
          ? "Light, on the surface."
          : slug === "shutter-button"
            ? "Every action, an entrance."
            : "A little closer."}
      </span>
      {slug === "prism-button" ? (
        <PrismButton onClick={() => setSelected(!selected)}>
          {label}
        </PrismButton>
      ) : slug === "shutter-button" ? (
        <ShutterButton onClick={() => setSelected(!selected)}>
          {label}
        </ShutterButton>
      ) : (
        <MagneticButton onClick={() => setSelected(!selected)}>
          {label}
        </MagneticButton>
      )}
      <span className="button-specimen-hint" role="status">
        {selected
          ? "Selected. Connect this to your own action."
          : "Hover, focus, or select to interact."}
      </span>
    </div>
  );
}
