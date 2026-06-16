import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import PermissionForm from "./PermissionForm";
import PermissionTable from "./PermissionTable";
import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  getRoles,
} from "../../api/rolePermission";

function Permission() {
  const [sections, setSections] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [editId, setEditId] = useState(null);

  const filteredSections = sections.filter((section) => {
    const keyword = search.toLowerCase();
    const roleName = roles.find((role) => role.id === section.roleId)?.name || "";
    const modulesMatch = Array.isArray(section.modules)
      ? section.modules.some((m) => m.toLowerCase().includes(keyword))
      : false;
    return roleName.toLowerCase().includes(keyword) || modulesMatch;
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Backend returns a single `module` string per record.
  // Normalize it into `modules` array just so the table UI (which
  // renders a `modules` tag list) and the form (Checkbox.Group expects
  // an array) keep working without changing their code.
  const normalizeRecord = (record) => ({
    ...record,
    modules: Array.isArray(record.modules)
      ? record.modules
      : record.module
      ? [record.module]
      : [],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [permRes, roleRes] = await Promise.all([getPermissions(), getRoles()]);
      const permList = Array.isArray(permRes) ? permRes : permRes.data || [];
      const roleList = Array.isArray(roleRes) ? roleRes : roleRes.data || [];
      setSections(permList.map(normalizeRecord));
      setRoles(roleList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Form gives us { roleId, modules: [...] }.
  // Backend expects a plain string field, so we unwrap the first
  // selected module before sending. Single API call, no loop.
  const handleAdd = async (values) => {
    try {
      const { roleId, modules = [] } = values;
      await createPermission({
        roleId,
        module: modules[0] || "",
      });
      await fetchData();
      setOpen(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleUpdate = async (values) => {
    try {
      const { roleId, modules = [] } = values;
      await updatePermission(editId, {
        roleId,
        module: modules[0] || "",
      });
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
      await deletePermission(record.id);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = (record) => {
    setSelected(normalizeRecord(record));
    setMode("view");
    setOpen(true);
  };

  const handleEdit = (record) => {
    setSelected(normalizeRecord(record));
    setEditId(record.id);
    setMode("edit");
    setOpen(true);
  };

  const modalTitle =
    mode === "add" ? "Add Permission" : mode === "edit" ? "Edit Permission" : "View Permission";

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#9a2119]">Role Permissions Management</h2>

      <PermissionTable
        data={filteredSections}
        roles={roles}
        loading={loading}
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
        <PermissionForm
          roles={roles}
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}

export default Permission;