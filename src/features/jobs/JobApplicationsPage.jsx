import { useMemo, useState } from "react";
import { Button, DatePicker, Input, message, Select, Table } from "antd";
import { EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { APPLICATION_STATUSES, getJobApplications, saveJobApplications, sortNewestFirstByDate } from "./jobStore";
import useTablePagination from "../../utils/useTablePagination";

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState(getJobApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [dateRange, setDateRange] = useState(null);

  const getStatus = (application) => application.status || "New";

  const jobOptions = useMemo(
    () => [...new Set(applications.map((application) => application.job).filter(Boolean))],
    [applications]
  );

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    const from = dateRange?.[0] ? dateRange[0].startOf("day").valueOf() : null;
    const to = dateRange?.[1] ? dateRange[1].endOf("day").valueOf() : null;

    const matched = applications.filter((application) => {
      if (statusFilter !== "all" && (application.status || "New") !== statusFilter) return false;
      if (jobFilter !== "all" && application.job !== jobFilter) return false;
      if (from !== null || to !== null) {
        const applied = Date.parse(application.appliedOn);
        if (Number.isNaN(applied)) return false;
        if (from !== null && applied < from) return false;
        if (to !== null && applied > to) return false;
      }
      return (
        !query ||
        String(application.job ?? "").toLowerCase().includes(query) ||
        String(application.name ?? "").toLowerCase().includes(query) ||
        String(application.email ?? "").toLowerCase().includes(query)
      );
    });
    return sortNewestFirstByDate(matched, "appliedOn");
  }, [applications, search, statusFilter, jobFilter, dateRange]);

  const { tableProps } = useTablePagination(filteredApplications.length);

  const handleStatusChange = (record, status) => {
    const updated = applications.map((application) =>
      application.id === record.id ? { ...application, status } : application
    );
    setApplications(updated);
    saveJobApplications(updated);
    message.success("Application status updated.");
  };

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
      title: <span className="text-[#9a2119] font-semibold">Status</span>,
      width: 150,
      render: (_, record) => (
        <Select
          size="small"
          value={getStatus(record)}
          onChange={(value) => handleStatusChange(record, value)}
          options={APPLICATION_STATUSES.map((status) => ({ value: status, label: status }))}
          style={{ width: 120 }}
        />
      ),
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
        <Button onClick={() => openCv(record.cvUrl)}  className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"   >
          
          <EyeOutlined />
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Job Application Management
      </h1>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Job Application
          </h2>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <Input
              placeholder="Search..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
             className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
               onChange={(e) => setSearch(e.target.value)}
            />

            <Select
              value={jobFilter}
              onChange={setJobFilter}
              className="w-full sm:w-48"
              options={[{ value: "all", label: "All Jobs" }, ...jobOptions.map((job) => ({ value: job, label: job }))]}
            />

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full sm:w-36"
              options={[{ value: "all", label: "All Status" }, ...APPLICATION_STATUSES.map((status) => ({ value: status, label: status }))]}
            />

            <DatePicker.RangePicker value={dateRange} onChange={setDateRange} className="w-full sm:w-64" />

            <Button
              onClick={() => { setSearch(""); setStatusFilter("all"); setJobFilter("all"); setDateRange(null); }}
              style={{ background: "#9a2119", borderColor: "#9a2119" ,color:"white"}}  >
              <ReloadOutlined />
              Reset
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredApplications}
          rowKey={(record) => record.id ?? record.key}
          {...tableProps}
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

