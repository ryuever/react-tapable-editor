import DND from "../dnd";

function DNDPlugin() {
  this.apply = getEditor => {
    const { hooks } = getEditor();
    hooks.afterMounted.tap("initDNDPlugin", () => {
      const { editorRef } = getEditor();
      new DND({
        rootElement: '[data-contents="true"]',
        dndConfigs: [
          {
            containerSelector: '[data-contents="true"]',
            draggerSelector: ".miuffy-paragraph"
            // draggerClass: ''
          }
        ]
      });
    });
  };
}

export default DNDPlugin;
