import { useState } from "react";
import { ProjectIndex } from "./registry/project-index";
import { ExpandingGallery } from "./registry/expanding-gallery";
import { FocusCursor } from "./registry/focus-cursor";
import { MagneticButton } from "./registry/magnetic-button";
import { ImageReveal } from "./registry/image-reveal";
import { ImageCompare } from "./registry/image-compare";
import { CaseStudy } from "./registry/case-study";
import { ProjectReel } from "./registry/project-reel";
import { PreviewNavigation } from "./registry/preview-navigation";

export const projects = [
  {
    title: "Forma",
    category: "Architecture",
    image: "/images/architecture.jpg",
    alt: "Stepped glass towers photographed from below",
    description: "A study in light and structure.",
  },
  {
    title: "Serein",
    category: "Interiors",
    image: "/images/interior.jpg",
    alt: "A softly lit contemporary interior",
    description: "A considered place to call home.",
  },
  {
    title: "Elsewhere",
    category: "Landscape",
    image: "/images/landscape.jpg",
    alt: "A mountain lake surrounded by forests",
    description: "A different sense of place.",
  },
];
export function Demo({
  slug,
  title,
  image,
}: {
  slug: string;
  title?: string;
  image?: string;
  expanded?: boolean;
}) {
  const [clicked, setClicked] = useState(false);
  if (slug === "project-index")
    return (
      <ProjectIndex
        projects={projects.map((p, i) =>
          i === 0
            ? { ...p, title: title || p.title, image: image || p.image }
            : p,
        )}
      />
    );
  if (slug === "expanding-gallery")
    return (
      <ExpandingGallery
        images={projects.map((p, i) => ({
          src: p.image,
          alt: p.alt,
          title: i === 0 ? title || "Form & structure" : p.title,
        }))}
      />
    );
  if (slug === "focus-cursor")
    return (
      <FocusCursor
        src={image || "/images/landscape.jpg"}
        alt="A mountain lake surrounded by forests"
        label={title || "Discover the detail"}
      />
    );
  if (slug === "magnetic-button")
    return (
      <div className="magnet-specimen">
        <span className="specimen-context">A detail that responds.</span>
        <MagneticButton onClick={() => setClicked(!clicked)}>
          {clicked ? "Let’s begin" : title || "Discuss a project"}
        </MagneticButton>
        <span role="status">
          {clicked
            ? "Selected. Connect this button to your own action."
            : "Move your pointer closer. Select to interact."}
        </span>
      </div>
    );
  if (slug === "image-reveal")
    return (
      <ImageReveal
        src={image || "/images/architecture.jpg"}
        alt="Stepped glass towers photographed from below"
        title={title || "Forma"}
        caption="Change the perspective"
      />
    );
  if (slug === "image-compare")
    return (
      <div className="compare-specimen">
        <ImageCompare
          before={image || "/images/interior.jpg"}
          after={image || "/images/interior.jpg"}
          beforeAlt="Interior with a monochrome treatment"
          afterAlt="The same interior in color"
          beforeLabel={title || "Monochrome"}
          afterLabel="Color"
        />
      </div>
    );
  if (slug === "case-study")
    return (
      <CaseStudy
        project={{
          ...projects[0],
          title: title || "Forma",
          image: image || projects[0].image,
          year: "2026",
          description:
            "A study of light, scale, and the spaces in between. This fictional case study demonstrates a complete project entrance, with room for your process, narrative, and credits.",
          credits:
            "Illustrative project. Replace with your own work and credits.",
        }}
      />
    );
  if (slug === "project-reel")
    return (
      <ProjectReel
        frames={projects.map((p, i) => ({
          src: p.image,
          alt: p.alt,
          title: i === 0 ? title || p.title : p.title,
          caption: p.description,
        }))}
      />
    );
  if (slug === "preview-navigation")
    return (
      <PreviewNavigation
        brand={title || "Atelier"}
        links={[
          {
            label: "Selected work",
            href: "/collections/editorial/",
            image: projects[0].image,
            alt: projects[0].alt,
            description: "The things we make",
          },
          {
            label: "The collection",
            href: "/collections/",
            image: projects[1].image,
            alt: projects[1].alt,
            description: "A family of interactions",
          },
          {
            label: "Studio edition",
            href: "/studio/",
            image: projects[2].image,
            alt: projects[2].alt,
            description: "Complete compositions",
          },
        ]}
      />
    );
  return null;
}
