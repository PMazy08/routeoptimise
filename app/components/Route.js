"use client";


import { useState, useEffect } from "react";
import DetailRouteSidebar from "./DetailRoute";
import { saveTrip } from "../services/tripService";
import { subscribeAuthState } from "../services/authService"; // Service สำหรับ auth state

export default function RouteSidebar({ isOpen, openComponent, onClose, mapRef, routes, routeColors, routeDistance, routeDuration, Didu, typePage, route_type, bus_SP, student_inBus}) {

  // console.log("this st bus ja", JSON.stringify(bus_SP, null, 2));
  console.log("this st bus ja", student_inBus);
  
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


  const handleSaveTrip = async () => {
    if (!idToken) {
      console.error("🔴 No idToken found");
      return;
    }
  
    setIsLoading(true);
  

  const formattedRoutes = routes.map((route, index) => ({
    [`route ${index + 1}`]: route,  // แก้ไขให้ route เป็น array ของพิกัดโดยตรง
    color: routeColors[index] || "#000000"  // ใช้สีจาก routeColors หรือค่า default
  }));

  const tripData = {
    school_id: 1,
    types: typePage,
    routes: formattedRoutes
  };

    console.log("📌 thiss routes:", JSON.stringify(tripData, null, 2));
  
    try {
      const result = await saveTrip(idToken, tripData); 
      console.log("🟢 Trip saved successfully:", result);
    } catch (error) {
      console.error("🔴 Failed to save trip:", error);
    } finally {
      setIsLoading(false);
    }
  };


  // ฟังก์ชันสำหรับดาวน์โหลดไฟล์ CSV
  const downloadFile = () => {
    // สร้าง CSV จาก routes และ routeColors
    const csvHeaders = `route_name,latitude,longitude,color,${route_type}\n`;
    const csvRows = [];

    // สร้างข้อมูล CSV โดยใช้ข้อมูลจาก routes และ routeColors
    routes.forEach((route, routeIndex) => {
      const routeKey = `route ${routeIndex + 1}`;
      const color = routeColors[routeIndex]; // ใช้สีที่ตรงกับแต่ละ route

      // เพิ่มพิกัดและสีลงใน CSV
      route[routeKey].forEach(coordinate => {
        const [latitude, longitude] = coordinate;
        csvRows.push(`${routeKey},${latitude},${longitude},${color}`);
      });
    });

    // รวม header และ rows
    const csvContent = csvHeaders + csvRows.join("\n");

    // สร้าง Blob จากข้อมูล CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // สร้าง URL สำหรับดาวน์โหลด
    const url = URL.createObjectURL(blob);

    // สร้าง link สำหรับดาวน์โหลด
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'routes_data.csv');
    
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
                      <p className="mb-1 text-xs sm:text-sm font-medium">
                        <strong>Route:</strong> {index + 1} #
                      </p>
                      <p className="mb-1 text-xs sm:text-sm">
                        <strong>Distance:</strong> {diduArray[index].distance} KM
                      </p>
                      <p className="text-xs sm:text-sm">
                        <strong>Time:</strong> {diduArray[index].duration} Min
                      </p>
                      <p className="text-xs sm:text-sm">
                      { route_type === "home" ? (
                        <>
                          <strong>Students:</strong> { route[`route ${index + 1}`] ? route[`route ${index + 1}`].length - 2 : 0 }
                        </>
                      ) : route_type === "bus" ? (
                        <>
                          <strong>Students:</strong> { bus_SP[index] && bus_SP[index][`bus ${index + 1}`] ? bus_SP[index][`bus ${index + 1}`].length : 0 }
                        </>
                      ) : (
                        <>
                          <strong>Students:</strong> { route[`route ${index + 1}`] ? route[`route ${index + 1}`].length - 2 : 0 }
                        </>
                      )}

{/* 
                        if(route_type === "home"){
                          <strong>Students:</strong> {route[`route ${index+1}`] ? route[`route ${index+1}`].length-2 : 0}
                        }else{
                          <strong>Students:</strong> {bus_SP[index] && bus_SP[index][`bus ${index + 1}`] ? bus_SP[index][`bus ${index + 1}`].length : 0}
                        } */}

                      
                      </p>
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
                            : goDetail(
                                route,
                                `route ${index + 1}`,
                                routeColors[index],
                                false,
                                diduArray[index].distance,
                                diduArray[index].duration,
                                route_type,
                                bus_SP[index]
                              )
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
