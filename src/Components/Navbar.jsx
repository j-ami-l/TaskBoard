import React, { useContext } from "react";
import { NavLink } from "react-router";
import { AuthContext } from "../provider/AuthProvider";

const Navbar = () => {
    const {user  , logout} = useContext(AuthContext)
    const handleLogOut = ()=>{
        logout()
        .then(res=>{
            console.log(res);
            
        })
        .catch(err=>{
            console.log(err);
            
        })
    }
  return (
    <div className="navbar bg-white shadow-md px-4">
      {/* Left side (Logo + Mobile Menu) */}
      <div className="navbar-start flex items-center gap-2">
        {/* Mobile Dropdown */}
        <div className="dropdown lg:hidden">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-square"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52"
          >
            <li>
              <NavLink
                to="/addassingmentans"
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-medium"
                    : "text-gray-700 hover:text-indigo-500"
                }
              >
                Submit Answer
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Brand Name */}
        <a className="text-lg font-bold text-indigo-600">TaskBoard</a>
      </div>

      {/* Center (Navigation Links - Desktop only) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-4">
          <li>
            <NavLink
              to="/addassingmentans"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-600 font-medium"
                  : "text-gray-700 hover:text-indigo-500"
              }
            >
              Submit Answer
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Right side (Button or Profile) */}
      <div className="navbar-end">
        <a onClick={handleLogOut} className="btn btn-sm bg-indigo-600 text-white hover:bg-indigo-700">
          Log Out
        </a>
      </div>
    </div>
  );
};

export default Navbar;
