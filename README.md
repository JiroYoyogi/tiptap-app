## 基本セットアップ（プレーンエディタ）

### ライブラリインストール

```
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
```

#### 公式ドキュメント

https://tiptap.dev/docs/editor/getting-started/install/react

#### StarterKit

太字や見出しなどよく使う機能のパック

https://tiptap.dev/docs/editor/extensions/functionality/starterkit

#### pm

tiptapはprosemirrorというエディターライブラリーのラッパー

### ファイル編集

- MyEditor.tsx

インポート

```
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
```

セットアップ

```tsx
const editor = useEditor({
  extensions: [StarterKit],
  content: 'Hello World !',
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

if (!editor) return null;
```

返り値を変更

```tsx
return (
  <div className="my-editor">
    <EditorToolbar />
    <EditorContent editor={editor} />
  </div>
);
```

- App.css

下記を追加

```css
.my-editor {
  width: 640px;
}

.my-editor__content {
  margin-top: 8px;
  width: 100%;
  min-height: 300px;
  padding: 1em;
  border: 1px solid #ccc;

  * {
    margin-top: 1em;
  }
  & > *:first-child {
    margin-top: 0;
  }
}
```

## テキスト装飾（太字 / イタリック / 打ち消し）

### 太字

- MyEditorToolbar.tsx

下記と置き換え

```tsx
import { type Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';

export default function MyEditorToolbar({ editor }: { editor: Editor }) {
  // カーソル位置や選択範囲の状態（太字かどうか等）を取得するためのフック
  const { isBold, isItalic, isStrike } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor?.isActive('bold') ?? false,
    }),
  });
  return (
    <div className="my-editor__toolbar">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={isBold ? 'is-active bold' : 'bold'}
      >
        太字
      </button>
    </div>
  );
}
```

↓ useEditorStateの公式解説

https://tiptap.dev/docs/guides/performance#use-useeditorstate-to-prevent-unnecessary-re-renders

- MyEditor.tsx

ツールバーに`editor`を渡す

```tsx
<EditorToolbar editor={editor} />
```

- App.css

下記を追加

```css
.my-editor__toolbar {
  display: flex;
  gap: 8px;
  padding: 8px;
  background-color: #e5f2fc;

  button {
    background-color: transparent;
    border: none;
    padding: 4px;
    line-height: 1;
    /* 太字 */
    &.bold {
      font-weight: bold;
    }
  }
  button.is-active {
    background-color: #a7d8ff;
    font-weight: bold;
  }
}
```

### イタリック / 打ち消し

- MyEditorToolbar.tsx

useEditorStateに下記を追加

```tsx
        isItalic: editor?.isActive("italic") ?? false,
        isStrike: editor?.isActive("strike") ?? false,
```

ボタンを追加

```tsx
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={isItalic ? "is-active italic" : "italic"}
      >
        イタリック
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={isStrike ? "is-active strike" : "strike"}
      >
        打ち消し
      </button>
```

- App.css

button {} に追加

```css
/* イタリック */
&.italic {
  font-style: italic;
}
/* 打ち消し */
&.strike {
  text-decoration: line-through;
}
```

## 見出し（Heading）

- MyEditorToolbar.tsx

```tsx
// カーソル位置や選択範囲の状態（太字かどうか等）を取得するためのフック
const { isBold, isItalic, isStrike, isH2, isH3 } = useEditorState({
  editor,
  selector: ({ editor }) => ({
    isBold: editor?.isActive('bold') ?? false,
    isItalic: editor?.isActive('italic') ?? false,
    isStrike: editor?.isActive('strike') ?? false,
    isH2: editor?.isActive('heading', { level: 2 }) ?? false,
    isH3: editor?.isActive('heading', { level: 3 }) ?? false,
  }),
});
```

ボタンを追加

```tsx
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={isH2 ? "is-active" : ""}
      >
        H2
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={isH3 ? "is-active" : ""}
      >
        H3
      </button>
```

## リスト（箇条書き）

- MyEditorToolbar.tsx

useEditorStateを置き換える

```tsx
// カーソル位置や選択範囲の状態（太字かどうか等）を取得するためのフック
const { isBold, isItalic, isStrike, isH2, isH3, isBulletList } = useEditorState(
  {
    editor,
    selector: ({ editor }) => ({
      isBold: editor?.isActive('bold') ?? false,
      isItalic: editor?.isActive('italic') ?? false,
      isStrike: editor?.isActive('strike') ?? false,
      isH2: editor?.isActive('heading', { level: 2 }) ?? false,
      isH3: editor?.isActive('heading', { level: 3 }) ?? false,
      isBulletList: editor?.isActive('bulletList') ?? false,
    }),
  },
);
```

ボタンを追加

```tsx
<button
  type="button"
  onClick={() => editor.chain().focus().toggleBulletList().run()}
  className={isBulletList ? 'is-active' : ''}
>
  ・リスト
</button>
```

- App.css

.my-editor\_\_content {} に追加

```css
ul {
  padding-left: 1.5rem;
  list-style-type: disc;
  * {
    margin-top: 0;
  }
}
```

## コードブロック（Code Block）

### 方針

- シンタックスハイライト付きのコードブロック
- StarterKitのCodeBlockの上位版を使用する

https://tiptap.dev/docs/examples/advanced/syntax-highlighting

### 用語

- CodeBlockLowlight
  - StarterKitのCodeBlockの上位版
  - シンタックスハイライト付きのコードブロックを提供する拡張
- lowlight
  - highlight.jsをベースにしたラッパー
  - Reactなどと相性が良い

### ライブラリのインストール

```
npm i @tiptap/extension-code-block-lowlight lowlight highlight.js
```

### コードブロックへ作成

- MyEditor.tsx

ライブラリのimportなど

```tsx
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
// common ... よく使わレてる言語のセット
import { common, createLowlight } from 'lowlight';
import 'highlight.js/styles/github.css';

const lowlight = createLowlight(common);

lowlight.register({
  javascript,
  html,
});
```

useEditorのextensionsを置き換える

```tsx
    extensions: [
      // StarterKitに入ってるコードブロックを無効にする
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        enableTabIndentation: true,
        tabSize: 2,
      }),
    ],
```

- MyEditorToolbar.tsx

useEditorStateを置き換える

```tsx
// カーソル位置や選択範囲の状態（太字かどうか等）を取得するためのフック
const { isBold, isItalic, isStrike, isH2, isH3, isBulletList, isCodeBlock } =
  useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor?.isActive('bold') ?? false,
      isItalic: editor?.isActive('italic') ?? false,
      isStrike: editor?.isActive('strike') ?? false,
      isH2: editor?.isActive('heading', { level: 2 }) ?? false,
      isH3: editor?.isActive('heading', { level: 3 }) ?? false,
      isBulletList: editor?.isActive('bulletList') ?? false,
      isCodeBlock: editor?.isActive('codeBlock') ?? false,
    }),
  });
```

ボタンを追加

```tsx
<button
  type="button"
  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
  className={isCodeBlock ? 'is-active code-block' : 'code-block'}
>
  コード
</button>
```

- App.css

.my-editor\_\_content {} に追加

```css
pre {
  background: #e9e9e980;
  padding: 12px;
  font-size: 12px;
  border-radius: 5px;

  code {
    overflow-x: auto;
  }
}
```

### シンタックスハイライトを追加

- MyEditorToolbar.tsx

選択出来る言語のリスト

```tsx
const CODE_LANGUAGES = [
  { label: 'Plain', value: '' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'HTML', value: 'html' },
] as const;
```

useEditorStateを置き換える

```tsx
// カーソル位置や選択範囲の状態（太字かどうか等）を取得するためのフック
const {
  isBold,
  isItalic,
  isStrike,
  isH2,
  isH3,
  isBulletList,
  isCodeBlock,
  codeLanguage,
} = useEditorState({
  editor,
  selector: ({ editor }) => ({
    isBold: editor?.isActive('bold') ?? false,
    isItalic: editor?.isActive('italic') ?? false,
    isStrike: editor?.isActive('strike') ?? false,
    isH2: editor?.isActive('heading', { level: 2 }) ?? false,
    isH3: editor?.isActive('heading', { level: 3 }) ?? false,
    isBulletList: editor?.isActive('bulletList') ?? false,
    isCodeBlock: editor?.isActive('codeBlock') ?? false,
    codeLanguage: editor?.getAttributes('codeBlock').language ?? '',
  }),
});
```

セレクトボックスを追加

```tsx
<select
  name="codeLanguage"
  value={isCodeBlock ? codeLanguage : ''}
  onChange={handleCodeLanguageChange}
  disabled={!isCodeBlock} // コードブロックを選択してる場合のみ有効
>
  {CODE_LANGUAGES.map((language) => (
    <option key={language.value} value={language.value}>
      {language.label}
    </option>
  ))}
</select>
```

言語切り替え関数を追加

```tsx
// 言語切り替え
const handleCodeLanguageChange = (
  event: React.ChangeEvent<HTMLSelectElement>,
) => {
  const language = event.target.value;

  if (!language) {
    editor.chain().focus().resetAttributes('codeBlock', 'language').run();
    return;
  }

  editor.chain().focus().updateAttributes('codeBlock', { language }).run();
};
```

## 文字色（Text Color）

https://tiptap.dev/docs/editor/extensions/functionality/color

### ライブラリのインストール

```
npm i @tiptap/extension-text-style
```

### コードの編集

- MyEditor.tsx

ライブラリの読み込み

```tsx
import { Color, TextStyle } from '@tiptap/extension-text-style';
```

useEditorのextensionsを置き換える

```tsx
    extensions: [
      // StarterKitに入ってるコードブロックを無効にする
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        enableTabIndentation: true,
        tabSize: 2,
      }),
      TextStyle,
      Color,
    ],
```

- MyEditorToolbar.tsx

色の定義

```tsx
const COLOR = {
  red: '#ef4444',
  blue: '#3b82f6',
};
```

useEditorStateを置き換える

```tsx
// カーソル位置や選択範囲の状態（太字かどうか等）を取得するためのフック
const {
  isBold,
  isItalic,
  isStrike,
  isH2,
  isH3,
  isBulletList,
  isCodeBlock,
  codeLanguage,
  fontColor,
} = useEditorState({
  editor,
  selector: ({ editor }) => ({
    isBold: editor?.isActive('bold') ?? false,
    isItalic: editor?.isActive('italic') ?? false,
    isStrike: editor?.isActive('strike') ?? false,
    isH2: editor?.isActive('heading', { level: 2 }) ?? false,
    isH3: editor?.isActive('heading', { level: 3 }) ?? false,
    isBulletList: editor?.isActive('bulletList') ?? false,
    isCodeBlock: editor?.isActive('codeBlock') ?? false,
    codeLanguage: editor?.getAttributes('codeBlock').language ?? '',
    fontColor: editor?.getAttributes('textStyle').color,
  }),
});
```

ボタンを追加

```tsx
      <button
        onClick={() => setFontColor(COLOR.red)}
        className={fontColor === COLOR.red ? 'is-active font-red' : 'font-red'}
      >
        赤
      </button>

      <button
        onClick={() => setFontColor(COLOR.blue)}
        className={
          fontColor === COLOR.blue ? 'is-active font-blue' : 'font-blue'
        }
      >
        青
      </button>
```

ボタンを押した際の色変更関数を追加

```tsx
const setFontColor = (color: string) => {
  if (color === fontColor) {
    editor.chain().focus().unsetColor().run();
    return;
  }
  editor.chain().focus().setColor(color).run();
};
```

- App.css

.my-editor__toolbar button {} に追加

```
  &.font-red {
    color: red;
  }
  &.font-blue {
    color: blue;
  }
```

## プレースフォルダー

### ライブラリをインストール

```
npm i @tiptap/extension-placeholder
```

### コードの編集

- MyEditor.tsx

ライブラリの読み込み

```tsx
import Placeholder from '@tiptap/extension-placeholder';
```

extensionsを置き換える

```tsx
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
```

- App.css

.my-editor\_\_content {} に追加

```css
/* プレースフォルダー */
p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
  height: 0;
  float: left;
}
```

## データを取得する

- App.tsx

保存ボタンを設置。クリックするとconsoleにエディターの内容を表示

```tsx
import './App.css';
import { useState } from 'react';
import MyEditor from './components/MyEditor';
import type { Editor, JSONContent } from '@tiptap/react';

function App() {
  const [editor, setEditor] = useState<Editor | null>(null);

  const doSave = () => {
    if (!editor) return;

    console.log('HTML:', editor.getHTML());
    console.log('JSON:', editor.getJSON());
  };

  return (
    <>
      <main>
        <h1>
          <img src="/tiptap-logo.png" alt="" />
        </h1>
        <MyEditor setEditor={setEditor} />
        <button type="button" onClick={doSave} className="btn-save">
          保存
        </button>
      </main>
    </>
  );
}

export default App;
```

- MyEditor.tsx

引数のinterface作成

```tsx
interface Props {
  setEditor: React.Dispatch<React.SetStateAction<Editor | null>>;
}
```

引数の設定

```
function MyEditor({ setEditor }: Props)
```

親コンポーネントにeditorを渡す

```tsx
useEffect(() => {
  if (!editor) return;

  setEditor(editor);

  return () => {
    setEditor(null);
  };
}, [editor, setEditor]);

if (!editor) return null;
```

引数の型

```tsx
import { EditorContent, useEditor, type Editor, type JSONContent } from '@tiptap/react';
```

- App.css

ボタンのCSS

```css
.btn-save {
  background: #333;
  border: none;
  color: #fff;
  padding: 0.5em 2em;
  cursor: pointer;
}
```

## データを保存する

- App.tsx

ローカルストレージのキー名設定

```tsx
const STORAGE_KEY = 'tiptap-app';
```

ローカルストレージからデータ読み込み

```tsx
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
```

doSaveを改造

```tsx
const doSave = () => {
  if (!editor) return;

  const json = editor.getJSON();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(json));

  console.log('HTML:', editor.getHTML());
  console.log('JSON:', json);
};
```

initialContentをEditorに渡す

```tsx
<MyEditor setEditor={setEditor} initialContent={initialContent} />
```

- MyEditor.tsx

initialContentを受け取るように変更

```tsx
interface Props {
  setEditor: React.Dispatch<React.SetStateAction<Editor | null>>
  initialContent: JSONContent | string
}

export default function TiptapEditor({ setEditor, initialContent }: Props) {
```

editorにinitialContentをセット

```tsx
content: initialContent,
```
