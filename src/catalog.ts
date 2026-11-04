export const categories = [
  "All components",
  "Buttons",
  "Shaders",
  "ASCII",
  "HUD",
  "Surfaces",
  "Inputs",
  "Loaders",
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
    slug: "eclipse-hero",
    name: "Eclipse hero",
    category: "Surfaces",
    description: "A full-bleed hero: dawn on a planet, your headline resolving above it.",
    usage:
      '<EclipseHero\n  title="Ship something worth looking at."\n  subtitle="Your one-line pitch goes here."\n  actions={<a href="/start">Get started</a>}\n/>',
    props:
      "title is required; subtitle, actions, color, and speed are optional. Type scales with the hero's own width through container units, so it fits a card or a full page. Give it a height. Content resolves from blur once on load; reduced motion shows it directly. Installs Horizon and the shader runtime.",
    traits: shader,
    color: "#6f8bff",
    text: "Ship something worth looking at.",
  },
  {
    slug: "spotlight-card",
    name: "Spotlight card",
    category: "Surfaces",
    description: "A dark surface whose edge catches light under the pointer.",
    usage: '<SpotlightCard>\n  <YourContent />\n</SpotlightCard>',
    props:
      "Accepts native div props and any children. A one-pixel edge brightens near the pointer and a soft wash lights the interior on hover or focus within. Set --forme-spot-color to tint the light.",
    traits: ["reduced-motion", "zero-deps"],
  },
  {
    slug: "beam-card",
    name: "Beam card",
    category: "Surfaces",
    description: "A slow comet of light travelling around the border.",
    usage: '<BeamCard>\n  <YourContent />\n</BeamCard>',
    props:
      "Accepts native div props and any children. The beam is CSS only and loops every seven seconds. Set --forme-beam-color to change it. Reduced motion holds the beam still.",
    traits: ["reduced-motion", "zero-deps"],
  },
  {
    slug: "command-palette",
    name: "Command palette",
    category: "Inputs",
    description: "A searchable command list with arrow keys, Enter, and live filtering.",
    usage:
      '<CommandPalette commands={[\n  { id: "new", label: "New project", group: "Create", shortcut: "N", onSelect: createProject },\n]} />',
    props:
      "commands is a list of { id, label, group?, shortcut?, onSelect? }. Uses combobox and listbox roles with an active descendant. Arrow keys move, Enter runs, and the result is announced. Render it inside your own dialog if you want it modal.",
    traits: ["reduced-motion", "keyboard", "zero-deps"],
  },
  {
    slug: "glow-input",
    name: "Glow input",
    category: "Inputs",
    description: "A native input with a floating label and a light that wakes on focus.",
    usage: '<GlowInput label="Work email" type="email" hint="We only use this to reply." />',
    props:
      "label is required; hint is linked with aria-describedby. Accepts native input props. aria-invalid turns the glow red. Set --forme-glow-color to change the light.",
    traits: ["reduced-motion", "keyboard", "zero-deps"],
    text: "Work email",
  },
  {
    slug: "segmented-switch",
    name: "Segmented switch",
    category: "Inputs",
    description: "Native radios behind a thumb that springs between options.",
    usage: '<SegmentedSwitch label="Billing" options={["Monthly", "Yearly"]} onChange={setPlan} />',
    props:
      "options and label are required. Works controlled through value or uncontrolled through defaultValue. Built on real radio inputs, so arrow keys and forms work by default.",
    traits: ["reduced-motion", "keyboard", "zero-deps"],
  },
  {
    slug: "signal-slider",
    name: "Signal slider",
    category: "Inputs",
    description: "A native range input with a lit track and a live readout.",
    usage: '<SignalSlider label="Volume" defaultValue={60} format={(v) => `${v}%`} />',
    props:
      "label is required. min, max, step, value, defaultValue, onChange, format, and color are optional. format also sets aria-valuetext, so screen readers hear the same value.",
    traits: ["reduced-motion", "keyboard", "zero-deps"],
    color: "#8ab4ff",
  },
  {
    slug: "orbit-loader",
    name: "Orbit loader",
    category: "Loaders",
    description: "Three fine arcs turning at different speeds.",
    usage: '<OrbitLoader size={56} label="Loading results" />',
    props:
      "size, color, and label are optional. CSS only, exposed as a status with your label. Reduced motion swaps rotation for a slow fade, so it still shows activity.",
    traits: ["reduced-motion", "zero-deps"],
    color: "#8ab4ff",
  },
  {
    slug: "shimmer-text",
    name: "Shimmer text",
    category: "Loaders",
    description: "Status text with a slow highlight passing through it.",
    usage: "<ShimmerText>Generating your report</ShimmerText>",
    props:
      "Renders children as a polite status. Set --forme-shimmer-base and --forme-shimmer-light to recolor. Reduced motion shows plain text.",
    traits: ["reduced-motion", "zero-deps"],
    text: "Generating your report",
  },
  {
    slug: "progress-beam",
    name: "Progress beam",
    category: "Loaders",
    description: "A hairline progress bar with a glowing head.",
    usage: '<ProgressBeam value={64} label="Uploading" />',
    props:
      "value is 0 to 100; leave it out for an indeterminate sweep. Uses the progressbar role with aria-valuenow. Reduced motion turns the sweep into a slow fade.",
    traits: ["reduced-motion", "zero-deps"],
    color: "#8ab4ff",
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
    slug: "ascii-tide",
    name: "ASCII tide",
    category: "ASCII",
    description: "A night sea in dense characters, with a moonlit glint.",
    usage: '<AsciiTide color="#8ab4ff" speed={1} />',
    props:
      "color, speed, and label are optional. Every glyph is a point on the water, shaded by wave slope and batched by brightness, with fog at the horizon. Ambient, with a pause control. Stops offscreen and in hidden tabs, and renders one still frame for reduced motion.",
    traits: ["reduced-motion", "offscreen-pause", "pause-control", "zero-deps"],
    color: "#8ab4ff",
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
    slug: "aurora-shader",
    name: "Aurora",
    category: "Shaders",
    description: "Slow curtains of light folding across a night sky.",
    usage: '<AuroraShader color="#5eead4" speed={1} />',
    props: `${shaderProps} Ambient: no pointer response.`,
    traits: shader,
    color: "#5eead4",
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
    description: "A black hole, its far side bent into a halo of light.",
    usage: '<SingularityShader color="#e8a25c" speed={1} />',
    props: `${shaderProps} The pointer shifts the observer.`,
    traits: shader,
  },
  {
    slug: "orbit-gauge",
    name: "Orbit gauge",
    category: "HUD",
    access: "studio",
    description: "Concentric precision arcs that ease to every new value.",
    usage:
      '<OrbitGauge title="Capacity" metrics={[\n  { label: "CPU", value: 0.72, color: "#8ab4ff" },\n  { label: "Memory", value: 0.48, color: "#c4b5fd" },\n  { label: "Disk", value: 0.31, color: "#5eead4" },\n]} />',
    props:
      "metrics takes up to three { label, value (0–1), color } entries; title labels the center. Arcs ease to new values and the center rolls to the first metric. The whole gauge is described to assistive technology as text. Reduced motion jumps straight to each value.",
    traits: ["reduced-motion", "zero-deps"],
  },

  {
    slug: "ascii-black-hole",
    name: "ASCII black hole",
    category: "ASCII",
    access: "studio",
    description: "A black hole in dense characters, its disk orbiting into the dark.",
    usage: "<AsciiBlackHole speed={1} />",
    props:
      "speed and label are optional. Tens of thousands of glyphs per frame, batched by brightness so it stays fast. Inner rings orbit faster than outer ones, the approaching side burns white, and the far side of the disk is lensed into a ring. Ambient, with a pause control. Stops offscreen and in hidden tabs, and renders one still frame for reduced motion.",
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
