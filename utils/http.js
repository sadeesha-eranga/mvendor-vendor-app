import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_BASE_URL } from "@env";

const http = axios.create({
    baseURL: SERVER_BASE_URL
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

export default http;
