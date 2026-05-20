import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import Category2Table from "./Category2Table";
import Category2Form from "./Category2Form";
import {
  createSecondaryCategory,
  deleteSecondaryCategory,
  getSecondaryCategories,
  mapSecondaryCategory,
  updateSecondaryCategory,
} from "../../api/secondaryCategory";
import { getCategories, mapCategory } from "../../api/category";
import { getInstitutes, mapInstitute } from "../../api/institute";

const getApiErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

export default function Category2Page() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [institutes, setInstitutes] = useState([]);

  const loadSecondaryCategories = async () => {
    try {
      setLoading(true);
      const response = await getSecondaryCategories();
      const list = response?.data;
      const normalized = Array.isArray(list)
        ? list
        : list && typeof list === "object"
          ? [list]
          : [];

      setData(normalized.map(mapSecondaryCategory));
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, "Failed to load secondary categories.")
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDropdowns = async () => {
    try {
      const [categoryResponse, instituteResponse] = await Promise.all([
        getCategories(),
        getInstitutes(),
      ]);

      const categoryList = categoryResponse?.data;
      const instituteList = instituteResponse?.data;

      const normalizedCategories = Array.isArray(categoryList)
        ? categoryList
        : categoryList && typeof categoryList === "object"
          ? [categoryList]
          : [];

      const normalizedInstitutes = Array.isArray(instituteList)
        ? instituteList
        : instituteList && typeof instituteList === "object"
          ? [instituteList]
          : [];

      setCategories(normalizedCategories.map(mapCategory));
      setInstitutes(normalizedInstitutes.map(mapInstitute));
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(
          error,
          "Failed to load category and institute options."
        )
      );
    }
  };

  useEffect(() => {
    loadSecondaryCategories();
    loadDropdowns();
  }, []);

  const getCategoryName = (categoryId, fallbackName = "") => {
    if (fallbackName) {
      return fallbackName;
    }

    const matchedCategory = categories.find((item) => item.id === categoryId);
    return matchedCategory?.title || matchedCategory?.name || "";
  };

  const getInstituteName = (institutionId, fallbackName = "") => {
    if (fallbackName) {
      return fallbackName;
    }

    const matchedInstitute = institutes.find((item) => item.id === institutionId);
    return matchedInstitute?.name || "";
  };

  const tableData = data.map((item) => ({
    ...item,
    categoryName: getCategoryName(item.category, item.categoryName),
    institutionName: getInstituteName(item.institution, item.institutionName),
  }));

  const filteredData = tableData.filter((item) =>
    `${item.categoryName} ${item.name} ${item.institutionName} ${item.path} ${item.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setMode("add");
    setSelected(null);
    setOpen(true);
  };

  const handleEdit = (record) => {
    setMode("edit");
    setSelected(record);
    setOpen(true);
  };

  const handleView = (record) => {
    setMode("view");
    setSelected(record);
    setOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (mode === "edit" && selected) {
        await updateSecondaryCategory(selected.id, values);
        messageApi.success("Secondary category updated successfully.");
      } else {
        await createSecondaryCategory(values);
        messageApi.success("Secondary category created successfully.");
      }

      setOpen(false);
      setSelected(null);
      await loadSecondaryCategories();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(
          error,
          mode === "edit"
            ? "Failed to update secondary category."
            : "Failed to create secondary category."
        )
      );
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteSecondaryCategory(record.id);
      messageApi.success("Secondary category deleted successfully.");
      await loadSecondaryCategories();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, "Failed to delete secondary category.")
      );
    }
  };

  return (
    <div className="w-full">
      {contextHolder}

      <h2 className="text-xl font-semibold text-[#9a2119] mb-5">
        Secondary Category Management
      </h2>

      <div className="w-full">
        <Category2Table
          data={filteredData}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          search={search}
          setSearch={setSearch}
        />
      </div>

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelected(null);
        }}
        footer={null}
        width={1000}
        destroyOnClose
        title={
          mode === "add"
            ? "Add Secondary Category"
            : mode === "edit"
              ? "Edit Secondary Category"
              : "View Secondary Category"
        }
      >
        <Category2Form
          onSubmit={handleSubmit}
          initialValues={selected}
          mode={mode}
          categoryOptions={categories}
          institutionOptions={institutes}
        />
      </Modal>
    </div>
  );
}
