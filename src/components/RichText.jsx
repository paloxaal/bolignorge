import React from "react";
import { COL } from "../data";

/**
 * Rendrer narrativ tekst med klikkbare lenker.
 *
 * Støtter to former:
 *   1. [tekst](https://eksempel.no)  →  klikkbar «tekst»
 *   2. Rene URL-er (https://…)       →  klikkbar URL
 *
 * Kun http/https slipper gjennom regexen, så javascript:-lenker o.l. er
 * ikke mulig å smugle inn via statustekstene.
 */
const LINK_RE =
  /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>()[\]]*[^\s<>()[\].,;:!?'"«»])/g;

export default function RichText({ text, linkColor = COL.gold }) {
  if (!text) return null;
  const nodes = [];
  const re = new RegExp(LINK_RE.source, "g");
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const label = m[1] || m[3];
    const href = m[2] || m[3];
    nodes.push(
      <a
        key={`${m.index}-${href}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: linkColor,
          fontWeight: 600,
          textDecoration: "underline",
          textUnderlineOffset: "2px",
          wordBreak: "break-word",
        }}
      >
        {label}
      </a>
    );
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
