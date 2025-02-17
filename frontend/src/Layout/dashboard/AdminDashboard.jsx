import React, { useContext, useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Loader, List, LogOut, XCircle, UserCircle2 } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import logo from "../../assets/logo.png";
import { auth } from "../../context/AuthContext";
import Profile from "../../components/shared/Profile";
import UpdateProfile from "../../components/shared/UpdateProfile";
import PendingRecipes from "../../components/admin_components/PendingRecipes";
import ApprovedRecipes from "../../components/shared/ApprovedRecipes";
import RejectedRecipes from "../../components/admin_components/RejectedRecipes";
import { Avatar } from "@mui/material";

const AdminDashboard = () => {
  const { logout, getprofilePhoto, profilePhoto } = useContext(auth);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [file, setFile] = useState(null);
  const location = useLocation();
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const userAuth = JSON.parse(localStorage.getItem("userAuth"));
  console.log(userAuth.user.updatedUser);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // console.log(file);
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      console.log("Please select a photo first!");
    }

    // console.log(file);

    try {
      const res = await profilePhoto(file);
      if (res.success) {
        console.log(res);
        const fullPhotoUrl = `${import.meta.env.VITE_BASE_URL}/${
          res.payload.photoUrl
        }`;

        // console.log(fullPhotoUrl);

        setProfilePic(fullPhotoUrl);
        closeModal();
      } else {
        console.log(res);
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error.message);
      // alert("Failed to upload profile photo.");
    }
  };

  useEffect(() => {
    const getprofilePic = async () => {
      try {
        const res = await getprofilePhoto();
        if (!res.success) {
          console.log(res?.message);
        } else {
          // console.log(res.payload.photoUrl);
          const fullPhotoUrl = `${import.meta.env.VITE_BASE_URL}/${
            res.payload.photoUrl
          }`;

          // console.log(res.payload.photoUrl);
          setProfilePic(fullPhotoUrl);
        }
      } catch (error) {
        console.log(error?.message);
      }
    };
    getprofilePic();
  }, [profilePic]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="wrapper">
      {/* <!-- Sidebar --> */}
      <div class="sidebar" data-background-color="dark">
        <div class="sidebar-logo">
          {/* <!-- Logo Header --> */}
          <div class="logo-header" data-background-color="dark">
            <Link to="/admin-dashboard/all-recipes" className="logo">
              <img
                src={logo}
                alt="navbar brand"
                class="navbar-brand"
                height="95"
                width={60}
              />
            </Link>
            <div class="nav-toggle">
              <button class="btn btn-toggle toggle-sidebar">
                <i class="gg-menu-right"></i>
              </button>
              <button class="btn btn-toggle sidenav-toggler">
                <i class="gg-menu-left"></i>
              </button>
            </div>
            <button class="topbar-toggler more">
              <i class="gg-more-vertical-alt"></i>
            </button>
          </div>
          {/* <!-- End Logo Header --> */}
        </div>
        <div class="sidebar-wrapper scrollbar scrollbar-inner">
          <div class="sidebar-content">
            <ul class="nav nav-secondary">
              <li
                className={`nav-item ${
                  location.pathname === "/admin-dashboard/all-recipes"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/admin-dashboard/all-recipes">
                  <List
                    style={{
                      color:
                        location.pathname === "/admin-dashboard/all-recipes"
                          ? "#6861ce"
                          : "",
                      marginRight: "15px",
                    }}
                  />
                  All Recipes
                </Link>
              </li>

              <li
                className={`nav-item ${
                  location.pathname === "/admin-dashboard/pending-recipes"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/admin-dashboard/pending-recipes">
                  <Loader
                    style={{
                      color:
                        location.pathname === "/admin-dashboard/pending-recipes"
                          ? "#6861ce"
                          : "",
                      marginRight: "15px",
                    }}
                  />
                  Pending Recipes
                </Link>
              </li>

              <li
                className={`nav-item ${
                  location.pathname === "/admin-dashboard/rejected-recipes"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/admin-dashboard/rejected-recipes">
                  <XCircle
                    style={{
                      color:
                        location.pathname ===
                        "/admin-dashboard/rejected-recipes"
                          ? "#6861ce"
                          : "",
                      marginRight: "15px",
                    }}
                  />
                  Reject Recipes
                </Link>
              </li>

              <li class="nav-item">
                <Link onClick={handleLogout}>
                  <LogOut
                    style={{
                      marginRight: "15px",
                    }}
                  />
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <!-- End Sidebar --> */}

      <div class="main-panel">
        <div class="main-header">
          <div class="main-header-logo">
            {/* <!-- Logo Header --> */}
            <div class="logo-header" data-background-color="dark">
              <Link to="/admin-dashboard/all-recipes" className="logo">
                <img
                  // src={logo}
                  // alt="navbar brand"
                  // class="navbar-brand"
                  // height="20"
                  src={logo}
                  alt="navbar brand"
                  class="navbar-brand"
                  height="95"
                  width={60}
                />
              </Link>
              <div class="nav-toggle">
                <button class="btn btn-toggle toggle-sidebar">
                  <i class="gg-menu-right"></i>
                </button>
                <button class="btn btn-toggle sidenav-toggler">
                  <i class="gg-menu-left"></i>
                </button>
              </div>
              <button class="topbar-toggler more">
                <i class="gg-more-vertical-alt"></i>
              </button>
            </div>
            {/* <!-- End Logo Header --> */}
          </div>
          {/* <!-- Navbar Header --> */}
          <nav class="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
            <div class="container-fluid">
              <ul class="navbar-nav topbar-nav ms-md-auto align-items-center">
                <li class="nav-item topbar-user dropdown hidden-caret">
                  <a
                    class="dropdown-toggle profile-pic"
                    data-bs-toggle="dropdown"
                    href="#"
                    aria-expanded="false"
                  >
                    <div class="avatar-sm">
                      {profilePic ? (
                        // <img
                        //   src={profilePic}
                        //   alt="profile photo"
                        //   class="avatar-img rounded-circle"
                        // />

                        <Avatar
                          src={profilePic}
                          sx={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      ) : (
                        // <UserCircle2 size={30} className="text-dark" />
                        <Avatar
                          alt="Square Avatar"
                          // src={userAuth.user?.updatedUser?.fullname.slice()}
                          sx={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      )}
                    </div>
                    <span class="profile-username">
                      <span class="op-7">Hi,{" "}</span>

                      <span class="fw-bold">
                        {
                          userAuth?.user?.updatedUser
                            ? userAuth.user?.updatedUser.fullname // Render updatedUser's fullname if it exists
                            : userAuth?.user?.fullname // Render user's fullname if updatedUser doesn't exist
                        }
                        {/* {userAuth.user.fullname} */}
                      </span>
                    </span>
                  </a>
                  <ul className="dropdown-menu dropdown-user animated fadeIn">
                    <div className="dropdown-user-scroll scrollbar-outer">
                      <li>
                        <div className="user-box">
                          <div className="avatar-lg position-relative">
                            {/* {profilePic && (
                              <img
                                src={profilePic}
                                alt="profile photo"
                                class="avatar-img rounded"
                              />
                            )} */}

                            {profilePic ? (
                              // <img
                              //   src={profilePic}
                              //   alt="Profile"
                              //   className="avatar-img rounded"
                              // />
                              <Avatar
                                src={profilePic}
                                sx={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: "10px",
                                  marginTop: "5px",
                                }}
                              />
                            ) : (
                              // <FaUserCircle size={50} />
                              <Avatar
                                alt="Square Avatar"
                                // src={userAuth.user?.updatedUser?.fullname}
                                sx={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: "10px",
                                  marginTop: "5px",
                                }}
                              />
                            )}

                            <button onClick={openModal}>
                              <BsPencilSquare
                                style={{
                                  position: "absolute",
                                  right: "-2",
                                  bottom: "-5",
                                }}
                              />
                            </button>
                          </div>
                          <div className="u-text">
                            <h4>
                              {/* {userAuth.user.fullname} */}
                              {
                                userAuth?.user?.updatedUser
                                  ? userAuth.user?.updatedUser.fullname // Render updatedUser's fullname if it exists
                                  : userAuth?.user?.fullname // Render user's fullname if updatedUser doesn't exist
                              }
                            </h4>
                            <p className="text-muted">
                              {/* {userAuth.user.email} */}
                              {userAuth?.user?.updatedUser
                                ? userAuth.user?.updatedUser.email
                                : userAuth?.user?.email}
                            </p>
                            <Link
                              to="/admin-dashboard/user-profile"
                              className="btn btn-xs btn-secondary btn-sm"
                            >
                              View Profile
                            </Link>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item" onClick={handleLogout}>
                          Logout
                        </Link>
                      </li>
                    </div>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
          {/* <!-- End Navbar --> */}
        </div>

        <div class="container">
          <div class="page-inner">
            <Routes>
              <Route path="/" element={<Navigate to="all-recipes" />} />
              <Route path="pending-recipes" element={<PendingRecipes />} />
              <Route path="rejected-recipes" element={<RejectedRecipes />} />
              <Route path="all-recipes" element={<ApprovedRecipes />} />
              <Route path="/user-profile" element={<Profile />} />
              <Route path="/update-user" element={<UpdateProfile />} />
            </Routes>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block align-items-center">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload file</h5>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <input type="file" onChange={handleFileChange} />
              </div>

              <button onClick={handleUpload} className="btn btn-primary">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
