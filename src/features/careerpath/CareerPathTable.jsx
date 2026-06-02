import { Table, Input, Button, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

export default function CareerPathTable({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
  onAdd,
  search,
  onSearch,
}) {
  const handleReset = () => onSearch("");

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">SL</span>,
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Module</span>,
      dataIndex: "moduleName",
      width: 160,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Name</span>,
      dataIndex: "pathName",
      width: 180,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Category</span>,
      dataIndex: "categoryName",
      width: 160,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">2nd Category</span>,
      dataIndex: "secondCategoryName",
      width: 180,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Subcategory</span>,
      dataIndex: "subcategoryName",
      width: 180,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Path Type</span>,
      dataIndex: "pathTypeName",
      width: 140,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Graduation</span>,
      dataIndex: "graduation",
      width: 160,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">After Graduation</span>,
      dataIndex: "aftergraduation",
      width: 180,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">After Post Graduation</span>,
      dataIndex: "afterpostgraduation",
      width: 220,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Any Other</span>,
      dataIndex: "anyother",
      width: 160,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      key: "action",
      align: "right",
      width: 150,
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => onView(record)}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
          >
            <EyeOutlined />
          </Button>

          <Button
            onClick={() => onEdit(record)}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
          >
            <EditOutlined />
          </Button>

          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this career path?"
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 w-full">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#9a2119]">Career Path</h2>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <Input
            placeholder="Search career path..."
            value={search}
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
            onChange={(e) => onSearch(e.target.value)}
          />

          <Button
            onClick={handleReset}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <ReloadOutlined />
            Reset
          </Button>

          <Button
            onClick={onAdd}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            + Add
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? [...data].reverse() : []}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        rowClassName="hover:bg-gray-50"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
