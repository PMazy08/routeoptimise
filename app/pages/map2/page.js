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
import Route from "../../components/Route";

// Modals
import PasswordResetModal from "../../modals/PasswordResetModal"; // นำเข้า Component ใหม่



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


  // const toggleComponent = (componentName) => {
  //   setActiveComponent((prev) =>
  //     prev === componentName ? null : componentName
  //   );
  //   setActiveLink(componentName); // ถ้าค่าปัจจุบันตรงกับคอมโพเนนต์ที่เลือก ให้ตั้งค่าเป็น null
  // };


  // const renderComponent = () => {
  //   const commonProps = {
  //     isOpen: true,
  //     openComponent: (componentName) => setActiveComponent(componentName),
  //     onClose: () => setActiveComponent(null),
  //   };
  
  //   switch (activeComponent) {
  //     case "HomeToSchools":
  //       return <HomeToSchools mapRef={mapRef} {...commonProps} />;
  //     case "ButToSchools":
  //       return <ButToSchools {...commonProps} />;
  //     case "HistoryRoute":
  //       return <HistoryRoute {...commonProps} />;
  //     case "Student":
  //       return <Student {...commonProps} />;
  //     case "Route":
  //       return <Route mapRef={mapRef} {...commonProps}/>;
  //     default:
  //       return null;
  //   }
  // };


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
  
  const renderComponent = () => {
    if (!activeComponent) return null;
  
    const { name, props } = activeComponent;
  
    switch (name) {
      case "HomeToSchools":
        return <HomeToSchools mapRef={mapRef} {...commonProps} />;
      case "ButToSchools":
        return <ButToSchools {...commonProps} />;
      case "HistoryRoute":
        return <HistoryRoute {...commonProps} />;
      case "Student":
        return <Student {...commonProps} />;
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
    const confirmSignOut = window.confirm("Are you sure you want to sign out?");
    if (!confirmSignOut) {
      return; // หยุดการทำงานถ้าผู้ใช้ยกเลิก
    }
  
    try {
      await signOut(auth);
      router.push("/"); // Redirect to the home page after sign out
    } catch (error) {
      console.error("Error signing out:", error.message);
      alert(`Error signing out: ${error.message}`);
    }
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
              RouteOptimize
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
                      className="size-4"
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
                    <svg
                      className="size-4"
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
                      <path d="M4 16c0 .88.39 1.67 1 2.22v1.28c0 .83.67 1.5 1.5 1.5S8 20.33 8 19.5V19h8v.5c0 .82.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5v-1.28c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
                      {/* <polyline points="9 22 9 12 15 12 15 22" /> */}
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">Bus To Schools</span>
                    {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        Pro
                        </span> */}
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
                      className="size-4"
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
                      className="size-4"
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
                      <path d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0a1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789a6.721 6.721 0 0 1-3.168-.789a3.376 3.376 0 0 1 6.338 0Z" />
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">Students</span>
                    {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        Pro
                        </span> */}
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
                  className="flex-shrink-0 size-5"
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
                  className="shrink-0 size-3.5 ms-auto"
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
                <a onClick={handleSignOut} className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
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
            <Map ref={mapRef} />
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

    </>
  );
}
