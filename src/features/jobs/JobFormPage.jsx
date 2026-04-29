import { Button, Checkbox, Form, Input, InputNumber, Select, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuill } from "react-quilljs";
import Quill from "quill";
import { createJobId, getJobs, getTodayLabel, saveJobs } from "./jobStore";
import "quill/dist/quill.snow.css";

const icons = Quill.import("ui/icons");

icons["undo"] = `
  <svg viewBox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="6 10 2 6 6 2"></polygon>
    <path class="ql-stroke" d="M2,6h9a5,5 0 1,1 0,10h-1"></path>
  </svg>
`;

icons["redo"] = `
  <svg viewBox="0 0 18 18">
    <polygon class="ql-fill ql-stroke" points="12 10 16 6 12 2"></polygon>
    <path class="ql-stroke" d="M16,6H7a5,5 0 1,0 0,10h1"></path>
  </svg>
`;

const jobTypeOptions = [
  { label: "Full Time", value: "Full Time" },
  { label: "Part Time", value: "Part Time" },
  { label: "Remote", value: "Remote" },
  { label: "Internship", value: "Internship" },
];

export default function JobFormPage({ mode }) {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: {
        container: [
          ["undo", "redo"],
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          undo: function () {
            this.quill.history.undo();
          },
          redo: function () {
            this.quill.history.redo();
          },
        },
      },
      history: {
        delay: 1000,
        maxStack: 50,
        userOnly: true,
      },
    },
  });

  const jobs = getJobs();
  const job = useMemo(
    () => jobs.find((item) => item.id === jobId) || null,
    [jobId, jobs]
  );

  const initialValues = job
    ? {
        name: job.name,
        totalVacancy: job.totalVacancy,
        salary: job.salary,
        jobType: job.jobType,
        description: job.description,
        active: job.status === "Enabled",
      }
    : {
        totalVacancy: 0,
        salary: "0",
        active: true,
      };

  useEffect(() => {
    const nextDescription = initialValues.description || "";
    setDescription(nextDescription);
  }, [job?.id, mode]);

  useEffect(() => {
    if (!quill) {
      return;
    }

    quill.root.innerHTML = description || "";

    const handleTextChange = () => {
      setDescription(quill.root.innerHTML);
    };

    quill.on("text-change", handleTextChange);

    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [quill]);

  useEffect(() => {
    if (!quill) {
      return;
    }

    if (quill.root.innerHTML !== (description || "")) {
      quill.root.innerHTML = description || "";
    }
  }, [description, quill]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const generatedId = job?.id || createJobId();
    const updatedJob = {
      key: job?.key || generatedId,
      id: generatedId,
      name: values.name,
      totalVacancy: values.totalVacancy,
      salary: values.salary,
      jobType: values.jobType,
      status: values.active ? "Enabled" : "Disabled",
      created: job?.created || getTodayLabel(),
      description,
    };

    const nextJobs =
      mode === "edit" && job
        ? jobs.map((item) => (item.id === job.id ? updatedJob : item))
        : [...jobs, updatedJob];

    saveJobs(nextJobs);
    message.success(
      mode === "edit" ? "Job updated successfully." : "Job added successfully."
    );
    navigate("/jobs");
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-5 py-4">
        <h1 className="text-2xl font-semibold text-[#1f2a44]">
          {mode === "edit" ? "Edit Job" : "Add Job"}
        </h1>
      </div>

      <div className="p-5">
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          key={job?.id || mode}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Form.Item
              name="name"
              label={<span className="text-[16px] font-semibold">Name <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input className="h-12" />
            </Form.Item>

            <Form.Item
              name="totalVacancy"
              label={<span className="text-[16px] font-semibold">Total Vacancy <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: "Total vacancy is required" }]}
            >
              <InputNumber min={0} className="h-12 w-full" />
            </Form.Item>

            <Form.Item
              name="salary"
              label={<span className="text-[16px] font-semibold">Salary Range <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: "Salary range is required" }]}
            >
              <Input className="h-12" />
            </Form.Item>

            <Form.Item
              name="jobType"
              label={<span className="text-[16px] font-semibold">Job Type <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: "Job type is required" }]}
            >
              <Select
                options={jobTypeOptions}
                className="job-type-select"
                placeholder="Select job type"
              />
            </Form.Item>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-[16px] font-semibold text-black">
              Description
            </label>
            <div className="overflow-hidden rounded-md border border-gray-300">
              <div ref={quillRef} style={{ height: "220px" }} />
            </div>
          </div>

          <Form.Item name="active" valuePropName="checked" className="mb-6">
            <Checkbox>Active</Checkbox>
          </Form.Item>

          <div className="flex gap-3">
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{ background: "#14b8b8", borderColor: "#14b8b8" }}
              className="h-10 px-7"
            >
              Save
            </Button>
            <Button
              onClick={() => navigate("/jobs")}
              style={{ background: "#1f2957", borderColor: "#1f2957", color: "white" }}
              className="h-10 px-7"
            >
              Back
            </Button>
          </div>
        </Form>
      </div>

      <style jsx>{`
        :global(.job-type-select .ant-select-selector) {
          height: 48px !important;
          display: flex !important;
          align-items: center !important;
        }

        :global(.job-type-select .ant-select-selection-item) {
          line-height: 46px !important;
        }
      `}</style>
    </div>
  );
}
