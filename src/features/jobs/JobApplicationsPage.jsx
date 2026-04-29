import { useMemo, useState } from "react";
import { Button, Input, message, Table } from "antd";
import { EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { getJobApplications } from "./jobStore";

export default function JobApplicationsPage() {
  const [applications] = useState(getJobApplications);
  const [search, setSearch] = useState("");

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return applications;
    }

    return applications.filter(
      (application) =>
        application.job.toLowerCase().includes(query) ||
        application.name.toLowerCase().includes(query) ||
        application.email.toLowerCase().includes(query)
    );
  }, [applications, search]);

  const openCv = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
    message.success("CV opened in browser.");
  };

  const downloadCv = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.download = "candidate-cv.pdf";
    anchor.click();
    message.success("CV download started.");
  };

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">Job</span>,
      dataIndex: "job",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Name</span>,
      dataIndex: "name",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Email</span>,
      dataIndex: "email",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Phone</span>,
      dataIndex: "phone",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Applied On</span>,
      dataIndex: "appliedOn",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Note</span>,
      dataIndex: "note",
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">CV</span>,
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => downloadCv(record.cvUrl)}
          style={{ background: "#9a2119", borderColor: "#9a2119" }}
        >
          Download
        </Button>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      render: (_, record) => (
        <button onClick={() => openCv(record.cvUrl)} className="btn-view">
          <EyeOutlined />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Job Application Management
      </h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Job Application
          </h2>

          <div className="flex gap-3">
            <Input
              placeholder="Search..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="w-64 h-10 border-[#9a2119]"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button onClick={() => setSearch("")} className="btn-main">
              <ReloadOutlined /> Reset
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredApplications}
          pagination={{ pageSize: 5 }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: true }}
        />
      </div>

      <style jsx>{`
        .btn-main {
          background: #9a2119;
          color: white;
          padding: 0 16px;
          height: 40px;
          border-radius: 8px;
        }
        .btn-view {
          width: 36px;
          height: 36px;
          border: 1px solid #9a2119;
          color: #9a2119;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
