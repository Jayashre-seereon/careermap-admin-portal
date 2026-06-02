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
import { formatDateDisplay, formatDateForPayload, parseDateValue } from "../../utils/date";

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
  return formatDateForPayload(value);
};

const formatDateForAvailability = (value) => {
  return formatDateForPayload(value);
};

const formatTimeValue = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value?.format === "function") {
    return value.format("HH:mm");
  }

  return "";
};

const normalizeTimeValue = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value?.format === "function") {
    return value;
  }

  const text = String(value).trim();
  if (!text) {
    return null;
  }

  const normalizedText = text.length === 5 ? `${text}:00` : text;
  const parsedTime = dayjs(`1970-01-01T${normalizedText}`);
  return parsedTime.isValid() ? parsedTime : null;
};

const normalizeAvailability = (item = {}) => {
  const availability = Array.isArray(item.availability) ? item.availability : [];

  if (availability.length > 0) {
    return availability
      .map((entry) => ({
        date: parseDateValue(entry?.date),
        timeSlots: Array.isArray(entry?.timeSlots) && entry.timeSlots.length > 0
          ? entry.timeSlots.map(normalizeTimeValue).filter(Boolean)
          : [null],
      }))
      .filter((entry) => entry.date || entry.timeSlots.some(Boolean));
  }

  const legacyDate = item.available_date || item.availableDate || "";
  const legacyTime = item.available_time || item.availableTime || "";

  if (!legacyDate && !legacyTime) {
    return [];
  }

  const legacyTimeSlots = Array.isArray(legacyTime)
    ? legacyTime.map(normalizeTimeValue).filter(Boolean)
    : String(legacyTime)
        .split(",")
        .map((slot) => normalizeTimeValue(slot.trim()))
        .filter(Boolean);

  return [
    {
      date: parseDateValue(legacyDate),
      timeSlots: legacyTimeSlots.length > 0 ? legacyTimeSlots : [null],
    },
  ];
};

const normalizeAvailabilityForPayload = (availability = []) =>
  availability
    .map((entry) => {
      const date = formatDateForAvailability(entry?.date);
      const timeSlots = Array.isArray(entry?.timeSlots)
        ? entry.timeSlots.map(formatTimeValue).filter(Boolean)
        : [];

      if (!date && timeSlots.length === 0) {
        return null;
      }

      return {
        date,
        timeSlots,
      };
    })
    .filter(Boolean);

const formatAvailabilitySummary = (availability = []) => {
  if (!Array.isArray(availability) || availability.length === 0) {
    return "-";
  }

  return availability
    .map((entry) => {
      const dateText = formatDateDisplay(entry?.date);
      const timeText = Array.isArray(entry?.timeSlots) && entry.timeSlots.length > 0
        ? entry.timeSlots.join(", ")
        : "-";

      return `${dateText}: ${timeText}`;
    })
    .join(" | ");
};

const buildMentorPayload = ({
  name,
  email,
  phone_number,
  dateof_birth,
  availability,
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
    name,
    email: email || "",
    phone_number: phone_number || "",
    dateof_birth: formatDateValue(dateof_birth),
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
  const normalizedAvailability = normalizeAvailabilityForPayload(availability);

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

  if (normalizedAvailability.length > 0) {
    formData.append("availability", JSON.stringify(normalizedAvailability));
  }

  return {
    payload: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  };
};

const mapMentor = (item = {}) => ({
  id: item.id,
  name: item.name || "",
  email: item.email || "",
  phone_number: item.phone_number || "",
  dateof_birth: formatDateDisplay(item.dateof_birth),
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
  availability: normalizeAvailability(item),
});

export default function MentorPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    loadMentors();
  }, []);

  const tableData = mentors.map((item) => ({
    ...item,
    dob: formatDateDisplay(item.dateof_birth),
    availabilitySummary: formatAvailabilitySummary(item.availability),
  }));

  const filteredMentors = tableData.filter((mentor) =>
    `${mentor.name} ${mentor.email} ${mentor.phone_number} ${mentor.designation} ${mentor.education} ${mentor.availabilitySummary}`
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
        />
      </Modal>
    </div>
  );
}
