export const categories = [
  "All components",
  "Buttons",
  "Shaders",
  "ASCII",
  "HUD",
] as const;
export type Category = (typeof categories)[number];

/** Each trait is enforced against the component's source by scripts/traits.test.mjs. */
export const traitInfo = {
  "reduced-motion": {
    label: "Reduced motion",
    check: "Source handles prefers-reduced-motion",
  },
  keyboard: {
    label: "Keyboard",
    check: "Interaction runs through a native button or key handlers",
  },
  "offscreen-pause": {
    label: "Pauses offscreen",
    check: "Stops rendering via IntersectionObserver and visibilitychange",
  },
  "pause-control": {
    label: "Pause control",
    check: "Ships a visible pause toggle",
  },
  "webgl-fallback": {
    label: "WebGL fallback",
    check: "Recovers from context loss and shows a static fallback",
  },
  "zero-deps": {
    label: "Zero deps",
    check: "Imports nothing beyond React and its own files",
  },
} as const;
export type Trait = keyof typeof traitInfo;

export interface CatalogItem {
  slug: string;
  name: string;
  category: Exclude<Category, "All components">;
  access?: "studio";
  description: string;
  usage: string;
  props: string;
  traits: Trait[];
  /** Playground controls: default color, whether speed applies, default button label. */
  color?: string;
  speed?: boolean;
  text?: string;
}

const shader: Trait[] = ["reduced-motion", "offscreen-pause", "webgl-fallback", "zero-deps"];
const button: Trait[] = ["reduced-motion", "keyboard", "zero-deps"];
const canvas: Trait[] = ["reduced-motion", "keyboard", "offscreen-pause", "pause-control", "zero-deps"];
const shaderProps =
  "color is a six-digit hex value; speed is clamped to 0–3. Changing either updates a uniform without recompiling. Pauses offscreen and in hidden tabs, renders a still frame for reduced motion, and falls back to a static gradient without WebGL.";

export const catalog: CatalogItem[] = [
  {
    slug: "horizon-shader",
    name: "Horizon",
    category: "Shaders",
    description: "Dawn breaking along the curve of a planet.",
    usage: '<HorizonShader color="#6f8bff" speed={1} />',
    props: `${shaderProps} The pointer moves the light along the rim.`,
    traits: shader,
    color: "#6f8bff",
    speed: true,
  },
  {
    slug: "lens-button",
    name: "Lens button",
    category: "Buttons",
    description: "Dark glass with a spotlight edge that follows your pointer.",
    usage: '<LensButton onClick={() => launch()}>\n  Request access\n</LensButton>',
    props:
      "Accepts native button props. A one-pixel edge brightens where the pointer is, and a soft tint bleeds through from below on hover or focus. Keyboard focus centers the light. Set --forme-lens-tint to change the glow.",
    traits: button,
    text: "Request access",
  },

  {
    slug: "ascii-globe",
    name: "ASCII globe",
    category: "ASCII",
    description: "A planet of characters. Drag it, spin it, steer it with keys.",
    usage: '<AsciiGlobe color="#8fd3ff" speed={1} />',
    props:
      "color, speed, and label are optional. Drag to spin with inertia, or focus and use the arrow keys. Includes pause, stops offscreen and in hidden tabs, and stops auto-rotation for reduced motion while keeping manual control.",
    traits: canvas,
    color: "#8fd3ff",
    speed: true,
  },
  {
    slug: "hold-button",
    name: "Hold to confirm",
    category: "Buttons",
    description: "A charging bar for actions that deserve a deliberate press.",
    usage:
      '<HoldButton onConfirm={() => deleteProject()} duration={1200}>\n  Hold to deploy\n</HoldButton>',
    props:
      "onConfirm fires once the hold completes; duration is in milliseconds. Works with a pointer or by holding Space or Enter. Releasing drains the charge. Announces the confirmation to screen readers and describes the hold gesture. Progress still displays under reduced motion because it carries information.",
    traits: button,
    text: "Hold to deploy",
  },
  {
    slug: "radar-sweep",
    name: "Radar sweep",
    category: "HUD",
    description: "A scope with a phosphor sweep. Contacts ping as the beam passes.",
    usage: '<RadarSweep color="#6ee7b7" speed={1} />',
    props:
      "color, speed, and label are optional. Click inside the scope to place a contact, or press Enter for a random one. Holds up to twelve contacts. Includes pause, stops offscreen and in hidden tabs, and freezes the beam for reduced motion.",
    traits: canvas,
    color: "#6ee7b7",
    speed: true,
  },
  {
    slug: "silk-shader",
    name: "Silk field",
    category: "Shaders",
    description: "An ambient field of flowing light, moving at its own pace.",
    usage: '<SilkShader color="#385dff" speed={1} />',
    props: `${shaderProps} Ambient: no pointer response.`,
    traits: shader,
    color: "#385dff",
    speed: true,
  },
  {
    slug: "plasma-button",
    name: "Plasma button",
    category: "Buttons",
    description: "A charged ring of light that surges when you get close.",
    usage: '<PlasmaButton onClick={() => launch()}>\n  Initiate\n</PlasmaButton>',
    props:
      "Accepts native button props. The conic ring rotates slowly and accelerates on hover or focus. Reduced motion holds it still. Recolor with --forme-plasma-a, --forme-plasma-b, and --forme-plasma-c.",
    traits: button,
    text: "Initiate",
  },
  {
    slug: "ascii-rain",
    name: "Glyph rain",
    category: "ASCII",
    description: "Falling columns of code. The pointer stirs them; a click sends a surge.",
    usage: '<AsciiRain color="#7dffb2" speed={1} />',
    props:
      "color, speed, and label are optional. Columns under the pointer accelerate. Click, tap, Enter, or Space restarts every column at once. Includes pause, stops offscreen and in hidden tabs, and shows a still field for reduced motion.",
    traits: canvas,
    color: "#7dffb2",
    speed: true,
  },
  {
    slug: "telemetry-card",
    name: "Telemetry card",
    category: "HUD",
    description: "A glass readout with rolling digits and a live sparkline.",
    usage:
      '<TelemetryCard label="Throughput" value={rate} unit="MB/s" />',
    props:
      "Pass value as it changes; the card keeps the last 40 values for the sparkline and shows the change from the previous one. Pass history to seed or control the sparkline. label, unit, decimals, status, and color are optional. Digits roll to each new value; reduced motion swaps them instantly. The value is exposed as text to assistive technology.",
    traits: ["reduced-motion", "zero-deps"],
    color: "#8ab4ff",
  },

  {
    slug: "chrome-shader",
    name: "Liquid chrome",
    category: "Shaders",
    description: "Polished metal that flows, reflecting a studio you never see.",
    usage: '<ChromeShader color="#7c9cff" speed={1} />',
    props: `${shaderProps} color tints the reflected floor light; the pointer shifts the surface.`,
    traits: shader,
    color: "#7c9cff",
    speed: true,
  },

  {
    slug: "scramble-button",
    name: "Scramble button",
    category: "Buttons",
    description: "A terminal label that decodes itself every time you arrive.",
    usage: '<ScrambleButton onClick={() => launch()}>\n  Run sequence\n</ScrambleButton>',
    props:
      "children must be a string. Hover or focus scrambles the label and resolves it left to right. The real label stays in the accessibility tree and holds the layout, so nothing shifts. Reduced motion shows the label directly. Installs ascii-decode alongside.",
    traits: button,
    text: "Run sequence",
  },
  {
    slug: "ascii-orbit",
    name: "ASCII orbit",
    category: "ASCII",
    description: "A dense, dimensional object, drawn entirely from characters.",
    usage:
      '<AsciiOrbit color="#d2d7e3" speed={1} label="Rotating ASCII torus" />',
    props:
      "color, speed, and accessible label are optional. The ASCII torus responds to pointer movement, includes a pause control, stops offscreen, and becomes still for reduced motion.",
    traits: ["reduced-motion", "offscreen-pause", "pause-control", "zero-deps"],
    color: "#d2d7e3",
    speed: true,
  },
  {
    slug: "oscilloscope",
    name: "Oscilloscope",
    category: "HUD",
    description: "A phosphor trace with persistence. Tune it by hand or keyboard.",
    usage: '<Oscilloscope color="#7dd3fc" speed={1} />',
    props:
      "color, speed, and label are optional. Pointer position sets frequency and amplitude; with focus, arrow keys do the same. A live readout shows both. Includes pause, stops offscreen and in hidden tabs, and freezes for reduced motion.",
    traits: canvas,
    color: "#7dd3fc",
    speed: true,
  },
  {
    slug: "warp-shader",
    name: "Warp field",
    category: "Shaders",
    description: "Stars stretch into streaks as you punch through.",
    usage: '<WarpShader color="#9b8cff" speed={1} />',
    props: `${shaderProps} The pointer steers the vanishing point.`,
    traits: shader,
    color: "#9b8cff",
    speed: true,
  },
  {
    slug: "prism-button",
    name: "Prism button",
    category: "Buttons",
    description: "Brushed metal, refracted light, and a responsive highlight.",
    usage:
      '<PrismButton onClick={() => console.log("Connect your action")}>\n  Enter the experience\n</PrismButton>',
    props:
      "Accepts native button props and children. Defaults to type=button. The highlight follows the pointer and a press compresses the plate; reduced motion removes animated sweeps. Native disabled and focus states are supported.",
    traits: button,
    text: "Enter the experience",
  },
  {
    slug: "ascii-decode",
    name: "Decode text",
    category: "ASCII",
    description: "Headlines that resolve letter by letter as they scroll into view.",
    usage: '<AsciiDecode as="h2" text="Signal acquired." />',
    props:
      "text is required. as picks the element (span, h1, h2, h3, or p). Decodes once on entering the viewport and again on hover. The real text holds the layout and remains readable to assistive technology. Each letter settles on its own staggered schedule; unresolved letters glow in --forme-decode-noise. useDecode and DecodeCells are exported for your own triggers. Reduced motion shows the text directly.",
    traits: ["reduced-motion", "zero-deps"],
    text: "Signal acquired.",
  },
  {
    slug: "dither-shader",
    name: "Dither terrain",
    category: "Shaders",
    description: "A changing topography of pixels, noise, and light.",
    usage: '<DitherShader color="#c5dacb" speed={0.8} />',
    props: `${shaderProps} The pointer raises the terrain beneath it.`,
    traits: shader,
    color: "#c5dacb",
    speed: true,
  },
  {
    slug: "magnetic-button",
    name: "Magnetic button",
    category: "Buttons",
    description: "A little attraction. A satisfying response.",
    usage:
      '<MagneticButton onClick={() => console.log("Connect your action")}>\n  Make contact\n</MagneticButton>',
    props:
      "Accepts native button props including onClick, disabled, and type. Defaults to type=button. A soft spring overshoot follows pointer release; a press compresses and rebounds. Pointer attraction runs only for mouse input. Reduced motion disables attraction and press animation. Customize --forme-button-bg and --forme-button-color. Installs Motion.",
    traits: ["reduced-motion", "keyboard"],
    text: "Make contact",
  },
  {
    slug: "ascii-image",
    name: "ASCII reveal",
    category: "ASCII",
    description: "An image hidden in plain text. Move to find what’s beneath.",
    usage:
      '<AsciiImage src="/your-image.jpg" alt="Your image description"\n  color="#b7c3df" />',
    props:
      "src and alt are required; color is optional. Supply a same-origin or CORS-enabled image for canvas sampling. Move the pointer to reveal the photograph; click, tap, Enter, or Space pins a centered reveal. Reduced motion uses the centered reveal.",
    traits: button,
    color: "#b7c3df",
  },
  {
    slug: "singularity-shader",
    name: "Singularity",
    category: "Shaders",
    access: "studio",
    description: "A black hole bending starlight around a burning accretion disk.",
    usage: '<SingularityShader color="#ff9b5c" speed={1} />',
    props: `${shaderProps} The pointer shifts the observer.`,
    traits: shader,
  },
  {
    slug: "holo-card",
    name: "Holo card",
    category: "HUD",
    access: "studio",
    description: "A card that tilts toward you, with foil that shifts like a hologram.",
    usage: "<HoloCard>\n  <YourCardContent />\n</HoloCard>",
    props:
      "Wraps any children. Tilt, foil, and glare follow a mouse pointer and settle on leave. Reduced motion keeps the card flat with a static foil.",
    traits: ["reduced-motion", "zero-deps"],
  },
  {
    slug: "ascii-tunnel",
    name: "ASCII tunnel",
    category: "ASCII",
    access: "studio",
    description: "Rings of characters rush toward you, glowing at the far end.",
    usage: '<AsciiTunnel color="#ffb86b" speed={1} />',
    props:
      "color, speed, and label are optional. Glyph size, brightness, and color follow depth; the far end steers toward the pointer with parallax. Includes pause, stops offscreen and in hidden tabs, and renders one still frame for reduced motion.",
    traits: ["reduced-motion", "offscreen-pause", "pause-control", "zero-deps"],
  },
  {
    slug: "caustic-shader",
    name: "Caustic glass",
    category: "Shaders",
    access: "studio",
    description:
      "Light through moving glass. Refracted edges, depth, and shifting caustics.",
    usage: '<CausticShader color="#73d9ed" speed={1} />',
    props: shaderProps,
    traits: shader,
  },
  {
    slug: "shutter-button",
    name: "Shutter button",
    category: "Buttons",
    access: "studio",
    description: "A mechanical reveal. Five panels, perfectly sequenced.",
    usage:
      '<ShutterButton onClick={() => console.log("Connect your action")}>\n  Open the future\n</ShutterButton>',
    props:
      "Accepts native button props and children. Hover and keyboard focus open the panels. Activation calls your onClick. Defaults to type=button; reduced motion switches without a transition.",
    traits: button,
  },
  {
    slug: "ascii-surface",
    name: "ASCII surface",
    category: "ASCII",
    access: "studio",
    description:
      "A terrain of characters in perspective. Press into it or send a ripple.",
    usage: '<AsciiSurface color="#a6d5df" speed={1} />',
    props:
      "color, speed, and label are optional. Glyphs are lit by the surface normal and shrink and fade with distance. The pointer presses a lens into the ground where it points; click, tap, Enter, or Space sends a ripple. Includes pause, stops offscreen and in hidden tabs, and holds still for reduced motion.",
    traits: canvas,
  },
];
export const freeCount = catalog.filter((c) => c.access !== "studio").length;
export const studioCount = catalog.length - freeCount;
export const code = (slug: string) =>
  `S-${String(catalog.findIndex((c) => c.slug === slug) + 1).padStart(2, "0")}`;
export function exportName(slug: string) {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
}
