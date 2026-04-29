import {
  ArrowLeftOutlined,
  DeleteOutlined,
  InboxOutlined,
  MessageOutlined,
  PaperClipOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Input, Popconfirm, Upload, message } from "antd";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ticketsData } from "./ticketsData";

const { TextArea } = Input;

const initialRepliesByTicket = {
  TKT001: [
    {
      id: "R001",
      author: "Support Admin",
      date: "2026-04-24 18:30",
      message:
        "We have verified your payment and escalated the premium plan activation to the billing team.",
      attachments: ["payment-proof.pdf"],
    },
  ],
  TKT002: [
    {
      id: "R002",
      author: "Support Admin",
      date: "2026-04-25 11:15",
      message:
        "Please re-login once and update your profile again. If the issue remains, share a screenshot.",
      attachments: [],
    },
  ],
};

function formatStatusTone(status) {
  if (status === "Pending") {
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }

  if (status === "Answered") {
    return "bg-[#fdf2f1] text-[#9a2119] border-[#f3c7c3]";
  }

  return "bg-green-100 text-green-800 border-green-200";
}

function ActionButton({ children, icon, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}

export default function TicketDetails() {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  const ticket = useMemo(
    () => ticketsData.find((item) => item.id === ticketId),
    [ticketId]
  );

  const [status, setStatus] = useState(ticket?.status || "Pending");
  const [replyText, setReplyText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [replies, setReplies] = useState(initialRepliesByTicket[ticketId] || []);

  if (!ticket) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h1 className="text-xl font-semibold text-[#9a2119]">Ticket not found</h1>
        <button
          onClick={() => navigate("/support_tickets/all")}
          className="mt-4 px-4 py-2 rounded-xl bg-[#9a2119] text-white hover:bg-[#c4392e] transition"
        >
          Back to Support Tickets
        </button>
      </div>
    );
  }

  const showSuccess = (content) => messageApi.success(content);
  const showError = (content) => messageApi.error(content);

  const handleReply = () => {
    if (!replyText.trim()) {
      showError("Please enter a reply before sending.");
      return;
    }

    const newReply = {
      id: `R${Date.now()}`,
      author: "Super Admin",
      date: new Date().toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      message: replyText.trim(),
      attachments,
    };

    setReplies((prev) => [newReply, ...prev]);
    setReplyText("");
    setAttachments([]);
    setStatus("Answered");
    showSuccess("Reply sent successfully.");
  };

  const handleClear = () => {
    setReplyText("");
    setAttachments([]);
    showSuccess("Reply form cleared successfully.");
  };

  const handleCloseTicket = () => {
    setStatus("Closed");
    showSuccess("Ticket closed successfully.");
  };

  const handleDeleteReply = (replyId) => {
    setReplies((prev) => prev.filter((reply) => reply.id !== replyId));
    showSuccess("Reply deleted successfully.");
  };

  const handleAddAttachment = (file) => {
    setAttachments((prev) => {
      if (prev.includes(file.name)) {
        showError(`${file.name} is already added.`);
        return prev;
      }

      showSuccess(`${file.name} attached successfully.`);
      return [...prev, file.name];
    });

    return false;
  };

  const handleRemoveAttachment = (fileName) => {
    setAttachments((prev) => prev.filter((item) => item !== fileName));
    showSuccess("Attachment removed successfully.");
  };

  return (
    <div className="space-y-5">
      {contextHolder}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/support_tickets/all")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-[#9a2119] hover:text-[#9a2119]"
          >
            <ArrowLeftOutlined />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#9a2119]">Reply Ticket</h1>
            <p className="text-sm text-gray-500">
              [{ticket.id}] {ticket.subject}
            </p>
          </div>
        </div>

        <ActionButton
          onClick={() => navigate("/support_tickets/all")}
          className="bg-[#9a2119] text-white hover:bg-[#c4392e] shadow-[0_10px_18px_rgba(154,33,25,0.16)]"
          icon={<ArrowLeftOutlined />}
        >
          Back
        </ActionButton>
      </div>

      <div className="rounded-[24px] border border-[#f0d7d4] bg-white p-5 shadow-[0_18px_45px_rgba(154,33,25,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#f4e0dd] pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${formatStatusTone(status)}`}>
                {status}
              </span>
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                {ticket.priority}
              </span>
              <span className="text-sm font-semibold text-slate-700">{ticket.email}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Opened by {ticket.openedBy} on {ticket.openedOn}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{ticket.message}</p>
          </div>

          {status !== "Closed" ? (
            <Popconfirm
              title="Close this ticket?"
              description="The ticket status will change to closed."
              okText="Close Ticket"
              cancelText="Cancel"
              onConfirm={handleCloseTicket}
            >
              <button className="rounded-xl bg-[#9a2119] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c4392e]">
                Close Ticket
              </button>
            </Popconfirm>
          ) : null}
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#9a2119]">
              Reply Message
            </label>
            <TextArea
              rows={6}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply to the user..."
              className="rounded-2xl"
            />
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-[280px] flex-1">
              <p className="mb-2 text-sm font-medium text-slate-500">
                Maximum upload size: 2MB
              </p>

              <div >
                <Upload
                  multiple
                  beforeUpload={handleAddAttachment}
                  showUploadList={false}
                >
                  <button
                    type="button"
                    className="inline-flex  items-center gap-2 rounded-xl border border-[#f3c7c3] bg-white px-4 py-2  text-sm font-semibold text-[#9a2119] transition hover:bg-[#fdf2f1]"
                  >
                    <InboxOutlined />
                    Choose File
                  </button>
                </Upload>

                {attachments.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {attachments.map((fileName) => (
                      <div
                        key={fileName}
                        className="inline-flex items-center gap-2 rounded-full bg-[#fdf2f1] px-3 py-1 text-sm text-[#9a2119]"
                      >
                        <PaperClipOutlined />
                        <span>{fileName}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(fileName)}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-[#9a2119] hover:bg-[#f3c7c3]"
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Popconfirm
                title="Clear the reply form?"
                description="This will remove the typed message and attachment."
                okText="Clear"
                cancelText="Cancel"
                onConfirm={handleClear}
              >
                <button className="rounded-xl border border-[#9a2119] px-3 py-2 text-sm font-semibold text-[#9a2119] transition hover:bg-[#fdf2f1]">
                  Clear
                </button>
              </Popconfirm>

              <ActionButton
                onClick={handleReply}
                className="bg-[#9a2119] text-white hover:bg-[#c4392e] shadow-[0_10px_18px_rgba(154,33,25,0.16)]"
                icon={<SendOutlined />}
              >
                Reply
              </ActionButton>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fdf2f1] text-[#9a2119]">
              <MessageOutlined />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#9a2119]">Ticket Replies</h2>
              <p className="text-sm text-gray-500">{replies.length} replies available</p>
            </div>
          </div>
        </div>

        {replies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#f3c7c3] bg-[#fff8f7] px-5 py-10 text-center">
            <p className="text-base font-semibold text-[#9a2119]">No replies yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Send the first response from the reply box above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {replies.map((reply, index) => (
              <div
                key={reply.id}
                className={`rounded-2xl border p-5 shadow-sm ${
                  index % 2 === 0
                    ? "border-[#f3c7c3] bg-[#fff9f8]"
                    : "border-[#ece7fb] bg-[#f7f4ff]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#9a2119]">
                      {reply.author}
                      <span className="ml-2 font-medium text-slate-500">
                        replied on {reply.date}
                      </span>
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{reply.message}</p>

                    {reply.attachments?.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {reply.attachments.map((fileName) => (
                          <div
                            key={fileName}
                            className="inline-flex items-center gap-2 rounded-full border border-[#f3c7c3] bg-white px-3 py-1 text-sm text-[#9a2119]"
                          >
                            <PaperClipOutlined />
                            {fileName}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <Popconfirm
                    title="Delete this reply?"
                    description="This action cannot be undone."
                    okText="Delete"
                    cancelText="Cancel"
                    onConfirm={() => handleDeleteReply(reply.id)}
                  >
                    <button className="flex  items-center justify-center  text-[#dc2626] transition hover:text-[#9a2119]">
                      <DeleteOutlined />
                    </button>
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
