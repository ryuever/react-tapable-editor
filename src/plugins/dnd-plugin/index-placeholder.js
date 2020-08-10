import DND from '../dnd';

const noop = () => {};

function DNDPlugin() {
  let indicator;

  const createIndicatorBar = () => {
    indicator = document.createElement('div');
    indicator.style.backgroundColor = '#69c0ff';
    document.body.appendChild(indicator);
  };
  this.apply = getEditor => {
    createIndicatorBar();
    const { hooks } = getEditor();
    hooks.afterMounted.tap('initDNDPlugin', () => {
      new DND({
        rootElement: '.DraftEditor-root',
        mode: 'nested',
        draggerHandlerSelector: '.sidebar-addon-visible',
        containerEffect: () => noop,
        draggerEffect: () => noop,
        configs: [
          {
            containerSelector: '[data-contents="true"]',
            draggerSelector: '.miuffy-paragraph',
            containerEffect: ({ el, draggerElement }) => {
              el.style.backgroundColor = 'red';
              return () => {
                el.style.backgroundColor = 'transparent';
              };
            },
            draggerEffect: options => {
              const { el, draggerElement } = options;
              el.style.backgroundColor = 'yellow';
              const draggerRect = draggerElement.getBoundingClientRect();
              const { height } = draggerRect;
              el.style.transform = `translateY(${height}px)`;
              el.style.transition = 'transform 0.25s ease-in';
              return () => {
                el.style.backgroundColor = 'transparent';
                el.style.transform = `translateY(0px)`;
              };
            },
          },
          {
            orientation: 'horizontal',
            containerSelector: '.miuffy-paragraph',
            draggerSelector: '.miuffy-paragraph >div:first-child',
            shouldAcceptDragger: el => {
              return (
                el.matches('.miuffy-paragraph') ||
                el.matches('.miuffy-paragraph >div:first-child')
              );
            },
            containerEffect: ({ el }) => {
              el.style.backgroundColor = 'green';
              return () => {
                el.style.backgroundColor = 'transparent';
              };
            },

            targetDraggerEffect: () => {},

            draggerEffect: options => {
              const { el, draggerElement } = options;
              const draggerRect = draggerElement.getBoundingClientRect();
              const targetRect = el.getBoundingClientRect();
              const { width } = draggerRect;
              el.style.transform = `translateX(${width / 2}px)`;
              el.style.height = `${targetRect.height * 2}px`;
              el.style.width = `${targetRect.width / 2}px`;
              el.style.transition = 'all 0.25s ease-in';

              return () => {
                el.style.transform = `translateX(0px)`;
                el.style.height = `${targetRect.height}px`;
                el.style.width = `${targetRect.width}px`;
              };
            },
          },
        ],
      });
    });
  };
}

export default DNDPlugin;
