import { useState } from "react";
import AllTemplatesTable from "./AllTemplatesTable";
import AllTemplatesEditor from "./AllTemplatesEditor";

export default function AllTemplatesPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        All Templates Management
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border p-5">

        {/* TABLE TITLE */}
        <h2 className="text-lg font-semibold text-[#9a2119] mb-4">
          Templates List
        </h2>

        <AllTemplatesTable onEdit={setSelected} />

        {/* EDITOR SECTION */}
        {selected && (
          <>
            <h2 className="text-lg font-semibold text-[#9a2119] mt-6 mb-4">
              Edit Template
            </h2>

            <AllTemplatesEditor />

            {/* SAVE BUTTON */}
            <div className="flex justify-end mt-4">
              <button className="px-6 py-2 rounded-md bg-[#9a2119] text-white hover:bg-[#c0392b]">
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}