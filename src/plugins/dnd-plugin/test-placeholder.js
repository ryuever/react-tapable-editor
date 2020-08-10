import DND from '../dnd';

const noop = () => {};

function DNDPlugin() {
  let verticalIndicator;
  let horizontalIndicator;

  const createIndicatorBar = () => {
    verticalIndicator = document.createElement('div');
    document.body.appendChild(verticalIndicator);
    horizontalIndicator = document.createElement('div');
    document.body.appendChild(horizontalIndicator);
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
            draggerEffect: options => {
              const { isHighlight, dimension, placedPosition } = options;
              const { top, right, left, height } = dimension;

              if (isHighlight) {
                if (placedPosition === 'top') {
                  horizontalIndicator.style.top = `${top}px`;
                } else {
                  horizontalIndicator.style.top = `${top + height}px`;
                }

                horizontalIndicator.style.position = 'absolute';
                horizontalIndicator.style.width = `${right - left}px`;
                horizontalIndicator.style.height = `3px`;
                horizontalIndicator.style.left = `${left - 10}px`;
                horizontalIndicator.style.backgroundColor = '#69c0ff';
                horizontalIndicator.style.transition =
                  'background-color 250ms ease-in';

                return () => {
                  horizontalIndicator.style.position = 'absolute';
                  horizontalIndicator.style.width = '0px';
                  horizontalIndicator.style.height = `0px`;
                  horizontalIndicator.style.top = `0px`;
                  horizontalIndicator.style.left = `0px`;
                  horizontalIndicator.style.backgroundColor = 'transparent';
                  horizontalIndicator.style.transition =
                    'background-color 250ms ease-out';
                };
              }
              return () => {};
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
            draggerEffect: options => {
              const { isHighlight, dimension } = options;
              const { top, bottom, left } = dimension;

              if (isHighlight) {
                verticalIndicator.style.position = 'absolute';
                verticalIndicator.style.width = '3px';
                verticalIndicator.style.height = `${bottom - top}px`;
                verticalIndicator.style.top = `${top}px`;
                verticalIndicator.style.left = `${left - 10}px`;
                verticalIndicator.style.backgroundColor = '#69c0ff';
                verticalIndicator.style.transition =
                  'background-color 250ms ease-in';

                return () => {
                  verticalIndicator.style.position = 'absolute';
                  verticalIndicator.style.width = '0px';
                  verticalIndicator.style.height = `0px`;
                  verticalIndicator.style.top = `0px`;
                  verticalIndicator.style.left = `0px`;
                  verticalIndicator.style.backgroundColor = 'transparent';
                  verticalIndicator.style.transition =
                    'background-color 250ms ease-out';
                };
              }
              return () => {};
            },
          },
        ],
      });
    });
  };
}

export default DNDPlugin;
