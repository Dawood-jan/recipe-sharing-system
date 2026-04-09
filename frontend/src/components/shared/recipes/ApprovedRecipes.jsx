import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import Swal from "sweetalert2";
import {
  approvedRecipesAction,
  removeRecipeAction,
} from "../../../redux/slice/recipesSlices";
import { uploadUrl } from "../../../utils/baseURL";

const ApprovedRecipes = () => {
  const [visible, setVisible] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);

  const { userInfo } = useSelector((state) => state?.users?.userAuth);
  // console.log(userInfo)

  useEffect(() => {
    dispatch(approvedRecipesAction());
  }, [dispatch]);

  const { approvedRecipes, loading, error, isDeleted } = useSelector(
    (state) => state?.recipes
  );

  useEffect(() => {
    setRecipes(approvedRecipes);
  }, [approvedRecipes]);

  const imageBodyTemplate = (recipe) => {
    return (
      <img
        src={`${uploadUrl}${recipe?.image}`}
        alt="recipe image"
        className="w-24 rounded-full"
      />
    );
  };

  const ActionBodyTemplate = (recipe) => {
    return (
      <>
        <div className="card flex justify-content-center">
          <button
            onClick={() => setVisible(recipe)}
            className="bg-[#3C76D2] text-white px-4 py-1.5 rounded-xl hover:cursor-pointer"
          >
            View
          </button>
          {userInfo?.isContributor && (
            <>
              <button
                onClick={() =>
                  navigate(`/contributor/update-recipe/${recipe._id}`)
                }
                className="bg-[#41d23c] text-white px-4 rounded-xl hover:cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(recipe._id)}
                className="bg-[#d23c3f] text-white py-1 px-4 rounded-xl hover:cursor-pointer"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </>
    );
  };

  const handleDelete = async (id) => {
    await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(removeRecipeAction(id));
        await Swal.fire({
          title: "Reject!",
          text: "Recipe has been deleted successfully.",
          icon: "success",
        });
        setRecipes((prev) => prev.filter((r) => r._id !== id));
      }
    });
  };

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    // name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      <DataTable
        value={recipes}
        rows={10}
        dataKey="id"
        filters={filters}
        showGridlines
        globalFilterFields={["name"]}
        header={header}
        emptyMessage="No recipes found."
      >
        <Column header="Image" body={imageBodyTemplate}></Column>

        <Column field="name" header="Name" style={{ minWidth: "3rem" }} />

        <Column
          field="recipeType"
          header="Category"
          style={{ minWidth: "3rem" }}
        />

        <Column
          field="instructions"
          header="Instructions"
          body={(rowData) => {
            const text = rowData.instructions;
            const shortText =
              text.length > 50 ? text.slice(0, 50) + "..." : text;

            return <div dangerouslySetInnerHTML={{ __html: shortText }}></div>;
          }}
          style={{ minWidth: "12rem" }}
        />

        <Column header="Actions" body={ActionBodyTemplate}></Column>
      </DataTable>

      {/* modal */}
      {visible && (
        <Dialog
          header={
            visible && (
              <img
                src={`${uploadUrl}${visible.image}`}
                alt={visible.name}
                className="w-full h-48 rounded-full object-cover"
              />
            )
          }
          visible={visible}
          style={{ width: "50vw" }}
          onHide={() => {
            if (!visible) return;
            setVisible(false);
          }}
        >
          <Divider />
          <p
            className="m-0"
            dangerouslySetInnerHTML={{ __html: visible?.ingredients }}
          ></p>
          <Divider />
          <p
            className="m-0"
            dangerouslySetInnerHTML={{ __html: visible?.instructions }}
          ></p>
        </Dialog>
      )}
    </div>
  );
};

export default ApprovedRecipes;
