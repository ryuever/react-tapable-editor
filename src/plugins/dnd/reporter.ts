import Container from './Container';
import { LoggerComponent } from '../../types';

const capitalize = (s: string) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function reporter() {
  this.logAddEffect = (component: LoggerComponent) => {
    const { id } = component;
    console.log(
      `Add effect to component %c${id}`,
      'background: #222; color: red'
    );
  };

  this.logRemoveEffect = (component: LoggerComponent) => {
    const { id } = component;
    console.log(
      `Remove effect from component %c${id}`,
      'background: #222; color: #bada55'
    );
  };

  const manipulateNode = (action: string, name: string) => (
    node: HTMLElement
  ) => {
    console.log(`${capitalize(action)} ${name} node`, node);
  };

  this.addContainerNode = manipulateNode('add', 'container');
  this.addDraggerNode = manipulateNode('add', 'dragger');
  this.removeContainerNode = manipulateNode('remove', 'container');

  this.logEnterContainer = (container: Container) => {
    console.log(`On enter: %c${container.id}`, 'color: #bada55');
  };

  this.logLeaveContainer = (container: Container) => {
    console.log(`On leave: %c${container.id}`, 'color: #bada55');
  };
}

// @ts-ignore
export default new reporter();
