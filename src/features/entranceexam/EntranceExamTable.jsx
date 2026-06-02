import { Table, Input, Button, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { formatDateDisplay } from "../../utils/date";

export default function EntranceExamTable({
  data,
  loading,
  search,
  onSearch,
  onView,
  onEdit,
  onDelete,
  onAdd,
}) {
  const handleReset = () => onSearch("");

  const formatDate = (value) => {
    return formatDateDisplay(value);
  };

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

  const ellipsis = (text) => (
    <Tooltip title={stripHtml(text) || "-"}>
      <span className="block max-w-[220px] truncate">{stripHtml(text) || "-"}</span>
    </Tooltip>
  );

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">SL</span>,
      render: (_, __, index) => index + 1,
      width: 70,
    },
    // {
    //   title: <span className="text-[#9a2119] font-semibold">Module</span>,
    //   dataIndex: "moduleName",
    //   width: 150,
    //   ellipsis: true,
    // },
    {
      title: <span className="text-[#9a2119] font-semibold">Stream</span>,
      dataIndex: "streamName",
      width: 140,
      ellipsis: true,
    },
    // {
    //   title: <span className="text-[#9a2119] font-semibold">Category</span>,
    //   dataIndex: "categoryName",
    //   width: 160,
    //   ellipsis: true,
    // },
    // {
    //   title: <span className="text-[#9a2119] font-semibold">2nd Category</span>,
    //   dataIndex: "secondCategoryName",
    //   width: 180,
    //   ellipsis: true,
    // },
    // {
    //   title: <span className="text-[#9a2119] font-semibold">Subcategory</span>,
    //   dataIndex: "subcategoryName",
    //   width: 180,
    //   ellipsis: true,
    // },
    {
      title: <span className="text-[#9a2119] font-semibold">Exam Name</span>,
      dataIndex: "examname",
      width: 180,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Issue Date</span>,
      dataIndex: "issuedate",
      width: 140,
      render: (value) => formatDate(value),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Last Date</span>,
      dataIndex: "lastdate",
      width: 140,
      render: (value) => formatDate(value),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Eligibility</span>,
      dataIndex: "eligibility",
      width: 180,
      render: ellipsis,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Exam Mode</span>,
      dataIndex: "examMode",
      width: 140,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Duration</span>,
      dataIndex: "duration",
      width: 140,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Subject</span>,
      dataIndex: "subject",
      width: 160,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">URL</span>,
      dataIndex: "url",
      width: 140,
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noreferrer" className="text-blue-600">
            Visit
          </a>
        ) : (
          "-"
        ),
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
            description="Are you sure you want to delete this entrance exam?"
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
      <h1 className="text-xl font-semibold text-[#9a2119] mb-4">
        Entrance Exam Management
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Entrance Exams</h2>

          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <Input
              placeholder="Search exam..."
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
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}
