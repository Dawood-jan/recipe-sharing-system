import React, { useEffect, useState, useContext } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Alert } from "@mui/material";
import { auth } from "../../context/AuthContext";
import axios from "axios";

const RejectedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [error, setError] = useState(null);
  const { userAuth } = useContext(auth);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/recipes/rejected-recipes`,
          {
            headers: {
              Authorization: `Bearer ${userAuth.user.token}`,
            },
          }
        );

        // console.log(response.data.image);
        setRecipes(response.data.rejectedRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError(error?.response?.data?.message);
      }
    };

    fetchRecipes();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
          const imageUrl = `${import.meta.env.VITE_BASE_URL}${
            row.original.image
          }`;
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
                    borderRadius: "8px",
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
        accessorKey: "Category",
        header: "recipeType",
        cell: ({ row }) => (
          <div dangerouslySetInnerHTML={{ __html: row.original.recipeType }} />
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
        accessorKey: "postedBy.fullname",
        header: "Created By",
      },

      {
        header: "Status",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button aria-readonly className="bg-danger px-3 py-1">
              Reject
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
    <div className="p-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">Rejected Recipes</h2>
      {error && (
        <Alert
          severity="error"
          style={{ display: "flex", alignItems: "center" }}
        >
          {error}
        </Alert>
      )}
      <div className="">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border rounded form-control"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value || "")}
        />
      </div>
      <div className="overflow-x-auto table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-dark">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-800">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-gray-300 px-4 py-2"
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
              <tr key={row.id} className="bg-white hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RejectedRecipes;
