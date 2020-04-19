// https://github.com/atlassian/react-beautiful-dnd/blob/master/src/view/event-bindings/bind-events.js

function getOptions(shared, fromBinding) {
  return {
    ...shared,
    ...fromBinding
  };
}

export function bindEvents(el, bindings, sharedOptions) {
  const nextBindings = [].concat(bindings);
  const unBindings = nextBindings.map(binding => {
    const options = getOptions(sharedOptions, binding.options);
    el.addEventListener(binding.eventName, binding.fn, options);

    return function unbind() {
      el.removeEventListener(binding.eventName, binding.fn, options);
    };
  });

  // Return a function to unbind events
  return function unbindAll() {
    unBindings.forEach(unbind => unbind());
  };
}

// once event triggered. it will be teardown first...
export function bindEventsOnce(el, bindings, sharedOptions) {
  const nextBindings = [].concat(bindings);
  const unBindings = nextBindings.map(binding => {
    const options = getOptions(sharedOptions, binding.options);
    let unbind = () => {};

    const wrappedFn = e => {
      binding.fn.call(null, e);
      unbind();
    };

    el.addEventListener(binding.eventName, wrappedFn, options);

    unbind = () =>
      el.removeEventListener(binding.eventName, wrappedFn, options);

    return unbind;
  });

  // Return a function to unbind events
  return function unbindAll() {
    unBindings.forEach(unbind => unbind());
  };
}
