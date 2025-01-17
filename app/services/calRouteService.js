import configService from "./configService";


const fetchRoutes = async (idToken, map, data) => {
    console.log("Fetching Trips and Drawing Routes...");
    try {
        const response = await fetch(`${configService.orToolURL}/vrp/solve_vrp`, {
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
            console.log("Trips found:", result.trips);
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



// ฟังก์ชันสำหรับสุ่มสีแบบ Hex
function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


export { getRandomHexColor, fetchRoutes };