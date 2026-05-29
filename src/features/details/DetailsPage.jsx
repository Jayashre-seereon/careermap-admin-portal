import { useEffect, useMemo, useState } from "react";
import { Form, Modal, message } from "antd";
import dayjs from "dayjs";
import DetailsTable from "./DetailsTable";
import DetailsForm from "./DetailsForm";
import { createDetails, deleteDetails, getDetails, updateDetails } from "../../api/details";
import { getCategoriesByStream } from "../../api/category";
import { getCareerPaths } from "../../api/careerpath";
import { getEntranceExams } from "../../api/entranceexam";
import { getInstitutes } from "../../api/institute";
import { getSecondaryCategoriesByCategory } from "../../api/secondaryCategory";
import { getStreams } from "../../api/stream";
import { getSubCategoriesBySecondCategory } from "../../api/subcategory";

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

const normalizeList = (response) => {
  const payload = response?.data?.data ?? response?.data;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    return [payload];
  }

  return [];
};

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : String(item || "").trim()))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeDateValue = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  if (typeof value?.format === "function") {
    return value.format("YYYY-MM-DD");
  }

  return "";
};

const toDayjsValue = (value) => {
  if (!value) {
    return null;
  }

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

const formatDateForPayload = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value?.format === "function") {
    return value.format("YYYY-MM-DD");
  }

  return normalizeDateValue(value);
};

const normalizeNullableString = (value) => (value == null ? "" : String(value));

const toFloatOrNull = (value) => {
  if (value === "" || value == null) {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : null;
};

const mapOption = (item = {}, labelKeys = []) => ({
  value: item.id,
  label: labelKeys.map((key) => item[key]).find(Boolean) || "",
  record: item,
});

const buildDefaultValues = (section = "salary-range") => {
  const common = {
    stream: undefined,
    category: undefined,
    secondCategory: undefined,
    subcategory: undefined,
  };

  if (section === "salary-range") {
    return { ...common, salaryRanges: [{ min: "", max: "" }] };
  }

  if (section === "job-scope") {
    return { ...common, names: [""] };
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
      exam: undefined,
      issue: null,
      last: null,
      url: "",
      about: "",
      eligibility: "",
      examDate: null,
      examMode: undefined,
      duration: "",
      subject: [],
      totalMark: "",
      frequency: "",
      examPattern: "",
      topInstitutes: [],
    };
  }

  return {
    ...common,
    name: undefined,
    logo: [],
    type: "",
    address: "",
    admission: "",
    about: "",
    coursesOffered: [],
    date: null,
    url: "",
    country: "",
    state: "",
    district: "",
    city: "",
    isTop: "No",
  };
};

const getCommonValues = (values = {}) => ({
  stream: values.stream,
  category: values.category,
  secondCategory: values.secondCategory,
  subcategory: values.subcategory,
});

const getSectionFieldKeys = (section) => {
  if (section === "salary-range") return ["salaryRanges"];
  if (section === "job-scope") return ["names"];
  if (section === "career-path") {
    return ["pathType", "graduation", "afterGraduation", "afterPostGraduation", "anyOther"];
  }
  if (section === "entrance-exam") {
    return [
      "exam",
      "issue",
      "last",
      "url",
      "about",
      "eligibility",
      "examDate",
      "examMode",
      "duration",
      "subject",
      "totalMark",
      "frequency",
      "examPattern",
      "topInstitutes",
    ];
  }
  return [
    "name",
    "logo",
    "type",
    "address",
    "admission",
    "about",
    "coursesOffered",
    "date",
    "url",
    "country",
    "state",
    "district",
    "city",
    "isTop",
  ];
};

const getSectionValues = (section, values = {}) =>
  getSectionFieldKeys(section).reduce((result, key) => {
    if (values[key] !== undefined) {
      result[key] = values[key];
    }
    return result;
  }, {});

const buildDrafts = (record = null) => {
  const commonValues = getCommonValues(record || {});
  const activeSections = record?.sections || [];

  return SECTION_OPTIONS.reduce((drafts, option) => {
    const baseValues = buildDefaultValues(option.value);
    const sectionValues = activeSections.includes(option.value) ? getSectionValues(option.value, record) : {};

    drafts[option.value] = {
      ...baseValues,
      ...commonValues,
      ...sectionValues,
    };

    if (option.value === "entrance-exam") {
      drafts[option.value].issue = toDayjsValue(drafts[option.value].issue);
      drafts[option.value].last = toDayjsValue(drafts[option.value].last);
      drafts[option.value].examDate = toDayjsValue(drafts[option.value].examDate);
    }

    if (option.value === "institution") {
      drafts[option.value].date = toDayjsValue(drafts[option.value].date);
    }

    return drafts;
  }, {});
};

const normalizeSectionValues = (section, values) => {
  const sectionValues = getSectionValues(section, values);

  if (section === "salary-range") {
    return {
      salaryRanges: (sectionValues.salaryRanges || [])
        .map((item) => ({
          minSalary: toFloatOrNull(item?.min),
          maxSalary: toFloatOrNull(item?.max),
        }))
        .filter((item) => item.minSalary !== null || item.maxSalary !== null),
    };
  }

  if (section === "job-scope") {
    return {
      jobScope: (sectionValues.names || []).filter(Boolean),
    };
  }

  if (section === "career-path") {
    return sectionValues;
  }

  if (section === "entrance-exam") {
    const {
      issue,
      last,
      examDate,
      examPattern,
      subject,
      topInstitutes,
      ...restSectionValues
    } = sectionValues;

    return {
      ...restSectionValues,
      issuedate: formatDateForPayload(issue),
      lastdate: formatDateForPayload(last),
      exam_date: formatDateForPayload(examDate),
      subject: normalizeStringArray(subject),
      top_institution: normalizeStringArray(topInstitutes),
      exam_pattern: examPattern || "",
    };
  }

  const { date, coursesOffered, ...restSectionValues } = sectionValues;

  return {
    ...restSectionValues,
    logo: restSectionValues.logo || [],
    coursesOffered: normalizeStringArray(coursesOffered),
    tentative_date: formatDateForPayload(date),
    isTop: restSectionValues.isTop || "No",
  };
};

const normalizeSalaryRanges = (value) => {
  const list = Array.isArray(value) ? value : [];

  return list
    .map((item) => ({
      min: normalizeNullableString(item?.minSalary ?? item?.min ?? ""),
      max: normalizeNullableString(item?.maxSalary ?? item?.max ?? ""),
    }))
    .filter((item) => item.min || item.max);
};

const normalizeJobScope = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : String(item || "").trim()))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getCareerPathSource = (record = {}) =>
  record.careerpath ||
  record.careerPath ||
  record.careerpaths?.[0] ||
  record.careerPaths?.[0] ||
  {};

const getEntranceExamSource = (record = {}) =>
  record.entranceexam ||
  record.entranceExam ||
  record.entranceexams?.[0] ||
  record.entranceExams?.[0] ||
  {};

const getInstitutionSource = (record = {}) =>
  record.institution || record.institutions?.[0] || record.institute || {};

const deriveSections = (record = {}) => {
  const sections = [];

  if (normalizeSalaryRanges(record.salaryRanges).length > 0) {
    sections.push("salary-range");
  }

  if (normalizeJobScope(record.jobScope ?? record.names).length > 0) {
    sections.push("job-scope");
  }

  if (getCareerPathSource(record)?.id || record.pathType || record.pathTypeName) {
    sections.push("career-path");
  }

  if (getEntranceExamSource(record)?.id || record.exam || record.examName) {
    sections.push("entrance-exam");
  }

  if (getInstitutionSource(record)?.id || record.name || record.institutionName) {
    sections.push("institution");
  }

  return sections.length > 0 ? sections : ["salary-range"];
};

const mapDetailsRecord = (record = {}) => {
  const careerPath = getCareerPathSource(record);
  const entranceExam = getEntranceExamSource(record);
  const institution = getInstitutionSource(record);
  const hasSubcategory = record.subcategoryId != null;

  return {
    id: record.id,
    source: "api",
    sections: deriveSections(record),
    stream: record.streamId ?? record.stream?.id ?? undefined,
    streamName: record.stream?.name || "",
    category: record.categoryId ?? record.category?.id ?? undefined,
    categoryName: record.category?.title || record.category?.name || "",
    secondCategory:
      record.secondcategoryId ??
      record.secondCategoryId ??
      record.secondcategory?.id ??
      record.secondCategory?.id ??
      undefined,
    secondCategoryName:
      record.secondcategory?.name ||
      record.secondcategory?.title ||
      record.secondCategory?.name ||
      record.secondCategory?.title ||
      "",
    subcategory: hasSubcategory ? record.subcategoryId ?? record.subcategory?.id ?? undefined : undefined,
    subcategoryName: hasSubcategory ? record.subcategory?.title || record.subcategory?.name || "" : "",
    salaryRanges: normalizeSalaryRanges(record.salaryRanges),
    names: normalizeJobScope(record.jobScope ?? record.names),
    pathType: record.pathType ?? record.pathTypeId ?? careerPath.id ?? careerPath.pathId ?? undefined,
    pathTypeName: record.pathTypeName || careerPath.pathName || careerPath.title || "",
    graduation: record.graduation ?? careerPath.graduation ?? "",
    afterGraduation:
      record.afterGraduation ??
      record.aftergraduation ??
      careerPath.aftergraduation ??
      careerPath.afterGraduation ??
      "",
    afterPostGraduation:
      record.afterPostGraduation ??
      record.afterpostgraduation ??
      careerPath.afterpostgraduation ??
      careerPath.afterPostGraduation ??
      "",
    anyOther: record.anyOther ?? record.anyother ?? careerPath.anyother ?? careerPath.anyOther ?? "",
    exam: record.exam ?? record.examId ?? entranceExam.id ?? undefined,
    examName: record.examName || entranceExam.examname || entranceExam.name || "",
    issue: normalizeDateValue(record.issue ?? entranceExam.issuedate),
    last: normalizeDateValue(record.last ?? entranceExam.lastdate),
    url: record.url ?? entranceExam.url ?? "",
    about: record.about ?? institution.about ?? entranceExam.about ?? "",
    eligibility: record.eligibility ?? entranceExam.eligibility ?? "",
    examDate: normalizeDateValue(
      record.examDate ?? record.exam_date ?? entranceExam.exam_date ?? entranceExam.examDate
    ),
    examMode: record.examMode ?? record.mode ?? entranceExam.mode ?? entranceExam.examMode ?? "",
    duration: record.duration ?? entranceExam.duration ?? "",
    subject: normalizeStringArray(record.subject ?? entranceExam.subject),
    totalMark: record.totalMark ?? record.total_mark ?? entranceExam.total_mark ?? entranceExam.totalMark ?? "",
    frequency: record.frequency ?? record.frequncy ?? entranceExam.frequncy ?? entranceExam.frequency ?? "",
    examPattern:
      record.examPattern ??
      record.exam_pattern ??
      entranceExam.exam_pattern ??
      entranceExam.examPattern ??
      "",
    topInstitutes: normalizeStringArray(
      record.topInstitutes ?? record.top_institution ?? entranceExam.top_institution ?? entranceExam.topInstitutes
    ),
    name: record.name ?? record.institutionId ?? institution.id ?? undefined,
    institutionName: record.institutionName || institution.name || "",
    logo: Array.isArray(record.logo) ? record.logo : [],
    type: record.type ?? institution.institute_type ?? "",
    address: record.address ?? institution.address ?? "",
    admission: record.admission ?? record.admission_process ?? institution.admission_process ?? "",
    coursesOffered: normalizeStringArray(
      record.coursesOffered ?? record.course_offered ?? institution.course_offered ?? institution.courses_offered
    ),
    date: normalizeDateValue(record.date ?? record.tentative_date ?? institution.tentative_date),
    country: record.country ?? record.countruy ?? institution.country ?? institution.countruy ?? "",
    state: record.state ?? institution.state ?? "",
    district: record.district ?? institution.district ?? "",
    city: record.city ?? institution.city ?? "",
    isTop: record.isTop ?? ((record.is_top ?? institution.is_top) ? "Yes" : "No"),
  };
};

const buildDetailsState = (records = []) => ({
  records: records.map(mapDetailsRecord),
});

const getRecordTitle = (record) => {
  if (record.sections?.includes("career-path")) {
    return record.pathTypeName || "-";
  }

  if (record.sections?.includes("entrance-exam")) {
    return record.examName || "-";
  }

  if (record.sections?.includes("institution")) {
    return record.institutionName || "-";
  }

  if (record.sections?.includes("job-scope")) {
    return record.names?.join(", ") || "-";
  }

  if (record.sections?.includes("salary-range")) {
    const firstRange = record.salaryRanges?.[0];
    if (firstRange) {
      return `${firstRange.min || "-"} - ${firstRange.max || "-"}`;
    }
  }

  return record.subcategoryName || record.subcategory || `Details #${record.id}`;
};

const getRecordDetailsLabel = (record) =>
  (record.sections || []).map((section) => SECTION_LABELS[section] || section).join(", ");

export default function DetailsPage() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedSections, setSelectedSections] = useState(["salary-range"]);
  const [draftsBySection, setDraftsBySection] = useState(() => buildDrafts());
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [secondaryCategoryOptions, setSecondaryCategoryOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [streamOptions, setStreamOptions] = useState([]);
  const [pathOptions, setPathOptions] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return data;
    }

    return data.filter((item) => JSON.stringify(item).toLowerCase().includes(query));
  }, [data, search]);

  const loadDetails = async () => {
    const response = await getDetails();
    const detailGroups = normalizeList(response);
    const nextState = buildDetailsState(detailGroups);

    setData(nextState.records);
  };

  const loadCategories = async (streamId) => {
    if (!streamId) {
      setCategoryOptions([]);
      setSecondaryCategoryOptions([]);
      setSubcategoryOptions([]);
      return;
    }

    const response = await getCategoriesByStream(streamId);
    const items = normalizeList(response);
    setCategoryOptions(items.map((item) => mapOption(item, ["title", "name"])));
  };

  const loadStreams = async () => {
    const response = await getStreams();
    const items = normalizeList(response);
    setStreamOptions(items.map((item) => mapOption(item, ["name", "title"])));
  };

  const loadPathOptions = async () => {
    const response = await getCareerPaths();
    const items = normalizeList(response);
    setPathOptions(
      items.map((item) => ({
        ...mapOption(item, ["pathName", "title", "name"]),
        categoryId: item.categoryId || item.category?.id || undefined,
        secondcategoryId:
          item.secondcategoryId || item.secondCategoryId || item.secondcategory?.id || item.secondCategory?.id || undefined,
        subcategoryId: item.subcategoryId || item.subcategory?.id || undefined,
      }))
    );
  };

  const loadExamOptions = async () => {
    const response = await getEntranceExams();
    const items = normalizeList(response);
    setExamOptions(items.map((item) => mapOption(item, ["examname", "name", "title"])));
  };

  const loadInstitutionOptions = async () => {
    const response = await getInstitutes();
    const items = normalizeList(response);
    setInstitutionOptions(items.map((item) => mapOption(item, ["name", "title"])));
  };

  const loadSecondaryCategories = async (categoryId) => {
    if (!categoryId) {
      setSecondaryCategoryOptions([]);
      setSubcategoryOptions([]);
      return;
    }

    const response = await getSecondaryCategoriesByCategory(categoryId);
    const items = normalizeList(response);
    const nextOptions = items.map((item) => ({
      ...mapOption(item, ["name", "title"]),
      categoryId: item.categoryId || item.category?.id || undefined,
    }));

    setSecondaryCategoryOptions(nextOptions);

    return nextOptions;
  };

  const loadSubCategories = async (secondCategoryId) => {
    if (!secondCategoryId) {
      setSubcategoryOptions([]);
      return;
    }

    const response = await getSubCategoriesBySecondCategory(secondCategoryId);
    const items = normalizeList(response);
    const nextOptions = items.map((item) => ({
      ...mapOption(item, ["title", "name"]),
      categoryId: item.categoryId || item.category?.id || undefined,
      secondcategoryId:
        item.secondcategoryId || item.secondCategoryId || item.secondcategory?.id || item.secondCategory?.id || undefined,
    }));

    setSubcategoryOptions(nextOptions);
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        setLoading(true);
        await Promise.all([
          loadDetails(),
          loadStreams(),
          loadPathOptions(),
          loadExamOptions(),
          loadInstitutionOptions(),
        ]);
      } catch (error) {
        if (mounted) {
          messageApi.error(error.response?.data?.message || error.message || "Failed to load details.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [messageApi]);

  const isViewMode = mode === "view";

  const getLabel = (items, id, fallback = "") => {
    if (fallback) {
      return fallback;
    }

    return items.find((item) => item.value === id)?.label || "";
  };

  const buildSubmissionPayload = (values) => {
    const commonValues = getCommonValues(values);
    const payload = {
      streamId: commonValues.stream ?? null,
      categoryId: commonValues.category ?? null,
    };

    if (commonValues.secondCategory) {
      payload.secondcategoryId = commonValues.secondCategory;
    }

    if (commonValues.subcategory) {
      payload.subcategoryId = commonValues.subcategory;
    }

    if (selectedSections.includes("salary-range")) {
      payload.salaryRanges = (values.salaryRanges || [])
        .map((item) => ({
          minSalary: toFloatOrNull(item?.min),
          maxSalary: toFloatOrNull(item?.max),
        }))
        .filter((item) => item.minSalary !== null || item.maxSalary !== null);
    }

    if (selectedSections.includes("job-scope")) {
      payload.jobScope = normalizeStringArray(values.names);
    }

    if (selectedSections.includes("career-path") && values.pathType) {
      payload.careerpathIds = [values.pathType];
    }

    if (selectedSections.includes("entrance-exam") && values.exam) {
      payload.entranceexamIds = [values.exam];
    }

    if (selectedSections.includes("institution") && values.name) {
      payload.institutionIds = [values.name];
    }

    return payload;
  };

  const handleStreamChange = async (streamId) => {
    form.setFieldsValue({
      category: undefined,
      secondCategory: undefined,
      subcategory: undefined,
      pathType: undefined,
    });
    setCategoryOptions([]);
    setSecondaryCategoryOptions([]);
    setSubcategoryOptions([]);
    await loadCategories(streamId);
  };

  const handleCategoryChange = async (categoryId) => {
    await loadSecondaryCategories(categoryId);
  };

  const handleSecondCategoryChange = async (secondCategoryId) => {
    await loadSubCategories(secondCategoryId);
  };

  const prepareFormForRecord = async (record) => {
    await loadCategories(record.stream);
    await loadSecondaryCategories(record.category);
    await loadSubCategories(record.secondCategory);
    return record;
  };

  function handleOpenAdd() {
    setMode("add");
    setSelectedRecord(null);
    setSelectedSections(["salary-range"]);
    setDraftsBySection(buildDrafts());
    form.resetFields();
    form.setFieldsValue(buildDefaultValues("salary-range"));
    setOpen(true);
  }

  async function handleOpenView(record) {
    const nextRecord = await prepareFormForRecord(record);
    const drafts = buildDrafts(nextRecord);
    setMode("view");
    setSelectedRecord(nextRecord);
    setSelectedSections(nextRecord.sections || ["salary-range"]);
    setDraftsBySection(drafts);
    form.resetFields();
    form.setFieldsValue(
      (nextRecord.sections || ["salary-range"]).reduce(
        (acc, section) => ({ ...acc, ...drafts[section] }),
        getCommonValues(nextRecord)
      )
    );
    setOpen(true);
  }

  async function handleOpenEdit(record) {
    const nextRecord = await prepareFormForRecord(record);
    const drafts = buildDrafts(nextRecord);
    setMode("edit");
    setSelectedRecord(nextRecord);
    setSelectedSections(nextRecord.sections || ["salary-range"]);
    setDraftsBySection(drafts);
    form.resetFields();
    form.setFieldsValue(
      (nextRecord.sections || ["salary-range"]).reduce(
        (acc, section) => ({ ...acc, ...drafts[section] }),
        getCommonValues(nextRecord)
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
    deleteDetails(record.id)
      .then(async () => {
        messageApi.success("Details item deleted successfully.");
        await loadDetails();
      })
      .catch((error) => {
        messageApi.error(error.response?.data?.message || error.message || "Failed to delete details item.");
      });
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
      nextSections.reduce((acc, section) => ({ ...acc, ...nextDrafts[section] }), commonValues)
    );
  }

  async function handleSubmit(values) {
    const payload = buildSubmissionPayload(values);

    if (mode === "edit" && selectedRecord) {
      try {
        await updateDetails(selectedRecord.id, payload);
        messageApi.success("Details updated successfully.");
        await loadDetails();
        handleClose();
      } catch (error) {
        messageApi.error(error.response?.data?.message || error.message || "Failed to update details.");
      }
      return;
    }

    try {
      await createDetails(payload);
      messageApi.success("Details created successfully.");
      await loadDetails();
      handleClose();
    } catch (error) {
      messageApi.error(error.response?.data?.message || error.message || "Failed to create details.");
    }
  }

  return (
    <div className="space-y-5">
      {contextHolder}

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
        sectionLabels={SECTION_LABELS}
        loading={loading}
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
            streamOptions,
            categoryOptions,
            secondaryCategoryOptions,
            subcategoryOptions,
            pathOptions,
            examOptions,
            institutionOptions,
          }}
          normalizeUpload={(event) => (Array.isArray(event) ? event : event?.fileList || [])}
          onStreamChange={handleStreamChange}
          onCategoryChange={handleCategoryChange}
          onSecondCategoryChange={handleSecondCategoryChange}
        />
      </Modal>
    </div>
  );
}
