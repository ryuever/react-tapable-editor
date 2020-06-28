import DND from "../dnd";
const noop = () => {};

function DNDPlugin() {
  let verticalIndicator;
  let horizontalIndicator;

  const createIndicatorBar = () => {
    verticalIndicator = document.createElement("div");
    document.body.appendChild(verticalIndicator);
    horizontalIndicator = document.createElement("div");
    document.body.appendChild(horizontalIndicator);
  };
  this.apply = getEditor => {
    createIndicatorBar();
    const { hooks } = getEditor();
    hooks.afterMounted.tap("initDNDPlugin", () => {
      const { editorRef } = getEditor();
      new DND({
        rootElement: ".DraftEditor-root",
        mode: "nested",
        draggerHandlerSelector: ".sidebar-addon-visible",
        withPlaceholder: false,
        configs: [
          {
            containerSelector:
              '[data-contents="true"] >div:first-child >div:first-child',
            draggerSelector:
              '[data-contents="true"] >div:first-child >div:first-child .miuffy-paragraph',
            impactDraggerEffect: options => {
              const { dimension, placedPosition } = options;
              const { top, right, left, bottom, height } = dimension;
              requestAnimationFrame(() => {
                if (placedPosition === "top") {
                  horizontalIndicator.style.top = `${top}px`;
                } else {
                  horizontalIndicator.style.top = `${top + height}px`;
                }

                horizontalIndicator.style.position = "absolute";
                horizontalIndicator.style.width = `${right - left}px`;
                horizontalIndicator.style.height = `3px`;
                horizontalIndicator.style.left = `${left - 10}px`;
                horizontalIndicator.style.backgroundColor = "#69c0ff";
                horizontalIndicator.style.opacity = 1;
                horizontalIndicator.style.transition = "opacity 1000ms ease-in";
              });

              return () => {
                verticalIndicator.style.removeProperty("transition");
                horizontalIndicator.style.position = "absolute";
                horizontalIndicator.style.width = "0px";
                horizontalIndicator.style.height = `0px`;
                horizontalIndicator.style.top = `0px`;
                horizontalIndicator.style.left = `0px`;
                horizontalIndicator.style.opacity = 0;
                horizontalIndicator.style.backgroundColor = "transparent";
              };
            }
          },
          {
            orientation: "horizontal",
            containerSelector:
              '[data-contents="true"] >div:first-child >div:first-child >div.miuffy-paragraph',
            draggerSelector: ".miuffy-paragraph >div:first-child",
            shouldAcceptDragger: el => {
              return (
                el.matches(".miuffy-paragraph") ||
                el.matches(".miuffy-paragraph >div:first-child")
              );
            },
            impactDraggerEffect: options => {
              const { dimension, placedPosition } = options;
              const { top, bottom, left, right } = dimension;

              if (placedPosition === "left") {
                verticalIndicator.style.left = `${left - 5}px`;
              } else {
                verticalIndicator.style.left = `${right + 5}px`;
              }
              requestAnimationFrame(() => {
                verticalIndicator.style.position = "absolute";
                verticalIndicator.style.width = "3px";
                verticalIndicator.style.height = `${bottom - top}px`;
                verticalIndicator.style.top = `${top}px`;
                verticalIndicator.style.backgroundColor = "#69c0ff";
                verticalIndicator.style.opacity = 1;
                verticalIndicator.style.transition = "opacity 250ms ease-in";
              });

              return () => {
                verticalIndicator.style.removeProperty("transition");
                verticalIndicator.style.position = "absolute";
                verticalIndicator.style.width = "0px";
                verticalIndicator.style.height = `0px`;
                verticalIndicator.style.top = `0px`;
                verticalIndicator.style.left = `0px`;
                verticalIndicator.style.opacity = 0;
                verticalIndicator.style.backgroundColor = "transparent";
              };
            }
          },
          // {
          //   orientation: "horizontal",
          //   containerSelector:
          //     ".display-flex.miuffy-paragraph >div:first-child",
          //   draggerSelector: ".miuffy-paragraph >div:first-child",
          //   shouldAcceptDragger: el => {
          //     return (
          //       el.matches(".miuffy-paragraph") ||
          //       el.matches(".miuffy-paragraph >div:first-child")
          //     );
          //   },
          //   impactDraggerEffect: options => {
          //     const { dimension, placedPosition } = options;
          //     const { top, bottom, left, right } = dimension;

          //     if (placedPosition === "left") {
          //       verticalIndicator.style.left = `${left - 10}px`;
          //     } else {
          //       verticalIndicator.style.left = `${right + 10}px`;
          //     }
          //     requestAnimationFrame(() => {
          //       verticalIndicator.style.position = "absolute";
          //       verticalIndicator.style.width = "3px";
          //       verticalIndicator.style.height = `${bottom - top}px`;
          //       verticalIndicator.style.top = `${top}px`;
          //       verticalIndicator.style.backgroundColor = "#69c0ff";
          //       verticalIndicator.style.opacity = 1;
          //       verticalIndicator.style.transition = "opacity 250ms ease-in";
          //     });

          //     return () => {
          //       verticalIndicator.style.removeProperty("transition");
          //       verticalIndicator.style.position = "absolute";
          //       verticalIndicator.style.width = "0px";
          //       verticalIndicator.style.height = `0px`;
          //       verticalIndicator.style.top = `0px`;
          //       verticalIndicator.style.left = `0px`;
          //       verticalIndicator.style.opacity = 0;
          //       verticalIndicator.style.backgroundColor = "transparent";
          //     };
          //   }
          // },
          {
            orientation: "vertical",
            containerSelector:
              ".display-flex.miuffy-paragraph >div:first-child >div",
            draggerSelector: ".miuffy-paragraph",
            shouldAcceptDragger: el => {
              return (
                el.matches(".miuffy-paragraph") ||
                el.matches(".miuffy-paragraph >div:first-child")
              );
            },
            impactDraggerEffect: options => {
              const { dimension, placedPosition } = options;
              const { top, bottom, left, right } = dimension;

              if (placedPosition === "top") {
                verticalIndicator.style.top = `${top - 5}px`;
              } else {
                verticalIndicator.style.top = `${bottom + 5}px`;
              }
              requestAnimationFrame(() => {
                verticalIndicator.style.position = "absolute";
                verticalIndicator.style.width = `${right - left}px`;
                verticalIndicator.style.height = "3px";
                verticalIndicator.style.left = `${left}px`;
                verticalIndicator.style.backgroundColor = "#69c0ff";
                verticalIndicator.style.opacity = 1;
                verticalIndicator.style.transition = "opacity 250ms ease-in";
              });

              return () => {
                verticalIndicator.style.removeProperty("transition");
                verticalIndicator.style.position = "absolute";
                verticalIndicator.style.width = "0px";
                verticalIndicator.style.height = `0px`;
                verticalIndicator.style.top = `0px`;
                verticalIndicator.style.left = `0px`;
                verticalIndicator.style.opacity = 0;
                verticalIndicator.style.backgroundColor = "transparent";
              };
            }
          }
        ]
      });
    });
  };
}

export default DNDPlugin;
