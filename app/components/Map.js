// import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
// import mapboxgl from "mapbox-gl";
// import 'mapbox-gl/dist/mapbox-gl.css';
// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";


// import { drawRoute, fetchMarkers, resetRoute } from "../services/mapboxService";
// import { fetchMapCenter } from "../services/schoolService";
// import { subscribeAuthState } from "../services/authService";
// import { fetchRoutes, fetchRouteByTripId, getRandomHexColor } from "../services/routeService";

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// const Map = forwardRef((props, ref) => {

//   const { radiusValues } = props; // รับค่าจาก Sidebar

//   console.log(">> Radius: " + radiusValues);


//   const [user, setUser] = useState(null);
//   const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token

//   const [selectedStyle, setSelectedStyle] = useState("mapbox://styles/mapbox/light-v10");
//   const [markers, setMarkers] = useState([]); // State สำหรับเก็บข้อมูลหมุดจาก API
//   const mapContainerRef = useRef(null);
//   const mapRef = useRef(null);
//   const [mapCenter, setMapCenter] = useState([0, 0]);
//   const [isLoading, setIsLoading] = useState(false); // สถานะโหลด

//   const [depotLat, setDepotLat] = useState();
//   const [depotLng, setDepotLng] = useState();
//   // const [numVehicles, setNumVehicles] = useState(10);
//   // const [maxStopsPerVehicle, setMaxStopsPerVehicle] = useState(20);
//   // const [maxTravelTime, setMaxTravelTime] = useState(150);

//   // const [disdu, setdisdu] = useState([]);

//   const [radiusN, setRadiusN] = useState(1); // สำหรับเก็บค่า radius ของวงกลม


//   const refetchData = async () => {
//     console.log("map data...");

//     try {
//         if (idToken) {
//             // 🔹 Fetch markers ใหม่
//             const data = await fetchMarkers(idToken);
//             setMarkers(data);

//             // 🔹 Fetch center ของโรงเรียนใหม่
//             const mark_center = await fetchMapCenter(idToken);
//             setMapCenter(mark_center);
//             setDepotLat(mark_center[1]);
//             setDepotLng(mark_center[0]);

//             // 🔹 รีเซ็ตแผนที่
//             if (mapRef.current) {
//                 const map = initializeMap(mark_center);
//                 mapRef.current = map;

//                 // โหลดหมุดใหม่
//                 if (data.length > 0) {
//                     addMarkersToMap(map, data);
//                 }
//             }
//             console.log("Map data refetched successfully.");
//         }
//     } catch (error) {
//         console.error("Error refetching data:", error);
//     } 
// };







//   // com อื่น ใช้ func ได้
//   useImperativeHandle(ref, () => ({
//     handleSubmit,
//     handleReset,
//     handleDrawRoute,
//     handleAddCircleClick,
//     clearAllElements,
//     removeElement,
//     updateCircleRadius,
//     goMarkerById,
//     refetchData,
//   }));


//   // const styles = [
//   //   { name: "Streets", value: "mapbox://styles/mapbox/streets-v11" },
//   //   { name: "Dark", value: "mapbox://styles/mapbox/dark-v10" },
//   //   { name: "Satellite Streets", value: "mapbox://styles/mapbox/satellite-streets-v11" },
//   //   { name: "Light", value: "mapbox://styles/mapbox/light-v10" }
//   // ];


//   useEffect(() => {
//     const unsubscribe = subscribeAuthState(setUser, setIdToken); // เรียกใช้ service
//     return () => unsubscribe(); // เมื่อ component ถูกลบออก, ยกเลิกการ subscribe
//   }, []); // ใช้ [] เพื่อให้เพียงแค่ครั้งแรกที่ mount



//   useEffect(() => {
//     const fetchAndSetMarkers = async () => {
//       try {
//         if (idToken) {
//           const data = await fetchMarkers(idToken); // เรียกใช้ service ดึงข้อมูล
//           setMarkers(data); // เก็บข้อมูลที่ได้จาก API ใน state    

//           const mark_center = await fetchMapCenter(idToken);
//           setMapCenter(mark_center);
//           setDepotLat(mark_center[1]);
//           setDepotLng(mark_center[0]);

//         }
//       } catch (error) {
//         console.error("Error fetching marker data: ", error);
//       }
//     };
//     fetchAndSetMarkers();
//   }, [idToken]);




//   // MAP *************************************************************************************************



//   // useEffect(() => {

//   //   // ตรวจสอบว่า mapCenter ถูกกำหนดค่าแล้ว
//   //   if (!mapCenter || mapCenter[0] === 0 && mapCenter[1] === 0) {
//   //     return; // หาก mapCenter ยังไม่มีค่า ให้หยุดการทำงาน
//   //   }
//   //   const map = new mapboxgl.Map({
//   //     container: mapContainerRef.current,
//   //     style: selectedStyle,
//   //     center: mapCenter,
//   //     zoom: 12,
//   //     attributionControl: false,
//   //     dragPan: true, // ให้เลื่อนแผนที่ได้
//   //     scrollZoom: true, // ปิดการซูมด้วยการเลื่อนเมาส์
//   //     boxZoom: false, // ปิดการซูมด้วยการเลือกกล่อง
//   //     dragRotate: false, // ปิดการหมุนแผนที่
//   //   });


//   //   map.flyTo({
//   //     center: mapCenter, // ตำแหน่งที่ต้องการเลื่อน
//   //     zoom: 13, // ระดับซูมที่ต้องการ (ปรับตามความเหมาะสม)
//   //     speed: 1.5, // ความเร็วในการซูม (ค่าเริ่มต้นคือ 1.2)
//   //     curve: 0.3, // ระดับความนุ่มนวลของการเคลื่อนที่
//   //   });

//   //   // ตรวจสอบว่า mapCenter ไม่เป็น (0, 0) ก่อนที่จะเพิ่ม marker // ปักหมุดที่จุดศูนย์กลาง
//   //   if (mapCenter[0] !== 0 && mapCenter[1] !== 0) {
//   //     const centerMarker = new mapboxgl.Marker({ color: 'black' })
//   //       .setLngLat(mapCenter)
//   //       .addTo(map);
//   //   }
//   //   mapRef.current = map;

//   //   // // เมื่อโหลดเสร็จ
//   //   // map.on("load", () => {
//   //   //   if (onMapLoaded) {
//   //   //     onMapLoaded(); // เรียกฟังก์ชันที่ส่งเข้ามาจาก Parent
//   //   //   }
//   //   // });



//   //       // เพิ่ม Geocoder   ค้นหา ----------------------------------------------------------------
//   //       const geocoder = new MapboxGeocoder({
//   //         accessToken: mapboxgl.accessToken,
//   //         mapboxgl: mapboxgl,
//   //         placeholder: "Search for places...", // ข้อความในช่องค้นหา
//   //         // proximity: { longitude: 100.523186, latitude: 13.736717 }, // โฟกัสใกล้พิกัดเริ่มต้น
//   //       });

//   //       // // เพิ่ม Geocoder Control ในแผนที่
//   //       map.addControl(geocoder);

//   //       // Event เมื่อผู้ใช้เลือกสถานที่
//   //       geocoder.on("result", (e) => {
//   //         console.log("Selected place:", e.result);
//   //         const [lng, lat] = e.result.center;
//   //         new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map); // ปักหมุด
//   //         map.flyTo({ center: [lng, lat], zoom: 14 }); // เลื่อนแผนที่ไปยังตำแหน่งที่เลือก
//   //         console.log("---> +++ "+ lng, lat);
//   //       });

//   //   return () => map.remove(); // Cleanup เมื่อ component ถูกลบ
//   // }, [mapCenter, selectedStyle]);







//   // ฟังก์ชันสำหรับการสร้างแผนที่
//   const initializeMap = (mapCenter) => {
//     const map = new mapboxgl.Map({
//       container: mapContainerRef.current,
//       style: "mapbox://styles/mapbox/light-v10",
//       center: mapCenter,
//       zoom: 12,
//       attributionControl: false,
//       dragPan: true,
//       scrollZoom: true,
//       boxZoom: false,
//       dragRotate: false,
//     });

//     // map.flyTo({
//     //   center: mapCenter,
//     //   zoom: 13,
//     //   speed: 1.5,
//     //   curve: 0.3,
//     // });

//     if (mapCenter[0] !== 0 && mapCenter[1] !== 0) {
//       new mapboxgl.Marker({ color: "black" }).setLngLat(mapCenter).addTo(map);
//     }

//     return map;
//   };

//   //---------------------------------------------------

//   // ฟังก์ชันสำหรับเพิ่ม Geocoder ลงในแผนที่
//   // const addGeocoder = (map) => {
//   //   const geocoder = new MapboxGeocoder({
//   //     accessToken: mapboxgl.accessToken,
//   //     mapboxgl: mapboxgl,
//   //     placeholder: "Search for places...",
//   //     flyTo: false, // ปิดการ zoom ไปยังตำแหน่งที่ค้นหา
//   //   });

//   //   map.addControl(geocoder);

//   //   geocoder.on("result", (e) => {
//   //     console.log("Selected place:", e.result);
//   //     const [lng, lat] = e.result.center;
//   //     new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
//   //     // map.flyTo({ center: [lng, lat], zoom: 14 });
//   //     console.log("---> +++", lng, lat);
//   //   });
//   // };



//   //---------------------------------------------------

//   // useEffect(() => {
//   //   if (!mapCenter || (mapCenter[0] === 0 && mapCenter[1] === 0)) return;

//   //   const map = initializeMap(mapCenter, selectedStyle);
//   //   mapRef.current = map;

//   //   // เพิ่ม Geocoder
//   //   addGeocoder(map);

//   //   return () => map.remove(); // Cleanup เมื่อ component ถูกลบ
//   // }, [mapCenter, selectedStyle]);





//   // หมุด (Markers) ลงในแผนที่ Mapbox
//   2
//   // useEffect(() => {
//   //   if (mapRef.current && markers.length > 0) {
//   //     // ลบหมุดเดิมก่อน เพื่อไม่ให้มีหมุดซ้ำ
//   //     const existingMarkers = document.querySelectorAll('.custom-marker');
//   //     existingMarkers.forEach((marker) => marker.remove());
//   //     let currentPopup = null; 

//   //     markers.forEach(({ latitude, longitude, first_name, last_name, age, gender, address, status }) => {
//   //       const el = document.createElement('div');
//   //       el.className = 'custom-marker';
//   //       el.style.width = '8px'; // ขนาดจุด
//   //       el.style.height = '8px';
//   //       el.style.backgroundColor = '#07A1E8'; // สีของจุด
//   //       // el.style.backgroundColor = status === 0 ? '#FFECA1' : '#58d68d'; // เปลี่ยนสีเป็นเทาถ้า status เป็น 0
//   //       el.style.borderRadius = '50%'; // ทำให้เป็นวงกลม
//   //       el.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)'; // เพิ่มเงาเล็กน้อย

//   //       const marker = new mapboxgl.Marker({ element: el })
//   //         .setLngLat([parseFloat(longitude), parseFloat(latitude)]) // แปลง latitude และ longitude เป็นตัวเลข
//   //         .setPopup(
//   //           new mapboxgl.Popup({ closeButton: false }).setHTML(
//   //             `<div">
//   //               <h3>${first_name} ${last_name}</h3>
//   //               <p><strong>Age:</strong> ${age}</p>
//   //               <p><strong>Gender:</strong> ${gender}</p>
//   //               <p><strong>Address:</strong> ${address}</p>
//   //             </div>`
//   //           )
//   //         )
//   //         .addTo(mapRef.current);
//   //     });

//   //   }

//   // }, [mapCenter, selectedStyle]);





// // old-pin addr
// //   function addMarkersToMap(map, markers) {
// //     // ลบหมุดเดิมก่อน เพื่อไม่ให้มีหมุดซ้ำ
// //     const existingMarkers = document.querySelectorAll('.custom-marker');
// //     existingMarkers.forEach((marker) => marker.remove());

// //     markers.forEach(({id, latitude, longitude, first_name, last_name, age, gender, address, status }) => {
// //       const el = document.createElement('div');
// //       el.className = 'custom-marker';
// //       el.style.width = '8px';
// //       el.style.height = '8px';
// //       el.style.backgroundColor = '#07A1E8'; // สีของจุด
// //       el.style.borderRadius = '50%';
// //       el.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';

// //       const marker = new mapboxgl.Marker({ element: el })
// //         .setLngLat([parseFloat(longitude), parseFloat(latitude)])
// //         .setPopup(
// //           new mapboxgl.Popup({ closeButton: false }).setHTML(
// //             `<div>
// //               <h3>${first_name} ${last_name}</h3>
// //               <p><strong>Age:</strong> ${id}</p>
// //               <p><strong>Age:</strong> ${age}</p>
// //               <p><strong>Gender:</strong> ${gender}</p>
// //               <p><strong>Address:</strong> ${address}</p>
// //             </div>`
// //           )


// //         )
// //         .addTo(map);

// //         el.addEventListener('click', () => {
// //           mapRef.current.flyTo({
// //             center: [parseFloat(longitude), parseFloat(latitude)],
// //             zoom: 17,
// //             speed: 1.5,
// //             curve: 1.5,
// //             easing(t) {
// //               return t;
// //             },
// //           });
// //         });
// //     });
// //   }


// const markersRef = useRef({}); // Use useRef to persist markers across renders

// function addMarkersToMap(map, markers) {
//   const existingMarkers = document.querySelectorAll('.custom-marker');
//   existingMarkers.forEach((marker) => marker.remove());

//   markers.forEach(({ id, latitude, longitude, first_name, last_name, age, gender, address, status }) => {
//     const el = document.createElement('div');
//     el.className = 'custom-marker';
//     el.style.width = '8px';
//     el.style.height = '8px';
//     el.style.backgroundColor = '#07A1E8';
//     el.style.borderRadius = '50%';
//     el.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';

//     const marker = new mapboxgl.Marker({ element: el })
//       .setLngLat([parseFloat(longitude), parseFloat(latitude)])
//       .setPopup(
//         new mapboxgl.Popup({ closeButton: false })
//           .setHTML(
//             `<div style="max-width: 250px; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; white-space: normal;">
//             <h1 style="font-size: 15px"><strong>${first_name} ${last_name}</strong></h1>
//             <p><strong>Age:</strong> ${age}</p>
//             <p><strong>Gender:</strong> ${gender}</p>
//             <p><strong>Address:</strong> ${address}</p>
//           </div>`
//           )
//           .setOffset([0, -10]) // Adjust this value to move the popup higher or lower
//       )
//       .addTo(map);

//     markersRef.current[id] = marker; // Use useRef to persist the markers
//     // console.log('MarkersRef:', markersRef.current);

//     el.addEventListener('click', () => {
//       map.flyTo({
//         center: [parseFloat(longitude), parseFloat(latitude)],
//         zoom: 17,
//         speed: 1.5,
//         curve: 1.5,
//         easing(t) {
//           return t;
//         },
//       });
//       marker.togglePopup();
//     });
//   });
// }

// const goMarkerById = (id) => {
//   // Access markersRef correctly
//   const marker = markersRef.current[id];
//   if (marker) {
//     // Close any open popups first
//     const allPopups = document.querySelectorAll('.mapboxgl-popup'); // Get all popups
//     allPopups.forEach(popup => popup.remove()); // Remove all open popups

//     // Fly to the marker
//     mapRef.current.flyTo({
//       center: marker.getLngLat(), // Ensure map is centered at the marker position
//       zoom: 17,
//       speed: 1.5,
//       curve: 1.5,
//       easing(t) {
//         return t;
//       },
//     });

//     // Show the popup associated with the marker
//     marker.getPopup().addTo(mapRef.current); // Directly add the popup to the map
//   } else {
//     console.warn(`Marker with id ${id} not found.`);
//   }
// };










//   // useEffect(() => {
//   //   if (mapRef.current && markers.length > 0) {
//   //     addMarkersToMap(mapRef.current, markers);
//   //   }
//   // }, [mapCenter, selectedStyle, markers]);



//   // ------------------------pin รัศมี--------------------------------------------


//   const AddCircleClickRef = useRef(false);
//   const [AddCircleClick, setAddCircleClick] = useState(false);
//   const [mapElements, setMapElements] = useState([]); // เก็บข้อมูลหมุดและวงกลมทั้งหมด







//   // use, stably


//   const handleAddCircleClick = () => {
//     return new Promise((resolve) => {
//       setAddCircleClick((prev) => !prev); // สลับค่าระหว่าง true และ false

//       if (mapRef.current) {
//         mapRef.current.on('click', async (event) => {
//           const { lng, lat } = event.lngLat;
//           resolve({ lng, lat }); // ส่งค่าพิกัดกลับหลังจากคลิก
//         });
//       }
//     });
//   };







  


//   useEffect(() => {
//     AddCircleClickRef.current = AddCircleClick;
//   }, [AddCircleClick]);

//   const drawCircle = (center, radius, map, circleId) => {
//     const points = 64;
//     const coordinates = [];
//     const distanceX = radius / (111.32 * Math.cos((center[1] * Math.PI) / 180));
//     const distanceY = radius / 110.574;

//     for (let i = 0; i < points; i++) {
//       const theta = (i / points) * (2 * Math.PI);
//       const x = distanceX * Math.cos(theta);
//       const y = distanceY * Math.sin(theta);
//       coordinates.push([center[0] + x, center[1] + y]);
//     }
//     coordinates.push(coordinates[0]);

//     const circleGeoJSON = {
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           geometry: {
//             type: "Polygon",
//             coordinates: [coordinates],
//           },
//         },
//       ],
//     };

//     if (map.getSource(circleId)) {
//       map.getSource(circleId).setData(circleGeoJSON);
//     } else {
//       map.addSource(circleId, {
//         type: "geojson",
//         data: circleGeoJSON,
//       });

//       map.addLayer({
//         id: circleId,
//         type: "fill",
//         source: circleId,
//         layout: {},
//         paint: {
//           "fill-color": "rgba(0, 218, 88, 0.3)",
//           "fill-opacity": 0.5,
//         },
//       });
//     }
//   };






//   // const onMapClick = (event, map) => {
//   //   const { lng, lat } = event.lngLat;
//   //   const circleId = `circle-${lng}-${lat}`;

//   //   const marker = new mapboxgl.Marker({ color: "red", draggable: true })
//   //     .setLngLat([lng, lat])
//   //     .addTo(map);

//   //   const radius = 0.7;
//   //   drawCircle([lng, lat], radius, map, circleId);

//   //   marker.on("dragend", () => {
//   //     const newLngLat = marker.getLngLat();

//   //     // วาดวงกลมใหม่ที่ตำแหน่งล่าสุด
//   //     drawCircle([newLngLat.lng, newLngLat.lat], radius, map, circleId);

//   //     // อัปเดตตำแหน่งของหมุดและวงกลมใน state
//   //     setMapElements((prev) =>
//   //       prev.map((el) =>
//   //         el.circleId === circleId
//   //           ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat }
//   //           : el
//   //       )
//   //     );

//   //     console.log("New Position: ----> ", newLngLat);
//   //     // ส่งพิกัดที่อัปเดตไปยัง Parent Component
//   //     onMapElementsUpdate(mapElements);
//   //   });

//   //   // บันทึกหมุดและค่าพิกัดเริ่มต้นใน state
//   //   setMapElements((prev) => [
//   //     ...prev,
//   //     { marker, circleId, map, lng, lat },
//   //   ]);

//   //   setAddCircleClick(false);
//   //       // ส่งพิกัดเริ่มต้นไปยัง Parent Component
//   //     onMapElementsUpdate(mapElements);
//   // };





//   // use real
//   const onMapClick = (event, map, radius) => {
//     const { lng, lat } = event.lngLat;
//     const circleId = `circle-${lng}-${lat}`; // สร้าง ID สำหรับวงกลม    
//     console.log("in map click: "+ radius);
    

//     // สร้างหมุด
//     const marker = new mapboxgl.Marker({ color: "blue", draggable: true })
//       .setLngLat([lng, lat])
//       .addTo(map);

//     drawCircle([lng, lat], radius, map, circleId);

//     marker.on("dragend", () => {
//       const newLngLat = marker.getLngLat();

//       drawCircle([newLngLat.lng, newLngLat.lat], radius, map, circleId);

//       setMapElements((prev) =>
//         prev.map((el) =>
//           el.circleId === circleId
//             ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat }
//             : el
//         )
//       );
//     });

//     // เพิ่มหมุดใหม่ใน state
//     setMapElements((prev) => [
//       ...prev,
//       { marker, circleId, map, lng, lat },
//     ]);

//     setAddCircleClick(false);
//   };




//   // ใช้ useEffect เพื่อส่งข้อมูลไปที่ Parent Component เมื่อ mapElements เปลี่ยนแปลง
//   useEffect(() => {
//     if (typeof props.onMapElementsUpdate === "function") {
//       props.onMapElementsUpdate(mapElements);
//     }
//   }, [mapElements, props.onMapElementsUpdate]); // อัปเดตเมื่อ mapElements เปลี่ยนแปลง





//   // ปรับ และ เปลี่ยน ณ ตอนนั้น
//   const updateCircleRadius = (idx, radius) => {
//     const element = mapElements[idx];
//     console.log("นี้-> " + radius);

//     if (element) {
//       const { circleId, map, lng, lat } = element;
//       drawCircle([lng, lat], radius, map, circleId); // วาดวงกลมใหม่ที่ตำแหน่งเดิมด้วยรัศมีที่อัปเดต
//     }
//   };


//   // use//
//   // const onMapClick = (event, map) => {
//   //   const { lng, lat } = event.lngLat;
//   //   const circleId = `circle-${lng}-${lat}`; // สร้าง ID สำหรับวงกลม

//   //   // สร้างหมุด
//   //   const marker = new mapboxgl.Marker({ color: "red", draggable: true })
//   //     .setLngLat([lng, lat])
//   //     .addTo(map);

//   //   const radius = 0.7;

//   //   // วาดวงกลม
//   //   drawCircle([lng, lat], radius, map, circleId);

//   //   // ตั้งค่าเมื่อหมุดถูกลาก
//   //   marker.on("dragend", () => {
//   //     const newLngLat = marker.getLngLat();

//   //     // วาดวงกลมใหม่ที่ตำแหน่งล่าสุด
//   //     drawCircle([newLngLat.lng, newLngLat.lat], radius, map, circleId);

//   //     // อัปเดตตำแหน่งของหมุดใน state
//   //     setMapElements((prev) => {
//   //       const updatedElements = prev.map((el) =>
//   //         el.circleId === circleId
//   //           ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat }
//   //           : el
//   //       );

//   //       // เรียกฟังก์ชันอัปเดต Parent Component
//   //       onMapElementsUpdate(updatedElements);

//   //       return updatedElements;
//   //     });
//   //   });

//   //   // เพิ่มหมุดใหม่ใน state
//   //   setMapElements((prev) => {
//   //     const updatedElements = [
//   //       ...prev,
//   //       { marker, circleId, map, lng, lat },
//   //     ];

//   //     // เรียกฟังก์ชันอัปเดต Parent Component
//   //     onMapElementsUpdate(updatedElements);

//   //     return updatedElements;
//   //   });

//   //   setAddCircleClick(false); // ปิดสถานะการเพิ่มหมุด
//   // };

//   const removeElement = (idx) => {
//     const element = mapElements[idx]; // ค้นหา element ตาม index
//     if (!element) return;

//     const { marker, circleId, map } = element;

//     // ลบหมุด
//     marker.remove();

//     // ลบวงกลม
//     if (map.getLayer(circleId)) map.removeLayer(circleId);
//     if (map.getSource(circleId)) map.removeSource(circleId);

//     // อัปเดต state
//     setMapElements((prev) => {
//       const updatedElements = prev.filter((_, i) => i !== idx);

//       // ส่งข้อมูลใหม่ไปยัง Parent Component
//       if (typeof onMapElementsUpdate === "function") {
//         props.onMapElementsUpdate(updatedElements);
//       }

//       return updatedElements;
//     });
//   };

//   const clearAllElements = () => {
//     mapElements.forEach(({ marker, circleId, map }) => {
//       marker.remove();
//       if (map.getLayer(circleId)) map.removeLayer(circleId);
//       if (map.getSource(circleId)) map.removeSource(circleId);
//     });

//     // อัปเดต state และแจ้ง Parent Component
//     setMapElements([]); // ลบข้อมูลใน mapElements
//     if (typeof onMapElementsUpdate === "function") {
//       props.onMapElementsUpdate([]); // แจ้ง Parent Component ว่าไม่มีข้อมูลแล้ว
//     }
//   };





//   useEffect(() => {
//     if (!mapCenter || (mapCenter[0] === 0 && mapCenter[1] === 0)) return;

//     const map = initializeMap(mapCenter);
//     mapRef.current = map;

//     map.on("click", (event) => {
//       if (AddCircleClickRef.current) {
//         onMapClick(event, map, 1);
//       }
//     });

//     if (markers.length > 0) {
//       addMarkersToMap(map, markers);
//     }

//     return () => map.remove();
//   }, [mapCenter, markers]);

//   // MAP END *************************************************************************************************  



//   const distance = [];
//   const [routes, setRoutes] = useState([]); // เก็บข้อมูล routes
//   const [routeColors, setRouteColors] = useState([]);

//   useEffect(() => {
//     console.log("Updated routeColors:", routeColors);
//   }, [routeColors]); 
  



//   const handleSubmit = async (num_bus, max_stops, max_time, type, findBy, trip_id, roteImport) => {
//     const locations = markers.map((marker) => [parseFloat(marker.latitude), parseFloat(marker.longitude)]);
//     const data = {
//       depot: [parseFloat(depotLat), parseFloat(depotLng)],
//       num_vehicles: num_bus,
//       max_stops_per_vehicle: max_stops,
//       max_travel_time: max_time * 60, // แปลงเวลาเป็นวินาที
//       locations: locations,
//     };

//     // รีเซ็ตสถานะ
//     setRouteColors([]);
//     setRoutes([]);
//     resetRoute(mapRef.current);

//     setIsLoading(true); // เริ่มโหลด

//     try {

//       let result = []
//       let colors = []

//       // เรียก fetchRoutes เพื่อคำนวณเส้นทาง
//       if(findBy === "home"){
//         result = await fetchRoutes(idToken, mapRef.current, data);
//         // setRoutes(result);
//         console.log("route ที่ได้ "+ result);
       
//         colors = result.map(() => getRandomHexColor());
//         // setRouteColors(colors);
//       }else if(findBy === "his"){
//         result = await fetchRouteByTripId(idToken, trip_id);

//         console.log("HIS "+ result);

//         // colors = result.map(() => getRandomHexColor());
//         colors = result.map(route => route.color);
//         console.log("this color"+colors);
        
//       }else if(findBy === "import"){
//         result = roteImport;

//         console.log("import "+ result);
        
    
//         colors = result.map(route => route.color);
//         console.log("this color"+colors);
        
//       }else {

//       }
      

//       // console.log("......>"+routeColors);  #CC6CE7
      


//       // console.log("Add "+colors);

      
      

//       // // วาดเส้นทางบนแผนที่
//       // result.forEach((route, index) => {
//       //   const routeKey = `route ${index + 1}`;
//       //   const coordinates = route[routeKey];
//       //   if (coordinates) {
//       //     drawRoute(mapRef.current, coordinates, routeKey, colors[index], true)
//       //       .then((didu) => {
//       //         setdisdu(didu.distance)
//       //         console.log("----> " + didu.distance);
//       //         console.log("----> " + didu.duration);
//       //       })
//       //       .catch((error) => {
//       //         console.error("Error drawing route:", error);
//       //       });
//       //   }
//       // });
//       // // ส่งกลับ routes และ routeColors
//       // return { routes: result, routeColors: colors };

//       const distance = [];
//       const duration = [];

//       // Create an array of Promises
//       const drawPromises = result.map(async (route, index) => {
//         const routeKey = `route ${index + 1}`;
//         const coordinates = route[routeKey];

//         console.log("routeKey in MAP :" + routeKey);

//         if (coordinates) {
//           try {
//             const didu = await drawRoute(mapRef.current, coordinates, routeKey, colors[index], type);
//             distance.push(didu.distance); // Push distance when resolved
//             duration.push(didu.duration); // Push duration when resolved
//             return didu;
//           } catch (error) {
//             console.error("Error drawing route:", error);
//           }
//         }
//         // return Promise.resolve(); // Return a resolved Promise if coordinates are missing
//         return null;
//       });

//       // Wait for all Promises to complete
//       const diduArray = await Promise.all(drawPromises);


//       console.log("this route Befor send: "+ result);
      

//       return { routes: result, routeColors: colors, routeDistance: distance, routeDuration: duration, Didu: JSON.stringify(diduArray, null, 2) };

//     } catch (error) {
//       console.error("Error drawing routes:", error);
//       throw error; // ส่งข้อผิดพลาดออกไป
//     } finally {
//       setIsLoading(false); // สิ้นสุดการโหลด
//     }
//   };










//   const handleReset = () => {
//     setRouteColors([]); // รีเซ็ตสีทั้งหมด
//     setRoutes([]); // รีเซ็ตเส้นทางทั้งหมด
//     resetRoute(mapRef.current); // ลบเส้นทางบนแผนที่ (ถ้ามีฟังก์ชัน resetRoute)
//   };



//   // time count
//   const [elapsedTime, setElapsedTime] = useState(0); // เก็บเวลาที่ผ่านไป

//   useEffect(() => {
//     let timer;
//     if (isLoading) {
//       setElapsedTime(0); // รีเซ็ตเวลาเมื่อเริ่มโหลด
//       timer = setInterval(() => {
//         setElapsedTime((prev) => prev + 1); // เพิ่มเวลาทีละ 1 วินาที
//       }, 1000);
//     } else {
//       clearInterval(timer); // หยุดการนับเมื่อโหลดเสร็จ
//     }
//     return () => clearInterval(timer); // ล้าง timer เมื่อ component ถูก unmount
//   }, [isLoading]);



//   const handleDrawRoute = async (route, routeKey, routeColor, type) => {
//     // console.log(route);
//     // console.log(routeKey);
//     // console.log(routeColor);
//     const coordinates = route[routeKey];
//     if (coordinates) {
//       const result = await drawRoute(mapRef.current, coordinates, routeKey, routeColor, type); // แสดงลำดับหมุด
//       // console.log(".....> "+result);
//       return result;
//     }
//   };




//   // -------------------------------------------------------------------------
//   return (
//     <div className="h-screen w-full">
//       {/* Map Container */}
//       <div ref={mapContainerRef} className="w-full h-full" />
//       <p className="absolute bottom-4 right-4 text-gray-600">
//         {AddCircleClick ? "Choose a location ... " : " "}
//       </p>




//       <ul className="absolute right-0 bottom-0">
//         {mapElements.map((el, idx) => (
//           <li key={el.circleId}>
//             Marker {idx + 1}: Longitude: {el.lng.toFixed(5)}, Latitude: {el.lat.toFixed(5)}
//           </li>
//         ))}
//       </ul>

//     </div>
//   );
// });

// export default Map;

// ^^^^^ใช้ 5/02/25











// real use 10-2-25 ---------------------------------------------------------@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
// import mapboxgl from "mapbox-gl";
// import 'mapbox-gl/dist/mapbox-gl.css';
// import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";


// import { drawRoute, fetchMarkers, resetRoute } from "../services/mapboxService";
// import { fetchMapCenter } from "../services/schoolService";
// import { subscribeAuthState } from "../services/authService";
// import { fetchRoutes, fetchRouteByTripId, getRandomHexColor } from "../services/routeService";

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// const Map = forwardRef((props, ref) => {

//   const { radiusValues } = props; // รับค่าจาก Sidebar

//   console.log(">> Radius: " + radiusValues);


//   const [user, setUser] = useState(null);
//   const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token


//   const [markers, setMarkers] = useState([]); // State สำหรับเก็บข้อมูลหมุดจาก API
//   const mapContainerRef = useRef(null);
//   const mapRef = useRef(null);
//   const [mapCenter, setMapCenter] = useState([0, 0]);
//   const [isLoading, setIsLoading] = useState(false); // สถานะโหลด

//   const [depotLat, setDepotLat] = useState();
//   const [depotLng, setDepotLng] = useState();



//   const refetchData = async () => {
//     console.log("map data...");

//     try {
//         if (idToken) {
//             // 🔹 Fetch markers ใหม่
//             const data = await fetchMarkers(idToken);
//             setMarkers(data);

//             // 🔹 Fetch center ของโรงเรียนใหม่
//             const mark_center = await fetchMapCenter(idToken);
//             setMapCenter(mark_center);
//             setDepotLat(mark_center[1]);
//             setDepotLng(mark_center[0]);

//             // 🔹 รีเซ็ตแผนที่
//             if (mapRef.current) {
//                 const map = initializeMap(mark_center);
//                 mapRef.current = map;

//                 // โหลดหมุดใหม่
//                 if (data.length > 0) {
//                     addMarkersToMap(map, data);
//                 }
//             }
//             console.log("Map data refetched successfully.");
//         }
//     } catch (error) {
//         console.error("Error refetching data:", error);
//     } 
// };

//   // com อื่น ใช้ func ได้
//   useImperativeHandle(ref, () => ({
//     handleSubmit,
//     handleReset,
//     handleDrawRoute,
//     handleAddCircleClick,
//     clearAllElements,
//     removeElement,
//     updateCircleRadius,
//     goMarkerById,
//     refetchData,
//   }));




//   useEffect(() => {
//     const unsubscribe = subscribeAuthState(setUser, setIdToken); // เรียกใช้ service
//     return () => unsubscribe(); // เมื่อ component ถูกลบออก, ยกเลิกการ subscribe
//   }, []); // ใช้ [] เพื่อให้เพียงแค่ครั้งแรกที่ mount



//   useEffect(() => {
//     const fetchAndSetMarkers = async () => {
//       try {
//         if (idToken) {
//           const data = await fetchMarkers(idToken); // เรียกใช้ service ดึงข้อมูล
//           setMarkers(data); // เก็บข้อมูลที่ได้จาก API ใน state    

//           const mark_center = await fetchMapCenter(idToken);
//           setMapCenter(mark_center);
//           setDepotLat(mark_center[1]);
//           setDepotLng(mark_center[0]);

//         }
//       } catch (error) {
//         console.error("Error fetching marker data: ", error);
//       }
//     };
//     fetchAndSetMarkers();
//   }, [idToken]);


//   // ฟังก์ชันสำหรับการสร้างแผนที่
//   const initializeMap = (mapCenter) => {
//     const map = new mapboxgl.Map({
//       container: mapContainerRef.current,
//       style: "mapbox://styles/mapbox/light-v10",
//       center: mapCenter,
//       zoom: 12,
//       attributionControl: false,
//       dragPan: true,
//       scrollZoom: true,
//       boxZoom: false,
//       dragRotate: false,
//     });

//     if (mapCenter[0] !== 0 && mapCenter[1] !== 0) {
//       new mapboxgl.Marker({ color: "black" }).setLngLat(mapCenter).addTo(map);
//     }

//     return map;
//   };



  
// const markersRef = useRef({}); // Use useRef to persist markers across renders

// function addMarkersToMap(map, markers) {
//   const existingMarkers = document.querySelectorAll('.custom-marker');
//   existingMarkers.forEach((marker) => marker.remove());

//   markers.forEach(({ id, latitude, longitude, first_name, last_name, age, gender, address, status }) => {
//     const el = document.createElement('div');
//     el.className = 'custom-marker';
//     el.style.width = '8px';
//     el.style.height = '8px';
//     el.style.backgroundColor = '#07A1E8';
//     el.style.borderRadius = '50%';
//     el.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';

//     const marker = new mapboxgl.Marker({ element: el })
//       .setLngLat([parseFloat(longitude), parseFloat(latitude)])
//       .setPopup(
//         new mapboxgl.Popup({ closeButton: false })
//           .setHTML(
//             `<div style="max-width: 250px; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; white-space: normal;">
//             <h1 style="font-size: 15px"><strong>${first_name} ${last_name}</strong></h1>
//             <p><strong>Age:</strong> ${age}</p>
//             <p><strong>Gender:</strong> ${gender}</p>
//             <p><strong>Address:</strong> ${address}</p>
//           </div>`
//           )
//           .setOffset([0, -10]) // Adjust this value to move the popup higher or lower
//       )
//       .addTo(map);

//     markersRef.current[id] = marker; // Use useRef to persist the markers


//     el.addEventListener('click', () => {
//       map.flyTo({
//         center: [parseFloat(longitude), parseFloat(latitude)],
//         zoom: 17,
//         speed: 1.5,
//         curve: 1.5,
//         easing(t) {
//           return t;
//         },
//       });
//       marker.togglePopup();
//     });
//   });
// }

// const goMarkerById = (id) => {
//   // Access markersRef correctly
//   const marker = markersRef.current[id];
//   if (marker) {
//     // Close any open popups first
//     const allPopups = document.querySelectorAll('.mapboxgl-popup'); // Get all popups
//     allPopups.forEach(popup => popup.remove()); // Remove all open popups

//     // Fly to the marker
//     mapRef.current.flyTo({
//       center: marker.getLngLat(), // Ensure map is centered at the marker position
//       zoom: 17,
//       speed: 1.5,
//       curve: 1.5,
//       easing(t) {
//         return t;
//       },
//     });

//     // Show the popup associated with the marker
//     marker.getPopup().addTo(mapRef.current); // Directly add the popup to the map
//   } else {
//     console.warn(`Marker with id ${id} not found.`);
//   }
// };


//   // ------------------------pin รัศมี--------------------------------------------


//   const AddCircleClickRef = useRef(false);
//   const [AddCircleClick, setAddCircleClick] = useState(false);

//   const [mapElements, setMapElements] = useState([]); // เก็บข้อมูลหมุดและวงกลมทั้งหมด


//   // use, stably

//   const handleAddCircleClick = () => {
//     return new Promise((resolve) => {
//       setAddCircleClick((prev) => !prev); // สลับค่าระหว่าง true และ false

//       if (mapRef.current) {
//         mapRef.current.on('click', async (event) => {
//           const { lng, lat } = event.lngLat;
//           resolve({ lng, lat }); // ส่งค่าพิกัดกลับหลังจากคลิก
//         });
//       }
//     });
//   };



//   useEffect(() => {
//     AddCircleClickRef.current = AddCircleClick;
//   }, [AddCircleClick]);

//   const drawCircle = (center, radius, map, circleId) => {
//     const points = 64;
//     const coordinates = [];
//     const distanceX = radius / (111.32 * Math.cos((center[1] * Math.PI) / 180));
//     const distanceY = radius / 110.574;

//     for (let i = 0; i < points; i++) {
//       const theta = (i / points) * (2 * Math.PI);
//       const x = distanceX * Math.cos(theta);
//       const y = distanceY * Math.sin(theta);
//       coordinates.push([center[0] + x, center[1] + y]);
//     }
//     coordinates.push(coordinates[0]);

//     const circleGeoJSON = {
//       type: "FeatureCollection",
//       features: [
//         {
//           type: "Feature",
//           geometry: {
//             type: "Polygon",
//             coordinates: [coordinates],
//           },
//         },
//       ],
//     };

//     if (map.getSource(circleId)) {
//       map.getSource(circleId).setData(circleGeoJSON);
//     } else {
//       map.addSource(circleId, {
//         type: "geojson",
//         data: circleGeoJSON,
//       });

//       map.addLayer({
//         id: circleId,
//         type: "fill",
//         source: circleId,
//         layout: {},
//         paint: {
//           "fill-color": "rgba(204, 108, 231, 0.5)",
//           "fill-opacity": 0.5,
//         },
//       });

//       map.addLayer({
//         id: circleId + "-outline",
//         type: "line",
//         source: circleId,
//         layout: {},
//         paint: {
//           "line-color": "rgba(204, 108, 231, 1)",
//           "line-width": 2  // ปรับความหนาของเส้นขอบตามที่ต้องการ (เช่น 2 พิกเซล)
//         },
//       });
//     }
//   };


// // -------------------------------------------deving 5/02/25 ---------------------------------------------

// // // ฟังก์ชันคำนวณระยะทางระหว่างจุดสองจุด
// // const calculateDistance = (lat1, lon1, lat2, lon2) => {
// //   const R = 6371; // ความยาวของรัศมีโลก (km)
// //   const dLat = (lat2 - lat1) * Math.PI / 180;
// //   const dLon = (lon2 - lon1) * Math.PI / 180;

// //   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
// //             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
// //             Math.sin(dLon / 2) * Math.sin(dLon / 2);
// //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

// //   return R * c; // คืนค่าระยะทางในกิโลเมตร
// // };

// // // ฟังก์ชันเช็คว่านักเรียนอยู่ในวงกลมหรือไม่
// // const checkIfStudentInCircle = (studentLat, studentLng, circleLat, circleLng, radius) => {
// //   const distance = calculateDistance(studentLat, studentLng, circleLat, circleLng);
// //   return distance <= radius; // ถ้าระยะทางน้อยกว่าหรือเท่ากับรัศมีของวงกลม จะถือว่าอยู่ในวงกลม
// // };

// // // use now
// // const onMapClick = (event, map, radius) => {
// //   const { lng, lat } = event.lngLat;
// //   const circleId = `circle-${lng}-${lat}`; // สร้าง ID สำหรับวงกลม    

// //   // สร้างหมุด
// //   const marker = new mapboxgl.Marker({ color: "blue", draggable: true })
// //     .setLngLat([lng, lat])
// //     .addTo(map);

// //   // วาดวงกลม
// //   drawCircle([lng, lat], radius, map, circleId);

// //   // ตรวจสอบนักเรียนที่อยู่ในวงกลมเมื่อหมุดถูกสร้างครั้งแรก
// //   const studentsInCircle = Array.isArray(markers) ? markers.filter(student => 
// //     checkIfStudentInCircle(student.latitude, student.longitude, lat, lng, radius)
// //   ) : [];

// //   // เก็บข้อมูลนักเรียนที่อยู่ในวงกลม
// //   console.log("Students within the circle:", studentsInCircle.na);

// //   // เพิ่มหมุดใหม่ใน state พร้อมข้อมูลนักเรียน
// //   setMapElements((prev) => [
// //     ...prev,
// //     { marker, circleId, map, lng, lat, students: studentsInCircle }, // เก็บข้อมูลนักเรียนในหมุด
// //   ]);

// //   // เมื่อหมุดถูกลาก (dragend) เราจะตรวจสอบตำแหน่งใหม่
// //   marker.on("dragend", () => {
// //     const newLngLat = marker.getLngLat(); // พิกัดใหม่ที่หมุดถูกลากไป

// //     // วาดวงกลมใหม่
// //     drawCircle([newLngLat.lng, newLngLat.lat], radius, map, circleId);

// //     // ตรวจสอบนักเรียนที่อยู่ในวงกลมใหม่
// //     const studentsInNewCircle = markers.filter(student => 
// //       checkIfStudentInCircle(student.latitude, student.longitude, newLngLat.lat, newLngLat.lng, radius)
// //     );

// //     // เก็บข้อมูลนักเรียนที่อยู่ในวงกลมใหม่
// //     console.log("Updated students within the circle:", studentsInNewCircle);

// //     // อัปเดต mapElements ด้วยข้อมูลใหม่
// //     setMapElements((prev) =>
// //       prev.map((el) =>
// //         el.circleId === circleId
// //           ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat, students: studentsInNewCircle }
// //           : el
// //       )
// //     );
// //   });

// //   setAddCircleClick(false);
// // };



// // ฟังก์ชันคำนวณระยะทางระหว่างจุดสองจุด (หน่วย: กิโลเมตร)
// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // รัศมีโลก (km)
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

// // ฟังก์ชันเช็คว่านักเรียนอยู่ในวงกลมหรือไม่
// const checkIfStudentInCircle = (studentLat, studentLng, circleLat, circleLng, radius) => {
//   const distance = calculateDistance(studentLat, studentLng, circleLat, circleLng);
//   return distance <= radius;
// };

// // ฟังก์ชันสำหรับอัปเดตการจัดสรรนักเรียนให้กับหมุดทั้งหมดใหม่
// // โดยให้นักเรียนแต่ละคนอยู่ในหมุดที่ใกล้ที่สุด (เฉพาะหมุดที่วงกลมครอบคลุมนักเรียน)
// const updateStudentAssignments = (circles, markers) => {
//   // รีเซ็ตข้อมูลนักเรียนในแต่ละหมุดก่อน
//   const newCircles = circles.map(circle => ({ ...circle, students: [] }));
  
//   // วนลูปตรวจสอบนักเรียนแต่ละคน
//   markers.forEach(student => {
//     let nearestCircle = null;
//     let minDistance = Infinity;
//     newCircles.forEach(circle => {
//       // ตรวจสอบว่านักเรียนอยู่ในวงกลมของหมุดนี้หรือไม่
//       if (checkIfStudentInCircle(student.latitude, student.longitude, circle.lat, circle.lng, circle.radius)) {
//         const distance = calculateDistance(student.latitude, student.longitude, circle.lat, circle.lng);
//         if (distance < minDistance) {
//           minDistance = distance;
//           nearestCircle = circle;
//         }
//       }
//     });
//     // หากพบหมุดที่นักเรียนอยู่ในวงและใกล้ที่สุด ให้นำนักเรียนไปเก็บในหมุดนั้น
//     if (nearestCircle) {
//       nearestCircle.students.push(student);
//     }
//   });
  
//   return newCircles;
// };

// // // กำหนดตัวแปร global สำหรับนับ marker
// // const markerCounterRef = useRef(1);






// // good
// // const onMapClick = (event, map, radius) => {
// //   const { lng, lat } = event.lngLat;
// //   const circleId = `circle-${lng}-${lat}`;

// //   // ใช้ markerCounter เพื่อแสดงหมายเลข marker แล้วเพิ่มค่า counter ไปอีก 1
// //   const markerNumber = markerCounter;
// //   markerCounter++;

// //   // สร้าง element สำหรับ marker ที่แสดงหมายเลข
// //   const markerEl = document.createElement("div");
// //   markerEl.className = "custom-marker";
// //   markerEl.textContent = markerNumber; // แสดงหมายเลข marker

// //   // กำหนดสไตล์ให้กับ marker element
// //   markerEl.style.backgroundColor = "yellow";
// //   markerEl.style.color = "black";
// //   markerEl.style.borderRadius = "50%";
// //   markerEl.style.width = "15px";
// //   markerEl.style.height = "15px";
// //   markerEl.style.display = "flex";
// //   markerEl.style.alignItems = "center";
// //   markerEl.style.justifyContent = "center";
// //   markerEl.style.fontWeight = "bold";

// //   // สร้าง marker ด้วย element ที่กำหนดเองและให้สามารถลากได้
// //   const marker = new mapboxgl.Marker({ element: markerEl, draggable: true })
// //     .setLngLat([lng, lat])
// //     .addTo(map);

// //   // วาดวงกลมบนแผนที่
// //   drawCircle([lng, lat], radius, map, circleId);

// //   // สมมติว่า markers (ข้อมูลนักเรียน) และ setMapElements เป็นการอัปเดต state
// //   const studentsInCircle = Array.isArray(markers) ? markers.filter(student => 
// //     checkIfStudentInCircle(student.latitude, student.longitude, lat, lng, radius)
// //   ) : [];

// //   // เพิ่มข้อมูลหมุด (circle) ใหม่ลงใน state พร้อมข้อมูลนักเรียนที่อยู่ในวงกลม
// //   setMapElements((prev) => [
// //     ...prev,
// //     { marker, circleId, map, lng, lat, radius, students: studentsInCircle },
// //   ]);

// //   // เมื่อ marker ถูกลาก (dragend) จะทำการอัปเดตตำแหน่งและนักเรียนในวงกลมใหม่
// //   marker.on("dragend", () => {
// //     const newLngLat = marker.getLngLat();
// //     drawCircle([newLngLat.lng, newLngLat.lat], radius, map, circleId);

// //     const studentsInNewCircle = markers.filter(student => 
// //       checkIfStudentInCircle(student.latitude, student.longitude, newLngLat.lat, newLngLat.lng, radius)
// //     );

// //     setMapElements((prev) =>
// //       prev.map((el) =>
// //         el.circleId === circleId
// //           ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat, students: studentsInNewCircle }
// //           : el
// //       )
// //     );
// //   });



//   // marker.on("dragend", () => {
//   //   const newLngLat = marker.getLngLat();
//   //   // วาดวงกลมใหม่ที่ตำแหน่งใหม่โดยใช้ค่า radius เดิมที่ marker ถูกสร้าง
//   //   drawCircle([newLngLat.lng, newLngLat.lat], radius, map, circleId);
  
//   //   const studentsInNewCircle = markers.filter(student =>
//   //     checkIfStudentInCircle(
//   //       student.latitude,
//   //       student.longitude,
//   //       newLngLat.lat,
//   //       newLngLat.lng,
//   //       radius
//   //     )
//   //   );
  
//   //   setMapElements((prev) =>
//   //     prev.map((el) =>
//   //       el.circleId === circleId
//   //         ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat, students: studentsInNewCircle }
//   //         : el
//   //     )
//   //   );
//   // });
  

// //   setAddCircleClick(false);
// // };









// // โดยจะคำนวณและอัปเดตการจัดสรรนักเรียนให้กับหมุดทั้งหมดใหม่      (หา student ที่ใกล้ marker ที่ สุด)
// // const onMapClick = (event, map, radius) => {
// //   const { lng, lat } = event.lngLat;
// //   const circleId = `circle-${lng}-${lat}`; // สร้าง ID สำหรับวงกลม

// //   // สร้าง marker ด้วย Mapbox GL ที่สามารถลากได้
// //   const marker = new mapboxgl.Marker({ color: "blue", draggable: true })
// //     .setLngLat([lng, lat])
// //     .addTo(map);

// //   // วาดวงกลมบนแผนที่
// //   drawCircle([lng, lat], radius, map, circleId);

// //   // สร้างวัตถุของหมุดใหม่
// //   const newCircle = { marker, circleId, map, lng, lat, radius, students: [] };

// //   // เพิ่มหมุดใหม่ใน state และอัปเดตการจัดสรรนักเรียนทั้งหมด
// //   setMapElements((prev) => {
// //     const updatedCircles = [...prev, newCircle];
// //     // ใช้ฟังก์ชัน updateStudentAssignments ในการคัดเลือกหมุดที่ใกล้ที่สุดสำหรับนักเรียนแต่ละคน
// //     return updateStudentAssignments(updatedCircles, markers);
// //   });

// //   // เมื่อ marker ถูกลาก (dragend) ให้รีเฟรชตำแหน่งและอัปเดตการจัดสรรนักเรียนใหม่
// //   marker.on("dragend", () => {
// //     const newLngLat = marker.getLngLat();
// //     // วาดวงกลมใหม่ตามตำแหน่งที่ลาก
// //     drawCircle([newLngLat.lng, newLngLat.lat], radius, map, circleId);

// //     setMapElements((prev) => {
// //       // อัปเดตตำแหน่งของหมุดที่ถูกลาก
// //       const updatedCircles = prev.map((el) =>
// //         el.circleId === circleId
// //           ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat }
// //           : el
// //       );
// //       // รีคำนวณการจัดสรรนักเรียนใหม่ในทุกหมุด
// //       return updateStudentAssignments(updatedCircles, markers);
// //     });
// //   });

// //   // ปิดการเพิ่มหมุดใหม่เพิ่มเติม (ถ้าต้องการ)
// //   setAddCircleClick(false);
// // };











// // ใน onMapClick: เมื่อสร้าง marker ใหม่  (marker ปรับ raduis แล้ว dragend เป็นขนาดปัจุบัน)
// // const onMapClick = (event, map, radius) => {
// //   const { lng, lat } = event.lngLat;
// //   const circleId = `circle-${lng}-${lat}`;
  
// //   // สร้าง element สำหรับ marker ที่แสดงหมายเลข
// //   const markerEl = document.createElement("div");
// //   markerEl.className = "custom-marker";
// //   markerEl.textContent = markerCounter;
// //   markerCounter++;
// //   // กำหนดสไตล์ (ปรับได้ตามต้องการ)
// //   markerEl.style.backgroundColor = "yellow";
// //   markerEl.style.color = "black";
// //   markerEl.style.borderRadius = "50%";
// //   markerEl.style.width = "15px";
// //   markerEl.style.height = "15px";
// //   markerEl.style.display = "flex";
// //   markerEl.style.alignItems = "center";
// //   markerEl.style.justifyContent = "center";
// //   markerEl.style.fontWeight = "bold";
  
// //   // ตั้งค่า data attribute เพื่อเก็บค่า radius ปัจจุบัน
// //   markerEl.dataset.radius = radius;
  
// //   // สร้าง marker ด้วย element ที่กำหนดเองและให้ลากได้
// //   const marker = new mapboxgl.Marker({ element: markerEl, draggable: true })
// //     .setLngLat([lng, lat])
// //     .addTo(map);

// //   // วาดวงกลมแรกด้วยค่า radius ที่ส่งเข้ามา
// //   drawCircle([lng, lat], radius, map, circleId);

// //   // บันทึก element ลง state (รวมทั้งค่า radius)
// //   setMapElements((prev) => [
// //     ...prev,
// //     { marker, circleId, map, lng, lat, radius, students: [] }
// //   ]);

// //   // เมื่อ marker ถูกลาก (dragend) ใช้ค่า radius ปัจจุบันจาก marker element
// //   marker.on("dragend", () => {
// //     const newLngLat = marker.getLngLat();
// //     const currentRadius = parseFloat(marker.getElement().dataset.radius); // อ่านค่าใหม่
// //     drawCircle([newLngLat.lng, newLngLat.lat], currentRadius, map, circleId);

// //     // อัปเดต state ของ mapElements ให้ใช้พิกัดใหม่ (และอาจ update ค่าอื่นๆ ตามต้องการ)
// //     setMapElements((prev) =>
// //       prev.map((el) =>
// //         el.circleId === circleId
// //           ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat }
// //           : el
// //       )
// //     );
// //   });

// //   setAddCircleClick(false);
// // };


// // กำหนดตัวแปร global สำหรับนับ marker
// const markerCounterRef = useRef(1);



// const onMapClick = (event, map, radius) => {
//   const { lng, lat } = event.lngLat;
//   const circleId = `circle-${lng}-${lat}`;

//   // สร้าง element สำหรับ marker แบบ custom พร้อมแสดงหมายเลข
//   const markerEl = document.createElement("div");
//   markerEl.className = "custom-marker";
//   markerEl.textContent = markerCounterRef.current; // ใช้ markerCounterRef.current แสดงหมายเลข
//   markerCounterRef.current++; // เพิ่มค่าตัวนับ
//   // กำหนดสไตล์ให้กับ marker element
//   markerEl.style.backgroundColor = "yellow";
//   markerEl.style.color = "black";
//   markerEl.style.borderRadius = "50%";
//   markerEl.style.width = "15px";
//   markerEl.style.height = "15px";
//   markerEl.style.display = "flex";
//   markerEl.style.alignItems = "center";
//   markerEl.style.justifyContent = "center";
//   markerEl.style.fontWeight = "bold";

//   // ตั้งค่า data attribute เพื่อเก็บค่า radius ปัจจุบัน
//   markerEl.dataset.radius = radius;

//   // สร้าง marker ด้วย element ที่กำหนดเองและให้สามารถลากได้
//   const marker = new mapboxgl.Marker({ element: markerEl, draggable: true })
//     .setLngLat([lng, lat])
//     .addTo(map);

//   // วาดวงกลมบนแผนที่ด้วยค่า radius ที่ส่งเข้ามา
//   drawCircle([lng, lat], radius, map, circleId);

//   // สร้างวัตถุใหม่สำหรับหมุด (circle)
//   const newCircle = { marker, circleId, map, lng, lat, radius, students: [] };

//   // เพิ่มหมุดใหม่ลงใน state แล้วรีคำนวณการจัดสรรนักเรียน
//   setMapElements((prev) => {
//     const updatedCircles = [...prev, newCircle];
//     return updateStudentAssignments(updatedCircles, markers);
//   });

//   // เมื่อ marker ถูกลาก (dragend)
//   marker.on("dragend", () => {
//     const newLngLat = marker.getLngLat();
//     // อ่านค่า radius ปัจจุบันจาก marker element
//     const currentRadius = parseFloat(marker.getElement().dataset.radius);

//     // วาดวงกลมใหม่ในตำแหน่งที่ลาก โดยใช้ currentRadius
//     drawCircle([newLngLat.lng, newLngLat.lat], currentRadius, map, circleId);

//     // อัปเดต state ของหมุดด้วยตำแหน่งใหม่และค่า radius ปัจจุบัน
//     setMapElements((prev) => {
//       const updatedCircles = prev.map((el) =>
//         el.circleId === circleId
//           ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat, radius: currentRadius }
//           : el
//       );
//       // รีคำนวณการจัดสรรนักเรียนใหม่ในทุกหมุด
//       return updateStudentAssignments(updatedCircles, markers);
//     });
//   });

//   // ปิดการเพิ่มหมุดใหม่ (ถ้าต้องการ)
//   setAddCircleClick(false);
// };








// // ----------------------------------------------------------------------------------------



//   // use real
//   // const onMapClick = (event, map, radius) => {
//   //   const { lng, lat } = event.lngLat;
//   //   const circleId = `circle-${lng}-${lat}`; // สร้าง ID สำหรับวงกลม    
//   //   console.log("in map click: "+ radius);
    

//   //   // สร้างหมุด
//   //   const marker = new mapboxgl.Marker({ color: "blue", draggable: true })
//   //     .setLngLat([lng, lat])
//   //     .addTo(map);

//   //   drawCircle([lng, lat], radius, map, circleId);

//   //   marker.on("dragend", () => {
//   //     const newLngLat = marker.getLngLat();

//   //     drawCircle([newLngLat.lng, newLngLat.lat], radius, map, circleId);

//   //     setMapElements((prev) =>
//   //       prev.map((el) =>
//   //         el.circleId === circleId
//   //           ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat }
//   //           : el
//   //       )
//   //     );
//   //   });

//   //   // เพิ่มหมุดใหม่ใน state
//   //   setMapElements((prev) => [
//   //     ...prev,
//   //     { marker, circleId, map, lng, lat },
//   //   ]);

//   //   setAddCircleClick(false);
//   // };

//   // ใช้ useEffect เพื่อส่งข้อมูลไปที่ Parent Component เมื่อ mapElements เปลี่ยนแปลง
//   useEffect(() => {
//     if (typeof props.onMapElementsUpdate === "function") {
//       props.onMapElementsUpdate(mapElements);
//     }
//   }, [mapElements, props.onMapElementsUpdate]); // อัปเดตเมื่อ mapElements เปลี่ยนแปล




//   // ปรับ และ เปลี่ยน ณ ตอนนั้น
//   // const updateCircleRadius = (idx, radius) => {
//   //   const element = mapElements[idx];
//   //   console.log("นี้-> " + radius);

//   //   if (element) {
//   //     const { circleId, map, lng, lat } = element;
//   //     drawCircle([lng, lat], radius, map, circleId); // วาดวงกลมใหม่ที่ตำแหน่งเดิมด้วยรัศมีที่อัปเดต
//   //   }
//   // };



//   // ใน updateCircleRadius: เมื่อมีการเปลี่ยนแปลงค่ารัศมีจากหน้า BusToSchool
// // const updateCircleRadius = (idx, newRadius) => {
// //   console.log("gooyunee");
  
// //   const element = mapElements[idx];
// //   if (element) {
// //     const { circleId, map, lng, lat, marker } = element;
// //     // วาดวงกลมใหม่ด้วยค่า newRadius
// //     drawCircle([lng, lat], newRadius, map, circleId);
// //     // อัปเดตค่า data attribute ใน marker element ให้เป็น newRadius
// //     marker.getElement().dataset.radius = newRadius;
// //     // (ถ้าต้องการ) อัปเดตค่าใน state mapElements ด้วย
// //     // ตัวอย่าง:
// //     setMapElements((prev) =>
// //       prev.map((el, i) => i === idx ? { ...el, radius: newRadius } : el)
// //     );
// //   }
// // };



// // test3
// // const updateCircleRadius = (idx, newRadius) => {
// //   console.log("Updating circle radius for index", idx, "to", newRadius);
  
// //   const element = mapElements[idx];
// //   if (element) {
// //     const { circleId, map, lng, lat, marker } = element;
// //     // วาดวงกลมใหม่ด้วยค่า newRadius
// //     drawCircle([lng, lat], newRadius, map, circleId);
// //     // อัปเดตค่า data attribute ใน marker element ให้เป็น newRadius
// //     marker.getElement().dataset.radius = newRadius;
// //     // คำนวณนักเรียนที่อยู่ในวงกลมนี้ โดยใช้ค่า newRadius
// //     const updatedStudents = markers.filter(student =>
// //       checkIfStudentInCircle(student.latitude, student.longitude, lat, lng, newRadius)
// //     );
// //     // อัปเดตค่าใน state mapElements ด้วยข้อมูลใหม่ ทั้งค่า radius และนักเรียนที่อยู่ในวงกลม
// //     setMapElements((prev) =>
// //       prev.map((el, i) =>
// //         i === idx
// //           ? { ...el, radius: newRadius, students: updatedStudents }
// //           : el
// //       )
// //     );
// //   }
// // };


// //good
// const updateCircleRadius = (idx, newRadius) => {
//   console.log("Updating circle radius for index", idx, "to", newRadius);

//   const element = mapElements[idx];
//   if (element) {
//     const { circleId, map, lng, lat, marker } = element;
//     // วาดวงกลมใหม่ด้วยค่า newRadius
//     drawCircle([lng, lat], newRadius, map, circleId);
//     // อัปเดตค่า data attribute ใน marker ให้เป็น newRadius
//     marker.getElement().dataset.radius = newRadius;
//     // คำนวณนักเรียนที่อยู่ในวงกลมนี้ โดยใช้ newRadius
//     const updatedStudents = markers.filter(student =>
//       checkIfStudentInCircle(student.latitude, student.longitude, lat, lng, newRadius)
//     );
//     // อัปเดต state ของ mapElements
//     setMapElements((prev) => {
//       // อัปเดตเฉพาะ element ที่ index ตรงกัน
//       const updatedCircles = prev.map((el, i) =>
//         i === idx ? { ...el, radius: newRadius, students: updatedStudents } : el
//       );
//       // รีคำนวณการจัดสรรนักเรียนในทุกหมุด
//       return updateStudentAssignments(updatedCircles, markers);
//     });
//   }
// };


  





//   // เดิม
//   // const removeElement = (idx) => {
//   //   const element = mapElements[idx]; // ค้นหา element ตาม index
//   //   if (!element) return;

//   //   const { marker, circleId, map } = element;

//   //   // ลบหมุด
//   //   marker.remove();

//   //   // ลบวงกลม
//   //   if (map.getLayer(circleId)) map.removeLayer(circleId);
//   //   if (map.getSource(circleId)) map.removeSource(circleId);

//   //   // อัปเดต state
//   //   setMapElements((prev) => {
//   //     const updatedElements = prev.filter((_, i) => i !== idx);

//   //     // ส่งข้อมูลใหม่ไปยัง Parent Component
//   //     if (typeof onMapElementsUpdate === "function") {
//   //       props.onMapElementsUpdate(updatedElements);
//   //     }

//   //     return updatedElements;
//   //   });
//   // };

// const removeElement = (idx) => {
//   const element = mapElements[idx]; // ค้นหา element ตาม index
//   if (!element) return;

//   const { marker, circleId, map } = element;

//   // ลบ marker
//   marker.remove();

//   // ลบ outline layer (ถ้ามี)
//   if (map.getLayer(circleId + "-outline")) {
//     map.removeLayer(circleId + "-outline");
//   }
//   // ลบ fill layer
//   if (map.getLayer(circleId)) {
//     map.removeLayer(circleId);
//   }
//   // รอจนกว่า map จะ idle แล้วลบ source
//   map.once("idle", () => {
//     if (map.getSource(circleId)) {
//       map.removeSource(circleId);
//     }
//   });

//   // ลบ element ที่ index ที่เลือกออกจาก state
//   const newElements = mapElements.filter((_, i) => i !== idx);
  
//   // อัปเดตการจัดสรรนักเรียนใหม่ในทุกหมุด โดยใช้ฟังก์ชัน updateStudentAssignments
//   const updatedCircles = updateStudentAssignments(newElements, markers);

//   // อัปเดตหมายเลข marker ใหม่ให้เรียงลำดับตามลำดับใน updatedCircles
//   updatedCircles.forEach((el, index) => {
//     el.marker.getElement().textContent = index + 1;
//   });

//   // รีเซ็ต markerCounterRef ให้ตรงกับจำนวน marker ที่เหลือ + 1
//   markerCounterRef.current = updatedCircles.length + 1;

//   // อัปเดต state mapElements ด้วยข้อมูลใหม่
//   setMapElements(updatedCircles);

//   // หากมี callback แจ้ง Parent Component ให้ส่งข้อมูลใหม่ไปด้วย
//   if (typeof onMapElementsUpdate === "function") {
//     props.onMapElementsUpdate(updatedCircles);
//   }
// };








//   // เดิม
//   // const clearAllElements = () => {
//   //   mapElements.forEach(({ marker, circleId, map }) => {
//   //     marker.remove();
//   //     if (map.getLayer(circleId)) map.removeLayer(circleId);
//   //     if (map.getSource(circleId)) map.removeSource(circleId);
    
//   //     if (map.getLayer(circleId + "-outline")) {
//   //       map.removeLayer(circleId + "-outline");
//   //     }
//   //   });

//   //   markerCounterRef.current = 1;

//   //   // อัปเดต state และแจ้ง Parent Component
//   //   setMapElements([]); // ลบข้อมูลใน mapElements
//   //   if (typeof onMapElementsUpdate === "function") {
//   //     props.onMapElementsUpdate([]); // แจ้ง Parent Component ว่าไม่มีข้อมูลแล้ว
//   //   }
//   // };


//   const clearAllElements = () => {
//     mapElements.forEach(({ marker, circleId, map }) => {
//       // ลบ marker
//       marker.remove();
  
//       // ลบ outline layer ก่อน (ถ้ามี)
//       if (map.getLayer(circleId + "-outline")) {
//         map.removeLayer(circleId + "-outline");
//       }
//       // ลบ fill layer
//       if (map.getLayer(circleId)) {
//         map.removeLayer(circleId);
//       }
//       // ลบ source
//       if (map.getSource(circleId)) {
//         map.removeSource(circleId);
//       }
//     });
    
//     // รีเซ็ต marker counter (หรือใช้ useRef ตามที่แนะนำ)
//     markerCounterRef.current = 1;
  
//     // อัปเดต state และแจ้ง Parent Component
//     setMapElements([]);
//     if (typeof onMapElementsUpdate === "function") {
//       props.onMapElementsUpdate([]);
//     }
//   };
  





//   useEffect(() => {
//     if (!mapCenter || (mapCenter[0] === 0 && mapCenter[1] === 0)) return;

//     const map = initializeMap(mapCenter);
//     mapRef.current = map;

//     // map.on("click", (event) => {
//     //   if (AddCircleClickRef.current) {
//     //     onMapClick(event, map, 0.5);
//     //   }
//     // });

//     map.on("click", (event) => {
//       if (AddCircleClickRef.current) {
//         // ใช้ค่า radius จาก prop radiusValues สำหรับ marker ใหม่
//         const currentRadius = (radiusValues && radiusValues.length > 0)
//           ? radiusValues[radiusValues.length - 1]
//           : 0.5;
//         onMapClick(event, map, currentRadius);
//       }
//     });



//     map.on('style.load', () => {
//       map.setProjection('globe');
//     });
    







//     if (markers.length > 0) {
//       addMarkersToMap(map, markers);
//     }

//     return () => map.remove();
//   }, [mapCenter, markers]);

//   // MAP END *************************************************************************************************  


//   const [routes, setRoutes] = useState([]); // เก็บข้อมูล routes
//   const [routeColors, setRouteColors] = useState([]);

//   useEffect(() => {
//     console.log("Updated routeColors:", routeColors);
//   }, [routeColors]); 
  



//   const handleSubmit = async (num_bus, max_stops, max_time, type, findBy, trip_id, roteImport) => {
//     const locations = markers.map((marker) => [parseFloat(marker.latitude), parseFloat(marker.longitude)]);
//     const data = {
//       depot: [parseFloat(depotLat), parseFloat(depotLng)],
//       num_vehicles: num_bus,
//       max_stops_per_vehicle: max_stops,
//       max_travel_time: max_time * 60, // แปลงเวลาเป็นวินาที
//       locations: locations,
//     };

//     // รีเซ็ตสถานะ
//     setRouteColors([]);
//     setRoutes([]);
//     resetRoute(mapRef.current);

//     setIsLoading(true); // เริ่มโหลด

//     try {

//       let result = []
//       let colors = []

//       // เรียก fetchRoutes เพื่อคำนวณเส้นทาง
//       if(findBy === "home"){
//         result = await fetchRoutes(idToken, mapRef.current, data);
//         // setRoutes(result);
//         console.log("route ที่ได้ "+ result);
       
//         colors = result.map(() => getRandomHexColor());
//         // setRouteColors(colors);
//       }else if(findBy === "his"){
//         result = await fetchRouteByTripId(idToken, trip_id);

//         console.log("HIS "+ result);

//         // colors = result.map(() => getRandomHexColor());
//         colors = result.map(route => route.color);
//         console.log("this color"+colors);
        
//       }else if(findBy === "import"){
//         result = roteImport;

//         console.log("import "+ result);
        
    
//         colors = result.map(route => route.color);
//         console.log("this color"+colors);
        
//       }else {

//       }
      

//       const distance = [];
//       const duration = [];

//       // Create an array of Promises
//       const drawPromises = result.map(async (route, index) => {
//         const routeKey = `route ${index + 1}`;
//         const coordinates = route[routeKey];

//         console.log("routeKey in MAP :" + routeKey);

//         if (coordinates) {
//           try {
//             const didu = await drawRoute(mapRef.current, coordinates, routeKey, colors[index], type);
//             distance.push(didu.distance); // Push distance when resolved
//             duration.push(didu.duration); // Push duration when resolved
//             return didu;
//           } catch (error) {
//             console.error("Error drawing route:", error);
//           }
//         }
//         return null;
//       });

//       // Wait for all Promises to complete
//       const diduArray = await Promise.all(drawPromises);


//       console.log("this route Befor send: "+ result);
      

//       return { routes: result, routeColors: colors, routeDistance: distance, routeDuration: duration, Didu: JSON.stringify(diduArray, null, 2) };

//     } catch (error) {
//       console.error("Error drawing routes:", error);
//       throw error; // ส่งข้อผิดพลาดออกไป
//     } finally {
//       setIsLoading(false); // สิ้นสุดการโหลด
//     }
//   };


//   const handleReset = () => {
//     setRouteColors([]); // รีเซ็ตสีทั้งหมด
//     setRoutes([]); // รีเซ็ตเส้นทางทั้งหมด
//     resetRoute(mapRef.current); // ลบเส้นทางบนแผนที่ (ถ้ามีฟังก์ชัน resetRoute)
//   };



//   // time count
//   const [elapsedTime, setElapsedTime] = useState(0); // เก็บเวลาที่ผ่านไป

//   useEffect(() => {
//     let timer;
//     if (isLoading) {
//       setElapsedTime(0); // รีเซ็ตเวลาเมื่อเริ่มโหลด
//       timer = setInterval(() => {
//         setElapsedTime((prev) => prev + 1); // เพิ่มเวลาทีละ 1 วินาที
//       }, 1000);
//     } else {
//       clearInterval(timer); // หยุดการนับเมื่อโหลดเสร็จ
//     }
//     return () => clearInterval(timer); // ล้าง timer เมื่อ component ถูก unmount
//   }, [isLoading]);



//   const handleDrawRoute = async (route, routeKey, routeColor, type) => {
//     const coordinates = route[routeKey];
//     if (coordinates) {
//       const result = await drawRoute(mapRef.current, coordinates, routeKey, routeColor, type); // แสดงลำดับหมุด
//       // console.log(".....> "+result);
//       return result;
//     }
//   };
//   // -------------------------------------------------------------------------
//   return (
//     <div className="h-screen w-full">
//       {/* Map Container */}
//       <div ref={mapContainerRef} className="w-full h-full "/>
//       <p className="absolute bottom-4 right-4 text-gray-600">
//         {AddCircleClick ? "Choose a location ... " : " "}
//       </p>


//       {/* <ul className="absolute right-0 bottom-0">
//         {mapElements.map((el, idx) => (
//           <li key={el.circleId}>
//             Marker {idx + 1}: Longitude: {el.lng.toFixed(8)}, Latitude: {el.lat.toFixed(8)}
//           </li>
//         ))}
//       </ul> */}

//       <div className="absolute right-0 bottom-0  bg-red-200">
   

//         {/* {mapElements.map((el, idx) => (
//           <div key={el.circleId} className="m-3">
//             <h3 className="font-black">
//               Circle {idx + 1} ({el.students.length} students)
//             </h3>
//             <ul>
//               {el.students.length > 0 ? (
//                 el.students.map((student) => (
//                   <li key={student.id}>
//                     {student.student_id} {student.first_name} {student.last_name}
//                   </li>
//                 ))
//               ) : (
//                 <li>No students in this circle</li>
//               )}
//             </ul>
//             <hr
//               style={{
//                 borderColor: "black",
//                 borderWidth: "1px",
//                 marginBottom: "10px",
//               }}
//             />
//           </div>
//         ))} */}


        
//       <div className="absolute right-3 bottom-3">
//         <button className="bg-green-400 w-[200px] p-3 rounded-md">
//           Find Bus to School Auto
//         </button>

//       </div>



//       </div>


//     </div>
//   );
// });

// export default Map;









import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";


import { drawRoute, fetchMarkers, resetRoute } from "../services/mapboxService";
import { fetchMapCenter } from "../services/schoolService";
import { subscribeAuthState } from "../services/authService";
import { fetchRoutes, fetchRouteByTripId, getRandomHexColor } from "../services/routeService";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Map = forwardRef((props, ref) => {

  const { radiusValues } = props; // รับค่าจาก Sidebar

  console.log(">> Radius: " + radiusValues);


  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token


  const [markers, setMarkers] = useState([]); // State สำหรับเก็บข้อมูลหมุดจาก API
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(false); // สถานะโหลด

  const [depotLat, setDepotLat] = useState();
  const [depotLng, setDepotLng] = useState();



  const refetchData = async () => {
    console.log("map data...");

    try {
        if (idToken) {
            // 🔹 Fetch markers ใหม่
            const data = await fetchMarkers(idToken);
            setMarkers(data);

            // 🔹 Fetch center ของโรงเรียนใหม่
            const mark_center = await fetchMapCenter(idToken);
            setMapCenter(mark_center);
            setDepotLat(mark_center[1]);
            setDepotLng(mark_center[0]);

            // 🔹 รีเซ็ตแผนที่
            if (mapRef.current) {
                const map = initializeMap(mark_center);
                mapRef.current = map;

                // โหลดหมุดใหม่
                if (data.length > 0) {
                    addMarkersToMap(map, data);
                }
            }
            console.log("Map data refetched successfully.");
        }
    } catch (error) {
        console.error("Error refetching data:", error);
    } 
};

  // com อื่น ใช้ func ได้
  useImperativeHandle(ref, () => ({
    handleSubmit,
    handleReset,
    handleDrawRoute,
    handleAddCircleClick,
    clearAllElements,
    removeElement,
    updateCircleRadius,
    goMarkerById,
    refetchData,
    handleFindAuto,
  }));




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

          // ส่งข้อมูล markers กลับไปยัง Parent Component
          if (props.onMarkersUpdate && typeof props.onMarkersUpdate === 'function') {
            props.onMarkersUpdate(data);
          }

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


  // ฟังก์ชันสำหรับการสร้างแผนที่
  const initializeMap = (mapCenter) => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: mapCenter,
      zoom: 12,
      attributionControl: false,
      dragPan: true,
      scrollZoom: true,
      boxZoom: false,
      dragRotate: false,
    });

    if (mapCenter[0] !== 0 && mapCenter[1] !== 0) {
      new mapboxgl.Marker({ color: "black" }).setLngLat(mapCenter).addTo(map);
    }

    return map;
  };



  
const markersRef = useRef({}); // Use useRef to persist markers across renders

function addMarkersToMap(map, markers) {
  const existingMarkers = document.querySelectorAll('.custom-marker');
  existingMarkers.forEach((marker) => marker.remove());

  markers.forEach(({ id, latitude, longitude, first_name, last_name, age, gender, address, status }) => {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.width = '8px';
    el.style.height = '8px';
    el.style.backgroundColor = '#07A1E8';
    el.style.borderRadius = '50%';
    el.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([parseFloat(longitude), parseFloat(latitude)])
      .setPopup(
        new mapboxgl.Popup({ closeButton: false })
          .setHTML(
            `<div style="max-width: 250px; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; white-space: normal;">
            <h1 style="font-size: 15px"><strong>${first_name} ${last_name}</strong></h1>
            <p><strong>Age:</strong> ${age}</p>
            <p><strong>Gender:</strong> ${gender}</p>
            <p><strong>Address:</strong> ${address}</p>
          </div>`
          )
          .setOffset([0, -10]) // Adjust this value to move the popup higher or lower
      )
      .addTo(map);

    markersRef.current[id] = marker; // Use useRef to persist the markers


    el.addEventListener('click', () => {
      map.flyTo({
        center: [parseFloat(longitude), parseFloat(latitude)],
        zoom: 17,
        speed: 1.5,
        curve: 1.5,
        easing(t) {
          return t;
        },
      });
      marker.togglePopup();
    });
  });
}

const goMarkerById = (id) => {
  // Access markersRef correctly
  const marker = markersRef.current[id];
  if (marker) {
    // Close any open popups first
    const allPopups = document.querySelectorAll('.mapboxgl-popup'); // Get all popups
    allPopups.forEach(popup => popup.remove()); // Remove all open popups

    // Fly to the marker
    mapRef.current.flyTo({
      center: marker.getLngLat(), // Ensure map is centered at the marker position
      zoom: 17,
      speed: 1.5,
      curve: 1.5,
      easing(t) {
        return t;
      },
    });

    // Show the popup associated with the marker
    marker.getPopup().addTo(mapRef.current); // Directly add the popup to the map
  } else {
    console.warn(`Marker with id ${id} not found.`);
  }
};


  // ------------------------pin รัศมี--------------------------------------------


  const AddCircleClickRef = useRef(false);
  const [AddCircleClick, setAddCircleClick] = useState(false);

  const [mapElements, setMapElements] = useState([]); // เก็บข้อมูลหมุดและวงกลมทั้งหมด


  // use, stably

  const handleAddCircleClick = () => {
    return new Promise((resolve) => {
      setAddCircleClick((prev) => !prev); // สลับค่าระหว่าง true และ false

      if (mapRef.current) {
        mapRef.current.on('click', async (event) => {
          const { lng, lat } = event.lngLat;
          resolve({ lng, lat }); // ส่งค่าพิกัดกลับหลังจากคลิก
        });
      }
    });
  };



  useEffect(() => {
    AddCircleClickRef.current = AddCircleClick;
  }, [AddCircleClick]);

  const drawCircle = (center, radius, map, circleId) => {
    const points = 64;
    const coordinates = [];
    const distanceX = radius / (111.32 * Math.cos((center[1] * Math.PI) / 180));
    const distanceY = radius / 110.574;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);
      coordinates.push([center[0] + x, center[1] + y]);
    }
    coordinates.push(coordinates[0]);

    const circleGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinates],
          },
        },
      ],
    };

    if (map.getSource(circleId)) {
      map.getSource(circleId).setData(circleGeoJSON);
    } else {
      map.addSource(circleId, {
        type: "geojson",
        data: circleGeoJSON,
      });

      map.addLayer({
        id: circleId,
        type: "fill",
        source: circleId,
        layout: {},
        paint: {
          "fill-color": "rgba(152, 245, 249, 0.5)",
          "fill-opacity": 0.5,
        },
      });

      map.addLayer({
        id: circleId + "-outline",
        type: "line",
        source: circleId,
        layout: {},
        paint: {
          "line-color": "rgba(rgb(152, 245, 249, 1)",
          "line-width": 2  // ปรับความหนาของเส้นขอบตามที่ต้องการ (เช่น 2 พิกเซล)
        },
      });
    }
  };

// ฟังก์ชันคำนวณระยะทางระหว่างจุดสองจุด (หน่วย: กิโลเมตร)
// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // รัศมีโลก (km)
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // รัศมีโลกเป็นกิโลเมตร
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


// ฟังก์ชันเช็คว่านักเรียนอยู่ในวงกลมหรือไม่
const checkIfStudentInCircle = (studentLat, studentLng, circleLat, circleLng, radius) => {
  const distance = calculateDistance(studentLat, studentLng, circleLat, circleLng);
  return distance <= radius;
};

// ฟังก์ชันสำหรับอัปเดตการจัดสรรนักเรียนให้กับหมุดทั้งหมดใหม่
// โดยให้นักเรียนแต่ละคนอยู่ในหมุดที่ใกล้ที่สุด (เฉพาะหมุดที่วงกลมครอบคลุมนักเรียน)
const updateStudentAssignments = (circles, markers) => {
  // รีเซ็ตข้อมูลนักเรียนในแต่ละหมุดก่อน
  const newCircles = circles.map(circle => ({ ...circle, students: [] }));
  
  // วนลูปตรวจสอบนักเรียนแต่ละคน
  markers.forEach(student => {
    let nearestCircle = null;
    let minDistance = Infinity;
    newCircles.forEach(circle => {
      // ตรวจสอบว่านักเรียนอยู่ในวงกลมของหมุดนี้หรือไม่
      if (checkIfStudentInCircle(student.latitude, student.longitude, circle.lat, circle.lng, circle.radius)) {
        const distance = calculateDistance(student.latitude, student.longitude, circle.lat, circle.lng);
        if (distance < minDistance) {
          minDistance = distance;
          nearestCircle = circle;
        }
      }
    });
    // หากพบหมุดที่นักเรียนอยู่ในวงและใกล้ที่สุด ให้นำนักเรียนไปเก็บในหมุดนั้น
    if (nearestCircle) {
      nearestCircle.students.push(student);
    }
  });
  
  return newCircles;
};


// กำหนดตัวแปร global สำหรับนับ marker
const markerCounterRef = useRef(1);



const onMapClick = (event, map, radius) => {
  const { lng, lat } = event.lngLat;
  const circleId = `circle-${lng}-${lat}`;

  // สร้าง element สำหรับ marker แบบ custom พร้อมแสดงหมายเลข
  const markerEl = document.createElement("div");
  markerEl.className = "custom-marker";
  markerEl.textContent = markerCounterRef.current; // ใช้ markerCounterRef.current แสดงหมายเลข
  markerCounterRef.current++; // เพิ่มค่าตัวนับ
  // กำหนดสไตล์ให้กับ marker element
  markerEl.style.backgroundColor = "yellow";
  markerEl.style.color = "black";
  markerEl.style.borderRadius = "50%";
  markerEl.style.width = "15px";
  markerEl.style.height = "15px";
  markerEl.style.display = "flex";
  markerEl.style.alignItems = "center";
  markerEl.style.justifyContent = "center";
  markerEl.style.fontWeight = "bold";

  // ตั้งค่า data attribute เพื่อเก็บค่า radius ปัจจุบัน
  markerEl.dataset.radius = radius;

  // สร้าง marker ด้วย element ที่กำหนดเองและให้สามารถลากได้
  const marker = new mapboxgl.Marker({ element: markerEl, draggable: true })
    .setLngLat([lng, lat])
    .addTo(map);

  // วาดวงกลมบนแผนที่ด้วยค่า radius ที่ส่งเข้ามา
  drawCircle([lng, lat], radius, map, circleId);

  // สร้างวัตถุใหม่สำหรับหมุด (circle)
  const newCircle = { marker, circleId, map, lng, lat, radius, students: [] };

  // เพิ่มหมุดใหม่ลงใน state แล้วรีคำนวณการจัดสรรนักเรียน
  setMapElements((prev) => {
    const updatedCircles = [...prev, newCircle];
    return updateStudentAssignments(updatedCircles, markers);
  });

  // เมื่อ marker ถูกลาก (dragend)
  marker.on("dragend", () => {
    const newLngLat = marker.getLngLat();
    // อ่านค่า radius ปัจจุบันจาก marker element
    const currentRadius = parseFloat(marker.getElement().dataset.radius);

    // วาดวงกลมใหม่ในตำแหน่งที่ลาก โดยใช้ currentRadius
    drawCircle([newLngLat.lng, newLngLat.lat], currentRadius, map, circleId);

    // อัปเดต state ของหมุดด้วยตำแหน่งใหม่และค่า radius ปัจจุบัน
    setMapElements((prev) => {
      const updatedCircles = prev.map((el) =>
        el.circleId === circleId
          ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat, radius: currentRadius }
          : el
      );
      // รีคำนวณการจัดสรรนักเรียนใหม่ในทุกหมุด
      return updateStudentAssignments(updatedCircles, markers);
    });
  });

  // ปิดการเพิ่มหมุดใหม่ (ถ้าต้องการ)
  setAddCircleClick(false);
};

// ----------------------------------------------------------------------------------------

  // ใช้ useEffect เพื่อส่งข้อมูลไปที่ Parent Component เมื่อ mapElements เปลี่ยนแปลง
  useEffect(() => {
    if (typeof props.onMapElementsUpdate === "function") {
      props.onMapElementsUpdate(mapElements);
    }
  }, [mapElements, props.onMapElementsUpdate]); // อัปเดตเมื่อ mapElements เปลี่ยนแปล


//good
const updateCircleRadius = (idx, newRadius) => {
  console.log("Updating circle radius for index", idx, "to", newRadius);

  const element = mapElements[idx];
  if (element) {
    const { circleId, map, lng, lat, marker } = element;
    // วาดวงกลมใหม่ด้วยค่า newRadius
    drawCircle([lng, lat], newRadius, map, circleId);
    // อัปเดตค่า data attribute ใน marker ให้เป็น newRadius
    marker.getElement().dataset.radius = newRadius;
    // คำนวณนักเรียนที่อยู่ในวงกลมนี้ โดยใช้ newRadius
    const updatedStudents = markers.filter(student =>
      checkIfStudentInCircle(student.latitude, student.longitude, lat, lng, newRadius)
    );
    // อัปเดต state ของ mapElements
    setMapElements((prev) => {
      // อัปเดตเฉพาะ element ที่ index ตรงกัน
      const updatedCircles = prev.map((el, i) =>
        i === idx ? { ...el, radius: newRadius, students: updatedStudents } : el
      );
      // รีคำนวณการจัดสรรนักเรียนในทุกหมุด
      return updateStudentAssignments(updatedCircles, markers);
    });
  }
};


const removeElement = (idx) => {
  const element = mapElements[idx]; // ค้นหา element ตาม index
  if (!element) return;

  const { marker, circleId, map } = element;

  // ลบ marker
  marker.remove();

  // ลบ outline layer (ถ้ามี)
  if (map.getLayer(circleId + "-outline")) {
    map.removeLayer(circleId + "-outline");
  }
  // ลบ fill layer
  if (map.getLayer(circleId)) {
    map.removeLayer(circleId);
  }
  // รอจนกว่า map จะ idle แล้วลบ source
  map.once("idle", () => {
    if (map.getSource(circleId)) {
      map.removeSource(circleId);
    }
  });

  // ลบ element ที่ index ที่เลือกออกจาก state
  const newElements = mapElements.filter((_, i) => i !== idx);
  
  // อัปเดตการจัดสรรนักเรียนใหม่ในทุกหมุด โดยใช้ฟังก์ชัน updateStudentAssignments
  const updatedCircles = updateStudentAssignments(newElements, markers);

  // อัปเดตหมายเลข marker ใหม่ให้เรียงลำดับตามลำดับใน updatedCircles
  updatedCircles.forEach((el, index) => {
    el.marker.getElement().textContent = index + 1;
  });

  // รีเซ็ต markerCounterRef ให้ตรงกับจำนวน marker ที่เหลือ + 1
  markerCounterRef.current = updatedCircles.length + 1;

  // อัปเดต state mapElements ด้วยข้อมูลใหม่
  setMapElements(updatedCircles);

  // หากมี callback แจ้ง Parent Component ให้ส่งข้อมูลใหม่ไปด้วย
  if (typeof onMapElementsUpdate === "function") {
    props.onMapElementsUpdate(updatedCircles);
  }
};

  const clearAllElements = () => {
    mapElements.forEach(({ marker, circleId, map }) => {
      // ลบ marker
      marker.remove();
  
      // ลบ outline layer ก่อน (ถ้ามี)
      if (map.getLayer(circleId + "-outline")) {
        map.removeLayer(circleId + "-outline");
      }
      // ลบ fill layer
      if (map.getLayer(circleId)) {
        map.removeLayer(circleId);
      }
      // ลบ source
      if (map.getSource(circleId)) {
        map.removeSource(circleId);
      }
    });
    
    // รีเซ็ต marker counter (หรือใช้ useRef ตามที่แนะนำ)
    markerCounterRef.current = 1;
  
    // อัปเดต state และแจ้ง Parent Component
    setMapElements([]);
    if (typeof onMapElementsUpdate === "function") {
      props.onMapElementsUpdate([]);
    }
  };

  useEffect(() => {
    if (!mapCenter || (mapCenter[0] === 0 && mapCenter[1] === 0)) return;

    const map = initializeMap(mapCenter);
    mapRef.current = map;

    // map.on("click", (event) => {
    //   if (AddCircleClickRef.current) {
    //     onMapClick(event, map, 0.5);
    //   }
    // });

    map.on("click", (event) => {
      if (AddCircleClickRef.current) {
        // ใช้ค่า radius จาก prop radiusValues สำหรับ marker ใหม่
        const currentRadius = (radiusValues && radiusValues.length > 0)
          ? radiusValues[radiusValues.length - 1]
          : 0.5;
        onMapClick(event, map, currentRadius);
      }
    });



    map.on('style.load', () => {
      map.setProjection('globe');
    });
    


    if (markers.length > 0) {
      addMarkersToMap(map, markers);
    }

    return () => map.remove();
  }, [mapCenter, markers]);

  // MAP END *************************************************************************************************  


  const [routes, setRoutes] = useState([]); // เก็บข้อมูล routes
  const [routeColors, setRouteColors] = useState([]);

  useEffect(() => {
    console.log("Updated routeColors:", routeColors);
  }, [routeColors]); 
  



  const handleSubmit = async (num_bus, max_stops, max_time, type, findBy, trip_id, roteImport) => {
    const locations = markers.map((marker) => [parseFloat(marker.latitude), parseFloat(marker.longitude)]);
    const data = {
      depot: [parseFloat(depotLat), parseFloat(depotLng)],
      num_vehicles: num_bus,
      max_stops_per_vehicle: max_stops,
      max_travel_time: max_time * 60, // แปลงเวลาเป็นวินาที
      locations: locations,
    };

    // รีเซ็ตสถานะ
    setRouteColors([]);
    setRoutes([]);
    resetRoute(mapRef.current);

    setIsLoading(true); // เริ่มโหลด


    // console.log("FFFFFFFF  FFF "+JSON.stringify(data, null, 2));
    

    try {

      let result = []
      let bus_sp = []
      let colors = []
      let route_type

      // เรียก fetchRoutes เพื่อคำนวณเส้นทาง
      if(findBy === "home"){
        result = await fetchRoutes(idToken, mapRef.current, data);
        // setRoutes(result);
        // console.log("route ที่ได้ "+ JSON.stringify(result, null, 2));
        console.log("route ที่ได้ "+ result);
       
        route_type = "home"
        colors = result.map(() => getRandomHexColor());
        // setRouteColors(colors);

      } else if (findBy === "bus") {
        console.log("This: " + max_stops);
        const depot = [parseFloat(depotLat), parseFloat(depotLng)];
        const capacity = max_stops; // เช่น 5 คนต่อคัน
        // กำหนดระยะทาง threshold สำหรับรวมจุด (ปรับตามความเหมาะสม)
        const distanceThreshold = 2.5; // กิโลเมตร

        // 1. สร้าง pickup units จากแต่ละ bus stop
        // โครงสร้าง: { lat, lng, count, stopId, studentPositions }
        let pickupUnits = [];
        mapElements.forEach((stop) => {
          const count = stop.students.length;
          if (count > capacity) {
            const fullUnits = Math.floor(count / capacity);
            const remainder = count % capacity;
            for (let i = 0; i < fullUnits; i++) {
              pickupUnits.push({
                lat: stop.lat,
                lng: stop.lng,
                count: capacity,
                stopId: stop.circleId || stop.id,
                studentPositions: stop.students
                  .slice(i * capacity, (i + 1) * capacity)
                  .map((s) => [s.latitude, s.longitude]),
              });
            }
            if (remainder > 0) {
              pickupUnits.push({
                lat: stop.lat,
                lng: stop.lng,
                count: remainder,
                stopId: stop.circleId || stop.id,
                studentPositions: stop.students
                  .slice(fullUnits * capacity)
                  .map((s) => [s.latitude, s.longitude]),
              });
            }
          } else {
            pickupUnits.push({
              lat: stop.lat,
              lng: stop.lng,
              count: count,
              stopId: stop.circleId || stop.id,
              studentPositions: stop.students.map((s) => [s.latitude, s.longitude]),
            });
          }
        });
        // ตัวอย่าง: Bus Stop 1 (7 pax) → ได้ unit: {count: 5} และ {count: 2}
        //           Bus Stop 2 (3 pax) → ได้ unit: {count: 3}

        // 2. แยก pickupUnits เป็น fullUnits (ครบ capacity) และ remainderUnits (ไม่ครบ)
        const fullUnits = pickupUnits.filter((unit) => unit.count === capacity);
        let remainderUnits = pickupUnits.filter((unit) => unit.count < capacity);

        // 3. รวม remainderUnits ที่อยู่ใกล้กัน (ใช้ greedy approach)
        const calculateDistance = (lat1, lng1, lat2, lng2) => {
          const R = 6371; // กิโลเมตร
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLng = (lng2 - lng1) * Math.PI / 180;
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        let used = new Array(remainderUnits.length).fill(false);
        const combinedGroups = [];
        for (let i = 0; i < remainderUnits.length; i++) {
          if (used[i]) continue;
          let group = [remainderUnits[i]];
          let sum = remainderUnits[i].count;
          let combinedStudentPositions = [...remainderUnits[i].studentPositions];
          used[i] = true;
          for (let j = i + 1; j < remainderUnits.length; j++) {
            if (used[j]) continue;
            const d = calculateDistance(
              remainderUnits[i].lat,
              remainderUnits[i].lng,
              remainderUnits[j].lat,
              remainderUnits[j].lng
            );
            if (d <= distanceThreshold && sum + remainderUnits[j].count <= capacity) {
              group.push(remainderUnits[j]);
              sum += remainderUnits[j].count;
              combinedStudentPositions = combinedStudentPositions.concat(
                remainderUnits[j].studentPositions
              );
              used[j] = true;
              if (sum === capacity) break;
            }
          }
          combinedGroups.push({ group, total: sum, studentPositions: combinedStudentPositions });
        }

        // 4. สร้าง routes (trips) และเก็บตำแหน่งนักเรียน (busStudentPositions)
        let trips = [];
        let busStudentPositions = [];

        // สำหรับ fullUnits: แต่ละ unitสร้าง routeแบบ round-trip: depot -> [lat, lng] -> depot
        fullUnits.forEach((unit) => {
          trips.push({
            [`route ${trips.length + 1}`]: [
              depot,
              [unit.lat, unit.lng],
              depot,
            ],
          });
          busStudentPositions.push({
            [`bus ${busStudentPositions.length + 1}`]: unit.studentPositions,
          });
        });

        // สำหรับแต่ละกลุ่มใน combinedGroups: สร้าง routeโดยรวมทุก unitในกลุ่ม
        combinedGroups.forEach((item) => {
          const routeCoordinates = [
            depot,
            ...item.group.map((unit) => [unit.lat, unit.lng]),
            depot,
          ];
          trips.push({ [`route ${trips.length + 1}`]: routeCoordinates });
          busStudentPositions.push({
            [`bus ${busStudentPositions.length + 1}`]: item.studentPositions,
          });
        });

        const data = { trips, busStudentPositions };
        result = data.trips;
        bus_sp = data.busStudentPositions;
        // console.log("Routes: ", JSON.stringify(data.trips, null, 2));
        // console.log("Bus: ", JSON.stringify(data.busStudentPositions, null, 2));

        route_type = "bus"
        colors = result.map(() => getRandomHexColor());
        
      }
      else if(findBy === "his"){
        result = await fetchRouteByTripId(idToken, trip_id);

        console.log("HIS "+ result);

        // colors = result.map(() => getRandomHexColor());
        colors = result.map(route => route.color);
        console.log("this color"+colors);
        
      }else if(findBy === "import"){
        result = roteImport;

        console.log("import "+ result);
        
    
        colors = result.map(route => route.color);
        console.log("this color"+colors);
        
      }else {

      }
      

      const distance = [];
      const duration = [];

      // Create an array of Promises
      const drawPromises = result.map(async (route, index) => {
        const routeKey = `route ${index + 1}`;
        const coordinates = route[routeKey];

        console.log("routeKey in MAP :" + routeKey);

        if (coordinates) {
          try {
            const didu = await drawRoute(mapRef.current, coordinates, routeKey, colors[index], type);
            distance.push(didu.distance); // Push distance when resolved
            duration.push(didu.duration); // Push duration when resolved
            return didu;
          } catch (error) {
            console.error("Error drawing route:", error);
          }
        }
        return null;
      });

      // Wait for all Promises to complete
      const diduArray = await Promise.all(drawPromises);


      // console.log("this route Befor send: "+ result);
      // console.log("bus to school student: -> ", mapElements);

      const studentsPerCircle = mapElements.map(element => {
        return {
          students: element.students || [] 
        };
      });
      
      console.log("Students per circle:", studentsPerCircle);

      

      return { routes: result, routeColors: colors, routeDistance: distance, routeDuration: duration, Didu: JSON.stringify(diduArray, null, 2), route_type: route_type, bus_SP: bus_sp, student_inBus: studentsPerCircle };

    } catch (error) {
      console.error("Error drawing routes:", error);
      throw error; // ส่งข้อผิดพลาดออกไป
    } finally {
      setIsLoading(false); // สิ้นสุดการโหลด
    }
  };
  //-------------------------------------------------------------------------


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



  const handleDrawRoute = async (route, routeKey, routeColor, type) => {
    const coordinates = route[routeKey];
    if (coordinates) {
      const result = await drawRoute(mapRef.current, coordinates, routeKey, routeColor, type); // แสดงลำดับหมุด
      // console.log(".....> "+result);
      return result;
    }
  };





  

  // const calculateStudentClusters = (markers, maxCapacity, radius) => {
  //   const clusters = [];
    
  //   let remainingMarkers = [...markers];
  //   while (remainingMarkers.length > 0) {
  //     const center = [remainingMarkers[0].longitude, remainingMarkers[0].latitude];
  //     const cluster = {
  //       center,
  //       students: [],
  //     };
  
  //     remainingMarkers = remainingMarkers.filter((student) => {
  //       const distance = calculateDistance(student.latitude, student.longitude, center[1], center[0]);
  //       if (distance <= radius && cluster.students.length < maxCapacity) {
  //         cluster.students.push(student);
  //         return false; // Remove from remainingMarkers
  //       }
  //       return true;
  //     });
  
  //     clusters.push(cluster);
  //   }
  
  //   return clusters;
  // };
  



  // const drawCircleWithColor = (center, radius, map, circleId, color) => {
  //   const points = 64;
  //   const coordinates = [];
  //   const distanceX = radius / (111.32 * Math.cos((center[1] * Math.PI) / 180));
  //   const distanceY = radius / 110.574;
  
  //   for (let i = 0; i < points; i++) {
  //     const theta = (i / points) * (2 * Math.PI);
  //     const x = distanceX * Math.cos(theta);
  //     const y = distanceY * Math.sin(theta);
  //     coordinates.push([center[0] + x, center[1] + y]);
  //   }
  //   coordinates.push(coordinates[0]);
  
  //   const circleGeoJSON = {
  //     type: "FeatureCollection",
  //     features: [
  //       {
  //         type: "Feature",
  //         geometry: {
  //           type: "Polygon",
  //           coordinates: [coordinates],
  //         },
  //       },
  //     ],
  //   };
  
  //   if (map.getSource(circleId)) {
  //     map.getSource(circleId).setData(circleGeoJSON);
  //   } else {
  //     map.addSource(circleId, {
  //       type: "geojson",
  //       data: circleGeoJSON,
  //     });
  
  //     map.addLayer({
  //       id: circleId,
  //       type: "fill",
  //       source: circleId,
  //       layout: {},
  //       paint: {
  //         "fill-color": color,
  //         "fill-opacity": 0.4,
  //       },
  //     });
  
  //     map.addLayer({
  //       id: circleId + "-outline",
  //       type: "line",
  //       source: circleId,
  //       layout: {},
  //       paint: {
  //         "line-color": color,
  //         "line-width": 2,
  //       },
  //     });
  //   }
  // };




  // const getRandomHexColor = () => {
  //   let color = Math.floor(Math.random() * 16777215).toString(16);
  //   return `#${color.padStart(6, "0")}`; // เติม 0 ด้านหน้าให้ครบ 6 หลัก
  // };


  // ประกาศ findCoverageCircles ก่อนใช้งาน
// const findCoverageCircles = (studentPositions, radius = 1) => {
//   let uncovered = [...studentPositions]; // clone อาร์เรย์ของตำแหน่งนักเรียน
//   let centers = [];
//   while (uncovered.length > 0) {
//     // เลือกตำแหน่งตัวแรกใน uncovered เป็นศูนย์กลางของวงกลม
//     const center = uncovered[0];
//     centers.push(center);
//     // ลบนักเรียนทั้งหมดที่อยู่ภายในรัศมี 1 กม. จาก center
//     uncovered = uncovered.filter(pos => calculateDistance(center[0], center[1], pos[0], pos[1]) > radius);
//   }
//   return centers;
// };

  

//   useEffect(() => {
//     const fetchAndSetMarkers = async () => {
//       try {
//         if (idToken) {
//           const data = await fetchMarkers(idToken);
//           setMarkers(data);
//           setMapElements(data); // ถ้าข้อมูลที่ได้มีโครงสร้างตรงกับ mapElements ที่ต้องการ
//         }
//       } catch (error) {
//         console.error("Error fetching marker data: ", error);
//       }
//     };
//     fetchAndSetMarkers();
//   }, [idToken]);
  

//   mapElements.forEach((stop) => {
//     if (stop.students && stop.students.length > 0) {
//       stop.students.forEach((student) => {
//         allStudentPositions.push([parseFloat(student.latitude), parseFloat(student.longitude)]);
//       });
//     }
//   });
  



//   const handleFindAuto = () => {
//     console.log("Find Auto button clicked");
//     console.log("mapElements:", mapElements);
    
//     let allStudentPositions = [];
//     mapElements.forEach((student) => {
//       if ((student.latitude || student.lat) && (student.longitude || student.lng)) {
//         allStudentPositions.push([
//           parseFloat(student.latitude || student.lat),
//           parseFloat(student.longitude || student.lng)
//         ]);
//       }
//     });
//     console.log("Total student positions:", allStudentPositions.length);
    
//     if (allStudentPositions.length === 0) {
//       console.log("No student positions found!");
//       return;
//     }
    
//     const centers = findCoverageCircles(allStudentPositions, 1);
//     console.log("Calculated auto marker stops:", centers);
    
//     centers.forEach((center, idx) => {
//       const circleId = `auto-circle-${idx + 1}`;
//       drawCircle([center[1], center[0]], 1, mapRef.current, circleId);
      
//       const markerEl = document.createElement("div");
//       markerEl.className = "auto-marker";
//       markerEl.textContent = idx + 1;
//       markerEl.style.backgroundColor = "red";
//       markerEl.style.color = "white";
//       markerEl.style.borderRadius = "50%";
//       markerEl.style.width = "20px";
//       markerEl.style.height = "20px";
//       markerEl.style.display = "flex";
//       markerEl.style.alignItems = "center";
//       markerEl.style.justifyContent = "center";
      
//       new mapboxgl.Marker({ element: markerEl })
//         .setLngLat([center[1], center[0]])
//         .addTo(mapRef.current);
//     });
//   };
  




// ฟังก์ชันหาจุดศูนย์กลางเพื่อครอบคลุมนักเรียนด้วยวงกลมรัศมี 1 กม. แบบ Greedy
// const findCoverageCircles = (studentPositions, radius = 1) => {
//   let uncovered = [...studentPositions]; // clone รายการนักเรียน
//   let centers = [];
//   while (uncovered.length > 0) {
//     const center = uncovered[0]; // เลือกนักเรียนตัวแรกที่ยังไม่ได้ถูกครอบคลุม
//     centers.push(center);
//     // ลบนักเรียนที่อยู่ภายในรัศมี 1 กม. จาก center
//     uncovered = uncovered.filter(
//       pos => calculateDistance(center[0], center[1], pos[0], pos[1]) > radius
//     );
//   }
//   return centers;
// };

// ฟังก์ชัน handleFindAuto เมื่อกดปุ่ม "Find Auto"
// ฟังก์ชันหาจุดครอบคลุมนักเรียนด้วยวงกลม 1 กม. แบบ Greedy
const findCoverageCircles = (studentPositions, radius = 1) => {
  let uncovered = [...studentPositions]; // clone array
  let centers = [];
  while (uncovered.length > 0) {
    const center = uncovered[0]; // เลือกนักเรียนตัวแรกที่ยังไม่ได้ถูกครอบคลุม
    centers.push(center);
    // ลบนักเรียนที่อยู่ภายในรัศมี 1 กม. จาก center
    uncovered = uncovered.filter(pos => calculateDistance(center[0], center[1], pos[0], pos[1]) > radius);
  }
  return centers;
};

// ฟังก์ชัน handleFindAuto สำหรับปุ่ม "Find Auto"
const handleFindAuto = () => {
  console.log("Find Auto button clicked");
  // 1. รวบรวมตำแหน่งนักเรียนจาก markers (หรือ mapElements ถ้าเก็บนักเรียนไว้ในนั้น)
  let allStudentPositions = [];
  markers.forEach((student) => {
    if ((student.latitude || student.lat) && (student.longitude || student.lng)) {
      allStudentPositions.push([
        parseFloat(student.latitude || student.lat),
        parseFloat(student.longitude || student.lng)
      ]);
    }
  });
  console.log("Total student positions:", allStudentPositions.length);
  
  if (allStudentPositions.length === 0) {
    console.log("No student positions found!");
    return;
  }
  
  // 2. คำนวณหาจุดครอบคลุมนักเรียนด้วยวงกลม 1 กม.
  const centers = findCoverageCircles(allStudentPositions, 1);
  console.log("Calculated auto marker stops:", centers);
  
  // 3. สร้าง auto circles จาก centers (สร้าง auto stop object คล้ายกับการปักหมุดแบบ manual)
  const autoCircles = centers.map((center, idx) => {
    const circleId = `auto-circle-${idx + 1}`;
    // วาดวงกลมที่จุดนี้ โดยพิกัดสำหรับ Mapbox คือ [lng, lat]
    drawCircle([center[1], center[0]], 1, mapRef.current, circleId);
    
    // สร้าง marker element แบบ custom
    const markerEl = document.createElement("div");
    markerEl.className = "auto-marker";
    markerEl.textContent = idx + 1;
    markerEl.style.backgroundColor = "red";
    markerEl.style.color = "white";
    markerEl.style.borderRadius = "50%";
    markerEl.style.width = "20px";
    markerEl.style.height = "20px";
    markerEl.style.display = "flex";
    markerEl.style.alignItems = "center";
    markerEl.style.justifyContent = "center";
    
    const newMarker = new mapboxgl.Marker({ element: markerEl })
      .setLngLat([center[1], center[0]])
      .addTo(mapRef.current);
      
    return {
      marker: newMarker,
      circleId,
      map: mapRef.current,
      lng: center[1],
      lat: center[0],
      radius: 1,
      students: [] // จะถูก update จาก updateStudentAssignments
    };
  });
  
  // 4. อัปเดตการจัดสรรนักเรียนสำหรับ auto circlesโดยใช้ updateStudentAssignments
  const updatedAutoCircles = updateStudentAssignments(autoCircles, markers);
  
  // 5. อัปเดต state mapElements และส่งค่ากลับไปยัง Parent Component (Bus To School)
  setMapElements(updatedAutoCircles);
  if (typeof props.onMapElementsUpdate === "function") {
    props.onMapElementsUpdate(updatedAutoCircles);
  }
};

  
  


  


  // -------------------------------------------------------------------------
  return (
    <div className="h-screen w-full">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full "/>
      <p className="absolute bottom-4 right-4 text-gray-600">
        {AddCircleClick ? "Choose a location ... " : " "}
      </p>

      <div className="absolute right-0 bottom-0  bg-red-200">
   
        
      {/* <div className="absolute right-3 bottom-3">
        <button onClick={handleFindAuto} className="bg-green-400 w-[200px] p-3 rounded-md">
          Find Auto
        </button>
      </div> */}


{/* <button
  className="bg-green-400 w-[200px] p-3 rounded-md"
  onClick={async () => {
    const maxCapacity = 24; // จำนวนสูงสุดของนักเรียนต่อโซน
    const radius = 0.5; // รัศมีของแต่ละโซน (กิโลเมตร)

    try {
      // คำนวณการแบ่งกลุ่มนักเรียนให้แต่ละกลุ่มไม่เกิน maxCapacity
      const clusters = await calculateStudentClusters(markers, maxCapacity, radius);

      clusters.forEach((cluster, index) => {
        const { center, students } = cluster;
        const circleId = `auto-zone-${index + 1}`;
        const color = getRandomHexColor(); // สุ่มสีสำหรับแต่ละโซน

        // วาดวงกลม (โซน) บนแผนที่ด้วยสีเฉพาะ
        drawCircleWithColor(center, radius, mapRef.current, circleId, color);

        // แสดงนักเรียนในโซนด้วย Marker สีเดียวกัน
        students.forEach(({ id, latitude, longitude }) => {
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.width = '10px';
          el.style.height = '10px';
          el.style.backgroundColor = color;
          el.style.borderRadius = '50%';
          el.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';

          new mapboxgl.Marker({ element: el })
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);
        });
      });

      console.log("Bus stop zones with colored markers created successfully:", clusters);
    } catch (error) {
      console.error("Error creating bus stop zones:", error);
    }
  }}
>
  Find Bus to School Auto
</button> */}




         {/* {mapElements.map((el, idx) => (
           <div key={el.circleId} className="m-3">
             <h3 className="font-black">
               Circle {idx + 1} ({el.students.length} students)
             </h3>
             <ul>
               {el.students.length > 0 ? (
                 el.students.map((student) => (
                   <li key={student.id}>
                     {student.student_id} {student.first_name} {student.last_name}
                   </li>
                 ))
               ) : (
                 <li>No students in this circle</li>
               )}
             </ul>
             <hr
               style={{
                 borderColor: "black",
                 borderWidth: "1px",
                 marginBottom: "10px",
               }}
             />
           </div>
         ))} */}

      </div>


    </div>
  );
});

export default Map;