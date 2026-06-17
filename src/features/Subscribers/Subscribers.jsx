import { Table, Input, Popconfirm, Button } from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const initialData = [
  {
    key: "1",
    user: "Rahul Sharma",
    email: "rahul@gmail.com",
    joined: "2024-01-12",
    balance: "$120",
  },
  {
    key: "2",
    user: "Priya Das",
    email: "priya@gmail.com",
    joined: "2024-02-05",
    balance: "$80",
  },
];

export default function Subscribers() {
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState(initialData);

  // 🔍 Filter data
  const filteredData = tableData.filter((item) =>
    item.user.toLowerCase().includes(search.toLowerCase())
  );

  // 🔄 Reset search
  const handleReset = () => setSearch("");

  // ❌ Delete handler
  const handleDelete = (key) => {
    setTableData((prev) => prev.filter((item) => item.key !== key));
  };

  // 📊 Columns
  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">Email</span>,
      dataIndex: "email",
    },
    {
      title: (
        <span className="text-[#9a2119] font-semibold">
          Subscribed At
        </span>
      ),
      dataIndex: "joined",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      render: (_, record) => (
        <Popconfirm
          title="Delete?"
          description="Are you sure you want to delete this user?"
          onConfirm={() => handleDelete(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (

 <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Subscribers List
      </h1>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">
          Subscribed Users
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search user..."
            value={search}
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
             onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            onClick={handleReset}
            style={{ background: "#9a2119", borderColor: "#9a2119" ,color:"white"}}  >
            <ReloadOutlined />
            Reset
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={Array.isArray(filteredData) ? [...filteredData].reverse() : []}
        pagination={{ pageSize: 5 }}
        rowClassName="hover:bg-gray-50"
        scroll={{ x: "max-content" }}
      />
    </div>
    </div>
  );
}


