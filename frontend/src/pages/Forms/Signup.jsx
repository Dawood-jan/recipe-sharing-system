import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { registerAction } from "../../redux/slice/userSlice";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import Loading from "../../components/LoadingComp/LoadingComponent";
import SuccessMsg from "../../components/SuccessMsg/SuccessMsg";
import ErrorMsg from "../../components/ErrorMsg/ErrorMsg";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword((show) => !show);
  const handleConfirmShowPassword = () =>
    setConfirmShowPassword((show) => !show);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData)
    dispatch(registerAction(formData));
  };

  const { userInfo, loading, error } = useSelector((state) => {
    return state?.users?.userAuth;
  });

  useEffect(() => {
    if (userInfo) {
      navigate("/login");
    }
  }, [userInfo]);

  return (
    <div className="w-full  bg-white flex lg:justify-center">
      <div className="w-full max-w-[28%] bg-white shadow-2xl px-5 pt-10 pb-5 rounded-2xl">
        <form onSubmit={handleSubmit}>
          <h1 className="text-center text-2xl font-semibold mb-3">
            Create Account
          </h1>

          {error && <ErrorMsg message={error?.message} />}
          {userInfo && <SuccessMsg message="User created successfully." />}

          {/* Name */}
          <div className="sm:col-span-3">
            <label
              htmlFor="first-name"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Name
            </label>
            <div className="mt-1 mb-2">
              <input
                id="fullname"
                name="fullname"
                type="text"
                value={formData?.fullname}
                onChange={handleChange}
                autoComplete="given-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Email */}
          <div className="sm:col-span-3">
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-1 mb-2">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Password */}
          <div className="sm:col-span-3">
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-1 relative mb-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                autoComplete="password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <span
                onClick={handleShowPassword}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 
               12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 
               10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 
               7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 
               6.228 3 3m3.228 3.228 3.65 3.65m7.894 
               7.894L21 21m-3.228-3.228-3.65-3.65m0 
               0a3 3 0 1 0-4.243-4.243m4.242 
               4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 
               0 0 1 0-.639C3.423 7.51 7.36 
               4.5 12 4.5c4.638 0 8.573 3.007 
               9.963 7.178.07.207.07.431 0 
               .639C20.577 16.49 16.64 19.5 
               12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 
               3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>

          <PasswordStrengthMeter password={formData.password} />

          {/* Confirm Password */}
          <div className="sm:col-span-3 mt-2 mb-4">
            <label
              htmlFor="confirmPasword"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Confirm Password
            </label>
            <div className="mt-1 relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="confirmPassword"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <span
                onClick={handleConfirmShowPassword}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 
               12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 
               10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 
               7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 
               6.228 3 3m3.228 3.228 3.65 3.65m7.894 
               7.894L21 21m-3.228-3.228-3.65-3.65m0 
               0a3 3 0 1 0-4.243-4.243m4.242 
               4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 
               0 0 1 0-.639C3.423 7.51 7.36 
               4.5 12 4.5c4.638 0 8.573 3.007 
               9.963 7.178.07.207.07.431 0 
               .639C20.577 16.49 16.64 19.5 
               12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 
               3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>

          {loading ? (
            <button
              disabled
              className="bg-black text-white w-full py-3 rounded"
            >
              Signing in... <Loading />
            </button>
          ) : (
            <button
              type="submit"
              className="bg-[#3C76D2] text-white w-full py-3 rounded hover:cursor-pointer"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
