import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import {
  fetchRecipetAction,
  updateRecipeAction,
} from "../../../../redux/slice/recipesSlices";
import Loading from "../../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../../ErrorMsg/ErrorMsg";
import SuccessMsg from "../../../SuccessMsg/SuccessMsg";

const UpdateRecipe = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchRecipetAction(id));
  }, [dispatch, id]);

  const { recipe, loading, error, isUpdated } = useSelector(
    (state) => state?.recipes
  );

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [instructions, setInstructions] = useState(null);
  const [ingredients, setIngredients] = useState(null);
  const quillInstructionRef = useRef(null);
  const quillIngredientRef = useRef(null);
  const quillInstructionInstance = useRef(null);
  const quillIngredientInstance = useRef(null);
  const [file, setFile] = useState(null);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.name || "");
      setCategory(recipe.recipeType || "");
      setInstructions(recipe.instructions || "");
      setIngredients(recipe.ingredients || "");

      if (quillInstructionInstance.current) {
        quillInstructionInstance.current.root.innerHTML =
          recipe.instructions || "";
      }
      if (quillIngredientInstance.current) {
        quillIngredientInstance.current.root.innerHTML =
          recipe.ingredients || "";
      }
    }
  }, [recipe]);

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleVideoChange = (e) => {
    const videoFile = e.target.files[0];
    setVideo(videoFile);
  };

  useEffect(() => {
    // Quill for Instructions
    if (!quillInstructionInstance.current && quillInstructionRef.current) {
      quillInstructionInstance.current = new window.Quill(
        quillInstructionRef.current,
        {
          theme: "snow",
          placeholder: "Instruction",
          modules: {
            toolbar: [
              ["bold", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
            ],
          },
        }
      );

      quillInstructionInstance.current.on("text-change", () => {
        setInstructions(quillInstructionInstance.current.root.innerHTML);
      });
    }

    // Quill for Ingredients
    if (!quillIngredientInstance.current && quillIngredientRef.current) {
      quillIngredientInstance.current = new window.Quill(
        quillIngredientRef.current,
        {
          theme: "snow",
          placeholder: "Ingredients",
          modules: {
            toolbar: [
              ["bold", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
            ],
          },
        }
      );

      quillIngredientInstance.current.on("text-change", () => {
        setIngredients(quillIngredientInstance.current.root.innerHTML);
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateRecipeAction({
        title,
        ingredients,
        instructions,
        category,
        file,
        video,
        id,
      })
    );
  };

  return (
    <div className="flex justify-center">
      <style>
        {`
        .ql-editor {
          padding: 25px 15px;
        }
          .ql-container {
            height: 150px !important;
          }
          .ql-editor.ql-blank::before {
            font-style: normal !important;
            font-size: 16px;
            content: attr(data-placeholder);
          }

          .ql-hover:hover {
            border: 1px solid #202021;
          }
            .ql-active:focus {
                  border-color: #3e93ff
            }
        `}
      </style>

      <div className="w-[37%] shadow-2xl my-5">
        <form className="p-6 shadow  bg-white rounded-2xl">
          <h2 className="mb-4 text-2xl text-center">Update Recipe</h2>

          {error && <ErrorMsg message={error?.message} />}
          {isUpdated && <SuccessMsg message="Recipe updated successfully." />}

          {/* Title Input */}
          <div className="sm:col-span-3">
            <label
              htmlFor="title"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Name
            </label>
            <div className="mt-1 mb-2">
              <input
                id="title"
                type="text"
                name="title"
                value={title}
                onChange={handleChange}
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Quill Editor for Ingredients */}
          <div className="mt-3">
            {/* <label className="form-label">Ingredients</label> */}
            <div
              ref={quillIngredientRef}
              className="form-control ql-active"
            ></div>
          </div>

          {/* Quill Editor for Instructions */}
          <div className="mt-3">
            {/* <label className="form-label">Instructions</label> */}
            <div
              ref={quillInstructionRef}
              className="form-control ql-active"
            ></div>
          </div>

          {/* image */}
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="cover-photo"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Upload Images
            </label>
            <div className="mt-1 sm:col-span-2 sm:mt-0">
              <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-input"
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 1MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* video */}
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="cover-photo"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Upload Video
            </label>
            <div className="mt-1 sm:col-span-2 sm:mt-0">
              <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload files</span>
                      <input
                        type="file"
                        id="video-input"
                        name="video"
                        accept="video/*"
                        onChange={handleVideoChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">mp4 up to 20MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* category */}
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-900"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block mt-2 w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            >
              <option value="">Select Category</option>
              <option value="dessert">Dessert</option>
              <option value="diatery">Diatery</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-end mt-5">
            {loading ? (
              <Button variant="contained" disabled>
                {" "}
                Creating... <Loading />
              </Button>
            ) : (
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRecipe;
