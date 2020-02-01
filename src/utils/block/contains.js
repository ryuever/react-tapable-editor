const contains = (blockMap, key1, key2) => {
  if (key1 === key2) return true

  const block1 = blockMap.get(key1)
  const block2 = blockMap.get(key2)

  // console.log('contains : ', key1, key2)

  if (!block1 || !block2) return false

  const childKeys = block1.getChildKeys().toArray()

  if (childKeys.indexOf(key2) !== -1) return true

  for (let i = 0; i < childKeys.length; i++) {
    const key = childKeys[i]
    if (contains(blockMap, key, key2)) return true
  }

  return false
}

export default contains