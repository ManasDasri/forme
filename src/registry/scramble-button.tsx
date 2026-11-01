"use client";
import type { ButtonHTMLAttributes } from "react";
import { useDecode } from "./ascii-decode";
import "./ascii-decode.css";
import "./scramble-button.css";

export function ScrambleButton({
  children,
  className = "",
  type = "button",
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: string;
}) {
  const [shown, run] = useDecode(children, 520);
  return (
    <button
      {...props}
      type={type}
      className={`forme-scramble ${className}`}
      onPointerEnter={(e) => {
        run();
        props.onPointerEnter?.(e);
      }}
      onFocus={(e) => {
        run();
        props.onFocus?.(e);
      }}
    >
      <span className="forme-scramble-index" aria-hidden="true">
        [01]
      </span>
      <span className="forme-decode">
        <span className="forme-decode-final">{children}</span>
        <span className="forme-decode-live" aria-hidden="true">
          {shown}
        </span>
      </span>
      <span className="forme-scramble-cursor" aria-hidden="true" />
    </button>
  );
}
