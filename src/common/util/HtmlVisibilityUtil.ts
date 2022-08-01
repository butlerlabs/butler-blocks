/**
 * Calculates if the specified element is currently in the viewport.
 *
 * Based on https://stackoverflow.com/questions/45514676/react-check-if-element-is-visible-in-dom
 * @param divRef
 * @returns
 */
const isInViewport = (divRef: HTMLDivElement | null): boolean => {
  if (!divRef) return false;
  const top = divRef.getBoundingClientRect().top;
  return top >= 0 && top <= window.innerHeight;
};

/**
 * Calculates if the specified element is currently in the given container.
 *
 * @param element
 * @param container
 * @returns
 */
const isInContainer = (
  element: HTMLDivElement | null,
  container: HTMLDivElement | null,
  options?: {
    topOffset?: number;
    bottomOffset?: number;
  },
): boolean => {
  if (!element || !container) return false;
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return (
    elementRect.top >= containerRect.top - (options?.topOffset ?? 0) &&
    elementRect.top <= container.clientHeight - (options?.bottomOffset ?? 0)
  );
};

export const HtmlVisibilityUtil = {
  isInViewport,
  isInContainer,
};
