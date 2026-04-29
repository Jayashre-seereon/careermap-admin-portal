import { Input } from "antd";

export default function GlobalTemplatePage() {
  return (
    <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Global Template Management
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border p-5 space-y-6">

        {/* ================= SHORTCODES ================= */}
        <div>
          <h2 className="text-lg font-semibold text-[#9a2119] mb-3">
            Short Codes
          </h2>

          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-[#9a2119] text-white">
                <tr>
                  <th className="text-left px-4 py-3">Short Code</th>
                  <th className="text-left px-4 py-3">Description</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3 font-mono">
                    {"{{site_name}}"}
                  </td>
                  <td className="px-4 py-3">Name of your site</td>
                </tr>

                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-3 font-mono">
                    {"{{site_currency}}"}
                  </td>
                  <td className="px-4 py-3">Currency of your site</td>
                </tr>

                <tr className="border-t">
                  <td className="px-4 py-3 font-mono">
                    {"{{currency_symbol}}"}
                  </td>
                  <td className="px-4 py-3">Symbol of currency</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= EMAIL + SMS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* EMAIL SECTION */}
          <div className="bg-gray-50 rounded-xl border p-5">
            <h3 className="text-[#9a2119] font-semibold mb-4">
              Email Template
            </h3>

            {/* FROM */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Email Sent From
              </label>
              <Input defaultValue="info@example.com" />
            </div>

            {/* BODY */}
            <div>
              <label className="block mb-1 font-medium">
                Email Body
              </label>
              <textarea
                rows={7}
                className="w-full border rounded-md p-3"
                defaultValue={`Hi {{fullname}} ({{username}}),

{{message}}`}
              />
            </div>
          </div>

          {/* SMS SECTION */}
          <div className="bg-gray-50 rounded-xl border p-5">
            <h3 className="text-[#9a2119] font-semibold mb-4">
              SMS Template
            </h3>

            {/* FROM */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                SMS Sent From
              </label>
              <Input defaultValue="FinBiz" />
            </div>

            {/* BODY */}
            <div>
              <label className="block mb-1 font-medium">
                SMS Body
              </label>
              <textarea
                rows={7}
                className="w-full border rounded-md p-3"
                defaultValue={`Hi {{fullname}} ({{username}}), {{message}}`}
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            className="px-6 py-2 rounded-md
                       bg-[#9a2119]
                       text-white
                       hover:bg-[#c0392b]
                       transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}