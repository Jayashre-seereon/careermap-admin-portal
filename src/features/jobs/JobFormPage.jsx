import { useNavigate, useParams } from "react-router-dom";
import JobForm from "./JobForm";

export default function JobFormPage({ mode }) {
  const navigate = useNavigate();
  const { jobId } = useParams();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-5 py-4">
        <h1 className="text-2xl font-semibold text-[#1f2a44]">
          {mode === "view" ? "View Job" : mode === "edit" ? "Edit Job" : "Add Job"}
        </h1>
      </div>

      <div className="p-5">
        <JobForm
          mode={mode}
          jobId={jobId}
          onSuccess={() => navigate("/jobs")}
          onCancel={() => navigate("/jobs")}
        />
      </div>
    </div>
  );
}
