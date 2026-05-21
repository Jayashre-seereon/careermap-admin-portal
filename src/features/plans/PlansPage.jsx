import { useEffect, useState } from "react";
import { Modal, message } from "antd";
import PlansTable from "./PlansTable";
import PlansForm from "./PlansForm";
import { createPlan, deletePlan, getPlans, updatePlan } from "../../api/plans";
import { getModules } from "../../api/module";

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

const mapModule = (item = {}) => ({
  id: item.id,
  title: item.title || item.name || "",
});

const mapPlan = (item = {}) => ({
  id: item.id,
  name: item.name || "",
  features: item.features || "",
  description: item.description || "",
  validity: item.validity || "",
  price: item.price || "",
  moduleIds: Array.isArray(item.modules) ? item.modules.map((module) => module.id) : [],
  modules: Array.isArray(item.modules) ? item.modules : [],
});

const buildPlanPayload = ({
  name,
  features,
  description,
  validity,
  price,
  moduleIds,
}) => ({
  name,
  features: features || "",
  description: description || "",
  validity: validity || "",
  price: price || "",
  moduleIds: Array.isArray(moduleIds) ? moduleIds : [],
});

export default function PlansPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [modules, setModules] = useState([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await getPlans();
      setData(normalizeList(response).map(mapPlan));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load plans."));
    } finally {
      setLoading(false);
    }
  };

  const loadModules = async () => {
    try {
      const response = await getModules();
      setModules(normalizeList(response).map(mapModule));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load modules."));
    }
  };

  useEffect(() => {
    loadPlans();
    loadModules();
  }, []);

  const filteredData = data.filter((item) =>
    `${item.name} ${item.features} ${item.description} ${item.validity} ${item.price}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSubmit = async (values) => {
    try {
      const payload = buildPlanPayload(values);

      if (mode === "edit" && selected) {
        await updatePlan(selected.id, payload);
        messageApi.success("Plan updated successfully.");
      } else {
        await createPlan(payload);
        messageApi.success("Plan created successfully.");
      }

      setOpen(false);
      setSelected(null);
      await loadPlans();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(
          error,
          mode === "edit" ? "Failed to update plan." : "Failed to create plan."
        )
      );
    }
  };

  const handleDelete = async (record) => {
    try {
      await deletePlan(record.id);
      messageApi.success("Plan deleted successfully.");
      await loadPlans();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete plan."));
    }
  };

  return (
    <>
      {contextHolder}
      <PlansTable
        data={filteredData}
        loading={loading}
        search={search}
        onSearch={setSearch}
        onAdd={() => {
          setSelected(null);
          setMode("add");
          setOpen(true);
        }}
        onView={(plan) => {
          setSelected(plan);
          setMode("view");
          setOpen(true);
        }}
        onEdit={(plan) => {
          setSelected(plan);
          setMode("edit");
          setOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelected(null);
        }}
        footer={null}
        width={900}
        destroyOnClose
        title={mode === "add" ? "Add Plan" : mode === "edit" ? "Edit Plan" : "View Plan"}
      >
        <PlansForm
          onSubmit={handleSubmit}
          initialValues={selected}
          disabled={mode === "view"}
          moduleOptions={modules}
        />
      </Modal>
    </>
  );
}
