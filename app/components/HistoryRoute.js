"use client";
import { useState, useEffect} from "react";
import { fetchTrips } from "../services/tripService";
import { subscribeAuthState } from "../services/authService";

export default function HistoryRouteSidebar({ isOpen, onClose }) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token
  const [trips, setTrips] = useState([]);


  useEffect(() => {
    const unsubscribe = subscribeAuthState(setUser, setIdToken); // เรียกใช้ service
    return () => unsubscribe(); // เมื่อ component ถูกลบออก, ยกเลิกการ subscribe
  }, []); // ใช้ [] เพื่อให้เพียงแค่ครั้งแรกที่ mount

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (idToken) {
          const data = await fetchTrips(idToken); // Call your service
          setTrips(data);
          console.log(data);
          
        }
      } catch (error) {
        console.error("Error fetching marker data:", error);
      }
    };
  
    fetchData(); // Call the async function
  }, [idToken]);
  



  return (
    <aside
      id="additional-sidebar"
      className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300 bottom-0 sm:top-0 lg:top-0 transition-transform"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between mt-2">
          <h2 className="text-lg font-bold">History Route</h2>

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

        <ul className="bg-white shadow overflow-y-auto sm:rounded-md max-w-lg mx-lg m-2 max-h-lg">
          {trips.map((trip, index) => (
            <li
              key={index}
              className={`cursor-pointer border-t border-gray-200 hover:bg-gray-100 transition-all `}
            >
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true, // เปิด 12 ชั่วโมง
                    }).format(new Date(trip.dataTime))}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Students: 
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Type:{" "}
                    <span
                      className={`text-sm font-medium ${trip.types === "Home To School" ? "text-yellow-600" : "text-red-600"
                        }`}
                    >
                      {trip.types}
                    </span>
                  </p>
                  <a
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
