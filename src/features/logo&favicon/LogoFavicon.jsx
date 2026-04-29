import { useState } from "react";

export default function LogoFavicon() {
  const [logo, setLogo] = useState(null);
  const [logoWhite, setLogoWhite] = useState(null);
  const [favicon, setFavicon] = useState(null);

  return (
    <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Logo & Favicon
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">

        {/* LOGO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border border-gray-100 rounded-xl p-4">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Logo
            </label>

            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="file"
                onChange={(e) => setLogo(URL.createObjectURL(e.target.files[0]))}
                className="hidden"
                id="logoUpload"
              />

              <label
                htmlFor="logoUpload"
                className="flex-1 px-3 py-2 text-gray-500 text-sm cursor-pointer"
              >
                Select your file!
              </label>

              <span className="px-4 py-2 bg-[#9a2119] text-white text-sm cursor-pointer">
                Choose File
              </span>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="flex justify-center">
            {logo ? (
              <img src={logo} className="h-16 object-contain" />
            ) : (
              <div className="h-16 w-full bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
                Preview
              </div>
            )}
          </div>
        </div>

        {/* LOGO WHITE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border border-gray-100 rounded-xl p-4">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Logo White
            </label>

            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="file"
                onChange={(e) =>
                  setLogoWhite(URL.createObjectURL(e.target.files[0]))
                }
                className="hidden"
                id="logoWhiteUpload"
              />

              <label
                htmlFor="logoWhiteUpload"
                className="flex-1 px-3 py-2 text-gray-500 text-sm cursor-pointer"
              >
                Select your file!
              </label>

              <span className="px-4 py-2 bg-[#9a2119] text-white text-sm cursor-pointer">
                Choose File
              </span>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="flex justify-center bg-gray-900 rounded-md p-3">
            {logoWhite ? (
              <img src={logoWhite} className="h-16 object-contain" />
            ) : (
              <div className="h-16 w-full flex items-center justify-center text-gray-400 text-sm">
                Preview
              </div>
            )}
          </div>
        </div>

        {/* FAVICON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border border-gray-100 rounded-xl p-4">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Favicon
            </label>

            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="file"
                onChange={(e) =>
                  setFavicon(URL.createObjectURL(e.target.files[0]))
                }
                className="hidden"
                id="faviconUpload"
              />

              <label
                htmlFor="faviconUpload"
                className="flex-1 px-3 py-2 text-gray-500 text-sm cursor-pointer"
              >
                Select your file!
              </label>

              <span className="px-4 py-2 bg-[#9a2119] text-white text-sm cursor-pointer">
                Choose File
              </span>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="flex justify-center">
            {favicon ? (
              <img src={favicon} className="h-12 w-12 object-contain" />
            ) : (
              <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
                Icon
              </div>
            )}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            className="px-6 h-10 rounded-md bg-[#9a2119] text-white hover:bg-[#c4392e] transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}