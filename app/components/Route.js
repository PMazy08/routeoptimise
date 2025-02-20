"use client";


import { useState, useEffect } from "react";
import DetailRouteSidebar from "./DetailRoute";
import { saveTrip } from "../services/tripService";
import { subscribeAuthState } from "../services/authService"; // Service สำหรับ auth state

import { fetchSchool} from "../services/schoolService";

export default function RouteSidebar({ isOpen, openComponent, onClose, mapRef, routes, routeColors, routeDistance, routeDuration, Didu, typePage, route_type, bus_SP, student_inBus}) {

  console.log("route by find: ", JSON.stringify(routes, null, 2));
  console.log("type ->", route_type);
  
  const [activeComponent, setActiveComponent] = useState("list"); // "list" = หน้ารายการ, "detail" = หน้ารายละเอียด
  const [selectedRoute, setSelectedRoute] = useState(null); // เก็บข้อมูลเส้นทางที่เลือก
  // const [distance, setDistance] = useState(null);



  // console.log("thiss routes :"+ routes);
  // console.log("thiss routes :", JSON.stringify(routes, null, 2));

  

  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  // console.log("F' Route Didu ->>>>"+Didu);
  // console.log("ROUTES Dur ->>>> "+routeDuration);




  // const handleRouteClick = (route, index) => {
  //   setSelectedRoute({ route, index }); // เก็บข้อมูลเส้นทาง
  //   setActiveComponent("detail"); // เปลี่ยนไปหน้ารายละเอียด
  // };
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token


  useEffect(() => {
    const unsubscribe = subscribeAuthState(setUser, setIdToken); // เรียกใช้ service
    return () => unsubscribe(); // เมื่อ component ถูกลบออก, ยกเลิกการ subscribe
  }, []); // ใช้ [] เพื่อให้เพียงแค่ครั้งแรกที่ mount

  const goBack = () => {
    mapRef.current.handleReset();
    setActiveComponent("list"); // กลับไปหน้ารายการ
  };


  const resetRoute = () => {
    if (mapRef.current) {
      mapRef.current.handleReset();
      mapRef.current.clearAllElements()
    }
    onClose()
    // openComponent("HomeToSchools");
  };

  const closePage = () => {
    if (mapRef.current) {
      mapRef.current.handleReset();
      mapRef.current.clearAllElements()
    }
    
    onClose()
  };

  const drawRoute = async(route, routeKey, routeColor, type) => {
    // console.log(distance, duration);
    mapRef.current.handleReset(); 
    await mapRef.current.handleDrawRoute(route, routeKey, routeColor, type);  // draw route

    // setSelectedRoute({ route, routeKey, routeColor, distance, duration}); // เก็บข้อมูลเส้นทาง
    // setActiveComponent("detail"); // เปลี่ยนไปหน้ารายละเอียด
  };

  const goDetail = async(route, routeKey, routeColor, type, distance, duration, route_type, bus_sp) => {
    console.log(route_type);
    mapRef.current.handleReset(); 
    await mapRef.current.handleDrawRoute(route, routeKey, routeColor, type);  // draw route

    setSelectedRoute({ route, routeKey, routeColor, distance, duration, route_type, bus_sp }); // เก็บข้อมูลเส้นทาง
    setActiveComponent("detail"); // เปลี่ยนไปหน้ารายละเอียด
  };




  const [isLoading, setIsLoading] = useState(false);

  // เดิมม
  // const handleSaveTrip = async () => {
  //   if (!idToken) {
  //     console.error("No idToken found");
  //     return;
  //   }
  
  //   setIsLoading(true);
  
  //   const tripData = {
  //     school_id: 1, // ถ้าต้องเลือกจาก UI ต้องเปลี่ยนให้ไดนามิก
  //     types: "Home To School", // สามารถเลือกจาก UI
  //     routes: routes
  //   }

  
  //   try {
  //     const result = await saveTrip(idToken, tripData); 
  //     console.log("🟢 Trip saved successfully:", result);
  //   } catch (error) {
  //     console.error("🔴 Failed to save trip:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  //used normally
  // const handleSaveTrip = async () => {
  //   if (!idToken) {
  //     console.error("No idToken found");
  //     return;
  //   }
  
  //   setIsLoading(true);
  
  //   const formattedRoutes = routes.map((route, index) => ({
  //     [`route ${index + 1}`]: route,  // แก้ไขให้ route เป็น array ของพิกัดโดยตรง
  //     color: routeColors[index] || "#000000"  // ใช้สีจาก routeColors หรือค่า default
  //   }));

  //   const data = await fetchSchool(idToken);

  //   const tripData = {
  //     school_id: data[0].id,
  //     types: typePage,
  //     routes: formattedRoutes
  //   };

  //   console.log("thiss routes:", JSON.stringify(tripData, null, 2));
    
  //     try {
  //       const result = await saveTrip(idToken, tripData); 
  //       console.log("Trip saved successfully:", result);
  //     } catch (error) {
  //       console.error("Failed to save trip:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  // };

  const handleSaveTrip = async () => {
    if (!idToken) {
      console.error("No idToken found");
      return;
    }
  
    setIsLoading(true);
  
    const formattedRoutes = routes.map((route, index) => ({
      [`route ${index + 1}`]: route, 
      color: routeColors[index] || "#000000"  
    }));
  
    const data = await fetchSchool(idToken);
  
    const tripData = {
      school_id: data[0].id,
      types: typePage,
      routes: formattedRoutes
    };
  
    console.log("📌 JSON Sent to API:", JSON.stringify(tripData, null, 2));
  
    try {
      const result = await saveTrip(idToken, tripData);
      console.log("✅ Trip saved successfully:", result);
    } catch (error) {
      console.error("❌ Failed to save trip:", error);
    } finally {
      setIsLoading(false);
    }
  };
  




  // ฟังก์ชันสำหรับดาวน์โหลดไฟล์ CSV
  const downloadFile = () => {
    let type = '';
    if(route_type === "import-home"){
      type = 'home'
    }else if (route_type === "import-bus"){
      type = 'bus'
    }else{
      type = route_type;
    }


    const csvHeaders = `route_name,latitude,longitude,color,student_lat,student_lng,${type}\n`;
    const csvRows = [];

    // วนลูป routes และ student_bus เพื่อสร้าง CSV
    routes.forEach((route, routeIndex) => {
        const routeKey = `route ${routeIndex + 1}`;
        const studentBusKey = `student_bus`;
        const color = routeColors[routeIndex] || ""; // ใช้สีของเส้นทาง

        // หาค่าที่ตรงกันของ student_bus
        const studentBus = route[studentBusKey] || [];
        let maxLength = Math.max(route[routeKey].length, studentBus.length);

        // วนลูปเพื่อรวมพิกัดของเส้นทางและนักเรียน
        for (let i = 0; i < maxLength; i++) {
            const coordinate = route[routeKey][i] || ["", ""]; // ใช้ค่าเว้นว่างถ้าไม่มีข้อมูล
            const student = studentBus[i] || ["", ""]; // ใช้ค่าเว้นว่างถ้าไม่มีข้อมูล

            const [latitude, longitude] = coordinate;
            const [student_lat, student_lng] = student;

            csvRows.push(`${routeKey},${latitude},${longitude},${color},${student_lat},${student_lng}`);
        }
    });

    // รวม header และ rows
    const csvContent = csvHeaders + csvRows.join("\n");

    // บันทึกไฟล์ CSV
    saveCSV(csvContent, `routesData_${type}.csv`);
  };

  // ฟังก์ชันสำหรับบันทึกไฟล์ CSV
  const saveCSV = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // สร้าง URL สำหรับดาวน์โหลด
    const url = URL.createObjectURL(blob);

    // สร้าง link สำหรับดาวน์โหลด
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);

    // คลิกเพื่อดาวน์โหลด
    link.click();

    // ทำลาย URL หลังจากการดาวน์โหลดเสร็จ
    URL.revokeObjectURL(url);
  };



  return (
    <aside
      id="additional-sidebar"
      className="fixed z-50 w-full sm:w-[500px] h-[450px] sm:h-screen bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300 
             bottom-0 sm:top-0 lg:top-0 transition-transform"
    >
      <div className="h-full flex flex-col overflow-y-auto px-3 pb-0">
        
        {/* Sticky top */}
        <div className="sticky top-0 bg-gray-100">
          <div className="flex items-center justify-between mt-2 mb-2">
            <h2 className="text-lg font-bold">Routes</h2>
          </div>
        </div>

        <div className="overflow-y-auto">
          <div className="w-full sm:w-full mx-auto p-4">
            <ul className="space-y-3 w-full">
              {/* เพิ่มรายการ All */}
              <li
                key="all"
                className={`cursor-pointer flex items-center justify-between w-full h-[80px] sm:h-[100px] rounded-lg text-gray-800 bg-white hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg`}
                onClick={() => {
                  routes.forEach((route, index) => {
                    drawRoute(routes[index], `route ${index + 1}`, routeColors[index], true);
                    // handleRouteClick(route, index);
                  });
                }}

              >


                {/* สีแท็บแสดงสถานะ */}
                <div className={`w-3 sm:w-5 h-full rounded-l-lg`} style={{
                  background: `linear-gradient(${routeColors.join(", ")})`,
                }}></div>

                {/* ข้อมูลเส้นทาง */}
                <div className="flex-1 px-4">
                  <p className="mb-1 text-xs sm:text-sm font-medium">
                    <strong>Route:</strong> All #
                  </p>
                </div>
              </li>


              {/* แมปข้อมูล items */}
              {routes.map((route, index) => {
                const diduArray = JSON.parse(Didu);
                console.log(route[`route ${index+1}`]);
                return (
                  <li
                    key={index}
                    className={`cursor-pointer flex items-center justify-between w-full h-[80px] sm:h-[100px] rounded-lg text-gray-800 bg-white hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg`}
                  >
                    {/* สีแท็บแสดงสถานะ */}
                    <div
                      className={`w-3 sm:w-5 h-full rounded-l-lg`}
                      style={{ backgroundColor: routeColors[index] }}
                    ></div> 

                    {/* ข้อมูลเส้นทาง */}
                    <div
                      className="flex-1 px-4"
                      onClick={() => {
                        
                        
                        drawRoute(route, `route ${index + 1}`, routeColors[index], true);
                        // handleRouteClick(route, index)
                      }}
                    >
                      <div className=" text-xs sm:text-sm font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bus-front" viewBox="0 0 16 16">
                          <path d="M5 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0m8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-6-1a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2zm1-6c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9s3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44 44 0 0 0 8 4m0-1c-1.837 0-3.353.107-4.448.22a.5.5 0 1 1-.104-.994A44 44 0 0 1 8 2c1.876 0 3.426.109 4.552.226a.5.5 0 1 1-.104.994A43 43 0 0 0 8 3"/>
                          <path d="M15 8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1V2.64c0-1.188-.845-2.232-2.064-2.372A44 44 0 0 0 8 0C5.9 0 4.208.136 3.064.268 1.845.408 1 1.452 1 2.64V4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v3.5c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2zM8 1c2.056 0 3.71.134 4.822.261.676.078 1.178.66 1.178 1.379v8.86a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5V2.64c0-.72.502-1.301 1.178-1.379A43 43 0 0 1 8 1"/>
                        </svg> 
                        <p className="ml-2">{index + 1} #</p>
                      </div>
                      <div className="text-xs sm:text-sm font-medium flex items-center">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-map-fill" viewBox="0 0 16 16">
                          <path d="M16 .5a.5.5 0 0 0-.598-.49L10.5.99 5.598.01a.5.5 0 0 0-.196 0l-5 1A.5.5 0 0 0 0 1.5v14a.5.5 0 0 0 .598.49l4.902-.98 4.902.98a.5.5 0 0 0 .196 0l5-1A.5.5 0 0 0 16 14.5zM5 14.09V1.11l.5-.1.5.1v12.98l-.402-.08a.5.5 0 0 0-.196 0zm5 .8V1.91l.402.08a.5.5 0 0 0 .196 0L11 1.91v12.98l-.5.1z"/>
                        </svg> */}
                        <p className="ml-0"> <strong>Distance: </strong> {diduArray[index].distance} KM</p>
                      </div>
                      <div className=" text-xs sm:text-sm font-medium flex items-center">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stopwatch-fill" viewBox="0 0 16 16">
                          <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584l.013-.012.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354-.012.012A6.97 6.97 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0"/>
                        </svg> */}
                        <p className="ml-0"><strong>Time: </strong> {diduArray[index].duration} Min</p>
                      </div>
                      <div className=" text-xs sm:text-sm font-medium flex items-center">
                      { route_type === "home" || route_type === "import-home" ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                          </svg>
                          <p className="ml-2">{ route[`route ${index + 1}`] ? route[`route ${index + 1}`].length - 2 : 0 }</p>
                        </>
                      ) : route_type === "bus" || route_type === "import-bus" ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                          </svg>
                          <p className="ml-2">{ route[`student_bus`] ? route[`student_bus`].length : 0 }</p>
                          {/* <p className="ml-2">{ bus_SP[index] && bus_SP[index][`student_bus ${index + 1}`] ? bus_SP[index][`student_bus ${index + 1}`].length : 0 }</p> */}
                        </>
                      // ) : route_type === "import-home" ? (
                      //   <>
                      //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                      //       <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                      //     </svg>
                      //     <p className="ml-2">{ route[`route ${index + 1}`] ? route[`route ${index + 1}`].length - 2 : 0 }</p>
                      //   </>
                      // ) : route_type === "import-bus" ? (
                      //   <>
                      //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                      //       <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                      //     </svg>
                      //     <p className="ml-2">{ route[`student_bus`] ? route[`student_bus`].length : 0 }</p>
                      //   </>
                      ):(
                        <>
                        </>
                      )}

{/* 
                        if(route_type === "home"){
                          <strong>Students:</strong> {route[`route ${index+1}`] ? route[`route ${index+1}`].length-2 : 0}
                        }else{
                          <strong>Students:</strong> {bus_SP[index] && bus_SP[index][`bus ${index + 1}`] ? bus_SP[index][`bus ${index + 1}`].length : 0}
                        } */}

                      
                      </div>
                    </div>

                    {/* ไอคอนลูกศร */}
                    <div
                      onClick={() =>
                        route_type === "home"
                          ? goDetail(
                              route,
                              `route ${index + 1}`,
                              routeColors[index],
                              false,
                              diduArray[index].distance,
                              diduArray[index].duration,
                              route_type
                            )               
                          : route_type === "bus"
                          ? goDetail(
                              route,
                              `route ${index + 1}`,
                              routeColors[index],
                              false,
                              diduArray[index].distance,
                              diduArray[index].duration,
                              route_type,
                              bus_SP[index]
                            )
                          : route_type === "import-home"
                          ? goDetail(
                              route,
                              `route ${index + 1}`,
                              routeColors[index],
                              false,
                              diduArray[index].distance,
                              diduArray[index].duration,
                              route_type
                            )
                          : route_type === "import-bus"
                          ? goDetail(
                              route,
                              `route ${index + 1}`,
                              routeColors[index],
                              false,
                              diduArray[index].distance,
                              diduArray[index].duration,
                              route_type
                            )
                          : console.warn("Unknown route_type:", route_type)
                      }

                      className="flex items-center mr-2 sm:mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-10 gray-800 transition-colors hover:stroke-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {(typePage === "Home To School" || typePage === "Bus To School") ? (
            <div className="mt-auto sticky bottom-0 left-0 right-0 bg-gray-100 border-t pt-6 pb-[20px] flex justify-between space-x-3">
              <button
                onClick={resetRoute}
                className="flex-1 text-white bg-red-500 p-2 rounded hover:bg-red-600"
              >
                Reset
              </button>

              <button
                onClick={handleSaveTrip}
                disabled={isLoading} // ปุ่มจะไม่สามารถกดได้เมื่อ isLoading เป็น true
                className={`flex-1 text-white p-2 rounded ${isLoading ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                  }`}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>


              <button
                onClick={downloadFile}
                // disabled={isLoading}
                className={`flex-1 text-white p-2 rounded ${isLoading ? "bg-blue-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                  }`}
              >
                Download
              </button>
            </div>
          ) : typePage === "history" ? (
            <div className="mt-auto sticky bottom-0 left-0 right-0 bg-gray-100 border-t pt-6 pb-[20px] flex justify-between space-x-3">
            <button
              onClick={closePage}
              className="flex-1 text-white bg-red-500 p-2 rounded hover:bg-red-600"
            >
              Close
            </button>
            <button
              onClick={downloadFile}
              className="flex-1 text-white bg-blue-500 p-2 rounded hover:bg-blue-600"
            >
              Download
            </button>
            </div>
          ) : (
            <div className="mt-auto sticky bottom-0 left-0 right-0 bg-gray-100 border-t pt-6 pb-[20px] flex justify-between space-x-3">
            <button
              onClick={closePage}
              className="flex-1 text-white bg-red-500 p-2 rounded hover:bg-red-600"
            >
              Close
            </button>
            </div>
          )
        }
      </div>



      {activeComponent === "detail" && selectedRoute && (
        <DetailRouteSidebar
          mapRef={mapRef}
          route={selectedRoute.route}
          routeIndex={selectedRoute.routeKey}
          color={selectedRoute.routeColor}
          distance={selectedRoute.distance}
          duration={selectedRoute.duration}
          route_type={selectedRoute.route_type}
          bus_SP={selectedRoute.bus_sp}
          

          onGoBack={goBack}
        />
      )}
    </aside>
  );
}
