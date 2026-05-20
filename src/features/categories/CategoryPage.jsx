import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import {
  createCategory,
  deleteCategory,
  getCategories,
  mapCategory,
  updateCategory,
} from "../../api/category";
import { getStreams, mapStream } from "../../api/stream";
import { getInstitutes, mapInstitute } from "../../api/institute";

const getApiErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

export default function CategoryPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streams, setStreams] = useState([]);
  const [institutes, setInstitutes] = useState([]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      const list = response?.data;
      const normalized = Array.isArray(list)
        ? list
        : list && typeof list === "object"
          ? [list]
          : [];

      setData(normalized.map(mapCategory));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load categories."));
    } finally {
      setLoading(false);
    }
  };

  const loadDropdowns = async () => {
    try {
      const [streamResponse, instituteResponse] = await Promise.all([
        getStreams(),
        getInstitutes(),
      ]);

      const streamList = streamResponse?.data;
      const instituteList = instituteResponse?.data;

      const normalizedStreams = Array.isArray(streamList)
        ? streamList
        : streamList && typeof streamList === "object"
          ? [streamList]
          : [];

      const normalizedInstitutes = Array.isArray(instituteList)
        ? instituteList
        : instituteList && typeof instituteList === "object"
          ? [instituteList]
          : [];

      setStreams(normalizedStreams.map(mapStream));
      setInstitutes(normalizedInstitutes.map(mapInstitute));
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, "Failed to load stream and institute options.")
      );
    }
  };

  useEffect(() => {
    loadCategories();
    loadDropdowns();
  }, []);

  const handleAdd = async (values) => {
    try {
      await createCategory(values);
      messageApi.success("Category created successfully.");
      setOpen(false);
      setSelected(null);
      await loadCategories();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to create category."));
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateCategory(selected.id, values);
      messageApi.success("Category updated successfully.");
      setOpen(false);
      setSelected(null);
      await loadCategories();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to update category."));
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteCategory(record.id);
      messageApi.success("Category deleted successfully.");
      await loadCategories();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete category."));
    }
  };

  return (
    <div className="space-y-5">
      {contextHolder}

      <h2 className="text-xl font-bold text-[#9a2119]">
        Category Management
      </h2>

      <CategoryTable
        data={data}
        loading={loading}
        onAddClick={() => {
          setMode("add");
          setSelected(null);
          setOpen(true);
        }}
        onDelete={handleDelete}
        onView={(record) => {
          setSelected(record);
          setMode("view");
          setOpen(true);
        }}
        onEdit={(record) => {
          setSelected(record);
          setMode("edit");
          setOpen(true);
        }}
      />

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelected(null);
        }}
        footer={null}
        width={1100}
        destroyOnClose
        title={
          mode === "add"
            ? "Add Category"
            : mode === "edit"
              ? "Edit Category"
              : "View Category"
        }
      >
        <CategoryForm
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
          streamOptions={streams}
          institutionOptions={institutes}
        />
      </Modal>
    </div>
  );
}
