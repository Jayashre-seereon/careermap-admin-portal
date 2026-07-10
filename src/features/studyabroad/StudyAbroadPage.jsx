import { useEffect, useState } from "react";
import { Modal, message } from "antd";
import StudyAbroadForm from "./StudyAbroadForm";
import StudyAbroadTable from "./StudyAbroadTable";
import {
  createStudyAbroadItem,
  deleteStudyAbroadItem,
  getStudyAbroadItems,
  updateStudyAbroadItem,
} from "../../api/studyabroad";

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

const mapStudyAbroadItem = (item = {}) => ({
  id: item.id,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  title: item.title || "",
  countryName: item.countryName || item.country_name || item.country || "",
  description: item.description || "",
  overview: item.overview || "",
  visaAndWorkRights: item.visaAndWorkRights || item.visa_and_work_rights || item.visa_work || "",
  livingCost: item.livingCost || item.living_cost || "",
  tuitionCost: item.tuitionCost || item.tuition_cost || item.tution_cost || "",
  topUniversity: Array.isArray(item.topUniversity || item.top_university)
    ? item.topUniversity || item.top_university
    : normalizeStringArray(item.topUniversity || item.top_university),
  scholarship: Array.isArray(item.scholarship)
    ? item.scholarship
    : normalizeStringArray(item.scholarship),
  requirement: Array.isArray(item.requirement || item.requirment)
    ? item.requirement || item.requirment
    : normalizeStringArray(item.requirement || item.requirment),
  popularCourses: Array.isArray(item.popularCourses || item.popular_courses || item.popular_course)
    ? item.popularCourses || item.popular_courses || item.popular_course
    : normalizeStringArray(item.popularCourses || item.popular_courses || item.popular_course),
});

const buildStudyAbroadPayload = ({
  title,
  countryName,
  description,
  overview,
  visaAndWorkRights,
  livingCost,
  tuitionCost,
  topUniversity,
  scholarship,
  requirement,
  popularCourses,
}) => ({
  title: title || "",
  country_name: countryName || "",
  description: description || "",
  overview: overview || "",
  visa_work: visaAndWorkRights || "",
  living_cost: livingCost || "",
  tution_cost: tuitionCost || "",
  top_university: normalizeStringArray(topUniversity),
  scholarship: normalizeStringArray(scholarship),
  requirment: normalizeStringArray(requirement),
  popular_course: normalizeStringArray(popularCourses),
});

export default function StudyAbroadPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await getStudyAbroadItems();
      setData(sortNewestFirst(normalizeList(response).map(mapStudyAbroadItem)));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load study abroad items."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredData = data.filter((item) =>
    `${item.title} ${item.countryName} ${item.description} ${item.overview} ${item.livingCost} ${item.tuitionCost} ${item.popularCourses}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSubmit = async (values) => {
    try {
      const payload = buildStudyAbroadPayload(values);

      if (mode === "edit" && current) {
        await updateStudyAbroadItem(current.id, payload);
        messageApi.success("Study abroad record updated successfully.");
      } else {
        await createStudyAbroadItem(payload);
        messageApi.success("Study abroad record created successfully.");
      }

      setOpen(false);
      setCurrent(null);
      await loadItems();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(
          error,
          mode === "edit"
            ? "Failed to update study abroad record."
            : "Failed to create study abroad record."
        )
      );
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteStudyAbroadItem(record.id);
      messageApi.success("Study abroad record deleted successfully.");
      await loadItems();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete study abroad record."));
    }
  };

  return (
    <>
      {contextHolder}
      <StudyAbroadTable
        data={filteredData}
        loading={loading}
        search={search}
        onSearch={setSearch}
        onAdd={() => {
          setCurrent(null);
          setOpen(true);
          setMode("add");
        }}
        onView={(record) => {
          setCurrent(record);
          setOpen(true);
          setMode("view");
        }}
        onEdit={(record) => {
          setCurrent(record);
          setOpen(true);
          setMode("edit");
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
        width={1100}
        destroyOnClose
        title={
          mode === "view"
            ? "View Study Abroad"
            : mode === "edit"
              ? "Edit Study Abroad"
              : "Add Study Abroad"
        }
      >
        <StudyAbroadForm
          onSubmit={handleSubmit}
          initialValues={current}
          mode={mode}
        />
      </Modal>
    </>
  );
}
