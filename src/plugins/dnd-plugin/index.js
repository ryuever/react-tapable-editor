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
            draggerSelector: ".miuffy-paragraph"
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
            }
          }
        ]
      });
    });
  };
}

export default DNDPlugin;
