import { EditorState } from 'draft-js';
import { GetEditor } from '../types';

const readFile = (file: File) => {
  const { type: fileType, lastModified, name, size, type } = file;

  if (!fileType.startsWith('image/')) return Promise.resolve();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const src = reader.result;
      resolve({
        src,
        name,
        size,
        type,
        lastModified,
      });
    };

    reader.onerror = () => {
      reject();
    };

    reader.readAsDataURL(file);
  });
};

function HandleDroppedFilesPlugin() {
  this.apply = (getEditor: GetEditor) => {
    const { hooks } = getEditor();
    hooks.handleDroppedFiles.tap(
      'HandleDroppedFilesPlugin',
      (editorState: EditorState, _, files: FileList) => {
        const jobs = [] as Promise<any>[];
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
