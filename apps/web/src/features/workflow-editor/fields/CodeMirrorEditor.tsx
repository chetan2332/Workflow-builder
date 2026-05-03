import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';

interface CodeMirrorEditorProps {
  value: string;
  language: 'json' | 'javascript';
  onChange: (value: string) => void;
  height?: string;
  placeholder?: string;
  readOnly?: boolean;
}

export function CodeMirrorEditor({
  value,
  language,
  onChange,
  height = '200px',
  placeholder = '',
  readOnly = false,
}: CodeMirrorEditorProps) {
  // Get the appropriate language extension
  const extensions = [
    language === 'json' ? json() : javascript(),
    EditorView.lineWrapping, // Enable line wrapping
  ];

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <CodeMirror
        value={value}
        height={height}
        theme="dark"
        extensions={extensions}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: false,
          highlightActiveLineGutter: false,
          highlightSpecialChars: true,
          foldGutter: false,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );
}
