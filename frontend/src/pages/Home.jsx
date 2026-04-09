import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Divider from "@mui/material/Divider";
import { fetchApprovedRecipesAction } from "../redux/slice/recipesSlices";
import { uploadUrl } from "../utils/baseURL";
import Loading from "../components/LoadingComp/LoadingComponent";

const Home = () => {
  const dispatch = useDispatch();
  const { category } = useParams();
  // console.log(category)
  const navigate = useNavigate();
  const categories = ["dessert", "diatery", "vegan"];

  // Handle invalid category in URL
  useEffect(() => {
    if (!categories.includes(category)) {
      navigate("/dessert", { replace: true });
    }
  }, [category, navigate]);

  useEffect(() => {
    if (category) {
      dispatch(fetchApprovedRecipesAction({ category, status: "Approved" }));
    }
  }, [category, dispatch]);

  const { recipes, loading } = useSelector((state) => state?.recipes);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Tabs */}
      <ul className="flex justify-center space-x-6 border-b border-gray-200 pb-2 mt-14">
        {categories.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => navigate(`/${cat}`)}
              className={`pb-1 border-b-2 font-medium transition ${
                category === cat
                  ? "text-blue-600 border-blue-600 cursor-pointer"
                  : "text-gray-900 cursor-pointer hover:text-blue-600 hover:border-blue-600 border-transparent"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/*  Recipes List*/}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <Loading size={25} />
        ) : recipes && recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="border rounded-xl shadow-sm p-4 hover:shadow-lg transition"
            >
              <img
                src={`${uploadUrl}${recipe.image}`}
                alt={recipe.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />

              <Divider />

              <div className="my-5">
                <h3 className="text-lg font-semibold">{recipe.name}</h3>
                <p
                  className="text-sm text-gray-600 mt-2 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: recipe.instructions?.slice(0, 100),
                  }}
                ></p>
              </div>
              <Divider />

              <div className="text-end my-5">
                <Link
                  to={`${recipe._id}`}
                  className="bg-[#3C76D2] hover:bg-[#2c5cab] transition text-white py-2 px-4 rounded-lg hover:cursor-pointer"
                >
                  Recipe Detail
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No recipes found for this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
