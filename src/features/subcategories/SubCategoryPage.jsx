import React, { useEffect, useRef, useState } from "react";
import { Modal, message } from "antd";
import SubCategoryTable from "./SubCategoryTable";
import SubCategoryForm from "./SubCategoryForm";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  updateSubCategory,
} from "../../api/subcategory";
import { getCategories } from "../../api/category";
import { getSecondaryCategoriesByCategory } from "../../api/secondaryCategory";
import { getInstitutes } from "../../api/institute";

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

const buildSubCategoryPayload = ({
  categoryId,
  secondcategoryId,
  institutionId,
  title,
  path,
  file,
  coverImage,
  description,
  specialization,
  importandt_facts,
}) => {
  const payload = {
    categoryId,
    secondcategoryId,
    institutionId,
    title,
    path: path || "",
    description: description || "",
    specialization: specialization || "",
    importandt_facts: importandt_facts || "",
  };

  const fileValue = extractFile(file);
  const coverImageValue = extractFile(coverImage);

  if (!fileValue && !coverImageValue) {
    const existingCoverImage =
      Array.isArray(coverImage) && typeof coverImage[0]?.url === "string"
        ? coverImage[0].url
        : null;
    return { payload: { ...payload, coverImage: existingCoverImage }, config: {} };  // ✅ no image = plain JSON, types preserved
  }

  const formData = new FormData();

  // ✅ Cast IDs to Number so server receives integers, not strings
  if (categoryId != null)       formData.append("categoryId", Number(categoryId));
  if (secondcategoryId != null) formData.append("secondcategoryId", Number(secondcategoryId));
  if (institutionId != null)    formData.append("institutionId", Number(institutionId));

  // ✅ String fields appended normally
  formData.append("title", title || "");
  formData.append("path", path || "");
  formData.append("description", description || "");
  formData.append("specialization", specialization || "");
  formData.append("importandt_facts", importandt_facts || "");

  if (fileValue)       formData.append("file", fileValue);
  if (coverImageValue) formData.append("coverImage", coverImageValue);

  return {
    payload: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  };
};

const mapCategory = (item = {}) => ({
  id: item.id,
  title: item.title || item.name || "",
});

const mapSecondCategory = (item = {}) => ({
  id: item.id,
  name: item.name || item.title || "",
  categoryId: item.categoryId || item.category?.id || item.category || undefined,
});

const mapInstitute = (item = {}) => ({
  id: item.id,
  name: item.name || "",
});

const mapSubCategory = (item = {}) => ({
  id: item.id,
  categoryId: item.categoryId || item.category?.id || item.category || undefined,
  secondcategoryId:
    item.secondcategoryId ||
    item.secondCategoryId ||
    item.secondcategory?.id ||
    item.secondCategory?.id ||
    item.secondcategory ||
    item.secondCategory ||
    undefined,
  institutionId:
    item.institutionId || item.institution?.id || item.institution || undefined,
  title: item.title || "",
  path: item.path || "",
  file: item.file || null,
  coverImage: item.coverImage || null,
  description: item.description || "",
  specialization: item.specialization || item.specialisation || "",
  importandt_facts:
    item.importandt_facts || item.important_facts || item.importantFacts || "",
  categoryName: item.category?.title || item.category?.name || item.categoryName || "",
  secondCategoryName:
    item.secondcategory?.name ||
    item.secondCategory?.name ||
    item.secondcategory?.title ||
    item.secondCategory?.title ||
    item.secondCategoryName ||
    "",
  institutionName: item.institution?.name || item.institutionName || "",
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export default function SubCategoryPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [secondCategories, setSecondCategories] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [secondCategoryFilter, setSecondCategoryFilter] = useState("all");
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [secondOptionsLoading, setSecondOptionsLoading] = useState(false);

  const loadSubCategories = async () => {
    try {
      setLoading(true);
      const response = await getSubCategories();
      setData(normalizeList(response).map(mapSubCategory));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load subcategories."));
    } finally {
      setLoading(false);
    }
  };

  const loadDropdowns = async () => {
    setOptionsLoading(true);
    try {
      const [categoryResponse, instituteResponse] = await Promise.all([
        getCategories(),
        getInstitutes(),
      ]);

      setCategories(normalizeList(categoryResponse).map(mapCategory));
      setInstitutes(normalizeList(instituteResponse).map(mapInstitute));
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, "Failed to load subcategory form options.")
      );
    } finally {
      setOptionsLoading(false);
    }
  };

  useEffect(() => {
    loadSubCategories();
    loadDropdowns();
  }, []);

  const secondCategoryReqRef = useRef(0);
  const loadSecondCategoriesByCategory = async (categoryId) => {
    const reqId = ++secondCategoryReqRef.current;
    if (!categoryId) {
      setSecondCategories([]);
      return;
    }

    setSecondOptionsLoading(true);
    try {
      const response = await getSecondaryCategoriesByCategory(categoryId);
      if (reqId !== secondCategoryReqRef.current) return;
      const items = normalizeList(response);
      setSecondCategories(items.map(mapSecondCategory));
    } finally {
      if (reqId === secondCategoryReqRef.current) setSecondOptionsLoading(false);
    }
  };

  const getCategoryName = (id, fallbackName = "") => {
    if (fallbackName) {
      return fallbackName;
    }

    return categories.find((item) => item.id === id)?.title || "";
  };

  const getSecondCategoryName = (id, fallbackName = "") => {
    if (fallbackName) {
      return fallbackName;
    }

    return secondCategories.find((item) => item.id === id)?.name || "";
  };

  const getInstituteName = (id, fallbackName = "") => {
    if (fallbackName) {
      return fallbackName;
    }

    return institutes.find((item) => item.id === id)?.name || "";
  };

  const tableData = data.map((item) => ({
    ...item,
    categoryName: getCategoryName(item.categoryId, item.categoryName),
    secondCategoryName: getSecondCategoryName(
      item.secondcategoryId,
      item.secondCategoryName
    ),
    institutionName: getInstituteName(item.institutionId, item.institutionName),
  }));

  const categoryFilterOptions = [
    ...new Map(
      tableData
        .filter((item) => item.categoryId != null && item.categoryName)
        .map((item) => [item.categoryId, { value: item.categoryId, label: item.categoryName }])
    ).values(),
  ].sort((a, b) => a.label.localeCompare(b.label));

  // Second-category options depend on the selected category (cascading).
  const secondCategoryFilterOptions = [
    ...new Map(
      tableData
        .filter(
          (item) =>
            item.secondcategoryId != null &&
            item.secondCategoryName &&
            (categoryFilter === "all" || item.categoryId === categoryFilter)
        )
        .map((item) => [item.secondcategoryId, { value: item.secondcategoryId, label: item.secondCategoryName }])
    ).values(),
  ].sort((a, b) => a.label.localeCompare(b.label));

  const keyword = search.trim().toLowerCase();
  const filteredData = tableData.filter((item) => {
    if (categoryFilter !== "all" && item.categoryId !== categoryFilter) return false;
    if (secondCategoryFilter !== "all" && item.secondcategoryId !== secondCategoryFilter) return false;
    if (!keyword) return true;
    return [
      item.categoryName,
      item.secondCategoryName,
      item.institutionName,
      item.title,
      item.path,
      item.description,
    ].some((field) => String(field ?? "").toLowerCase().includes(keyword));
  });

  const handleSubmit = async (values) => {
    try {
      const { payload, config } = buildSubCategoryPayload(values);

      if (mode === "edit" && selected) {
        await updateSubCategory(selected.id, payload, config);
        messageApi.success("Subcategory updated successfully.");
      } else {
        await createSubCategory(payload, config);
        messageApi.success("Subcategory created successfully.");
      }

      setOpen(false);
      setSelected(null);
      await loadSubCategories();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(
          error,
          mode === "edit"
            ? "Failed to update subcategory."
            : "Failed to create subcategory."
        )
      );
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteSubCategory(record.id);
      messageApi.success("Subcategory deleted successfully.");
      await loadSubCategories();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete subcategory."));
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setSecondCategories([]);
    await loadSecondCategoriesByCategory(categoryId);
  };

  return (
    <div className="w-full">
      {contextHolder}

      <h2 className="text-xl font-semibold text-[#9a2119] mb-5">
        Sub Category Management
      </h2>

      <div className="w-full">
      <SubCategoryTable
        data={filteredData}
        loading={loading}
        onAdd={() => {
          setMode("add");
          setSelected(null);
          setSecondCategories([]);
          setOpen(true);
        }}
        onEdit={async (record) => {
          setMode("edit");
          setSelected(record);
          await loadSecondCategoriesByCategory(record.categoryId);
          setOpen(true);
        }}
        onView={async (record) => {
          setMode("view");
          setSelected(record);
          await loadSecondCategoriesByCategory(record.categoryId);
          setOpen(true);
        }}
        onDelete={handleDelete}
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={(value) => {
          setCategoryFilter(value);
          setSecondCategoryFilter("all");
        }}
        categoryFilterOptions={categoryFilterOptions}
        secondCategoryFilter={secondCategoryFilter}
        onSecondCategoryFilterChange={setSecondCategoryFilter}
        secondCategoryFilterOptions={secondCategoryFilterOptions}
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
            ? "Add Subcategory"
            : mode === "edit"
              ? "Edit Subcategory"
              : "View Subcategory"
        }
      >
        <SubCategoryForm
          optionsLoading={optionsLoading}
          secondOptionsLoading={secondOptionsLoading}
          onSubmit={handleSubmit}
          initialValues={selected}
          mode={mode}
          categoryOptions={categories}
          secondCategoryOptions={secondCategories}
          institutionOptions={institutes}
          onCategoryChange={handleCategoryChange}
        />
      </Modal>
    </div>
  );
}
