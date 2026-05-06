import { useMemo, useState } from "react";
import {
  Button,
  ConfigProvider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tabs,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import StatusSwitch from "../../components/ui/StatusSwitch";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

const SECTION_OPTIONS = [
  { label: "Salary Range", value: "salary-range" },
  { label: "Job Scope", value: "job-scope" },
  { label: "Career Path", value: "career-path" },
  { label: "Entrance Exam", value: "entrance-exam" },
  { label: "Institution", value: "institution" },
];

const SECTION_LABELS = {
  "salary-range": "Salary Range",
  "job-scope": "Job Scope",
  "career-path": "Career Path",
  "entrance-exam": "Entrance Exam",
  institution: "Institution",
};

const STREAM_OPTIONS = ["Science", "Commerce", "Arts"];
const CATEGORY_OPTIONS = [
  "Medical",
  "Engineering",
  "Commercial Pilot",
  "Merchant Navy",
  "Railways",
];
const SECOND_CATEGORY_OPTIONS = [
  "GENERAL COURSES/DEGREES",
  "ALLIED & PARA MEDICAL COURSES/DEGREES",
  "Architecture",
];
const SUBCATEGORY_OPTIONS = ["MBBS", "BDS", "B.Tech", "N/A", "RADIOLOGY"];
const MODULE_OPTIONS = ["Career Library"];
const PATH_TYPE_OPTIONS = ["Path 1", "Path 2"];

const INITIAL_RECORDS = [
  {
    id: "salary-1",
    section: "salary-range",
    stream: "Science",
    category: "Medical",
    secondCategory: "GENERAL COURSES/DEGREES",
    subcategory: "MBBS",
    salaryRanges: [
      { min: "30000 / month", max: "70000 / month" },
      { min: "7 LPA", max: "15 LPA" },
    ],
  },
  {
    id: "jobscope-1",
    section: "job-scope",
    stream: "Science",
    category: "Medical",
    secondCategory: "ALLIED & PARA MEDICAL COURSES/DEGREES",
    subcategory: "RADIOLOGY",
    names: ["Diagnostic Radiologist", "MRI Technician"],
  },
  {
    id: "careerpath-1",
    section: "career-path",
    module: "Career Library",
    stream: "Science",
    category: "Medical",
    secondCategory: "GENERAL COURSES/DEGREES",
    subcategory: "MBBS",
    pathType: "Path 1",
    graduation: "MBBS",
    afterGraduation: "MD / MS",
    afterPostGraduation: "DM / MCh",
    anyOther: "Clinical fellowship",
  },
  {
    id: "exam-1",
    section: "entrance-exam",
    module: "Career Library",
    stream: "Science",
    category: "Medical",
    secondCategory: "GENERAL COURSES/DEGREES",
    subcategory: "MBBS",
    exam: "NEET UG",
    issue: "2026-02-01",
    last: "2026-03-15",
    url: "https://example.com/neet-ug",
  },
  {
    id: "institution-1",
    section: "institution",
    stream: "Science",
    category: "Medical",
    secondCategory: "GENERAL COURSES/DEGREES",
    subcategory: "MBBS",
    name: "JIPMER",
    logo: [],
    type: "Govt.",
    address: "Jipmer Campus, Puducherry",
    admission: "NEET-UG, NEET-PG",
    date: "2026-07-01",
    url: "https://jipmer.edu.in/",
    country: "India",
    state: "Puducherry",
    district: "Pondicherry",
    isTop: "Yes",
  },
];

function getDefaultValues(section = "salary-range") {
  const common = {
    section,
    stream: undefined,
    category: undefined,
    secondCategory: undefined,
    subcategory: undefined,
  };

  if (section === "salary-range") {
    return {
      ...common,
      salaryRanges: [{ min: "", max: "" }],
    };
  }

  if (section === "job-scope") {
    return {
      ...common,
      names: [""],
    };
  }

  if (section === "career-path") {
    return {
      ...common,
      module: undefined,
      pathType: undefined,
      graduation: "",
      afterGraduation: "",
      afterPostGraduation: "",
      anyOther: "",
    };
  }

  if (section === "entrance-exam") {
    return {
      ...common,
      module: undefined,
      exam: "",
      issue: "",
      last: "",
      url: "",
    };
  }

  return {
    ...common,
    name: "",
    logo: [],
    type: undefined,
    address: "",
    admission: "",
    date: "",
    url: "",
    country: "",
    state: "",
    district: "",
    isTop: "No",
  };
}

function getCommonValues(values = {}) {
  return {
    stream: values.stream,
    category: values.category,
    secondCategory: values.secondCategory,
    subcategory: values.subcategory,
  };
}

function buildDrafts(record = null) {
  const commonValues = getCommonValues(record || {});
  return SECTION_OPTIONS.reduce((drafts, option) => {
    drafts[option.value] = {
      ...getDefaultValues(option.value),
      ...commonValues,
      ...(record?.section === option.value ? record : {}),
    };
    return drafts;
  }, {});
}

function normalizeUpload(event) {
  if (Array.isArray(event)) {
    return event;
  }

  return event?.fileList || [];
}

function renderOptions(options) {
  return options.map((option) => (
    <Option key={option} value={option}>
      {option}
    </Option>
  ));
}

function getSearchText(record) {
  return JSON.stringify(record).toLowerCase();
}

function getRecordTitle(record) {
  if (record.section === "institution") {
    return record.name || "-";
  }

  if (record.section === "entrance-exam") {
    return record.exam || "-";
  }

  if (record.section === "job-scope") {
    return record.names?.join(", ") || "-";
  }

  if (record.section === "salary-range") {
    return record.subcategory || "-";
  }

  return record.module || record.pathType || record.subcategory || "-";
}

function getRecordDetailsLabel(record) {
  if (record.section === "salary-range") {
    return "Salary Ranges";
  }

  if (record.section === "job-scope") {
    return "Job Scope Names";
  }

  if (record.section === "career-path") {
    return "Career Path";
  }

  if (record.section === "entrance-exam") {
    return "Exam Details";
  }

  return "Institution Details";
}

function summarizeRecord(record) {
  if (record.section === "salary-range") {
    return (record.salaryRanges || [])
      .map((item) => `${item.min} - ${item.max}`)
      .join(", ");
  }

  if (record.section === "job-scope") {
    return (record.names || []).join(", ");
  }

  if (record.section === "career-path") {
    return [
      record.module,
      record.pathType,
      record.graduation,
      record.afterGraduation,
      record.afterPostGraduation,
      record.anyOther,
    ]
      .filter(Boolean)
      .join(" | ");
  }

  if (record.section === "entrance-exam") {
    return [record.module, record.exam, record.issue, record.last, record.url]
      .filter(Boolean)
      .join(" | ");
  }

  return [
    record.name,
    record.type,
    record.address,
    record.admission,
    record.date,
    record.url,
    record.country,
    record.state,
    record.district,
    record.isTop,
  ]
    .filter(Boolean)
    .join(" | ");
}

function normalizeRecord(section, values) {
  const baseRecord = {
    ...values,
    section,
  };

  if (section === "salary-range") {
    return {
      ...baseRecord,
      salaryRanges: (values.salaryRanges || []).filter(
        (item) => item?.min || item?.max
      ),
    };
  }

  if (section === "job-scope") {
    return {
      ...baseRecord,
      names: (values.names || []).filter(Boolean),
    };
  }

  if (section === "institution") {
    return {
      ...baseRecord,
      logo: values.logo || [],
      isTop: values.isTop || "No",
    };
  }

  return baseRecord;
}

function renderCommonFields(viewMode) {
  return (
    <>
      <div className="md:col-span-2">
        <h3 className="mb-1 text-base font-semibold text-[#9a2119]">Common Details</h3>
        <p className="text-sm text-slate-500">
          These fields appear first for every section.
        </p>
      </div>

      <Form.Item name="stream" label="Stream" rules={[validationRules.required("Stream")]}>
        <Select disabled={viewMode} placeholder="Select Stream">
          {renderOptions(STREAM_OPTIONS)}
        </Select>
      </Form.Item>

      <Form.Item
        name="category"
        label="Category"
        rules={[validationRules.required("Category")]}
      >
        <Select disabled={viewMode} placeholder="Select Category">
          {renderOptions(CATEGORY_OPTIONS)}
        </Select>
      </Form.Item>

      <Form.Item
        name="secondCategory"
        label="Secondary Category"
           >
        <Select disabled={viewMode} placeholder="Select secondary category">
          {renderOptions(SECOND_CATEGORY_OPTIONS)}
        </Select>
      </Form.Item>

      <Form.Item
        name="subcategory"
        label="Subcategory"
       
      >
        <Select disabled={viewMode} placeholder="Select Subcategory">
          {renderOptions(SUBCATEGORY_OPTIONS)}
        </Select>
      </Form.Item>
    </>
  );
}

function renderSectionSpecificFields(section, viewMode) {
  if (section === "salary-range") {
    return (
      <>
        <div className="md:col-span-2 text-base font-semibold text-[#9a2119]">
          Salary Range Details
        </div>

        <Form.List name="salaryRanges">
          {(fields, { add, remove }) => (
            <>
              <div className="md:col-span-2 grid grid-cols-[1fr_1fr_32px] gap-2 text-sm text-slate-500">
                <div>Minimum Salary</div>
                <div>Maximum Salary</div>
                <div />
              </div>

              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="md:col-span-2 grid grid-cols-[1fr_1fr_32px] gap-2">
                  <Form.Item
                    {...restField}
                    name={[name, "min"]}
                    rules={[validationRules.required("Minimum salary")]}
                  >
                    <Input disabled={viewMode} placeholder="Minimum salary" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "max"]}
                    rules={[validationRules.required("Maximum salary")]}
                  >
                    <Input disabled={viewMode} placeholder="Maximum salary" />
                  </Form.Item>

                  <div className="pt-[6px]">
                    {!viewMode && fields.length > 1 && (
                      <Button
                        danger
                        type="text"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      />
                    )}
                  </div>
                </div>
              ))}

              {!viewMode && (
                <Form.Item className="md:col-span-2">
                  <Button type="dashed" block onClick={() => add({ min: "", max: "" })}>
                    Add Salary Range
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
      </>
    );
  }

  if (section === "job-scope") {
    return (
      <>
        <div className="md:col-span-2 text-base font-semibold text-[#9a2119]">
          Job Scope Details
        </div>

        <Form.List name="names">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="md:col-span-2 grid grid-cols-[1fr_32px] gap-2">
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[validationRules.required("Name")]}
                  >
                    <Input disabled={viewMode} placeholder="Enter name" />
                  </Form.Item>

                  <div className="pt-[6px]">
                    {!viewMode && fields.length > 1 && (
                      <Button
                        danger
                        type="text"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      />
                    )}
                  </div>
                </div>
              ))}

              {!viewMode && (
                <Form.Item className="md:col-span-2">
                  <Button type="dashed" block onClick={() => add("")}>
                    Add Job Scope Name
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
      </>
    );
  }

  if (section === "career-path") {
    return (
      <>
        <div className="md:col-span-2 text-base font-semibold text-[#9a2119]">
          Career Path Details
        </div>

        <Form.Item name="pathType" label="Select Path">
          <Select disabled={viewMode} placeholder="Select path">
            {renderOptions(PATH_TYPE_OPTIONS)}
          </Select>
        </Form.Item>

        <Form.Item name="graduation" label="Graduation">
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item name="afterGraduation" label="After Graduation">
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item name="afterPostGraduation" label="After Post Graduation">
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item name="anyOther" label="Any Other">
          <Input disabled={viewMode} />
        </Form.Item>
      </>
    );
  }

  if (section === "entrance-exam") {
    return (
      <>
        <div className="md:col-span-2 text-base font-semibold text-[#9a2119]">
          Entrance Exam Details
        </div>

        <Form.Item
          name="exam"
          label="Exam Name"
          rules={[validationRules.required("Exam name")]}
        >
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item name="issue" label="Issue Date">
          <Input disabled={viewMode} type="date" />
        </Form.Item>

        <Form.Item name="last" label="Last Date">
          <Input disabled={viewMode} type="date" />
        </Form.Item>

        <Form.Item
          name="url"
          label="URL"
          className="md:col-span-2"
          rules={[validationRules.url("URL")]}
        >
          <Input disabled={viewMode} />
        </Form.Item>
      </>
    );
  }

  return (
    <>
      <div className="md:col-span-2 text-base font-semibold text-[#9a2119]">
        Institution Details
      </div>

      <Form.Item
        name="name"
        label="Institution Name"
        rules={[validationRules.required("Institution name")]}
      >
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item
        name="logo"
        label="Logo"
        valuePropName="fileList"
        getValueFromEvent={normalizeUpload}
      >
        <Upload beforeUpload={() => false} disabled={viewMode} maxCount={1}>
          <Button icon={<UploadOutlined />} disabled={viewMode}>
            Upload Logo
          </Button>
        </Upload>
      </Form.Item>

      <Form.Item name="type" label="Institution Type">
        <Select disabled={viewMode} placeholder="Select institution type">
          <Option value="Govt.">Govt.</Option>
          <Option value="Pvt.">Pvt.</Option>
        </Select>
      </Form.Item>

      <Form.Item name="address" label="Address" className="md:col-span-2">
        <Input.TextArea rows={2} disabled={viewMode} />
      </Form.Item>

      <Form.Item name="admission" label="Admission Process">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="date" label="Tentative Date">
        <Input type="date" disabled={viewMode} />
      </Form.Item>

      <Form.Item name="url" label="URL" rules={[validationRules.url("URL")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="country" label="Country">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="state" label="State">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="district" label="District">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item
        name="isTop"
        label="Is Top Institution"
        valuePropName="checked"
        getValueProps={(value) => ({ checked: value === "Yes" })}
        normalize={(checked) => (checked ? "Yes" : "No")}
      >
        <StatusSwitch disabled={viewMode} checkedChildren="Yes" unCheckedChildren="No" />
      </Form.Item>
    </>
  );
}

export default function DetailsPage() {
  const [form] = Form.useForm();
  const [data, setData] = useState(INITIAL_RECORDS);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formSection, setFormSection] = useState("salary-range");
  const [draftsBySection, setDraftsBySection] = useState(() => buildDrafts());

  const isViewMode = modalMode === "view";

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return data;
    }
    return data.filter((item) => getSearchText(item).includes(query));
  }, [data, search]);

  function syncDraftsFromCurrentValues(nextSection) {
    const currentValues = form.getFieldsValue(true);
    const commonValues = getCommonValues(currentValues);
    const nextDrafts = {
      ...draftsBySection,
      [formSection]: {
        ...draftsBySection[formSection],
        ...currentValues,
      },
    };

    SECTION_OPTIONS.forEach((option) => {
      nextDrafts[option.value] = {
        ...nextDrafts[option.value],
        ...commonValues,
      };
    });

    setDraftsBySection(nextDrafts);
    setFormSection(nextSection);
    form.resetFields();
    form.setFieldsValue(nextDrafts[nextSection]);
  }

  function openModal(mode, record = null) {
    const section = record?.section || "salary-range";
    const drafts = buildDrafts(record);

    setModalMode(mode);
    setCurrentRecord(record);
    setFormSection(section);
    setDraftsBySection(drafts);
    form.resetFields();
    form.setFieldsValue(drafts[section]);
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
    setCurrentRecord(null);
    setModalMode("add");
    setFormSection("salary-range");
    setDraftsBySection(buildDrafts());
    form.resetFields();
  }

  function handleDelete(record) {
    setData((prev) => prev.filter((item) => item.id !== record.id));
  }

  function handleSectionChange(nextSection) {
    syncDraftsFromCurrentValues(nextSection);
  }

  async function handleSubmit() {
    const values = await form.validateFields();
    const normalized = normalizeRecord(formSection, values);

    if (currentRecord) {
      setData((prev) =>
        prev.map((item) =>
          item.id === currentRecord.id
            ? { ...normalized, id: currentRecord.id }
            : item
        )
      );
    } else {
      setData((prev) => [
        ...prev,
        { ...normalized, id: `${formSection}-${Date.now()}` },
      ]);
    }

    handleClose();
  }

  const columns = [
    {
      title: "SL",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Section",
      dataIndex: "section",
      width: 150,
      render: (value) => SECTION_LABELS[value] || value,
    },
    {
      title: "Title / Name",
      width: 220,
      render: (_, record) => getRecordTitle(record),
    },
    {
      title: "Stream",
      dataIndex: "stream",
      width: 120,
      render: (value) => value || "-",
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 140,
      render: (value) => value || "-",
    },
    {
      title: "Secondary Category",
      dataIndex: "secondCategory",
      width: 190,
      render: (value) => value || "-",
    },
    {
      title: "Subcategory",
      dataIndex: "subcategory",
      width: 150,
      render: (value) => value || "-",
    },
    {
      title: "Details Type",
      width: 160,
      render: (_, record) => getRecordDetailsLabel(record),
    },
    {
      title: "Summary",
      width: 340,
      render: (_, record) => summarizeRecord(record) || "-",
    },
    {
      title: "Action",
      width: 170,
      fixed: "right",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119]"
            icon={<EyeOutlined />}
            onClick={() => openModal("view", record)}
          />
          <Button
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119]"
            icon={<EditOutlined />}
            onClick={() => openModal("edit", record)}
          />
          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this details item?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <h1 className="mb-4 text-xl font-semibold text-[#9a2119]">Details Management</h1>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Details</h2>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search details..."
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full sm:w-72"
            />

            <Button
              onClick={() => setSearch("")}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              <ReloadOutlined />
              Reset
            </Button>

            <Button
              onClick={() => openModal("add")}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              <PlusOutlined />
              Add Details
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        open={modalOpen}
        onCancel={handleClose}
        footer={null}
        width={1000}
        destroyOnClose
        title={
          isViewMode
            ? `View ${SECTION_LABELS[formSection]}`
            : currentRecord
              ? `Edit ${SECTION_LABELS[formSection]}`
              : "Add Details"
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          validateTrigger={["onChange", "onBlur"]}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {renderCommonFields(isViewMode)}

          <div className="md:col-span-2 mt-1 rounded-xl border border-[#ead4d2] bg-[#fffaf9] p-4">
            <p className="mb-3 text-sm font-medium text-[#9a2119]">Select Section</p>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#9a2119",
                },
              }}
            >
              <Tabs
                activeKey={formSection}
                onChange={handleSectionChange}
                items={SECTION_OPTIONS.map((item) => ({
                  key: item.value,
                  label: item.label,
                }))}
              />
            </ConfigProvider>
          </div>

          {renderSectionSpecificFields(formSection, isViewMode)}

          <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
            <Button onClick={handleClose}>
              {isViewMode ? "Back" : "Cancel"}
            </Button>

            {!isViewMode && (
              <Button
                htmlType="submit"
                style={{ background: "#9a2119", borderColor: "#9a2119" }}
                className="text-white"
              >
                {currentRecord ? "Update Details" : "Create Details"}
              </Button>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
}
