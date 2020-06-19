import DND from "../dnd";
const noop = () => {};

function DNDPlugin() {
  this.apply = getEditor => {
    const { hooks } = getEditor();
    hooks.afterMounted.tap("initDNDPlugin", () => {
      const { editorRef } = getEditor();
      new DND({
        rootElement: ".DraftEditor-root",
        draggerHandlerSelector: ".sidebar-addon-visible",
        containerEffect: () => noop,
        draggerEffect: () => noop,
        configs: [
          {
            containerSelector: '[data-contents="true"]',
            draggerSelector: ".miuffy-paragraph",
            containerEffect: (el, draggerElement) => {
              const draggerRect = draggerElement.getBoundingClientRect();
              const { height } = draggerRect;
              el.style.transformY = height;
              // el.classList.add('')
              // el.style.backgroundColor = "red";
              return () => {
                el.style.transformY = 0;
                // el.style.backgroundColor = "transparent";
              };
            }
          },
          {
            orientation: "horizontal",
            containerSelector: ".miuffy-paragraph",
            draggerSelector: ".miuffy-paragraph >div:first-child",
            shouldAcceptDragger: el => {
              return (
                el.matches(".miuffy-paragraph") ||
                el.matches(".miuffy-paragraph >div:first-child")
              );
            },
            containerEffect: el => {
              el.style.backgroundColor = "green";
              return () => {
                el.style.backgroundColor = "transparent";
              };
            },
            draggerEffect: (el, draggerElement) => {
              const draggerRect = draggerElement.getBoundingClientRect();
              const targetRect = el.getBoundingClientRect();
              const { width } = draggerRect;
              el.style.transform = `translateX(${width / 2}px)`;
              el.style.height = `${targetRect.height * 2}px`;
              el.style.width = `${targetRect.width / 2}px`;
              el.style.transition = "all 0.5s ease-in";

              return () => {
                el.style.transform = `translateX(0px)`;
                el.style.height = `${targetRect.height}px`;
                el.style.width = `${targetRect.width}px`;
                el.style.transition = "all 0.5s ease-in";
              };
            }
          }
        ]
      });
    });
  };
}

export default DNDPlugin;
