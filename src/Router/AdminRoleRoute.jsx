import React, { useContext } from 'react';
import { UserInfoContext } from '../provider/UserInfoProvider';
import { Navigate } from 'react-router';
import { AuthContext } from '../provider/AuthProvider';

const AdminRoleRoute = ({children}) => {
    const userInfo = useContext(UserInfoContext)
    console.log(userInfo);

    if(!userInfo) return <h1>heeeee.....</h1>
    if(userInfo.role != "admin") return <Navigate to={"/addassingmentans"}></Navigate>

    return (
        children
    );
};

export default AdminRoleRoute;        