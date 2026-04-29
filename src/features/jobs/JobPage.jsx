import { useMemo, useState } from "react";
import { Input, message, Popconfirm, Table, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getJobs, saveJobs } from "./jobStore";

export default function JobPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(getJobs);
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return jobs;
    }

    return jobs.filter(
      (job) =>
        job.name.toLowerCase().includes(query) ||
        job.jobType.toLowerCase().includes(query) ||
        job.salary.toLowerCase().includes(query)
    );
  }, [jobs, search]);

  const handleDelete = (jobId) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    setJobs(updatedJobs);
    saveJobs(updatedJobs);
    message.success("Job deleted successfully.");
  };

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">Name</span>,
      dataIndex: "name",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Total Vacancy</span>,
      dataIndex: "totalVacancy",
      width: 130,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Salary</span>,
      dataIndex: "salary",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Job Type</span>,
      dataIndex: "jobType",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Status</span>,
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Enabled" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Created</span>,
      dataIndex: "created",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => navigate(`/jobs/${record.id}/edit`)}
            className="btn-view"
          >
            <EditOutlined />
          </button>
          <Popconfirm
            title="Delete job?"
            description="Are you sure you want to delete this job?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <button className="btn-delete">
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Job Management
      </h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#9a2119]">Job</h2>

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

            <button onClick={() => navigate("/jobs/add")} className="btn-main">
              + Add Job
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredJobs}
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
        .btn-delete {
          width: 36px;
          height: 36px;
          border: 1px solid red;
          color: red;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
