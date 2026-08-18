import React, { useEffect, useState } from "react";
import { Modal, message, Descriptions, Tag, Spin } from "antd";
import StudyAbroadConsultTable from "./StudyAbroadConsultTable";
import {
  getStudyAbroadConsults,
  getStudyAbroadConsultById,
} from "../../api/studyabroad";

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

const getSortScore = (item = {}, index = 0) => {
  const candidates = [
    item.createdAt,
    item.updatedAt,
    item.id,
  ];

  for (const value of candidates) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    const dateScore = Date.parse(value);
    if (!Number.isNaN(dateScore)) {
      return dateScore;
    }

    const numericScore = Number(value);
    if (Number.isFinite(numericScore)) {
      return numericScore;
    }
  }

  return -index;
};

const sortNewestFirst = (items = []) =>
  [...items]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => getSortScore(b.item, b.index) - getSortScore(a.item, a.index))
    .map(({ item }) => item);

export default function StudyAbroadConsultPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Modal detail states
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);

  const loadConsults = async () => {
    try {
      setLoading(true);
      const response = await getStudyAbroadConsults();
      setData(sortNewestFirst(normalizeList(response)));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load consultations."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsults();
  }, []);

  const filteredData = data.filter((item) => {
    const userName = item.user
      ? [item.user.firstName, item.user.lastName, item.user.email].filter(Boolean).join(" ").toLowerCase()
      : `id: ${item.userId || ""}`.toLowerCase();
    
    const searchString = [
      userName,
      item.preferredCountry,
      item.courseInterest,
      item.budgetRange,
      item.preferredIntake,
      item.status,
      item.message,
    ].filter(Boolean).join(" ").toLowerCase();

    return searchString.includes(search.toLowerCase());
  });

  const handleView = async (record) => {
    setOpen(true);
    setSelectedId(record.id);
    setDetailRecord(record); // Default to table row details in case API fails or is slow
    setDetailLoading(true);
    try {
      const response = await getStudyAbroadConsultById(record.id);
      if (response && response.data) {
        setDetailRecord(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch detailed consultation record:", error);
      // Keep using the table row details, which are usually sufficient
    } finally {
      setDetailLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case "pending":
        return "gold";
      case "approved":
      case "completed":
      case "success":
        return "green";
      case "rejected":
      case "cancelled":
        return "red";
      case "in-progress":
      case "processing":
        return "blue";
      default:
        return "default";
    }
  };

  return (
    <>
      {contextHolder}
      <StudyAbroadConsultTable
        data={filteredData}
        loading={loading}
        search={search}
        onSearch={setSearch}
        onView={handleView}
      />

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelectedId(null);
          setDetailRecord(null);
        }}
        footer={null}
        width={800}
        title="Consultation Details"
      >
        <Spin spinning={detailLoading}>
          {detailRecord && (
            <Descriptions bordered column={1} size="middle" className="mt-4">
              <Descriptions.Item label="Consultation ID">
                {detailRecord.id}
              </Descriptions.Item>
              <Descriptions.Item label="User">
                {detailRecord.user ? (
                  <div>
                    <div className="font-semibold text-gray-800">
                      {[detailRecord.user.firstName, detailRecord.user.lastName].filter(Boolean).join(" ") || "Unnamed"}
                    </div>
                    <div className="text-sm text-gray-500">{detailRecord.user.email}</div>
                  </div>
                ) : (
                  <span>User ID: {detailRecord.userId}</span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Study Abroad ID">
                {detailRecord.studyAbroadId}
              </Descriptions.Item>
              <Descriptions.Item label="Preferred Country">
                {detailRecord.preferredCountry || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Course Interest">
                {detailRecord.courseInterest || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Budget Range">
                {detailRecord.budgetRange || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Preferred Intake">
                {detailRecord.preferredIntake || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(detailRecord.status)}>
                  {String(detailRecord.status || "pending").toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Message">
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {detailRecord.message || "-"}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Requested At">
                {detailRecord.createdAt ? new Date(detailRecord.createdAt).toLocaleString() : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {detailRecord.updatedAt ? new Date(detailRecord.updatedAt).toLocaleString() : "-"}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Spin>
      </Modal>
    </>
  );
}
