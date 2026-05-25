import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import dayjs from "dayjs";
import MentorForm from "./MentorForm";
import MentorTable from "./MentorTable";
import {
  createMentor,
  deleteMentor,
  getMentors,
  updateMentor,
} from "../../api/mentor";
import { getCategories } from "../../api/category";
import { getSubCategories } from "../../api/subcategory";

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

const formatDateValue = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? value : parsedDate.toISOString();
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString();
  }

  return "";
};

const formatTimeValue = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value?.format === "function") {
    return value.format("HH:mm:ss");
  }

  return "";
};

const buildMentorPayload = ({
  categoryId,
  subCategoryId,
  name,
  email,
  phone_number,
  dateof_birth,
  available_date,
  available_time,
  designation,
  education,
  placeof_word,
  linkedin,
  facebook,
  skill,
  experience,
  mentor_fees,
  rank,
  image,
  resume,
  description,
  status,
}) => {
  const payload = {
    categoryId,
    subCategoryId,
    name,
    email: email || "",
    phone_number: phone_number || "",
    dateof_birth: formatDateValue(dateof_birth),
    available_date: formatDateValue(available_date),
    available_time: formatTimeValue(available_time),
    designation: designation || "",
    education: education || "",
    placeof_word: placeof_word || "",
    linkedin: linkedin || "",
    facebook: facebook || "",
    skill: skill || "",
    experience: experience ? Number(experience) : 0,
    mentor_fees: mentor_fees || "",
    rank: rank || "",
    description: description || "",
    status: !!status,
  };

  const imageFile = extractFile(image);
  const resumeFile = extractFile(resume);
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  if (imageFile) {
    formData.append("image", imageFile);
  }

  if (resumeFile) {
    formData.append("resume", resumeFile);
  }

  return {
    payload: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  };
};

const mapMentor = (item = {}) => ({
  id: item.id,
  categoryId: item.categoryId || item.category?.id || undefined,
  subCategoryId:
    item.subCategoryId || item.subcategoryId || item.subcategory?.id || undefined,
  name: item.name || "",
  email: item.email || "",
  phone_number: item.phone_number || "",
  dateof_birth: item.dateof_birth || "",
  available_date: item.available_date || item.availableDate || "",
  available_time: item.available_time || item.availableTime || "",
  designation: item.designation || "",
  education: item.education || "",
  placeof_word: item.placeof_word || "",
  linkedin: item.linkedin || "",
  facebook: item.facebook || "",
  skill: item.skill || "",
  experience: item.experience ?? "",
  mentor_fees: item.mentor_fees || "",
  rank: item.rank || "",
  image: item.image || null,
  resume: item.resume || null,
  description: item.description || "",
  status: item.status ?? false,
  categoryName: item.category?.title || item.categoryName || "",
  subCategoryName:
    item.subcategory?.title || item.subCategory?.title || item.subCategoryName || "",
});

const mapCategory = (item = {}) => ({
  id: item.id,
  title: item.title || item.name || "",
});

const mapSubcategory = (item = {}) => ({
  id: item.id,
  title: item.title || item.name || "",
  categoryId: item.categoryId || item.category?.id || undefined,
});

export default function MentorPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const loadMentors = async () => {
    try {
      setLoading(true);
      const response = await getMentors();
      setMentors(normalizeList(response).map(mapMentor));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load mentors."));
    } finally {
      setLoading(false);
    }
  };

  const loadDropdowns = async () => {
    try {
      const [categoryResponse, subcategoryResponse] = await Promise.all([
        getCategories(),
        getSubCategories(),
      ]);

      setCategories(normalizeList(categoryResponse).map(mapCategory));
      setSubcategories(normalizeList(subcategoryResponse).map(mapSubcategory));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load mentor options."));
    }
  };

  useEffect(() => {
    loadMentors();
    loadDropdowns();
  }, []);

  const getCategoryName = (id, fallbackName = "") =>
    fallbackName || categories.find((item) => item.id === id)?.title || "";

  const getSubcategoryName = (id, fallbackName = "") =>
    fallbackName || subcategories.find((item) => item.id === id)?.title || "";

  const tableData = mentors.map((item) => ({
    ...item,
    categoryName: getCategoryName(item.categoryId, item.categoryName),
    subCategoryName: getSubcategoryName(item.subCategoryId, item.subCategoryName),
    dob: item.dateof_birth ? dayjs(item.dateof_birth).format("DD-MM-YYYY") : "-",
  }));

  const filteredMentors = tableData.filter((mentor) =>
    `${mentor.name} ${mentor.email} ${mentor.phone_number} ${mentor.categoryName} ${mentor.subCategoryName} ${mentor.designation} ${mentor.education} ${mentor.available_date} ${mentor.available_time}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSubmit = async (values) => {
    try {
      const { payload, config } = buildMentorPayload(values);

      if (mode === "edit" && selected) {
        await updateMentor(selected.id, payload, config);
        messageApi.success("Mentor updated successfully.");
      } else {
        await createMentor(payload, config);
        messageApi.success("Mentor created successfully.");
      }

      setOpen(false);
      setSelected(null);
      await loadMentors();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(
          error,
          mode === "edit" ? "Failed to update mentor." : "Failed to create mentor."
        )
      );
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteMentor(record.id);
      messageApi.success("Mentor deleted successfully.");
      await loadMentors();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete mentor."));
    }
  };

  return (
    <div className="space-y-5">
      {contextHolder}

      <h2 className="text-xl font-bold text-[#9a2119]">Mentor Management</h2>

      <MentorTable
        data={filteredMentors}
        loading={loading}
        search={search}
        onSearch={setSearch}
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
        title={
          mode === "add" ? "Add Mentor" : mode === "edit" ? "Edit Mentor" : "View Mentor"
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
        <MentorForm
          onSubmit={handleSubmit}
          initialValues={selected}
          disabled={mode === "view"}
          categoryOptions={categories}
          subcategoryOptions={subcategories}
        />
      </Modal>
    </div>
  );
}
