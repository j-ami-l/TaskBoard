import React, { useContext } from 'react';
import { UserInfoContext } from '../provider/UserInfoProvider';
import { Navigate } from 'react-router';
import { AuthContext } from '../provider/AuthProvider';

const AdminRoleRoute = ({children}) => {
    const {userInfo , loading} = useContext(UserInfoContext)
    console.log(userInfo);

    if(loading) return <h1>heeeee.....</h1>
    if(userInfo?.role != "admin") return <Navigate to={"/"}></Navigate>

    return (
        children
    );
};

export default AdminRoleRoute;        