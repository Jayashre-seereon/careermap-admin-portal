import { Table,Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

export default function AllTemplatesTable({ data, onEdit }) {
  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">Name</span>,
      dataIndex: "name",
      width: 240,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Subject</span>,
      dataIndex: "subject",
      width: 420,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      width: 110,
      render: (_, record) => (
        <Button
          onClick={() => onEdit(record)}
           className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md" 
           >
          <EditOutlined />
        </Button>
      ),
    },
  ];

  return (
      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? [...data].reverse() : []}
      pagination={{ pageSize: 6 }}
      rowKey="key"
      rowClassName="hover:bg-gray-50"
      scroll={{ x: "max-content" }}
    />
  );
}


