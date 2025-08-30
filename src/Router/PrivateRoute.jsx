import React, { use } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../provider/AuthProvider';

const PrivateRoute = ({children}) => {

    const  {user , loading} = use(AuthContext)

    if(loading) return <h1>Loading......</h1>

    if(!user) return <Navigate to={'/login'}></Navigate>


    return (
        children
    );
};

export default PrivateRoute;