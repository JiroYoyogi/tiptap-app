// editor本体
import { useEffect } from 'react';
import EditorToolbar from './MyEditorToolbar';

export default function MyEditor() {

  return (
    <div className="my-editor">
      <EditorToolbar />
      <p>Editor</p>
    </div>
  );
}
