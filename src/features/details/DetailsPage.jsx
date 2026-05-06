import { useMemo, useState } from "react";
import { Form, Modal } from "antd";
import DetailsTable from "./DetailsTable";
import DetailsForm from "./DetailsForm";

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
const PATH_TYPE_OPTIONS = ["Path 1", "Path 2"];

const INITIAL_RECORDS = [
  {
    id: "salary-1",
    sections: ["salary-range"],
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
    sections: ["job-scope"],
    stream: "Science",
    category: "Medical",
    secondCategory: "ALLIED & PARA MEDICAL COURSES/DEGREES",
    subcategory: "RADIOLOGY",
    names: ["Diagnostic Radiologist", "MRI Technician"],
  },
  {
    id: "careerpath-1",
    sections: ["career-path"],
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
    sections: ["entrance-exam"],
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
    sections: ["institution"],
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

function getSectionFieldKeys(section) {
  if (section === "salary-range") {
    return ["salaryRanges"];
  }

  if (section === "job-scope") {
    return ["names"];
  }

  if (section === "career-path") {
    return ["pathType", "graduation", "afterGraduation", "afterPostGraduation", "anyOther"];
  }

  if (section === "entrance-exam") {
    return ["exam", "issue", "last", "url"];
  }

  return ["name", "logo", "type", "address", "admission", "date", "url", "country", "state", "district", "isTop"];
}

function getSectionValues(section, values = {}) {
  return getSectionFieldKeys(section).reduce((result, key) => {
    if (values[key] !== undefined) {
      result[key] = values[key];
    }
    return result;
  }, {});
}

function buildDrafts(record = null) {
  const commonValues = getCommonValues(record || {});
  const activeSections = record?.sections || [];

  return SECTION_OPTIONS.reduce((drafts, option) => {
    drafts[option.value] = {
      ...getDefaultValues(option.value),
      ...commonValues,
      ...(activeSections.includes(option.value) ? getSectionValues(option.value, record) : {}),
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

function getSearchText(record) {
  return JSON.stringify(record).toLowerCase();
}

function getRecordTitle(record) {
  if (record.sections?.includes("institution")) {
    return record.name || "-";
  }

  if (record.sections?.includes("entrance-exam")) {
    return record.exam || "-";
  }

  if (record.sections?.includes("job-scope")) {
    return record.names?.join(", ") || "-";
  }

  return record.subcategory || record.pathType || "-";
}

function getRecordDetailsLabel(record) {
  return (record.sections || []).map((section) => SECTION_LABELS[section] || section).join(", ");
}

function summarizeRecord(record) {
  const parts = [];

  if (record.salaryRanges?.length) {
    parts.push(record.salaryRanges.map((item) => `${item.min} - ${item.max}`).join(", "));
  }

  if (record.names?.length) {
    parts.push(record.names.join(", "));
  }

  if (record.sections?.includes("career-path")) {
    parts.push(
      [record.pathType, record.graduation, record.afterGraduation, record.afterPostGraduation, record.anyOther]
        .filter(Boolean)
        .join(" | ")
    );
  }

  if (record.sections?.includes("entrance-exam")) {
    parts.push([record.exam, record.issue, record.last, record.url].filter(Boolean).join(" | "));
  }

  if (record.sections?.includes("institution")) {
    parts.push(
      [record.name, record.type, record.address, record.admission, record.date, record.country, record.state]
        .filter(Boolean)
        .join(" | ")
    );
  }

  return parts.filter(Boolean).join(" | ");
}

function normalizeSectionValues(section, values) {
  const sectionValues = getSectionValues(section, values);

  if (section === "salary-range") {
    return {
      salaryRanges: (sectionValues.salaryRanges || []).filter((item) => item?.min || item?.max),
    };
  }

  if (section === "job-scope") {
    return {
      names: (sectionValues.names || []).filter(Boolean),
    };
  }

  if (section === "institution") {
    return {
      ...sectionValues,
      logo: sectionValues.logo || [],
      isTop: sectionValues.isTop || "No",
    };
  }

  return sectionValues;
}

export default function DetailsPage() {
  const [form] = Form.useForm();
  const [data, setData] = useState(INITIAL_RECORDS);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedSections, setSelectedSections] = useState(["salary-range"]);
  const [draftsBySection, setDraftsBySection] = useState(() => buildDrafts());

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return data;
    }
    return data.filter((item) => getSearchText(item).includes(query));
  }, [data, search]);

  const isViewMode = mode === "view";

  function handleOpenAdd() {
    setMode("add");
    setSelectedRecord(null);
    setSelectedSections(["salary-range"]);
    setDraftsBySection(buildDrafts());
    form.resetFields();
    form.setFieldsValue({
      ...getDefaultValues("salary-range"),
    });
    setOpen(true);
  }

  function handleOpenView(record) {
    const drafts = buildDrafts(record);
    setMode("view");
    setSelectedRecord(record);
    setSelectedSections(record.sections || ["salary-range"]);
    setDraftsBySection(drafts);
    form.resetFields();
    form.setFieldsValue(
      (record.sections || ["salary-range"]).reduce(
        (acc, section) => ({ ...acc, ...drafts[section] }),
        getCommonValues(record)
      )
    );
    setOpen(true);
  }

  function handleOpenEdit(record) {
    const drafts = buildDrafts(record);
    setMode("edit");
    setSelectedRecord(record);
    setSelectedSections(record.sections || ["salary-range"]);
    setDraftsBySection(drafts);
    form.resetFields();
    form.setFieldsValue(
      (record.sections || ["salary-range"]).reduce(
        (acc, section) => ({ ...acc, ...drafts[section] }),
        getCommonValues(record)
      )
    );
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setMode("add");
    setSelectedRecord(null);
    setSelectedSections(["salary-range"]);
    setDraftsBySection(buildDrafts());
    form.resetFields();
  }

  function handleDelete(record) {
    setData((prev) => prev.filter((item) => item.id !== record.id));
  }

  function handleSectionChange(checkedValues) {
    const nextSections = checkedValues.length > 0 ? checkedValues : ["salary-range"];
    const currentValues = form.getFieldsValue(true);
    const commonValues = getCommonValues(currentValues);
    const nextDrafts = {
      ...draftsBySection,
      ...nextSections.reduce((acc, section) => {
        acc[section] = {
          ...draftsBySection[section],
          ...commonValues,
          ...getSectionValues(section, currentValues),
        };
        return acc;
      }, {}),
    };

    setSelectedSections(nextSections);
    setDraftsBySection(nextDrafts);
    form.setFieldsValue(
      nextSections.reduce(
        (acc, section) => ({ ...acc, ...nextDrafts[section] }),
        commonValues
      )
    );
  }

  function handleSubmit(values) {
    const commonValues = getCommonValues(values);
    const selectedValues = selectedSections.reduce(
      (acc, section) => ({ ...acc, ...normalizeSectionValues(section, values) }),
      {}
    );

    const nextRecord = {
      ...commonValues,
      sections: selectedSections,
      ...selectedValues,
    };

    if (mode === "edit" && selectedRecord) {
      setData((prev) =>
        prev.map((item) => (item.id === selectedRecord.id ? { ...nextRecord, id: selectedRecord.id } : item))
      );
    } else {
      setData((prev) => [...prev, { ...nextRecord, id: `${selectedSections.join("-")}-${Date.now()}` }]);
    }

    handleClose();
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#9a2119]">Details Management</h2>

      <DetailsTable
        data={filteredData}
        search={search}
        onSearch={setSearch}
        onAdd={handleOpenAdd}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        getRecordTitle={getRecordTitle}
        getRecordDetailsLabel={getRecordDetailsLabel}
        summarizeRecord={summarizeRecord}
        sectionLabels={SECTION_LABELS}
      />

      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        width={1000}
        destroyOnClose
        title={
          mode === "view"
            ? "View Details"
            : mode === "edit"
              ? "Edit Details"
              : "Add Details"
        }
      >
        <DetailsForm
          form={form}
          initialValues={selectedRecord}
          selectedSections={selectedSections}
          sectionOptions={SECTION_OPTIONS}
          viewMode={isViewMode}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          onSectionChange={handleSectionChange}
          sectionLabels={SECTION_LABELS}
          options={{
            streamOptions: STREAM_OPTIONS,
            categoryOptions: CATEGORY_OPTIONS,
            secondCategoryOptions: SECOND_CATEGORY_OPTIONS,
            subcategoryOptions: SUBCATEGORY_OPTIONS,
            pathTypeOptions: PATH_TYPE_OPTIONS,
          }}
          normalizeUpload={normalizeUpload}
        />
      </Modal>
    </div>
  );
}
