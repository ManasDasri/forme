import { EditorialHero } from "./registry/editorial-hero";
import { ProjectIndex } from "./registry/project-index";
import { ImageReveal } from "./registry/image-reveal";
import { FullscreenMenu } from "./registry/fullscreen-menu";
import { ExpandingGallery } from "./registry/expanding-gallery";
import { MotionLink } from "./registry/motion-link";
import { useState } from "react";
import { MagneticButton } from "./registry/magnetic-button";
import { FocusCursor } from "./registry/focus-cursor";
import { TypeSwitcher } from "./registry/type-switcher";
import { StoryScroll } from "./registry/story-scroll";
import { LayoutSwitch } from "./registry/layout-switch";
import { ImageAccordion } from "./registry/image-accordion";
const repo = "https://github.com/ManasDasri/forme";
const pictures = {
  interior: "/images/interior.jpg",
  architecture: "/images/architecture.jpg",
  landscape: "/images/landscape.jpg",
};
const galleryImages = [
  {
    src: pictures.architecture,
    alt: "Stepped glass skyscrapers beneath a cloudy sky",
    title: "Form & structure",
  },
  {
    src: pictures.interior,
    alt: "A softly lit interior with warm natural materials",
    title: "Room to feel",
  },
  {
    src: pictures.landscape,
    alt: "A quiet lake beneath a mountain range",
    title: "A slower pace",
  },
];

export function Demo({
  slug,
  title,
  expanded = false,
  image,
}: {
  slug: string;
  title?: string;
  expanded?: boolean;
  image?: string;
}) {
  const [clicked, setClicked] = useState(false);
  if (slug === "magnetic-button")
    return (
      <div className="magnet-specimen">
        <span>A little attraction goes a long way.</span>
        <MagneticButton onClick={() => setClicked(!clicked)}>
          {clicked ? "Connection made" : title || "Let’s make something"}
        </MagneticButton>
        <span role="status">
          {clicked
            ? "A real response. Yours to connect."
            : "Move closer. Then give it a click."}
        </span>
      </div>
    );
  if (slug === "focus-cursor")
    return (
      <FocusCursor
        src={image || pictures.landscape}
        alt="A mountain lake surrounded by forests and high peaks"
        label={title || "Look a little closer."}
      />
    );
  if (slug === "type-switcher")
    return (
      <TypeSwitcher
        phrases={[
          title || "Less noise. More meaning.",
          "More feeling. Less ordinary.",
          "A little space. A new perspective.",
        ]}
        caption="Select for another perspective."
      />
    );
  if (slug === "story-scroll")
    return (
      <StoryScroll
        chapters={[
          {
            title: title || "A sense of place.",
            body: "It starts with the way a space makes you feel. Quiet, grounded, entirely your own.",
            image: image || pictures.interior,
            alt: "A quiet interior with a natural palette",
          },
          {
            title: "A different angle.",
            body: "Light and structure in conversation. The details change the way we see the whole.",
            image: pictures.architecture,
            alt: "Stepped glass towers photographed from below",
          },
          {
            title: "Room to wander.",
            body: "A slower pace. An open horizon. Sometimes the best direction is a little further out.",
            image: pictures.landscape,
            alt: "Mountains reflected in a still lake",
          },
        ]}
      />
    );
  if (slug === "layout-switch")
    return (
      <LayoutSwitch
        items={galleryImages.map((item, i) => ({
          title: i === 0 ? title || "Forma" : i === 1 ? "Serein" : "Elsewhere",
          category: ["Architecture", "Interiors", "Travel"][i],
          image: item.src,
          alt: item.alt,
        }))}
      />
    );
  if (slug === "image-accordion")
    return (
      <ImageAccordion
        items={galleryImages.map((item, i) => ({
          title:
            i === 0
              ? title || "The perspective"
              : i === 1
                ? "The practice"
                : "The possibilities",
          description: [
            "A considered eye for the spaces we share. Every detail has something to say.",
            "Built around the way you live. Natural materials, quiet confidence.",
            "Leave a little room for the unexpected. Follow a different direction.",
          ][i],
          image: item.src,
          alt: item.alt,
        }))}
      />
    );
  if (slug === "editorial-hero")
    return (
      <EditorialHero
        brand="Serein studio"
        title={title || "Room to feel."}
        subtitle="Spaces for a slower kind of living."
        image={image || pictures.interior}
        alt="A calm interior with natural materials and soft light"
      />
    );
  if (slug === "project-index")
    return (
      <ProjectIndex
        projects={[
          {
            title: title || "Serein",
            category: "Architecture",
            image: image || pictures.interior,
            alt: "A quiet contemporary interior",
            description: "A considered place to call home.",
          },
          {
            title: "Forma",
            category: "Art direction",
            image: pictures.architecture,
            alt: "Stepped glass skyscrapers beneath a cloudy sky",
            description: "A study in light and structure.",
          },
          {
            title: "Elsewhere",
            category: "Travel & culture",
            image: pictures.landscape,
            alt: "Mountains reflected in a lake",
            description: "A little closer to the outdoors.",
          },
        ]}
      />
    );
  if (slug === "image-reveal")
    return (
      <ImageReveal
        src={image || pictures.architecture}
        alt="A stepped glass skyscraper seen from below"
        title={title || "Forma"}
        caption="Tap to change your perspective"
      />
    );
  if (slug === "fullscreen-menu")
    return (
      <FullscreenMenu
        brand={title || "Studio North"}
        links={[
          { label: "The collection", href: "/collections/editorial/" },
          { label: "Our approach", href: "/#approach" },
          { label: "Source on GitHub", href: repo },
        ]}
      />
    );
  if (slug === "expanding-gallery")
    return (
      <ExpandingGallery
        images={galleryImages.map((image, i) =>
          i === 0 && title ? { ...image, title } : image,
        )}
      />
    );
  return (
    <div className={`link-specimen ${expanded ? "is-expanded" : ""}`}>
      <span className="link-specimen-kicker">
        Small details. Lasting impressions.
      </span>
      <MotionLink href="/collections/editorial/">
        {title || "Make an impression"}
      </MotionLink>
      <span className="link-specimen-caption">
        Hover or focus to feel the difference.
      </span>
      <span className="link-orbit" aria-hidden="true">
        ✳
      </span>
    </div>
  );
}
