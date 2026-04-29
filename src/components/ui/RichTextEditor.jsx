import { useEffect } from "react";
import { useQuill } from "react-quilljs";
import Quill from "quill";

import "quill/dist/quill.snow.css";

let iconsConfigured = false;

if (!iconsConfigured) {
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

  iconsConfigured = true;
}

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
      undo: function () {
        this.quill.history.undo();
      },
      redo: function () {
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
  disabled = false,
  placeholder = "Write here...",
  height = 180,
}) {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    placeholder,
    modules,
  });

  useEffect(() => {
    if (!quill) {
      return;
    }

    const nextValue = value || "";
    const currentValue = quill.root.innerHTML === "<p><br></p>" ? "" : quill.root.innerHTML;

    if (currentValue !== nextValue) {
      quill.clipboard.dangerouslyPasteHTML(nextValue || "<p><br></p>");
    }

    quill.enable(!disabled);

    const toolbar = quill.getModule("toolbar")?.container;
    if (toolbar) {
      toolbar.style.display = disabled ? "none" : "";
    }
  }, [quill, value, disabled]);

  useEffect(() => {
    if (!quill || !onChange) {
      return;
    }

    const handleTextChange = () => {
      const html = quill.root.innerHTML === "<p><br></p>" ? "" : quill.root.innerHTML;
      onChange(html);
    };

    quill.on("text-change", handleTextChange);
    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [quill, onChange]);

  return (
    <div className="overflow-hidden rounded-md border border-[#d9d9d9] bg-white">
      <div ref={quillRef} style={{ height }} />
    </div>
  );
}
