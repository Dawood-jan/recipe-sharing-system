import React, { useContext, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { auth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Avatar,Alert } from "@mui/material";
// import { Alert } from "@mui/material";

const Profile = () => {
  const { profile, profilePhoto, userAuth } = useContext(auth);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [photoUpdated, setPhotoUpdated] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profile();
        // console.log(res.payload.userProfile);
        if (!res.success) {
          setError(res?.message);
        } else {
          setUserProfile(res.payload.userProfile);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProfile();
  }, [photoUpdated]);

  useEffect(() => {
    if (profilePhoto) {
      setPhotoUpdated((prev) => !prev); // Toggle photoUpdated to refetch profile
    }
  }, [profilePhoto]);

  const basePath =
    userAuth?.user?.role === "admin"
      ? "/admin-dashboard"
      : "/contributor-dashboard";
  // console.log(basePath);
  // const avatarUrl =
  //   userProfile?.avatar && !userProfile.avatar.includes("undefined")
  //     ? userProfile.avatar
  //     : null;
  return (
    <Card sx={{ maxWidth: 345, margin: "auto" }}>
       {error && (
              <Alert
                severity="error"
                style={{ display: "flex", alignItems: "center" }}
              >
                {error}
              </Alert>
            )}
      {userProfile && (
        <>
          {!userProfile.avatar.includes("undefined") ? (
            <CardMedia
              sx={{
                height: 150,
                width: 150,
                borderRadius: "50%",
                margin: "auto",
              }}
              image={userProfile.avatar}
              title="profile photo"
            />
          ) : (
            <>
              <Avatar
                alt={userProfile.fullname || "Default User"}
                sx={{
                  width: 150,
                  height: 150,
                  // background: "black",
                  margin: "auto",
                }}
              >
                {/* {userProfile.fullname?.[0]?.toUpperCase() || "U"} */}
              </Avatar>
            </>
          )}

          <Divider
            component="li"
            style={{
              listStyle: "none",
              padding: "3px",
              borderColor: "divider",
            }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {userProfile.fullname}
            </Typography>

            <Divider
              component="li"
              style={{
                listStyle: "none",
                padding: "3px",
                borderColor: "divider",
              }}
            />

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", marginTop: "5px" }}
            >
              {userProfile.email}
            </Typography>
          </CardContent>
          <Divider
            component="li"
            style={{
              listStyle: "none",
              padding: "3px",
              borderColor: "divider",
            }}
          />
          <Link
            to={`${basePath}/update-user`}
            className="btn btn-sm btn-secondary my-2 mx-2"
          >
            Edit
          </Link>
        </>
      )}
    </Card>
  );
};

export default Profile;
