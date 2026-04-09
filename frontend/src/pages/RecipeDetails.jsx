import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Divider from '@mui/material/Divider';
import { fetchApprovedRecipesAction, fetchRecipeDetailsAction } from "../redux/slice/recipesSlices";
import { uploadUrl } from "../utils/baseURL";
import Loading from "../components/LoadingComp/LoadingComponent";

const RecipeDetails = () => {
  const dispatch = useDispatch();
  const { id, category } = useParams();
  // console.log(id)

  useEffect(() => {
    dispatch(fetchRecipeDetailsAction(id));
  }, [dispatch]);

  const { recipe, loading } = useSelector((state) => state?.recipes);

  console.log(recipe)

  return (
    <div className="h-full bg-white text-gray-800 p-6">
      {loading ? (
        <Loading />
      ) : recipe ? (
        <div className="space-y-12">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8  shadow-sm p-6 hover:shadow-lg transition"
          >
            {/* --- Left Side: Image --- */}
            <div className="flex justify-center">
              <img
                src={`${uploadUrl}${recipe.image}`}
                alt={recipe.name}
                className="w-full max-w-sm h-64 object-cover rounded-xl shadow-md"
              />
            </div>

            {/* --- Right Side: Details --- */}
            <div>
              <div className="mb-3">
                <video src={`${uploadUrl}${recipe.video}`} controls controlsList="nodownload"
                  disablePictureInPicture
                  className="w-full h-auto max-h-[400px] rounded-2xl shadow-md object-cover"></video>
              </div>

              <Divider />
              <h2 className="text-2xl font-semibold mb-2">Name:</h2>
              <h2 className=" mb-4"> {recipe.name}</h2>
              <Divider />
              <h2 className="text-2xl font-semibold mb-2">Ingredients:</h2>
              <p
                className="text-gray-700 mb-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: recipe.ingredients }}
              ></p>
              <Divider />
              <h2 className="text-2xl font-semibold mb-2">Instructions:</h2>
              <p
                className="text-gray-700 leading-relaxed text-justify"
                dangerouslySetInnerHTML={{ __html: recipe.instructions }}
              ></p>

              <div className="mt-6 flex justify-end">
                <Link
                  to={`/${category}`}
                  className="bg-[#3C76D2] text-white py-2 px-4 rounded-lg hover:bg-[#2c5cab] transition"
                >
                  Back to Category
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No recipes found for this category.
        </p>
      )}
    </div>
  );
};

export default RecipeDetails;
