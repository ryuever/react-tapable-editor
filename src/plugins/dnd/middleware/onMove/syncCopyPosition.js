export default ({ impactPoint, clone }, ctx, actions) => {
  const [clientX, clientY] = impactPoint;
  clone.style.position = "fixed";
  clone.style.top = `${clientY}px`;
  clone.style.left = `${clientX}px`;

  actions.next();
};
