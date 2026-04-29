import { useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import Quill from "quill";

import "quill/dist/quill.snow.css";

const icons = Quill.import("ui/icons");

icons.undo = `
  <svg viewBox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="6 10 2 6 6 2"></polygon>
    <path class="ql-stroke" d="M2,6h9a5,5 0 1,1 0,10h-1"></path>
  </svg>
`;

icons.redo = `
  <svg viewBox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="12 10 16 6 12 2"></polygon>
    <path class="ql-stroke" d="M16,6H7a5,5 0 1,0 0,10h1"></path>
  </svg>
`;

const modules = {
  toolbar: {
    container: [
      ["undo", "redo"],
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
    handlers: {
      undo() {
        this.quill.history.undo();
      },
      redo() {
        this.quill.history.redo();
      },
    },
  },
  history: {
    delay: 1000,
    maxStack: 50,
    userOnly: true,
  },
};

export default function RichTextEditor({
  value = "",
  onChange,
  height = 220,
  readOnly = false,
}) {
  const isPatchingValue = useRef(false);
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules,
  });

  useEffect(() => {
    if (!quill) {
      return;
    }

    quill.enable(!readOnly);
  }, [quill, readOnly]);

  useEffect(() => {
    if (!quill) {
      return;
    }

    const handleTextChange = () => {
      if (!isPatchingValue.current) {
        onChange?.(quill.root.innerHTML);
      }
    };

    quill.on("text-change", handleTextChange);

    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [onChange, quill]);

  useEffect(() => {
    if (!quill) {
      return;
    }

    const nextValue = value || "";

    if (quill.root.innerHTML !== nextValue) {
      isPatchingValue.current = true;
      quill.clipboard.dangerouslyPasteHTML(nextValue, "silent");
      isPatchingValue.current = false;
    }
  }, [quill, value]);

  return (
    <div className="overflow-hidden rounded-md border border-gray-300">
      <div ref={quillRef} style={{ height }} />
    </div>
  );
}
