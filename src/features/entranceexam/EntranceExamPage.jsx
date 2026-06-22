import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import EntranceExamTable from "./EntranceExamTable";
import EntranceExamForm from "./EntranceExamForm";
import {
  createEntranceExam,
  deleteEntranceExam,
  getEntranceExams,
  updateEntranceExam,
} from "../../api/entranceexam";
import { getStreams } from "../../api/stream";
import { getCategoriesByStream } from "../../api/category";
import { getSecondaryCategoriesByCategory } from "../../api/secondaryCategory";
import { getSubCategoriesBySecondCategory } from "../../api/subcategory";
import { formatDateDisplay, formatDateForPayload } from "../../utils/date";

const getApiErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

const normalizeList = (response) => {
  const list = response?.data;

  if (Array.isArray(list)) {
    return list;
  }

  if (list && typeof list === "object") {
    return [list];
  }

  return [];
};

const getSortScore = (item = {}, index = 0) => {
  const candidates = [
    item.createdAt,
    item.updatedAt,
    item.created_at,
    item.updated_at,
    item.id,
  ];

  for (const value of candidates) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    const dateScore = Date.parse(value);
    if (!Number.isNaN(dateScore)) {
      return dateScore;
    }

    const numericScore = Number(value);
    if (Number.isFinite(numericScore)) {
      return numericScore;
    }
  }

  return -index;
};

const sortNewestFirst = (items = []) =>
  [...items]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => getSortScore(b.item, b.index) - getSortScore(a.item, a.index))
    .map(({ item }) => item);

const formatDateValue = (value) => {
  return formatDateForPayload(value);
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

const buildEntranceExamPayload = ({
  streamId,
  categoryId,
  secondcategoryId,
  subcategoryId,
  examname,
  issuedate,
  lastdate,
  eligibility,
  about,
  examDate,
  examMode,
  duration,
  subject,
  totalMark,
  frequency,
  examPattern,
  topInstitutes,
  url,
}) => ({
  streamId,
  categoryId,
  secondcategoryId,
  subcategoryId,
  examname,
  issuedate: formatDateValue(issuedate),
  lastdate: formatDateValue(lastdate),
  exam_date: formatDateValue(examDate) || null,
  mode: examMode || "",
  total_mark: totalMark || "",
  frequncy: frequency || "",
  exam_pattern: examPattern || "",
  top_institution: normalizeStringArray(topInstitutes),
  subject: normalizeStringArray(subject),
  eligibility: eligibility || "",
  about: about || "",
  duration: duration || "",
  url: url || "",
});

// Returns options in {value, label} shape, as used by EntranceExamForm
const mapOption = (item = {}, labelKeys = []) => ({
  value: item.id,
  label: labelKeys.map((key) => item[key]).find(Boolean) || "",
});

const mapEntranceExam = (item = {}) => ({
  id: item.id,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  streamId: item.streamId || item.stream?.id || undefined,
  categoryId: item.categoryId || item.category?.id || undefined,
  secondcategoryId:
    item.secondcategoryId || item.secondcategory?.id || item.secondCategory?.id || undefined,
  subcategoryId: item.subcategoryId || item.subcategory?.id || undefined,
  examname: item.examname || "",
  issuedate: formatDateDisplay(item.issuedate),
  lastdate: formatDateDisplay(item.lastdate),
  eligibility: item.eligibility || "",
  about: item.about || "",
  examDate: formatDateDisplay(item.examDate || item.exam_date),
  examMode: item.examMode || item.exam_mode || item.mode || "",
  duration: item.duration || "",
  subject: Array.isArray(item.subject) ? item.subject : normalizeStringArray(item.subject),
  totalMark: item.totalMark || item.total_mark || "",
  frequency: item.frequency || item.frequncy || "",
  examPattern: item.examPattern || item.exam_pattern || "",
  topInstitutes: Array.isArray(item.topInstitutes || item.top_institutes || item.top_institution)
    ? item.topInstitutes || item.top_institutes || item.top_institution
    : normalizeStringArray(item.topInstitutes || item.top_institutes || item.top_institution),
  url: item.url || "",
  streamName: item.stream?.name || item.streamName || "",
  categoryName: item.category?.title || item.category?.name || item.categoryName || "",
  secondCategoryName:
    item.secondcategory?.name ||
    item.secondCategory?.name ||
    item.secondcategory?.title ||
    item.secondCategory?.title ||
    item.secondCategoryName ||
    "",
  subcategoryName: item.subcategory?.title || item.subcategoryName || "",
});

export default function EntranceExamPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [streamOptions, setStreamOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [secondCategoryOptions, setSecondCategoryOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);

  const loadEntranceExams = async () => {
    try {
      setLoading(true);
      const response = await getEntranceExams();
      setData(sortNewestFirst(normalizeList(response).map(mapEntranceExam)));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load entrance exams."));
    } finally {
      setLoading(false);
    }
  };

  const loadStreams = async () => {
    try {
      const response = await getStreams();
      setStreamOptions(normalizeList(response).map((item) => mapOption(item, ["name", "title"])));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load streams."));
    }
  };

  const loadCategories = async (streamId) => {
    if (!streamId) {
      setCategoryOptions([]);
      setSecondCategoryOptions([]);
      setSubcategoryOptions([]);
      return;
    }

    try {
      const response = await getCategoriesByStream(streamId);
      setCategoryOptions(normalizeList(response).map((item) => mapOption(item, ["title", "name"])));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load categories."));
    }
  };

  const loadSecondCategories = async (categoryId) => {
    if (!categoryId) {
      setSecondCategoryOptions([]);
      setSubcategoryOptions([]);
      return;
    }

    try {
      const response = await getSecondaryCategoriesByCategory(categoryId);
      setSecondCategoryOptions(normalizeList(response).map((item) => mapOption(item, ["name", "title"])));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load secondary categories."));
    }
  };

  const loadSubcategories = async (secondCategoryId) => {
    if (!secondCategoryId) {
      setSubcategoryOptions([]);
      return;
    }

    try {
      const response = await getSubCategoriesBySecondCategory(secondCategoryId);
      setSubcategoryOptions(normalizeList(response).map((item) => mapOption(item, ["title", "name"])));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load subcategories."));
    }
  };

  useEffect(() => {
    loadEntranceExams();
    loadStreams();
  }, []);

  const filteredData = data.filter((item) =>
    `${item.streamName} ${item.categoryName} ${item.secondCategoryName} ${item.subcategoryName} ${item.examname} ${item.eligibility} ${item.examMode} ${item.subject} ${item.topInstitutes} ${item.url}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleStreamChange = async (streamId) => {
    await loadCategories(streamId);
  };

  const handleCategoryChange = async (categoryId) => {
    await loadSecondCategories(categoryId);
  };

  const handleSecondCategoryChange = async (secondCategoryId) => {
    await loadSubcategories(secondCategoryId);
  };

  // Preloads the full cascade (category -> 2nd category -> subcategory
  // options) for an existing record so the dropdowns have the right
  // option lists ready before the modal opens.
  const prepareCascadeForRecord = async (record) => {
    await loadCategories(record.streamId);
    await loadSecondCategories(record.categoryId);
    await loadSubcategories(record.secondcategoryId);
  };

  const handleSubmit = async (values) => {
    try {
      const payload = buildEntranceExamPayload(values);

      if (mode === "edit" && current) {
        await updateEntranceExam(current.id, payload);
        messageApi.success("Entrance exam updated successfully.");
      } else {
        await createEntranceExam(payload);
        messageApi.success("Entrance exam created successfully.");
      }

      setOpen(false);
      setCurrent(null);
      await loadEntranceExams();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(
          error,
          mode === "edit"
            ? "Failed to update entrance exam."
            : "Failed to create entrance exam."
        )
      );
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteEntranceExam(record.id);
      messageApi.success("Entrance exam deleted successfully.");
      await loadEntranceExams();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete entrance exam."));
    }
  };

  return (
    <>
      {contextHolder}
      <EntranceExamTable
        data={filteredData}
        loading={loading}
        search={search}
        onSearch={setSearch}
        onAdd={() => {
          setCurrent(null);
          setMode("add");
          setCategoryOptions([]);
          setSecondCategoryOptions([]);
          setSubcategoryOptions([]);
          setOpen(true);
        }}
        onView={async (record) => {
          await prepareCascadeForRecord(record);
          setCurrent(record);
          setMode("view");
          setOpen(true);
        }}
        onEdit={async (record) => {
          await prepareCascadeForRecord(record);
          setCurrent(record);
          setMode("edit");
          setOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setCurrent(null);
        }}
        footer={null}
        width={900}
        destroyOnClose
        title={
          mode === "add"
            ? "Add Entrance Exam"
            : mode === "edit"
              ? "Edit Entrance Exam"
              : "View Entrance Exam"
        }
      >
        <EntranceExamForm
          onSubmit={handleSubmit}
          initialValues={current}
          mode={mode}
          streamOptions={streamOptions}
          categoryOptions={categoryOptions}
          secondCategoryOptions={secondCategoryOptions}
          subcategoryOptions={subcategoryOptions}
          onStreamChange={handleStreamChange}
          onCategoryChange={handleCategoryChange}
          onSecondCategoryChange={handleSecondCategoryChange}
        />
      </Modal>
    </>
  );
}