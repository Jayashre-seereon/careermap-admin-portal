import { useEffect, useState } from "react";
import { Modal, message } from "antd";
import MasterClassForm from "./MasterClassForm";
import MasterClassTable from "./MasterClassTable";
import {
  createMasterClass,
  deleteMasterClass,
  getMasterClasses,
  updateMasterClass,
    updateMasterClassFreeStatus,
} from "../../api/masterclass";
import { parseDateValue } from "../../utils/date";

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

const MASTER_CLASS_CATEGORY_OPTIONS = [
  { label: "Career Video", value: "Career Video" },
  { label: "Expert Video", value: "Expert Video" },
];

const getCategoryLabel = (value) =>
  MASTER_CLASS_CATEGORY_OPTIONS.find((item) => item.value === value)?.label || value || "";

const normalizeBoolean = (...values) => {
  const matchedValue = values.find((value) => value !== undefined && value !== null);

  if (typeof matchedValue === "string") {
    return matchedValue.toLowerCase() === "true" || matchedValue === "1";
  }

  return !!matchedValue;
};

const formatDateTimeValue = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toISOString();
  }

  if (typeof value?.toDate === "function") {
    const dateValue = value.toDate();
    return Number.isNaN(dateValue.getTime()) ? "" : dateValue.toISOString();
  }

  return "";
};

const extractFile = (value) => {
  if (Array.isArray(value) && value[0]?.originFileObj) {
    return value[0].originFileObj;
  }

  if (value?.fileList?.[0]?.originFileObj) {
    return value.fileList[0].originFileObj;
  }

  if (value?.originFileObj) {
    return value.originFileObj;
  }

  return null;
};

const buildMasterClassPayload = ({
  image,
  title,
  name,
  time,
  views,
  videoUrl,
  category,
  isActive,
}) => {
  const payload = {
    title: title || "",
    name: name || "",
    time: formatDateTimeValue(time),
    views: views || "0",
    video_url: videoUrl || "",
    category: category || "",
    is_active: !!isActive,
  };

  const file = extractFile(image);

  if (!file) {
    return { payload, config: {} };
  }

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  formData.append("image", file);

  return {
    payload: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  };
};

const mapMasterClass = (item = {}) => ({
  id: item.id,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  image: item.image || item.image_url || item.thumbnail || null,
  title: item.title || "",
  name: item.name || item.speaker_name || item.speakerName || item.class_name || "",
  time: parseDateValue(item.time),
  timeLabel: parseDateValue(item.time)?.format("DD-MM-YYYY HH:mm") || "",
  views: item.views ?? item.view_count ?? item.viewCount ?? "",
  videoUrl: item.videoUrl || item.video_url || item.video_link || item.url || "",
  category: item.category || item.category_type || item.type || "",
  categoryLabel: getCategoryLabel(item.category || item.category_type || item.type || ""),
  isActive: normalizeBoolean(item.isActive, item.is_active, item.active, item.status),
  is_free: item.is_free,
});




export default function MasterClassPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

 const loadMasterClasses = async () => {
    try {
      setLoading(true);
      const response = await getMasterClasses();
      setData(sortNewestFirst(normalizeList(response).map(mapMasterClass)));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load master classes."));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (record, checked) => {
    setData((current) =>
      current.map((item) =>
        item.id === record.id ? { ...item, is_free: checked } : item
      )
    );

    try {
      await updateMasterClassFreeStatus(record.id, checked);
      messageApi.success("Master Class status updated.");
    } catch (error) {
      setData((current) =>
        current.map((item) =>
          item.id === record.id ? { ...item, is_free: !checked } : item
        )
      );
      messageApi.error(getApiErrorMessage(error, "Failed to update status."));
    }
  };

  useEffect(() => {
    loadMasterClasses();
  }, []);



  const filteredData = data.filter((item) =>
    `${item.title} ${item.name} ${item.time} ${item.views} ${item.videoUrl} ${item.categoryLabel}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSubmit = async (values) => {
    try {
      const { payload, config } = buildMasterClassPayload(values);

      if (mode === "edit" && current) {
        await updateMasterClass(current.id, payload, config);
        messageApi.success("Master class updated successfully.");
      } else {
        await createMasterClass(payload, config);
        messageApi.success("Master class created successfully.");
      }

      setOpen(false);
      setCurrent(null);
      await loadMasterClasses();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(
          error,
          mode === "edit"
            ? "Failed to update master class."
            : "Failed to create master class."
        )
      );
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteMasterClass(record.id);
      messageApi.success("Master class deleted successfully.");
      await loadMasterClasses();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete master class."));
    }
  };

  return (
    <>
      {contextHolder}
      <MasterClassTable
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
         onStatusChange={handleStatusChange}
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
          mode === "view"
            ? "View Master Class"
            : mode === "edit"
              ? "Edit Master Class"
              : "Add Master Class"
        }
      >
        <MasterClassForm
          onSubmit={handleSubmit}
          initialValues={current}
          mode={mode}
        />
      </Modal>
    </>
  );
}
