import { Button, Checkbox, Form, Input, Select, message, } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useQuill } from "react-quilljs";
import Quill from "quill";
import { createJobId, getJobs, getTodayLabel, saveJobs } from "./jobStore";
import "quill/dist/quill.snow.css";
import { validationRules } from "../../utils/formValidation";
import StatusSwitch from "../../components/ui/StatusSwitch";
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

export default function JobForm({ mode = "add", jobId, onSuccess, onCancel }) {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const isView = mode === "view";
  const jobs = getJobs();
  const job = useMemo(
    () => jobs.find((item) => item.id === jobId) || null,
    [jobId, jobs]
  );
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

  const initialValues = job
    ? {
        name: job.name,
        totalVacancy: job.totalVacancy,
        salary: job.salary,
        jobType: job.jobType,
        active: job.status === "Enabled",
      }
    : {
        totalVacancy: 0,
        salary: "0",
        active: true,
      };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(initialValues);
    setDescription(job?.description || "");
  }, [form, job?.id, mode]);

  useEffect(() => {
    if (!quill) {
      return;
    }

    quill.root.innerHTML = description || "";
    quill.enable(!isView);

    const handleTextChange = () => {
      setDescription(quill.root.innerHTML);
    };

    quill.on("text-change", handleTextChange);

    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [isView, quill]);

  useEffect(() => {
    if (!quill) {
      return;
    }

    if (quill.root.innerHTML !== (description || "")) {
      quill.root.innerHTML = description || "";
    }

    quill.enable(!isView);
  }, [description, isView, quill]);

  const handleSubmit = async () => {
    if (isView) {
      onCancel?.();
      return;
    }

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
    onSuccess?.(nextJobs);
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Form.Item
            name="name"
            label={<span className="text-[16px] font-semibold">Name</span>}
            rules={[
              validationRules.required("Name"),
              validationRules.charactersOnly("Name"),
            ]}
          >
            <Input className="h-12" disabled={isView} />
          </Form.Item>

          <Form.Item
            name="totalVacancy"
            label={
              <span className="text-[16px] font-semibold">Total Vacancy</span>
            }
            rules={[validationRules.numbersOnly("TotalVacancy")]}
          >
            <Input className="h-12 w-full" disabled={isView} />
          </Form.Item>

          <Form.Item
            name="salary"
            label={
              <span className="text-[16px] font-semibold">Salary Range</span>
            }
            rules={[{ required: true, message: "Salary range is required" }]}
          >
            <Input className="h-12" disabled={isView} />
          </Form.Item>

          <Form.Item
            name="jobType"
            label={<span className="text-[16px] font-semibold">Job Type</span>}
            rules={[{ required: true, message: "Job type is required" }]}
          >
            <Select
              options={jobTypeOptions}
              className="job-type-select"
              placeholder="Select job type"
              disabled={isView}
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

       
  <Form.Item
          name="status"
          label="Status"
          valuePropName="checked"
          className="md:col-span-2 lg:col-span-1"
        >
          <StatusSwitch
            disabled={isView}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
        </Form.Item>
        <div className="flex gap-3">
          {!isView && (
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: "#9a2119", borderColor: "#9a2119" }}
              className="h-10 px-7"
            >
              Submit
            </Button>
          )}
          <Button
            htmlType="button"
            onClick={onCancel}
           
            className="h-10 px-7"
          >
            {isView ? "Back" : "Cancel"}
          </Button>
        </div>
      </Form>

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
