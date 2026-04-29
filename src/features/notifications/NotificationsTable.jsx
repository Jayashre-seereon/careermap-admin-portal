import { Table, Input, Tag } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
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
  onView,
  onEdit,
  onDelete,
  onAdd,
}) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(initialData);

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => setSearch("");

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
        <Tag color={status === "Active" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Date</span>,
      dataIndex: "date",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => onView(record)} className="btn-view">
            <EyeOutlined />
          </button>
          <button onClick={() => onEdit(record)} className="btn-view">
            <EditOutlined />
          </button>
          <button
            onClick={() => {
              const updated = data.filter((d) => d.key !== record.key);
              setData(updated);
              onDelete && onDelete(record);
            }}
            className="btn-delete"
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">

      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Notifications Management
      </h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">

        <div className="flex justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Notifications
          </h2>

          <div className="flex gap-3">
            <Input
              placeholder="Search..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="w-64 h-10 border-[#9a2119]"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button onClick={handleReset} className="btn-main">
              <ReloadOutlined /> Reset
            </button>

            <button onClick={onAdd} className="btn-main">
              + Add
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
        .btn-view {
          width: 36px;
          height: 36px;
          border: 1px solid #9a2119;
          color: #9a2119;
          border-radius: 6px;
        }
        .btn-delete {
          width: 36px;
          height: 36px;
          border: 1px solid red;
          color: red;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}