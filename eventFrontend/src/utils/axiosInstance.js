import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://univia.onrender.com/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
    proxy: false
});

axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;
        if(err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
        try {
            // Attempt to refresh the access token
            await axiosInstance.get("/user/refresh-access-token");
            // Retry the original request
            return axiosInstance(originalRequest);
        } catch (refreshErr) {
            // If refresh fails, log out user
            window.location.href = "/";
            return Promise.reject(refreshErr);
        }
        }
        return Promise.reject(err);
    }
);

export default axiosInstance;