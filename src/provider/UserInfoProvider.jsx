import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthProvider';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router';
export const UserInfoContext = createContext()

const UserInfoProvider = ({ children }) => {
    const api = useAxiosSecure()
    const { user } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const { data: userInfo = null, isFetching, refetch, isError, error } = useQuery({
        queryKey: ['user', user?.email],
        queryFn: async () => {
            if (!user) return []
            const res = await api.get(`/user?email=${user.email}`)
            setLoading(false)
            return res.data;
        },
        enabled: !!user
    })

    // if(!userInfo) return <Navigate to={'/login'}></Navigate>
    // if(userInfo) setLoading(false)
    const info = {
        userInfo,
        loading
    }

    return (
        <UserInfoContext.Provider value={info}>{children}</UserInfoContext.Provider>
    );
};

export default UserInfoProvider;