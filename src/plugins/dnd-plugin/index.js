import DND from "../dnd";

function DNDPlugin() {
  this.apply = getEditor => {
    const { hooks } = getEditor();
    hooks.afterMounted.tap("initDNDPlugin", () => {
      const { editorRef } = getEditor();
      new DND({
        rootElement: ".DraftEditor-root",
        configs: [
          {
            containerSelector: '[data-contents="true"]',
            draggerSelector: ".miuffy-paragraph"
          }
        ]
      });
    });
  };
}

export default DNDPlugin;
