import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state?.users?.userAuth);

  const token = userInfo?.token ? true : false;

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
