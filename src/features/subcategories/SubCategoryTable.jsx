import React,{useState} from "react";
import { Table, Button, Popconfirm, Input, Space } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getSerialNumber } from "../../utils/slNo";
export default function SubCategoryTable({
  data,
  loading,
  onAdd,
  onView,
  onEdit,
  onDelete,
  search,
  setSearch,
}) {
  const handleReset = () => setSearch("");
const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const columns = [
    { title: "SL", render: (_, __, index) => getSerialNumber(index, pagination), width: 70 },
    {
      title: "Category",
      dataIndex: "categoryName",
      width: 180,
      ellipsis: true,
    },
    {
      title: "2nd Category",
      dataIndex: "secondCategoryName",
      width: 220,
      ellipsis: true,
    },
     {
      title: "Title",
      dataIndex: "title",
      width: 180,
      ellipsis: true,
    },
     {
      title: "Cover Image",
      dataIndex: "coverImage",
      width: 110,
      render: (img) =>
        img ? (
          <img src={img} alt="" className="w-16 h-16 object-cover rounded" />
        ) : (
          <span className="text-gray-400">No image</span>
        ),
    },
    {
      title: "Institution",
      dataIndex: "institutionName",
      width: 220,
      ellipsis: true,
    },
   
    
    {
      title: "Path",
      dataIndex: "path",
      width: 100,
      ellipsis: true,
      render: (text) => text || "-",
    },
   
   
   
    {
      title: "Action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            className="w-8 h-8 flex items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          />
          <Button
            className="w-8 h-8 flex items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this item?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-5 rounded-2xl shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Sub Category</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search sub category..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            className="w-full sm:w-64 h-8 rounded-md border-[#9a2119]"
            value={search}
            onChange={(e) => setSearch(e.target.value || "")}
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
            + Add SubCategory
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? [...data].reverse() : []}
        loading={loading}
        rowKey="id"
        pagination={pagination}
        onChange={(pag) => setPagination(pag)}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
