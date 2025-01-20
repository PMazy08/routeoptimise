"use client";
import { useState, useEffect, useRef } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

export default function BusToSchoolSidebar({ isOpen, onClose }) {

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

  ///-----------------input add bus stop---------------
  // const [fields, setFields] = useState([]); // เก็บข้อมูล input
  // const [showFields, setShowFields] = useState(false); // ควบคุมการแสดง input และปุ่ม Clear

  // const addInput = () => {
  //   setShowFields(true); // แสดง input และปุ่ม Clear
  //   setFields([...fields, ""]); // เพิ่ม input ใหม่
  // };

  // const removeInput = (idx) => {
  //   setFields(fields.filter((_, i) => i !== idx)); // ลบ input ตาม index
  //   if (fields.length === 1) {
  //     setShowFields(false); // ซ่อน input และปุ่ม Clear ถ้าไม่มี input เหลือ
  //   }
  // };

  // const clearAll = () => {
  //   setFields([]); // ลบ input ทั้งหมด
  //   setShowFields(false); // ซ่อน input และปุ่ม Clear
  // };

  // const handleChange = (idx, value) => {
  //   const updatedFields = [...fields];
  //   updatedFields[idx] = value;
  //   setFields(updatedFields);
  // };




  const [fields, setFields] = useState([{ name: "", geocoderRef: null }]);

  const handleAddField = () => {
    setFields([...fields, { name: "", geocoderRef: null }]);
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, idx) => idx !== index));
  };

  const handleChange = (index, value) => {
    const updatedFields = [...fields];
    updatedFields[index].name = value;
    setFields(updatedFields);
  };

  useEffect(() => {
    // Initialize Geocoder for each field
    fields.forEach((field, index) => {
      if (!field.geocoderRef) {
        const geocoderContainer = document.getElementById(`geocoder-${index}`);
        if (geocoderContainer) {
          const geocoder = new MapboxGeocoder({
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
            placeholder: "Search for places...",
            marker: true,
            limit: 3, // จำนวนผลลัพธ์สูงสุดที่แสดง
          });
  
          geocoder.addTo(geocoderContainer);
  
          geocoder.on("result", (e) => {
            const { center, place_name } = e.result; // ดึงข้อมูล center (lng, lat)
            const [lng, lat] = center;
  
            console.log(`Selected Place: ${place_name}`);
            console.log(`Longitude: ${lng}, Latitude: ${lat}`);
  
            // อัปเดตฟิลด์ด้วยชื่อสถานที่
            handleChange(index, `${place_name} (${lng}, ${lat})`);
          });
  
          const updatedFields = [...fields];
          updatedFields[index].geocoderRef = geocoder;
          setFields(updatedFields);
        }
      }
    });
  }, [fields]);
  













  ///-----------------------------------------------------------
  return (
    <aside
      className="
      fixed z-50 w-full sm:w-[500px] 
      h-[500px] sm:h-screen
      bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300
      bottom-0 sm:top-0 lg:top-0
      transition-transform
    "
    >
      <div className="h-full flex flex-col px-3 pb-0">

        {/* Sticky top */}
        <div className="sticky top-0 bg-gray-100">
          <div className="flex items-center justify-between mt-2 mb-2">
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
        </div>

        {/* Header */}
        {/* <h2 className="text-lg font-bold mt-2">Home To Schools</h2> */}


        <div className="overflow-y-auto">

          {/* <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Point Stops</h2>
              {showFields && (
                <button
                  onClick={clearAll}
                  className="bg-red-500 text-white px-2 py-1 rounded 
               hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 
               text-sm"
                >
                  Clear All
                </button>
              )}
            </div>


            {showFields && (
              <>
                {fields.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1
                   focus:outline-none focus:ring-1 focus:ring-blue-500 
                   text-sm w-full"
                      placeholder={`Input ${idx + 1}`}
                    />
                    <button
                      onClick={() => removeInput(idx)}
                      className="bg-red-500 text-white px-2 py-1 rounded 
                   hover:bg-red-600 focus:outline-none focus:ring-2
                   focus:ring-red-400 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </>
            )}

      
            <button
              onClick={addInput}
              className="bg-blue-600 text-white px-3 py-2 rounded 
             hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
             text-sm"
            >
              Add Bus Stop
            </button>
          </div> */}



          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Point Stops with Geocoder</h2>

            {fields.map((field, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-4">
                <div className="flex-grow">
                  {/* Geocoder Input */}
                  <div id={`geocoder-${idx}`} className="w-full"></div>
                </div>
                <button
                  onClick={() => handleRemoveField(idx)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={handleAddField}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              Add Bus Stop
            </button>
          </div>









        <hr className="m-[10px]" />

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
        </div>

        {/* จุดสำคัญ: sticky bottom-0 */}
        <div className="mt-auto sticky bottom-0 left-0 right-0 bg-gray-100 border-t pt-2 pb-[20px]">
          <button
            onClick={onClose}
            className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-700"
          >
            Optimize Routes
          </button>
        </div>

      </div>
    </aside>
  );
}