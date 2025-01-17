import { useState, useEffect, useRef, forwardRef, useImperativeHandle} from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

import { drawRoute, fetchMarkers, resetRoute, fetchRoutes, getRandomHexColor } from "../services/mapboxService";
import { fetchMapCenter } from "../services/schoolService";
import { subscribeAuthState } from "../services/authService";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Map = forwardRef((props, ref) => {
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
  // const [numVehicles, setNumVehicles] = useState(10);
  // const [maxStopsPerVehicle, setMaxStopsPerVehicle] = useState(20);
  // const [maxTravelTime, setMaxTravelTime] = useState(150);


  const [routes, setRoutes] = useState([]); // เก็บข้อมูล routes
  const [routeColors, setRouteColors] = useState([]);

  const [disdu, setdisdu] = useState([]);


  // com อื่น ใช้ fun ได้
  useImperativeHandle(ref, () => ({
    handleSubmit,
    handleReset,
    handleDrawRoute,
  }));




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

    // // เมื่อโหลดเสร็จ
    // map.on("load", () => {
    //   if (onMapLoaded) {
    //     onMapLoaded(); // เรียกฟังก์ชันที่ส่งเข้ามาจาก Parent
    //   }
    // });

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
        el.style.width = '8px'; // ขนาดจุด
        el.style.height = '8px';
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


  const distance = [];

  const handleSubmit = async (num_bus, max_stops, max_time) => {
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
      // เรียก fetchRoutes เพื่อคำนวณเส้นทาง
      const result = await fetchRoutes(idToken, mapRef.current, data);
  
      // สร้างสีสำหรับแต่ละเส้นทาง
      const colors = result.map(() => getRandomHexColor());

      // console.log("Add "+colors);
      
      setRouteColors(colors);
      setRoutes(result);

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
            const didu = await drawRoute(mapRef.current, coordinates, routeKey, colors[index], true);
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
  
      return { routes: result, routeColors: colors, routeDistance: distance, routeDuration: duration, Didu: JSON.stringify(diduArray, null, 2)};
      
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



const handleDrawRoute = async(route, routeKey, routeColor) => {
  // console.log(route);
  // console.log(routeKey);
  // console.log(routeColor);
  const coordinates = route[routeKey];
  if (coordinates) {
    const result = await drawRoute(mapRef.current, coordinates, routeKey, routeColor, true);
      // console.log(".....> "+result);
      return result;
  }
};
  
  
// -------------------------------------------------------------------------
  return (
      <div className="h-screen w-full">
          {/* Map Container */}
          <div ref={mapContainerRef} className="w-full h-full" />
      </div>
  );
});

export default Map;