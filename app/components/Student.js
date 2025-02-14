"use client";

export default function StudentSidebar({ isOpen, onClose }) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  return (
    <aside
      id="additional-sidebar"
      className="fixed z-50 w-full sm:w-[1000px] h-[500px] sm:h-screen bg-white border-t sm:border-t-0 sm:border-r border-gray-300 
             bottom-0 sm:top-0 lg:top-0 transition-transform"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">

      <div className="flex items-center justify-between mt-2">
          <h2 className="text-lg font-bold">Home To Schools</h2>

          <button
            type="button"
            className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-[7px] focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
            onClick={onClose}
          >
            <svg
              className="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            {/* <span className="sr-only">Close</span> */}
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
