import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import Category2Table from "./Category2Table";
import Category2Form from "./Category2Form";
import {
  createSecondaryCategory,
  deleteSecondaryCategory,
  getSecondaryCategories,
  updateSecondaryCategory,
} from "../../api/secondaryCategory";
import { getCategories } from "../../api/category";
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

const stripHtml = (value = "") =>
  value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

const htmlListFromArray = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
};

const factsToArray = (value = "") =>
  stripHtml(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeFacts = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return factsToArray(value);
    }
  }

  return [];
};

const buildSecondaryCategoryPayload = ({
  category,
  institution,
  name,
  path,
  image,
  coverImage,
  description,
  specialisation,
  importantFacts,
}) => {
  const payload = {
    categoryId: category,
    institutionId: institution || null,
    name,
    path: path || "",
    description: description || "",
    specialization: stripHtml(specialisation),
    importandt_facts: JSON.stringify(factsToArray(importantFacts)),
  };

  const imageFile = extractFile(image);
  const coverImageFile = extractFile(coverImage);

  if (!imageFile && !coverImageFile) {
    return { payload, config: {} };
  }

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  if (imageFile) {
    formData.append("image", imageFile);
  }

  if (coverImageFile) {
    formData.append("coverImage", coverImageFile);
  }

  return {
    payload: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  };
};

const mapSecondaryCategory = (item = {}) => ({
  id: item.id,
  category: item.categoryId || item.category?.id || item.category || undefined,
  categoryName: item.category?.name || item.categoryName || "",
  institution:
    item.institutionId || item.institution?.id || item.institution || undefined,
  institutionName: item.institution?.name || item.institutionName || "",
  name: item.name || "",
  path: item.path || "",
  image: item.image || null,
  coverImage: item.coverImage || null,
  description: item.description || "",
  specialisation: item.specialization || item.specialisation || "",
  importantFacts: htmlListFromArray(
    normalizeFacts(
      item.important_facts || item.importandt_facts || item.importantFacts
    )
  ),
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const mapCategory = (item = {}) => ({
  id: item.id,
  title: item.title || item.name || "",
});

const mapInstitute = (item = {}) => ({
  id: item.id,
  name: item.name || "",
});

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
      setData(normalizeList(response).map(mapSecondaryCategory));
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

      setCategories(normalizeList(categoryResponse).map(mapCategory));
      setInstitutes(normalizeList(instituteResponse).map(mapInstitute));
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

  const handleSubmit = async (values) => {
    try {
      const { payload, config } = buildSecondaryCategoryPayload(values);

      if (mode === "edit" && selected) {
        await updateSecondaryCategory(selected.id, payload, config);
        messageApi.success("Secondary category updated successfully.");
      } else {
        await createSecondaryCategory(payload, config);
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
          onAdd={() => {
            setMode("add");
            setSelected(null);
            setOpen(true);
          }}
          onEdit={(record) => {
            setMode("edit");
            setSelected(record);
            setOpen(true);
          }}
          onView={(record) => {
            setMode("view");
            setSelected(record);
            setOpen(true);
          }}
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
