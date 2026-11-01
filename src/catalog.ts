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
    name: "Neon horizon",
    category: "Shaders",
    description: "An endless grid racing toward a glowing horizon.",
    usage: '<HorizonShader color="#38e1ff" speed={1} />',
    props: `${shaderProps} The pointer shifts the vanishing point.`,
    traits: shader,
    color: "#38e1ff",
    speed: true,
  },
  {
    slug: "glitch-button",
    name: "Glitch button",
    category: "Buttons",
    description: "Chromatic split and signal tearing on a chamfered plate.",
    usage: '<GlitchButton onClick={() => launch()}>\n  Jack in\n</GlitchButton>',
    props:
      "Accepts native button props. Hover or keyboard focus tears the label into offset color channels; the duplicate layers are hidden from assistive technology. Reduced motion removes the tearing. Recolor with --forme-glitch-a and --forme-glitch-b.",
    traits: button,
    text: "Jack in",
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
    description: "A live scope. Contacts flare as the beam passes. Click to mark.",
    usage: '<RadarSweep color="#4dffa6" speed={1} />',
    props:
      "color, speed, and label are optional. Click inside the scope to place a contact, or press Enter for a random one. Holds up to twelve contacts. Includes pause, stops offscreen and in hidden tabs, and freezes the beam for reduced motion.",
    traits: canvas,
    color: "#4dffa6",
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
    slug: "hud-frame",
    name: "HUD frame",
    category: "HUD",
    description: "Targeting brackets, a scan line, and readouts around anything.",
    usage:
      '<HudFrame label="Telemetry" status="Live" code="SIG-01">\n  <YourContent />\n</HudFrame>',
    props:
      "Wraps any children. label, status, and code set the readouts. Corners lock in on mount and a scan line loops; reduced motion removes both. Recolor with --forme-hud-accent.",
    traits: ["reduced-motion", "zero-deps"],
  },
  {
    slug: "hologram-shader",
    name: "Hologram",
    category: "Shaders",
    description: "Interference bands, split channels, and the odd corrupted line.",
    usage: '<HologramShader color="#5cf2d6" speed={1} />',
    props: `${shaderProps} The pointer moves the interference source.`,
    traits: shader,
    color: "#5cf2d6",
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
    description: "A phosphor trace you can tune by hand or by keyboard.",
    usage: '<Oscilloscope color="#ffd23f" speed={1} />',
    props:
      "color, speed, and label are optional. Pointer position sets frequency and amplitude; with focus, arrow keys do the same. A live readout shows both. Includes pause, stops offscreen and in hidden tabs, and freezes for reduced motion.",
    traits: canvas,
    color: "#ffd23f",
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
    description: "Headlines that resolve out of noise as they scroll into view.",
    usage: '<AsciiDecode as="h2" text="Signal acquired." />',
    props:
      "text is required. as picks the element (span, h1, h2, h3, or p). Decodes once on entering the viewport and again on hover. The real text holds the layout and remains readable to assistive technology. useDecode is exported for your own triggers. Reduced motion shows the text directly.",
    traits: ["reduced-motion", "zero-deps"],
    color: "#e6ecff",
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
    description: "An endless corridor of characters that leans toward the pointer.",
    usage: '<AsciiTunnel color="#ffb86b" speed={1} />',
    props:
      "color, speed, and label are optional. The tunnel steers toward the pointer. Includes pause, stops offscreen and in hidden tabs, and renders one still frame for reduced motion.",
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
      "A fabric of characters. Bend the wave or send a ripple through it.",
    usage: '<AsciiSurface color="#a6d5df" speed={1} />',
    props:
      "color, speed, and accessible label are optional. A projected character surface reacts to pointer movement; click, tap, Enter, or Space sends a ripple. Includes pause and reduced motion. Rendering stops offscreen and in hidden tabs.",
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
