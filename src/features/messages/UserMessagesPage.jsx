import { useEffect, useState } from "react";
import { Alert, Button, Descriptions, Modal, Table, Typography } from "antd";
import { EyeOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { getUserMessages } from "../../api/sendMessage";

const { Title } = Typography;

export default function UserMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  useEffect(() => {
    let active = true;
    getUserMessages().then((response) => {
      const data = Array.isArray(response?.data) ? response.data : [];
      if (active) setMessages(data.map((item) => ({
        ...item,
        email: item.email || item.email_id || item.user?.email || "—",
        phone: item.phone || item.phone_no || item.user?.mobile || "—",
        name: item.name || [item.user?.firstName, item.user?.lastName].filter(Boolean).join(" ") || item.user?.username || "—",
      })));
    }).catch((requestError) => {
      if (active) setError(requestError?.response?.data?.message || "Failed to load user messages.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const columns = [
    { title: <span className="font-semibold text-[#9a2119]">Name</span>, dataIndex: "name", key: "name", width: 180, ellipsis: true },
    { title: <span className="font-semibold text-[#9a2119]">Email</span>, dataIndex: "email", key: "email", width: 220, ellipsis: true },
    { title: <span className="font-semibold text-[#9a2119]">Phone</span>, dataIndex: "phone", key: "phone", width: 170, },
    { title: <span className="font-semibold text-[#9a2119]">Message</span>, dataIndex: "message", key: "message", width: 260, render: (value, record) => <div className="flex items-center gap-2"><span className="min-w-0 flex-1 truncate" title={value}>{value}</span><Button  className="border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
           icon={<EyeOutlined  />} aria-label="View full message" title="View full message" onClick={() => setSelectedMessage(record)} /></div> },
    { title: <span className="font-semibold text-[#9a2119]">Received</span>, dataIndex: "createdAt", key: "createdAt", width: 180, render: (value) => value ? new Date(value).toLocaleString() : "—" },
  ];
  return <div className="w-full"><Title level={2} className="!mb-4 !text-xl !font-semibold !text-[#9a2119]">User Messages</Title>{error ? <Alert className="mb-4" type="error" showIcon message={error} /> : null}<div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="m-0 text-lg font-semibold text-[#9a2119]">Messages</h2></div><Table rowKey="id" columns={columns} dataSource={messages} loading={loading} rowClassName="hover:bg-gray-50" scroll={{ x: "max-content" }} pagination={{ pageSize: 10, showSizeChanger: true }} className="[&_.ant-table-cell]:align-middle" /></div><Modal title="User message" open={Boolean(selectedMessage)} onCancel={() => setSelectedMessage(null)} footer={null} width={640}><Descriptions bordered column={1} size="small"><Descriptions.Item label="Name">{selectedMessage?.name || "—"}</Descriptions.Item><Descriptions.Item label="Email">{selectedMessage?.email || "—"}</Descriptions.Item><Descriptions.Item label="Phone">{selectedMessage?.phone || "—"}</Descriptions.Item><Descriptions.Item label="Received">{selectedMessage?.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : "—"}</Descriptions.Item><Descriptions.Item label="Message"><div className="max-h-[50vh] overflow-y-auto whitespace-pre-wrap break-words">{selectedMessage?.message || "—"}</div></Descriptions.Item></Descriptions></Modal></div>;
}
