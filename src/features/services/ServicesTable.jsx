import { Table, Input, Tag, Button, Popconfirm } from "antd";
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
    title: "Psychometric Career Counselling",
    price: "Rs 1.00",
    icon: "",
    time: "Mar 2025, 08:12 PM",
    status: "Active",
  },
  {
    key: "2",
    title: "Behavioural & Psychological Counselling",
    price: "Rs 1.00",
    icon: "",
    time: "Mar 2025, 08:08 PM",
    status: "Active",
  },
  {
    key: "3",
    title: "MSM",
    price: "Rs 1.00",
    icon: "",
    time: "Mar 2025, 08:04 PM",
    status: "Active",
  },
  {
    key: "4",
    title: "Career Counselling Cell",
    price: "Rs 1.00",
    time: "Mar 2025, 07:53 PM",
    status: "Active",
  },
  {
    key: "5",
    title: "University Admissions",
    price: "Rs 1.00",
    time: "Mar 2025, 07:41 PM",
    status: "Active",
  },
  {
    key: "6",
    title: "Information Dashboard & App",
    price: "Rs 1.00",
    time: "Mar 2025, 07:38 PM",
    status: "Active",
  },
];

export default function ServicesTable({
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
      title: <span className="text-[#9a2119] font-semibold">Price</span>,
      dataIndex: "price",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Icon</span>,
      dataIndex: "icon",
      render: (icon) =>
        icon ? (
          <img src={icon} className="w-8 h-8 object-cover" />
        ) : (
          "-"
        ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Time</span>,
      dataIndex: "time",
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
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => onView(record)}
             className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
           >
            <EyeOutlined />
          </Button>

          <Button
            onClick={() => onEdit(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"   >
            <EditOutlined />
          </Button>

          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this item?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              setData(data.filter((d) => d.key !== record.key));
              onDelete && onDelete(record);
            }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Services Management
      </h1>

      <div className="bg-white rounded-2xl border p-5">
        <div className="flex justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Services
          </h2>

          <div className="flex gap-3">
            <Input
              placeholder="Search..."
              value={search}
              prefix={<SearchOutlined />}
              className="w-64 h-10"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 h-10 rounded-lg bg-[#9a2119] text-white"
            >
              <ReloadOutlined /> Reset
            </button>

            <button
              onClick={onAdd}
              className="px-5 h-10 rounded-lg bg-[#9a2119] text-white"
            >
              + Add Services
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
}
