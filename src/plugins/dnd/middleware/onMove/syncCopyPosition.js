export default ({ event, clone }, ctx, actions) => {
  const { clientY, clientX } = event;
  clone.style.position = "fixed";
  clone.style.top = `${clientY}px`;
  clone.style.left = `${clientX}px`;

  actions.next();
};
