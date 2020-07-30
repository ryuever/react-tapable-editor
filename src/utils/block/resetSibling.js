export default block => {
  return block.merge({
    prevSibling: null,
    nextSibling: null,
  });
};
