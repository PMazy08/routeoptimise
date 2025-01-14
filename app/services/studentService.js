import axios from 'axios';

const API_BASE_URL = 'http://192.168.3.249:8080/api';

export const fetchPageData = async (page) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/students/page/${page}`);
        return response.data;
    } catch (error) {
        console.error('Error Page data', error);
        throw error;
    }
}
