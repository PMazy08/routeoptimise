"use client";

export default function StudentSidebar({ isOpen, onClose }) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  return (
    <aside
      id="additional-sidebar"
      className="fixed z-50 w-full sm:w-[1000px] h-[500px] sm:h-screen bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300 
             bottom-0 sm:top-0 lg:top-0 transition-transform"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">

      <div className="flex items-center justify-between mt-2">
          <h2 className="text-lg font-bold">Home To Schools</h2>

          <button
            onClick={onClose}
            className="justify-items-center w-[30px] h-[30px] bg-red-500 text-black  rounded hover:bg-red-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <h2 className="text-lg font-bold mt-[10px]">Students</h2>
        {/* <button
          onClick={onClose}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-700"
        >
          Close Sidebar
        </button> */}

        {/* <div className="mt-auto">

          <button
            onClick={onClose}
            className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-700"
          >
            Optimize Routes
          </button>
        </div> */}
      </div>
    </aside>
  );
}
