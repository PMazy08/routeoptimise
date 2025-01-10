"use client";

import { useState, useEffect, useRef } from "react";

export default function HomeToSchoolSidebar({ isOpen, onClose }) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  const [numVehicles, setNumVehicles] = useState(10);
  const [maxStopsPerVehicle, setMaxStopsPerVehicle] = useState(20);
  const [maxTravelTime, setMaxTravelTime] = useState(150);

  return (
    <aside
      id="additional-sidebar"
      className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-[#f9f9f9] border-t sm:border-t-0 sm:border-r border-gray-300 
             bottom-0 sm:top-0 lg:left-64 lg:top-0 transition-transform"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">
        <h2 className="text-lg font-bold">Home To Schools</h2>

        <div
          style={{
            display: "flex",
            justifyContent:'center',
            gap: "10px", // ระยะห่างระหว่างแต่ละช่อง
            padding: "10px",
            margin: '10px',
            backgroundColor: '#f9f9f9'
          }}
        >

          <div style={{ display: "flex", flexDirection: "column", fontSize: "12px"}}>
            <label style={{fontSize: "12px" }}>
              Bus:
            </label>
            <input
                type="number"
                value={numVehicles}
                onChange={(e) => setNumVehicles(e.target.value)}
                min="1"
                required
                style={{
                  width: "80px",
                  padding: "5px",
                  marginTop: "3px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: "12px" }}>
            <label style={{fontSize: "12px" }}>
              Max Capacity:
            </label>
            <input
              type="number"
              value={maxStopsPerVehicle}
              onChange={(e) => setMaxStopsPerVehicle(e.target.value)}
              min="1"
              required
              style={{
                width: "80px",
                padding: "5px",
                marginTop: "3px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", fontSize: "12px" }}>
            <label style={{fontSize: "12px" }}>
              Max Time (min):
            </label>
            <input
              type="number"
              value={maxTravelTime}
              onChange={(e) => setMaxTravelTime(e.target.value)}
              min="1"
              required
              style={{
                width: "80px",
                padding: "5px",
                marginTop: "3px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            />
          </div>
        </div>

        <hr></hr>


        <div className="mt-auto">

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
