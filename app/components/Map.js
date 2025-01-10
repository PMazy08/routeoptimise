import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

import { drawRoute, fetchMarkers, resetRoute, fetchRoutes, getRandomHexColor } from "../services/mapboxService";
import { fetchMapCenter } from "../services/schoolService";
import { subscribeAuthState } from "../services/authService";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Map = () => {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token

  const [selectedStyle, setSelectedStyle] = useState("mapbox://styles/mapbox/light-v10");
  const [markers, setMarkers] = useState([]); // State สำหรับเก็บข้อมูลหมุดจาก API
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([0,0]);
  const [isLoading, setIsLoading] = useState(false); // สถานะโหลด

  const [depotLat, setDepotLat] = useState();
  const [depotLng, setDepotLng] = useState();
  const [numVehicles, setNumVehicles] = useState(10);
  const [maxStopsPerVehicle, setMaxStopsPerVehicle] = useState(20);
  const [maxTravelTime, setMaxTravelTime] = useState(150);

  const [routes, setRoutes] = useState([]); // เก็บข้อมูล routes
  const [routeColors, setRouteColors] = useState([]);



  const styles = [
    { name: "Streets", value: "mapbox://styles/mapbox/streets-v11" },
    { name: "Dark", value: "mapbox://styles/mapbox/dark-v10" },
    { name: "Satellite Streets", value: "mapbox://styles/mapbox/satellite-streets-v11" },
    { name: "Light", value: "mapbox://styles/mapbox/light-v10" }
  ];

  useEffect(() => {
    const unsubscribe = subscribeAuthState(setUser, setIdToken); // เรียกใช้ service
    return () => unsubscribe(); // เมื่อ component ถูกลบออก, ยกเลิกการ subscribe
  }, []); // ใช้ [] เพื่อให้เพียงแค่ครั้งแรกที่ mount

  useEffect(() => {
    const fetchAndSetMarkers = async () => {
      try {
        if (idToken) {
          const data = await fetchMarkers(idToken); // เรียกใช้ service ดึงข้อมูล
          setMarkers(data); // เก็บข้อมูลที่ได้จาก API ใน state    

          const mark_center = await fetchMapCenter(idToken);
          setMapCenter(mark_center);
          setDepotLat(mark_center[1]);
          setDepotLng(mark_center[0]); 

        }
      } catch (error) {
        console.error("Error fetching marker data: ", error);
      }
    };
    fetchAndSetMarkers();
  }, [idToken]);


  useEffect(() => {

    // ตรวจสอบว่า mapCenter ถูกกำหนดค่าแล้ว
    if (!mapCenter || mapCenter[0] === 0 && mapCenter[1] === 0) {
      return; // หาก mapCenter ยังไม่มีค่า ให้หยุดการทำงาน
    }
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: selectedStyle,
      center: mapCenter,
      zoom: 12,
      attributionControl: false,
        dragPan: true, // ให้เลื่อนแผนที่ได้
        scrollZoom: true, // ปิดการซูมด้วยการเลื่อนเมาส์
        boxZoom: false, // ปิดการซูมด้วยการเลือกกล่อง
        dragRotate: false, // ปิดการหมุนแผนที่
      
    });

    map.flyTo({
      center: mapCenter, // ตำแหน่งที่ต้องการเลื่อน
      zoom: 13, // ระดับซูมที่ต้องการ (ปรับตามความเหมาะสม)
      speed: 1.5, // ความเร็วในการซูม (ค่าเริ่มต้นคือ 1.2)
      curve: 0.3, // ระดับความนุ่มนวลของการเคลื่อนที่
    });
    
    // ตรวจสอบว่า mapCenter ไม่เป็น (0, 0) ก่อนที่จะเพิ่ม marker // ปักหมุดที่จุดศูนย์กลาง
    if (mapCenter[0] !== 0 && mapCenter[1] !== 0) {
      const centerMarker = new mapboxgl.Marker({ color: 'black' })
        .setLngLat(mapCenter)
        .addTo(map);
    }
    mapRef.current = map;

    return () => map.remove(); // Cleanup เมื่อ component ถูกลบ
  }, [mapCenter, selectedStyle]);

  useEffect(() => {
    if (mapRef.current && markers.length > 0) {
      // ลบหมุดเดิมก่อน เพื่อไม่ให้มีหมุดซ้ำ
      const existingMarkers = document.querySelectorAll('.custom-marker');
      existingMarkers.forEach((marker) => marker.remove());
      let currentPopup = null; 
  
      markers.forEach(({ latitude, longitude, first_name, last_name, age, gender, address, status }) => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = '7px'; // ขนาดจุด
        el.style.height = '7px';
        el.style.backgroundColor = '#07A1E8'; // สีของจุด
        // el.style.backgroundColor = status === 0 ? '#FFECA1' : '#58d68d'; // เปลี่ยนสีเป็นเทาถ้า status เป็น 0
        el.style.borderRadius = '50%'; // ทำให้เป็นวงกลม
        el.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)'; // เพิ่มเงาเล็กน้อย
  
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([parseFloat(longitude), parseFloat(latitude)]) // แปลง latitude และ longitude เป็นตัวเลข
          .setPopup(
            new mapboxgl.Popup({ closeButton: false }).setHTML(
              `<div">
                <h3>${first_name} ${last_name}</h3>
                <p><strong>Age:</strong> ${age}</p>
                <p><strong>Gender:</strong> ${gender}</p>
                <p><strong>Address:</strong> ${address}</p>
              </div>`
            )
          )
          .addTo(mapRef.current);
      });
    }
  }, [mapCenter, selectedStyle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const locations = markers.map((marker) => [parseFloat(marker.latitude), parseFloat(marker.longitude)]);
    const data = {
      depot: [parseFloat(depotLat), parseFloat(depotLng)],
      num_vehicles: parseInt(numVehicles),
      max_stops_per_vehicle: parseInt(maxStopsPerVehicle),
      max_travel_time: parseInt(maxTravelTime) * 60,
      locations: locations,
    };
  
    handleClick(data);
  };
  
  const handleClick = async (data) => { 
    setRouteColors([]); // รีเซ็ตสีทั้งหมด
    setRoutes([]); // รีเซ็ตเส้นทางทั้งหมด
    resetRoute(mapRef.current); // ลบเส้นทางบนแผนที่ (ถ้ามีฟังก์ชัน resetRoute)
    setIsLoading(true); // เริ่มโหลด
    try {
      const result = await fetchRoutes(idToken, mapRef.current, data); // ส่ง data ไปยัง fetchRoutes
      console.log(result);
      
      const colors = result.map(() => getRandomHexColor());
      setRouteColors(colors);
      setRoutes(result);
  
      // ใช้ result แทน routes ในการวาด
      result.forEach((route, index) => {
        const routeKey = `route ${index + 1}`;
        const coordinates = route[routeKey];
        if (coordinates) {
          drawRoute(mapRef.current, coordinates, routeKey, colors[index], true); // ใช้ colors ที่สร้างมา
        }
      });
  
    } catch (error) {
      console.error("Error drawing routes:", error);
    } finally {
      setIsLoading(false); // สิ้นสุดโหลด
    }
  };


  const handleReset = () => {
    setRouteColors([]); // รีเซ็ตสีทั้งหมด
    setRoutes([]); // รีเซ็ตเส้นทางทั้งหมด
    resetRoute(mapRef.current); // ลบเส้นทางบนแผนที่ (ถ้ามีฟังก์ชัน resetRoute)
  };



// time count
const [elapsedTime, setElapsedTime] = useState(0); // เก็บเวลาที่ผ่านไป

useEffect(() => {
  let timer;
  if (isLoading) {
    setElapsedTime(0); // รีเซ็ตเวลาเมื่อเริ่มโหลด
    timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1); // เพิ่มเวลาทีละ 1 วินาที
    }, 1000);
  } else {
    clearInterval(timer); // หยุดการนับเมื่อโหลดเสร็จ
  }
  return () => clearInterval(timer); // ล้าง timer เมื่อ component ถูก unmount
}, [isLoading]);
  
  
// -------------------------------------------------------------------------
  return (
      <div className="h-screen w-full">
          {/* Map Container */}
          <div
              ref={mapContainerRef}
              style={{ height: "100%", width: "100%" }} // ใช้ height และ width 100% เพื่อให้เต็มพื้นที่
          />
      </div>


    // <div>
    //   <select onChange={(e) => setSelectedStyle(e.target.value)} value={selectedStyle}>
    //     {styles.map((style) => (
    //       <option key={style.value} value={style.value}>
    //         {style.name}
    //       </option>
    //     ))}
    //   </select>

    //   <div
    //     ref={mapContainerRef}
    //     style={{ height: "600px", width: "100%" }}
    //   />


    // <button
    //   onClick={() => handleReset()}
    //   style={{
    //     padding: "5px 10px",
    //     backgroundColor: "red",
    //     color: "white",
    //     border: "none",
    //     borderRadius: "4px",
    //     fontSize: "12px",
    //     cursor: "pointer",
    //     margin: '10px'
    //   }}
    // >
    //   Reset Route
    // </button>

    // <button
    //   style={{
    //     padding: "5px 10px",
    //     backgroundColor: 'skyblue',
    //     color: "white",
    //     border: "none",
    //     borderRadius: "4px",
    //     fontSize: "12px",
    //     cursor: "pointer",
    //     margin: '10px'
    //   }}
    // >
    //   Save
    // </button>

    // <hr></hr> 

    //    <div style={{marginBottom :"10px" }}>
    //     <h3 style={{fontWeight: 'bolder', marginLeft: '10px'}}>Routes</h3>
    //     {routes.length > 0 ? (
    //       <>
         
    //         <div style={{ display: "flex", flexWrap: "wrap", gap: "10px",}}>
             
    //           <button
    //             onClick={() => {
    //               resetRoute(mapRef.current),
    //               routes.forEach((route, index) => {
    //                 const routeKey = `route ${index + 1}`;
    //                 const coordinates = route[routeKey];
    //                 if (coordinates) {
    //                   drawRoute(mapRef.current, coordinates, routeKey, routeColors[index], true);
    //                 }
    //               });
    //             }}

    //             style={{
    //               padding: "5px",
    //               backgroundColor: "green",
    //               color: "white",
    //               border: "none",
    //               borderRadius: "4px",
    //               fontSize: "12px",
    //               cursor: "pointer",
    //               margin: '10px 5px'
    //             }}
                
    //           >
    //             All Routes
    //           </button>

       
    //           {routes.map((route, index) => {
    //             const routeKey = `route ${index + 1}`;
    //             return (
    //               <button
    //                 key={routeKey}
    //                 onClick={() => {
    //                   resetRoute(mapRef.current);
    //                   const coordinates = route[routeKey];       
    //                   if (coordinates) {
    //                     drawRoute(mapRef.current, coordinates, routeKey, routeColors[index], true);
    //                   }
    //                 }}

    //                 style={{
    //                   padding: "5px 10px",
    //                   backgroundColor: routeColors[index],
    //                   color: "white",
    //                   border: "none",
    //                   borderRadius: "4px",
    //                   fontSize: "12px",
    //                   cursor: "pointer",
    //                   margin: '10px 5px'
    //                 }}
    //               >
    //                 {routeKey}
    //               </button>
    //             );
    //           })}
    //         </div>
    //       </>
    //     ) : (
    //       isLoading ? (
    //         <p style={{ color: "blue", fontWeight: "bold", margin:'5px 10px' }}>Finding Routes... {elapsedTime}(s)</p>
    //       ) : null
    //     )}

    //     <hr></hr>
    //   </div>



    
    //   <form
    //     onSubmit={handleSubmit}
    //     style={{
    //       display: "flex",
    //       alignItems: "center",
    //       gap: "10px", // ระยะห่างระหว่างแต่ละช่อง
    //       padding: "10px",
    //       backgroundColor: "#f9f9f9",
    //       borderRadius: "8px",
    //       boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    //       margin: '10px'
    //     }}
    //   >

    //     <p style={{fontWeight: 'bold', width: '100px'}}>Home To Schools</p>

    //     <label style={{ display: "flex", flexDirection: "column", fontSize: "12px" }}>
    //       Bus:
    //       <input
    //         type="number"
    //         value={numVehicles}
    //         onChange={(e) => setNumVehicles(e.target.value)}
    //         min="1"
    //         required
    //         style={{
    //           width: "80px",
    //           padding: "5px",
    //           marginTop: "3px",
    //           border: "1px solid #ccc",
    //           borderRadius: "4px",
    //           fontSize: "12px",
    //         }}
    //       />
    //     </label>

    //     <label style={{ display: "flex", flexDirection: "column", fontSize: "12px" }}>
    //       Max Capacity:
    //       <input
    //         type="number"
    //         value={maxStopsPerVehicle}
    //         onChange={(e) => setMaxStopsPerVehicle(e.target.value)}
    //         min="1"
    //         required
    //         style={{
    //           width: "80px",
    //           padding: "5px",
    //           marginTop: "3px",
    //           border: "1px solid #ccc",
    //           borderRadius: "4px",
    //           fontSize: "12px",
    //         }}
    //       />
    //     </label>

    //     <label style={{ display: "flex", flexDirection: "column", fontSize: "12px" }}>
    //       Max Time (min):
    //       <input
    //         type="number"
    //         value={maxTravelTime}
    //         onChange={(e) => setMaxTravelTime(e.target.value)}
    //         min="1"
    //         required
    //         style={{
    //           width: "80px",
    //           padding: "5px",
    //           marginTop: "3px",
    //           border: "1px solid #ccc",
    //           borderRadius: "4px",
    //           fontSize: "12px",
    //         }}
    //       />
    //     </label>

    //     <button
    //       type="submit"
    //       style={{
    //         padding: "5px 10px",
    //         backgroundColor: "#4CAF50",
    //         color: "white",
    //         border: "none",
    //         borderRadius: "4px",
    //         fontSize: "12px",
    //         cursor: "pointer",
    //       }}
    //       disabled={isLoading}
    //     >
    //       {isLoading ? "Calculating..." : "Optimize Route"}
    //     </button>
    //   </form>



    //   <form
    //     onSubmit={handleSubmit}
    //     style={{
    //       display: "flex",
    //       alignItems: "center",
    //       gap: "10px", // ระยะห่างระหว่างแต่ละช่อง
    //       padding: "10px",
    //       backgroundColor: "#f9f9f9",
    //       borderRadius: "8px",
    //       boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    //       margin: '10px'
    //     }}
    //   >

    //     <p style={{fontWeight: 'bold', width: '100px'}}>But To Schools</p>

    //     <label style={{ display: "flex", flexDirection: "column", fontSize: "12px" }}>
    //       Vehicles:
    //       <input
    //         type="number"
    //         value={numVehicles}
    //         onChange={(e) => setNumVehicles(e.target.value)}
    //         min="1"
    //         required
    //         style={{
    //           width: "80px",
    //           padding: "5px",
    //           marginTop: "3px",
    //           border: "1px solid #ccc",
    //           borderRadius: "4px",
    //           fontSize: "12px",
    //         }}
    //       />
    //     </label>

    //     <label style={{ display: "flex", flexDirection: "column", fontSize: "12px" }}>
    //       Max Stops:
    //       <input
    //         type="number"
    //         value={maxStopsPerVehicle}
    //         onChange={(e) => setMaxStopsPerVehicle(e.target.value)}
    //         min="1"
    //         required
    //         style={{
    //           width: "80px",
    //           padding: "5px",
    //           marginTop: "3px",
    //           border: "1px solid #ccc",
    //           borderRadius: "4px",
    //           fontSize: "12px",
    //         }}
    //       />
    //     </label>

    //     <label style={{ display: "flex", flexDirection: "column", fontSize: "12px" }}>
    //       Max Time (min):
    //       <input
    //         type="number"
    //         value={maxTravelTime}
    //         onChange={(e) => setMaxTravelTime(e.target.value)}
    //         min="1"
    //         required
    //         style={{
    //           width: "80px",
    //           padding: "5px",
    //           marginTop: "3px",
    //           border: "1px solid #ccc",
    //           borderRadius: "4px",
    //           fontSize: "12px",
    //         }}
    //       />
    //     </label>

    //     <button
    //       type="submit"
    //       style={{
    //         padding: "5px 10px",
    //         backgroundColor: "#4CAF50",
    //         color: "white",
    //         border: "none",
    //         borderRadius: "4px",
    //         fontSize: "12px",
    //         cursor: "pointer",
    //       }}
    //       disabled={isLoading}
    //     >
    //       {isLoading ? "Calculating..." : "Optimize Route"}
    //     </button>
    //   </form>



    // </div>
  );
};

export default Map;