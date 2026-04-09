import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Alert, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfilePhotoAction,
  profileAction,
  profilePhotoAction,
} from "../../redux/slice/userSlice";
import ProfilePhoto from "../../components/shared/user/ProfilePhoto";

export default function Profile() {
  const dispatch = useDispatch();
  const { profile, profilePhoto, error } = useSelector((state) => state?.users);
  const [file, setFile] = useState(null);
  const [profilePhotoError, setProfilePhotoError] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      await dispatch(profileAction());
    };
    fetchProfile();
  }, [profilePhoto?.Base_Url]);

  const fileChange = async (e) => {
    // console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const uploadFile = async (e) => {
    e.preventDefault();
    const response = await dispatch(profilePhotoAction(file));

    // console.log(result);

    if (profilePhotoAction.fulfilled.match(response)) {
      await dispatch(getProfilePhotoAction());
      setOpen(false);
    }
    if (profilePhotoAction.rejected.match(response)) {
      setProfilePhotoError(response.payload);
    }
  };

  return (
    <div className="d-flex justify-content-center" style={{ width: "100%" }}>
      <Card sx={{ width: 365 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <CardActionArea>
          <Box
            className="d-flex justify-content-center pt-2"
            onClick={handleOpen}
          >
            <ProfilePhoto width={100} height={100} />
          </Box>
          <CardContent className="text-center">
            <Typography gutterBottom variant="h5" component="div">
              {profile && profile?.fullname}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {profile && profile?.email}
            </Typography>
          </CardContent>
        </CardActionArea>

        <Button
          onClick={() => {
            navigate("/update-user");
          }}
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
        >
          Update
        </Button>
      </Card>

      {open && (
        <div
          className="modal"
          style={{ display: open ? "block" : "none", alignContent: "center" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              {profilePhotoError && (
                <Alert severity="error">{profilePhotoError}</Alert>
              )}
              <div className="modal-header">
                <h5 className="modal-title">Upload image</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={fileChange}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={uploadFile}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
