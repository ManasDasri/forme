"use client";
import "./typing-dots.css";

/** Three dots that lift in turn, for "someone is typing" and other short waits. */
export function TypingDots({ label = "Typing", className = "" }: { label?: string; className?: string }) {
  return (
    <span role="status" aria-label={label} className={`forme-typing ${className}`}>
      <i />
      <i />
      <i />
    </span>
  );
}
