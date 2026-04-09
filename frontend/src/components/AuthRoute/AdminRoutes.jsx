import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminOnly from "../NotAuthorised/AdminOnly";
// import { profileAction } from "../../redux/slice/userSlice";

const AdminRoutes = ({ children }) => {
  const { userInfo } = useSelector((state) => state?.users?.userAuth);
  const isAdmin = userInfo?.isAdmin ? true : false;
  if (!isAdmin) return <AdminOnly />;
  return <>{children}</>;
};

export default AdminRoutes;
