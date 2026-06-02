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
import { getModules } from "../../api/module";
import { getStreams } from "../../api/stream";
import { getCategories } from "../../api/category";
import { getSecondaryCategories } from "../../api/secondaryCategory";
import { getSubCategories } from "../../api/subcategory";
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
  moduleId,
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
  moduleId,
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

const mapOption = (item = {}, labelKeys = []) => ({
  id: item.id,
  label: labelKeys.map((key) => item[key]).find(Boolean) || "",
});

const mapEntranceExam = (item = {}) => ({
  id: item.id,
  moduleId: item.moduleId || item.module?.id || undefined,
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
  moduleName: item.module?.title || item.moduleName || "",
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
  const [modules, setModules] = useState([]);
  const [streams, setStreams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [secondCategories, setSecondCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const loadEntranceExams = async () => {
    try {
      setLoading(true);
      const response = await getEntranceExams();
      setData(normalizeList(response).map(mapEntranceExam));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load entrance exams."));
    } finally {
      setLoading(false);
    }
  };

  const loadDropdowns = async () => {
    try {
      const [
        moduleResponse,
        streamResponse,
        categoryResponse,
        secondCategoryResponse,
        subcategoryResponse,
      ] = await Promise.all([
        getModules(),
        getStreams(),
        getCategories(),
        getSecondaryCategories(),
        getSubCategories(),
      ]);

      setModules(normalizeList(moduleResponse).map((item) => mapOption(item, ["title", "name"])));
      setStreams(normalizeList(streamResponse).map((item) => mapOption(item, ["name", "title"])));
      setCategories(normalizeList(categoryResponse).map((item) => mapOption(item, ["title", "name"])));
      setSecondCategories(
        normalizeList(secondCategoryResponse).map((item) => ({
          ...mapOption(item, ["name", "title"]),
          categoryId: item.categoryId || item.category?.id || undefined,
        }))
      );
      setSubcategories(
        normalizeList(subcategoryResponse).map((item) => ({
          ...mapOption(item, ["title", "name"]),
          categoryId: item.categoryId || item.category?.id || undefined,
          secondcategoryId:
            item.secondcategoryId ||
            item.secondCategoryId ||
            item.secondcategory?.id ||
            item.secondCategory?.id ||
            undefined,
        }))
      );
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, "Failed to load entrance exam form options.")
      );
    }
  };

  useEffect(() => {
    loadEntranceExams();
    loadDropdowns();
  }, []);

  const getLabel = (items, id, fallback = "") => {
    if (fallback) {
      return fallback;
    }

    return items.find((item) => item.id === id)?.label || "";
  };

  const tableData = data.map((item) => ({
    ...item,
    moduleName: getLabel(modules, item.moduleId, item.moduleName),
    streamName: getLabel(streams, item.streamId, item.streamName),
    categoryName: getLabel(categories, item.categoryId, item.categoryName),
    secondCategoryName: getLabel(
      secondCategories,
      item.secondcategoryId,
      item.secondCategoryName
    ),
    subcategoryName: getLabel(subcategories, item.subcategoryId, item.subcategoryName),
  }));

  const filteredData = tableData.filter((item) =>
    `${item.moduleName} ${item.streamName} ${item.categoryName} ${item.secondCategoryName} ${item.subcategoryName} ${item.examname} ${item.eligibility} ${item.examMode} ${item.subject} ${item.topInstitutes} ${item.url}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
          setOpen(true);
        }}
        onView={(record) => {
          setCurrent(record);
          setMode("view");
          setOpen(true);
        }}
        onEdit={(record) => {
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
          moduleOptions={modules}
          streamOptions={streams}
          categoryOptions={categories}
          secondCategoryOptions={secondCategories}
          subcategoryOptions={subcategories}
        />
      </Modal>
    </>
  );
}
