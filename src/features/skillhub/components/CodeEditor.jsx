import Editor from "@monaco-editor/react";

export default function CodeEditor({ language, value, onChange, height = "100%" }) {
  const monacoLang = language === "javascript" ? "javascript" : language === "java" ? "java" : "python";
  return (
    <Editor
      height={height}
      language={monacoLang}
      theme="vs-dark"
      value={value}
      onChange={(v) => onChange(v ?? "")}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 14 },
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        lineNumbersMinChars: 3,
        automaticLayout: true,
        tabSize: 4,
        renderLineHighlight: "line",
        smoothScrolling: true,
      }}
    />
  );
}
