import React ,{useState} from "react";
import { Button, Input, Popconfirm, Space, Table, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getSerialNumber } from "../../utils/slNo";
const stripHtml = (text = "") => {
  const normalizedText = Array.isArray(text)
    ? text.join(", ")
    : typeof text === "string"
      ? text
      : text == null
        ? ""
        : String(text);

  return normalizedText
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export default function StudyAbroadTable({
  data,
  loading,
  search,
  onSearch,
  onView,
  onEdit,
  onDelete,
  onAdd,
}) {
  const ellipsis = (text) => (
    <Tooltip title={stripHtml(text) || "-"}>
      <span className="block max-w-[220px] truncate">{stripHtml(text) || "-"}</span>
    </Tooltip>
  );
const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const columns = [
    {
      title: "SL",
      render: (_, __, index) => getSerialNumber(index, pagination),
      width: 60,
      fixed: "left",
    },
    {
      title: "Title",
      dataIndex: "title",
      width: 180,
      render: ellipsis,
    },
    {
      title: "Country",
      dataIndex: "countryName",
      width: 180,
      render: ellipsis,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 220,
      render: ellipsis,
    },
    {
      title: "Overview",
      dataIndex: "overview",
      width: 220,
      render: ellipsis,
    },
    {
      title: "Living Cost",
      dataIndex: "livingCost",
      width: 140,
      render: (value) => value || "-",
    },
    {
      title: "Tuition Cost",
      dataIndex: "tuitionCost",
      width: 140,
      render: (value) => value || "-",
    },
    {
      title: "Popular Courses",
      dataIndex: "popularCourses",
      width: 200,
      render: ellipsis,
    },
    {
      title: "Action",
      align: "right",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
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
            description="Are you sure you want to delete this study abroad record?"
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
    <div className="w-full">
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Study Abroad Management
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Study Abroad</h2>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <Input
              placeholder="Search..."
              value={search}
              prefix={<SearchOutlined />}
              className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Button
              onClick={() => onSearch("")}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              <ReloadOutlined /> Reset
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
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={(pag) => setPagination(pag)}
          scroll={{ x: 1300 }}
        />
      </div>
    </div>
  );
}

