import { Table, Input, Button, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

export default function PathTypeTable({
  data,
  onView,
  onEdit,
  onDelete,
  onAdd,
  onSearch,
  search,
}) {
  const handleReset = () => onSearch("");

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">ID</span>,
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Title</span>,
      dataIndex: "title",
      width: 280,
      ellipsis: true,
    },
    {
      title: (
        <span className="text-[#9a2119] font-semibold text-right block">
          Action
        </span>
      ),
      key: "action",
      align: "right", // ✅ Important
      width: 180,
      render: (_, record) => (
        <div className="flex justify-end gap-2 pr-2">
          {/* View */}
          <button
            onClick={() => onView(record)}
           className="w-8 h-8 flex items-center justify-center rounded-md 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]
                      "
          >
            <EyeOutlined />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(record)}
           className="w-8 h-8 flex items-center justify-center rounded-md 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]
                      "
          >
            <EditOutlined />
          </button>

          {/* Delete */}
          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this path type?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete && onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">
          Path Type
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search path..."
            value={search}
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            className="w-full sm:w-64 h-9 rounded-md border-[#9a2119]"
            onChange={(e) => onSearch(e.target.value)}
          />

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 h-9 rounded-md
                       bg-[#9a2119]
                       text-white
                       hover:bg-[#c4392e]
                       transition"
          >
            <ReloadOutlined />
            Reset
          </button>

          {/* Add Button */}
          <button
            onClick={onAdd}
            className="px-4 h-9 rounded-md
                       bg-[#9a2119]
                       text-white
                       hover:bg-[#c4392e]
                       transition"
          >
            + Add
          </button>
        </div>
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        rowClassName="hover:bg-gray-50"
        scroll={{ x: "max-content" }}
        className="[&_.ant-table-cell]:align-middle"
      />
    </div>
  );
}
