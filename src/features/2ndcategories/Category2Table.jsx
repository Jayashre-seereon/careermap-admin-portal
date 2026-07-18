import React,{useState} from "react";
import { Table, Button, Space, Input, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { getSerialNumber } from "../../utils/slNo";
export default function Category2Table({
  data,
  loading,
  onAdd,
  onEdit,
  onView,
  onDelete,
  search,
  setSearch,
}) {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const handleReset = () => setSearch("");

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => getSerialNumber(index, pagination),
      width: 70,
    },
    
    {
      title: "Category",
      dataIndex: "categoryName",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 240,
      ellipsis: true,
    },
    {
      title: "Cover Image",
      dataIndex: "coverImage",
      render: (img) =>
        img ? (
          <img
            src={img}
            alt=""
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <span className="text-gray-400">No image</span>
        ),
      width: 100,
    },

    {
      title: "Path ways",
      dataIndex: "path",
      ellipsis: true,
      width: 100,
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
    <div className="w-full bg-white p-6 rounded-2xl shadow border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">
          Second Category
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search second category..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 h-8 rounded-md border-[#9a2119]"
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
            + Add Category
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
