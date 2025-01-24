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

  export {fetchStudentAll, fetchStudentPage};



