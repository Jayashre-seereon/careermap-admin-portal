import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import { getApiErrorMessage } from "../../api/authApi";
import StaffForm from "./StaffForm";
import StaffTable from "./StaffTable";
import { getStaffs, getStaffById, createStaff, updateStaff, deleteStaff } from "../../api/rolePermission";
import { getRoles } from "../../api/rolePermission";

function Staff() {
  const [sections, setSections] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [editId, setEditId] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredSections = sections.filter((section) => {
    const keyword = search.trim().toLowerCase();
    if (roleFilter !== "all" && section.roleId !== roleFilter) return false;
    if (!keyword) return true;
    const roleName = roles.find((role) => role.id === section.roleId)?.name || "";
    return (
      section.name?.toLowerCase().includes(keyword) ||
      section.email?.toLowerCase().includes(keyword) ||
      roleName.toLowerCase().includes(keyword)
    );
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [staffRes, roleRes] = await Promise.all([getStaffs(), getRoles()]);
      setSections(Array.isArray(staffRes) ? staffRes : staffRes.data || []);
      setRoles(Array.isArray(roleRes) ? roleRes : roleRes.data || []);
    } catch (err) {
      console.error(err);
      message.error(getApiErrorMessage(err, "Failed to load staff."));
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (values) => {
    try {
      await createStaff(values);
      await fetchData();
      setOpen(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateStaff(editId, values);
      await fetchData();
      setOpen(false);
      setEditId(null);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDelete = async (record) => {
    try {
      if (!record?.id) return;
      await deleteStaff(record.id);
      await fetchData();
      message.success("Staff deleted successfully.");
    } catch (err) {
      console.error(err);
      message.error(getApiErrorMessage(err, "Failed to delete staff."));
    }
  };

  const handleSelectStaff = async (record, nextMode) => {
    if (!record?.id) return;
    setEditId(record.id);
    setMode(nextMode);
    setOpen(true);
    try {
      const response = await getStaffById(record.id);
      const staff = response?.data?.staff || response?.data || response?.staff || response;
      setSelected(staff && typeof staff === "object" ? staff : record);
    } catch (err) {
      console.error(err);
      setSelected(record);
    }
  };

  const handleView = (record) => {
    handleSelectStaff(record, "view");
  };

  const handleEdit = (record) => {
    handleSelectStaff(record, "edit");
  };

  const modalTitle =
    mode === "add" ? "Add Staff" : mode === "edit" ? "Edit Staff" : "View Staff";

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#9a2119]">Staff Management</h2>

      <StaffTable
        data={filteredSections}
        roles={roles}
        loading={loading}
        search={search}
        onSearch={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
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
        title={modalTitle}
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelected(null);
          setEditId(null);
        }}
        footer={null}
        width={900}
        destroyOnClose
      >
        <StaffForm
          mode={mode}
          roles={roles}
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}

export default Staff;
