"use client";

export default function RouteSidebar({ isOpen, onClose }) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  return (
    <aside
      id="additional-sidebar"
      className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300 
             bottom-0 sm:top-0 lg:left-64 lg:top-0 transition-transform"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">
        <h2 className="text-lg font-bold mt-[10px]">Routes</h2>


        <ul className="bg-white shadow overflow-hidden sm:rounded-md max-w-lg mx-lg m-2">
          <li>
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Route 1</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Description for Item 1</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">Status: <span className="text-green-600">Active</span></p>
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Edit</a>
              </div>
            </div>
          </li>

          <li className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Route 2</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Description for Item 2</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">Status: <span className="text-red-600">Inactive</span></p>
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Edit</a>
              </div>
            </div>
          </li>

          <li className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Route 3</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Description for Item 3</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">Status: <span className="text-yellow-600">Pending</span></p>
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Edit</a>
              </div>
            </div>
          </li>
        </ul>

        
        <div className="mt-auto flex space-x-4">
          <button
            onClick={onClose}
            className="w-full sm:w-full bg-red-500 text-white p-2 rounded hover:bg-green-700"
          >
            Reset
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-full bg-green-500 text-white p-2 rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </aside>
  );
}
