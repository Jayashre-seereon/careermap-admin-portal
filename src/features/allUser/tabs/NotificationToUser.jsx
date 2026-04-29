import { Input, Button } from "antd";
import { useState } from "react";
import { useQuill } from "react-quilljs";
import Quill from "quill";

import "quill/dist/quill.snow.css";

/* 👉 ADD CUSTOM ICONS */
const icons = Quill.import("ui/icons");

icons["undo"] = `
  <svg viewBox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="6 10 2 6 6 2"></polygon>
    <path class="ql-stroke" d="M2,6h9a5,5 0 1,1 0,10h-1"></path>
  </svg>
`;

icons["redo"] = `
  <svg viewBox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="12 10 16 6 12 2"></polygon>
    <path class="ql-stroke" d="M16,6H7a5,5 0 1,0 0,10h1"></path>
  </svg>
`;

// ✅ Accepts user prop from index.jsx when coming from UserDetails
export default function NotificationToUser({ user = null }) {
  const [subject, setSubject] = useState("");

  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
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
    },
  });

  const handleSend = () => {
    const messageContent = quill?.root.innerHTML;
    console.log({
      userId: user?.id,
      userEmail: user?.email,
      subject,
      message: messageContent,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

      {/* ✅ Recipient badge — only shown when a specific user is targeted */}
      {user && (
        <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-9 h-9 rounded-full bg-[#9a2119] text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {user.user?.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm">{user.user}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <span className="ml-auto text-xs bg-[#9a2119] text-white px-2 py-0.5 rounded">
            {user.id}
          </span>
        </div>
      )}

      {/* SUBJECT */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-2 text-[#9a2119]">
          Subject <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="h-10 rounded-md"
        />
      </div>

      {/* MESSAGE */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 text-[#9a2119]">
          Message
        </label>
        <div className="border rounded-md overflow-hidden">
          <div ref={quillRef} style={{ height: "200px" }} />
        </div>
      </div>

      {/* SEND */}
      <div className="flex justify-end">
        <Button
          onClick={handleSend}
          className="px-6 h-10 rounded-md bg-[#9a2119] text-white hover:bg-[#c0392b] border-none"
        >
          {user ? `Send to ${user.user}` : "Send Notification"}
        </Button>
      </div>
    </div>
  );
}