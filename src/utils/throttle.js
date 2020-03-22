export default function throttle(fn, timeout) {
  let isAvailable = true;

  return function(...args) {
    if (!isAvailable) return;
    isAvailable = false;
    setTimeout(() => {
      fn(...args);
      isAvailable = true;
    }, timeout);
  };
}
