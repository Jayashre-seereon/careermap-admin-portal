import { Button, Input, Popconfirm, Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

export default function DetailsTable({
  data,
  search,
  onSearch,
  onAdd,
  onView,
  onEdit,
  onDelete,
  getRecordTitle,
  getRecordDetailsLabel,
  summarizeRecord,
  sectionLabels,
}) {
  const columns = [
    {
      title: "SL",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Section",
      width: 180,
      render: (_, record) => {
        const sections = record.sections || (record.section ? [record.section] : []);
        return sections.map((value) => sectionLabels[value] || value).join(", ");
      },
    },
    {
      title: "Title / Name",
      width: 220,
      render: (_, record) => getRecordTitle(record),
    },
    {
      title: "Stream",
      dataIndex: "stream",
      width: 120,
      render: (value, record) => record.streamName || value || "-",
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 140,
      render: (value, record) => record.categoryName || value || "-",
    },
    {
      title: "Secondary Category",
      dataIndex: "secondCategory",
      width: 180,
      render: (value, record) => record.secondCategoryName || value || "-",
    },
    {
      title: "Subcategory",
      dataIndex: "subcategory",
      width: 150,
      render: (value, record) => record.subcategoryName || value || "-",
    },
    {
      title: "Details Type",
      width: 170,
      render: (_, record) => getRecordDetailsLabel(record),
    },
   
    {
      title: "Action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119]"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          />
          <Button
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119]"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this details item?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#9a2119]">Details</h2>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search details..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
          />

          <Button
            onClick={() => onSearch("")}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <ReloadOutlined />
            Reset
          </Button>

          <Button
            onClick={onAdd}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <PlusOutlined />
            Add Details
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
