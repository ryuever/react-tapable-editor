const readFile = file => {
  const {
    type: fileType,
    lastModified,
    lastModifiedDate,
    name,
    size,
    type,
  } = file;

  if (!fileType.startsWith('image/')) return Promise.resolve();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = e => {
      const {
        target: { result: src },
      } = e;
      resolve({
        src,
        name,
        size,
        type,
        lastModifiedDate,
        lastModified,
      });
    };

    reader.onError = e => {
      reject();
    };

    reader.readAsDataURL(file);
  });
};

function HandleDroppedFilesPlugin() {
  this.apply = getEditor => {
    const { hooks } = getEditor();
    hooks.handleDroppedFiles.tap(
      'HandleDroppedFilesPlugin',
      (editorState, dropSelection, files) => {
        const jobs = [];
        files.forEach(file => {
          jobs.push(readFile(file));
        });
        Promise.all(jobs).then(result => {
          result.forEach(file => {
            hooks.addImage.call(editorState, file);
          });
        });
      }
    );
  };
}

export default HandleDroppedFilesPlugin;
