import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthProvider';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
export const UserInfoContext = createContext()

const UserInfoProvider = ({ children }) => {
    const api = useAxiosSecure()
    const { user } = useContext(AuthContext)

    const { data: userInfo = {}, isFetching, refetch, isError, error } = useQuery({
        queryKey: ['user' , user?.email],
        queryFn: async () => {
            if (!user) return []
            const res = await api.get(`/user?email=${user.email}`)
            console.log(res.data);
            
            return res.data;
        },
        enabled: !!user
    })

    if(!userInfo) return <h1>Loading ....</h1>

    

    return (
        <UserInfoContext.Provider value={userInfo}>{children}</UserInfoContext.Provider>
    );
};

export default UserInfoProvider;