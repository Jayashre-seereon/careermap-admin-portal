import { Table, Input, Tag } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const initialData = [
  {
    key: "1",
    title: "New Course Available",
    message: "New MBBS course added",
    type: "Info",
    target: "All Users",
    status: "Active",
    date: "12 Mar 2025",
  },
  {
    key: "2",
    title: "System Maintenance",
    message: "System will be down tonight",
    type: "Warning",
    target: "All Users",
    status: "Active",
    date: "13 Mar 2025",
  },
];

export default function NotificationsTable({
  onMarkAsRead,
}) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(initialData);

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => setSearch("");
  const handleMarkAsReadClick = () => {
    setData((prev) => prev.map((item) => ({ ...item, status: "Read" })));
    onMarkAsRead && onMarkAsRead();
  };

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">SL</span>,
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Title</span>,
      dataIndex: "title",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Message</span>,
      dataIndex: "message",
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Type</span>,
      dataIndex: "type",
      render: (type) => {
        let color = "blue";
        if (type === "Warning") color = "orange";
        if (type === "Success") color = "green";
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Target</span>,
      dataIndex: "target",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Status</span>,
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "blue"}>
          {status}
        </Tag>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Date</span>,
      dataIndex: "date",
    },
  ];

  return (
    <div className="w-full">

      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Notifications Management
      </h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">

        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Notifications
          </h2>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <Input
              placeholder="Search..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="h-10 w-full border-[#9a2119] sm:w-64"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button onClick={handleReset} className="btn-main">
              <ReloadOutlined /> Reset
            </button>

            <button onClick={handleMarkAsReadClick} className="btn-main">
              Mark as Read
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: true }}
        />
      </div>

      {/* BUTTON STYLES */}
      <style jsx>{`
        .btn-main {
          background: #9a2119;
          color: white;
          padding: 0 16px;
          height: 40px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
