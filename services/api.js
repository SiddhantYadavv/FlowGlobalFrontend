import axios from "axios";

const api = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_BASE_URL}/api`,
    timeout: 15000,
});

export default api;