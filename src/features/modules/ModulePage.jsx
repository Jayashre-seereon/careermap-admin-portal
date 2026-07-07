import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import ModuleForm from "./ModuleForm";
import ModuleTable from "./ModuleTable";
import {
  createModule,
  deleteModule,
  getModules,
  updateModule,
} from "../../api/module";

const DEFAULT_MODULES = [
  { title: "Career Library", isFree: false },
  { title: "Assessment", isFree: true },
  { title: "Master Class", isFree: false },
  { title: "Entrance Exam", isFree: true },
  { title: "Institutes", isFree: true },
  { title: "Book Mentor", isFree: false },
  { title: "Scholarship", isFree: false },
  { title: "Quiz", isFree: true },
  { title: "Study Abroad", isFree: false },
];

// Update buildModulePayload to handle image
const buildModulePayload = ({ title, isFree, image, freePreview, }) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("markas_free", isFree ?? false);
  formData.append("freePreview", freePreview ?? true);
  if (image?.file) {
    formData.append("image", image.file);
  }
  return {
    payload: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  };
};

// Update mapModule to include image
const mapModule = (item = {}) => ({
  id: item.id,
  title: item.title || "",
  isFree: item.isFree ?? item.markas_free ?? false,
    freePreview: item.freePreview,
  image: item.image || null,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

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

const getApiErrorMessage = (error, fallbackMessage) => {
  const backendMessage =
    error.response?.data?.message || error.message || fallbackMessage;

  if (
    typeof backendMessage === "string" &&
    backendMessage.includes("Unique constraint failed")
  ) {
    return "This module already exists.";
  }

  return backendMessage;
};

export default function ModulePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [modules, setModules] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadModules = async () => {
    try {
      setLoading(true);
      const response = await getModules();
      setModules(normalizeList(response).map(mapModule));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load modules."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const handleAdd = async (values) => {
    try {
      const { payload, config } = buildModulePayload(values);
      await createModule(payload, config);
      messageApi.success("Module created successfully.");
      setOpen(false);
      setSelected(null);
      await loadModules();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to create module."));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteModule(id);
      messageApi.success("Module deleted successfully.");
      await loadModules();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete module."));
    }
  };

  const handleView = (record) => {
    setSelected(record);
    setMode("view");
    setOpen(true);
  };

  const handleEdit = (record) => {
    setSelected(record);
    setMode("edit");
    setOpen(true);
  };

  const handleUpdate = async (values) => {
    try {
      const { payload, config } = buildModulePayload(values);
      await updateModule(selected.id, payload, config);
      messageApi.success("Module updated successfully.");
      setOpen(false);
      setSelected(null);
      await loadModules();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to update module."));
    }
  };

  const handleAddDefaults = async () => {
    try {
      const existingTitles = new Set(
        modules.map((item) => item.title.trim().toLowerCase())
      );

      const missingModules = DEFAULT_MODULES.filter(
        (item) => !existingTitles.has(item.title.toLowerCase())
      );

      if (!missingModules.length) {
        messageApi.info("All 9 default modules already exist.");
        return;
      }

      await Promise.all(
        missingModules.map((item) =>
          createModule({
            title: item.title,
            markas_free: item.isFree,
          })
        )
      );

      messageApi.success(`${missingModules.length} default modules added successfully.`);
      await loadModules();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to add default modules."));
    }
  };

  const filteredModules = modules.filter((module) =>
    `${module.title} ${module.isFree ? "unlocked" : "locked"}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {contextHolder}
      <h2 className="text-xl font-bold text-[#9a2119]">Module Management</h2>

      <ModuleTable
        data={filteredModules}
        search={search}
        onSearch={setSearch}
        onAddDefaults={handleAddDefaults}
        onAddClick={() => {
          setMode("add");
          setSelected(null);
          setOpen(true);
        }}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
        loading={loading}
      />

      <Modal
        title={
          mode === "add"
            ? "Add Module"
            : mode === "edit"
              ? "Edit Module"
              : "View Module"
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelected(null);
        }}
        footer={null}
        width={700}
        destroyOnClose
      >
        <ModuleForm
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
          moduleOptions={DEFAULT_MODULES}
        />
      </Modal>
    </div>
  );
}
