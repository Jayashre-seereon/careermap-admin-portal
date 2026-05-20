import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import InstitutionTable from "./InstitutionTable";
import InstitutionForm from "./InstitutionForm";
import {
  createInstitute,
  deleteInstitute,
  getInstitutes,
  mapInstitute,
  updateInstitute,
} from "../../api/institute";

const getApiErrorMessage = (error, fallbackMessage) => {
  const backendMessage =
    error.response?.data?.message || error.message || fallbackMessage;

  return backendMessage;
};

export default function InstitutionPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [institutes, setInstitutes] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadInstitutes = async () => {
    try {
      setLoading(true);
      const response = await getInstitutes();
      const list = response?.data;
      const normalized = Array.isArray(list)
        ? list
        : list && typeof list === "object"
          ? [list]
          : [];

      setInstitutes(normalized.map(mapInstitute));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load institutes."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstitutes();
  }, []);

  const handleAdd = async (values) => {
    try {
      await createInstitute(values);
      messageApi.success("Institute created successfully.");
      setOpen(false);
      setSelected(null);
      await loadInstitutes();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to create institute."));
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateInstitute(selected.id, values);
      messageApi.success("Institute updated successfully.");
      setOpen(false);
      setSelected(null);
      await loadInstitutes();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to update institute."));
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteInstitute(record.id);
      messageApi.success("Institute deleted successfully.");
      await loadInstitutes();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete institute."));
    }
  };

  const filteredInstitutes = institutes.filter((item) =>
    `${item.name} ${item.address} ${item.city} ${item.state} ${item.country}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {contextHolder}

      <InstitutionTable
        data={filteredInstitutes}
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
        loading={loading}
      />

      <Modal
        title={
          mode === "add"
            ? "Add Institution"
            : mode === "edit"
              ? "Edit Institution"
              : "View Institution"
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
        <InstitutionForm
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}
