import configService from "./configService";

const fetchMapCenter = async (idToken) => {
    try {
      const response = await fetch(`${configService.baseURL}/api/schools`, {
        headers: {
          'Authorization': `Bearer ${idToken}`, // ส่ง token ใน headers
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        const latitude = parseFloat(data[0].latitude);  
        const longitude = parseFloat(data[0].longitude);

        // ถ้าแปลงไม่ได้ให้แสดงข้อความเตือน
        if (isNaN(latitude) || isNaN(longitude)) {
            return [11,11];  // ใช้ค่าเริ่มต้นถ้าแปลงไม่ได้
        }
        return [longitude, latitude]; 
      } else {
        return [11, 11]; 
      }
    } catch (error) {
        return [11, 11];
        console.error("Error fetching marker data: ", error);
    }
  };


export {fetchMapCenter};
