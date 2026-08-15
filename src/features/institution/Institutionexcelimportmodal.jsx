import React, { useState } from "react";
import { Modal, Upload, Button, message, Alert, Progress } from "antd";
import { InboxOutlined, FileExcelOutlined } from "@ant-design/icons";
import { importInstitutionsExcel } from "../../api/institutions";

const { Dragger } = Upload;

const REQUIRED_COLUMNS = [
  { key: "CAREER", note: "Category name (must already exist)" },
  { key: "SECONDARY CATEGORY", note: "Optional — leave blank if not applicable" },
  { key: "SUB CATEGORY", note: "Optional — leave blank if not applicable" },
  { key: "INSTITUTE", note: "Institution name (required)" },
  { key: "ADDRESS", note: "Optional" },
  { key: "WEBSITE LINK", note: "Optional — full URL, e.g. https://example.com" },
  { key: "COUNTRY", note: "Optional" },
  { key: "STATE", note: "Optional" },
  { key: "TYPE", note: "e.g. Government / Private" },
  { key: "LOGO", note: "Optional — image URL" },
];

export default function InstitutionExcelImportModal({ open, onClose, onImported }) {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const resetState = () => {
    setFileList([]);
    setUploading(false);
    setResult(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const beforeUpload = (file) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(file.type)) {
      message.error("Only .xlsx or .xls files are allowed.");
      return Upload.LIST_IGNORE;
    }

    setFileList([file]);
    setResult(null);
    return false; // prevent auto upload, we handle it manually
  };

  const handleUpload = async () => {
    if (!fileList.length) {
      message.warning("Please select an Excel file first.");
      return;
    }

    try {
      setUploading(true);
      const response = await importInstitutionsExcel(fileList[0]);

      if (response?.success) {
        message.success(response.message || "Import started successfully.");
        setResult({
          status: "success",
          importId: response?.data?.importId,
          totalRows: response?.data?.totalRows,
        });
        onImported?.(response);
      } else {
        message.error(response?.message || "Import failed.");
        setResult({ status: "error", message: response?.message });
      }
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      message.error(backendMessage || "Failed to import Excel file.");
      setResult({ status: "error", message: backendMessage });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title="Upload Institutions from Excel"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={640}
      destroyOnClose
    >
      <div className="space-y-4">
        {/* Instructions */}
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "#f0d9d7", background: "#fdf5f4" }}
        >
          <p className="font-semibold text-[#9a2119] mb-2">
            Excel column headers must match exactly:
          </p>
          <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
            {REQUIRED_COLUMNS.map((col) => (
              <li key={col.key}>
                <span className="font-mono font-medium text-[#9a2119]">
                  {col.key}
                </span>
                <span className="text-gray-500"> — {col.note}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            First row of the sheet must be the header row with these exact
            names. Extra columns are ignored; missing required columns will
            cause those rows to be skipped.
          </p>
        </div>

        {/* Drag & drop */}
        <Dragger
          multiple={false}
          maxCount={1}
          fileList={fileList}
          beforeUpload={beforeUpload}
          onRemove={() => {
            setFileList([]);
            setResult(null);
          }}
          accept=".xlsx,.xls"
          disabled={uploading}
          style={{ borderColor: "#9a2119" }}
        >
          <p className="text-[#9a2119]" style={{ fontSize: 40 }}>
            <InboxOutlined />
          </p>
          <p className="font-medium text-gray-700">
            Click or drag an Excel file here to upload
          </p>
          <p className="text-xs text-gray-400">Supports .xlsx and .xls only</p>
        </Dragger>

        {/* Selected file */}
        {fileList.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FileExcelOutlined className="text-[#9a2119]" />
            {fileList[0].name}
          </div>
        )}

        {/* Result feedback */}
        {result?.status === "success" && (
          <Alert
            type="success"
            showIcon
            message="Import started"
            description={`Import #${result.importId} is processing ${result.totalRows} row(s) in the background. Refresh the list shortly to see new institutions.`}
          />
        )}

        {result?.status === "error" && (
          <Alert
            type="error"
            showIcon
            message="Import failed"
            description={result.message || "Something went wrong. Please check the file and try again."}
          />
        )}

        {uploading && <Progress percent={100} status="active" showInfo={false} />}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={handleClose} disabled={uploading}>
            Close
          </Button>
          <Button
            onClick={handleUpload}
            loading={uploading}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            Upload &amp; Import
          </Button>
        </div>
      </div>
    </Modal>
  );
}