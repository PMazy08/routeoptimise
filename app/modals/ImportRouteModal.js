// import React, { useState } from "react";

// const ImportRouteModal = ({ isOpen, closeModal }) => {
//     if (!isOpen) return null; // ถ้า modal ไม่เปิด ไม่แสดงอะไรเลย

//     return (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
//             <div className="w-[350px] sm:w-[500px] bg-white rounded-[7px]">

//                 <div className="flex justify-between">
//                     <div className="m-3">Import Route</div>
//                     <button
//                         type="button"
//                         className="flex justify-center items-center gap-x-3 size-6 m-3 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-[7px] focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
//                         onClick={closeModal}
//                     >
//                         <svg
//                             className="shrink-0 size-4"
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="24"
//                             height="24"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                         >
//                             <path d="M18 6 6 18" />
//                             <path d="m6 6 12 12" />
//                         </svg>
//                     </button>
//                 </div>

//                 <div className="pb-5 pr-3 pl-3">
//                     <div className="flex items-center justify-center w-full">
//                         <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
//                             <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                 <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
//                                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
//                                 </svg>
//                                 <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
//                                 <p className="text-xs text-gray-500 dark:text-gray-400">CSV, XLS or XLSX</p>
//                             </div>
//                             <input id="dropzone-file" type="file" className="hidden" />
//                         </label>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default ImportRouteModal;


// v2

// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import Papa from "papaparse";

// const ImportRouteModal = ({ isOpen, closeModal }) => {
//   const [dragging, setDragging] = useState(false);

//   if (!isOpen) return null; // ถ้า modal ไม่เปิด ไม่แสดงอะไรเลย

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setDragging(true);
//   };

//   const handleDragLeave = () => {
//     setDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setDragging(false);

//     const files = e.dataTransfer.files;
//     console.log("Files dropped: ", files);
//     handleFileProcessing(files);
//   };

//   const handleFileSelect = (e) => {
//     const files = e.target.files;
//     console.log("Files selected: ", files);
//     handleFileProcessing(files);
//   };

//   // Function to process the uploaded files
//   const handleFileProcessing = (files) => {
//     const file = files[0];
//     const fileExtension = file.name.split(".").pop().toLowerCase();

//     if (fileExtension === "csv") {
//       // Handle CSV file
//       parseCSV(file);
//     } else if (fileExtension === "xls" || fileExtension === "xlsx") {
//       // Handle XLSX/XLS file
//       parseXLSX(file);
//     } else {
//       console.error("Unsupported file type");
//     }
//   };

//   // Parse CSV file to JSON using PapaParse
//   const parseCSV = (file) => {
//     Papa.parse(file, {
//       complete: function (results) {
//         console.log("CSV data:", results.data);
//         // Do something with the JSON data (results.data)
//       },
//       header: true, // If CSV file has headers
//     });
//   };

//   // Parse XLSX file to JSON using xlsx library
//   const parseXLSX = (file) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = e.target.result;
//       const workbook = XLSX.read(data, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(sheet);
//       console.log("XLSX data:", jsonData);
//       // Do something with the JSON data (jsonData)
//     };
//     reader.readAsBinaryString(file);
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
//       <div className="w-[350px] sm:w-[500px] bg-white rounded-[7px]">
//         <div className="flex justify-between">
//           <div className="m-3">Import Route</div>
//           <button
//             type="button"
//             className="flex justify-center items-center gap-x-3 size-6 m-3 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-[7px] focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
//             onClick={closeModal}
//           >
//             <svg
//               className="shrink-0 size-4"
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M18 6 6 18" />
//               <path d="m6 6 12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="pb-5 pr-3 pl-3">
//           <div className="flex items-center justify-center w-full">
//             <label
//               htmlFor="dropzone-file"
//               className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
//               onDragOver={handleDragOver} // Listen for drag over
//               onDragLeave={handleDragLeave} // Listen for drag leave
//               onDrop={handleDrop} // Listen for file drop
//             >
//               <div
//                 className={`flex flex-col items-center justify-center pt-5 pb-6 ${
//                   dragging ? "bg-gray-200" : "bg-gray-50"
//                 }`} // Change background color when dragging over
//               >
//                 <svg
//                   className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 20 16"
//                 >
//                   <path
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
//                   />
//                 </svg>
//                 <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-semibold">Click to upload</span> or drag and
//                   drop
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   CSV, XLS or XLSX
//                 </p>
//               </div>
//               <input
//                 id="dropzone-file"
//                 type="file"
//                 className="hidden"
//                 onChange={handleFileSelect} // Listen for file selection
//               />
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImportRouteModal;


import React, { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import NotificationModal from "./NotificationModal";


const ImportRouteModal = ({ isOpen, closeModal, openComponent, mapRef }) => {
  const [dragging, setDragging] = useState(false);

  const [alertMessage, setAlertMessage] = useState(null);


  if (!isOpen) return null; // If modal is not open, return nothing

  // Handle when a file is dragged over the drop area
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  // Handle when a file is dragged out of the drop area
  const handleDragLeave = () => {
    setDragging(false);
  };

  // Handle file drop event
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const files = e.dataTransfer.files;
    console.log("Files dropped: ", files);
    handleFileProcessing(files);
  };

  // Handle file selection (manual file selection)
  const handleFileSelect = (e) => {
    const files = e.target.files;
    console.log("Files selected: ", files);
    handleFileProcessing(files);
  };

  // Function to process the uploaded files
  const handleFileProcessing = (files) => {
    const file = files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileExtension === "csv") {
      // Handle CSV file
      parseCSV(file);
    } else if (fileExtension === "xls" || fileExtension === "xlsx") {
      // Handle XLSX/XLS file
      parseXLSX(file);
    } else {
      // console.error("Unsupported file type");
      // alert("มันบ่แม่นไฟล์นี้อาววว")
      setAlertMessage({
        type: "warning",
        message: "Unsupported file type!"
      });
  
      // ตั้งเวลาให้ข้อความแจ้งเตือนหายไปหลังจาก 3 วินาที
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
    }
  };

  const typePage = "import"
  let route_type = '';

  // Parse CSV file to JSON using PapaParse
  const parseCSV = (file) => {
    Papa.parse(file, {
        complete: function (results) {
            console.log("CSV data:", results.data);
            
            const trips = [];

            const headers = results.meta.fields;
            if (headers && headers.length > 0) {
                route_type = "import-"+headers[headers.length - 1]; // เก็บ header ตัวสุดท้าย
            }

            results.data.forEach((row) => {
                if (!row.route_name) return; // ข้ามข้อมูลที่ไม่มี route_name
                
                const routeName = row.route_name;
                const coordinates = row.latitude && row.longitude 
                    ? [parseFloat(row.latitude), parseFloat(row.longitude)]
                    : null;
                const studentBus = row.student_lat && row.student_lng
                    ? [parseFloat(row.student_lat), parseFloat(row.student_lng)]
                    : null;
                const color = row.color;

                // ค้นหาเส้นทางใน trips
                let route = trips.find(trip => trip[routeName]);

                if (!route) {
                    route = { [routeName]: [], "color": color, "student_bus": [] };
                    trips.push(route);
                }

                // เพิ่มค่าลงใน routes
                if (coordinates) route[routeName].push(coordinates);
                if (studentBus) route["student_bus"].push(studentBus);
            });

            const jsonResult = { trips };
            console.log("Processed JSON:", JSON.stringify(jsonResult.trips, null, 2));
            
            // นำ JSON ไปใช้งาน
            findingRouteByImport(jsonResult.trips);
        },
        header: true, // กำหนดให้ CSV มี header
    });
};

  // Parse XLSX file to JSON using xlsx library
  const parseXLSX = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" }); // ป้องกันค่า null

        console.log("XLSX data:", jsonData);

        if (jsonData.length === 0) {
            console.error("❌ ไม่มีข้อมูลในไฟล์ XLSX");
            return;
        }
 
        // ดึง Header ตัวสุดท้ายจากไฟล์
        const headers = Object.keys(jsonData[0]).map(h => h.trim()); // ลบช่องว่างใน header
        route_type = "import-"+headers[headers.length - 1]; //คอลัมน์สุดท้าย
        // console.log("Last header:", lastHeader); 
        // ใช้งานค่าจาก header ตัวสุดท้าย
         
     
        // **แปลงข้อมูลเป็น JSON ที่ต้องการ**
        const trips = [];
        jsonData.forEach((row) => {
            if (!row.route_name) return; // ข้ามข้อมูลที่ไม่มี route_name

            const routeName = row.route_name;
            const coordinates = row.latitude && row.longitude
                ? [parseFloat(row.latitude), parseFloat(row.longitude)]
                : null;
            const studentBus = row.student_lat && row.student_lng
                ? [parseFloat(row.student_lat), parseFloat(row.student_lng)]
                : null;
            const color = row.color;

            // ค้นหาเส้นทางที่มีอยู่แล้วใน trips
            let route = trips.find(trip => trip[routeName]);

            if (!route) {
                route = { [routeName]: [], "color": color, "student_bus": [], [route_type]: [] };
                trips.push(route);
            }

            // เพิ่มค่าลงใน routes
            if (coordinates) route[routeName].push(coordinates);
            if (studentBus) route["student_bus"].push(studentBus);

            // เก็บค่า `home` หรือ `school` ถ้ามี
            if (row[route_type]) {
                route[route_type].push(row[route_type]);
            }
        });

        // console.log("Processed JSON:", JSON.stringify(trips, null, 2));
        console.log("route_type =", route_type); // ตรวจสอบค่า header ตัวสุดท้าย

        // นำ JSON ไปใช้งาน
        findingRouteByImport(trips);
    };
    reader.readAsBinaryString(file);
};













//---------------------











  const findingRouteByImport = async (jsonResult) => {
    try {
      if (mapRef.current) {
        const { routes, routeColors, routeDistance, routeDuration, Didu} = await mapRef.current.handleSubmit(
          0,
          0,
          0,
          true,
          "import",
          0,
          jsonResult
        ); 
        closeModal()
        // openComponent("Route");
        openComponent("Route", { routes, routeColors, routeDistance, routeDuration, Didu, typePage, route_type });
      }
      
  
    } catch (error) {
      console.error("Error in findingRoute:", error);
    } 
  };


  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50">
      <div className="w-[350px] sm:w-[500px] bg-white rounded-[7px]">
        <div className="flex justify-between">
          <div className="m-3"><strong>Import Routes</strong></div>
          <button
            type="button"
            className="flex justify-center items-center gap-x-3 size-6 m-3 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-[7px] focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
            onClick={closeModal}
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
          </button>
        </div>

        <div className="pb-5 pr-3 pl-3">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer ${
                dragging ? "bg-gray-200" : "bg-gray-50"
              }`}
              onDragOver={handleDragOver} // Listen for drag over
              onDragLeave={handleDragLeave} // Listen for drag leave
              onDrop={handleDrop} // Listen for file drop
            >
              <div
                className="flex flex-col items-center justify-center pt-5 pb-6"  // Change background color when dragging over
              >
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and
                  drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  CSV, XLS or XLSX
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileSelect} // Listen for file selection
              />
            </label>
          </div>
        </div>
      </div>
      {/* แสดงข้อความแจ้งเตือน */}
      {alertMessage && (
        <NotificationModal type={alertMessage.type} msg={alertMessage.message} />
      )}
    </div>
  );
};

export default ImportRouteModal;


