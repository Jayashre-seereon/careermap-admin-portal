import React from "react";
import { Button, Input, Popconfirm, Space, Table, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const stripHtml = (value = "") =>
  value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const getPreviewText = (value = "", maxLength = 42) => {
  const text = stripHtml(String(value));

  if (!text) {
    return "-";
  }

  return text.length > maxLength ? `${text.slice(0, maxLength)}.....` : text;
};

function DomainTable({
  data,
  onAddClick,
  onView,
  onEdit,
  onDelete,
  search,
  onSearch,
}) {
  const columns = [
    {
      title: "#",
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Display Domain Name",
      dataIndex: "displayDomainName",
      width: 230,
      ellipsis: true,
    },
    {
      title: "Score Type",
      dataIndex: "scoringType",
      width: 160,
      render: (value) => (
        <Tag color="volcano" className="font-medium">
          {value}
        </Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 340,
      ellipsis: true,
      render: (text) => getPreviewText(text),
    },
    {
      title: "Domain Weightage",
      dataIndex: "domainWeightage",
      width: 170,
      render: (value) => (
        <span className="font-semibold text-[#9a2119]">{value}%</span>
      ),
    },
    {
      title: "Actions",
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
            title="Are you sure you want to delete this domain?"
            onConfirm={() => onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-5 rounded-2xl border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Domains</h2>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <Input
            placeholder="Search domain..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="w-full sm:w-64 h-8 rounded-md border-[#9a2119]"
          />
          <Button
            onClick={() => onSearch("")}
            style={{
              background: "#9a2119",
              borderColor: "#9a2119",
              color: "white",
            }}
          >
            <ReloadOutlined />
            Reset
          </Button>
          <Button
            onClick={onAddClick}
            style={{
              background: "#9a2119",
              borderColor: "#9a2119",
              color: "white",
            }}
          >
            + Add Domain
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? [...data].reverse() : []}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

export default DomainTable;

