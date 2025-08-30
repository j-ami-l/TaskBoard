import React, { use, useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../provider/AuthProvider';
import useAxiosSecure from '../Hooks/useAxiosSecure';

const Login = () => {
  const [error, setError] = useState(null);
  const api = useAxiosSecure()
  const navigate = useNavigate()
  const location = useLocation()
  const { login, signIntWithGoogle } = useContext(AuthContext)

  const from = location.state?.from?.pathname || "/";


  const handleGoogleSignUp = () => {
    signIntWithGoogle()
      .then(result => {
        console.log(result);
        if(result.user){
          const newUser = {
            name : result?.user?.displayName,
            email : result?.user?.email,
            role : "",
            imageUrl : result?.user?.photoURL,

          }
          api.post("/adduser" , newUser)
        }
        navigate(from, { replace: true });
      })
      .catch(err => {
        console.log(err);

      })
  };

  return (
    <div className="lg:min-h-screen mt-40 lg:mt-0 flex items-center justify-center  px-4">
      <div className="w-full max-w-md p-8 shadow-lg bg-indigo-200 rounded-lg">
        <h2 className="text-3xl font-bold text-center color-primary mb-6">
          Sign in to Your Account
        </h2>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center border border-red-300 p-2 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4">
          

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="btn w-full text-white flex items-center bg-neutral gap-3 border"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;