export function findIndex(list, predicate) {
  if (list.findIndex) {
    return list.findIndex(predicate);
  }

  // Using a for loop so that we can exit early
  for (let i = 0; i < list.length; i++) {
    if (predicate(list[i])) {
      return i;
    }
  }

  // Array.prototype.find returns -1 when nothing is found
  return -1;
}

export function find(list, predicate) {
  if (list.find) {
    return list.find(predicate);
  }
  const index = findIndex(list, predicate);
  if (index !== -1) {
    return list[index];
  }
  // Array.prototype.find returns undefined when nothing is found
  return undefined;
}
