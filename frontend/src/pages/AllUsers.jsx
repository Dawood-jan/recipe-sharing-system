import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Alert, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllUsersAction } from "../redux/slice/userSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const AllUsers = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { users, userAuth, loading } = useSelector((state) => state?.users);
  // const { userAuth } = useSelector((state) => state?.users);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await dispatch(getAllUsersAction());
      if (getAllUsersAction.rejected.match(response)) {
        setError(response.payload);
      }
    };

    fetchUsers();
  }, [dispatch]);

  console.log(userAuth);

  const handleDelete = async (id) => {
    let response;
    swal(
      {
        title: "Are you sure?",
        text: "You will not be able to recover this imaginary file!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false,
      },
      async function () {
        response = await dispatch(deleteTTSAction(id));
        await swal("Deleted!", "TTS deleted successfully!", "success");

        dispatch(allTTSAction());
      }
    );

    if (deleteTTSAction.rejected.match(response)) {
      setError(response.payload);
    }
  };

  const audioBodyTemplate = (rowData) => (
    <audio controls style={{ width: "100%" }}>
      <source src={rowData.audioUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );

  const actionBodyTemplate = (rowData) => {
    const isOwner = userAuth?.userInfo?.id === rowData.user;
    return (
      <div className="flex gap-2">
        {isOwner && (
          <>
            <Button
              label="Edit"
              icon="pi pi-pencil"
              className="p-button-sm"
              onClick={() => navigate(`/edit-tts/${rowData._id}`)}
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              className="p-button-sm p-button-danger"
              onClick={() => handleDelete(rowData._id)}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <Box p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        All Users
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <DataTable
          value={users}
          responsiveLayout="scroll"
          className="p-datatable-sm"
          emptyMessage="No User found!"
          rows={10}
        >
          <Column field="_id" header="Id" sortable />
          <Column field="fullname" header="Name" sortable />
          <Column field="email" header="Email" sortable />
        </DataTable>
      )}
    </Box>
  );
};

export default AllUsers;
