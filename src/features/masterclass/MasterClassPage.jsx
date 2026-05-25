import { useEffect, useState } from "react";
import { Modal, message } from "antd";
import MasterClassForm from "./MasterClassForm";
import MasterClassTable from "./MasterClassTable";
import {
  createMasterClass,
  deleteMasterClass,
  getMasterClasses,
  updateMasterClass,
} from "../../api/masterclass";

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
  isActive,
}) => {
  const payload = {
    title,
    name,
    time: time || "",
    views: views ? Number(views) : 0,
    videoUrl: videoUrl || "",
    isActive: !!isActive,
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
  image: item.image || null,
  title: item.title || "",
  name: item.name || "",
  time: item.time || "",
  views: item.views ?? "",
  videoUrl: item.videoUrl || item.video_url || "",
  isActive: item.isActive ?? item.active ?? false,
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
      setData(normalizeList(response).map(mapMasterClass));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load master classes."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMasterClasses();
  }, []);

  const filteredData = data.filter((item) =>
    `${item.title} ${item.name} ${item.time} ${item.views} ${item.videoUrl}`
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
