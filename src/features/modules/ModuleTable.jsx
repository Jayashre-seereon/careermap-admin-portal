import {React,useState}from "react";
import { Table, Button, Space, Popconfirm, Input, Tag } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { getSerialNumber } from "../../utils/slNo";
function ModuleTable({
  data,
  onAddClick,
  onView,
  onEdit,
  onDelete,
  search,
  onSearch,
  loading,
}) {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const columns = [
    {
      title: "No.",
      width: 80,
      render: (_, __, index) => getSerialNumber(index, pagination),
    },
    { title: "Title", dataIndex: "title", width: 240, ellipsis: true },
    {
      title: "Access",
      dataIndex: "isFree",
      render: (isFree) => (
        <Tag color={isFree ? "green" : "red"}>
          {isFree ? "Unlocked" : "Locked"}
        </Tag>
      ),
      width: 140,
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
            title="Are you sure you want to delete this module?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-5 rounded-2xl shadow-md border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Module</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search module..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="w-full sm:w-64 h-8 rounded-md border-[#9a2119]"
          />
          <Button
            onClick={() => onSearch("")}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <ReloadOutlined />
            Reset
          </Button>
          <Button
            onClick={onAddClick}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            + Add Module
          </Button>
        
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? [...data].reverse() : []}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={pagination}
        onChange={(pag) => setPagination(pag)}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

export default ModuleTable;
