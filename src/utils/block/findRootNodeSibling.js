export default (blockMap, blockKey, direction = "forward") => {
  const block = blockMap
    .toSeq()
    .skipUntil(block => {
      return block.getKey() === blockKey;
    })
    .skip(1)
    .find(block => {
      return !block.parent;
    });

  if (block) return block.getKey();
  return null;
};
