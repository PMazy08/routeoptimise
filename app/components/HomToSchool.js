"use client";
import { useState } from "react";
import FindingOverlay from '../modals/FindingOverlay'; // นำเข้า Component


export default function HomeToSchoolSidebar({ isOpen, onClose }) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  const [numVehicles, setNumVehicles] = useState(10);
  const [maxStopsPerVehicle, setMaxStopsPerVehicle] = useState(20);
  const [maxTravelTime, setMaxTravelTime] = useState(150);

  const [rows, setRows] = useState([
    { id: 1, name: "John Doe", email: "johndoe@gmail.com", phone: "555-555-5555", isActive: true },
    { id: 2, name: "Jane Doe", email: "janedoe@gmail.com", phone: "555-555-5555", isActive: false },
    { id: 3, name: "Mark Smith", email: "marksmith@gmail.com", phone: "444-444-4444", isActive: true },
    { id: 4, name: "John Doe", email: "johndoe@gmail.com", phone: "555-555-5555", isActive: true },
    { id: 5, name: "Jane Doe", email: "janedoe@gmail.com", phone: "555-555-5555", isActive: false },
    { id: 6, name: "Mark Smith", email: "marksmith@gmail.com", phone: "444-444-4444", isActive: true },
    { id: 7, name: "John Doe", email: "johndoe@gmail.com", phone: "555-555-5555", isActive: true },
    { id: 8, name: "Jane Doe", email: "janedoe@gmail.com", phone: "555-555-5555", isActive: false },
    { id: 9, name: "Mark Smith", email: "marksmith@gmail.com", phone: "444-444-4444", isActive: true },
    { id: 10, name: "John Doe", email: "johndoe@gmail.com", phone: "555-555-5555", isActive: true },
  ]);

  const [isLoading, setIsLoading] = useState();


  const toggleFindingRoute = () => {
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false);
    }, 3000); 

    
  }

  // toggleStatus (สลับ Active/Inactive)
  const toggleStatus = (index) => {
    setRows((prevRows) => {
      const updated = [...prevRows];
      updated[index].isActive = !updated[index].isActive;
      return updated;
    });
  };

  // คลาสกลางสำหรับ input
  const inputClass = `
    w-[80px] p-[5px] 
    border border-gray-300 rounded
    text-[12px]
    focus:outline-none focus:ring-1 focus:ring-blue-500
  `;

  return (
    <aside
      className="
        fixed z-50 w-full sm:w-[500px] 
        h-[500px] sm:h-screen
        bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300
        bottom-0 sm:top-0 lg:left-64 lg:top-0
        transition-transform
      "
    >
      <div className="h-full flex flex-col overflow-y-auto px-3 pb-0">
        {/* Header */}
        {/* <h2 className="text-lg font-bold mt-2">Home To Schools</h2> */}

        {/* ช่องกรอกค่า Bus, Max Capacity, Max Time */}
        <div className="flex justify-center gap-3 p-2 m-2 bg-[#f9f9f9]">
          <div className="flex flex-col text-[12px]">
            <label>Bus:</label>
            <input
              type="number"
              min="1"
              required
              value={numVehicles}
              onChange={(e) => setNumVehicles(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col text-[12px]">
            <label>Max Capacity:</label>
            <input
              type="number"
              min="1"
              required
              value={maxStopsPerVehicle}
              onChange={(e) => setMaxStopsPerVehicle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col text-[12px]">
            <label>Max Time (min):</label>
            <input
              type="number"
              min="1"
              required
              value={maxTravelTime}
              onChange={(e) => setMaxTravelTime(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <hr />
        <p className="mt-3">Students (140)</p>
        <input className="mt-3 border border-gray-300 rounded p-1" />

        {/* ส่วนตาราง */}
        <div className="mx-auto max-w-screen-sm p-2 sm:p-4 mb-[50px]">
          <div className="shadow-lg rounded-lg overflow-hidden">
            <table className="w-full table-fixed text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="w-1/4 py-2 px-2 text-left text-gray-600 font-bold uppercase">
                    Name
                  </th>
                  <th className="w-1/4 py-2 px-2 text-left text-gray-600 font-bold uppercase">
                    Email
                  </th>
                  <th className="w-1/4 py-2 px-2 text-left text-gray-600 font-bold uppercase">
                    Phone
                  </th>
                  <th className="w-1/4 py-2 px-2 text-left text-gray-600 font-bold uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {rows.map((row, i) => (
                  <tr key={row.id}>
                    <td className="py-2 px-2 border-b border-gray-200">{row.name}</td>
                    <td className="py-2 px-2 border-b border-gray-200 truncate">{row.email}</td>
                    <td className="py-2 px-2 border-b border-gray-200">{row.phone}</td>
                    <td className="py-2 px-2 border-b border-gray-200">
                      <label className="relative inline-block w-10 h-5 select-none">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={row.isActive}
                          onChange={() => toggleStatus(i)}
                        />
                        <div
                          className="absolute cursor-pointer top-0 left-0 right-0 bottom-0
                                     bg-red-500 rounded-full
                                     peer-checked:bg-green-500
                                     peer-focus:ring-2 peer-focus:ring-blue-500
                                     transition-colors duration-300"
                        />
                        <div
                          className="absolute left-0 top-0 w-5 h-5 bg-white rounded-full
                                     border border-gray-300
                                     transform transition-transform duration-300
                                     peer-checked:translate-x-5"
                        />
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* จุดสำคัญ: sticky bottom-0 */}
        <div className="mt-auto sticky bottom-0 left-0 right-0 bg-gray-100 border-t pt-2 pb-[20px]">
          <button
            onClick={() => {
              toggleFindingRoute();
              // onClose();
            }}
            className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-700"
          >
            Optimize Routes
          </button>
        </div>

        {isLoading && <FindingOverlay/>}

      </div>
    </aside>
  );
}
