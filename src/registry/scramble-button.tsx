"use client";
import type { ButtonHTMLAttributes } from "react";
import { DecodeCells, useDecode } from "./ascii-decode";
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
  const [cells, run] = useDecode(children, 560);
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
      <span className="forme-decode">
        <span className="forme-decode-final">{children}</span>
        <DecodeCells cells={cells} />
      </span>
    </button>
  );
}
