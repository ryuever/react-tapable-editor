import { EditorState } from 'draft-js';
import DND from '../dnd';
import transfer from '../../utils/block/transfer';
import { extractBlockKeyFromOffsetKey } from '../../utils/keyHelper';
import { Orientation, GetEditor, Position, Mode } from '../../types';

const DEBUG = false;

function DNDPlugin() {
  let verticalIndicator: HTMLElement;
  let horizontalIndicator: HTMLElement;

  const createIndicatorBar = () => {
    verticalIndicator = document.createElement('div');
    document.body.appendChild(verticalIndicator);
    horizontalIndicator = document.createElement('div');
    document.body.appendChild(horizontalIndicator);
  };

  const logger = ({
    dragger,
    candidateDragger,
    container,
    placedPosition,
  }: {
    dragger: HTMLElement;
    candidateDragger: HTMLElement;
    container: HTMLElement;
    placedPosition: Position;
  }) => {
    const draggerOffsetKey = dragger.getAttribute('data-offset-key');
    const candidateDraggerOffsetKey = candidateDragger.getAttribute(
      'data-offset-key'
    );
    const containerOffsetKey = container.getAttribute('data-offset-key');

    DEBUG &&
      console.log(
        `placed ${draggerOffsetKey} to the ${placedPosition} of ${candidateDraggerOffsetKey}, which is included in ${containerOffsetKey}`
      );
  };

  this.apply = (getEditor: GetEditor) => {
    createIndicatorBar();
    const { hooks } = getEditor();

    hooks.afterMounted.tap('initDNDPlugin', () => {
      new DND({
        onDrop: ({
          dragger,
          candidateDragger,
          placedPosition,
        }: {
          dragger: HTMLElement;
          candidateDragger: HTMLElement;
          placedPosition: Position;
        }) => {
          try {
            const draggerOffsetKey =
              dragger.getAttribute('data-offset-key') || '';
            const candidateDraggerOffsetKey =
              candidateDragger.getAttribute('data-offset-key') || '';
            const sourceBlockKey = extractBlockKeyFromOffsetKey(
              draggerOffsetKey
            );
            const targetBlockKey = extractBlockKeyFromOffsetKey(
              candidateDraggerOffsetKey
            );
            const { editorState, hooks } = getEditor();

            const newContent = transfer(
              editorState,
              sourceBlockKey,
              targetBlockKey,
              placedPosition
            );

            if (!newContent) return;

            const dismissSelection = EditorState.push(
              editorState,
              newContent,
              'insert-characters'
            );

            hooks.setState.call(dismissSelection);
          } catch (err) {
            console.log('handle error ', err);
          }
        },
        rootElement: '.DraftEditor-root',
        mode: Mode.Nested,
        draggerHandlerSelector: '.sidebar-addon-visible',
        withPlaceholder: false,
        configs: [
          {
            containerSelector: '[data-contents="true"]',
            draggerSelector: '[data-contents="true"] >.miuffy-paragraph',
            impactDraggerEffect: options => {
              const { dimension, placedPosition } = options;
              const { top, right, left, height = 0 } = dimension;
              logger(options);
              requestAnimationFrame(() => {
                if (placedPosition === 'top') {
                  horizontalIndicator.style.top = `${top}px`;
                } else {
                  horizontalIndicator.style.top = `${top + height}px`;
                }

                horizontalIndicator.style.position = 'absolute';
                horizontalIndicator.style.width = `${right - left}px`;
                horizontalIndicator.style.height = `3px`;
                horizontalIndicator.style.left = `${left - 10}px`;
                horizontalIndicator.style.backgroundColor = '#722ed1';
                horizontalIndicator.style.opacity = '1';
                horizontalIndicator.style.transition = 'opacity 1000ms ease-in';
              });

              return () => {
                verticalIndicator.style.removeProperty('transition');
                horizontalIndicator.style.position = 'absolute';
                horizontalIndicator.style.width = '0px';
                horizontalIndicator.style.height = `0px`;
                horizontalIndicator.style.top = `0px`;
                horizontalIndicator.style.left = `0px`;
                horizontalIndicator.style.opacity = '0';
                horizontalIndicator.style.backgroundColor = 'transparent';
              };
            },
          },
          {
            orientation: Orientation.Horizontal,
            containerSelector: '[data-contents="true"] >div.miuffy-paragraph',
            draggerSelector: '.miuffy-paragraph >div:first-child',
            shouldAcceptDragger: el => {
              return (
                el.matches('.miuffy-paragraph') ||
                el.matches('.miuffy-paragraph >div:first-child')
              );
            },
            impactDraggerEffect: options => {
              const { dimension, placedPosition } = options;
              const { top, bottom, left, right } = dimension;
              logger(options);

              if (placedPosition === 'left') {
                verticalIndicator.style.left = `${left - 5}px`;
              } else {
                verticalIndicator.style.left = `${right + 5}px`;
              }
              requestAnimationFrame(() => {
                verticalIndicator.style.position = 'absolute';
                verticalIndicator.style.width = '3px';
                verticalIndicator.style.height = `${bottom - top}px`;
                verticalIndicator.style.top = `${top}px`;
                verticalIndicator.style.backgroundColor = '#69c0ff';
                verticalIndicator.style.opacity = '1';
                verticalIndicator.style.transition = 'opacity 250ms ease-in';
                verticalIndicator.style.zIndex = '1';
              });

              return () => {
                verticalIndicator.style.removeProperty('transition');
                verticalIndicator.style.position = 'absolute';
                verticalIndicator.style.width = '0px';
                verticalIndicator.style.height = `0px`;
                verticalIndicator.style.top = `0px`;
                verticalIndicator.style.left = `0px`;
                verticalIndicator.style.opacity = '0';
                verticalIndicator.style.backgroundColor = 'transparent';
              };
            },
            impactContainerEffect: options => {
              const { container } = options;
              container.style.backgroundColor = '#fa8c16';

              return () => {
                container.style.backgroundColor = 'transparent';
              };
            },
          },
          {
            orientation: Orientation.Vertical,
            containerSelector: '.data-wrapper-column >div',
            draggerSelector: '.miuffy-paragraph',
            shouldAcceptDragger: () => {
              return true;
              // return (
              //   el.matches('.miuffy-paragraph') ||
              //   el.matches('.miuffy-paragraph >div:first-child')
              // );
            },
            impactDraggerEffect: options => {
              const { dimension, placedPosition } = options;
              const { top, bottom, left, right } = dimension;
              logger(options);

              if (placedPosition === 'top') {
                verticalIndicator.style.top = `${top - 5}px`;
              } else {
                verticalIndicator.style.top = `${bottom + 5}px`;
              }
              requestAnimationFrame(() => {
                verticalIndicator.style.position = 'absolute';
                verticalIndicator.style.width = `${right - left}px`;
                verticalIndicator.style.height = '3px';
                verticalIndicator.style.left = `${left}px`;
                verticalIndicator.style.backgroundColor = '#69c0ff';
                verticalIndicator.style.opacity = '1';
                verticalIndicator.style.transition = 'opacity 250ms ease-in';
              });

              return () => {
                verticalIndicator.style.removeProperty('transition');
                verticalIndicator.style.position = 'absolute';
                verticalIndicator.style.width = '0px';
                verticalIndicator.style.height = `0px`;
                verticalIndicator.style.top = `0px`;
                verticalIndicator.style.left = `0px`;
                verticalIndicator.style.opacity = '0';
                verticalIndicator.style.backgroundColor = 'transparent';
              };
            },
            impactContainerEffect: options => {
              const { container } = options;
              container.style.background = '#ff4d4f';

              return () => {
                container.style.background = '#fff';
              };
            },
          },
        ],
      });
    });
  };
}

export default DNDPlugin;
