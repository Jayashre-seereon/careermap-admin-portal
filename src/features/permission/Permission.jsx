import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
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

  useEffect(() => {
    fetchData();
  }, []);

const normalizeRecord = (record) => ({
  ...record,
  modules: record.modules || [],
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

const handleAdd = async (values) => {
  try {
    const { roleId, modules = [] } = values;

    await createPermission({
      roleId,
      modules, // ✅ send full array
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
      modules, // ✅ send full array
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
    if (!record?.roleId) return;

    // find all records with same roleId
    const recordsToDelete = sections.filter(
      (item) => item.roleId === record.roleId
    );

    // delete every permission row of this role
    const results = await Promise.allSettled(
      recordsToDelete.map((item) => deletePermission(item.id))
    );
    const failed = results.filter((r) => r.status === "rejected");

    await fetchData();

    if (failed.length === 0) {
      message.success("Permission deleted successfully");
    } else {
      console.error(failed.map((r) => r.reason));
      message.error(
        `${failed.length} of ${results.length} permission entries could not be deleted. Please retry.`
      );
    }
  } catch (err) {
    console.error(err);
    message.error(err?.response?.data?.message || "Failed to delete permission");
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
const groupedData = Object.values(
  sections.reduce((acc, item) => {
    if (!acc[item.roleId]) {
      acc[item.roleId] = {
        ...item,
        modules: [],
      };
    }

    // push module into array
    if (item.module) {
      acc[item.roleId].modules.push(item.module);
    }

    if (Array.isArray(item.modules)) {
      acc[item.roleId].modules.push(...item.modules);
    }

    return acc;
  }, {})
);
  const filteredData = (() => {
    const keyword = String(search || "").trim().toLowerCase();
    if (!keyword) return groupedData;
    return groupedData.filter((group) => {
      const roleName = String(roles.find((role) => role.id === group.roleId)?.name ?? "");
      const modulesMatch = (group.modules || []).some((m) =>
        String(m?.title ?? m?.name ?? m ?? "").toLowerCase().includes(keyword)
      );
      return roleName.toLowerCase().includes(keyword) || modulesMatch;
    });
  })();

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#9a2119]">Role Permissions Management</h2>

      <PermissionTable
        data={filteredData}
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