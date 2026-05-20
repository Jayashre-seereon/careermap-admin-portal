import { Table, Input, Tooltip, Button, Popconfirm, Avatar } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

export default function InstitutionTable({
  data,
  onView,
  onEdit,
  onDelete,
  onAddClick,
  search,
  onSearch,
  loading,
}) {
  const renderEllipsis = (text) => (
    <Tooltip title={text}>
      <span className="truncate block max-w-[200px]">{text || "-"}</span>
    </Tooltip>
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "Logo",
      dataIndex: "logo",
      width: 90,
      render: (logo) => (
        <Avatar src={logo || undefined} size={45} shape="square" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 220,
      render: renderEllipsis,
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 220,
      render: renderEllipsis,
    },
    {
      title: "Admission Process",
      dataIndex: "admission_process",
      width: 180,
      render: renderEllipsis,
    },
    {
      title: "Tentative Date",
      dataIndex: "tentative_date",
      width: 140,
    },
    {
      title: "Institution Type",
      dataIndex: "institute_type",
      width: 140,
    },
    {
      title: "URL",
      dataIndex: "url",
      width: 120,
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noreferrer" className="text-[#9a2119]">
            Visit
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Country",
      dataIndex: "country",
      width: 120,
    },
    {
      title: "State",
      dataIndex: "state",
      width: 120,
    },
    {
      title: "City",
      dataIndex: "city",
      width: 120,
    },
    {
      title: "District",
      dataIndex: "district",
      width: 120,
    },
    {
      title: "Action",
      align: "right",
      width: 150,
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <Button
            className="w-8 h-8 flex items-center justify-center rounded-md 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]"
            onClick={() => onView(record)}
          >
            <EyeOutlined />
          </Button>
          <Button
            className="w-8 h-8 flex items-center justify-center rounded-md 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]"
            onClick={() => onEdit(record)}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this institute?"
            onConfirm={() => onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-5 rounded-2xl shadow-md border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Institution</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search institution..."
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
            + Add Institution
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
