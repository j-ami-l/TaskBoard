import axios from 'axios';
import React, { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';

const useAxiosSecure = () => {
    const api = axios.create({
        baseURL : 'http://localhost:3000'
    })
    const {user} = useContext(AuthContext)

    api.interceptors.request.use(
        (config)=>{
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config
        }
    )


    return api;
};

export default useAxiosSecure;