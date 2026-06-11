import { Table, Input ,Button} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  UnlockOutlined,
  
} from "@ant-design/icons";
import{Tag,Popconfirm,message} from "antd";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { unbanUser } from "../../../api/allusers";


export default function Banned() {
  const [search, setSearch] = useState("");
  
  const { users, setSelectedUser, fetchUsers } = useOutletContext();
const filteredData = users
  .filter((u) => u.status === "banned") // ✅ small change
  .filter((u) =>
    u.user.toLowerCase().includes(search.toLowerCase())
  );

  const handleUnban = async (id) => {
  if (!id) {
    console.log("ID missing ❌");
    return;
  }

  try {
    await unbanUser(id);
    message.success("User unbanned");

    await fetchUsers(); // ✅ REFRESH
  } catch (err) {
    message.error("Unban failed");
  }
};

  const handleReset = () => setSearch("");

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">User</span>,
      dataIndex: "user",
     
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Email</span>,
      dataIndex: "email",
      
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Mobile</span>,
      dataIndex: "mobile",
     
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Status</span>,
      dataIndex: "status",
      render: (status) => {
        const isActive = status?.toLowerCase() === "active";

        return (
          <Tag color={isActive ? "green" : "red"} className="font-medium">
            {status?.charAt(0).toUpperCase() + status?.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Unban User</span>,
   render: (_, record) => (
  <div className="flex gap-2">    
  <Popconfirm
  title="Are you sure to unban this user?"
  onConfirm={() => handleUnban(record.id)}
>
  <Button danger  icon={<UnlockOutlined />}>
 
</Button>
</Popconfirm>

  </div>
) 
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
    render: (_, record) => (
  <div className="flex gap-2">
   <Button
            onClick={() => setSelectedUser(record)} // ✅ pass full user object
            className="w-8 h-8 flex items-center justify-center rounded-md 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]
                      "
          >
            <EyeOutlined />
          </Button>
  </div>
),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">
          Banned Users
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
  );
}



