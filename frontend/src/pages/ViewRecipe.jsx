import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ViewRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeData = async () => {
      // console.log(id);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/recipes/users-recipe/${id}`
        );

        console.log(response.data.recipeFound);

        setRecipe(response.data.recipeFound); // Set the recipe data
      } catch (err) {
        setError(err?.response?.data?.message); // Set error message
      }
    };

    fetchRecipeData();
  }, []);

  //   console.log(id);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-primary">{recipe.name}</h1>
      <div className="row ">
        {/* Image Section */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="card-img-top img-fluid rounded"
              style={{
                maxHeight: "250px",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* Recipe Details */}
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            {recipe.video && !recipe.video.includes("undefined") ? (
              <video controls src={recipe.video} className="w-100 mb-3"></video>
            ) : null}

            <h3 className="text-success mb-3">
              Category:{" "}
              <span className="text-secondary">{recipe.recipeType}</span>
            </h3>
            <h4 className="text-dark">Ingredients</h4>
            <div
              className="mb-4"
              style={{ whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{
                __html: recipe.ingredients,
              }}
            ></div>
            <h4 className="text-dark">Instructions</h4>
            <div
              style={{ whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{
                __html: recipe.instructions,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center mt-5">
        <Link
          className="btn btn-primary px-5 py-2 shadow"
          to={`/${recipe.recipeType}`}
        >
          Back to Recipes
        </Link>
      </div>
    </div>
  );
};

export default ViewRecipe;
