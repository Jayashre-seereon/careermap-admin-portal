import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import SectionForm from "./SectionForm";
import SectionTable from "./SectionTable";

import {
  getAssessmentSections,
  createAssessmentSection,
  updateAssessmentSection,
  deleteAssessmentSection,
} from "../../api/sectionsApi";
import { getAssessments } from "../../api/assessment";

const domainOptions = [
  {
    label: "Interest (RIASEC)",
    value: "riasec",
  },
  {
    label: "Personality (OCEAN)",
    value: "ocean",
  },
  {
    label: "Learning Style (VARK)",
    value: "vark",
  },
  {
    label: "Values (Schwartz)",
    value: "schwartz",
  },
  {
    label: "Goal Orientation",
    value: "goal_orientation",
  },
  {
    label: "Aptitude",
    value: "aptitude",
  },
];

const getSectionList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.sections)) return data.sections;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.rows)) return data.rows;
  return [];
};

function Section() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [sections, setSections] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");

  const [selected, setSelected] = useState(null);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        const response = await getAssessments();
        setAssessments(response?.success ? response.data || [] : []);
      } catch (error) {
        console.error("Failed to load assessments:", error);
        message.error(error?.response?.data?.message || "Failed to load assessments");
      }
    };

    loadAssessments();
  }, []);

  // GET SECTIONS
  const fetchSections = async () => {
    try {
      setLoading(true);

      const response = await getAssessmentSections();

      if (response?.success) {
        setSections(getSectionList(response.data));
      } else {
        setSections([]);
      }
    } catch (error) {
      console.error("Get sections error:", error);

      message.error(
        error?.response?.data?.message || "Failed to load sections"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [assessmentId]);

  // SEARCH
  const filteredSections = getSectionList(sections).filter((section) => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return true;

    return (
      section.title?.toLowerCase().includes(keyword) ||
      section.code?.toLowerCase().includes(keyword) ||
      section.description?.toLowerCase().includes(keyword)
    );
  });

  // OPEN ADD
  const handleAddClick = () => {
    setMode("add");
    setSelected(null);
    setEditId(null);
    setOpen(true);
  };

  // ADD
  const handleAdd = async (values) => {
    try {
      const payload = {
        code: values.code,
        title: values.title,
        description: values.description || "",
        order: Number(values.order),
      };

      const selectedAssessmentId = values.assessmentId || assessmentId;

      if (!selectedAssessmentId) {
        message.error("Please select an assessment");
        return;
      }

      const response = await createAssessmentSection(
        selectedAssessmentId,
        payload
      );

      if (response?.success) {
        message.success("Section created successfully");

        setOpen(false);
        setSelected(null);

        // Keep the table as the exact result of the GET API, not local data.
        await fetchSections();
        navigate("/sections");
      } else {
        message.error(response?.message || "Failed to create section");
      }
    } catch (error) {
      console.error("Create section error:", error);

      message.error(
        error?.response?.data?.message || "Failed to create section"
      );
    }
  };

  // VIEW
  const handleView = (record) => {
    setSelected(record);
    setEditId(null);
    setMode("view");
    setOpen(true);
  };

  // EDIT
  const handleEdit = (record) => {
    setSelected(record);
    setEditId(record.id);
    setMode("edit");
    setOpen(true);
  };

  // UPDATE
  const handleUpdate = async (values) => {
    if (!editId) return;

    try {
      const payload = {
        code: values.code,
        title: values.title,
        description: values.description || "",
        order: Number(values.order),
      };

      const selectedAssessmentId = values.assessmentId || assessmentId;

      if (!selectedAssessmentId) {
        message.error("Please select an assessment");
        return;
      }

      const response = await updateAssessmentSection(
        editId,
        payload
      );

      if (response?.success) {
        message.success("Section updated successfully");

        setOpen(false);
        setSelected(null);
        setEditId(null);

        await fetchSections();
        navigate("/sections");
      } else {
        message.error(response?.message || "Failed to update section");
      }
    } catch (error) {
      console.error("Update section error:", error);

      message.error(
        error?.response?.data?.message || "Failed to update section"
      );
    }
  };

  // DELETE
  const handleDelete = async (record) => {
    try {
      const response = await deleteAssessmentSection(
        record.id
      );

      if (response?.success) {
        message.success("Section deleted successfully");

        await fetchSections();
      } else {
        message.error(response?.message || "Failed to delete section");
      }
    } catch (error) {
      console.error("Delete section error:", error);

      message.error(
        error?.response?.data?.message || "Failed to delete section"
      );
    }
  };

  // CLOSE MODAL
  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setEditId(null);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#9a2119]">
        Section Management
      </h2>

      <SectionTable
        data={filteredSections}
        search={search}
        onSearch={setSearch}
        onAddClick={handleAddClick}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
        loading={loading}
      />

      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        width={900}
        destroyOnClose
        title={
          mode === "add"
            ? "Add Section"
            : mode === "edit"
              ? "Edit Section"
              : "View Section"
        }
      >
        <SectionForm
          domainOptions={domainOptions}
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected ? {
            ...selected,
            assessmentId: selected.assessmentId || assessmentId,
          } : null}
          assessmentOptions={assessments.map((assessment) => ({
            label: assessment.title,
            value: String(assessment.id),
          }))}
          assessmentId={assessmentId}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}

export default Section;
