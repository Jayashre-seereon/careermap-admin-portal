import { lazy, Suspense } from "react";

const AssessmentReportPageImpl = lazy(() => import("./AssessmentReportPage"));

// The report page bundles large images; load it only when a report route is visited.
export default function AssessmentReportPageLazy() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-slate-500">Loading report...</div>}>
      <AssessmentReportPageImpl />
    </Suspense>
  );
}
