import { useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import Quill from "quill";
import QuillTableBetter from "quill-table-better";

import "quill/dist/quill.snow.css";
import "quill-table-better/dist/quill-table-better.css";

let iconsConfigured = false;
let tableModuleRegistered = false;

if (!tableModuleRegistered) {
  Quill.register({ "modules/table-better": QuillTableBetter }, true);
  tableModuleRegistered = true;
}

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
  table: false, // disable Quill's default table module in favor of table-better
  "table-better": {
    language: "en_US",
    menus: ["column", "row", "merge", "table", "cell", "wrap", "copy", "delete"],
    toolbarTable: true,
  },
  toolbar: {
    container: [
      ["undo", "redo"],
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["table-better"],
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
  keyboard: {
    bindings: QuillTableBetter.keyboardBindings,
  },
  history: {
    delay: 1000,
    maxStack: 50,
    userOnly: true,
  },
};

const htmlListFromArray = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  return `<ul>${items.map((item) => `<li>${String(item ?? "")}</li>`).join("")}</ul>`;
};

const normalizeEditorValue = (value) => {
  if (Array.isArray(value)) {
    if (value.length === 1 && typeof value[0] === "string") {
      return value[0];
    }

    return htmlListFromArray(value);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return htmlListFromArray(parsed);
      }

      return typeof parsed === "string" ? parsed : value;
    } catch {
      return value;
    }
  }

  if (value == null) {
    return "";
  }

  return String(value);
};

export default function RichTextEditor({
  value = "",
  onChange,
  disabled = false,
  placeholder = "Write here...",
  height = 180,
}) {
  const isPatchingValue = useRef(false);
  // Tracks the last HTML this editor itself emitted via onChange.
  // Used to avoid re-parsing our own output back through dangerouslyPasteHTML,
  // which can destroy custom blots like tables.
  const lastEmittedValue = useRef(null);

  const { quill, quillRef } = useQuill({
    theme: "snow",
    placeholder,
    modules,
  });

  useEffect(() => {
    if (!quill) {
      return;
    }

    const nextValue = normalizeEditorValue(value);

    // If this value is exactly what we just emitted ourselves (e.g. after
    // inserting a table), skip re-patching entirely — dangerouslyPasteHTML
    // re-parses HTML through clipboard matchers and can flatten/break
    // custom blots (like tables) that were just inserted.
    const isOwnEmission = lastEmittedValue.current !== null && nextValue === lastEmittedValue.current;

    if (!isOwnEmission) {
      const currentValue = quill.root.innerHTML === "<p><br></p>" ? "" : quill.root.innerHTML;

      if (currentValue !== nextValue) {
        isPatchingValue.current = true;
        quill.clipboard.dangerouslyPasteHTML(nextValue || "<p><br></p>", "silent");
        isPatchingValue.current = false;
      }
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
      if (isPatchingValue.current) {
        return;
      }

      const html = quill.root.innerHTML === "<p><br></p>" ? "" : quill.root.innerHTML;
      lastEmittedValue.current = html;
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