import React, { useState } from "react";
import { Modal } from "antd";
import SectionForm from "./SectionForm";
import SectionTable from "./SectionTable";

const domainOptions = [
  { label: "RIASEC", value: "RIASEC" },
  { label: "Aptitude", value: "Aptitude" },
  { label: "Ocean", value: "Ocean" },
  { label: "Goal Orientation", value: "Goal Orientation" },
  { label: "Vark", value: "Vark" },
  { label: "Work Values", value: "Work Values" },
];

const initialSections = [
  {
    id: 1,
    name: "Spatial",
    code: "Spatial",
    domain: "Aptitude",
    keyTraits: "Visual thinker, imaginative, perceptive about shapes, forms, and dimensions. Strong ability to visualize objects, patterns, and spatial relationships in 2D and 3D",
    enjoys: "Drawing, design, architecture, puzzles, visual planning, 3D modeling, and interpreting maps or blueprints.",
    idealEnvironments: "Design, architecture, engineering, animation, urban planning, surgery, or any field that requires visualization and manipulation of spatial information.",
    low: "Needs more exposure",
    mid: "Moderate preference",
    high: "Strong fit",
    description: "You have a powerful visual imagination and can “se...",
    image: null,
  },
  {
    id: 2,
    name: "Verbal",
    code: "Verbal",
    domain: "Aptitude",
    keyTraits: "Articulate, expressive, logical in communication, skilled in reading comprehension and language use. Strong ability to understand, analyze, and convey ideas through words — both spoken and written.",
    enjoys: "Debating, writing essays or articles, reading literature, storytelling, public speaking, and analyzing text.",
    idealEnvironments: "Communication-rich spaces — education, media, law, psychology, marketing, or public relations — where ideas and clarity of expression matter.",
    low: "Foundational support",
    mid: "Developing strength",
    high: "Advanced strength",
    description: "You are persuasive and articulate, with a talent f...",
    image: null,
  },
  {
    id: 3,
    name: "Self-Transcendence",
    code: "Self-Transcendence",
    domain: "WORK VALUES",
    keyTraits: "Curious, imaginative, flexible",
    enjoys: "Ideas, creativity, exploration",
    idealEnvironments: "Creative and research-oriented spaces",
    low: "May prioritize self-interest over collective well-being.",
    mid: "Balances personal goals with concern for others.",
    high: "Driven by altruism, social justice, and empathy. Strong concern for others.",
    description: "Focuses on helping and caring for those in close c...",
    image: null,
  },
];

function Section() {
  const [sections, setSections] = useState(initialSections);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [editId, setEditId] = useState(null);

  const filteredSections = sections.filter((section) => {
    const keyword = search.toLowerCase();

    return (
      section.name?.toLowerCase().includes(keyword) ||
      section.code?.toLowerCase().includes(keyword) ||
      section.domain?.toLowerCase().includes(keyword)
    );
  });

  const handleAdd = (values) => {
    setSections((prev) => [
      ...prev,
      {
        ...values,
        id: Date.now(),
        low: values.low || "-",
        mid: values.mid || "-",
        high: values.high || "-",
      },
    ]);
    setOpen(false);
  };

  const handleDelete = (record) => {
    setSections((prev) => prev.filter((item) => item.id !== record.id));
  };

  const handleView = (record) => {
    setSelected(record);
    setMode("view");
    setOpen(true);
  };

  const handleEdit = (record) => {
    setSelected(record);
    setEditId(record.id);
    setMode("edit");
    setOpen(true);
  };

  const handleUpdate = (values) => {
    setSections((prev) =>
      prev.map((item) =>
        item.id === editId
          ? {
              ...item,
              ...values,
              id: editId,
              low: values.low || item.low || "-",
              mid: values.mid || item.mid || "-",
              high: values.high || item.high || "-",
            }
          : item
      )
    );
    setOpen(false);
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
        onAddClick={() => {
          setMode("add");
          setSelected(null);
          setEditId(null);
          setOpen(true);
        }}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={900}
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
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}

export default Section;
