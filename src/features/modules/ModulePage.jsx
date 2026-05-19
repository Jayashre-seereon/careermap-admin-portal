import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import ModuleForm from "./ModuleForm";
import ModuleTable from "./ModuleTable";
import {
  createModule,
  deleteModule,
  getModules,
  mapModule,
  updateModule,
} from "../../api/module";

const getApiErrorMessage = (error, fallbackMessage) => {
  const backendMessage = error.response?.data?.message || error.message || fallbackMessage;

  if (typeof backendMessage === "string" && backendMessage.includes("Unique constraint failed")) {
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
      const list = response?.data || [];
      setModules(Array.isArray(list) ? list.map(mapModule) : []);
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
      await createModule(values);
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
      await updateModule(selected.id, values);
      messageApi.success("Module updated successfully.");
      setOpen(false);
      setSelected(null);
      await loadModules();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to update module."));
    }
  };

  const filteredModules = modules.filter((module) =>
    `${module.title} ${module.btnText} ${module.url} ${module.position}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {contextHolder}
      <h2 className="text-xl font-bold text-[#9a2119]">
        Module Management
      </h2>

      <ModuleTable
        data={filteredModules}
        search={search}
        onSearch={setSearch}
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
        width={1000}
        destroyOnClose
      >
        <ModuleForm
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}
