import { createBrowserRouter } from "react-router";
import Root from "../pages/Root/Root";
import PrivateRoute from "./PrivateRoute";
import Login from "../Login/Login";
import Home from "../pages/Home/Home";
import AddAssignment from "../pages/Add/AddAssignment";
import AdminRoleRoute from "./AdminRoleRoute";
import Allassignments from "../pages/Allassignments/Allassignments";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoute>
            <Root></Root>
        </PrivateRoute>,
        children: [
            {
                index: true,
                element: <Home></Home>
            },
            {
                path: '/addassingmentans',
                element: <PrivateRoute>
                    <AddAssignment></AddAssignment>
                </PrivateRoute>
            },
            {
                path: '/allassignments',
                element: <PrivateRoute>
                    <AdminRoleRoute>
                        <Allassignments></Allassignments>
                    </AdminRoleRoute>
                </PrivateRoute>
            }
        ]
    },
    {
        path: "/login",
        element: <Login></Login>
    }
])