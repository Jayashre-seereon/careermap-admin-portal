import React, { useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  List,
  Indent,
  IndentBlock,
  Alignment,
  Link,
  Table,
  TableToolbar,
  RemoveFormat,
  BlockQuote,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import "./RichTextEditor.css";

const normalizeEditorValue = (value) => {
  if (Array.isArray(value)) {
    return `<ul>${value.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  }

  if (typeof value === "string") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    const decodedValue = textarea.value;
    try {
      const parsed = JSON.parse(decodedValue);
      if (Array.isArray(parsed)) {
        return `<ul>${parsed.map((item) => `<li>${item}</li>`).join("")}</ul>`;
      }
      return parsed;
    } catch {
      return decodedValue;
    }
  }

  return value || "";
};

export default function RichTextEditor({
  value = "",
  onChange,
  disabled = false,
  placeholder = "Write here...",
  height = 180,
}) {
  const editorRef = useRef(null);
  const lastValue = useRef("");

  const data = normalizeEditorValue(value);
  const initialData = useRef(data);
  const latestData = useRef(data);
  latestData.current = data;

  // CKEditor owns its editing state. Updating its `data` prop on each React
  // render can reset the selection to the beginning (for example, when a
  // parent updates a word count). Sync only when the form supplies genuinely
  // different content, such as when another record is loaded.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || editor.state === "destroyed") return;

    // Form.Item feeds every keystroke back as `value`. If CKEditor has focus,
    // preserve its live model and selection; replacing its data here sends
    // the caret to the start of the document.
    if (editor.editing.view.document.isFocused) return;

    const currentData = editor.getData();
    if (data !== currentData && data !== lastValue.current) {
      editor.setData(data);
      lastValue.current = data;
    }
  }, [data]);

  return (
    <div className="overflow-hidden rounded-md border border-[#d9d9d9] bg-white">
      <CKEditor
        editor={ClassicEditor}
        // CKEditorReact treats a changed `data` prop as a request to replace
        // editor content. Keep this initialization value stable and use the
        // effect above only for genuine external form updates.
        data={initialData.current}
        disabled={disabled}
        config={{
          licenseKey: "GPL",
          placeholder,
          plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Underline,
            List,
            Indent,
            IndentBlock,
            Alignment,
            Link,
            Table,
            TableToolbar,
            RemoveFormat,
            BlockQuote,
          ],
          toolbar: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "|",
            "numberedList",
            "bulletedList",
            "|",
            "outdent",
            "indent",
            "|",
            "alignment",
            "|",
            "link",
            "insertTable",
            "|",
            "removeFormat",
          ],
          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
            ],
          },
        }}
        onReady={(editor) => {
          editorRef.current = editor;
          if (editor.getData() !== latestData.current) {
            editor.setData(latestData.current);
          }
          lastValue.current = editor.getData();

          // Set height
          editor.editing.view.change((writer) => {
            writer.setStyle(
              "min-height",
              `${height}px`,
              editor.editing.view.document.getRoot()
            );
          });
        }}
        onChange={(event, editor) => {
          const html = editor.getData();

          if (html !== lastValue.current) {
            lastValue.current = html;
            onChange && onChange(html);
          }
        }}
      />
    </div>
  );
}
