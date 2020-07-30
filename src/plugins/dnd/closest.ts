import { find } from './find';

const supportedMatchesName = (() => {
  const base = 'matches';

  // Server side rendering
  if (typeof document === 'undefined') {
    return base;
  }

  // See https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  const candidates = [base, 'msMatchesSelector', 'webkitMatchesSelector'];

  const value = find(candidates, name => name in Element.prototype);

  return value || base;
})();

function closestPonyfill(
  el: HTMLElement | null,
  selector: string
): HTMLElement | null {
  if (el == null) {
    return null;
  }

  // Element.prototype.matches is supported in ie11 with a different name
  // https://caniuse.com/#feat=matchesselector
  // $FlowFixMe - dynamic property
  if ((el as any)[supportedMatchesName](selector)) {
    return el;
  }

  // recursively look up the tree
  return closestPonyfill(el.parentElement, selector);
}

// current element will be excluded from search result
export const exclusiveClosest = (
  el: HTMLElement,
  selector: string
): HTMLElement | null => {
  const parent = el.parentNode as HTMLElement;
  if (parent) return closest(parent, selector);
  return null;
};

export default function closest(
  el: HTMLElement | null,
  selector: string
): HTMLElement | null {
  if (!el) return null;
  // Using native closest for maximum speed where we can
  if (el.closest) {
    return el.closest(selector);
  }
  // ie11: damn you!
  return closestPonyfill(el, selector);
}
