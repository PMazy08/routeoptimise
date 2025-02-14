"use client";
import { useState, useEffect } from "react";
import { fetchTrips, deleteTrip, deleteTripService } from "../services/tripService";
import { subscribeAuthState } from "../services/authService";

import { fetchRouteByTripId } from "../services/routeService";

import FindingOverlay from '../modals/FindingModal'; // นำเข้า Component
import DeleteModal from "../modals/ConfirmationModal";
import NotificationModal from "../modals/NotificationModal";

export default function HistoryRouteSidebar({ isOpen, onClose, openComponent, mapRef }) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token
  const [trips, setTrips] = useState([]);

  const [isLoadingData, setIsLoadingData] = useState(false); // State for loading status
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [alertMessage, setAlertMessage] = useState(null);

  const [deleteId, setDeleteId] = useState(null);




  useEffect(() => {
    const unsubscribe = subscribeAuthState(setUser, setIdToken); // เรียกใช้ service
    return () => unsubscribe(); // เมื่อ component ถูกลบออก, ยกเลิกการ subscribe
  }, []); // ใช้ [] เพื่อให้เพียงแค่ครั้งแรกที่ mount

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true); // Start loading
      try {
        if (idToken) {
          const data = await fetchTrips(idToken); // Call your service
          setTrips(data);
          console.log(data);

        }
      } catch (error) {
        console.error("Error fetching marker data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData(); // Call the async function
  }, [idToken]);



  const [isLoading, setIsLoading] = useState();
  const typePage = "history"
  const route_type = "home"

  const findingRouteByTripId = async (trips_id) => {
    console.log("TRIP: ", trips_id);
    
    try {
      setIsLoading(true); // เริ่มโหลด

      if (mapRef.current) {
        const { routes, routeColors, routeDistance, routeDuration, Didu } = await mapRef.current.handleSubmit(
          0,
          0,
          0,
          true,
          "his",
          trips_id
        );
        // openComponent("Route");
        openComponent("Route", { routes, routeColors, routeDistance, routeDuration, Didu, typePage, route_type });
      }

    } catch (error) {
      console.error("Error in findingRoute:", error);
    } finally {
      setIsLoading(false); // สิ้นสุดโหลด
    }
  };

  const fetchTripsAgain = async () => {
    setIsLoadingData(true);
    try {
      if (idToken) {
        const data = await fetchTrips(idToken);
        setTrips(data);
        console.log("Updated Trips:", data);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // const deleteTrip = async (tripId) =>{
  //   const userConfirm = confirm(`Do you really want to delete trip ID: ${tripId}?`);
  //   if (!userConfirm) return;

  //   try {
  //     await deleteTripService(idToken, tripId);
  //     await fetchTripsAgain(); // ✅ รีโหลดรายการ Trip ใหม่
  //   } catch (error) {
  //     console.error("Error deleting trip:", error);
  //     alert("Failed to delete trip! Check the console for more details.");
  //   }
  // }

  const deleteTrip = (id) => {
    setDeleteId(id)
    setShowDeleteModal(true); // เปิด modal สำหรับยืนยันการลบ
  };


  const handleDeleteConfirm = async () => {
    console.log("DETELE Real: ", deleteId);
    
    try {
      setShowDeleteModal(false); // ปิด modal
      await deleteTripService(idToken, deleteId);  // เรียก service ลบ trip


      setAlertMessage({
        type: "success",
        message: "Trip deleted successfully!"
      });
  
      // ตั้งเวลาให้ข้อความแจ้งเตือนหายไปหลังจาก 3 วินาที
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);


      await fetchTripsAgain(); // รีโหลดรายการ trip
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("Failed to delete trip! Check the console for more details.");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false); // ปิด modal เมื่อผู้ใช้ยกเลิก
  };







  return (
    <aside
      id="additional-sidebar"
      className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-white border-t sm:border-t-0 sm:border-r border-gray-300 bottom-0 sm:top-0 lg:top-0 transition-transform"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-lg font-bold">History Route</h2>

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

        {isLoadingData ? (
          <div className="text-center mt-4">
            <p>Loading...</p>
          </div>
        ) : trips.length === 0 ? ( // ✅ ตรวจสอบว่าข้อมูลว่าง
          <div className="text-center mt-4 text-gray-500">
            <p>No trips found</p> {/* ✅ แสดงข้อความถ้า trips ว่าง */}
          </div>
        ) : (
          <ul className="bg-white shadow overflow-y-auto sm:rounded-md max-w-lg mx-lg m-2 max-h-lg">
            {trips.map((trip, index) => (
              <li
                key={index}
                className={`cursor-pointer border-t border-gray-200 hover:bg-gray-100 transition-all`}
              >
                <div className="px-4 py-5 sm:px-6">
                  <div onClick={() => findingRouteByTripId(trip.id)} className="flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      <div>
                        <div className="mb-[10px]">
                          <strong>{trip.school}</strong>
                        </div>
                        {new Intl.DateTimeFormat('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        }).format(new Date(trip.dataTime))}
                      </div>
                    </h3>
                    {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Students:
            </p> */}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      Type:{" "}
                      <span
                        className={`text-sm font-medium ${trip.types === "Home To School" ? "text-green-600" : "text-fuchsia-600"
                          }`}
                      >
                        {trip.types}
                      </span>
                    </p>
                    <a
                      className="font-medium text-red-600 hover:text-red-500"
                      onClick={() => {deleteTrip(trip.id), console.log("DELETE ID:", trip.id);}
                      }
                    >
                      Delete
                    </a>
                    {/* แสดง DeleteModal เมื่อ showDeleteModal เป็น true */}
                    {showDeleteModal && (
                      <DeleteModal
                        onConfirm={handleDeleteConfirm}
                        onCancel={handleDeleteCancel}
                        type='delete'
                        msg='Are you sure you want to delete?'
                      />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
  
      {isLoading && <FindingOverlay />}


      {/* แสดงข้อความแจ้งเตือน */}
      {alertMessage && (
        <NotificationModal type={alertMessage.type} msg={alertMessage.message} />
      )}


    </aside>
  );
}
