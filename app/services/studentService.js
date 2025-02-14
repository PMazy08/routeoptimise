import configService from "./configService";


// export const fetchPageData = async (page) => {
//     try {
//         const response = await axios.get(`${configService.baseURL}/students/page/${page}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error Page data', error);
//         throw error;
//     }
// }

const fetchStudentAll = async (idToken) => {
    try {
      const response = await fetch(`${configService.baseURL}/api/students`, {
        headers: {
          'Authorization': `Bearer ${idToken}`, // ส่ง token ใน headers
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data; // ส่งข้อมูลกลับไป
      } else {
        throw new Error(`Failed to fetch data from API: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching marker data: ", error);
      throw error; // ขว้างข้อผิดพลาดออกไป
    }
  };



  const fetchStudentPage = async (idToken, page) => {
    
  };



  const fetchStudentBatchData = async (idToken, coordinates) => {
    try {
      // สร้าง URL
      const url = `${configService.baseURL}/api/students/lnglat/batch`;
  
      // เรียก API ด้วย fetch
      const response = await fetch(url, {
        method: 'POST', // ใช้ POST method
        headers: {
          'Authorization': `Bearer ${idToken}`, // เพิ่ม Bearer token ใน headers
          'Content-Type': 'application/json', // ระบุว่าเนื้อหาเป็น JSON
        },
        body: JSON.stringify(coordinates), // ส่งพิกัดหลายชุดใน body
      });
  
      // ตรวจสอบสถานะการตอบกลับ
      if (!response.ok) {
        // หากไม่สำเร็จ ขว้างข้อผิดพลาดพร้อมสถานะ
        const errorText = await response.text();
        throw new Error(`Failed to fetch data from API (status: ${response.status}): ${errorText}`);
      }
  
      // แปลง response เป็น JSON
      const data = await response.json();
      return data; // ส่งข้อมูลที่ได้กลับไป
    } catch (error) {
      // ดักจับข้อผิดพลาดที่เกิดขึ้น
      console.error("Error fetching batch student data: ", error);
      throw error; // ขว้างข้อผิดพลาดออกไปเพื่อให้ caller จัดการ
    }
  };
  

  

  export {fetchStudentAll, fetchStudentPage, fetchStudentBatchData};



