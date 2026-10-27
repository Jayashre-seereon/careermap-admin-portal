import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import RoleTable from "./RoleTable";
import RoleForm from "./RoleForm";
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from "../../api/rolePermission";

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

const mapRole = (item = {}) => ({
  id: item.id,
  name: item.name || "",
  description: item.description || "",
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const getDeleteRoleErrorMessage = (error) => {
  const responseData = error?.response?.data;
  const rawBackendMessage = [
    responseData?.message,
    responseData?.error,
    responseData?.error?.message,
    responseData?.detail,
    responseData?.data?.message,
    responseData?.data?.error,
    typeof responseData === "string" ? responseData : null,
  ].find((candidate) => typeof candidate === "string" && candidate.trim());

  const backendText = `${rawBackendMessage || ""} ${error?.message || ""}`;
  if (/StaffUser_roleId_fkey|foreign key constraint|violates RESTRICT|roleId.*StaffUser/i.test(backendText)) {
    return "This role is assigned to staff. Reassign them first.";
  }

  const candidates = [
    rawBackendMessage,
    responseData?.errors,
  ];

  const backendMessage = candidates.find((candidate) =>
    typeof candidate === "string" && candidate.trim()
  );
  if (backendMessage) return backendMessage.trim();

  const validationErrors = candidates.find(Array.isArray);
  if (validationErrors?.length) {
    return validationErrors
      .map((item) => typeof item === "string" ? item : item?.message)
      .filter(Boolean)
      .join(" ");
  }

  if (responseData?.errors && typeof responseData.errors === "object") {
    const validationMessage = Object.values(responseData.errors)
      .flatMap((value) => Array.isArray(value) ? value : [value])
      .filter((value) => typeof value === "string" && value.trim())
      .join(" ");
    if (validationMessage) return validationMessage;
  }

  if (error?.response?.status === 409) {
    return "This role is assigned to staff and cannot be deleted. Reassign the staff first.";
  }

  return error?.message || "Failed to delete role.";
};

export default function RolePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await getRoles();
      setRoles(normalizeList(response).map(mapRole));
    } catch (error) {
      messageApi.error(error.response?.data?.message || error.message || "Failed to load roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleAdd = async (values) => {
    try {
      await createRole(values);
      messageApi.success("Role created successfully.");
      setOpen(false);
      setSelected(null);
      await loadRoles();
    } catch (error) {
      messageApi.error(error.response?.data?.message || error.message || "Failed to create role.");
      throw error;
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateRole(selected.id, values);
      messageApi.success("Role updated successfully.");
      setOpen(false);
      setSelected(null);
      await loadRoles();
    } catch (error) {
      messageApi.error(error.response?.data?.message || error.message || "Failed to update role.");
      throw error;
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteRole(record.id);
      messageApi.success("Role deleted successfully.");
      await loadRoles();
    } catch (error) {
      messageApi.error(getDeleteRoleErrorMessage(error));
    }
  };

  const filteredRoles = roles.filter((item) =>
    `${item.name} ${item.description}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {contextHolder}

      <RoleTable
        data={filteredRoles}
        search={search}
        onSearch={setSearch}
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
      />

      <Modal
        title={
          mode === "add" ? "Add Role" : mode === "edit" ? "Edit Role" : "View Role"
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelected(null);
        }}
        footer={null}
        width={700}
        destroyOnClose
      >
        <RoleForm
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}
