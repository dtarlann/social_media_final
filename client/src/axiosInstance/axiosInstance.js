import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://vibing.cf/api/',
    header:{
        "Content-Type":"application/json"
    }
});


const axios_two = axios.create({
    baseURL: 'http://vibing.cf/api/'
});



axiosInstance.interceptors.request.use(function (config) {
   let token = localStorage.getItem("token");
   config.headers["access-token"] =token;
   return config;
 });

// axiosInstance.defaults.headers.common['access-token'] = localStorage.getItem('token');

export {axiosInstance ,axios_two}; 