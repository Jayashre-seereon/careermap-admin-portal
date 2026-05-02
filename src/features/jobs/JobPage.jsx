import { useMemo, useState } from "react";
import { Input, message, Modal, Popconfirm, Table, Tag, Button } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getJobs, saveJobs } from "./jobStore";
import JobForm from "./JobForm";

export default function JobPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(getJobs);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [activeJobId, setActiveJobId] = useState(null);

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

  const openJobModal = (mode, jobId = null) => {
    setModalMode(mode);
    setActiveJobId(jobId);
  };

  const closeJobModal = () => {
    setModalMode(null);
    setActiveJobId(null);
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
            type="button"
            onClick={() => openJobModal("view", record.id)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
            aria-label={`View ${record.name}`}
          >
            <EyeOutlined />
          </button>
          <button
            type="button"
            onClick={() => openJobModal("edit", record.id)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
            aria-label={`Edit ${record.name}`}
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
            <Button danger icon={<DeleteOutlined />} />
              
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-w-0">
      <h1 className="mb-6 text-xl font-semibold text-[#9a2119]">
        Job Management
      </h1>

      <div className="responsive-page-card">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-lg font-semibold text-[#9a2119]">Job</h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <Input
              placeholder="Search..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="h-10 w-full border-[#9a2119] sm:w-64"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="button" onClick={() => setSearch("")} className="btn-main w-full sm:w-auto">
              <ReloadOutlined /> Reset
            </button>

            <button type="button" onClick={() => openJobModal("add")} className="btn-main w-full sm:w-auto">
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

      <Modal
        open={Boolean(modalMode)}
        footer={null}
        onCancel={closeJobModal}
        width={1100}
        style={{ top: 16 }}
        destroyOnHidden
        title={
          <span className="text-[#1f2a44] font-semibold">
            {modalMode === "view"
              ? "View Job"
              : modalMode === "edit"
                ? "Edit Job"
                : "Add Job"}
          </span>
        }
      >
        {modalMode && (
          <JobForm
            mode={modalMode}
            jobId={activeJobId}
            onCancel={closeJobModal}
            onSuccess={(nextJobs) => {
              setJobs(nextJobs);
              closeJobModal();
            }}
          />
        )}
      </Modal>

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
