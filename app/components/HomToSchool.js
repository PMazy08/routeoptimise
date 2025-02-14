"use client";
import { useState, useEffect, useRef } from "react";
import FindingOverlay from '../modals/FindingModal'; // นำเข้า Component


import { subscribeAuthState } from "../services/authService";
import { fetchStudentPage } from "../services/studentService";


export default function HomeToSchoolSidebar({ isOpen, openComponent, onClose, mapRef, markersData}) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null


  const studentMax = markersData.length

  // const [user, setUser] = useState(null);
  // const [idToken, setIdToken] = useState("");
  const [numVehicles, setNumVehicles] = useState("");
  const [maxStopsPerVehicle, setMaxStopsPerVehicle] = useState("");
  const [maxTravelTime, setMaxTravelTime] = useState(180);
  // const [studentAll, setStudentAll] = useState([]); // State สำหรับเก็บข้อมูล API
  // const [depotLat, setDepotLat] = useState();
  // const [depotLng, setDepotLng] = useState();


  // useEffect(() => {
  //   const unsubscribe = subscribeAuthState(setUser, (token) => {
  //     setIdToken(token);

  //   });
  //   return () => unsubscribe();
  // }, []);
  
  // useEffect(() => {
  //   const fetchAndSetStudents = async () => {
  //     if (!idToken) return; // ออกจากฟังก์ชันถ้าไม่มี idToken
  
  //     try {
  //       const data = await fetchStudentAll(idToken);
  //       setStudentAll(data);
  //       console.log("Student data fetched:", data);
        
  //       const depot = await fetchMapCenter(idToken);
  //       setDepotLat(depot[1]);
  //       setDepotLng(depot[0]);

  //     } catch (error) {
  //       console.error("Error fetching marker data: ", error);
  //     }
  //   };
  
  //   fetchAndSetStudents();
  // }, [idToken]);

  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token
  
  

  

  useEffect(() => {
    const unsubscribe = subscribeAuthState(setUser, setIdToken); // เรียกใช้ service
    return () => unsubscribe(); // เมื่อ component ถูกลบออก, ยกเลิกการ subscribe
  }, []); // ใช้ [] เพื่อให้เพียงแค่ครั้งแรกที่ mount


  const [rows, setRows] = useState([
    { id: 1, name: "John Doe1", email: "johndoe@gmail.com", phone: "555-555-5555", isActive: true },
    { id: 2, name: "Jane Doe2", email: "janedoe@gmail.com", phone: "555-555-5555", isActive: false },
    { id: 3, name: "Mark Smith3", email: "marksmith@gmail.com", phone: "444-444-4444", isActive: true },
    { id: 4, name: "John Doe4", email: "johndoe@gmail.com", phone: "555-555-5555", isActive: true },
    { id: 5, name: "Jane Doe5", email: "janedoe@gmail.com", phone: "555-555-5555", isActive: false },
    { id: 6, name: "Mark Smith6", email: "marksmith@gmail.com", phone: "444-444-4444", isActive: true },
    { id: 7, name: "John Doe7", email: "johndoe@gmail.com", phone: "555-555-5555", isActive: true },
    { id: 8, name: "Jane Doe8", email: "janedoe@gmail.com", phone: "555-555-5555", isActive: false },
    { id: 9, name: "Mark Smith9", email: "marksmith@gmail.com", phone: "444-444-4444", isActive: true },
    { id: 10, name: "John Doe10", email: "johndoe@gmail.กcom", phone: "555-555-5555", isActive: true },
    { id: 1, name: "John Doe11", email: "johndoe@gmail.com", phone: "555-555-5555", isActive: true },
    { id: 2, name: "Jane Doe12", email: "janedoe@gmail.com", phone: "555-555-5555", isActive: false },
    { id: 3, name: "Mark Smith13", email: "marksmith@gmail.com", phone: "444-444-4444", isActive: true },
    { id: 4, name: "John Doe14", email: "johndoe@gmail.com", phone: "555-555-5555", isActive: true },
    { id: 5, name: "Jane Doe15", email: "janedoe@gmail.com", phone: "555-555-5555", isActive: false },
    { id: 6, name: "Mark Smith16", email: "marksmith@gmail.com", phone: "444-444-4444", isActive: true },
    { id: 7, name: "John Doe17", email: "johndoe@gmail.com", phone: "555-555-5555", isActive: true },
    { id: 8, name: "Jane Doe18", email: "janedoe@gmail.com", phone: "555-555-5555", isActive: false },
    { id: 9, name: "Mark Smith19", email: "marksmith@gmail.com", phone: "444-444-4444", isActive: true },
    { id: 10, name: "John Doe20", email: "johndoe@gmail.กcom", phone: "555-555-5555", isActive: true },
  ]);

// ----------------------------------------------------------------------------
const [isLoading, setIsLoading] = useState();
const typePage = "Home To School"


const findingRoute = async () => {
  try {
    setIsLoading(true); // เริ่มโหลด

    if (mapRef.current) {
      const { routes, routeColors, routeDistance, routeDuration, Didu, route_type} = await mapRef.current.handleSubmit(
        parseInt(numVehicles),
        parseInt(maxStopsPerVehicle),
        parseInt(maxTravelTime),
        true,
        "home"
      ); 



      // console.log("นี้เด้อ "+routes  );
      console.log("นี้เด้อ "+ JSON.stringify(routes, null, 2));
      
      // openComponent("Route");
      openComponent("Route", { routes, routeColors, routeDistance, routeDuration, Didu, typePage, route_type});
    }

  } catch (error) {
    console.error("Error in findingRoute:", error);
  } finally {
    setIsLoading(false); // สิ้นสุดโหลด
  }
};




  
// ----------------------------------------------------------------------------
  // toggleStatus (สลับ Active/Inactive)
  // const toggleStatus = (index) => {
  //   setRows((prevRows) => {
  //     const updated = [...prevRows];
  //     updated[index].isActive = !updated[index].isActive;
  //     return updated;
  //   });
  // };

  // คลาสกลางสำหรับ input
  const inputClass = `
    w-[80px] p-[5px] 
    border border-gray-300 rounded
    text-[12px]
    focus:outline-none focus:ring-1 focus:ring-blue-500
  `;


  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const rowsPerPage = 10; // จำนวนแถวต่อหน้า

  const totalPages = Math.ceil(markersData.length / rowsPerPage); // คำนวณจำนวนหน้า
  const currentRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  ); // ดึงข้อมูลของหน้าปัจจุบัน

  const toggleStatus = (index) => {
    const rowIndex = (currentPage - 1) * rowsPerPage + index;
    rows[rowIndex].isActive = !rows[rowIndex].isActive;
  };



  const handleMaxCapacityChange = (e) => {
    const capacity = parseFloat(e.target.value);
    if (isNaN(capacity) || capacity <= 0) {
      setMaxStopsPerVehicle("");
      setNumVehicles("");
      return;
    }
    setMaxStopsPerVehicle(e.target.value); // เก็บเป็น string
    let calculated = Math.ceil(studentMax / capacity);
    if (calculated < 1) {
      calculated = 1;
    }
    setNumVehicles(calculated.toString()); // แปลงเป็น string
  };

  const handleBusChange = (e) => {
    const busVal = parseFloat(e.target.value);
    if (isNaN(busVal) || busVal <= 0) {
      setNumVehicles("");
      setMaxStopsPerVehicle("");
      return;
    }
    setNumVehicles(e.target.value); // เก็บเป็น string

    let calculated = Math.ceil(studentMax / busVal);
    if (calculated < 1) {
      calculated = 1;
    }
    setMaxStopsPerVehicle(calculated.toString()); // แปลงเป็น string
  };
  
  
  
  const itemsPerPage = 10;
const startIndex = (currentPage - 1) * itemsPerPage;
const currentItems = markersData.slice(startIndex, startIndex + itemsPerPage);



  // ----------------------------------------------------------------


  return (
    
    <aside
      className="
        fixed z-50 w-full sm:w-[500px] 
        h-[450px] sm:h-screen
        bg-white border-t sm:border-t-0 sm:border-r border-gray-300
        bottom-0 sm:top-0  lg:top-0
        transition-transform
      "
    >

      <div className="h-full flex flex-col px-3 pb-0">



        {/* Sticky top */}
        <div className="sticky top-0">
          <div className="flex items-center justify-between mt-2 mb-2">
            <h2 className="text-lg font-bold">Home To Schools</h2>
            {/* <button
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
            </button> */}

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
        </div>


        <div className="overflow-y-auto">
          {/* Header */}
          <h3 className="text-lg mt-2">Options</h3>

          {/* ช่องกรอกค่า Bus, Max Capacity, Max Time */}
          <div className="flex justify-center gap-3 p-2 m-2 bg-[#f9f9f9]">

          {/* <div className="flex flex-col text-[12px]">
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
              <label>Bus:</label>
              <input
                type="number"
                min="1"
                required
                value={numVehicles}
                onChange={(e) => setNumVehicles(e.target.value)}
                className={inputClass}
              />
            </div> */}


            <div className="flex flex-col text-[12px]">
              <label>Max Capacity:</label>
              <input
                type="number"
                min="1"
                required
                value={maxStopsPerVehicle}
                onChange={handleMaxCapacityChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col text-[12px]">
              <label>Bus:</label>
              <input
                type="number"
                min="1"
                required
                value={numVehicles}
                onChange={handleBusChange}
                className={inputClass}
              />
            </div>


{/* 
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
            </div> */}
          </div>

          <hr />

          <p className="mt-3">Students ({studentMax})</p>


          <div className="p-2 m-2">
            <div className="relative">
              <input
                className="w-full pl-10 mt-3 border border-gray-300 rounded p-1"
                placeholder="Search..."
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                  />
                </svg>
              </div>
            </div>
          </div>


      <div className="shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-100 border-b-2 border-gray-300 text-sm font-semibold text-gray-700 tracking-wider uppercase">
          <div className="py-4 px-6 text-left">Name</div>
          <div className="py-4 px-6 text-left">Address</div>
          <div className="py-4 px-6 text-center">Status</div>
        </div>

        <div className="divide-y divide-gray-200">
          {currentItems.map((marker, i) => (
            <div
              key={marker.id || i}
              className="grid grid-cols-3 items-center hover:bg-gray-50 transition"
            >
              <div className="py-4 px-6 text-sm font-medium text-gray-900">
                {marker.first_name} {marker.last_name}
              </div>

              <div className="py-4 text-sm text-gray-500">
                {marker.address}
              </div>

              <div className="py-4 px-6 flex justify-center">
                <label className="relative inline-block w-12 h-6 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={marker.isActive}
                    onChange={() => {
                      // handle status toggle ตามที่คุณต้องการ
                    }}
                  />
                  <div
                    className="bg-red-500 rounded-full w-full h-full
                    peer-checked:bg-green-500
                    peer-focus:ring-2 peer-focus:ring-blue-500
                    transition-colors duration-300"
                  >
                    <div
                      className="absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5
                      transform transition-transform duration-300
                      peer-checked:translate-x-6"
                    />
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <span className="px-4 py-2 text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>




        </div>

        {isLoading && <FindingOverlay />}

        {/* ticky bottom */}
        <div className="mt-auto sticky bottom-0 left-0 right-0 bg-white border-t pt-2 pb-[20px]">
          <button
            onClick={() => {
              findingRoute();
              // onClose();
            }}
            className="mt-4 w-full text-white bg-green-500 p-2 rounded hover:bg-green-600"
          >
            Optimize Routes
          </button>
        </div>

      </div>
    </aside>
  );
}
