import configService from "./configService";


//or ginal
// const fetchRoutes = async (idToken, map, data) => {
//     console.log("Fetching Trips and Drawing Routes... $$$$$");
//     try {
//       const response = await fetch(`${configService.orToolURL}/vrp/solve_vrp`, {
//         method: 'POST', // ใช้ POST method
//         headers: {
//           'Content-Type': 'application/json', // Content-Type เป็น JSON
//         },
//         body: JSON.stringify(data), // ส่ง data ใน body
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
  
//       const result = await response.json();
  
//       // ตรวจสอบว่ามีข้อมูล trips หรือไม่
//       if (result && result.trips) {
        
//         // console.log("Trips found:", result.trips);
//         return result.trips;
//       } else {
//         console.warn("No trips found in API response");
//         return [];
//       }
//     } catch (error) {
//       console.error("Error fetching trips from API:", error);
//       return [];
//     }
//   };


// new
const fetchRoutes = async (idToken, map, data) => {
  console.log("Fetching Trips and Drawing Routes... $$$$$");
  console.log();
  
  try {
    const response = await fetch(`${configService.orToolURL}/solve`, {
      method: 'POST', // ใช้ POST method
      headers: {
        'Content-Type': 'application/json', // Content-Type เป็น JSON
      },
      body: JSON.stringify(data), // ส่ง data ใน body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    // ตรวจสอบว่ามีข้อมูล trips หรือไม่
    if (result && result.trips) {
      // console.log("Trips found:", result.trips);
      return result.trips;
    } else {
      console.warn("No trips found in API response");
      return [];
    }
  } catch (error) {
    console.error("Error fetching trips from API:", error);
    return [];
  }
};






  const fetchRouteByTripId = async (idToken, trip_id) => {
    if (!idToken) {
      console.error("ID token is required to fetch trips");
      return [];
    }
  
    try {
      const response = await fetch(`${configService.baseURL}/api/routes/trip/${trip_id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`, // Send token in headers
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Trips found:", result);
        console.log("Trips found in ser:"+ JSON.stringify(result, null, 2));
        return result.trips;
      } else {
        console.error(`Failed to fetch trips: ${response.status} ${response.statusText}`);
        return [];
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
      return [];
    }
  };




  function getRandomHexColor() {
    const getRandomValue = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const r = getRandomValue(); // สีแดง
    const g = getRandomValue(); // สีเขียว
    const b = getRandomValue(); // สีน้ำเงิน
    
    const color = `#${r}${g}${b}`;
    return color;
  }


  export {fetchRoutes, fetchRouteByTripId, getRandomHexColor}