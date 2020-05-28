class Container {
  constructor() {
    this.children = [
      {
        containerId: "",
        draggerId: "",
        cleanup: () => {}
      }
    ];
  }
}

export default Container;
