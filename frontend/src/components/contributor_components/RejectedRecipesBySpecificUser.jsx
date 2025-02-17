import React, { useState, useEffect, useContext } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
// import { SquarePen, Trash2 } from "lucide-react";
import axios from "axios";
import { Alert } from "@mui/material";
import { auth } from "../../context/AuthContext";

const RejectedRecipesBySpecificUser = () => {
  const [recipes, setRecipes] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [error, setError] = useState(null);
  const { userAuth } = useContext(auth);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/recipes/all-rejected-recipes`,
          {
            headers: {
              Authorization: `Bearer ${userAuth.user.token}`,
            },
          }
        );
        // console.log(response.data);
        setRecipes(response.data.rejectedRecipes);
      } catch (error) {
        console.error(error);
        setError(error?.response?.data?.message);
      }
    };

    fetchRecipes();
  }, []);

  const columns = React.useMemo(
    () => [
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
      {
        accessorKey: "instructions",
        header: "Instructions",
        cell: ({ row }) => (
          <div
            dangerouslySetInnerHTML={{ __html: row.original.instructions }}
            // style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          />
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-3 py-2 rounded  ${
              row.original.status === "Approved" ? "bg-success" : "bg-danger"
            }`}
          >
            {row.original.status}
          </span>
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

export default RejectedRecipesBySpecificUser;
