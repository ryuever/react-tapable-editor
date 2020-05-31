export const setContainerAttributes = (container, config) => {
  const { orientation } = config;
  const id = container.id;
  const el = container.el;

  el.setAttribute("data-is-container", "true");
  el.setAttribute("data-container-id", id);
  el.setAttribute("data-orientation", orientation);
};

export const setDraggerAttributes = (container, dragger) => {
  const containerId = container.id;
  const draggerId = dragger.id;
  const el = dragger.el;
  el.setAttribute("data-is-dragger", "true");
  el.setAttribute("data-dragger-id", draggerId);
  el.setAttribute("data-container-context", containerId);
};
