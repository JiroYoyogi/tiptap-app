import { type Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';

const CODE_LANGUAGES = [
  { label: 'Plain', value: '' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'HTML', value: 'html' },
] as const;

const COLOR = {
  red: '#ef4444',
  blue: '#3b82f6',
};

export default function MyEditorToolbar({ editor }: { editor: Editor }) {
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

  const setFontColor = (color: string) => {
    if (color === fontColor) {
      editor.chain().focus().unsetColor().run();
      return;
    }
    editor.chain().focus().setColor(color).run();
  };

  return (
    <div className="my-editor__toolbar">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={isBold ? 'is-active bold' : 'bold'}
      >
        太字
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={isItalic ? 'is-active italic' : 'italic'}
      >
        イタリック
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={isStrike ? 'is-active strike' : 'strike'}
      >
        打ち消し
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={isH2 ? 'is-active' : ''}
      >
        H2
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={isH3 ? 'is-active' : ''}
      >
        H3
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={isBulletList ? 'is-active' : ''}
      >
        ・リスト
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={isCodeBlock ? 'is-active code-block' : 'code-block'}
      >
        コード
      </button>

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
    </div>
  );
}
