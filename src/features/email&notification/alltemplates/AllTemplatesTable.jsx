import { Table } from "antd";
import { EditOutlined } from "@ant-design/icons";

const initialData = [
  {
    key: "1",
    name: "Balance - Added",
    subject: "Your Account has been Credited",
  },
  {
    key: "2",
    name: "Balance - Subtracted",
    subject: "Your Account has been Debited",
  },
  {
    key: "3",
    name: "Default Template",
    subject: "{{subject}}",
  },
  {
    key: "4",
    name: "Deposit - Automated - Successful",
    subject: "Deposit Completed Successfully",
  },
  {
    key: "5",
    name: "Deposit - Manual - Approved",
    subject: "Your Deposit is Approved",
  },
  {
    key: "6",
    name: "Deposit - Manual - Rejected",
    subject: "Your Deposit Request is Rejected",
  },
];

export default function AllTemplatesTable({ onEdit }) {
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
      dataSource={initialData}
      pagination={{ pageSize: 6 }}
      rowClassName="hover:bg-gray-50"
    />
  );
}