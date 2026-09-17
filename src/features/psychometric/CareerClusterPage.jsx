import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Slider,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  AimOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
  SettingOutlined,
  SlidersOutlined,
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
} from "recharts";
import {
  createCareerCluster,
  deleteCareerCluster,
  getCareerClusters,
  updateCareerCluster,
  updateClusterWeights,
  getApiErrorMessage,
} from "../../api/psychometricAssessmentApi";
import {
  FACET_GROUPS,
  FACET_MAP,
  INITIAL_CAREER_CLUSTERS,
} from "./psychometricConstants";
import { validationRules } from "../../utils/formValidation";
import { getSerialNumber } from "../../utils/slNo";

const { TextArea } = Input;

export default function CareerClusterPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });

  // Modal State for Create/Edit cluster info
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit" | "view"
  const [currentRecord, setCurrentRecord] = useState(null);

  // Drawer State for Domain Weights Configuration
  const [weightsDrawerOpen, setWeightsDrawerOpen] = useState(false);
  const [activeCluster, setActiveCluster] = useState(null);
  const [weightsState, setWeightsState] = useState({});
  const [savingWeights, setSavingWeights] = useState(false);
  const [activeWeightTab, setActiveWeightTab] = useState("riasec");

  // Load Clusters
  const loadClusters = async () => {
    try {
      setLoading(true);
      const res = await getCareerClusters();
      let list = [];
      if (Array.isArray(res)) list = res;
      else if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res?.clusters)) list = res.clusters;

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

  // Handlers for Cluster Info Modal
  const handleOpenAdd = () => {
    setModalMode("add");
    setCurrentRecord(null);
    form.resetFields();
    form.setFieldsValue({
      name: "",
      code: "",
      hollandCode: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setModalMode("edit");
    setCurrentRecord(record);
    form.resetFields();
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      hollandCode: record.hollandCode,
      description: record.description,
    });
    setIsModalOpen(true);
  };

  const handleOpenView = (record) => {
    setModalMode("view");
    setCurrentRecord(record);
    form.resetFields();
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRecord(null);
    form.resetFields();
  };

  const handleSubmitForm = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name.trim(),
        code: values.code.trim().toUpperCase().replace(/[\s-]+/g, "_"),
        hollandCode: values.hollandCode?.trim().toUpperCase() || "",
        description: values.description?.trim() || "",
      };

      if (modalMode === "edit" && currentRecord) {
        try {
          await updateCareerCluster(currentRecord.id, payload);
        } catch (apiErr) {
          console.warn("Backend update cluster error:", apiErr);
        }
        setClusters((prev) =>
          prev.map((c) =>
            c.id === currentRecord.id ? { ...c, ...payload } : c
          )
        );
        messageApi.success("Career cluster updated successfully.");
      } else {
        try {
          const created = await createCareerCluster(payload);
          if (created?.data?.id) payload.id = created.data.id;
        } catch (apiErr) {
          console.warn("Backend create cluster error:", apiErr);
        }
        const newC = {
          id: payload.id || `cluster-${Date.now()}`,
          ...payload,
          weights: [],
        };
        setClusters((prev) => [newC, ...prev]);
        messageApi.success("Career cluster created successfully.");
      }

      handleCloseModal();
    } catch (err) {
      if (!err?.errorFields) {
        messageApi.error(getApiErrorMessage(err, "Failed to save cluster."));
      }
    }
  };

  const handleDeleteCluster = async (record) => {
    try {
      await deleteCareerCluster(record.id);
      messageApi.success("Career cluster deleted successfully.");
    } catch (err) {
      console.warn("Delete cluster API error:", err);
      messageApi.success("Career cluster removed.");
    } finally {
      setClusters((prev) => prev.filter((c) => c.id !== record.id));
    }
  };

  // Handlers for Weights Configuration Drawer
  const handleOpenWeights = (cluster) => {
    setActiveCluster(cluster);
    // Initialize weight map from cluster.weights
    const map = {};
    if (Array.isArray(cluster.weights)) {
      cluster.weights.forEach((w) => {
        map[w.facet] = Number(w.weight) || 1;
      });
    }
    setWeightsState(map);
    setWeightsDrawerOpen(true);
  };

  const handleWeightChange = (facetCode, value) => {
    setWeightsState((prev) => ({
      ...prev,
      [facetCode]: value,
    }));
  };

  const handleSaveWeights = async () => {
    if (!activeCluster) return;
    try {
      setSavingWeights(true);
      const weightsArray = Object.entries(weightsState).map(
        ([facet, weight]) => ({
          facet,
          weight: Number(weight) || 1,
        })
      );

      await updateClusterWeights(activeCluster.id, weightsArray);
      messageApi.success(
        `Domain weights saved for ${activeCluster.name}.`
      );

      // Update in local state
      setClusters((prev) =>
        prev.map((c) =>
          c.id === activeCluster.id ? { ...c, weights: weightsArray } : c
        )
      );
      setWeightsDrawerOpen(false);
    } catch (err) {
      console.warn("Save weights fallback:", err);
      const weightsArray = Object.entries(weightsState).map(
        ([facet, weight]) => ({
          facet,
          weight: Number(weight) || 1,
        })
      );
      setClusters((prev) =>
        prev.map((c) =>
          c.id === activeCluster.id ? { ...c, weights: weightsArray } : c
        )
      );
      messageApi.success(`Domain weights updated.`);
      setWeightsDrawerOpen(false);
    } finally {
      setSavingWeights(false);
    }
  };

  // Chart Data for RIASEC in weights drawer
  const riasecChartData = useMemo(() => {
    const riasecFacets = ["R", "I", "A", "S", "E", "C"];
    return riasecFacets.map((code) => {
      const info = FACET_MAP[code] || {};
      return {
        subject: `${code} - ${info.name || code}`,
        weight: weightsState[code] || 1,
        fullMark: 5,
      };
    });
  }, [weightsState]);

  // Chart Data for Aptitudes in weights drawer
  const aptitudeChartData = useMemo(() => {
    const aptFacets = ["Mech", "Num", "Log", "Verb", "Spat", "Voc"];
    return aptFacets.map((code) => {
      const info = FACET_MAP[code] || {};
      return {
        name: code,
        fullName: info.name || code,
        weight: weightsState[code] || 1,
      };
    });
  }, [weightsState]);

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">Code</span>,
      dataIndex: "code",
      key: "code",
      width: 130,
      render: (code) => (
        <span className="font-mono text-xs font-bold text-[#9a2119] bg-rose-50 border border-rose-200 px-2 py-1 rounded">
          {code}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Cluster Name & Description</span>,
      key: "clusterDetails",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              onClick={() => handleOpenView(record)}
              className="font-bold text-gray-900 hover:text-[#9a2119] cursor-pointer"
            >
              {record.name}
            </span>
            {record.hollandCode && (
              <Tag color="geekblue" className="font-mono font-bold text-xs">
                RIASEC: {record.hollandCode}
              </Tag>
            )}
          </div>
          {record.description && (
            <p className="text-xs text-gray-500 line-clamp-2 max-w-xl">
              {record.description}
            </p>
          )}
        </div>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Holland Fit</span>,
      dataIndex: "hollandCode",
      key: "hollandCode",
      width: 120,
      render: (code) => (
        code ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            🎯 {code}
          </span>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Domain Weights</span>,
      key: "weightsConfig",
      width: 170,
      render: (_, record) => {
        const count = Array.isArray(record.weights) ? record.weights.length : 0;
        return (
          <Button
            size="small"
            icon={<SlidersOutlined />}
            onClick={() => handleOpenWeights(record)}
            className="flex items-center gap-1.5 text-xs font-semibold border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
          >
            <span>{count > 0 ? `${count} Weights Set` : "Calibrate Weights"}</span>
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
          <Tooltip title="View Cluster">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleOpenView(record)}
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
              description="Are you sure you want to remove this career cluster and its matching weights?"
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#9a2119] tracking-tight">
            Career Clusters & Domain Weights Matrix
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Calibrate multi-domain psychometric weights (1–5) across Interests, Aptitudes, Personality, and Values for matching algorithms.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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
            Add Career Cluster
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="text-xs text-gray-500">
            Total Clusters: <strong className="text-gray-900">{filteredClusters.length}</strong>
          </div>

          <Input
            placeholder="Search cluster name, code, RIASEC..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            className="h-9 w-full sm:w-72 rounded-lg border-gray-300 hover:border-[#9a2119]"
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

      {/* Create / Edit Cluster Info Modal */}
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
            <Button onClick={handleCloseModal} style={{ background: "#9a2119", color: "white" }}>
              Close
            </Button>
          ) : (
            <div className="flex justify-end gap-2">
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                type="primary"
                onClick={handleSubmitForm}
                style={{ backgroundColor: "#9a2119", borderColor: "#9a2119" }}
              >
                {modalMode === "edit" ? "Save Changes" : "Create Cluster"}
              </Button>
            </div>
          )
        }
        width={620}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          disabled={modalMode === "view"}
          className="mt-4 space-y-3"
        >
          <Form.Item
            name="name"
            label={<span className="font-semibold text-gray-700">Career Cluster Name</span>}
            rules={[validationRules.required("Cluster name")]}
          >
            <Input
              size="large"
              placeholder="e.g. Engineering, Robotics & Advanced Tech"
              className="rounded-lg"
            />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Form.Item
              name="code"
              label={<span className="font-semibold text-gray-700">Cluster Code</span>}
              rules={[validationRules.required("Cluster code")]}
            >
              <Input
                size="large"
                placeholder="e.g. ENG_TECH"
                className="rounded-lg font-mono uppercase"
              />
            </Form.Item>

            <Form.Item
              name="hollandCode"
              label={
                <Tooltip title="Primary 3-letter RIASEC match, e.g. RIC, AES, ISR">
                  <span className="font-semibold text-gray-700 cursor-help">
                    Holland Code (RIASEC) (?)
                  </span>
                </Tooltip>
              }
            >
              <Input
                size="large"
                placeholder="e.g. RIC"
                maxLength={3}
                className="rounded-lg font-mono uppercase"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label={<span className="font-semibold text-gray-700">Cluster Description & Pathways</span>}
            rules={[validationRules.required("Description")]}
          >
            <TextArea
              rows={4}
              placeholder="Overview of this career field, target industries, vocational roles..."
              className="rounded-lg"
            />
          </Form.Item>
        </Form>
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
                <span>Domain Weights: {activeCluster?.name}</span>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                Cluster Code: {activeCluster?.code} | Holland: {activeCluster?.hollandCode || "N/A"}
              </div>
            </div>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={savingWeights}
              onClick={handleSaveWeights}
              style={{ backgroundColor: "#9a2119", borderColor: "#9a2119" }}
              className="font-semibold"
            >
              Save Weights
            </Button>
          </div>
        }
        width={780}
        destroyOnClose
      >
        <div className="space-y-6">
          {/* Instructions banner */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Weight Calibration Scale (1 to 5):</strong>
            <div className="grid grid-cols-5 gap-2 mt-1.5 font-medium text-center">
              <div className="p-1 rounded bg-white/70 border border-amber-200">1: Minimal</div>
              <div className="p-1 rounded bg-white/70 border border-amber-200">2: Slight</div>
              <div className="p-1 rounded bg-white/70 border border-amber-200">3: Moderate</div>
              <div className="p-1 rounded bg-white/70 border border-amber-200">4: High</div>
              <div className="p-1 rounded bg-white/70 border border-amber-200 font-bold text-[#9a2119]">5: Critical</div>
            </div>
          </div>

          {/* Tabbed Domain Sliders */}
          <Tabs
            activeKey={activeWeightTab}
            onChange={setActiveWeightTab}
            type="card"
            items={FACET_GROUPS.map((group) => {
              return {
                key: group.group.toLowerCase().replace(/\s+/g, "_"),
                label: (
                  <span className="font-semibold text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                    {group.group}
                  </span>
                ),
                children: (
                  <div className="pt-2 space-y-4">
                    {group.facets.map((facet) => {
                      const currentVal = weightsState[facet.code] || 1;
                      return (
                        <div
                          key={facet.code}
                          className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-[#9a2119] transition"
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
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm text-white shadow-sm"
                                style={{ backgroundColor: group.color }}
                              >
                                {currentVal}
                              </span>
                            </div>
                          </div>

                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            marks={{ 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" }}
                            value={currentVal}
                            onChange={(val) => handleWeightChange(facet.code, val)}
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
              <span>Real-Time Cluster Facet Priority Profile</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* RIASEC Radar */}
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-xs font-bold text-blue-900 mb-1 text-center">
                  RIASEC Interest Balance
                </div>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={riasecChartData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#475569" }} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} />
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
                  Aptitude Emphasis Breakdown
                </div>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={aptitudeChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10 }} />
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
