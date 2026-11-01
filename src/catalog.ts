export const categories = [
  "All components",
  "Buttons",
  "Shaders",
  "ASCII",
] as const;
export type Category = (typeof categories)[number];
export const catalog: {
  slug: string;
  name: string;
  category: Category;
  access?: "studio";
  description: string;
  usage: string;
  props: string;
}[] = [
  {
    slug: "silk-shader",
    name: "Silk field",
    category: "Shaders",
    description: "A flowing field of light. Bend the folds with your pointer.",
    usage: '<SilkShader color="#385dff" speed={1} />',
    props:
      "color is a six-digit hex value; speed is clamped to 0–3. Uses WebGL with a static CSS fallback, pauses offscreen and in hidden tabs, and renders a still frame for reduced motion.",
  },
  {
    slug: "prism-button",
    name: "Prism button",
    category: "Buttons",
    description: "Brushed metal, refracted light, and a responsive highlight.",
    usage:
      '<PrismButton onClick={() => console.log("Connect your action")}>\n  Enter the experience\n</PrismButton>',
    props:
      "Accepts native button props and children. Defaults to type=button. The highlight follows the pointer; reduced motion removes animated sweeps. Native disabled and focus states are supported.",
  },
  {
    slug: "ascii-orbit",
    name: "ASCII orbit",
    category: "ASCII",
    description: "A dimensional object, drawn entirely from characters.",
    usage:
      '<AsciiOrbit color="#d2d7e3" speed={1} label="Rotating ASCII torus" />',
    props:
      "color, speed, and accessible label are optional. The ASCII torus responds to pointer movement, includes a pause control, stops offscreen, and becomes still for reduced motion.",
  },
  {
    slug: "dither-shader",
    name: "Dither terrain",
    category: "Shaders",
    description: "A changing topography of pixels, noise, and light.",
    usage: '<DitherShader color="#c5dacb" speed={0.8} />',
    props:
      "color is a six-digit hex value; speed is clamped to 0–3. A WebGL fragment shader with pointer interaction and a static fallback. Rendering stops offscreen and follows reduced-motion preferences.",
  },
  {
    slug: "magnetic-button",
    name: "Magnetic button",
    category: "Buttons",
    description: "A little attraction. A satisfying response.",
    usage:
      '<MagneticButton onClick={() => console.log("Connect your action")}>\n  Make contact\n</MagneticButton>',
    props:
      "Accepts native button props including onClick, disabled, and type. Defaults to type=button. Pointer attraction is disabled for touch and reduced motion. Customize --forme-button-bg and --forme-button-color.",
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
  },
  {
    slug: "orbital-shader",
    name: "Orbital field",
    category: "Shaders",
    access: "studio",
    description: "An orbit of light, pulled into a luminous singularity.",
    usage: '<OrbitalShader color="#b398f3" speed={1} />',
    props:
      "color is a six-digit hex value; speed is clamped to 0–3. The shared WebGL runtime handles lifecycle, pointer interaction, reduced motion, and static fallback. Part of the planned Studio edition.",
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
  },
  {
    slug: "ascii-text",
    name: "Signal text",
    category: "ASCII",
    access: "studio",
    description:
      "From interference to intent. A headline that assembles itself.",
    usage:
      '<AsciiText text="HELLO, FUTURE." duration={0.85}\n  characters="01/<>_-=+*#" />',
    props:
      "text, duration in seconds, and scramble characters are optional. Pointer entry, focus, and selection replay the reveal. Reduced motion shows the final text immediately. Animation frames are cleaned up on unmount.",
  },
];
export const freeCount = catalog.filter((c) => c.access !== "studio").length;
export const studioCount = catalog.length - freeCount;
export function exportName(slug: string) {
  const names: Record<string, string> = {
    "silk-shader": "SilkShader",
    "dither-shader": "DitherShader",
    "orbital-shader": "OrbitalShader",
  };
  return (
    names[slug] ||
    slug
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join("")
  );
}
export function componentFiles(slug: string) {
  return slug.endsWith("-shader")
    ? [`${slug}.tsx`, "shader-canvas.tsx", "shader-canvas.css"]
    : [`${slug}.tsx`, `${slug}.css`];
}
