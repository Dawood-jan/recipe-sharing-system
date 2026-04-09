import React, { useState, useEffect, useContext } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { SquarePen, Trash2 } from "lucide-react";
import { Alert } from "@mui/material";
import axios from "axios";
import { auth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AllRecipesBySpecificUser = () => {
  const [recipes, setRecipes] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [error, setError] = useState(null);
  const { userAuth } = useContext(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/recipes/users-approve-recipes`,
          {
            headers: {
              Authorization: `Bearer ${userAuth.user.token}`,
            },
          }
        );
        console.log(response.data);
        setRecipes(response.data.recipeWithImage);
      } catch (error) {
        console.error(error);
        setError(error?.response?.data?.message);
      }
    };

    fetchRecipes();
  }, []);

  const handleEdit = (recipe) => {
    const id = recipe._id;
    navigate(`/contributor-dashboard/users-recipes/${id}`);
  };

  const handleDelete = async (id) => {
    swal({
      title: "Are you sure?",
      text: "You want to delete this notice!",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes, delete it!",
          className: "btn btn-success",
        },
        cancel: {
          visible: true,
          className: "btn btn-danger",
        },
      },
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${import.meta.env.VITE_BASE_URL}/recipes/delete-recipe/${id}`,
            {
              headers: {
                Authorization: `Bearer ${userAuth.user.token}`,
              },
            }
          )
          .then(() => {
            setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
            swal({
              title: "Deleted!",
              text: "The notice has been deleted.",
              icon: "success",
              buttons: {
                confirm: {
                  className: "btn btn-success",
                },
              },
            });
          })
          .catch((err) => {
            const errorMessage =
              err.response?.data?.message ||
              "An error occurred while deleting the notice.";
            setError(errorMessage);
          });
      } else {
        swal.close();
      }
    });
  };

  const handleView = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  const columns = React.useMemo(
    () => [
      // {
      //   accessorKey: "postedBy.fullname",
      //   header: "Created By",
      // },
      {
        accessorKey: "video",
        header: "Video",
        cell: ({ row }) => {
          const videoUrl = `${import.meta.env.VITE_BASE_URL}${
            row.original.video
          }`;
          // console.log(videoUrl);
          return (
            <>
              {row.original.video ? (
                <video
                  src={videoUrl}
                  preload="metadata"
                  controls
                  style={{
                    width: "150px", // Adjust width as needed
                    height: "100px", // Adjust height as needed
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <span className="text-muted">No Video Available</span>
              )}
            </>
          );
        },
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
          const imageUrl = row.original.image; // The full image URL
          // console.log(imageUrl);
          return (
            <>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Recipe"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px", // Optional rounded styling
                  }}
                />
              ) : (
                <span className="text-muted">No Image Available</span>
              )}
            </>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "ingredients",
        header: "Ingredients",
        cell: ({ row }) => (
          <div dangerouslySetInnerHTML={{ __html: row.original.ingredients }} />
        ),
      },
      // {
      //   accessorKey: "instructions",
      //   header: "Instructions",
      //   cell: ({ row }) => (
      //     <div
      //       dangerouslySetInnerHTML={{ __html: row.original.instructions }}
      //     />
      //   ),
      // },
      {
        header: "Action",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="bg-success px-3 py-1 me-1"
              onClick={() => handleEdit(row.original)}
            >
              <SquarePen size={15} className="me-1" />
              Edit
            </button>
            <button
              className="bg-danger px-3 py-1 me-1"
              onClick={() => handleDelete(row.original._id)}
            >
              <Trash2 size={15} className="me-1" />
              Delete
            </button>
            <button
              className="bg-info px-3 py-1"
              onClick={() => handleView(row.original)}
            >
              View
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: recipes,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const cellValue = row.getValue(columnId) || "";
      return cellValue.toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <div className="container bg-light">
      <h2 className="text-3xl font-bold text-center mb-4">All Recipes</h2>

      {error && (
        <Alert
          severity="error"
          style={{ display: "flex", alignItems: "center" }}
        >
          {error}
        </Alert>
      )}

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="form-control"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value || "")}
        />
      </div>

      {/* Responsive Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-dark">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc"
                      ? " 🔼"
                      : header.column.getIsSorted() === "desc"
                      ? " 🔽"
                      : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedRecipe && (
        <div
          className="modal show  d-flex justify-content-center align-items-center"
          tabIndex="-1"
          role="dialog"
          // style={{ height: "100vh" }}
        >
          <div
            className="modal-dialog modal-lg"
            role="document"
            style={{
              maxWidth: "50%",
              minWidth: "600px",
              maxHeight: "90%",
              minHeight: "400px",
            }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedRecipe.name}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {selectedRecipe.video && (
                  <video
                    controls
                    src={`${import.meta.env.VITE_BASE_URL}${
                      selectedRecipe.video
                    }`}
                    className=" mb-3"
                    style={{
                      maxWidth: "100%",
                      // minWidth: "600px",
                      // maxHeight: "90%",
                      // minHeight: "400px",
                    }}
                  ></video>
                )}
                {/* <h5 className="modal-title">{selectedRecipe.name}</h5> */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedRecipe.ingredients,
                  }}
                />
                {/* <h5>Instructions</h5> */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedRecipe.instructions,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRecipesBySpecificUser;
