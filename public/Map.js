import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
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

  const [selectedStyle, setSelectedStyle] = useState("mapbox://styles/mapbox/light-v10");
  const [markers, setMarkers] = useState([]); // State สำหรับเก็บข้อมูลหมุดจาก API
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(false); // สถานะโหลด

  const [depotLat, setDepotLat] = useState();
  const [depotLng, setDepotLng] = useState();
  // const [numVehicles, setNumVehicles] = useState(10);
  // const [maxStopsPerVehicle, setMaxStopsPerVehicle] = useState(20);
  // const [maxTravelTime, setMaxTravelTime] = useState(150);

  // const [disdu, setdisdu] = useState([]);

  const [radiusN, setRadiusN] = useState(1); // สำหรับเก็บค่า radius ของวงกลม


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
  }));


  // const styles = [
  //   { name: "Streets", value: "mapbox://styles/mapbox/streets-v11" },
  //   { name: "Dark", value: "mapbox://styles/mapbox/dark-v10" },
  //   { name: "Satellite Streets", value: "mapbox://styles/mapbox/satellite-streets-v11" },
  //   { name: "Light", value: "mapbox://styles/mapbox/light-v10" }
  // ];


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




  // MAP *************************************************************************************************



  // useEffect(() => {

  //   // ตรวจสอบว่า mapCenter ถูกกำหนดค่าแล้ว
  //   if (!mapCenter || mapCenter[0] === 0 && mapCenter[1] === 0) {
  //     return; // หาก mapCenter ยังไม่มีค่า ให้หยุดการทำงาน
  //   }
  //   const map = new mapboxgl.Map({
  //     container: mapContainerRef.current,
  //     style: selectedStyle,
  //     center: mapCenter,
  //     zoom: 12,
  //     attributionControl: false,
  //     dragPan: true, // ให้เลื่อนแผนที่ได้
  //     scrollZoom: true, // ปิดการซูมด้วยการเลื่อนเมาส์
  //     boxZoom: false, // ปิดการซูมด้วยการเลือกกล่อง
  //     dragRotate: false, // ปิดการหมุนแผนที่
  //   });


  //   map.flyTo({
  //     center: mapCenter, // ตำแหน่งที่ต้องการเลื่อน
  //     zoom: 13, // ระดับซูมที่ต้องการ (ปรับตามความเหมาะสม)
  //     speed: 1.5, // ความเร็วในการซูม (ค่าเริ่มต้นคือ 1.2)
  //     curve: 0.3, // ระดับความนุ่มนวลของการเคลื่อนที่
  //   });

  //   // ตรวจสอบว่า mapCenter ไม่เป็น (0, 0) ก่อนที่จะเพิ่ม marker // ปักหมุดที่จุดศูนย์กลาง
  //   if (mapCenter[0] !== 0 && mapCenter[1] !== 0) {
  //     const centerMarker = new mapboxgl.Marker({ color: 'black' })
  //       .setLngLat(mapCenter)
  //       .addTo(map);
  //   }
  //   mapRef.current = map;

  //   // // เมื่อโหลดเสร็จ
  //   // map.on("load", () => {
  //   //   if (onMapLoaded) {
  //   //     onMapLoaded(); // เรียกฟังก์ชันที่ส่งเข้ามาจาก Parent
  //   //   }
  //   // });



  //       // เพิ่ม Geocoder   ค้นหา ----------------------------------------------------------------
  //       const geocoder = new MapboxGeocoder({
  //         accessToken: mapboxgl.accessToken,
  //         mapboxgl: mapboxgl,
  //         placeholder: "Search for places...", // ข้อความในช่องค้นหา
  //         // proximity: { longitude: 100.523186, latitude: 13.736717 }, // โฟกัสใกล้พิกัดเริ่มต้น
  //       });

  //       // // เพิ่ม Geocoder Control ในแผนที่
  //       map.addControl(geocoder);

  //       // Event เมื่อผู้ใช้เลือกสถานที่
  //       geocoder.on("result", (e) => {
  //         console.log("Selected place:", e.result);
  //         const [lng, lat] = e.result.center;
  //         new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map); // ปักหมุด
  //         map.flyTo({ center: [lng, lat], zoom: 14 }); // เลื่อนแผนที่ไปยังตำแหน่งที่เลือก
  //         console.log("---> +++ "+ lng, lat);
  //       });

  //   return () => map.remove(); // Cleanup เมื่อ component ถูกลบ
  // }, [mapCenter, selectedStyle]);







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

    // map.flyTo({
    //   center: mapCenter,
    //   zoom: 13,
    //   speed: 1.5,
    //   curve: 0.3,
    // });

    if (mapCenter[0] !== 0 && mapCenter[1] !== 0) {
      new mapboxgl.Marker({ color: "black" }).setLngLat(mapCenter).addTo(map);
    }

    return map;
  };

  //---------------------------------------------------

  // ฟังก์ชันสำหรับเพิ่ม Geocoder ลงในแผนที่
  // const addGeocoder = (map) => {
  //   const geocoder = new MapboxGeocoder({
  //     accessToken: mapboxgl.accessToken,
  //     mapboxgl: mapboxgl,
  //     placeholder: "Search for places...",
  //     flyTo: false, // ปิดการ zoom ไปยังตำแหน่งที่ค้นหา
  //   });

  //   map.addControl(geocoder);

  //   geocoder.on("result", (e) => {
  //     console.log("Selected place:", e.result);
  //     const [lng, lat] = e.result.center;
  //     new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
  //     // map.flyTo({ center: [lng, lat], zoom: 14 });
  //     console.log("---> +++", lng, lat);
  //   });
  // };



  //---------------------------------------------------

  // useEffect(() => {
  //   if (!mapCenter || (mapCenter[0] === 0 && mapCenter[1] === 0)) return;

  //   const map = initializeMap(mapCenter, selectedStyle);
  //   mapRef.current = map;

  //   // เพิ่ม Geocoder
  //   addGeocoder(map);

  //   return () => map.remove(); // Cleanup เมื่อ component ถูกลบ
  // }, [mapCenter, selectedStyle]);





  // หมุด (Markers) ลงในแผนที่ Mapbox
  2
  // useEffect(() => {
  //   if (mapRef.current && markers.length > 0) {
  //     // ลบหมุดเดิมก่อน เพื่อไม่ให้มีหมุดซ้ำ
  //     const existingMarkers = document.querySelectorAll('.custom-marker');
  //     existingMarkers.forEach((marker) => marker.remove());
  //     let currentPopup = null; 

  //     markers.forEach(({ latitude, longitude, first_name, last_name, age, gender, address, status }) => {
  //       const el = document.createElement('div');
  //       el.className = 'custom-marker';
  //       el.style.width = '8px'; // ขนาดจุด
  //       el.style.height = '8px';
  //       el.style.backgroundColor = '#07A1E8'; // สีของจุด
  //       // el.style.backgroundColor = status === 0 ? '#FFECA1' : '#58d68d'; // เปลี่ยนสีเป็นเทาถ้า status เป็น 0
  //       el.style.borderRadius = '50%'; // ทำให้เป็นวงกลม
  //       el.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)'; // เพิ่มเงาเล็กน้อย

  //       const marker = new mapboxgl.Marker({ element: el })
  //         .setLngLat([parseFloat(longitude), parseFloat(latitude)]) // แปลง latitude และ longitude เป็นตัวเลข
  //         .setPopup(
  //           new mapboxgl.Popup({ closeButton: false }).setHTML(
  //             `<div">
  //               <h3>${first_name} ${last_name}</h3>
  //               <p><strong>Age:</strong> ${age}</p>
  //               <p><strong>Gender:</strong> ${gender}</p>
  //               <p><strong>Address:</strong> ${address}</p>
  //             </div>`
  //           )
  //         )
  //         .addTo(mapRef.current);
  //     });

  //   }

  // }, [mapCenter, selectedStyle]);





// old-pin addr
//   function addMarkersToMap(map, markers) {
//     // ลบหมุดเดิมก่อน เพื่อไม่ให้มีหมุดซ้ำ
//     const existingMarkers = document.querySelectorAll('.custom-marker');
//     existingMarkers.forEach((marker) => marker.remove());

//     markers.forEach(({id, latitude, longitude, first_name, last_name, age, gender, address, status }) => {
//       const el = document.createElement('div');
//       el.className = 'custom-marker';
//       el.style.width = '8px';
//       el.style.height = '8px';
//       el.style.backgroundColor = '#07A1E8'; // สีของจุด
//       el.style.borderRadius = '50%';
//       el.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';

//       const marker = new mapboxgl.Marker({ element: el })
//         .setLngLat([parseFloat(longitude), parseFloat(latitude)])
//         .setPopup(
//           new mapboxgl.Popup({ closeButton: false }).setHTML(
//             `<div>
//               <h3>${first_name} ${last_name}</h3>
//               <p><strong>Age:</strong> ${id}</p>
//               <p><strong>Age:</strong> ${age}</p>
//               <p><strong>Gender:</strong> ${gender}</p>
//               <p><strong>Address:</strong> ${address}</p>
//             </div>`
//           )


//         )
//         .addTo(map);

//         el.addEventListener('click', () => {
//           mapRef.current.flyTo({
//             center: [parseFloat(longitude), parseFloat(latitude)],
//             zoom: 17,
//             speed: 1.5,
//             curve: 1.5,
//             easing(t) {
//               return t;
//             },
//           });
//         });
//     });
//   }


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
    // console.log('MarkersRef:', markersRef.current);

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










  // useEffect(() => {
  //   if (mapRef.current && markers.length > 0) {
  //     addMarkersToMap(mapRef.current, markers);
  //   }
  // }, [mapCenter, selectedStyle, markers]);



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
          "fill-color": "rgba(0, 218, 88, 0.3)",
          "fill-opacity": 0.5,
        },
      });
    }
  };






  // const onMapClick = (event, map) => {
  //   const { lng, lat } = event.lngLat;
  //   const circleId = `circle-${lng}-${lat}`;

  //   const marker = new mapboxgl.Marker({ color: "red", draggable: true })
  //     .setLngLat([lng, lat])
  //     .addTo(map);

  //   const radius = 0.7;
  //   drawCircle([lng, lat], radius, map, circleId);

  //   marker.on("dragend", () => {
  //     const newLngLat = marker.getLngLat();

  //     // วาดวงกลมใหม่ที่ตำแหน่งล่าสุด
  //     drawCircle([newLngLat.lng, newLngLat.lat], radius, map, circleId);

  //     // อัปเดตตำแหน่งของหมุดและวงกลมใน state
  //     setMapElements((prev) =>
  //       prev.map((el) =>
  //         el.circleId === circleId
  //           ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat }
  //           : el
  //       )
  //     );

  //     console.log("New Position: ----> ", newLngLat);
  //     // ส่งพิกัดที่อัปเดตไปยัง Parent Component
  //     onMapElementsUpdate(mapElements);
  //   });

  //   // บันทึกหมุดและค่าพิกัดเริ่มต้นใน state
  //   setMapElements((prev) => [
  //     ...prev,
  //     { marker, circleId, map, lng, lat },
  //   ]);

  //   setAddCircleClick(false);
  //       // ส่งพิกัดเริ่มต้นไปยัง Parent Component
  //     onMapElementsUpdate(mapElements);
  // };





  // use real
  const onMapClick = (event, map, radius) => {
    const { lng, lat } = event.lngLat;
    const circleId = `circle-${lng}-${lat}`; // สร้าง ID สำหรับวงกลม    
    console.log("in map click: "+ radius);
    

    // สร้างหมุด
    const marker = new mapboxgl.Marker({ color: "blue", draggable: true })
      .setLngLat([lng, lat])
      .addTo(map);

    drawCircle([lng, lat], radius, map, circleId);

    marker.on("dragend", () => {
      const newLngLat = marker.getLngLat();

      drawCircle([newLngLat.lng, newLngLat.lat], radius, map, circleId);

      setMapElements((prev) =>
        prev.map((el) =>
          el.circleId === circleId
            ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat }
            : el
        )
      );
    });

    // เพิ่มหมุดใหม่ใน state
    setMapElements((prev) => [
      ...prev,
      { marker, circleId, map, lng, lat },
    ]);

    setAddCircleClick(false);
  };




  // ใช้ useEffect เพื่อส่งข้อมูลไปที่ Parent Component เมื่อ mapElements เปลี่ยนแปลง
  useEffect(() => {
    if (typeof props.onMapElementsUpdate === "function") {
      props.onMapElementsUpdate(mapElements);
    }
  }, [mapElements, props.onMapElementsUpdate]); // อัปเดตเมื่อ mapElements เปลี่ยนแปลง





  // ปรับ และ เปลี่ยน ณ ตอนนั้น
  const updateCircleRadius = (idx, radius) => {
    const element = mapElements[idx];
    console.log("นี้-> " + radius);

    if (element) {
      const { circleId, map, lng, lat } = element;
      drawCircle([lng, lat], radius, map, circleId); // วาดวงกลมใหม่ที่ตำแหน่งเดิมด้วยรัศมีที่อัปเดต
    }
  };


  // use//
  // const onMapClick = (event, map) => {
  //   const { lng, lat } = event.lngLat;
  //   const circleId = `circle-${lng}-${lat}`; // สร้าง ID สำหรับวงกลม

  //   // สร้างหมุด
  //   const marker = new mapboxgl.Marker({ color: "red", draggable: true })
  //     .setLngLat([lng, lat])
  //     .addTo(map);

  //   const radius = 0.7;

  //   // วาดวงกลม
  //   drawCircle([lng, lat], radius, map, circleId);

  //   // ตั้งค่าเมื่อหมุดถูกลาก
  //   marker.on("dragend", () => {
  //     const newLngLat = marker.getLngLat();

  //     // วาดวงกลมใหม่ที่ตำแหน่งล่าสุด
  //     drawCircle([newLngLat.lng, newLngLat.lat], radius, map, circleId);

  //     // อัปเดตตำแหน่งของหมุดใน state
  //     setMapElements((prev) => {
  //       const updatedElements = prev.map((el) =>
  //         el.circleId === circleId
  //           ? { ...el, lng: newLngLat.lng, lat: newLngLat.lat }
  //           : el
  //       );

  //       // เรียกฟังก์ชันอัปเดต Parent Component
  //       onMapElementsUpdate(updatedElements);

  //       return updatedElements;
  //     });
  //   });

  //   // เพิ่มหมุดใหม่ใน state
  //   setMapElements((prev) => {
  //     const updatedElements = [
  //       ...prev,
  //       { marker, circleId, map, lng, lat },
  //     ];

  //     // เรียกฟังก์ชันอัปเดต Parent Component
  //     onMapElementsUpdate(updatedElements);

  //     return updatedElements;
  //   });

  //   setAddCircleClick(false); // ปิดสถานะการเพิ่มหมุด
  // };

  const removeElement = (idx) => {
    const element = mapElements[idx]; // ค้นหา element ตาม index
    if (!element) return;

    const { marker, circleId, map } = element;

    // ลบหมุด
    marker.remove();

    // ลบวงกลม
    if (map.getLayer(circleId)) map.removeLayer(circleId);
    if (map.getSource(circleId)) map.removeSource(circleId);

    // อัปเดต state
    setMapElements((prev) => {
      const updatedElements = prev.filter((_, i) => i !== idx);

      // ส่งข้อมูลใหม่ไปยัง Parent Component
      if (typeof onMapElementsUpdate === "function") {
        props.onMapElementsUpdate(updatedElements);
      }

      return updatedElements;
    });
  };

  const clearAllElements = () => {
    mapElements.forEach(({ marker, circleId, map }) => {
      marker.remove();
      if (map.getLayer(circleId)) map.removeLayer(circleId);
      if (map.getSource(circleId)) map.removeSource(circleId);
    });

    // อัปเดต state และแจ้ง Parent Component
    setMapElements([]); // ลบข้อมูลใน mapElements
    if (typeof onMapElementsUpdate === "function") {
      props.onMapElementsUpdate([]); // แจ้ง Parent Component ว่าไม่มีข้อมูลแล้ว
    }
  };





  useEffect(() => {
    if (!mapCenter || (mapCenter[0] === 0 && mapCenter[1] === 0)) return;

    const map = initializeMap(mapCenter);
    mapRef.current = map;

    map.on("click", (event) => {
      if (AddCircleClickRef.current) {
        onMapClick(event, map, 1);
      }
    });

    if (markers.length > 0) {
      addMarkersToMap(map, markers);
    }

    return () => map.remove();
  }, [mapCenter, markers]);

  // MAP END *************************************************************************************************  



  const distance = [];
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

    try {

      let result = []
      let colors = []

      // เรียก fetchRoutes เพื่อคำนวณเส้นทาง
      if(findBy === "home"){
        result = await fetchRoutes(idToken, mapRef.current, data);
        // setRoutes(result);
        console.log("route ที่ได้ "+ result);
       
        colors = result.map(() => getRandomHexColor());
        // setRouteColors(colors);
      }else if(findBy === "his"){
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
      

      // console.log("......>"+routeColors);  #CC6CE7
      


      // console.log("Add "+colors);

      
      

      // // วาดเส้นทางบนแผนที่
      // result.forEach((route, index) => {
      //   const routeKey = `route ${index + 1}`;
      //   const coordinates = route[routeKey];
      //   if (coordinates) {
      //     drawRoute(mapRef.current, coordinates, routeKey, colors[index], true)
      //       .then((didu) => {
      //         setdisdu(didu.distance)
      //         console.log("----> " + didu.distance);
      //         console.log("----> " + didu.duration);
      //       })
      //       .catch((error) => {
      //         console.error("Error drawing route:", error);
      //       });
      //   }
      // });
      // // ส่งกลับ routes และ routeColors
      // return { routes: result, routeColors: colors };

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
        // return Promise.resolve(); // Return a resolved Promise if coordinates are missing
        return null;
      });

      // Wait for all Promises to complete
      const diduArray = await Promise.all(drawPromises);


      console.log("this route Befor send: "+ result);
      

      return { routes: result, routeColors: colors, routeDistance: distance, routeDuration: duration, Didu: JSON.stringify(diduArray, null, 2) };

    } catch (error) {
      console.error("Error drawing routes:", error);
      throw error; // ส่งข้อผิดพลาดออกไป
    } finally {
      setIsLoading(false); // สิ้นสุดการโหลด
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



  const handleDrawRoute = async (route, routeKey, routeColor, type) => {
    // console.log(route);
    // console.log(routeKey);
    // console.log(routeColor);
    const coordinates = route[routeKey];
    if (coordinates) {
      const result = await drawRoute(mapRef.current, coordinates, routeKey, routeColor, type); // แสดงลำดับหมุด
      // console.log(".....> "+result);
      return result;
    }
  };




  // -------------------------------------------------------------------------
  return (
    <div className="h-screen w-full">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />
      <p className="absolute bottom-4 right-4 text-gray-600">
        {AddCircleClick ? "Choose a location ... " : " "}
      </p>




      <ul className="absolute right-0 bottom-0">
        {mapElements.map((el, idx) => (
          <li key={el.circleId}>
            Marker {idx + 1}: Longitude: {el.lng.toFixed(5)}, Latitude: {el.lat.toFixed(5)}
          </li>
        ))}
      </ul>

    </div>
  );
});

export default Map;