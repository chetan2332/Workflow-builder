import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';

interface Props {
  value: string;
  language: 'json' | 'javascript';
  onChange: (v: string) => void;
  height?: string;
  placeholder?: string;
  readOnly?: boolean;
}

export function CodeMirrorEditor({ value, language, onChange, height = '200px', placeholder = '', readOnly = false }: Props) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      <CodeMirror
        value={value}
        height={height}
        theme={isDark ? 'dark' : 'light'}
        extensions={[language === 'json' ? json() : javascript(), EditorView.lineWrapping]}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLineGutter: false,
          drawSelection: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
        }}
      />
    </div>
  );
}
