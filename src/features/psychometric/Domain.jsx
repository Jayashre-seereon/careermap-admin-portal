import React, { useState } from "react";
import { Modal } from "antd";
import DomainForm from "./DomainForm";
import DomainTable from "./DomainTable";

const initialDomains = [
  {
    id: 1,
    name: "RIASEC",
    displayDomainName: "INTEREST",
    scoringType: "Likert",
    description: "Your interests are the areas, activities, or sub...",
    instruction: "Answer each statement based on what feels most natural to you.",
    domainWeightage: 4,
  },
  {
    id: 2,
    name: "APTITUDE",
    displayDomainName: "APTITUDE",
    scoringType: "MCQ",
    description: "Your aptitude reflects your natural ability to lea...",
    instruction: "Attempt all questions within the suggested time limit.",
    domainWeightage: 3,
  },
  {
    id: 3,
    name: "OCEAN",
    displayDomainName: "PERSONALITY",
    scoringType: "Likert 2",
    description: "Your personality is the unique combination of trai...",
    instruction: "Choose the option that best describes your usual behavior.",
    domainWeightage: 2,
  },
];

function Domain() {
  const [domains, setDomains] = useState(initialDomains);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [editId, setEditId] = useState(null);

  const filteredDomains = domains.filter((domain) => {
    const keyword = search.toLowerCase();

    return (
      domain.name?.toLowerCase().includes(keyword) ||
      domain.displayDomainName?.toLowerCase().includes(keyword) ||
      domain.scoringType?.toLowerCase().includes(keyword)
    );
  });

  const handleAdd = (values) => {
    setDomains((prev) => [...prev, { ...values, id: Date.now() }]);
    setOpen(false);
  };

  const handleDelete = (record) => {
    setDomains((prev) => prev.filter((item) => item.id !== record.id));
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
    setDomains((prev) =>
      prev.map((item) => (item.id === editId ? { ...values, id: editId } : item))
    );
    setOpen(false);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#9a2119]">
        Domain Management
      </h2>

      <DomainTable
        data={filteredDomains}
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
            ? "Add Domain"
            : mode === "edit"
            ? "Edit Domain"
            : "View Domain"
        }
      >
        <DomainForm
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}

export default Domain;
