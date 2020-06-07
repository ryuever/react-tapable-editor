class SortedItems {
  constructor({ sorter }) {
    this.sorter = sorter;
    this.items = [];
  }

  add(item) {
    this.items.push(item);
    this.items.sort(this.sorter);
  }

  remove(item) {
    const index = this.findIndex(item);
    if (index !== -1) this.items.splice(index, 1);
  }

  findIndex(item) {
    const { id } = item;
    return this.items.findIndex(item => item.id === id);
  }

  getSize() {
    return this.items.length;
  }

  getItem(index) {
    return this.items[index];
  }

  slice(...args) {
    return this.items.slice.apply(null, args);
  }
}

export default SortedItems;
