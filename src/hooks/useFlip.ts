import { useLayoutEffect, useRef } from "react";

export const FLIP_DURATION_MS = 420;
export const FLIP_EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";

interface Options {
  isEnabled: boolean;
  durationMs?: number;
}

/**
 * First: call `capture()` right before the state change that moves elements.
 * Last / Invert / Play: run in useLayoutEffect after the DOM changed, before paint.
 */
export const useFlip = (layoutKey: unknown, { isEnabled, durationMs = FLIP_DURATION_MS }: Options) => {
  const elementsRef = useRef(new Map<string, HTMLElement>());
  const rectsBeforeRef = useRef<Map<string, DOMRect> | null>(null);

  const register = (key: string) => (element: HTMLElement | null) => {
    if (element == null) return;
    elementsRef.current.set(key, element);
    return () => {
      elementsRef.current.delete(key);
    };
  };

  const capture = () => {
    rectsBeforeRef.current = new Map(
      Array.from(elementsRef.current, ([key, element]) => [key, element.getBoundingClientRect()]),
    );
  };

  useLayoutEffect(() => {
    const rectsBefore = rectsBeforeRef.current;
    rectsBeforeRef.current = null;
    if (rectsBefore == null || !isEnabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    elementsRef.current.forEach((element, key) => {
      const first = rectsBefore.get(key);
      if (first == null) return;
      const last = element.getBoundingClientRect();
      const deltaX = first.left - last.left;
      const deltaY = first.top - last.top;
      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
      element.animate(
        [{ transform: `translate(${deltaX}px, ${deltaY}px)` }, { transform: "none" }],
        { duration: durationMs, easing: FLIP_EASING },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutKey]);

  return { register, capture };
};
