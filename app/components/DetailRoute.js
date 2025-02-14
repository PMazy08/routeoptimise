"use client";

import { useEffect, useState } from "react";
import { fetchStudentBatchData } from "../services/studentService"; // Service สำหรับเรียก batch data
import { subscribeAuthState } from "../services/authService"; // Service สำหรับ auth state

export default function DetailRouteSidebar({ route, routeIndex, color, distance, duration, onGoBack, mapRef, route_type, bus_SP }) {

  console.log("Yoo this is : "+JSON.stringify(bus_SP, null, 2));
  console.log("Yoo Route is : "+ JSON.stringify(route, null, 2));
  

  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAuthState(setUser, setIdToken);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const allCoordinates = [];
    if (route_type === "home") {
      if (route && typeof route === "object") {
        Object.entries(route).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((coordinate) => {
              const [lat, lng] = coordinate;
              allCoordinates.push({ lat, lng });
            });
          }
        });
      }
    } else {
      if (bus_SP && typeof bus_SP === "object") {
        Object.entries(bus_SP).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((coordinate) => {
              const [lat, lng] = coordinate;
              allCoordinates.push({ lat, lng });
            });
          }
        });
      }
    }
  
    setCoordinates(allCoordinates);
    console.log("Coordinates length:", allCoordinates.length);
  }, [route, route_type, bus_SP]);
  

  useEffect(() => {
    const fetchStudentDataForBatch = async () => {
      try {
        const fetchedData = await fetchStudentBatchData(idToken, coordinates);
        setStudentData(fetchedData);
        console.log("Fetched Student Data:", fetchedData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (coordinates.length > 0 && idToken) {
      fetchStudentDataForBatch();
    }
  }, [coordinates, idToken]);

  const idClick = (id) => {
    console.log("นี่ๆ ID: " + id);
  };

  const goMarker = (id) => {
    mapRef.current.goMarkerById(id); 
  };


  return (
    <aside id="detail-sidebar" className="fixed z-50 w-full sm:w-[500px] h-[450px] sm:h-screen bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300 bottom-0 sm:top-0 lg:top-0 transition-transform">
      <div className="h-full flex flex-col px-3 pb-0">
        <div className="sticky top-0 bg-gray-100">
          <div className="flex items-center justify-between mt-2 mb-2">
            <button onClick={onGoBack} className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-[5px] ">
          <div className="flex mt-5 items-center">
            <div style={{ width: "25px", height: "25px", backgroundColor: color, borderRadius: "3px", marginRight: "5px" }}></div>
            <p>
              <strong>Route:</strong> {routeIndex.replace("route ", "")}
            </p>
          </div>

          <div className="flex justify-between mb-2 mt">
            <p className="text-black">
              <strong>Distance:</strong> {distance} KM.
            </p>
            <p className="text-black">
              <strong>Duration:</strong> {duration} MIN.
            </p>
          </div>
        </div>
        <hr></hr>

        {loading ? (
          <div className="overflow-y-auto mt-5 mb-5">
            {coordinates.map((coordinate, idx) => (
              <div
                className="cursor-pointer"
                key={idx}
                style={{
                  height: "45px",
                  marginBottom: "10px",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(270deg, #cccccc, #f0f0f0, #cccccc)", // สีที่ชัดเจนขึ้น
                  backgroundSize: "200% 200%",
                  animation: "loadingAnimation 2s ease infinite", // Animation
                }}
              >
                <style>
                  {`
                    @keyframes loadingAnimation {
                      0% { background-position: 0% 50%; }
                      50% { background-position: 100% 50%; }
                      100% { background-position: 0% 50%; }
                    }
                  `}
                </style>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-y-auto mt-5 mb-5 ">
            {studentData.map((data, index) => (
              <div
                key={index}
                className="cursor-pointer bg-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => goMarker(data.id)}
                style={{
                  height: "45px",
                  marginBottom: "10px",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p className="">
                  {data.first_name} {data.last_name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
