import { useEffect, useMemo, useState } from "react";
import { Form, Modal, message } from "antd";
import DetailsTable from "./DetailsTable";
import DetailsForm from "./DetailsForm";
import { createDetails, deleteDetails, getDetails, updateDetails,getDetailsById } from "../../api/details";
import { getCategoriesByStream } from "../../api/category";
import { getCareerPaths } from "../../api/careerpath";
import { getEntranceExams } from "../../api/entranceexam";
import { getInstitutes } from "../../api/institute";
import { getSecondaryCategoriesByCategory } from "../../api/secondaryCategory";
import { getStreams } from "../../api/stream";
import { getSubCategoriesBySecondCategory } from "../../api/subcategory";
import {
  formatDateDisplay,
  formatDateForPayload as formatDateForApi,
  parseDateValue,
} from "../../utils/date";

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
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") return [payload];
  return [];
};

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) return value.map((item) => (typeof item === "string" ? item.trim() : String(item || "").trim())).filter(Boolean);
  if (typeof value === "string") return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
  return [];
};

const normalizeDateValue = (value) => formatDateDisplay(value);
const toDayjsValue = (value) => parseDateValue(value);
const normalizeNullableString = (value) => (value == null ? "" : String(value));

const normalizeSalaryCurrency = (value) => {
  const text = normalizeNullableString(value).trim();
  if (/usd/i.test(text)) return "USD";
  if (/inr|rs/i.test(text)) return "INR";
  return "INR";
};

const normalizeSalaryAmount = (value) => {
  const text = normalizeNullableString(value).trim();
  if (!text) return "";
  return text.replace(/,/g, "");
};

const splitSalaryValue = (value, fallbackCurrency = "INR") => {
  const text = normalizeNullableString(value).trim();
  if (!text) return { currency: normalizeSalaryCurrency(fallbackCurrency), amount: "" };
  const currencyMatch = text.match(/^(inr|usd|rs)\s*/i);
  const currency = normalizeSalaryCurrency(currencyMatch?.[1] || fallbackCurrency);
  const amount = normalizeSalaryAmount(text.replace(/^(inr|usd|rs)\s*/i, ""));
  return { currency, amount };
};

const toFloatOrNull = (value) => {
  const normalizedValue = normalizeSalaryAmount(value);
  if (!normalizedValue) return null;
  const parsed = Number.parseFloat(normalizedValue);
  return Number.isFinite(parsed) ? parsed : null;
};

const mapOption = (item = {}, labelKeys = []) => ({
  value: item.id,
  label: labelKeys.map((key) => item[key]).find(Boolean) || "",
  record: item,
});

// ─── Default values per section ───────────────────────────────────────────────
const buildDefaultValues = (section = "salary-range") => {
  const common = { stream: undefined, category: undefined, secondCategory: undefined, subcategory: undefined ,description: "",};

  if (section === "salary-range") return { ...common, salaryRanges: [{ currency: "INR", min: "", max: "" }] };
  if (section === "job-scope") return { ...common, names: [""] };
  if (section === "career-path") {
    return { ...common, careerPaths: [{ pathType: undefined, graduation: "", afterGraduation: "", afterPostGraduation: "", anyOther: "" }] };
  }
  if (section === "entrance-exam") {
    return {
      ...common,
      entranceExams: [{ exam: undefined, issue: null, last: null, url: "", about: "", eligibility: "", examDate: null, examMode: undefined, duration: "", subject: [], totalMark: "", frequency: "", examPattern: "", topInstitutes: [] }],
    };
  }
  return {
    ...common,
    institutions: [{ name: undefined, logo: [], type: "", address: "", admission: "", about: "", coursesOffered: [], date: null, url: "", country: "", state: "", city: "", district: "", isTop: "No" }],
  };
};

const getCommonValues = (values = {}) => ({
  stream: values.stream,
  category: values.category,
  secondCategory: values.secondCategory,
  subcategory: values.subcategory,
  description: values.description,
});

const getSectionFieldKeys = (section) => {
  if (section === "salary-range") return ["salaryRanges"];
  if (section === "job-scope") return ["names"];
  if (section === "career-path") return ["careerPaths"];
  if (section === "entrance-exam") return ["entranceExams"];
  return ["institutions"];
};

const getSectionValues = (section, values = {}) =>
  getSectionFieldKeys(section).reduce((result, key) => {
    const source = values ?? {};
    if (source[key] !== undefined) result[key] = source[key];
    return result;
  }, {});

const buildDrafts = (record = null) => {
  const commonValues = getCommonValues(record || {});
  const activeSections = deriveSections(record || {});

  return SECTION_OPTIONS.reduce((drafts, option) => {
    const baseValues = buildDefaultValues(option.value);
    const sectionValues = activeSections.includes(option.value) ? getSectionValues(option.value, record) : {};
    drafts[option.value] = { ...baseValues, ...commonValues, ...sectionValues };

    // Normalize dates inside arrays
    if (option.value === "entrance-exam") {
      drafts[option.value].entranceExams = (drafts[option.value].entranceExams || []).map((e) => ({
        ...e,
        issue: toDayjsValue(e?.issue),
        last: toDayjsValue(e?.last),
        examDate: toDayjsValue(e?.examDate),
      }));
    }
    if (option.value === "institution") {
      drafts[option.value].institutions = (drafts[option.value].institutions || []).map((inst) => ({
        ...inst,
        date: toDayjsValue(inst?.date),
      }));
    }

    return drafts;
  }, {});
};

// ─── Normalization helpers ────────────────────────────────────────────────────
const normalizeSalaryRanges = (value) => {
  const list = Array.isArray(value) ? value : [];
  return list
    .map((item) => {
      const currencySource = item?.currency ?? item?.unit ?? item?.salaryUnit;
      const minParsed = splitSalaryValue(item?.minSalary ?? item?.min ?? "", currencySource);
      const maxParsed = splitSalaryValue(item?.maxSalary ?? item?.max ?? "", currencySource);
      return {
        currency: minParsed.currency || maxParsed.currency || normalizeSalaryCurrency(currencySource),
        min: minParsed.amount,
        max: maxParsed.amount,
      };
    })
    .filter((item) => item.min || item.max);
};

const normalizeJobScope = (value) => {
  if (Array.isArray(value)) return value.map((item) => (typeof item === "string" ? item.trim() : String(item || "").trim())).filter(Boolean);
  if (typeof value === "string") return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
  return [];
};

// ─── Source extractors ────────────────────────────────────────────────────────
const getCareerPathSources = (record = {}) => {
  if (Array.isArray(record.careerpaths))
    return record.careerpaths;

  if (Array.isArray(record.careerPaths))
    return record.careerPaths;

  const legacy =
    record.careerpath ||
    record.careerPath ||
    record.careerpaths?.[0] ||
    record.careerPaths?.[0] ||
    {};

  if (legacy?.id || record.pathType) {
    return [
      {
        pathType:
          record.pathType ??
          record.pathTypeId ??
          legacy.id ??
          legacy.pathId,
        graduation: record.graduation ?? legacy.graduation ?? "",
        afterGraduation:
          record.afterGraduation ??
          record.aftergraduation ??
          legacy.aftergraduation ??
          "",
        afterPostGraduation:
          record.afterPostGraduation ??
          record.afterpostgraduation ??
          legacy.afterpostgraduation ??
          "",
        anyOther:
          record.anyOther ??
          record.anyother ??
          legacy.anyother ??
          "",
        pathTypeName:
          record.pathTypeName ||
          legacy.pathName ||
          legacy.title ||
          "",
      },
    ];
  }

  return [];
};

const getEntranceExamSources = (record = {}) => {
  if (Array.isArray(record.entranceexams))
    return record.entranceexams;

  if (Array.isArray(record.entranceExams))
    return record.entranceExams;

  const legacy =
    record.entranceexam ||
    record.entranceExam ||
    record.entranceexams?.[0] ||
    record.entranceExams?.[0] ||
    {};

  if (legacy?.id || record.exam) {
    return [legacy];
  }

  return [];
};
const getInstitutionSources = (record = {}) => {
  if (Array.isArray(record.institutions) && record.institutions.length > 0) return record.institutions;
  const legacy = record.institution || record.institute || {};
  if (legacy?.id || record.name) return [legacy?.id ? legacy : record];
  return [];
};

const deriveSections = (record = {}) => {
  const sections = [];
  if (normalizeSalaryRanges(record.salaryRanges).length > 0) sections.push("salary-range");
  if (normalizeJobScope(record.jobScope ?? record.names).length > 0) sections.push("job-scope");
  if (getCareerPathSources(record).length > 0) sections.push("career-path");
  if (getEntranceExamSources(record).length > 0) sections.push("entrance-exam");
  if (getInstitutionSources(record).length > 0) sections.push("institution");
  return sections.length > 0 ? sections : ["salary-range"];
};

const mapInstitution = (inst = {}) => ({
  name: inst.institutionId ?? inst.id ?? inst.name ?? undefined,
  institutionName: inst.institutionName || inst.institution?.name || inst.name || "",
  logo: Array.isArray(inst.logo) ? inst.logo : [],
  type: inst.type ?? inst.institute_type ?? "",
  address: inst.address ?? "",
  admission: inst.admission ?? inst.admission_process ?? "",
  about: inst.about ?? "",
  coursesOffered: normalizeStringArray(inst.coursesOffered ?? inst.course_offered ?? inst.courses_offered),
  date: normalizeDateValue(inst.date ?? inst.tentative_date),
  url: inst.url ?? "",
  country: inst.country ?? inst.countruy ?? "",
  state: inst.state ?? "",
  district: inst.district ?? "",
  city: inst.city ?? "",
  isTop: inst.isTop ?? (inst.is_top ? "Yes" : "No"),
});

const mapDetailsRecord = (record = {}) => {
  const careerPathSources = getCareerPathSources(record);
  const examSources = getEntranceExamSources(record);
  const institutionSources = getInstitutionSources(record);

  return {
    id: record.id,
    source: "api",
    sections: deriveSections(record),
    stream: record.streamId ?? record.stream?.id ?? undefined,
    streamName: record.stream?.name || "",
    category: record.categoryId ?? record.category?.id ?? undefined,
    categoryName: record.category?.title || record.category?.name || "",
    secondCategory: record.secondcategoryId ?? record.secondCategoryId ?? record.secondcategory?.id ?? record.secondCategory?.id ?? undefined,
    secondCategoryName: record.secondcategory?.name || record.secondcategory?.title || record.secondCategory?.name || record.secondCategory?.title || "",
    subcategory: record.subcategoryId != null ? record.subcategoryId ?? record.subcategory?.id ?? undefined : undefined,
    description: record.description ?? "",
    subcategoryName: record.subcategoryId != null ? record.subcategory?.title || record.subcategory?.name || "" : "",
    salaryRanges: normalizeSalaryRanges(record.salaryRanges),
    names: normalizeJobScope(record.jobScope ?? record.names),
    // Career Paths array
    careerPaths: careerPathSources.length > 0
      ? careerPathSources.map((cp) => ({
          pathType: cp.pathType ?? cp.pathTypeId ?? cp.id ?? cp.pathId ?? undefined,
          pathTypeName: cp.pathTypeName || cp.pathName || cp.title || "",
          graduation: cp.graduation ?? "",
          afterGraduation: cp.afterGraduation ?? cp.aftergraduation ?? "",
          afterPostGraduation: cp.afterPostGraduation ?? cp.afterpostgraduation ?? "",
          anyOther: cp.anyOther ?? cp.anyother ?? "",
        }))
      : [{ pathType: undefined, graduation: "", afterGraduation: "", afterPostGraduation: "", anyOther: "" }],
    // Entrance Exams array
    entranceExams: examSources.length > 0
      ? examSources.map((ex) => ({
          exam: ex.exam ?? ex.examId ?? ex.id ?? undefined,
          examName: ex.examName || ex.examname || ex.name || "",
          issue: ex.issue,
          last: ex.last,
          url: ex.url ?? "",
          about: ex.about ?? "",
          eligibility: ex.eligibility ?? "",
          examDate: ex.examDate,
          examMode: ex.examMode ?? ex.mode ?? "",
          duration: ex.duration ?? "",
          subject: Array.isArray(ex.subject) ? ex.subject : normalizeStringArray(ex.subject),
          totalMark: ex.totalMark ?? ex.total_mark ?? "",
          frequency: ex.frequency ?? ex.frequncy ?? "",
          examPattern: ex.examPattern ?? ex.exam_pattern ?? "",
          topInstitutes: Array.isArray(ex.topInstitutes) ? ex.topInstitutes : normalizeStringArray(ex.topInstitutes ?? ex.top_institution),
        }))
      : [{ exam: undefined, issue: null, last: null, url: "", about: "", eligibility: "", examDate: null, examMode: undefined, duration: "", subject: [], totalMark: "", frequency: "", examPattern: "", topInstitutes: [] }],
    // Institutions array
    institutions: institutionSources.length > 0
      ? institutionSources.map(mapInstitution)
      : [{ name: undefined, logo: [], type: "", address: "", admission: "", about: "", coursesOffered: [], date: null, url: "", country: "", state: "", city: "", district: "", isTop: "No" }],
    // Legacy single fields for title display
    pathTypeName: careerPathSources[0]?.pathTypeName || careerPathSources[0]?.pathName || "",
    examName: examSources[0]?.examName || examSources[0]?.examname || "",
    institutionName: institutionSources[0]?.institutionName || institutionSources[0]?.name || "",
  };
};

const buildDetailsState = (records = []) => ({ records: records.map(mapDetailsRecord) });

const getRecordTitle = (record) => {
  if (record.sections?.includes("career-path")) {
    const names = (record.careerPaths || []).map((cp) => cp.pathTypeName).filter(Boolean);
    return names.join(", ") || record.pathTypeName || "-";
  }
  if (record.sections?.includes("entrance-exam")) {
    const names = (record.entranceExams || []).map((ex) => ex.examName).filter(Boolean);
    return names.join(", ") || record.examName || "-";
  }
  if (record.sections?.includes("institution")) {
    const names = (record.institutions || []).map((i) => i.institutionName || i.name).filter(Boolean);
    return names.join(", ") || record.institutionName || "-";
  }
  if (record.sections?.includes("job-scope")) return record.names?.join(", ") || "-";
  if (record.sections?.includes("salary-range")) {
    const firstRange = record.salaryRanges?.[0];
    if (firstRange) {
      const currency = firstRange.currency || "INR";
      return `${currency} ${firstRange.min || "-"} - ${firstRange.max || "-"}`;
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
    if (!query) return data;
    return data.filter((item) => JSON.stringify(item).toLowerCase().includes(query));
  }, [data, search]);

  const loadDetails = async () => {
    const response = await getDetails();
    const detailGroups = normalizeList(response);
    setData(buildDetailsState(detailGroups).records);
  };

  const loadCategories = async (streamId) => {
    if (!streamId) { setCategoryOptions([]); setSecondaryCategoryOptions([]); setSubcategoryOptions([]); return; }
    const response = await getCategoriesByStream(streamId);
    setCategoryOptions(normalizeList(response).map((item) => mapOption(item, ["title", "name"])));
  };

  const loadStreams = async () => {
    const response = await getStreams();
    setStreamOptions(normalizeList(response).map((item) => mapOption(item, ["name", "title"])));
  };

  const loadPathOptions = async () => {
    const response = await getCareerPaths();
    setPathOptions(
      normalizeList(response).map((item) => ({
        ...mapOption(item, ["pathName", "title", "name"]),
        categoryId: item.categoryId || item.category?.id || undefined,
        secondcategoryId: item.secondcategoryId || item.secondCategoryId || item.secondcategory?.id || item.secondCategory?.id || undefined,
        subcategoryId: item.subcategoryId || item.subcategory?.id || undefined,
      }))
    );
  };

  const loadExamOptions = async () => {
    const response = await getEntranceExams();
    setExamOptions(normalizeList(response).map((item) => mapOption(item, ["examname", "name", "title"])));
  };

  const loadInstitutionOptions = async () => {
    const response = await getInstitutes();
    setInstitutionOptions(normalizeList(response).map((item) => mapOption(item, ["name", "title"])));
  };

  const loadSecondaryCategories = async (categoryId) => {
    if (!categoryId) { setSecondaryCategoryOptions([]); setSubcategoryOptions([]); return; }
    const response = await getSecondaryCategoriesByCategory(categoryId);
    const nextOptions = normalizeList(response).map((item) => ({ ...mapOption(item, ["name", "title"]), categoryId: item.categoryId || item.category?.id || undefined }));
    setSecondaryCategoryOptions(nextOptions);
    return nextOptions;
  };

  const loadSubCategories = async (secondCategoryId) => {
    if (!secondCategoryId) { setSubcategoryOptions([]); return; }
    const response = await getSubCategoriesBySecondCategory(secondCategoryId);
    setSubcategoryOptions(
      normalizeList(response).map((item) => ({
        ...mapOption(item, ["title", "name"]),
        categoryId: item.categoryId || item.category?.id || undefined,
        secondcategoryId: item.secondcategoryId || item.secondCategoryId || item.secondcategory?.id || item.secondCategory?.id || undefined,
      }))
    );
  };

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      try {
        setLoading(true);
        await Promise.all([loadDetails(), loadStreams(), loadPathOptions(), loadExamOptions(), loadInstitutionOptions()]);
      } catch (error) {
        if (mounted) messageApi.error(error.response?.data?.message || error.message || "Failed to load details.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    bootstrap();
    return () => { mounted = false; };
  }, [messageApi]);

  const isViewMode = mode === "view";

  const buildSubmissionPayload = (values) => {
    const commonValues = getCommonValues(values);
    const payload = { streamId: commonValues.stream ?? null, categoryId: commonValues.category ?? null,description: commonValues.description ?? null };
    if (commonValues.secondCategory) payload.secondcategoryId = commonValues.secondCategory;
    if (commonValues.subcategory) payload.subcategoryId = commonValues.subcategory;

    if (selectedSections.includes("salary-range")) {
      payload.salaryRanges = (values.salaryRanges || [])
        .map((item) => ({ currency: normalizeSalaryCurrency(item?.currency ?? item?.unit), minSalary: toFloatOrNull(item?.min), maxSalary: toFloatOrNull(item?.max) }))
        .filter((item) => item.minSalary !== null || item.maxSalary !== null);
    }

    if (selectedSections.includes("job-scope")) {
      payload.jobScope = normalizeStringArray(values.names);
    }

    if (selectedSections.includes("career-path")) {
  const ids = (values.careerPaths || [])
    .map((cp) => cp?.pathType)
    .filter(Boolean);

  if (ids.length > 0) {
    payload.careerpathIds = ids;
  }
}

    if (selectedSections.includes("entrance-exam")) {
      const ids = (values.entranceExams || []).map((ex) => ex?.exam).filter(Boolean);
      if (ids.length > 0) {
       payload.entranceexamIds = ids;
      }
    }

    if (selectedSections.includes("institution")) {
      const ids = (values.institutions || []).map((inst) => inst?.name).filter(Boolean);
      if (ids.length > 0) {
       payload.institutionIds = ids;
      }
    }

    return payload;
  };

  const handleStreamChange = async (streamId) => {
    form.setFieldsValue({ category: undefined, secondCategory: undefined, subcategory: undefined });
    setCategoryOptions([]); setSecondaryCategoryOptions([]); setSubcategoryOptions([]);
    await loadCategories(streamId);
  };

  const handleCategoryChange = async (categoryId) => { await loadSecondaryCategories(categoryId); };
  const handleSecondCategoryChange = async (secondCategoryId) => { await loadSubCategories(secondCategoryId); };

  const prepareFormForRecord = async (record) => {
    await loadCategories(record.stream);
    await loadSecondaryCategories(record.category);
    await loadSubCategories(record.secondCategory);
    return record;
  };
const fetchDetailsRecord = async (id) => {
  const response = await getDetailsById(id);

  const apiData = response?.data?.data || response?.data;

  console.log("GET BY ID RESPONSE", response);
  console.log("API DATA", apiData);

  const mapped = mapDetailsRecord(apiData);

  console.log("MAPPED", mapped);

  return mapped;
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

async function handleOpenEdit(record) {
  try {
    const nextRecord = await fetchDetailsRecord(record.id);

    await prepareFormForRecord(nextRecord);

    const nextSections = deriveSections(nextRecord);
    const drafts = buildDrafts(nextRecord);

    setMode("edit");
    setSelectedRecord(nextRecord);
    setSelectedSections(nextSections);
    setDraftsBySection(drafts);

    form.resetFields();

    form.setFieldsValue(
      nextSections.reduce(
        (acc, section) => ({
          ...acc,
          ...drafts[section],
        }),
        getCommonValues(nextRecord)
      )
    );

    setOpen(true);
  } catch (error) {
    console.error(error);
    messageApi.error("Failed to load details");
  }
}
async function handleOpenView(record) {
  try {
    const nextRecord = await fetchDetailsRecord(record.id);

    await prepareFormForRecord(nextRecord);

    const nextSections = deriveSections(nextRecord);
    const drafts = buildDrafts(nextRecord);

    setMode("view");
    setSelectedRecord(nextRecord);
    setSelectedSections(nextSections);
    setDraftsBySection(drafts);

    form.resetFields();

    form.setFieldsValue(
      nextSections.reduce(
        (acc, section) => ({
          ...acc,
          ...drafts[section],
        }),
        getCommonValues(nextRecord)
      )
    );

    setOpen(true);
  } catch (error) {
    console.error(error);
    messageApi.error("Failed to load details");
  }
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
      .then(async () => { messageApi.success("Details item deleted successfully."); await loadDetails(); })
      .catch((error) => { messageApi.error(error.response?.data?.message || error.message || "Failed to delete details item."); });
  }

  function handleSectionChange(checkedValues) {
    const nextSections = checkedValues.length > 0 ? checkedValues : ["salary-range"];
    const currentValues = form.getFieldsValue(true);
    const commonValues = getCommonValues(currentValues);
    const nextDrafts = {
      ...draftsBySection,
      ...nextSections.reduce((acc, section) => {
        acc[section] = { ...draftsBySection[section], ...commonValues, ...getSectionValues(section, currentValues) };
        return acc;
      }, {}),
    };
    setSelectedSections(nextSections);
    setDraftsBySection(nextDrafts);
    form.setFieldsValue(nextSections.reduce((acc, section) => ({ ...acc, ...nextDrafts[section] }), commonValues));
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
        width={1100}
        destroyOnClose
        title={mode === "view" ? "View Details" : mode === "edit" ? "Edit Details" : "Add Details"}
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
          options={{ streamOptions, categoryOptions, secondaryCategoryOptions, subcategoryOptions, pathOptions, examOptions, institutionOptions }}
          normalizeUpload={(event) => (Array.isArray(event) ? event : event?.fileList || [])}
          onStreamChange={handleStreamChange}
          onCategoryChange={handleCategoryChange}
          onSecondCategoryChange={handleSecondCategoryChange}
        />
      </Modal>
    </div>
  );
}
