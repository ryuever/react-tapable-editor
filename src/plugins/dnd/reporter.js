const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function reporter() {
  this.logAddEffect = component => {
    const { id } = component;
    `Add effect to component %c${id}`, 'background: #222; color: red';
  };

  this.logRemoveEffect = component => {
    const { id } = component;
    console.log(
      `Remove effect from component %c${id}`,
      'background: #222; color: #bada55'
    );
  };

  const manipulateNode = (action, name) => node => {
    console.log(`${capitalize(action)} ${name} node`, node);
  };

  this.addContainerNode = manipulateNode('add', 'container');
  this.addDraggerNode = manipulateNode('add', 'dragger');
  this.removeContainerNode = manipulateNode('remove', 'container');

  this.logEnterContainer = container => {
    console.log(`On enter: %c${container.id}`, 'color: #bada55');
  };

  this.logLeaveContainer = container => {
    console.log(`On leave: %c${container.id}`, 'color: #bada55');
  };
}

export default new reporter();
