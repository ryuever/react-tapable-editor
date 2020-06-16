function reporter() {
  this.logAddEffect = component => {
    const id = component.id;
    console.log(
      `Add effect to component %c${id}`,
      "background: #222; color: red"
    );
  };

  this.logRemoveEffect = component => {
    const id = component.id;
    console.log(
      `Remove effect from component %c${id}`,
      "background: #222; color: #bada55"
    );
  };
}

export default new reporter();
