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

const formatValue = (value) => {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value === undefined || value === null || value === "" ? "-" : String(value);
};

const formatDate = (value, includeTime = false) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? formatValue(value) : includeTime ? date.toLocaleString() : date.toLocaleDateString();
};

const DetailSection = ({ children }) => (
  <Descriptions.Item span={1} label={null}>
    <span className="font-semibold text-[#9a2119]">{children}</span>
  </Descriptions.Item>
);

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
      item.fullName,
      item.email,
      item.mobileNumber,
      item.preferredCountries,
      item.preferredCourseProgramme,
      item.intendedStudyLevel,
      item.totalEducationBudget,
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
              <DetailSection className="font-semibold text-lg text-[#9a2119]">Student Basic Details</DetailSection>
              <Descriptions.Item label="Full Name">{detailRecord.fullName || formatValue([detailRecord.user?.firstName, detailRecord.user?.lastName].filter(Boolean).join(" "))}</Descriptions.Item>
              <Descriptions.Item label="Date of Birth">{formatDate(detailRecord.dateOfBirth)}</Descriptions.Item>
              <Descriptions.Item label="Gender">{formatValue(detailRecord.gender)}</Descriptions.Item>
              <Descriptions.Item label="Email Address">{detailRecord.email || detailRecord.user?.email || "-"}</Descriptions.Item>
              <Descriptions.Item label="Mobile Number">{formatValue(detailRecord.mobileNumber)}</Descriptions.Item>
              <Descriptions.Item label="WhatsApp Number">{formatValue(detailRecord.whatsappNumber)}</Descriptions.Item>
              <Descriptions.Item label="Current City / State">{formatValue(detailRecord.currentCityState)}</Descriptions.Item>
              <Descriptions.Item label="Country of Citizenship">{formatValue(detailRecord.countryOfCitizenship)}</Descriptions.Item>

              <DetailSection className="font-semibold text-lg text-[#9a2119]"> Parent / Guardian Details</DetailSection>
              <Descriptions.Item label="Parent / Guardian Name">{formatValue(detailRecord.parentGuardianName)}</Descriptions.Item>
              <Descriptions.Item label="Relationship">{formatValue(detailRecord.parentRelationship)}</Descriptions.Item>
              <Descriptions.Item label="Mobile Number">{formatValue(detailRecord.parentMobileNumber)}</Descriptions.Item>
              <Descriptions.Item label="Email Address">{formatValue(detailRecord.parentEmail)}</Descriptions.Item>
              <Descriptions.Item label="Occupation">{formatValue(detailRecord.parentOccupation)}</Descriptions.Item>
              <Descriptions.Item label="Primary Funding Source">{formatValue(detailRecord.primaryFundingSource)}</Descriptions.Item>

              <DetailSection className="font-semibold text-lg text-[#9a2119]">Academic Details</DetailSection>
              <Descriptions.Item label="Current / Highest Qualification">{formatValue(detailRecord.highestQualification)}</Descriptions.Item>
              <Descriptions.Item label="School / College / University">{formatValue(detailRecord.schoolCollegeUniversity)}</Descriptions.Item>
              <Descriptions.Item label="Board / University">{formatValue(detailRecord.boardUniversity)}</Descriptions.Item>
              <Descriptions.Item label="Passing Year / Expected Graduation">{formatValue(detailRecord.passingYear)}</Descriptions.Item>
              <Descriptions.Item label="Class 10 Percentage / CGPA">{formatValue(detailRecord.class10PercentageCGPA)}</Descriptions.Item>
              <Descriptions.Item label="Class 12 Percentage / CGPA">{formatValue(detailRecord.class12PercentageCGPA)}</Descriptions.Item>

              <DetailSection className="font-semibold text-lg text-[#9a2119]">Foreign Education Preferences</DetailSection>
              <Descriptions.Item label="Study Abroad Programme">{detailRecord.studyAbroad?.title || `ID: ${detailRecord.studyAbroadId || "-"}`}</Descriptions.Item>
              <Descriptions.Item label="Intended Study Level">{formatValue(detailRecord.intendedStudyLevel)}</Descriptions.Item>
              <Descriptions.Item label="Preferred Intake">{formatValue(detailRecord.preferredIntake)}</Descriptions.Item>
              <Descriptions.Item label="Preferred Countries">{formatValue(detailRecord.preferredCountries)}</Descriptions.Item>
              <Descriptions.Item label="Preferred Course / Programme">{formatValue(detailRecord.preferredCourseProgramme)}</Descriptions.Item>
              <Descriptions.Item label="Preferred Specialization">{formatValue(detailRecord.preferredSpecialization)}</Descriptions.Item>
              <Descriptions.Item label="Preferred Universities">{formatValue(detailRecord.preferredUniversities)}</Descriptions.Item>
              <Descriptions.Item label="Open to Alternatives">{formatValue(detailRecord.openToAlternativeUniversities)}</Descriptions.Item>

              <DetailSection className="font-semibold text-lg text-[#9a2119]">English & Entrance Exams</DetailSection>
              <Descriptions.Item label="English Test">{formatValue(detailRecord.englishTest)}</Descriptions.Item>
              <Descriptions.Item label="English Test Score Date">{formatDate(detailRecord.englishTestScoreDate)}</Descriptions.Item>
              <Descriptions.Item label="Other Entrance Exams">{formatValue(detailRecord.otherEntranceExams)}</Descriptions.Item>
              <Descriptions.Item label="Entrance Exam Score Date">{formatDate(detailRecord.entranceExamScoreDate)}</Descriptions.Item>

              <DetailSection className="font-semibold text-lg text-[#9a2119]"> Career & Budget Preferences</DetailSection>
              <Descriptions.Item label="Preferred Career / Domain">{formatValue(detailRecord.preferredCareerDomain)}</Descriptions.Item>
              <Descriptions.Item label="Reason to Study Abroad">{formatValue(detailRecord.reasonToStudyAbroad)}</Descriptions.Item>
              <Descriptions.Item label="Top Priorities">{formatValue(detailRecord.topPriorities)}</Descriptions.Item>
              <Descriptions.Item label="Annual Tuition Budget">{formatValue(detailRecord.annualTuitionBudget)}</Descriptions.Item>
              <Descriptions.Item label="Total Education Budget">{formatValue(detailRecord.totalEducationBudget)}</Descriptions.Item>
              <Descriptions.Item label="Scholarship Required">{formatValue(detailRecord.scholarshipRequired)}</Descriptions.Item>
              <Descriptions.Item label="Education Loan Required">{formatValue(detailRecord.educationLoanRequired)}</Descriptions.Item>

              <DetailSection className="font-semibold text-lg text-[#9a2119]">Passport & Documents</DetailSection>
              <Descriptions.Item label="Passport Status">{formatValue(detailRecord.passportStatus)}</Descriptions.Item>
              <Descriptions.Item label="Passport Expiry Date">{formatDate(detailRecord.passportExpiryDate)}</Descriptions.Item>
              <Descriptions.Item label="Available Documents">{formatValue(detailRecord.documentsAvailable)}</Descriptions.Item>

              <DetailSection className="font-semibold text-lg text-[#9a2119]">Services Required</DetailSection>
              <Descriptions.Item label="Services Required">{formatValue(detailRecord.servicesRequired)}</Descriptions.Item>
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
                {formatDate(detailRecord.createdAt, true)}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {formatDate(detailRecord.updatedAt, true)}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Spin>
      </Modal>
    </>
  );
}
