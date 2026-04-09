import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const navigate = useNavigate();
  //get user from localstorage
  const { userInfo } = useSelector((state) => state?.users?.userAuth);
  // console.log(userInfo);
  const isContributor = userInfo?.isContributor ? true : false;
  // console.log(isContributor);
  if (!isContributor) return <Navigate to="/not-authorized" />;
  return <>{children}</>;
};

export default AuthRoute;
