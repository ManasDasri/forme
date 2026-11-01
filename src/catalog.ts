export const categories = [
  "All components",
  "Imagery",
  "Interactions",
  "Navigation",
  "Buttons",
  "Cursors",
  "Layouts",
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
    slug: "project-index",
    name: "Project index",
    category: "Interactions",
    description: "A body of work, one considered selection at a time.",
    usage: `<ProjectIndex projects={[\n  { title: "Forma", category: "Architecture",\n    image: "/project.jpg", alt: "A sculptural building",\n    description: "A study of light and structure." }\n]} />`,
    props:
      "projects is an array with title, category, image, and alt. description is optional. Hover, focus, or select a project to update its image. Empty arrays render nothing.",
  },
  {
    slug: "expanding-gallery",
    name: "Form & structure",
    category: "Imagery",
    description: "A gallery that gives your selected image room to breathe.",
    usage: `<ExpandingGallery images={[\n  { src: "/one.jpg", alt: "Building facade", title: "Structure" },\n  { src: "/two.jpg", alt: "Interior detail", title: "Space" }\n]} />`,
    props:
      "images is an array of src, alt, and title objects. Click, tap, or use the keyboard to expand an image. Selected state is exposed through aria-pressed.",
  },
  {
    slug: "focus-cursor",
    name: "Focus cursor",
    category: "Cursors",
    description: "Move through an image. Discover a different layer.",
    usage: `<FocusCursor src="/landscape.jpg"\n  alt="A mountain lake" label="Look closer" />`,
    props:
      "src and alt are required; label is optional. The local lens reveals color under the pointer. Click, tap, Enter, or Space pins a centered lens. The native pointer is preserved. Pointer following is disabled for reduced motion.",
  },
  {
    slug: "magnetic-button",
    name: "Magnetic button",
    category: "Buttons",
    description: "A precise interaction with just enough attraction.",
    usage: `<MagneticButton onClick={() => console.log("Connect your action")}>\n  Discuss a project\n</MagneticButton>`,
    props:
      "Accepts native button props including onClick, disabled, and type. Defaults to type=button. Pointer attraction is disabled for touch and reduced motion. Customize --forme-button-bg and --forme-button-color.",
  },
  {
    slug: "image-reveal",
    name: "Image reveal",
    category: "Imagery",
    description: "A deliberate change of frame, controlled by the viewer.",
    usage: `<ImageReveal src="/project.jpg" alt="Architectural detail"\n  title="Forma" caption="Explore the perspective" />`,
    props:
      "src, alt, and title are required strings; caption is optional. Click, tap, Enter, or Space toggles the mask. aria-pressed communicates the state.",
  },
  {
    slug: "image-compare",
    name: "Image compare",
    category: "Imagery",
    description:
      "Make an art-direction decision visible. Slide between two views.",
    usage: `<ImageCompare before="/before.jpg" after="/after.jpg"\n  beforeAlt="Original treatment" afterAlt="Revised treatment"\n  beforeLabel="Original" afterLabel="Direction" initial={50} />`,
    props:
      "before, after, beforeAlt, and afterAlt are required. beforeLabel and afterLabel default to Before and After. initial is clamped to 0–100. The native range control supports touch and arrow keys. Images share the same object-fit crop.",
  },
  {
    slug: "case-study",
    name: "Case-study stage",
    category: "Layouts",
    access: "studio",
    description:
      "From selected work to the full story, without losing context.",
    usage: `<CaseStudy project={{\n  title: "Forma", category: "Architecture", year: "2026",\n  image: "/project.jpg", alt: "Project architecture",\n  description: "The thinking behind the work.",\n  credits: "Architecture and art direction by your studio."\n}} />`,
    props:
      "project contains title, category, image, alt, and description; year and credits are optional. Opens a full-viewport native dialog with image reveal, content, Escape, focus trapping, and focus restoration. It does not navigate to a new URL.",
  },
  {
    slug: "project-reel",
    name: "Project reel",
    category: "Layouts",
    access: "studio",
    description:
      "A photographic narrative at your visitor’s pace. No autoplay.",
    usage: `<ProjectReel frames={[\n  { src: "/one.jpg", alt: "Project exterior", title: "Arrival", caption: "A sense of place" },\n  { src: "/two.jpg", alt: "Project interior", title: "Inside" }\n]} />`,
    props:
      "frames is an array of src, alt, title, and optional caption objects. A scrub control and previous/next buttons select frames. Controls announce the active frame. No autoplay or scroll interception; reduced motion switches immediately.",
  },
  {
    slug: "preview-navigation",
    name: "Preview navigation",
    category: "Navigation",
    access: "studio",
    description: "Navigation with a preview of where you’re going.",
    usage: `<PreviewNavigation brand="Your studio" links={[\n  { label: "Work", href: "/work", image: "/work.jpg",\n    alt: "Selected project", description: "Selected projects" },\n  { label: "Studio", href: "/about", image: "/studio.jpg",\n    alt: "Studio interior", description: "People and practice" }\n]} />`,
    props:
      "links is an array of label, href, image, alt, and optional description objects. brand is optional. A native dialog contains navigable links and an image preview that responds to hover and focus. Links stay directly usable on touch.",
  },
];
export const freeCount = catalog.filter((c) => c.access !== "studio").length;
export const studioCount = catalog.length - freeCount;
export function exportName(slug: string) {
  return slug
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
}
