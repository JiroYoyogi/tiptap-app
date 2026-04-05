// editor本体
import { useEffect } from 'react';
import EditorToolbar from './MyEditorToolbar';

import {
  EditorContent,
  useEditor,
  type Editor,
  type JSONContent,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
// common ... よく使わレてる言語のセット
import { common, createLowlight } from 'lowlight';
import 'highlight.js/styles/github.css';

import { Color, TextStyle } from '@tiptap/extension-text-style';

import Placeholder from '@tiptap/extension-placeholder';

const lowlight = createLowlight(common);

lowlight.register({
  javascript,
  html,
});

interface Props {
  setEditor: React.Dispatch<React.SetStateAction<Editor | null>>;
  initialContent: JSONContent | string;
}

export default function MyEditor({ setEditor, initialContent }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: 'ここに本文を書いてください',
      }),
      CodeBlockLowlight.configure({
        lowlight,
        enableTabIndentation: true,
        tabSize: 2,
      }),
      TextStyle,
      Color,
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: () => {
      // 入力の度に何か処理をしたい場合
    },
    editorProps: {
      attributes: {
        class: 'my-editor__content',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    setEditor(editor);

    return () => {
      setEditor(null);
    };
  }, [editor, setEditor]);

  if (!editor) return null;

  return (
    <div className="my-editor">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
