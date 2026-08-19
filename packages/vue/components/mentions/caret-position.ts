const PROPERTIES_TO_COPY = [
  "direction",
  "boxSizing",
  "width",
  "height",
  "overflowX",
  "overflowY",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderStyle",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "fontSizeAdjust",
  "lineHeight",
  "fontFamily",
  "textAlign",
  "textTransform",
  "textIndent",
  "textDecoration",
  "letterSpacing",
  "wordSpacing",
  "tabSize",
  "whiteSpace",
  "wordBreak",
  "wordWrap",
] as const;

export interface CaretRect {
  top: number;
  left: number;
  height: number;
}

export function getCaretRect(
  textarea: HTMLTextAreaElement,
  position: number,
): CaretRect {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const style = div.style;
  const computed = window.getComputedStyle(textarea);

  style.position = "absolute";
  style.visibility = "hidden";
  style.whiteSpace = "pre-wrap";
  style.wordWrap = "break-word";
  style.top = "0";
  style.left = "0";

  for (const prop of PROPERTIES_TO_COPY) {
    (style as any)[prop] = (computed as any)[prop];
  }

  style.overflow = "hidden";

  const text = textarea.value.substring(0, position);
  div.textContent = text;

  const span = document.createElement("span");
  span.textContent = textarea.value.substring(position) || ".";
  div.appendChild(span);

  const spanRect = span.getBoundingClientRect();
  const divRect = div.getBoundingClientRect();
  const taRect = textarea.getBoundingClientRect();

  const result: CaretRect = {
    top: taRect.top + (spanRect.top - divRect.top) - textarea.scrollTop,
    left: taRect.left + (spanRect.left - divRect.left) - textarea.scrollLeft,
    height: spanRect.height,
  };

  document.body.removeChild(div);
  return result;
}
