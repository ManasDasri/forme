export const categories = [
  "All components",
  "Buttons",
  "Shaders",
  "ASCII",
  "HUD",
  "Surfaces",
  "Inputs",
  "Loaders",
  "Navigation",
  "Feedback",
  "Text",
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
  description: string;
  usage: string;
  props: string;
  traits: Trait[];
  /** Playground controls: default color, whether speed applies, default button label. */
  color?: string;
  speed?: boolean;
  text?: string;
  /** Draws from currentColor, so it suits light and dark pages; the playground offers a light page. */
  adaptive?: boolean;
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
    slug: "dock",
    name: "Dock",
    category: "Navigation",
    description: "Icons that swell toward your pointer, like a desktop dock.",
    usage:
      '<Dock items={[\n  { label: "Home", icon: <HomeIcon />, href: "/", active: true },\n  { label: "Search", icon: <SearchIcon />, onClick: openSearch },\n]} />',
    props:
      "items take label, icon, and either href or onClick; active marks the current one. Renders a nav landmark with real links and buttons, and labels appear on hover and keyboard focus. Magnification runs only for a mouse and switches off for reduced motion. The bar grows upward into reserved space as icons swell, and the swell shrinks to fit narrow containers, so it never overflows or shifts the page. Inherits your text color.",
    traits: ["reduced-motion", "keyboard", "zero-deps"],
    adaptive: true,
  },
  {
    slug: "animated-tabs",
    name: "Animated tabs",
    category: "Navigation",
    description: "A pill that glides to the active tab, with full keyboard support.",
    usage:
      '<AnimatedTabs tabs={[\n  { id: "overview", label: "Overview", content: <Overview /> },\n  { id: "pricing", label: "Pricing", content: <Pricing /> },\n]} />',
    props:
      "tabs take id, label, and optional content; omit content to use them as a filter bar. Follows the WAI-ARIA tabs pattern: roving focus, with arrow keys, Home, and End. defaultId and onChange are optional. Inherits your text color.",
    traits: ["reduced-motion", "keyboard", "zero-deps"],
    adaptive: true,
  },
  {
    slug: "toast",
    name: "Toast",
    category: "Feedback",
    description: "Stacked notifications that fan out on hover and swipe away.",
    usage:
      '// Once, near the root:\n<Toaster />\n\n// Anywhere:\ntoast("Deployed to production", {\n  description: "Your site is live.",\n  tone: "success",\n  action: { label: "Open", onClick: openSite },\n});',
    props:
      "toast(title, { description, tone, action, duration }) returns an id; toast.dismiss(id) removes it. The stack holds five, announces politely, pauses its timers while hovered or focused, and dismisses on a rightward swipe. Reduced motion removes the transitions.",
    traits: ["reduced-motion", "keyboard", "zero-deps"],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "Feedback",
    description: "A small label on hover or focus, wired up for screen readers.",
    usage: '<Tooltip content="Copy link">\n  <button>Share</button>\n</Tooltip>',
    props:
      "Wraps one element and links it to the bubble with aria-describedby. Opens after a short delay on hover and immediately on keyboard focus; Escape closes it. side is top or bottom.",
    traits: ["reduced-motion", "keyboard", "zero-deps"],
  },
  {
    slug: "text-reveal",
    name: "Text reveal",
    category: "Text",
    description: "Words light up one by one as the paragraph scrolls past.",
    usage: '<TextReveal as="h2" text="We build tools for people who sweat the details." />',
    props:
      "text is required; as picks the element. Listens to scroll only while on screen. The text is real text the whole time, so it stays readable to assistive technology and search. Reduced motion shows it fully lit. Inherits your text color.",
    traits: ["reduced-motion", "zero-deps"],
    adaptive: true,
    text: "We build tools for people who sweat the details, and it shows in every one of them.",
  },
  {
    slug: "number-ticker",
    name: "Number ticker",
    category: "Text",
    description: "Counts up when it scrolls into view, then eases between values.",
    usage: '<NumberTicker value={12480} format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} />',
    props:
      "value is required. format takes Intl.NumberFormat options and locale sets the locale, so currency, percent, and compact forms work. Screen readers hear only the final value. Reduced motion jumps straight to it.",
    traits: ["reduced-motion", "zero-deps"],
    adaptive: true,
  },
  {
    slug: "otp-input",
    name: "OTP input",
    category: "Inputs",
    description: "A one-time code field with separate cells and working paste and autofill.",
    usage: "<OtpInput length={6} onComplete={(code) => verify(code)} />",
    props:
      "One real input sits over the cells, so paste, one-time-code autofill from SMS, and screen readers work without special handling. length, label, numeric, and onComplete are optional. Inherits your text color.",
    traits: ["reduced-motion", "keyboard", "zero-deps"],
    adaptive: true,
  },
  {
    slug: "copy-button",
    name: "Copy button",
    category: "Inputs",
    description: "Copies with one click; the icon morphs into a check.",
    usage: '<CopyButton value="npm install forme" />',
    props:
      "value is required; label sets the accessible name. Announces Copied, or Copy failed when the clipboard is blocked. Inherits your text color.",
    traits: ["reduced-motion", "keyboard", "zero-deps"],
    adaptive: true,
  },
  {
    slug: "accordion",
    name: "Accordion",
    category: "Surfaces",
    description: "Disclosure rows that open with a smooth height change.",
    usage:
      '<Accordion items={[\n  { id: "refunds", title: "Can I get a refund?", content: "Yes, within 30 days." },\n]} />',
    props:
      "items take id, title, and content; multiple allows several open at once and defaultOpen sets the start. Real buttons with aria-expanded and labelled regions. Closed panels are inert, so focus skips them. Inherits your text color.",
    traits: ["reduced-motion", "keyboard", "zero-deps"],
    adaptive: true,
  },
  {
    slug: "marquee",
    name: "Marquee",
    category: "Surfaces",
    description: "An endless strip for logos or quotes, with soft faded edges.",
    usage: '<Marquee label="Customers" duration={40}>\n  {logos}\n</Marquee>',
    props:
      "Wraps any children and repeats them seamlessly; the copy is hidden from assistive technology. duration, reverse, and pauseOnHover are optional, and it also pauses on focus. Reduced motion stops it and makes the strip scroll by hand. Set --forme-marquee-gap for spacing.",
    traits: ["reduced-motion", "zero-deps"],
    adaptive: true,
  },
  {
    slug: "image-compare",
    name: "Image compare",
    category: "Surfaces",
    description: "Before and after, split by a handle you can drag or key.",
    usage:
      '<ImageCompare\n  before="/edit-before.jpg" beforeAlt="Original photo"\n  after="/edit-after.jpg" afterAlt="Color graded photo"\n/>',
    props:
      "before, after, and their alt texts are required; labels and the starting split are optional. The control is a real range input across the whole image, so dragging works anywhere and arrow keys work with focus.",
    traits: ["reduced-motion", "keyboard", "zero-deps"],
  },
  {
    slug: "mesh-gradient-shader",
    name: "Mesh gradient",
    category: "Shaders",
    description: "Four soft colors drifting through each other, with fine grain.",
    usage: '<MeshGradientShader colors={["#3b1dd4", "#e2187a", "#ff8a3d", "#0aa5c8"]} speed={1} />',
    props: `colors takes up to four hex colors and speed is clamped to 0–3; both update uniforms without recompiling. Ambient: no pointer response. Pauses offscreen and in hidden tabs, renders a still frame for reduced motion, and falls back to a static gradient without WebGL.`,
    traits: shader,
    speed: true,
  },
  {
    slug: "light-rays-shader",
    name: "Light rays",
    category: "Shaders",
    description: "Shafts of light falling from above, with dust drifting through them.",
    usage: '<LightRaysShader color="#c8d8ff" speed={1} />',
    props: `${shaderProps} Ambient: no pointer response.`,
    traits: shader,
    color: "#c8d8ff",
    speed: true,
  },
  {
    slug: "dot-grid",
    name: "Dot grid",
    category: "Surfaces",
    description: "A dot-matrix background that glows softly around the pointer.",
    usage: '<div style={{ position: "relative" }}>\n  <DotGrid spacing={22} />\n  <YourContent />\n</div>',
    props:
      "spacing is optional. Dots take the host's text color, so the grid suits light and dark pages. A slow swell runs while visible; the glow follows the pointer with easing. Stops offscreen and in hidden tabs, and holds still for reduced motion.",
    traits: ["reduced-motion", "offscreen-pause", "zero-deps"],
    adaptive: true,
  },
  {
    slug: "gradient-text",
    name: "Gradient text",
    category: "Text",
    description: "Headings filled with a slowly moving gradient.",
    usage: '<GradientText as="h1" text="Ship it." colors={["#7c9cff", "#e879f9", "#fb923c", "#7c9cff"]} />',
    props:
      "text is required; as, colors, and duration are optional. Real, selectable text clipped to the gradient. Reduced motion holds the gradient still.",
    traits: ["reduced-motion", "zero-deps"],
    text: "Build something unforgettable.",
  },
  {
    slug: "typing-dots",
    name: "Typing dots",
    category: "Loaders",
    description: "Three dots that lift in turn, like someone is typing.",
    usage: '<TypingDots label="Assistant is typing" />',
    props: "label is announced as a status. Draws in your text color. Reduced motion swaps the bounce for a fade.",
    traits: ["reduced-motion", "zero-deps"],
    adaptive: true,
  },
  {
    slug: "spinner",
    name: "Spinner",
    category: "Loaders",
    description: "The classic spoke spinner, in your text color at any size.",
    usage: '<Spinner size={24} label="Saving" />',
    props: "size and label are optional. A status with your label. Reduced motion slows it down rather than hiding activity.",
    traits: ["reduced-motion", "zero-deps"],
    adaptive: true,
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    category: "Loaders",
    description: "Shimmering placeholders that sketch the content on its way.",
    usage:
      '<SkeletonGroup label="Loading profile">\n  <Skeleton width={48} height={48} radius="50%" />\n  <Skeleton width="60%" />\n  <Skeleton width="90%" />\n</SkeletonGroup>',
    props:
      "Skeleton takes width, height, and radius. Wrap them in SkeletonGroup so screen readers hear one loading status. Draws from your text color. Reduced motion removes the sheen.",
    traits: ["reduced-motion", "zero-deps"],
    adaptive: true,
  },
  {
    slug: "infinity-loader",
    name: "Infinity loader",
    category: "Loaders",
    description: "A comet of light tracing a figure eight.",
    usage: '<InfinityLoader size={72} label="Syncing" />',
    props: "size, color, and label are optional. CSS only, exposed as a status. Reduced motion swaps the trace for a slow fade.",
    traits: ["reduced-motion", "zero-deps"],
    color: "#8ab4ff",
  },
  {
    slug: "equalizer",
    name: "Equalizer",
    category: "Loaders",
    description: "Bars that rise and fall like an audio meter.",
    usage: '<Equalizer bars={5} height={28} label="Now playing" />',
    props: "bars, height, and label are optional. A status in your text color. Reduced motion holds the bars still.",
    traits: ["reduced-motion", "zero-deps"],
    adaptive: true,
  },
  {
    slug: "contours-shader",
    name: "Contours",
    category: "Shaders",
    description: "Topographic lines drifting over a slowly shifting landscape.",
    usage: '<ContoursShader color="#6ee7b7" speed={1} />',
    props: `${shaderProps} Lines stay crisp at any size because their width comes from the terrain's slope; every fifth is a brighter index line. The pointer nudges the map slightly.`,
    traits: shader,
    color: "#6ee7b7",
    speed: true,
  },
  {
    slug: "word-rotator",
    name: "Word rotator",
    category: "Text",
    description: "Rotates words or whole phrases in a headline, letter by letter.",
    usage: '<h1>\n  Build <WordRotator words={["faster", "better", "together"]} />\n</h1>',
    props:
      "words is required; interval sets the time per phrase, and from and to add an optional color gradient. Phrases are real text, so long ones wrap between words instead of overflowing, the box keeps the size of the longest phrase so the layout never shifts, and longer phrases stagger faster so each one enters in about the same time. Cycles only while on screen. Screen readers hear every phrase once. Reduced motion shows the first one.",
    traits: ["reduced-motion", "zero-deps"],
    adaptive: true,
  },
  {
    slug: "ascii-banner",
    name: "ASCII banner",
    category: "ASCII",
    description: "Any text drawn as dense ASCII art, with a light that follows your pointer and an optional rippling reflection.",
    usage: '<div style={{ height: 220 }}>\n  <AsciiBanner as="h1" text="FORME" color="#e4e4e7" />\n</div>',
    props:
      "text is required; as, color, font, and speed are optional, and reflect stands the text on a waterline above a rippling reflection. A hovering mouse pointer moves the light and stirs the water. The text is rasterized once per size and redrawn as batched glyphs. It renders as a real heading whose text assistive technology and search can read. Stops offscreen and in hidden tabs, and holds still for reduced motion.",
    traits: ["reduced-motion", "offscreen-pause", "zero-deps"],
    color: "#e4e4e7",
    speed: true,
    text: "FORME",
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
    description: "A moonlit ocean in dense characters, with a glittering moon path.",
    usage: '<AsciiTide color="#8ab4ff" speed={1} />',
    props:
      "color, speed, and label are optional. Five crossing swells shade every glyph by its slope; the moon's reflection glitters down the water and foam catches on the crests. Thousands of glyphs, batched by brightness. Ambient, with a pause control. Stops offscreen and in hidden tabs, and renders one still frame for reduced motion.",
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
    slug: "planet-shader",
    name: "ASCII planet",
    category: "ASCII",
    description: "A ringed planet rising over a glyph sea, drawn as ASCII on the GPU.",
    usage: '<PlanetShader color="#a5b4fc" speed={0.8} />',
    props: `${shaderProps} color tints the atmosphere, rim, and sea glow. Every glyph is drawn inside the shader, so it fills a full-width section at full frame rate. The pointer moves the sunlight across the planet, and over the water it sends out ripples. label sets the accessible name.`,
    traits: shader,
    color: "#a5b4fc",
    speed: true,
  },
  {
    slug: "ascii-black-hole",
    name: "ASCII black hole",
    category: "ASCII",
    description: "A black hole in dense characters, its disk orbiting into the dark.",
    usage: "<AsciiBlackHole speed={1} />",
    props:
      "speed and label are optional. Tens of thousands of glyphs per frame, batched by brightness so it stays fast. Inner rings orbit faster than outer ones, the approaching side burns white, and the far side of the disk is lensed into a ring. Ambient, with a pause control. Stops offscreen and in hidden tabs, and renders one still frame for reduced motion.",
    traits: ["reduced-motion", "offscreen-pause", "pause-control", "zero-deps"],
    speed: true,
  },


  {
    slug: "caustic-shader",
    name: "Caustic glass",
    category: "Shaders",
    description:
      "Light through moving glass. Refracted edges, depth, and shifting caustics.",
    usage: '<CausticShader color="#73d9ed" speed={1} />',
    props: shaderProps,
    traits: shader,
    color: "#73d9ed",
    speed: true,
  },
  {
    slug: "shutter-button",
    name: "Shutter button",
    category: "Buttons",
    description: "A mechanical reveal. Five panels, perfectly sequenced.",
    usage:
      '<ShutterButton onClick={() => console.log("Connect your action")}>\n  Open the future\n</ShutterButton>',
    props:
      "Accepts native button props and children. Hover and keyboard focus open the panels. Activation calls your onClick. Defaults to type=button; reduced motion switches without a transition.",
    traits: button,
    text: "Open the future",
  },

];
export const code = (slug: string) =>
  `S-${String(catalog.findIndex((c) => c.slug === slug) + 1).padStart(2, "0")}`;
export function exportName(slug: string) {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
}
