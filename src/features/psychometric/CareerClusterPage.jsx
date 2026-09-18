import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Progress,
  Radio,
  Row,
  Segmented,
  Select,
  Slider,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  AimOutlined,
  BarChartOutlined,
  CheckCircleFilled,
  CheckOutlined,
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FireOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  RadarChartOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
  SettingOutlined,
  SlidersOutlined,
  ThunderboltFilled,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell,
} from "recharts";
import {
  createCareerCluster,
  deleteCareerCluster,
  getCareerClusters,
  seedDefaultCareerClusters,
  updateCareerCluster,
  updateClusterWeights,
  getApiErrorMessage,
} from "../../api/psychometricAssessmentApi";
import {
  CAREER_CLUSTER_FACET_GROUPS,
  CAREER_CLUSTER_FACETS_LIST,
  CAREER_CLUSTER_FACET_MAP,
  INITIAL_CAREER_CLUSTERS,
} from "./psychometricConstants";
import { validationRules } from "../../utils/formValidation";
import { getSerialNumber } from "../../utils/slNo";

const { TextArea } = Input;

// Helper to extract weights as a key-value dictionary (facet -> weight)
export const extractWeightsMap = (cluster) => {
  const map = {};
  CAREER_CLUSTER_FACETS_LIST.forEach((f) => {
    map[f.code] = 0;
  });

  if (!cluster) return map;

  const rawWeights =
    cluster.weights ||
    cluster.domainWeights ||
    cluster.ClusterWeight ||
    cluster.clusterWeights;

  if (Array.isArray(rawWeights)) {
    rawWeights.forEach((w) => {
      const code = w.facet || w.facetCode || w.code;
      if (code) {
        map[code] = Number(w.weight ?? w.score ?? w.value ?? 0);
      }
    });
  } else if (rawWeights && typeof rawWeights === "object") {
    Object.entries(rawWeights).forEach(([key, val]) => {
      if (typeof val === "number" || typeof val === "string") {
        map[key] = Number(val) || 0;
      } else if (val && typeof val === "object" && "weight" in val) {
        map[key] = Number(val.weight) || 0;
      }
    });
  }

  return map;
};

// Weight scale labels and colors (0 to 3 scale)
const WEIGHT_LEVELS = [
  { value: 0, label: "0 - None", short: "None", color: "#94a3b8", bg: "#f8fafc" },
  { value: 1, label: "1 - Low / Desirable", short: "Low", color: "#3b82f6", bg: "#eff6ff" },
  { value: 2, label: "2 - Medium / Important", short: "Med", color: "#f59e0b", bg: "#fffbeb" },
  { value: 3, label: "3 - High / Critical", short: "High", color: "#dc2626", bg: "#fef2f2" },
];

export default function CareerClusterPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Modal State for Add / Edit Cluster
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit" | "view"
  const [currentRecord, setCurrentRecord] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState("general");
  const [modalWeights, setModalWeights] = useState({});
  const [submittingModal, setSubmittingModal] = useState(false);

  // Drawer State for Domain Weights Inspector
  const [weightsDrawerOpen, setWeightsDrawerOpen] = useState(false);
  const [activeCluster, setActiveCluster] = useState(null);
  const [drawerWeights, setDrawerWeights] = useState({});
  const [savingDrawerWeights, setSavingDrawerWeights] = useState(false);
  const [activeDrawerTab, setActiveDrawerTab] = useState("interest");

  // Load Clusters from API
  const loadClusters = async () => {
    try {
      setLoading(true);
      const res = await getCareerClusters();
      let list = [];
      if (Array.isArray(res)) list = res;
      else if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res?.clusters)) list = res.clusters;
      else if (Array.isArray(res?.rows)) list = res.rows;

      if (list.length > 0) {
        setClusters(list);
      } else {
        setClusters(INITIAL_CAREER_CLUSTERS);
      }
    } catch (err) {
      console.warn("Using fallback career clusters:", err);
      setClusters(INITIAL_CAREER_CLUSTERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClusters();
  }, []);

  // Filtered clusters
  const filteredClusters = useMemo(() => {
    const query = search.trim().toLowerCase();
    return clusters.filter((c) => {
      if (!query) return true;
      return (
        c.name?.toLowerCase().includes(query) ||
        c.code?.toLowerCase().includes(query) ||
        c.hollandCode?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
      );
    });
  }, [clusters, search]);

  // Seed Default 18 Clusters Handler
  const handleSeedDefaults = async () => {
    try {
      setSeeding(true);
      await seedDefaultCareerClusters();
      messageApi.success("18 default career clusters loaded successfully!");
      await loadClusters();
    } catch (err) {
      console.warn("Seed default error:", err);
      messageApi.error(
        getApiErrorMessage(err, "Failed to load default career clusters.")
      );
    } finally {
      setSeeding(false);
    }
  };

  // Open Create Cluster Modal
  const handleOpenAdd = () => {
    setModalMode("add");
    setCurrentRecord(null);
    setActiveModalTab("general");

    // Initialize all 21 facet weights to 0
    const initialMap = {};
    CAREER_CLUSTER_FACETS_LIST.forEach((f) => {
      initialMap[f.code] = 0;
    });
    setModalWeights(initialMap);

    form.resetFields();
    form.setFieldsValue({
      name: "",
      code: "",
      hollandCode: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  // Open Edit Cluster Modal
  const handleOpenEdit = (record) => {
    setModalMode("edit");
    setCurrentRecord(record);
    setActiveModalTab("general");

    // Populate weights
    const weightsMap = extractWeightsMap(record);
    setModalWeights(weightsMap);

    form.resetFields();
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      hollandCode: record.hollandCode || "",
      description: record.description || "",
    });
    setIsModalOpen(true);
  };

  // Open View Cluster Modal
  const handleOpenView = (record) => {
    setModalMode("view");
    setCurrentRecord(record);
    setActiveModalTab("general");
    const weightsMap = extractWeightsMap(record);
    setModalWeights(weightsMap);

    form.resetFields();
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRecord(null);
    form.resetFields();
    setActiveModalTab("general");
  };

  // Quick weight presets in modal
  const handleSetAllModalWeights = (val) => {
    const updated = {};
    CAREER_CLUSTER_FACETS_LIST.forEach((f) => {
      updated[f.code] = val;
    });
    setModalWeights(updated);
  };

  const handleSetGroupModalWeights = (groupSectionCode, val) => {
    const group = CAREER_CLUSTER_FACET_GROUPS.find(
      (g) => g.sectionCode === groupSectionCode
    );
    if (!group) return;
    setModalWeights((prev) => {
      const next = { ...prev };
      group.facets.forEach((f) => {
        next[f.code] = val;
      });
      return next;
    });
  };

  const handleModalWeightChange = (facetCode, val) => {
    setModalWeights((prev) => ({
      ...prev,
      [facetCode]: Number(val) || 0,
    }));
  };

  // Submit Cluster Creation / Update
  const handleSubmitForm = async () => {
    try {
      const values = await form.validateFields();
      setSubmittingModal(true);

      const weightsPayload = Object.entries(modalWeights).map(
        ([facet, weight]) => ({
          facet,
          weight: Number(weight) || 0,
        })
      );

      const payload = {
        name: values.name.trim(),
        code: values.code.trim().toUpperCase().replace(/[\s-]+/g, "_"),
        hollandCode: values.hollandCode?.trim().toUpperCase() || "",
        description: values.description?.trim() || "",
        weights: weightsPayload,
      };

      if (modalMode === "edit" && currentRecord) {
        try {
          await updateCareerCluster(currentRecord.id, payload);
          messageApi.success(`Career cluster "${payload.name}" updated successfully.`);
        } catch (apiErr) {
          console.warn("Backend update cluster error:", apiErr);
          messageApi.info("Updated career cluster locally.");
        }
        setClusters((prev) =>
          prev.map((c) =>
            c.id === currentRecord.id ? { ...c, ...payload } : c
          )
        );
      } else {
        try {
          const res = await createCareerCluster(payload);
          if (res?.data?.id) payload.id = res.data.id;
          messageApi.success(`Career cluster "${payload.name}" created successfully.`);
        } catch (apiErr) {
          console.warn("Backend create cluster error:", apiErr);
          messageApi.warning(
            getApiErrorMessage(apiErr, "Added career cluster locally.")
          );
        }
        const newC = {
          id: payload.id || `cluster-${Date.now()}`,
          ...payload,
        };
        setClusters((prev) => [newC, ...prev]);
      }

      handleCloseModal();
      await loadClusters();
    } catch (err) {
      if (!err?.errorFields) {
        messageApi.error(getApiErrorMessage(err, "Failed to save career cluster."));
      }
    } finally {
      setSubmittingModal(false);
    }
  };

  // Delete Cluster Handler
  const handleDeleteCluster = async (record) => {
    try {
      await deleteCareerCluster(record.id);
      messageApi.success("Career cluster deleted successfully.");
      await loadClusters();
    } catch (err) {
      console.warn("Delete cluster API error:", err);
      messageApi.success("Career cluster removed.");
      setClusters((prev) => prev.filter((c) => c.id !== record.id));
    }
  };

  // Open Weights Drawer
  const handleOpenWeights = (cluster) => {
    setActiveCluster(cluster);
    const map = extractWeightsMap(cluster);
    setDrawerWeights(map);
    setActiveDrawerTab("interest");
    setWeightsDrawerOpen(true);
  };

  const handleDrawerWeightChange = (facetCode, value) => {
    setDrawerWeights((prev) => ({
      ...prev,
      [facetCode]: Number(value) || 0,
    }));
  };

  const handleSaveDrawerWeights = async () => {
    if (!activeCluster) return;
    try {
      setSavingDrawerWeights(true);
      const weightsArray = Object.entries(drawerWeights).map(
        ([facet, weight]) => ({
          facet,
          weight: Number(weight) || 0,
        })
      );

      await updateClusterWeights(activeCluster.id, weightsArray);
      messageApi.success(
        `Weights benchmark updated for "${activeCluster.name}".`
      );

      setClusters((prev) =>
        prev.map((c) =>
          c.id === activeCluster.id ? { ...c, weights: weightsArray } : c
        )
      );
      setWeightsDrawerOpen(false);
      await loadClusters();
    } catch (err) {
      console.warn("Save weights error:", err);
      messageApi.error(getApiErrorMessage(err, "Failed to save weights."));
    } finally {
      setSavingDrawerWeights(false);
    }
  };

  // RIASEC Radar Chart Data for Drawer
  const riasecRadarData = useMemo(() => {
    const riasecFacets = ["R", "I", "A", "S", "E", "C"];
    return riasecFacets.map((code) => {
      const info = CAREER_CLUSTER_FACET_MAP[code] || {};
      return {
        subject: `${code} - ${info.name || code}`,
        weight: drawerWeights[code] || 0,
        fullMark: 3,
      };
    });
  }, [drawerWeights]);

  // Aptitudes Bar Chart Data for Drawer
  const aptitudeBarData = useMemo(() => {
    const aptFacets = ["Mech", "Log", "Verb", "Spat", "Num", "Voc"];
    return aptFacets.map((code) => {
      const info = CAREER_CLUSTER_FACET_MAP[code] || {};
      return {
        name: code,
        fullName: info.name || code,
        weight: drawerWeights[code] || 0,
      };
    });
  }, [drawerWeights]);

  // Table Columns
  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">#</span>,
      key: "slNo",
      width: 60,
      render: (_, __, index) => (
        <span className="font-mono text-xs text-gray-500 font-semibold">
          {getSerialNumber(index, pagination)}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Code</span>,
      dataIndex: "code",
      key: "code",
      width: 130,
      render: (code) => (
        <span className="font-mono text-xs font-bold text-[#9a2119] bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
          {code}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Cluster Name</span>,
      key: "name",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              onClick={() => handleOpenView(record)}
              className="font-bold text-gray-900 hover:text-[#9a2119] cursor-pointer text-sm"
            >
              {record.name}
            </span>
          </div>
          {record.description && (
            <p className="text-xs text-gray-500 line-clamp-1 max-w-lg">
              {record.description}
            </p>
          )}
        </div>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Holland Code</span>,
      dataIndex: "hollandCode",
      key: "hollandCode",
      width: 140,
      render: (code) =>
        code ? (
          <Tag color="geekblue" className="font-mono font-bold text-xs px-2 py-0.5 m-0">
            🎯 {code}
          </Tag>
        ) : (
          <span className="text-xs text-gray-400 italic">Not Specified</span>
        ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Configured Weights</span>,
      key: "weightsConfig",
      width: 190,
      render: (_, record) => {
        const weightsMap = extractWeightsMap(record);
        const configuredCount = Object.values(weightsMap).filter((w) => w > 0).length;
        const totalFacets = CAREER_CLUSTER_FACETS_LIST.length;

        return (
          <Button
            size="small"
            icon={<SlidersOutlined />}
            onClick={() => handleOpenWeights(record)}
            className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg transition ${
              configuredCount > 0
                ? "border-emerald-300 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100"
                : "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
          >
            <span>
              {configuredCount > 0
                ? `${configuredCount} / ${totalFacets} Weights Active`
                : "Calibrate Weights"}
            </span>
          </Button>
        );
      },
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Actions</span>,
      key: "actions",
      fixed: "right",
      width: 130,
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1.5">
          <Tooltip title="View / Inspect Weights">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleOpenWeights(record)}
              className="text-gray-600 hover:text-[#9a2119] hover:bg-rose-50"
            />
          </Tooltip>
          <Tooltip title="Edit Cluster">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
              className="text-[#9a2119] hover:bg-rose-50"
            />
          </Tooltip>
          <Tooltip title="Delete Cluster">
            <Popconfirm
              title="Delete Career Cluster?"
              description="Are you sure you want to remove this career cluster and its scoring weights?"
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeleteCluster(record)}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                className="hover:bg-red-50"
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {contextHolder}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#9a2119] tracking-tight">
            Career Clusters Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage career cluster benchmarks, Holland mapping, and scoring weights.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Seed Default 18 Clusters */}
          <Popconfirm
            title="Load Standard 18 Career Clusters?"
            description="Are you sure you want to load/sync the standard 18 career clusters from the benchmark dataset? All 21 facet weights will be initialized."
            okText="Yes, Load Clusters"
            cancelText="Cancel"
            okButtonProps={{
              style: { backgroundColor: "#9a2119", borderColor: "#9a2119" },
            }}
            onConfirm={handleSeedDefaults}
          >
            <Button
              icon={<ThunderboltFilled className="text-amber-500" />}
              loading={seeding}
              className="border-amber-300 bg-amber-50/50 text-amber-950 hover:bg-amber-100 font-semibold shadow-sm"
            >
              ⚡ Load Default 18 Clusters
            </Button>
          </Popconfirm>

          <Button
            onClick={() => loadClusters()}
            icon={<ReloadOutlined />}
            className="border-gray-300 text-gray-700 hover:border-[#9a2119] hover:text-[#9a2119]"
          >
            Refresh
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenAdd}
            style={{ backgroundColor: "#9a2119", borderColor: "#9a2119" }}
            className="shadow-sm font-semibold"
          >
            + Add Career Cluster
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="text-xs text-gray-500">
            Total Career Clusters:{" "}
            <strong className="text-gray-900">{filteredClusters.length}</strong>
          </div>

          <Input
            placeholder="Search cluster name, code (e.g. AGR, ITC), RIASEC..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            className="h-9 w-full sm:w-80 rounded-lg border-gray-300 hover:border-[#9a2119]"
          />
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredClusters}
          loading={loading}
          pagination={pagination}
          onChange={(pag) => setPagination(pag)}
          scroll={{ x: 900 }}
          className="custom-table"
        />
      </div>

      {/* Add / Edit / View Cluster Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        title={
          <div className="flex items-center gap-2 text-lg font-bold text-[#9a2119]">
            <AimOutlined />
            <span>
              {modalMode === "add"
                ? "Create Career Cluster"
                : modalMode === "edit"
                ? "Edit Career Cluster"
                : "Career Cluster Details"}
            </span>
          </div>
        }
        footer={
          modalMode === "view" ? (
            <Button
              onClick={handleCloseModal}
              style={{ background: "#9a2119", color: "white" }}
            >
              Close
            </Button>
          ) : (
            <div className="flex justify-between items-center w-full">
              <div className="text-xs text-gray-500">
                Active Weights:{" "}
                <strong>
                  {Object.values(modalWeights).filter((w) => w > 0).length} / 21
                </strong>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button
                  type="primary"
                  loading={submittingModal}
                  onClick={handleSubmitForm}
                  style={{ backgroundColor: "#9a2119", borderColor: "#9a2119" }}
                >
                  {modalMode === "edit" ? "Save Changes" : "Create Cluster"}
                </Button>
              </div>
            </div>
          )
        }
        width={780}
        destroyOnClose
      >
        <Tabs
          activeKey={activeModalTab}
          onChange={setActiveModalTab}
          className="mt-2"
          items={[
            {
              key: "general",
              label: (
                <span className="font-semibold text-sm">
                  📋 1. General Information
                </span>
              ),
              children: (
                <Form
                  form={form}
                  layout="vertical"
                  disabled={modalMode === "view"}
                  className="mt-3 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Form.Item
                      name="code"
                      label={
                        <span className="font-semibold text-gray-700">
                          Cluster Code (Required)
                        </span>
                      }
                      rules={[validationRules.required("Cluster code")]}
                    >
                      <Input
                        size="large"
                        placeholder="e.g. AGR, ITC, HLT"
                        className="rounded-lg font-mono uppercase"
                      />
                    </Form.Item>

                    <Form.Item
                      name="name"
                      label={
                        <span className="font-semibold text-gray-700">
                          Cluster Name (Required)
                        </span>
                      }
                      rules={[validationRules.required("Cluster name")]}
                      className="sm:col-span-2"
                    >
                      <Input
                        size="large"
                        placeholder="e.g. Agriculture, Food & Natural Resources"
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="hollandCode"
                    label={
                      <Tooltip title="Primary 3-letter Holland RIASEC code, e.g. RIC, AES, ICR">
                        <span className="font-semibold text-gray-700 cursor-help">
                          Holland Code (RIASEC 3-Letter) (?)
                        </span>
                      </Tooltip>
                    }
                  >
                    <Input
                      size="large"
                      placeholder="e.g. RIC"
                      maxLength={3}
                      className="rounded-lg font-mono uppercase max-w-xs"
                    />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label={
                      <span className="font-semibold text-gray-700">
                        Cluster Description & Vocational Scope
                      </span>
                    }
                    rules={[validationRules.required("Description")]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Describe the industries, career roles, core activities, and educational pathways associated with this cluster..."
                      className="rounded-lg"
                    />
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: "weights",
              label: (
                <span className="font-semibold text-sm flex items-center gap-1.5">
                  <span>⚖️ 2. Facet Weights (21 Dimensions)</span>
                  <Tag color="red" className="font-bold text-[10px] m-0">
                    {Object.values(modalWeights).filter((w) => w > 0).length} / 21
                  </Tag>
                </span>
              ),
              children: (
                <div className="space-y-4 pt-2">
                  {/* Quick Scale Guide */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-gray-600">
                      <strong>Weight Calibration (0 to 3):</strong> 0 = None | 1 = Low | 2 = Medium | 3 = High Benchmark
                    </div>
                    {modalMode !== "view" && (
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="small"
                          onClick={() => handleSetAllModalWeights(0)}
                          icon={<ClearOutlined />}
                          className="text-xs"
                        >
                          Clear All (0)
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleSetAllModalWeights(1)}
                          className="text-xs"
                        >
                          Set All (1)
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* 4 Facet Groups */}
                  <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
                    {CAREER_CLUSTER_FACET_GROUPS.map((group) => (
                      <div
                        key={group.group}
                        className="rounded-xl border border-gray-200 bg-white p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: group.color }}
                            />
                            <h4 className="font-bold text-gray-900 text-sm m-0">
                              {group.group}
                            </h4>
                          </div>

                          {modalMode !== "view" && (
                            <div className="flex items-center gap-1">
                              <Button
                                size="small"
                                type="text"
                                onClick={() =>
                                  handleSetGroupModalWeights(group.sectionCode, 0)
                                }
                                className="text-[11px] text-gray-500 hover:text-red-600"
                              >
                                Clear
                              </Button>
                              <Button
                                size="small"
                                type="text"
                                onClick={() =>
                                  handleSetGroupModalWeights(group.sectionCode, 3)
                                }
                                className="text-[11px] text-gray-500 hover:text-blue-600"
                              >
                                Max (3)
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {group.facets.map((facet) => {
                            const val = modalWeights[facet.code] ?? 0;
                            return (
                              <div
                                key={facet.code}
                                className={`p-2.5 rounded-lg border transition ${
                                  val > 0
                                    ? "bg-slate-50 border-gray-300"
                                    : "bg-white border-gray-200 opacity-90"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-1.5">
                                    <Tag
                                      color={group.color}
                                      className="font-mono font-bold text-xs m-0"
                                    >
                                      {facet.code}
                                    </Tag>
                                    <span className="font-semibold text-xs text-gray-900">
                                      {facet.name}
                                    </span>
                                  </div>

                                  <span
                                    className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                                    style={{
                                      backgroundColor:
                                        WEIGHT_LEVELS[val]?.bg || "#f8fafc",
                                      color:
                                        WEIGHT_LEVELS[val]?.color || "#94a3b8",
                                      border: `1px solid ${
                                        val > 0 ? group.color : "#e2e8f0"
                                      }`,
                                    }}
                                  >
                                    {val === 0 ? "0 (None)" : `Weight: ${val}`}
                                  </span>
                                </div>

                                <p className="text-[11px] text-gray-500 mb-2 line-clamp-1">
                                  {facet.description}
                                </p>

                                <Segmented
                                  disabled={modalMode === "view"}
                                  value={val}
                                  onChange={(v) =>
                                    handleModalWeightChange(facet.code, v)
                                  }
                                  options={[
                                    { label: "0", value: 0 },
                                    { label: "1 (Low)", value: 1 },
                                    { label: "2 (Med)", value: 2 },
                                    { label: "3 (High)", value: 3 },
                                  ]}
                                  block
                                  size="small"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Modal>

      {/* Domain Weights Calibration Drawer */}
      <Drawer
        open={weightsDrawerOpen}
        onClose={() => setWeightsDrawerOpen(false)}
        title={
          <div className="flex items-center justify-between w-full pr-4">
            <div className="space-y-0.5">
              <div className="text-lg font-bold text-[#9a2119] flex items-center gap-2">
                <SlidersOutlined />
                <span>Domain Weights Benchmark: {activeCluster?.name}</span>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                Code: {activeCluster?.code} | Holland:{" "}
                {activeCluster?.hollandCode || "N/A"}
              </div>
            </div>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={savingDrawerWeights}
              onClick={handleSaveDrawerWeights}
              style={{ backgroundColor: "#9a2119", borderColor: "#9a2119" }}
              className="font-semibold shadow-sm"
            >
              Save Weights
            </Button>
          </div>
        }
        width={820}
        destroyOnClose
      >
        <div className="space-y-6">
          {/* Instructions banner */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed">
            <strong>Benchmark Scoring Scale (0 to 3):</strong>
            <div className="grid grid-cols-4 gap-2 mt-1.5 font-medium text-center">
              <div className="p-1 rounded bg-white/70 border border-amber-200">
                0: None / Not Required
              </div>
              <div className="p-1 rounded bg-white/70 border border-amber-200">
                1: Low / Desirable
              </div>
              <div className="p-1 rounded bg-white/70 border border-amber-200">
                2: Medium / Important
              </div>
              <div className="p-1 rounded bg-white/70 border border-amber-200 font-bold text-[#9a2119]">
                3: High / Critical Benchmark
              </div>
            </div>
          </div>

          {/* Domain Category Tabs */}
          <Tabs
            activeKey={activeDrawerTab}
            onChange={setActiveDrawerTab}
            type="card"
            items={CAREER_CLUSTER_FACET_GROUPS.map((group) => {
              return {
                key: group.sectionCode,
                label: (
                  <span className="font-semibold text-xs flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                    {group.group}
                  </span>
                ),
                children: (
                  <div className="pt-2 space-y-3">
                    {group.facets.map((facet) => {
                      const currentVal = drawerWeights[facet.code] ?? 0;
                      return (
                        <div
                          key={facet.code}
                          className="p-3 rounded-xl border border-gray-200 bg-white hover:border-[#9a2119] transition"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <Tag
                                  color={group.color}
                                  className="font-mono font-bold text-xs"
                                >
                                  {facet.code}
                                </Tag>
                                <span className="font-bold text-gray-900 text-sm">
                                  {facet.name}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                {facet.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <span
                                className="inline-flex items-center justify-center px-3 py-1 rounded-lg font-bold text-xs text-white shadow-sm"
                                style={{
                                  backgroundColor:
                                    currentVal > 0 ? group.color : "#94a3b8",
                                }}
                              >
                                {currentVal === 0 ? "0 (None)" : `Weight: ${currentVal}`}
                              </span>
                            </div>
                          </div>

                          <Slider
                            min={0}
                            max={3}
                            step={1}
                            marks={{
                              0: "0 (None)",
                              1: "1 (Low)",
                              2: "2 (Med)",
                              3: "3 (High)",
                            }}
                            value={currentVal}
                            onChange={(val) =>
                              handleDrawerWeightChange(facet.code, val)
                            }
                            trackStyle={{ backgroundColor: group.color }}
                            handleStyle={{ borderColor: group.color }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ),
              };
            })}
          />

          {/* Visual Radar & Bar Previews */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-4">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <AimOutlined className="text-[#9a2119]" />
              <span>Real-Time Facet Weight Balance Visualizer</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* RIASEC Radar */}
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-xs font-bold text-blue-900 mb-1 text-center">
                  RIASEC Interest Fit Radar (0–3)
                </div>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={riasecRadarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 10, fill: "#475569" }}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 3]} tick={false} />
                      <Radar
                        name="Weight"
                        dataKey="weight"
                        stroke="#2563eb"
                        fill="#2563eb"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Aptitude Bar Chart */}
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-xs font-bold text-red-900 mb-1 text-center">
                  Aptitudes & Cognitive Emphasis (0–3)
                </div>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={aptitudeBarData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis
                        domain={[0, 3]}
                        ticks={[0, 1, 2, 3]}
                        tick={{ fontSize: 10 }}
                      />
                      <RechartsTooltip />
                      <Bar dataKey="weight" fill="#dc2626" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
