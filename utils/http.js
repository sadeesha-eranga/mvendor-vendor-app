import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const http = axios.create({
    baseURL: 'http://localhost:8080/mvendor'
});

http.defaults.headers.post['Content-Type'] = 'application/json';

http.interceptors.request.use(async request => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken !== undefined) {
            request.headers.Authorization = 'Bearer ' + accessToken;
        }
        return request;
    },
    error => error
);

// http.interceptors.response.use(
//     response => response,
//     async (error) => {
//         const status = error.response ? error.response.status : 0;
//         if (status === 401) {
//             // Navigate to login
//         } else {
//             return Promise.reject(error);
//         }
//     }
// );

export default http;
