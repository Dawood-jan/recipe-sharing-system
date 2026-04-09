import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getProfilePhotoAction } from "../../../redux/slice/userSlice";
import { Alert } from "@mui/material";

const ProfilePhoto = ({ width, height }) => {
  const dispatch = useDispatch();
  const { profilePhoto, loading } = useSelector((state) => state?.users);

  const [error, setError] = useState(null);


  // fetch profile photo
  useEffect(() => {
    const fetchProfileImage = async () => {
      const response = await dispatch(getProfilePhotoAction());

      if (getProfilePhotoAction.pending.match(response)) {
        console.log("Loading...");
      }

      if (getProfilePhotoAction.fulfilled.match(response)) {
        // console.log("Completed...");
      }

      if (getProfilePhotoAction.rejected.match(response)) {
        setError(response?.payload);
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <div>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Avatar sx={{ width, height }} />
      ) : (
        <Avatar sx={{ width, height }} src={profilePhoto?.Base_Url} />
      )}
    </div>
  );
};

export default ProfilePhoto;
