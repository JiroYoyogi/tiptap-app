import './App.css';
import { useState } from 'react';
import MyEditor from './components/MyEditor';
import type { Editor, JSONContent } from '@tiptap/react';

const STORAGE_KEY = 'tiptap-app';

function App() {
  const [editor, setEditor] = useState<Editor | null>(null);

  const [initialContent] = useState<JSONContent | string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return '';
    }

    try {
      return JSON.parse(saved) as JSONContent;
    } catch {
      return '';
    }
  });

  const doSave = () => {
    if (!editor) return;

    const json = editor.getJSON();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(json));

    console.log('HTML:', editor.getHTML());
    console.log('JSON:', json);
  };

  return (
    <>
      <main>
        <h1>
          <img src="/tiptap-logo.png" alt="" />
        </h1>
        <MyEditor setEditor={setEditor} initialContent={initialContent} />
        <button type="button" onClick={doSave} className="btn-save">
          保存
        </button>
      </main>
    </>
  );
}

export default App;
