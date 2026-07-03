import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('Response Error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('Request Error:', error.request);
        }else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;