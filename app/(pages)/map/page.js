"use client";
import { useState, useRef, useEffect } from "react";
import Map from "../../components/Map";
import { useRouter } from "next/navigation";

// auth
import app from "../../../config.js";
import { getAuth, signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";


// Componets
import HomeToSchools from "../../components/HomToSchool";
import ButToSchools from "../../components/BusToSchool";
import HistoryRoute from "../../components/HistoryRoute";
import Student from "../../components/Student";
import School from "../../components/School";
import Route from "../../components/Route";

// Modals
import PasswordResetModal from "../../modals/PasswordResetModal"; // นำเข้า Component ใหม่
import AddSchoolModal from "../../modals/AddSchoolModal"; 
import ImportRouteModal from "../../modals/ImportRouteModal"; 

import ConfirmationModal from "@/app/modals/ConfirmationModal";


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // จัดการสถานะของ Sidebar

  const router = useRouter();
  const auth = getAuth(app);
  const [user, setUser] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [activeLink, setActiveLink] = useState("");
  const mapRef = useRef();


  const [emailForPasswordReset, setEmailForPasswordReset] = useState(""); // State for email input
  const [isResetModalOpen, setIsResetModalOpen] = useState(false); // To control reset modal visibility

  const [isImportRouteModalOpen, setIsImportRouteModalOpen] = useState(false); 

  const [showLogoutModal, setShowLogoutModal] = useState(false);




  // const [mapElements, setMapElements] = useState([]); // State สำหรับเก็บหมุด
  // const handleMapElementsUpdate = (elements) => {
  //   setMapElements(elements); // อัปเดต State mapElements
  // };


  const [mapElements, setMapElements] = useState([]); // State for map elements

  // Function to update mapElements
  const handleMapElementsUpdate = (elements) => {
    setMapElements(elements); // Update mapElements
    console.log("Updated mapElements in Sidebar:", elements); // Debugging
  };

  const [radiusValues, setRadiusValues] = useState([]);

  // ฟังก์ชันที่รับค่า radiusValues จาก BusToSchoolSidebar
  const handleRadiusValuesChange = (newRadiusValues) => {
    setRadiusValues(newRadiusValues);
  };



  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setIsDropdownOpen(false)
  };
  const toggleNav = () => {
    if (window.innerWidth <= 640) {
      setIsOpen(!isOpen); 
    }
  };


  const toggleComponent = (componentName, props = {}) => {
    setActiveComponent((prev) =>
      prev?.name === componentName ? null : { name: componentName, props }
    );
    setActiveLink(componentName);
  };
  
  // ต้องประกาศ commonProps ก่อน renderComponent
  const commonProps = {
    isOpen: true,
    openComponent: toggleComponent,
    onClose: () => {setActiveComponent(null);
      setIsOpen(true);
    },
  };


  const [markersData, setMarkersData] = useState([]);

  // Callback ที่จะถูกส่งไปยัง Map component เพื่อรับ markers data
  const handleMarkersUpdate = (data) => {
    setMarkersData(data);
  };

  
  const renderComponent = () => {
    if (!activeComponent) return null;
  
    const { name, props } = activeComponent;
  
    switch (name) {
      case "HomeToSchools":
        return <HomeToSchools mapRef={mapRef} {...commonProps} markersData={markersData} />;
      case "ButToSchools":
        return <ButToSchools mapRef={mapRef} mapElements={mapElements} {...commonProps} onRadiusValuesChange={handleRadiusValuesChange} />; // ส่งฟังก์ชันที่รับค่าไปยัง BusToSchoolSidebar
      case "HistoryRoute":
        return <HistoryRoute mapRef={mapRef} {...commonProps} />;
      case "Student":
        return <Student {...commonProps} />;
      case "School":
          return <School mapRef={mapRef} {...commonProps} />;
      case "Route":
        return <Route mapRef={mapRef} {...commonProps} {...props} />;
      case "DetailRoute":
        return <DetailRoute {...commonProps} />;
      default:
        return null;
    }
  };



  // Auth-----------------------------------------------
  // chk
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        router.push("/"); // Redirect if not logged in
      }
    });
    return () => unsubscribe();
  }, [auth, router]);
  // Out
  const handleSignOut = async () => {
    console.log("get OUT");
    
    // const confirmSignOut = window.confirm("Are you sure you want to sign out?");

    // if (!confirmSignOut) {
    //   return; // หยุดการทำงานถ้าผู้ใช้ยกเลิก
    // }
    
    try {
      setShowLogoutModal(false)
      await signOut(auth);
      router.push("/"); // Redirect to the home page after sign out
    } catch (error) {
      console.error("Error signing out:", error.message);
      alert(`Error signing out: ${error.message}`);
    }
  };

  const handleDeleteCancel = () => {
    setShowLogoutModal(false); // ปิด modal เมื่อผู้ใช้ยกเลิก
  };

  const logOut = () => {
    setShowLogoutModal(true); // เปิด modal สำหรับยืนยันการลบ
  };


  // Reset
  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    if (!emailForPasswordReset) {
      alert("Please enter your email address.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, emailForPasswordReset);
      alert("Password reset email sent! Please check your inbox.");
      setIsResetModalOpen(false); // Close the modal after sending the reset email
    } catch (error) {
      alert("Error sending password reset email: " + error.message);
    }
  };


  return (
    <>
      <button
        onClick={toggleSidebar}
        aria-controls="logo-sidebar"
        type="button"
        className="fixed top-4 left-4 z-50 inline-flex items-center p-3 text-sm text-gray-500 bg-white rounded-2xl"
      >
        {/* <span className="sr-only">Open sidebar</span> */}
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>


      {/* Sidebar */}
      <div
        id="hs-sidebar-footer"
        className={`hs-overlay fixed transition-transform ${isOpen ? "sm:translate-x-0" : "-translate-x-full"
          } h-screen z-[60] bg-white`}
      >
        <div className="relative flex flex-col h-screen max-h-full w-64">
          <header className="p-4 flex justify-between items-center gap-x-2 ">
            <a
              className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80 dark:text-white"
              aria-label="Brand"
            >
              SchoolGo
            </a>
            <div className="">
              <button
                type="button"
                className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-[7px] focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                onClick={() => {
                  toggleSidebar();
                }}
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
          </header>

          <nav className="h-full overflow-y-auto">
            <div className="hs-accordion-group pb-0 px-2 w-full flex flex-col flex-wrap">
              <ul className="space-y-1">
                <li>
                  <a
                    onClick={() => {
                      toggleComponent('HomeToSchools');
                      toggleNav();
                      setIsOpen(false); // ปิด Sidebar
                    }}
                    className={`cursor-pointer flex items-center p-2 rounded-lg
                      text-gray-900 dark:text-white
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      group
                      ${
                        activeLink === "HomeToSchools"
                          ? "bg-gray-100 dark:bg-gray-700"
                          : ""
                      }
                    `}
                  >
                    <svg
                      className="size-5"
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
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>

                    <span className="flex-1 ms-3 whitespace-nowrap">Home To Schools</span>
                    {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        Pro
                        </span> */}
                  </a>
                </li>

                <li>
                  <a
                    onClick={() => {
                      toggleComponent('ButToSchools');
                      toggleNav();
                      setIsOpen(false); // ปิด Sidebar
                    }}
                    className={`cursor-pointer flex items-center p-2 rounded-lg
                      text-gray-900 dark:text-white
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      group
                      ${
                        activeLink === "ButToSchools"
                          ? "bg-gray-100 dark:bg-gray-700"
                          : ""
                      }
                    `}
                  >
                    <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 2048 2048"><path fill="currentColor" d="M1920 640v256h-128v960q0 34-3 68t-16 62t-38 45t-71 17q-25 0-53 1t-57-1t-55-8t-47-21t-32-38t-12-61H512q0 27-10 50t-27 40t-41 28t-50 10q-69 0-118-1t-79-17t-45-56t-14-118V896H0V640h128V320q0-40 15-75t41-61t61-41t75-15h1280q40 0 75 15t61 41t41 61t15 75v320h128zm-256 640H256v256h128v-40q0-22 4-42t18-33t42-13q28 0 41 13t19 32t5 42t-1 41h896v-40q0-22 4-42t18-33t42-13q28 0 41 13t19 32t5 42t-1 41h128v-256zm-768-128V640H256v512h640zm768-512h-640v512h640V640zM320 256q-26 0-45 19t-19 45v192h1408V320q0-26-19-45t-45-19H320zm1344 1536v-128H256v128h1408z"/></svg>


                    <span className="flex-1 ms-3 whitespace-nowrap">Bus To Schools</span>
                    {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        Pro
                        </span> */}
                  </a>
                </li>

                <li>
                  <a
                  onClick={() => {setIsImportRouteModalOpen(true); setIsOpen(!isOpen);}}
                    className={`cursor-pointer flex items-center p-2 rounded-lg
                      text-gray-900 dark:text-white
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      group
                      ${
                        activeLink === "school"
                          ? "bg-gray-100 dark:bg-gray-700"
                          : ""
                      }
                    `}
                  >
                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="size-4">
                      <path fill="currentColor" d="M416 320h-96c-17.6 0-32-14.4-32-32s14.4-32 32-32h96s96-107 96-160s-43-96-96-96s-96 43-96 96c0 25.5 22.2 63.4 45.3 96H320c-52.9 0-96 43.1-96 96s43.1 96 96 96h96c17.6 0 32 14.4 32 32s-14.4 32-32 32H185.5c-16 24.8-33.8 47.7-47.3 64H416c52.9 0 96-43.1 96-96s-43.1-96-96-96zm0-256c17.7 0 32 14.3 32 32s-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32zM96 256c-53 0-96 43-96 96s96 160 96 160s96-107 96-160s-43-96-96-96zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
                    </svg> */}
                    
                    <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><path id="gisRouteStart0" fill="currentColor" d="M21 32C9.459 32 0 41.43 0 52.94c0 4.46 1.424 8.605 3.835 12.012l14.603 25.244c2.045 2.672 3.405 2.165 5.106-.14l16.106-27.41c.325-.59.58-1.216.803-1.856A20.668 20.668 0 0 0 42 52.94C42 41.43 32.544 32 21 32Zm0 9.812c6.216 0 11.16 4.931 11.16 11.129c0 6.198-4.944 11.127-11.16 11.127c-6.215 0-11.16-4.93-11.16-11.127c0-6.198 4.945-11.129 11.16-11.129z"/><path id="gisRouteStart1" fill="currentColor" stroke="none" d="M88.209 37.412c-2.247.05-4.5.145-6.757.312l.348 5.532a126.32 126.32 0 0 1 6.513-.303zm-11.975.82c-3.47.431-6.97 1.045-10.43 2.032l1.303 5.361c3.144-.896 6.402-1.475 9.711-1.886zM60.623 42.12a24.52 24.52 0 0 0-3.004 1.583l-.004.005l-.006.002c-1.375.866-2.824 1.965-4.007 3.562c-.857 1.157-1.558 2.62-1.722 4.35l5.095.565c.038-.406.246-.942.62-1.446h.002v-.002c.603-.816 1.507-1.557 2.582-2.235l.004-.002a19.64 19.64 0 0 1 2.388-1.256zM58 54.655l-3.303 4.235c.783.716 1.604 1.266 2.397 1.726l.01.005l.01.006c2.632 1.497 5.346 2.342 7.862 3.144l1.446-5.318c-2.515-.802-4.886-1.576-6.918-2.73c-.582-.338-1.092-.691-1.504-1.068Zm13.335 5.294l-1.412 5.327l.668.208l.82.262c2.714.883 5.314 1.826 7.638 3.131l2.358-4.92c-2.81-1.579-5.727-2.611-8.538-3.525l-.008-.002l-.842-.269zm14.867 7.7l-3.623 3.92c.856.927 1.497 2.042 1.809 3.194l.002.006l.002.009c.372 1.345.373 2.927.082 4.525l5.024 1.072c.41-2.256.476-4.733-.198-7.178c-.587-2.162-1.707-4.04-3.098-5.548zM82.72 82.643a11.84 11.84 0 0 1-1.826 1.572h-.002c-1.8 1.266-3.888 2.22-6.106 3.04l1.654 5.244c2.426-.897 4.917-1.997 7.245-3.635l.006-.005l.003-.002a16.95 16.95 0 0 0 2.639-2.287zm-12.64 6.089c-3.213.864-6.497 1.522-9.821 2.08l.784 5.479c3.421-.575 6.856-1.262 10.27-2.18zm-14.822 2.836c-3.346.457-6.71.83-10.084 1.148l.442 5.522c3.426-.322 6.858-.701 10.285-1.17zm-15.155 1.583c-3.381.268-6.77.486-10.162.67l.256 5.536c3.425-.185 6.853-.406 10.28-.678zm-15.259.92c-2.033.095-4.071.173-6.114.245l.168 5.541a560.1 560.1 0 0 0 6.166-.246z" color="currentColor"  display="inline" opacity="1" visibility="visible"/></svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">Import Route</span>
                  </a>
                </li>

                <li>
                  <a
                    onClick={() => {
                      toggleComponent('HistoryRoute');
                      toggleNav();
                      setIsOpen(false); // ปิด Sidebar
                    }}
                    className={`cursor-pointer flex items-center p-2 rounded-lg
                      text-gray-900 dark:text-white
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      group
                      ${
                        activeLink === "HistoryRoute"
                          ? "bg-gray-100 dark:bg-gray-700"
                          : ""
                      }
                    `}
                  >
                    <svg
                      className="size-5"
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
                      <path d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934a1.12 1.12 0 0 1-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689A1.125 1.125 0 0 0 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934a1.12 1.12 0 0 1 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">History Routes</span>
                    {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        Pro
                        </span> */}
                  </a>
                </li>

                <li>
                  <a
                    onClick={() => {
                      toggleComponent('Student');
                      toggleNav();
                      setIsOpen(false); // ปิด Sidebar
                    }}
                    className={`cursor-pointer flex items-center p-2 rounded-lg
                      text-gray-900 dark:text-white
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      group
                      ${
                        activeLink === "Student"
                          ? "bg-gray-100 dark:bg-gray-700"
                          : ""
                      }
                    `}
                  >

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="200"
                      height="200"
                      viewBox="0 0 256 256"
                      className="size-5"
                    >
                      <path
                        fill="currentColor"
                        d="m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.89 47.89 0 0 1 176 120Z"
                      />
                    </svg>


                    <span className="flex-1 ms-3 whitespace-nowrap">Students</span>
                    {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        Pro
                        </span> */}
                  </a>
                </li>

                <li>
                  <a
                    onClick={() => {
                      toggleComponent('School');
                      toggleNav();
                      setIsOpen(false); // ปิด Sidebar
                    }}
                    className={`cursor-pointer flex items-center p-2 rounded-lg
                      text-gray-900 dark:text-white
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      group
                      ${
                        activeLink === "school"
                          ? "bg-gray-100 dark:bg-gray-700"
                          : ""
                      }
                    `}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" width="200" height="200" viewBox="0 0 15 15"><path fill="none" stroke="currentColor" d="m7.5 4.5l4 2v8h-8v-8l4-2Zm0 0V0M0 14.5h15m-13.5 0v-6h2m10 6v-6h-2m-5 6v-3h2v3m-1-14h3v2h-3m0 7a1 1 0 1 1 0-2a1 1 0 0 1 0 2Z"/></svg>

                    <span className="flex-1 ms-3 whitespace-nowrap">School</span>
                  </a>
                </li>


              </ul>
            </div>
          </nav>

          <footer className="mt-auto p-2 border-t border-gray-200 dark:border-neutral-700">
            <div className="relative w-full inline-flex">
              <button
                onClick={toggleDropdown}
                id="hs-sidebar-footer-example-with-dropdown"
                type="button"
                className="justify-between w-full inline-flex shrink-0 items-center gap-x-2 p-2 text-start text-sm text-gray-800 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              >
                {/* ไอคอนด้านซ้าย */}
                <svg
                  className="flex-shrink-0 size-7"
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
                  <path d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>

                {/* ข้อความ */}
                <span
                  className="truncate flex-shrink-0"
                  style={{ minWidth: "150px", maxWidth: "150px", overflow: "hidden" }}
                >
                  {user && user.email ? user.email : " "}
                </span>

                {/* ไอคอนด้านขวา */}
                <svg
                  className="shrink-0 size-4 ms-auto"
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
                  <path d="m7 15 5 5 5-5" />
                  <path d="m7 9 5-5 5 5" />
                </svg>
              </button>

            </div>
          </footer>

          {isDropdownOpen && (
            <div className="absolute bottom-[54px] z-50 w-full bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600">
              <div className="p-1">
                <a onClick={() => {setIsResetModalOpen(true); setIsOpen(!isOpen);}} className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                  Reser Password
                </a>
                <a onClick={logOut} className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                  Sign out
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Additional Sidebar
      {activeComponent === 'HomeToSchools' && (
        <HomeToSchools isOpen={true} openComponent={(componentName) => setActiveComponent(componentName)} />
      )}
      {activeComponent === 'ButToSchools' && (
        <ButToSchools isOpen={true} onClose={() => setActiveComponent(null)} />
      )}
      {activeComponent === 'HistoryRoute' && (
        <HistoryRoute isOpen={true} onClose={() => setActiveComponent(null)} />
      )}
      {activeComponent === 'Student' && (
        <Student isOpen={true} onClose={() => setActiveComponent(null)} />
      )}

      {activeComponent === 'Route' && (
        <Route isOpen={true} openComponent={(componentName) => setActiveComponent(componentName)} />
      )} */}

      {/* Render the active component */}
      {renderComponent()}
      
      {/* Show Map */}
      {/* ml-0 sm:ml-0 sm:mr-0 */}
      <div className="">
          <div className="w-full h-full">
            <Map ref={mapRef} onMapElementsUpdate={handleMapElementsUpdate} radiusValues={radiusValues} onMarkersUpdate={handleMarkersUpdate}/>
          </div>
      </div>

      {/* ใช้งาน Password Reset Modal */}
      <PasswordResetModal
        isOpen={isResetModalOpen}
        email={emailForPasswordReset}
        setEmail={setEmailForPasswordReset}
        handlePasswordResetRequest={handlePasswordResetRequest}
        closeModal={() => setIsResetModalOpen(false)}
      />

      <ImportRouteModal
      mapRef={mapRef} {...commonProps}
        isOpen={isImportRouteModalOpen}
        closeModal={() => setIsImportRouteModalOpen(false)}
      />


      {showLogoutModal && (
        <ConfirmationModal
          onConfirm={() => handleSignOut()}
          onCancel={handleDeleteCancel}
          type='logout'
          msg='Are you sure you want to logout?'
        />
      )}

    </>
  );
}
