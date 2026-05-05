import { Table, Input, Tooltip, Button, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

export default function ScholarshipTable({
  data,
  onView,
  onEdit,
  onDelete,
  onAdd,
}) {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => setSearch("");

  const ellipsis = (text) => (
    <Tooltip title={text}>
      <span className="truncate block max-w-[200px]">{text}</span>
    </Tooltip>
  );

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
      width: 60,
      fixed: "left",
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 120,
    },
    {
      title: "Class",
      dataIndex: "class",
      width: 120,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 220,
      render: ellipsis,
    },
    {
      title: "Short Description",
      dataIndex: "desc",
      width: 250,
      render: ellipsis,
    },
    {
      title: "URL",
      dataIndex: "url",
      width: 140,
      render: (url) => (
        <a href={url} target="_blank" rel="noreferrer" className="text-blue-600">
          Visit
        </a>
      ),
    },
    {
      title: "Action",
      align: "right",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => onView && onView(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
          >
            <EyeOutlined />
          </Button>

          <Button
            onClick={() => onEdit && onEdit(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
          >
            <EditOutlined />
          </Button>

         

          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this scholarship?"
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
    <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Scholarship Management
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border p-5">

        {/* HEADER */}
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Scholarships
          </h2>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <Input
              placeholder="Search..."
              value={search}
              prefix={<SearchOutlined />}
             className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
             
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button
              onClick={handleReset}
               style={{ background: "#9a2119", borderColor: "#9a2119" ,color:"white"}}  >
              <ReloadOutlined /> Reset
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
          rowKey="key"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1200 }}
        />
      </div>
    </div>
  );
}
