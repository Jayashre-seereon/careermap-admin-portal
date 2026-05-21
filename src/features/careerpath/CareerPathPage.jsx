import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import CareerPathTable from "./CareerPathTable";
import CareerPathForm from "./CareerPathForm";
import {
  createCareerPath,
  deleteCareerPath,
  getCareerPaths,
  updateCareerPath,
} from "../../api/careerpath";
import { getModules } from "../../api/module";
import { getCategories } from "../../api/category";
import { getSecondaryCategories } from "../../api/secondaryCategory";
import { getSubCategories } from "../../api/subcategory";
import { getPaths } from "../../api/path";

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

const mapOption = (item = {}, labelKeys = []) => ({
  id: item.id,
  label: labelKeys.map((key) => item[key]).find(Boolean) || "",
});

const mapCareerPath = (item = {}) => ({
  id: item.id,
  moduleId: item.moduleId || item.module?.id || undefined,
  categoryId: item.categoryId || item.category?.id || undefined,
  secondcategoryId:
    item.secondcategoryId || item.secondcategory?.id || item.secondCategory?.id || undefined,
  subcategoryId: item.subcategoryId || item.subcategory?.id || undefined,
  pathId: item.pathId || item.path?.id || undefined,
  graduation: item.graduation || "",
  aftergraduation: item.aftergraduation || "",
  afterpostgraduation: item.afterpostgraduation || "",
  anyother: item.anyother || "",
  moduleName: item.module?.title || item.moduleName || "",
  categoryName: item.category?.title || item.category?.name || item.categoryName || "",
  secondCategoryName:
    item.secondcategory?.name ||
    item.secondCategory?.name ||
    item.secondcategory?.title ||
    item.secondCategory?.title ||
    item.secondCategoryName ||
    "",
  subcategoryName: item.subcategory?.title || item.subcategoryName || "",
  pathTypeName: item.path?.pathtype || item.pathTypeName || "",
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const buildCareerPathPayload = ({
  moduleId,
  categoryId,
  secondcategoryId,
  subcategoryId,
  pathId,
  graduation,
  aftergraduation,
  afterpostgraduation,
  anyother,
}) => ({
  moduleId,
  categoryId,
  secondcategoryId,
  subcategoryId,
  pathId,
  graduation: graduation || "",
  aftergraduation: aftergraduation || "",
  afterpostgraduation: afterpostgraduation || null,
  anyother: anyother || null,
});

export default function CareerPathPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [mode, setMode] = useState("add");
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [secondCategories, setSecondCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [paths, setPaths] = useState([]);

  const loadCareerPaths = async () => {
    try {
      setLoading(true);
      const response = await getCareerPaths();
      setData(normalizeList(response).map(mapCareerPath));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load career paths."));
    } finally {
      setLoading(false);
    }
  };

  const loadDropdowns = async () => {
    try {
      const [
        moduleResponse,
        categoryResponse,
        secondCategoryResponse,
        subcategoryResponse,
        pathResponse,
      ] = await Promise.all([
        getModules(),
        getCategories(),
        getSecondaryCategories(),
        getSubCategories(),
        getPaths(),
      ]);

      setModules(normalizeList(moduleResponse).map((item) => mapOption(item, ["title", "name"])));
      setCategories(normalizeList(categoryResponse).map((item) => mapOption(item, ["title", "name"])));
      setSecondCategories(
        normalizeList(secondCategoryResponse).map((item) => ({
          ...mapOption(item, ["name", "title"]),
          categoryId: item.categoryId || item.category?.id || undefined,
        }))
      );
      setSubcategories(
        normalizeList(subcategoryResponse).map((item) => ({
          ...mapOption(item, ["title", "name"]),
          categoryId: item.categoryId || item.category?.id || undefined,
          secondcategoryId:
            item.secondcategoryId ||
            item.secondCategoryId ||
            item.secondcategory?.id ||
            item.secondCategory?.id ||
            undefined,
        }))
      );
      setPaths(normalizeList(pathResponse).map((item) => mapOption(item, ["pathtype", "title"])));
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, "Failed to load career path form options.")
      );
    }
  };

  useEffect(() => {
    loadCareerPaths();
    loadDropdowns();
  }, []);

  const getLabel = (items, id, fallback = "") => {
    if (fallback) {
      return fallback;
    }

    return items.find((item) => item.id === id)?.label || "";
  };

  const tableData = data.map((item) => ({
    ...item,
    moduleName: getLabel(modules, item.moduleId, item.moduleName),
    categoryName: getLabel(categories, item.categoryId, item.categoryName),
    secondCategoryName: getLabel(
      secondCategories,
      item.secondcategoryId,
      item.secondCategoryName
    ),
    subcategoryName: getLabel(subcategories, item.subcategoryId, item.subcategoryName),
    pathTypeName: getLabel(paths, item.pathId, item.pathTypeName),
  }));

  const filteredData = tableData.filter((item) =>
    `${item.moduleName} ${item.categoryName} ${item.secondCategoryName} ${item.subcategoryName} ${item.pathTypeName} ${item.graduation} ${item.aftergraduation} ${item.afterpostgraduation} ${item.anyother}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSubmit = async (values) => {
    try {
      const payload = buildCareerPathPayload(values);

      if (mode === "edit" && current) {
        await updateCareerPath(current.id, payload);
        messageApi.success("Career path updated successfully.");
      } else {
        await createCareerPath(payload);
        messageApi.success("Career path created successfully.");
      }

      setOpen(false);
      setCurrent(null);
      await loadCareerPaths();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(
          error,
          mode === "edit"
            ? "Failed to update career path."
            : "Failed to create career path."
        )
      );
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteCareerPath(record.id);
      messageApi.success("Career path deleted successfully.");
      await loadCareerPaths();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete career path."));
    }
  };

  return (
    <div className="w-full">
      {contextHolder}

      <h1 className="text-xl font-semibold text-[#9a2119] mb-4">
        Career Path Management
      </h1>

      <CareerPathTable
        onAdd={() => {
          setOpen(true);
          setCurrent(null);
          setMode("add");
        }}
        onView={(record) => {
          setCurrent(record);
          setMode("view");
          setOpen(true);
        }}
        onEdit={(record) => {
          setCurrent(record);
          setMode("edit");
          setOpen(true);
        }}
        onDelete={handleDelete}
        data={filteredData}
        loading={loading}
        search={search}
        onSearch={setSearch}
      />

      <Modal
        open={open}
        footer={null}
        onCancel={() => {
          setOpen(false);
          setCurrent(null);
        }}
        width={900}
        destroyOnClose
        title={
          mode === "add"
            ? "Add Career Path"
            : mode === "edit"
              ? "Edit Career Path"
              : "View Career Path"
        }
      >
        <CareerPathForm
          initialValues={current}
          mode={mode}
          onSubmit={handleSubmit}
          moduleOptions={modules}
          categoryOptions={categories}
          secondCategoryOptions={secondCategories}
          subcategoryOptions={subcategories}
          pathOptions={paths}
        />
      </Modal>
    </div>
  );
}
