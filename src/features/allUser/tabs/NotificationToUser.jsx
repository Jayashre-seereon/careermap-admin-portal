import { Button, Input } from "antd";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import RichTextEditor from "../../../components/ui/RichTextEditor";

export default function NotificationToUser({ user = null }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const outletContext = useOutletContext();
  const targetUser = user || outletContext?.notificationUser || null;

  const handleSend = () => {
    console.log({
      userId: targetUser?.id,
      userEmail: targetUser?.email,
      subject,
      message,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {targetUser && (
        <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-9 h-9 rounded-full bg-[#9a2119] text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {targetUser.user?.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm">{targetUser.user}</p>
            <p className="text-xs text-gray-400">{targetUser.email}</p>
          </div>
          <span className="ml-auto text-xs bg-[#9a2119] text-white px-2 py-0.5 rounded">
            {targetUser.id}
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
        <RichTextEditor
          value={message}
          onChange={setMessage}
          height={200}
          placeholder="Write your message"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSend}
          className="px-6 h-10 rounded-md bg-[#9a2119] text-white hover:bg-[#c0392b] border-none"
        >
          {targetUser ? `Send to ${targetUser.user}` : "Send Notification"}
        </Button>
      </div>
    </div>
  );
}
