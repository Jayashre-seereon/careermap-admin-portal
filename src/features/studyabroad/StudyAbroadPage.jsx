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

const mapStudyAbroadItem = (item = {}) => ({
  id: item.id,
  country: item.country || "",
  description: item.description || "",
  overview: item.overview || "",
  visaAndWorkRights: item.visaAndWorkRights || item.visa_and_work_rights || "",
  livingCost: item.livingCost || item.living_cost || "",
  tuitionCost: item.tuitionCost || item.tuition_cost || "",
  topUniversity: item.topUniversity || item.top_university || "",
  scholarship: item.scholarship || "",
  requirement: item.requirement || "",
  popularCourses: item.popularCourses || item.popular_courses || "",
});

const buildStudyAbroadPayload = ({
  country,
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
  country,
  description: description || "",
  overview: overview || "",
  visaAndWorkRights: visaAndWorkRights || "",
  livingCost: livingCost || "",
  tuitionCost: tuitionCost || "",
  topUniversity: topUniversity || "",
  scholarship: scholarship || "",
  requirement: requirement || "",
  popularCourses: popularCourses || "",
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
      setData(normalizeList(response).map(mapStudyAbroadItem));
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
    `${item.country} ${item.description} ${item.overview} ${item.livingCost} ${item.tuitionCost} ${item.popularCourses}`
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
