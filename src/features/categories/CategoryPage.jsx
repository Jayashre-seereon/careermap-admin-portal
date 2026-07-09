import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  updateCategoryPreviewAccess,
} from "../../api/category";
import { getStreams } from "../../api/stream";
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

const htmlListFromArray = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
};

const normalizeEditorValue = (value) => {
  if (Array.isArray(value)) {
    if (value.length === 1 && typeof value[0] === "string") {
      return value[0];
    }

    return htmlListFromArray(value);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return htmlListFromArray(parsed);
      }

      return typeof parsed === "string" ? parsed : value;
    } catch {
      return value;
    }
  }

  return "";
};

const toStringArray = (value) => {
  if (!value) {
    return [];
  }

  return [value];
};

const stringifyStringArray = (value) => JSON.stringify(toStringArray(value));

const buildCategoryPayload = ({
  stream,
  institutions,
  title,
  howToBecome,
  file,
  coverImage,
  description,
  specialisation,
  importantFacts,
  isUpgrade,
}) => {
  const payload = {
    streamId: stream,
    institutionId: Array.isArray(institutions) ? institutions[0] : institutions,
    title,
    path: howToBecome || null,
    description: description || "",
    specialization: specialisation || "",
    importandt_facts: stringifyStringArray(importantFacts),
    category_access: isUpgrade === "Free",
  };

  const fileValue = extractFile(file);
  const coverImageValue = extractFile(coverImage);

  if (!fileValue && !coverImageValue) {
    return { payload, config: {} };
  }

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  if (fileValue) {
    formData.append("file", fileValue);
  }

  if (coverImageValue) {
    formData.append("coverImage", coverImageValue);
  }

  return {
    payload: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  };
};
const handleTogglePreview = async (
  record,
  checked
) => {
  try {
    await updateCategoryPreviewAccess(
      record.id,
      checked
    );

    messageApi.success(
      "Preview access updated successfully."
    );

    loadCategories();
  } catch (error) {
    messageApi.error(
      "Failed to update preview access."
    );
  }
};
const mapCategory = (item = {}) => ({
  id: item.id,
  stream: item.streamId || item.stream?.id || item.stream || undefined,
  streamObj: item.stream || null,
  institutions:
    item.institutionId || item.institution?.id || item.institution
      ? [item.institutionId || item.institution?.id || item.institution]
      : [],
  title: item.title || "",
  howToBecome: item.path || "",
  file: item.file || null,
  coverImage: item.coverImage || null,
  description: normalizeEditorValue(item.description || ""),
  specialisation: normalizeEditorValue(
    item.specialization || item.specialisation || ""
  ),
  importantFacts: normalizeEditorValue(
    item.important_facts || item.importandt_facts || item.importantFacts
  ),
  isUpgrade:
    item.category_access === false || item.isUpgrade === "Premium"
      ? "Premium"
      : "Free",
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const mapStream = (item = {}) => ({
  id: item.id,
  name: item.name || "",
});

const mapInstitute = (item = {}) => ({
  id: item.id,
  name: item.name || "",
});

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
      setData(normalizeList(response).map(mapCategory));
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

      setStreams(normalizeList(streamResponse).map(mapStream));
      setInstitutes(normalizeList(instituteResponse).map(mapInstitute));
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
      const { payload, config } = buildCategoryPayload(values);
      await createCategory(payload, config);
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
      const { payload, config } = buildCategoryPayload(values);
      await updateCategory(selected.id, payload, config);
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
        onTogglePreview={handleTogglePreview}
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
