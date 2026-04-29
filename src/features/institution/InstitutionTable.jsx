import { Table, Input, Tooltip } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const initialData = [
  {
    key: "1",
    name: "Jawaharlal Institute of Postgraduate Medical Education & Research (JIPMER), Puducherry",
    logo: "https://via.placeholder.com/40",
    address: "Jipmer Campus Rd, Jipmer Campus, Puducherry",
    admission: "NEET-UG, NEET-PG",
    date: "July 2025",
    type: "Govt.",
    url: "https://jipmer.edu.in/",
    country: "India",
    state: "PONDICHERY",
    district: "Pondicherry",
  },
  {
    key: "2",
    name: "PGIMER Chandigarh",
    logo: "https://via.placeholder.com/40",
    address: "Sector 12, Chandigarh",
    admission: "NEET-PG, INI-CET",
    date: "July 2025",
    type: "Govt.",
    url: "https://pgimer.edu.in/",
    country: "India",
    state: "PUNJAB",
    district: "Amritsar",
  },
];

export default function InstitutionTable({
  onView,
  onEdit,
  onDelete,
  onAdd,
}) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(initialData);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => setSearch("");

  const renderEllipsis = (text) => (
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
      title: "Name",
      dataIndex: "name",
      width: 220,
      render: renderEllipsis,
    },
    {
      title: "Logo",
      dataIndex: "logo",
      width: 90,
      render: (logo) => (
        <img
          src={logo}
          alt="logo"
          className="w-10 h-10 rounded-md object-cover border"
        />
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 220,
      render: renderEllipsis,
    },
    {
      title: "Admission Process",
      dataIndex: "admission",
      width: 180,
      render: renderEllipsis,
    },
    {
      title: "Tentative Date",
      dataIndex: "date",
      width: 140,
    },
    {
      title: "Institution Type",
      dataIndex: "type",
      width: 140,
    },
    {
      title: "URL",
      dataIndex: "url",
      width: 120,
      render: (url) => (
        <a href={url} target="_blank" rel="noreferrer" className="text-blue-600">
          Visit
        </a>
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
      title: "District",
      dataIndex: "district",
      width: 120,
    },
    {
      title: "Action",
      align: "right",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onView && onView(record)}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
          >
            <EyeOutlined />
          </button>

          <button
            onClick={() => onEdit && onEdit(record)}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
          >
            <EditOutlined />
          </button>

          <button
            onClick={() => {
              const updated = data.filter((d) => d.key !== record.key);
              setData(updated);
              onDelete && onDelete(record);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-red-500 text-red-500 hover:bg-red-50"
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Institution Management
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Institutions
          </h2>

          <div className="flex items-center gap-3">
            <Input
              placeholder="Search institution..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="w-64 h-9 rounded-md border-[#9a2119]"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 h-9 rounded-md bg-[#9a2119] text-white hover:bg-[#c4392e]"
            >
              <ReloadOutlined />
              Reset
            </button>

            <button
              onClick={onAdd}
              className="px-4 h-9 rounded-md bg-[#9a2119] text-white hover:bg-[#c4392e]"
            >
              + Add
            </button>
          </div>
        </div>

        {/* TABLE */}
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: 1400 }}  // 🔥 horizontal scroll
        />
      </div>
    </div>
  );
}