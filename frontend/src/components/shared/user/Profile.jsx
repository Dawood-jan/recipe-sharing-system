import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Alert,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { profileAction } from "../../../redux/slice/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userAuth, profile, profilePhoto, loading } = useSelector(
    (state) => state?.users
  );
  const [error, setError] = useState(null);

  // fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      await dispatch(profileAction());
      dispatch(getProfilePhotoAction())
    };
    fetchProfile();
  }, []);
  // console.log(profilePhoto);

  const isAdmin = userAuth?.userInfo?.userExist?.isAdmin;

  // handle edit profile
  const handleEdit = () => {
    if (isAdmin) {
      navigate("/admin/update-profile");
    } else {
      navigate("/update-user");
    }
  };

  // console.log(userAuth, profile)
  // console.log(userAuth)
  // console.log(profile)

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-100">
      <Card sx={{ width: 400, textAlign: "center", p: 2 }}>
        {error && (
          <Alert
            severity="error"
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            {error}
          </Alert>
        )}

        {profile && (
          <>
            {!profilePhoto?.Base_Url?.includes("undefined") ? (
              <CardMedia
                sx={{
                  height: 150,
                  width: 150,
                  borderRadius: "50%",
                  margin: "10px auto 0 auto",
                  objectFit: "cover",
                }}
                image={profilePhoto?.Base_Url}
                title="Profile Photo"
              />
            ) : (
              <Avatar
                sx={{
                  height: 150,
                  width: 150,
                  margin: "10px auto 0 auto",
                  objectFit: "cover",
                  fontSize: 40,
                }}
              >
                {/* {profile?.fullname} */}
              </Avatar>
            )}

            <Divider sx={{ my: 2 }} />

            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {profile?.userExist?.fullname}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", marginTop: "5px" }}
              >
                {profile?.userExist?.email}
              </Typography>
            </CardContent>

            <Divider sx={{ my: 2 }} />

            <button
              // to="/update-user"
              onClick={handleEdit}
              className="inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          </>
        )}
      </Card>
    </div>
  );
};

export default Profile;
