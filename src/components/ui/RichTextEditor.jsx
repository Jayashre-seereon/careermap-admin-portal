import React, { useRef } from "react";
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
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return `<ul>${parsed.map((item) => `<li>${item}</li>`).join("")}</ul>`;
      }
      return parsed;
    } catch {
      return value;
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

  return (
    <div className="overflow-hidden rounded-md border border-[#d9d9d9] bg-white">
      <CKEditor
        editor={ClassicEditor}
        data={data}
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