export const categories = [
  "All components",
  "Typography",
  "Imagery",
  "Navigation",
  "Interactions",
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
    slug: "editorial-hero",
    name: "Editorial hero",
    category: "Typography",
    description:
      "An opening with a point of view. Type and imagery, perfectly timed.",
    usage: `<EditorialHero\n  brand="Serein studio"\n  title="Room to feel."\n  subtitle="Spaces for a slower kind of living."\n  image="/your-image.jpg"\n  alt="Sunlit interior with sculptural furniture"\n/>`,
    props:
      "title, subtitle, image, and alt are required strings. brand is optional. The reveal plays once as the component enters the viewport.",
  },
  {
    slug: "project-index",
    name: "Project index",
    category: "Interactions",
    description: "A quiet list. A new perspective on every project.",
    usage: `<ProjectIndex projects={[\n  { title: "Serein", category: "Architecture",\n    image: "/project.jpg", alt: "Serein interior",\n    description: "A considered place to call home." }\n]} />`,
    props:
      "projects is an array of objects with title, category, image, and alt. description is optional. Hover, focus, or select a project to update the preview.",
  },
  {
    slug: "image-reveal",
    name: "Image reveal",
    category: "Imagery",
    description:
      "Let the image break out of its frame. A small moment of discovery.",
    usage: `<ImageReveal\n  src="/your-image.jpg"\n  alt="Sculptural concrete architecture"\n  title="Perspective"\n  caption="See the whole picture"\n/>`,
    props:
      "src, alt, and title are required strings. caption is optional. Click, tap, Enter, or Space toggles the reveal. aria-pressed exposes its state.",
  },
  {
    slug: "fullscreen-menu",
    name: "Full-screen menu",
    category: "Navigation",
    description: "Give navigation a little room to express itself.",
    usage: `<FullscreenMenu brand="Your studio" links={[\n  { label: "Selected work", href: "/work" },\n  { label: "About the studio", href: "/about" },\n  { label: "Get in touch", href: "/contact" }\n]} />`,
    props:
      "links is an array of label and href objects. brand is optional. A native modal dialog handles focus, Escape, and keyboard navigation.",
  },
  {
    slug: "expanding-gallery",
    name: "Expanding gallery",
    category: "Imagery",
    description: "A collection that makes space for what catches your eye.",
    usage: `<ExpandingGallery images={[\n  { src: "/one.jpg", alt: "Concrete facade", title: "Form" },\n  { src: "/two.jpg", alt: "Softly lit interior", title: "Space" },\n  { src: "/three.jpg", alt: "Mountain landscape", title: "Stillness" }\n]} />`,
    props:
      "images is an array with src, alt, and title for each image. Select an image to expand it. Each selection is a keyboard-accessible button.",
  },
  {
    slug: "motion-link",
    name: "Rolling link",
    category: "Typography",
    description: "A familiar gesture with an unexpected finish.",
    usage: `<MotionLink href="/your-project">\n  Explore the project\n</MotionLink>`,
    props:
      "Accepts standard React anchor attributes, including href, target, and className. Pass plain text as children for the rolling label effect.",
  },
  {
    slug: "magnetic-button",
    name: "Magnetic button",
    category: "Buttons",
    description:
      "A gentle pull. A satisfying response. A button with presence.",
    usage: `<MagneticButton onClick={() => setOpen(true)}>\n  Start a conversation\n</MagneticButton>`,
    props:
      "Accepts native button props, including onClick, disabled, and type. Defaults to type=button. Pointer attraction is disabled for touch and reduced motion. Set --forme-button-bg and --forme-button-color to customize its colors.",
  },
  {
    slug: "focus-cursor",
    name: "Focus cursor",
    category: "Cursors",
    description:
      "An image that comes to life beneath your cursor. Stay curious.",
    usage: `<FocusCursor\n  src="/landscape.jpg"\n  alt="A mountain lake at dawn"\n  label="A closer look"\n/>`,
    props:
      "src and alt are required. label is optional. Move the pointer to reveal color, or click, tap, Enter, or Space to pin a centered lens. The native cursor is preserved. Reduced motion uses the centered, selectable lens.",
  },
  {
    slug: "type-switcher",
    name: "Type switcher",
    category: "Typography",
    description: "An editorial headline with another side to the story.",
    usage: `<TypeSwitcher\n  phrases={["Less noise. More meaning.", "More feeling. Less ordinary."]}\n  caption="Select to change the headline."\n/>`,
    props:
      "phrases is an array of strings. caption is optional. Select the component to cycle through headlines; there is no autoplay. The current headline is announced politely. Customize --forme-type-bg and --forme-type-color.",
  },
  {
    slug: "story-scroll",
    access: "studio",
    name: "Scroll story",
    category: "Layouts",
    description: "A changing image. A slower read. Let the story unfold.",
    usage: `<StoryScroll chapters={[\n  { title: "A sense of place.", body: "Every space begins with a feeling.",\n    image: "/interior.jpg", alt: "A calm, sunlit room" },\n  { title: "Room for more.", body: "Thoughtful details make the difference.",\n    image: "/detail.jpg", alt: "A sculptural architectural detail" }\n]} />`,
    props:
      "chapters is an array of title, body, image, and alt objects. The reading pane scrolls independently, with chapter buttons as an alternative. Images crossfade as the selected chapter changes. Give the component a parent with a defined height.",
  },
  {
    slug: "layout-switch",
    access: "studio",
    name: "Perspective layout",
    category: "Layouts",
    description:
      "One body of work. Two ways of seeing it. Seamlessly connected.",
    usage: `<LayoutSwitch items={[\n  { title: "Serein", category: "Architecture",\n    image: "/interior.jpg", alt: "A softly lit interior" },\n  { title: "Elsewhere", category: "Travel",\n    image: "/mountains.jpg", alt: "Mountains above a still lake" }\n]} />`,
    props:
      "items is an array of title, category, image, and alt objects. Grid and List controls animate the same content between layouts. Reduced motion switches immediately. Customize --forme-layout-bg, --forme-layout-color, and --forme-layout-selected.",
  },
  {
    slug: "image-accordion",
    access: "studio",
    name: "Image accordion",
    category: "Interactions",
    description:
      "Make space for the details. An unfolding story in type and image.",
    usage: `<ImageAccordion items={[\n  { title: "Our perspective", description: "A slower, more considered approach.",\n    image: "/studio.jpg", alt: "The studio interior" },\n  { title: "Our practice", description: "Built around the way you live.",\n    image: "/work.jpg", alt: "A recently completed space" }\n]} />`,
    props:
      "items is an array with title, description, image, and alt. One panel opens at a time; the current panel can also be closed. Native buttons expose aria-expanded and reference their content. Customize --forme-accordion-bg and --forme-accordion-color.",
  },
];

export function exportName(slug: string) {
  const names: Record<string, string> = {
    "editorial-hero": "EditorialHero",
    "project-index": "ProjectIndex",
    "image-reveal": "ImageReveal",
    "fullscreen-menu": "FullscreenMenu",
    "expanding-gallery": "ExpandingGallery",
    "motion-link": "MotionLink",
    "magnetic-button": "MagneticButton",
    "focus-cursor": "FocusCursor",
    "type-switcher": "TypeSwitcher",
    "story-scroll": "StoryScroll",
    "layout-switch": "LayoutSwitch",
    "image-accordion": "ImageAccordion",
  };
  return names[slug];
}
