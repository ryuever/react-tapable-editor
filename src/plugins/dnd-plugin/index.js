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
            containerEffect: el => {
              el.style.backgroundColor = "red";
              return () => {
                el.style.backgroundColor = "transparent";
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
            draggerEffect: el => {
              el.style.backgroundColor = "yellow";
              return () => {
                el.style.backgroundColor = "transparent";
              };
            }
          }
        ]
      });
    });
  };
}

export default DNDPlugin;
