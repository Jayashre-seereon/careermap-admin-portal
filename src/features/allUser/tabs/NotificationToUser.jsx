import { Button, Input } from "antd";
import { useState } from "react";
import RichTextEditor from "../../../components/editor/RichTextEditor";

export default function NotificationToUser({ user = null }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    console.log({
      userId: user?.id,
      userEmail: user?.email,
      subject,
      message,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
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

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 text-[#9a2119]">
          Message
        </label>
        <RichTextEditor value={message} onChange={setMessage} height={200} />
      </div>

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
