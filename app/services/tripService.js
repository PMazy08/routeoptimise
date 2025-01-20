// import { getAuth } from "firebase/auth";
// import configService from "./configService";

// export const fetchTrips = async () => {
//     try {
//         // กำหนด Token ที่จะส่งใน header
//         const auth = getAuth();
//         const user = auth.currentUser;

//         if (!user) throw new Error("User is not logged in");

//         const idToken = await user.getIdToken();
//         console.log("JWT Token:", idToken);

//         const res = await fetch(`${configService.baseURL}/api/trips`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${idToken}`,
//                 'Content-Type': 'application/json',
//             },
//         });

//         // console.log('Response Status:', res.status);

//         if (!res.ok) {
//             throw new Error('Failed to fetch trips');
//         }

//         const data = await res.json();
//         // console.log('Fetched Data:', data);
//         return data;
//     } catch (error) {
//         throw error;  // จับ error และแสดง
//     } 
// };
import configService from "./configService";

const fetchTrips = async (idToken) => {
  if (!idToken) {
    console.error("ID token is required to fetch trips");
    return [];
  }

  try {
    const response = await fetch(`${configService.baseURL}/api/trips`, {
      headers: {
        Authorization: `Bearer ${idToken}`, // Send token in headers
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error(`Failed to fetch trips: ${response.status} ${response.statusText}`);
      return [];
    }
  } catch (error) {
    console.error("Error fetching trips:", error);
    return [];
  }
};

export { fetchTrips };
