import { Table, Input, Button, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";

export default function PlansTable({
  data = [],
  subscriptionsByPlan = {},
  onView,
  onEdit,
  onDelete,
  onAdd,
  onViewUsers,
}) {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => setSearch("");

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">SL</span>,
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Plan Name</span>,
      dataIndex: "name",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Features</span>,
      dataIndex: "features",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Module</span>,
      dataIndex: "module",
      render: (module) => (Array.isArray(module) ? module.join(", ") : module),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Price</span>,
      dataIndex: "price",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Subscribers</span>,
      render: (_, record) => {
        const subscribers = subscriptionsByPlan[record.key] || [];

        return (
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#fdf2f1] px-3 py-1 text-xs font-semibold text-[#9a2119]">
              {subscribers.length}
            </span>
            <Button
              onClick={() => onViewUsers?.(record)}
              className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
              title="View subscribed users"
            >
              <UserOutlined />
            </Button>
          </div>
        );
      },
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
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
          >
            <EditOutlined />
          </Button>

          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this item?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete?.(record)}
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
        Plans Management
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Plans
          </h2>

          <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
            <Input
              placeholder="Search plan..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
             className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
             
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button
              onClick={handleReset}
               style={{ background: "#9a2119", borderColor: "#9a2119" ,color:"white"}}  >
            
              <ReloadOutlined />
              Reset
            </Button>

            <Button
              onClick={onAdd}
              style={{ background: "#9a2119", borderColor: "#9a2119" ,color:"white"}}  >

              + Add
            </Button>
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
    </div>
  );
}
