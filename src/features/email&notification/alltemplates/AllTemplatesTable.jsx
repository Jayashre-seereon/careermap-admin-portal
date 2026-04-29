import { Table } from "antd";
import { EditOutlined } from "@ant-design/icons";

export default function AllTemplatesTable({ data, onEdit }) {
  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">Name</span>,
      dataIndex: "name",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Subject</span>,
      dataIndex: "subject",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      render: (_, record) => (
        <button
          onClick={() => onEdit(record)}
          className="w-9 h-9 flex items-center justify-center rounded-md
                     bg-[#9a2119] text-white hover:bg-[#c0392b]"
        >
          <EditOutlined />
        </button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 6 }}
      rowKey="key"
      rowClassName="hover:bg-gray-50"
    />
  );
}
