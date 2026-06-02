import { Table, Input ,Button} from "antd";
import { EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function getStatusClasses(status) {
  if (status === "Pending") return "bg-yellow-100 text-yellow-800";
  if (status === "Answered") return "bg-blue-100 text-blue-800";
  return "bg-green-100 text-green-800";
}

function getPriorityClasses(priority) {
  if (priority === "High") return "bg-red-100 text-red-700";
  if (priority === "Medium") return "bg-orange-100 text-orange-700";
  return "bg-slate-100 text-slate-700";
}

export default function SupportTicketsTable({ title, data }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return data.filter(
      (item) =>
        item.subject.toLowerCase().includes(normalizedSearch) ||
        item.openedBy.toLowerCase().includes(normalizedSearch)
    );
  }, [data, search]);

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">Subject</span>,
      dataIndex: "subject",
      width: 320,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Opened By</span>,
      dataIndex: "openedBy",
      width: 180,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Priority</span>,
      dataIndex: "priority",
      render: (priority) => (
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPriorityClasses(priority)}`}>
          {priority}
        </span>
      ),
      width: 130,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Status</span>,
      dataIndex: "status",
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusClasses(status)}`}>
          {status}
        </span>
      ),
      width: 130,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      width: 110,
      render: (_, record) => (
        <Button
          onClick={() => navigate(`/support_tickets/${record.id}`)}
          className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md" 
            >
               
          <EyeOutlined />
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">{title}</h2>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search ticket..."
            value={search}
            prefix={<SearchOutlined className="text-[#9a2119]" />}
           className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
              onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            onClick={() => setSearch("")}
            style={{ background: "#9a2119", borderColor: "#9a2119" ,color:"white"}}  >
          
            <ReloadOutlined />
            Reset
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(filteredData) ? [...filteredData].reverse() : []}
        pagination={{ pageSize: 5 }}
        rowClassName="hover:bg-gray-50"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

