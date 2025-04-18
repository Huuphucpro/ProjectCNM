import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const axiosClient = axios.create({
    baseURL: 'http://localhost:4000/',
    headers: {
        "Content-Type": 'application/json'
    }
})

// Add a request interceptor
axiosClient.interceptors.request.use(function (config: AxiosRequestConfig) {
    // Debug log for tracking request data
    if (process.env.NODE_ENV !== 'production') {
        if (config.data instanceof FormData) {
            console.log('Request with FormData', {
                url: config.url,
                method: config.method,
                // Log FormData entries if available
                data: Array.from(config.data.entries()).reduce((obj, [key, val]) => {
                    obj[key] = val instanceof File ? `File: ${val.name}` : val;
                    return obj;
                }, {} as Record<string, any>)
            });
        } else {
            console.log('Request', {
                url: config.url,
                method: config.method,
                data: config.data
            });
        }
    }
    
    // Do something before request is sent
    let token = localStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token) {
        try {
            // Remove quotes if present
            if (token.startsWith('"') && token.endsWith('"')) {
                token = token.substring(1, token.length - 1);
            }
            config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
            console.error("Error processing token:", error);
        }
    }
    
    // Check if we're sending form data (for image uploads)
    if (config.data instanceof FormData) {
        // Don't set content type for FormData - browser will set it with boundary
        delete config.headers['Content-Type'];
    }
    
    return config;
  }, function (error) {
    // Do something with request error
    console.error("Request error:", error);
    return Promise.reject(error);
});

// Add a response interceptor
axiosClient.interceptors.response.use(function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  });

export default axiosClient