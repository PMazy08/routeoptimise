"use client";
import { useState, useEffect, useRef } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { stringify } from 'flatted';

// import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

export default function BusToSchoolSidebar({ isOpen, onClose, mapRef, mapElements, onRadiusValuesChange, openComponent}) {

  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  const [numVehicles, setNumVehicles] = useState(10);
  const [maxStopsPerVehicle, setMaxStopsPerVehicle] = useState(20);
  const [maxTravelTime, setMaxTravelTime] = useState(150);


  const elements = mapElements || [];
  // console.table(elements);

  

  // const [isOpenDD, setIsOpenDD] = useState(false);

  // const toggleDropdown = () => {
  //   setIsOpenDD((prev) => !prev);
  // };


  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };



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



  const busStopsData = [
    { id: 1, name: "Bus Stop 1", students: ["Student 1", "Student 2", "Student 3"] },
    { id: 2, name: "Bus Stop 2", students: ["Student 4", "Student 5"] },
    { id: 3, name: "Bus Stop 3", students: ["Student 6", "Student 7", "Student 8", "Student 9"] },
    { id: 4, name: "Bus Stop 4", students: [] },
    { id: 5, name: "Bus Stop 5", students: ["Student 1", "Student 2", "Student 3"] },
    { id: 6, name: "Bus Stop 6", students: ["Student 4", "Student 5"] },
    { id: 7, name: "Bus Stop 7", students: ["Student 6", "Student 7", "Student 8", "Student 9"] },
    { id: 8, name: "Bus Stop 8", students: [] },
  ];







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
  const [fields, setFields] = useState([]); // เก็บข้อมูล input
  const [showFields, setShowFields] = useState(false); // ควบคุมการแสดง input และปุ่ม Clear
  const [radiusValues, setRadiusValues] = useState([]); // สำหรับจัดการ radius ของแต่ละ field
  const [showFields2, setShowFields2] = useState(true);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // สถานะปุ่ม

  const handleAddInput = async () => {
    
    setIsButtonDisabled(true); // ปิดปุ่มเมื่อกำลังเพิ่มข้อมูล
    
    // แสดง fields ทันที
    setShowFields(true);
  
    // เพิ่มฟิลด์ว่างๆ ทันที
    setFields((prevFields) => [...prevFields, ""]);
    setRadiusValues([...radiusValues, 0.5]);
  
    // รอให้ผู้ใช้คลิกแผนที่และอัปเดตข้อมูล
    await addInput();  // แก้ไขให้เป็น await เพื่อรอให้ฟังก์ชันทำงานเสร็จ

    setIsButtonDisabled(false); // เปิดปุ่มอีกครั้งเมื่อ addInput เสร็จ
};
  
  const addInput = async () => {
    if (mapRef.current) {
      try {
        // รอให้ผู้ใช้คลิกแผนที่
        const lnglat = await mapRef.current.handleAddCircleClick();
        console.log("Longitude and Latitude in BusToSchool:", lnglat);
  
        // อัปเดต fields ด้วยค่าพิกัดที่ได้จากแผนที่
        setFields((prevFields) => {
          const updatedFields = [...prevFields];
          updatedFields[updatedFields.length - 1] = `${lnglat.lng}, ${lnglat.lat}`; // อัปเดต field ล่าสุดที่ถูกเพิ่มเข้ามา
          return updatedFields;
        });
      } catch (error) {
        console.error("Error in addInput:", error);
      }
    }
    console.log("ปิดแมะ");
  };
  
  

  const removeInput = (idx) => {
    setFields((prevFields) => prevFields.filter((_, i) => i !== idx)); // ลบ input ตาม index
    setRadiusValues((prevFields) => prevFields.filter((_, i) => i !== idx));
    // setFields(fields.filter((_, i) => i !== idx)); // ลบ input ตาม index
    if (fields.length === 1) {
      setShowFields(false); // ซ่อน input และปุ่ม Clear ถ้าไม่มี input เหลือ
    }
    if (mapRef.current) {
      mapRef.current.removeElement(idx); // เรียก removeElement ผ่าน ref
    }
    setIsButtonDisabled(false)
  };

  

  // const removeInput = (idx) => {
  //   setFields((prevFields) => {
  //     // ลบ index ที่เลือกออก
  //     const updatedFields = prevFields.filter((_, i) => i !== idx);
  
  //     // อัปเดต index ใหม่ (หากจำเป็น)
  //     return updatedFields;
  //   });
  
  //   if (fields.length === 1) {
  //     setShowFields(false); // ซ่อน input และปุ่ม Clear ถ้าไม่มี input เหลือ
  //   }
  
  //   // ลบ element บนแผนที่ผ่าน mapRef
  //   if (mapRef.current) {
  //     mapRef.current.removeElement(idx); // เรียก removeElement ผ่าน ref
  //   }
  // };
  
  

  const clearAll = () => {
    setFields([]); // ลบ input ทั้งหมด
    setShowFields(false); // ซ่อน input และปุ่ม Clear
    if (mapRef.current) {
      mapRef.current.clearAllElements()
    }
    setRadiusValues([])
    setIsButtonDisabled(false)
    setShowFields2(true)
  };

  const handleChange = (idx, value) => {
    const updatedFields = [...fields];
    updatedFields[idx] = value;
    setFields(updatedFields);
  };




  // const [fields, setFields] = useState([{ name: "", geocoderRef: null }]);

  // const handleAddField = () => {
  //   if (mapRef.current) {
  //     mapRef.current.handleAddCircleClick(); 
  //   }
  //   setFields([...fields, { name: "", geocoderRef: null }]);
  // };

  // const handleRemoveField = (index) => {
  //   setFields(fields.filter((_, idx) => idx !== index));
  // };

  // const handleChange = (index, value) => {
  //   const updatedFields = [...fields];
  //   updatedFields[index].name = value;
  //   setFields(updatedFields);
  // };

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
  //-------------------------------------------------------
  // const [radius, setRadius] = useState(["1"]);

  // const handleChangeRadius = (e) => {
  //   const inputValue = e.target.value;

  //   // ใช้ regex ตรวจสอบทศนิยมไม่เกิน 1 ตำแหน่ง
  //   if (/^\d*\.?\d{0,1}$/.test(inputValue)) {
  //     setRadius(inputValue); // อัปเดตค่าเฉพาะที่ผ่านเงื่อนไข
  //   }
  // };





  // const handleChangeRadius = (idx, value) => {
  //   if (/^\d*\.?\d{0,1}$/.test(value)) {
  //     const updatedRadius = [...radiusValues];
  //     updatedRadius[idx] = value; // อัปเดตค่า radius ของ field นั้น
  //     setRadiusValues(updatedRadius);

  //     // ส่งค่า radius ไปยัง Map เพื่ออัปเดตวงกลม
  //     if (mapRef.current) {
  //       mapRef.current.updateCircleRadius(idx, parseFloat(value));  // ส่งไปยัง Map
  //     }
  //     // ส่งค่าผ่าน props ไปยัง Parent Component (Sidebar)
  //     onRadiusValuesChange(updatedRadius); // ส่งค่ากลับไป
  //   }
  // };


  const handleChangeRadius = (idx, value) => {
    // ตรวจสอบ input ให้แน่ใจว่าเป็นตัวเลขในรูปแบบที่ต้องการ (ทศนิยมไม่เกิน 1 ตำแหน่ง)
    if (/^\d*\.?\d{0,1}$/.test(value)) {
      // อัปเดต state ของ radiusValues
      const updatedRadius = [...radiusValues];
      updatedRadius[idx] = value;
      setRadiusValues(updatedRadius);
  
      // ส่งค่าใหม่ไปยัง Map component โดยเรียกใช้ฟังก์ชันที่ mapRef expose (updateCircleRadius)
      if (mapRef.current) {
        mapRef.current.updateCircleRadius(idx, parseFloat(value));
      }
  
      // (ถ้ามี) ส่งค่ากลับไปยัง Parent Component ผ่าน props
      if (typeof onRadiusValuesChange === "function") {
        onRadiusValuesChange(updatedRadius);
      }
    }
  };
  


  const toClose = () => {
    setFields([]); // ลบ input ทั้งหมด
    setShowFields(false); // ซ่อน input และปุ่ม Clear
    if (mapRef.current) {
      mapRef.current.clearAllElements();
    }
    setRadiusValues([]);
    setIsButtonDisabled(false);
    onClose();
  };


  const findAuto = () =>{
    if (mapRef.current) {
      mapRef.current.handleFindAuto();
    }
    setShowFields(true);
    setShowFields2(false)
  }







  const [isLoading, setIsLoading] = useState();
  const typePage = "Bus To School"


  const findingRoute = async () => {
    try {
      setIsLoading(true); // เริ่มโหลด

      if (mapRef.current) {
        const { routes, routeColors, routeDistance, routeDuration, Didu, route_type, bus_SP } = await mapRef.current.handleSubmit(
          parseInt(numVehicles),
          parseInt(maxStopsPerVehicle),
          parseInt(maxTravelTime),
          true,
          "bus"
        );
        // openComponent("Route");
        openComponent("Route", { routes, routeColors, routeDistance, routeDuration, Didu, typePage, route_type, bus_SP });
      }

    } catch (error) {
      console.error("Error in findingRoute:", error);
    } finally {
      setIsLoading(false); // สิ้นสุดโหลด
    }
  };






















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
        <div className="sticky top-0">
          <div className="flex items-center justify-between mt-2 mb-2">
            <h2 className="text-lg font-bold">Bus To Schools</h2>

            {/* <button
              onClick={() => {
                onClose()
                clearAll()
              }}
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
              onClick={() => toClose()}
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


        {/* Header */}
        {/* <h2 className="text-lg font-bold mt-2">Home To Schools</h2> */}


        <div className="overflow-y-auto">

          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Bus Stops</h2>

              {showFields ? (
                <button
                  onClick={clearAll}
                  className="bg-red-500 text-white px-2 py-1 rounded-md 
               hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 
               text-md"
                >
                  Clear All
                </button>
              ) : (
                <button onClick={findAuto} className="px-2 py-1  bg-blue-400 rounded-md text-md text-white">
                  Find Auto
                </button>
              )}
            </div>

            {showFields && (
              <>
                {fields.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={
                        elements[idx]
                          ? `Lng: ${elements[idx].lng.toFixed(8)}, Lat: ${elements[idx].lat.toFixed(8)}`
                          : val
                      } // แสดงค่าจาก mapElements หรือค่าที่เก็บใน fields
                      onChange={(e) => handleChange(idx, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm w-full"
                      placeholder={`Input ${idx + 1}`}
                    />

                    <input
                      type="number"
                      min="0.0"
                      step="0.1"
                      value={radiusValues[idx] || ""} // ค่า radius ของ field นั้น
                      className={inputClass}
                      style={{ width: "60px" }}
                      onChange={(e) => handleChangeRadius(idx, e.target.value)}
                    />
                    <p>km</p>

                    <button
                      onClick={() => removeInput(idx)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </>
            )}


            {/* <button
              onClick={handleAddInput}
              disabled={isButtonDisabled} // ปิดการใช้งานปุ่มถ้ากดแล้ว
              className={`${isButtonDisabled ? "text-gray-400" : "text-blue-600 hover:text-blue-700"
                } text-sm flex justify-items-center mr-1`}
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
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              {isButtonDisabled ? "Add" : "Add "}
            </button> */}






{showFields2 && (
  <button
  onClick={handleAddInput}
  disabled={isButtonDisabled} // ปิดการใช้งานปุ่มถ้ากดแล้ว
  className={`${isButtonDisabled ? "text-gray-400" : "text-blue-600 hover:text-blue-700"
    } text-sm flex justify-items-center mr-1`}
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
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
  </svg>
  {isButtonDisabled ? "Adding..." : "Add "}
</button>
)}




      
            {/* <button
              onClick={addInput}
              className=" text-blue-600
             hover:text-blue-700
             text-sm flex justify-items-center mr-1"
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
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Add
            </button> */}

          </div>
        <hr className="m-[10px]" />

        {/* ช่องกรอกค่า Bus, Max Capacity, Max Time */}
        <div className="flex justify-center gap-3 p-2 m-2 bg-[#f9f9f9]">

          {/* <div className="flex flex-col text-[12px]">
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

          <div className="flex text-[12px] items-center">
            <label>Seats:</label>
            <input
              type="number"
              min="1"
              required
              value={maxStopsPerVehicle}
              onChange={(e) => setMaxStopsPerVehicle(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* <div className="flex flex-col text-[12px]">
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
{/* 
        <div className="mx-auto max-w-screen-sm p-2 sm:p-4 mb-[50px]">
            <div className="w-full space-y-2">
              {fields.map((busStop, index) => (
                <div key={busStop} className="w-full">
                  <button
                    type="button"
                    // onClick={() => toggleDropdown(busStop.id)}
                    className="w-full text-white bg-gray-400 justify-between flex h-10 rounded-lg text-sm px-5 py-2.5 items-center"
                  >
                    <p>Bus Stop # {index+1} (pax)</p>
                    <svg
                      className="w-2.5 h-2.5 ms-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>

                  {openDropdown === busStop.id && (
                    <div className="bg-gray-100 divide-y divide-gray-300 rounded-lg shadow-sm w-full dark:bg-gray-700">
                      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        {busStop.students.length > 0 ? (
                          busStop.students.map((student, index) => (
                            <li key={index} className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">
                              {student}
                            </li>
                          ))
                        ) : (
                          <li className="block px-4 py-2 text-gray-500">No students</li>
                        )}
                      </ul>
                    </div>
                  )}

                </div>
              ))}
            </div>
        </div>  */}



<div className="mx-auto max-w-screen-sm p-2 sm:p-4 mb-[50px]">
  <div className="w-full space-y-2">
    {elements.map((busStop, index) => (
      <div key={busStop.circleId} className="w-full">
        <button
          type="button"
          onClick={() => toggleDropdown(busStop.circleId)}
          className="w-full bg-blue-300 justify-between flex h-10 rounded-lg text-sm px-5 py-2.5 items-center text-black"
        >
          <p>
            <strong>Bus Stop #{index + 1} </strong> ({busStop.students.length} pax) 
          </p>
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        {openDropdown === busStop.circleId && (
          <div className="bg-white divide-y divide-gray-300 rounded-lg shadow-sm w-full dark:bg-gray-700">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {busStop.students && busStop.students.length > 0 ? (
                busStop.students.map((student, idx) => (
                  <li
                    key={idx}
                    className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    {student.student_id} {student.first_name} {student.last_name}
                  </li>
                ))
              ) : (
                <li className="block px-4 py-2 text-gray-500">No students</li>
              )}
            </ul>
          </div>
        )}
      </div>
    ))}
  </div>
</div>





        </div>

        {/* จุดสำคัญ: sticky bottom-0 */}
        <div className="mt-auto sticky bottom-0 left-0 right-0 bg-gray-100 border-t pt-2 pb-[20px]">
          <button
            onClick={findingRoute}
            className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-700"
          >
            Optimize Routes
          </button>
        </div>

      </div>
    </aside>
  );
}
