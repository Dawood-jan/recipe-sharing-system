import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ProfileData from "../../../shared/user/ProfileData";
import { profileAction } from "../../../../redux/slice/userSlice";


const Navbar = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(profileAction())
  }, [dispatch])

  const { profile } = useSelector((state) => state?.users)
  const user = profile?.userExist;

  return (
    <div className="flex items-center justify-between p-4">
      
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">

        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{user?.fullname}</span>
          <span className="text-[10px] text-gray-500 text-right">{user?.role}</span>
        </div>
        <ProfileData />
      </div>
    </div>
  );
};

export default Navbar;
