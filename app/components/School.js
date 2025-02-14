
// import { useState, useEffect } from "react";
// import { subscribeAuthState } from "../services/authService"; // Service สำหรับ auth state
// import { fetchSchool, createSchool, updateSchool } from "../services/schoolService"; // Assuming the fetch function is imported here
// import MapSelect from "./MapSelect";

// export default function SchoolSidebar({ isOpen, onClose, mapRef }) {
//     if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

//     const [user, setUser] = useState(null);
//     const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token
//     const [school, setSchool] = useState({ id: 0, name: "", latitude: "", longitude: "" }); // State for the school data
//     const [isLoadingData, setIsLoadingData] = useState(false); // State for loading status

//     useEffect(() => {
//         const unsubscribe = subscribeAuthState(setUser, setIdToken); // Subscribe to auth state
//         return () => unsubscribe(); // เมื่อ component ถูกลบออก, ยกเลิกการ subscribe
//     }, []); // ใช้ [] เพื่อให้เพียงแค่ครั้งแรกที่ mount

//     useEffect(() => {
//         if (idToken) {
//             const fetchData = async () => {
//                 setIsLoadingData(true); // Start loading
//                 try {
//                     const data = await fetchSchool(idToken); // Fetch the school data
//                     if (data && data.length > 0) {
//                         const schoolData = data[0]; // Assuming only one school data is returned
//                         setSchool({
//                             id: schoolData.id || 0,
//                             name: schoolData.name || "",
//                             latitude: schoolData.latitude || "",
//                             longitude: schoolData.longitude || "",
//                         });
//                     }
//                 } catch (error) {
//                     console.error("Error fetching school data:", error);
//                 } finally {
//                     setIsLoadingData(false); // End loading
//                 }
//             };
//             fetchData();
//         }
//     }, [idToken]); // Effect triggers when `idToken` changes

//     const funcSchool = async () => {
//         if (!idToken) {
//             console.error("No idToken found");
//             return;
//         }

//         const dataSchool = {
//             name: school.name,
//             latitude: school.latitude,
//             longitude: school.longitude
//         };

//         if(school.id === 0){
//             if(school.name != '' && school.latitude != '' && school.longitude != ''){
//                 try {
//                     const result = await createSchool(idToken, dataSchool);
//                     return result;
//                 } catch (error) {
//                     console.log(error);
//                 }
//             }
//             alert("Please fill in all information.")
//             return
//         }

//         const userConfirm = confirm("Press a button!\nEither OK or Cancel.");
//         if (!userConfirm) {
//             return;
//         }
//         try {
//             updateSchool(idToken, school.id, school);
//             mapRef.current?.refetchData();
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const [isOpenMap, setOpenMap] = useState(false); // ตั้งสถานะเริ่มต้นให้เป็น false (แผนที่ปิด)

//     const openMap = () => {
//       setOpenMap((prev) => !prev); // เปลี่ยนสถานะจาก open เป็น close หรือจาก close เป็น open
//     };

//     // Update latitude and longitude based on map click/drag
//     const handleLocationChange = (lat, lng) => {
//         setSchool((prevSchool) => ({
//             ...prevSchool,
//             latitude: lat.toFixed(8),
//             longitude: lng.toFixed(8),
//         }));
//     };

//     return (
//         <aside
//             id="additional-sidebar"
//             className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-white border-t sm:border-t-0 sm:border-r border-gray-300 bottom-0 sm:top-0 lg:top-0 transition-transform"
//         >
//             <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">
//                 <div className="flex items-center justify-between mt-2">
//                     <h2 className="text-lg font-bold">School</h2>

//                     <button
//                         type="button"
//                         className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-[7px] focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
//                         onClick={onClose}
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

//                 {isLoadingData ? (
//                     <div className="text-center mt-4">
//                         <p>Loading...</p>
//                     </div>
//                 ) : (
//                     <>
//                         <div className="mt-4">
//                             <label htmlFor="school-name" className="block text-sm font-medium text-gray-700">
//                                 Name Of School
//                             </label>
//                             <input
//                                 type="text"
//                                 id="school-name"
//                                 value={school.name}
//                                 onChange={(e) => setSchool({ ...school, name: e.target.value })}
//                                 className="mt-1 h-10 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                             />
//                         </div>

//                         <div className="mt-4 flex space-x-4">
//                             <div className="w-1/2">
//                                 <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
//                                     Latitude
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="latitude"
//                                     value={school.latitude}
//                                     onChange={(e) => setSchool({ ...school, latitude: e.target.value })}
//                                     className="mt-1 h-10 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                 />
//                             </div>

//                             <div className="w-1/2">
//                                 <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
//                                     Longitude
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="longitude"
//                                     value={school.longitude}
//                                     onChange={(e) => setSchool({ ...school, longitude: e.target.value })}
//                                     className="mt-1 h-10 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                 />
//                             </div>

//                             <div >
//                                 <button onClick={openMap} className="bg-blue-500 rounded-[7px] w-[100px] h-10 text-white mt-6">
//                                     Map
//                                 </button>
//                             </div>
//                         </div>

//                         {isOpenMap && (
//                         <div className="mt-6 bg-black w-full h-60">
//                             <MapSelect
//                               latitude={parseFloat(school.latitude)}
//                               longitude={parseFloat(school.longitude)}
//                               onLocationChange={handleLocationChange}
//                             />
//                         </div>
//                         )}

//                         <div className="mt-6">
//                             <button onClick={funcSchool} type="button" className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
//                                 Save
//                             </button>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </aside>
//     );
// }







// use

// import { useState, useEffect } from "react";
// import { subscribeAuthState } from "../services/authService"; // Service สำหรับ auth state
// import { fetchSchool, createSchool, updateSchool } from "../services/schoolService"; // Assuming the fetch function is imported here
// import MapSelect from "./MapSelect";

// export default function SchoolSidebar({ isOpen, onClose, mapRef }) {
//     if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

//     const [user, setUser] = useState(null);
//     const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token
//     const [school, setSchool] = useState({ id: 0, name: "", latitude: "", longitude: "" }); // State for the school data
//     const [isLoadingData, setIsLoadingData] = useState(false); // State for loading status
//     const [initialLatitude, setInitialLatitude] = useState(""); // เก็บค่า latitude เริ่มต้น
//     const [initialLongitude, setInitialLongitude] = useState(""); // เก็บค่า longitude เริ่มต้น
//     const [isSaveEnabled, setIsSaveEnabled] = useState(false); // ใช้สำหรับเปิด/ปิดปุ่ม Save

//     useEffect(() => {
//         const unsubscribe = subscribeAuthState(setUser, setIdToken); // Subscribe to auth state
//         return () => unsubscribe(); // เมื่อ component ถูกลบออก, ยกเลิกการ subscribe
//     }, []); // ใช้ [] เพื่อให้เพียงแค่ครั้งแรกที่ mount

//     useEffect(() => {
//         if (idToken) {
//             const fetchData = async () => {
//                 setIsLoadingData(true); // Start loading
//                 try {
//                     const data = await fetchSchool(idToken); // Fetch the school data
//                     if (data && data.length > 0) {
//                         const schoolData = data[0]; // Assuming only one school data is returned
//                         setSchool({
//                             id: schoolData.id || 0,
//                             name: schoolData.name || "",
//                             latitude: schoolData.latitude || "",
//                             longitude: schoolData.longitude || "",
//                         });

//                         // ตั้งค่า initial latitude และ longitude
//                         setInitialLatitude(schoolData.latitude || "");
//                         setInitialLongitude(schoolData.longitude || "");
//                     }
//                 } catch (error) {
//                     console.error("Error fetching school data:", error);
//                 } finally {
//                     setIsLoadingData(false); // End loading
//                 }
//             };
//             fetchData();
//         }
//     }, [idToken]); // Effect triggers when `idToken` changes

//     const funcSchool = async () => {
//         if (!idToken) {
//             console.error("No idToken found");
//             return;
//         }

//         const dataSchool = {
//             name: school.name,
//             latitude: school.latitude,
//             longitude: school.longitude
//         };

//         if(school.id === 0){
//             if(school.name !== '' && school.latitude !== '' && school.longitude !== '') {
//                 try {
//                     const result = await createSchool(idToken, dataSchool);
//                     return result;
//                 } catch (error) {
//                     console.log(error);
//                 }
//             }
//             alert("Please fill in all information.");
//             return;
//         }

//         const userConfirm = confirm("Press a button!\nEither OK or Cancel.");
//         if (!userConfirm) {
//             return;
//         }
//         try {
//             updateSchool(idToken, school.id, school);
//             mapRef.current?.refetchData();
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const [isOpenMap, setOpenMap] = useState(false); // ตั้งสถานะเริ่มต้นให้เป็น false (แผนที่ปิด)

//     const openMap = () => {
//         setOpenMap((prev) => !prev); // เปลี่ยนสถานะจาก open เป็น close หรือจาก close เป็น open
//     };

//     // Update latitude and longitude based on map click/drag
//     const handleLocationChange = (lat, lng) => {
//         setSchool((prevSchool) => ({
//             ...prevSchool,
//             latitude: lat.toFixed(8),
//             longitude: lng.toFixed(8),
//         }));

//         // ตรวจสอบว่า latitude และ longitude มีการเปลี่ยนแปลงจากค่าที่เริ่มต้นหรือไม่
//         if (lat.toFixed(8) !== initialLatitude || lng.toFixed(8) !== initialLongitude) {
//             setIsSaveEnabled(true); // หากมีการเปลี่ยนแปลง เปิดปุ่ม Save
//         } else {
//             setIsSaveEnabled(false); // หากไม่มีการเปลี่ยนแปลง ปิดปุ่ม Save
//         }
//     };

//     return (
//         <aside
//             id="additional-sidebar"
//             className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-white border-t sm:border-t-0 sm:border-r border-gray-300 bottom-0 sm:top-0 lg:top-0 transition-transform"
//         >
//             <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">
//                 <div className="flex items-center justify-between mt-2">
//                     <h2 className="text-lg font-bold">School</h2>

//                     <button
//                         type="button"
//                         className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-[7px] focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
//                         onClick={onClose}
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

//                 {isLoadingData ? (
//                     <div className="text-center mt-4">
//                         <p>Loading...</p>
//                     </div>
//                 ) : (
//                     <>
//                         <div className="mt-4">
//                             <label htmlFor="school-name" className="block text-sm font-medium text-gray-700">
//                                 Name Of School
//                             </label>
//                             <input
//                                 type="text"
//                                 id="school-name"
//                                 value={school.name}
//                                 onChange={(e) => setSchool({ ...school, name: e.target.value })}
//                                 className="mt-1 h-10 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                             />
//                         </div>

//                         <div className="mt-4 flex space-x-4">
//                             <div className="w-1/2">
//                                 <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
//                                     Latitude
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="latitude"
//                                     value={school.latitude}
//                                     onChange={(e) => setSchool({ ...school, latitude: e.target.value })}
//                                     className="mt-1 h-10 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                 />
//                             </div>

//                             <div className="w-1/2">
//                                 <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
//                                     Longitude
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="longitude"
//                                     value={school.longitude}
//                                     onChange={(e) => setSchool({ ...school, longitude: e.target.value })}
//                                     className="mt-1 h-10 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                 />
//                             </div>

//                             <div>
//                                 <button onClick={openMap} className="bg-blue-500 rounded-[7px] w-[100px] h-10 text-white mt-6">
//                                     Map
//                                 </button>
//                             </div>
//                         </div>

//                         {isOpenMap && (
//                             <div className="mt-6 bg-black w-full h-60">
//                                 <MapSelect
//                                     latitude={parseFloat(school.latitude)}
//                                     longitude={parseFloat(school.longitude)}
//                                     onLocationChange={handleLocationChange}
//                                 />
//                             </div>
//                         )}

//                         <div className="mt-6 flex">
//                             {isSaveEnabled && (
//                                 <button
//                                     onClick={funcSchool}
//                                     type="button"
//                                     className={`w-full ${isSaveEnabled ? "bg-red-500 hover:bg-red-600" : "bg-gray-400"}  mr-2 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
//                                     disabled={!isSaveEnabled}
//                                 >
//                                     cancel
//                                 </button>
//                             )}

//                             <button
//                                 onClick={funcSchool}
//                                 type="button"
//                                 className={`w-full ${isSaveEnabled ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"}  text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
//                                 disabled={!isSaveEnabled}
//                             >
//                                 Save
//                             </button>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </aside>
//     );
// }

import { useState, useEffect } from "react";
import { subscribeAuthState } from "../services/authService"; // Service สำหรับ auth state
import { fetchSchool, createSchool, updateSchool } from "../services/schoolService"; // Assuming the fetch function is imported here
import MapSelect from "./MapSelect";
import NotificationModal from "../modals/NotificationModal";

export default function SchoolSidebar({ isOpen, onClose, mapRef }) {
    if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

    const [user, setUser] = useState(null);
    const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token
    const [school, setSchool] = useState({ id: 0, name: "", latitude: "0", longitude: "0" }); // State for the school data, default lat/lng set to 0
    const [isLoadingData, setIsLoadingData] = useState(false); // State for loading status
    const [initialLatitude, setInitialLatitude] = useState("0"); // เก็บค่า latitude เริ่มต้น
    const [initialLongitude, setInitialLongitude] = useState("0"); // เก็บค่า longitude เริ่มต้น
    const [initialName, setInitialName] = useState(""); // เก็บค่า longitude เริ่มต้น
    const [isSaveEnabled, setIsSaveEnabled] = useState(false); // ใช้สำหรับเปิด/ปิดปุ่ม Save

    const [alertMessage, setAlertMessage] = useState(null);


    useEffect(() => {
        const unsubscribe = subscribeAuthState(setUser, setIdToken); // Subscribe to auth state
        return () => unsubscribe(); // เมื่อ component ถูกลบออก, ยกเลิกการ subscribe
    }, []); // ใช้ [] เพื่อให้เพียงแค่ครั้งแรกที่ mount

    useEffect(() => {
        if (idToken) {
            const fetchData = async () => {
                setIsLoadingData(true); // Start loading
                try {
                    const data = await fetchSchool(idToken); // Fetch the school data
                    if (data && data.length > 0) {
                        const schoolData = data[0]; // Assuming only one school data is returned
                        setSchool({
                            id: schoolData.id || 0,
                            name: schoolData.name || "",
                            latitude: schoolData.latitude || "0", // Default to 0 if not available
                            longitude: schoolData.longitude || "0", // Default to 0 if not available
                        });

                        // ตั้งค่า initial latitude และ longitude
                        setInitialName(schoolData.name || "")
                        setInitialLatitude(schoolData.latitude || "0"); // Set initial values to 0 if missing
                        setInitialLongitude(schoolData.longitude || "0"); // Set initial values to 0 if missing
                    } else {
                        // If no data returned, default latitude and longitude to 0
                        setSchool({ id: 0, name: "", latitude: "0", longitude: "0" });
                    }
                } catch (error) {
                    console.error("Error fetching school data:", error);
                } finally {
                    setIsLoadingData(false); // End loading
                }
            };
            fetchData();
        }
    }, [idToken]); // Effect triggers when `idToken` changes

    // const funcSchool = async () => {
    //     if (!idToken) {
    //         console.error("No idToken found");
    //         return;
    //     }

    //     const dataSchool = {
    //         name: school.name,
    //         latitude: school.latitude,
    //         longitude: school.longitude
    //     };

    //     if(school.id === 0){
    //         if(school.name !== '' && school.latitude !== '' && school.longitude !== '') {
    //             try {
    //                 setIsSaveEnabled(false);
    //                 await createSchool(idToken, dataSchool);
    //                 setAlertMessage({
    //                     type: "success",
    //                     message: "School Created Successfully!"
    //                   });
                  
    //                   // ตั้งเวลาให้ข้อความแจ้งเตือนหายไปหลังจาก 3 วินาที
    //                   setTimeout(() => {
    //                     setAlertMessage(null);
    //                   }, 3000);
                      
    //                 mapRef.current?.refetchData();
    //                 return;
    //             } catch (error) {
    //                 console.log(error);
    //             }
    //         }
    //         setAlertMessage({
    //             type: "warning",
    //             message: "Please fill in all information!"
    //           });
          
    //           // ตั้งเวลาให้ข้อความแจ้งเตือนหายไปหลังจาก 3 วินาที
    //           setTimeout(() => {
    //             setAlertMessage(null);
    //           }, 3000);
    //         return;
    //     }

    //     // const userConfirm = confirm("Press a button!\nEither OK or Cancel.");

    //     // if (!userConfirm) {
    //     //     return;
    //     // }


    //     setIsSaveEnabled(false);
    //     if(school.name !== '' && school.latitude !== '' && school.longitude !== '') {
    //         try {
    //             updateSchool(idToken, school.id, school);
    //             setAlertMessage({
    //                 type: "success",
    //                 message: "School Update Successfully!"
    //               });
              
    //               // ตั้งเวลาให้ข้อความแจ้งเตือนหายไปหลังจาก 3 วินาที
    //               setTimeout(() => {
    //                 setAlertMessage(null);
    //               }, 3000);
    //             mapRef.current?.refetchData();
    //             return;
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    //     setAlertMessage({
    //         type: "warning",
    //         message: "Please fill in all information!"
    //       });
      
    //       // ตั้งเวลาให้ข้อความแจ้งเตือนหายไปหลังจาก 3 วินาที
    //       setTimeout(() => {
    //         setAlertMessage(null);
    //       }, 3000);
    //     return;
    // };




    const funcSchool = async () => {
        if (!idToken) {
            console.error("No idToken found");
            return;
        }
    
        const dataSchool = {
            name: school.name,
            latitude: school.latitude,
            longitude: school.longitude
        };
    
        if(school.id === 0){
            if(school.name !== '' && school.latitude !== '' && school.longitude !== '') {
                try {
                    setIsSaveEnabled(false);
                    await createSchool(idToken, dataSchool);
                    setAlertMessage({
                        type: "success",
                        message: "School Created Successfully!"
                    });
    
                    // ตั้งเวลาให้ข้อความแจ้งเตือนหายไปหลังจาก 3 วินาที
                    setTimeout(() => {
                        setAlertMessage(null);
                    }, 3000);
                    
                    // รีเฟรชข้อมูล school ใหม่
                    fetchData(); // เรียกใช้ฟังก์ชัน fetchData
                    mapRef.current?.refetchData();
                    return;
                } catch (error) {
                    console.log(error);
                }
            }
            setAlertMessage({
                type: "warning",
                message: "Please fill in all information!"
            });
          
            // ตั้งเวลาให้ข้อความแจ้งเตือนหายไปหลังจาก 3 วินาที
            setTimeout(() => {
                setAlertMessage(null);
            }, 3000);
            return;
        }
    
        setIsSaveEnabled(false);
        if(school.name !== '' && school.latitude !== '' && school.longitude !== '') {
            try {
                await updateSchool(idToken, school.id, school);
                setAlertMessage({
                    type: "success",
                    message: "School Updated Successfully!"
                });
    
                // ตั้งเวลาให้ข้อความแจ้งเตือนหายไปหลังจาก 3 วินาที
                setTimeout(() => {
                    setAlertMessage(null);
                }, 3000);
                
                // รีเฟรชข้อมูล school ใหม่
                fetchData(); // เรียกใช้ฟังก์ชัน fetchData
                mapRef.current?.refetchData();
                return;
            } catch (error) {
                console.error(error);
            }
        }
        setAlertMessage({
            type: "warning",
            message: "Please fill in all information!"
        });
    
        // ตั้งเวลาให้ข้อความแจ้งเตือนหายไปหลังจาก 3 วินาที
        setTimeout(() => {
            setAlertMessage(null);
        }, 3000);
        return;
    };

    

    const fetchData = async () => {
        setIsLoadingData(true); // Start loading
        try {
            const data = await fetchSchool(idToken); // Fetch the school data
            if (data && data.length > 0) {
                const schoolData = data[0]; // Assuming only one school data is returned
                setSchool({
                    id: schoolData.id || 0,
                    name: schoolData.name || "",
                    latitude: schoolData.latitude || "0", // Default to 0 if not available
                    longitude: schoolData.longitude || "0", // Default to 0 if not available
                });
    
                // ตั้งค่า initial latitude และ longitude
                setInitialName(schoolData.name || "")
                setInitialLatitude(schoolData.latitude || "0"); // Set initial values to 0 if missing
                setInitialLongitude(schoolData.longitude || "0"); // Set initial values to 0 if missing
            } else {
                // If no data returned, default latitude and longitude to 0
                setSchool({ id: 0, name: "", latitude: "0", longitude: "0" });
            }
        } catch (error) {
            console.error("Error fetching school data:", error);
        } finally {
            setIsLoadingData(false); // End loading
        }
    };

    







    



    const [isOpenMap, setOpenMap] = useState(false); // ตั้งสถานะเริ่มต้นให้เป็น false (แผนที่ปิด)

    const openMap = () => {
        setOpenMap((prev) => !prev); // เปลี่ยนสถานะจาก open เป็น close หรือจาก close เป็น open
    };

    // Update latitude and longitude based on map click/drag
    const handleLocationChange = (lat, lng) => {
        setSchool((prevSchool) => ({
            ...prevSchool,
            latitude: lat.toFixed(8),
            longitude: lng.toFixed(8),
        }));

        // ตรวจสอบว่า latitude และ longitude มีการเปลี่ยนแปลงจากค่าที่เริ่มต้นหรือไม่
        if (lat.toFixed(8) !== initialLatitude || lng.toFixed(8) !== initialLongitude) {
            setIsSaveEnabled(true); // หากมีการเปลี่ยนแปลง เปิดปุ่ม Save
        } else {
            setIsSaveEnabled(false); // หากไม่มีการเปลี่ยนแปลง ปิดปุ่ม Save
        }
    };

    const handleCancel = () => {
        // รีเซ็ตค่า latitude และ longitude กลับไปเป็นค่าเดิม
        setSchool({
            ...school,
            name: initialName,
            latitude: initialLatitude,
            longitude: initialLongitude,
        });
        setIsSaveEnabled(false); // ปิดปุ่ม Save
    };

    return (
        <aside
            id="additional-sidebar"
            className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-white border-t sm:border-t-0 sm:border-r border-gray-300 bottom-0 sm:top-0 lg:top-0 transition-transform"
        >
            <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">
                <div className="flex items-center justify-between mt-2">
                    <h2 className="text-lg font-bold">School</h2>

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
                    </button>
                </div>

                {isLoadingData ? (
                    <div className="text-center mt-4">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        <div className="mt-4">
                            <label htmlFor="school-name" className="block text-sm font-medium text-gray-700">
                                Name Of School
                            </label>
                            <input
                                type="text"
                                id="school-name"
                                value={school.name}
                                onChange={(e) => {setSchool({ ...school, name: e.target.value }), setIsSaveEnabled(true)}}
                                className="mt-1 h-10 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div className="mt-4 flex space-x-4">
                            <div className="w-1/2">
                                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    id="latitude"
                                    min="-90"
                                    max="90"
                                    value={school.latitude}
                                    onChange={(e) => {setSchool({ ...school, latitude: e.target.value }), setIsSaveEnabled(true)} }
                                    className="mt-1 h-10 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div className="w-1/2">
                                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    id="longitude"
                                    min="-180"
                                    max="180"
                                    value={school.longitude}
                                    onChange={(e) => {setSchool({ ...school, longitude: e.target.value }); setIsSaveEnabled(true)}}
                                    className="mt-1 h-10 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <button onClick={openMap} className="bg-blue-500 rounded-[7px] w-[100px] h-10 text-white mt-6">
                                    Map
                                </button>
                            </div>
                        </div>

                        {isOpenMap && (
                            <div className="mt-6 bg-gray-400 w-full h-60">
                                <MapSelect
                                    latitude={Math.min(90, Math.max(-90, isNaN(parseFloat(school.latitude)) ? 0 : parseFloat(school.latitude)))} // ตรวจสอบว่าเป็น NaN หรือไม่
                                    longitude={Math.min(180, Math.max(-180, isNaN(parseFloat(school.longitude)) ? 0 : parseFloat(school.longitude)))} // ตรวจสอบว่าเป็น NaN หรือไม่
                                    onLocationChange={handleLocationChange}
                                />
                            </div>
                        )}

                        <div className="mt-6 flex">
                            {isSaveEnabled && (
                                <button
                                    onClick={handleCancel} // ทำให้ปุ่ม cancel คืนค่าที่เลือกไว้
                                    type="button"
                                    className={`w-full bg-red-500 hover:bg-red-600 mr-2 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
                                >
                                    Cancel
                                </button>
                            )}

                            {isSaveEnabled && (
                                <button
                                    onClick={funcSchool} // ทำให้ปุ่ม cancel คืนค่าที่เลือกไว้
                                    type="button"
                                    className={`w-full bg-green-500 hover:bg-green-600 mr-2 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
                                >
                                    Save
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
            {alertMessage && (
                <NotificationModal type={alertMessage.type} msg={alertMessage.message} />
            )}
        </aside>
    );
}


