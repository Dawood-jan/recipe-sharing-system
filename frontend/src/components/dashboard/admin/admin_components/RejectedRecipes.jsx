import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { classNames } from "primereact/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Alert } from "@mui/material";
import { fetchAdminRejectedRecipesAction } from "../../../../redux/slice/recipesSlices";

const RejectedRecipes = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state?.users?.userAuth);

  useEffect(() => {
    dispatch(fetchAdminRejectedRecipesAction);
  }, [dispatch]);

  const { recipes, loading, error } = useSelector((state) => state?.recipes);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
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
        filterDisplay="row"
        globalFilterFields={["name"]}
        header={header}
        emptyMessage="No rejected recipes found."
      >
        <Column
          field="name"
          header="Name"
          filter
          filterPlaceholder="Search by name"
          style={{ minWidth: "12rem" }}
        />

        {/* <Column
             field="name"
             header="Name"
             filter
             filterPlaceholder="Search by name"
             style={{ minWidth: "12rem" }}
           /> */}
      </DataTable>
    </div>
  );
};

export default RejectedRecipes;
