import React, { useContext, useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import axios from "axios";
import { auth } from "../../context/AuthContext";
import { Alert } from "@mui/material";

const CreateRecipe = () => {
  const [recipeData, setRecipeData] = useState({
    title: "",
  });

  const [category, setCategory] = useState(null);
  const [instructions, setInstructions] = useState(null);
  const [ingredients, setIngredients] = useState(null);

  const quillInstructionRef = useRef(null);
  const quillIngredientRef = useRef(null);
  const quillInstructionInstance = useRef(null);
  const quillIngredientInstance = useRef(null);

  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [video, setVideo] = useState(null);
  const { userAuth } = useContext(auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData({ ...recipeData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleVideoChange = (e) => {
    const videoFile = e.target.files[0];
    setVideo(videoFile);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { title } = recipeData;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("ingredients", ingredients);
      formData.append("instructions", instructions);
      formData.append("recipeType", category);

      if (file) {
        formData.append("file", file);
      }

      if (video) {
        formData.append("video", video);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/recipes/create-recipe`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userAuth.user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        await swal("Success", "Recipe created waiting for approval!", {
          icon: "success",
          buttons: {
            confirm: {
              className: "btn btn-success",
            },
          },
        });

        setRecipeData({ title: "" });
        setCategory("");
        setFile(null);
        setVideo(null);
        document.getElementById("file-input").value = "";
        document.getElementById("video-input").value = "";
        // Reset Quill editors
        if (quillInstructionInstance.current) {
          quillInstructionInstance.current.setText("");
        }
        if (quillIngredientInstance.current) {
          quillIngredientInstance.current.setText("");
        }
      } else {
        setError(response.data.message);
      }

    
    } catch (error) {
      const errMessage = error.response?.data?.message;
      setError(errMessage);
    }
  };

  return (
    <div className="container mt-5">
      <style>
        {`
        .ql-editor {
          padding: 12px 0;
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

      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-5 col-sm-8 col-8">
          <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
            <h2 className="mb-4 text-center">Create Recipe</h2>

            {/* {error && <Alert severity="error" className="d-flex align-items-center">{error}</Alert>} */}
            {error && (
              <Alert
                severity="error"
                style={{ display: "flex", alignItems: "center" }}
              >
                {error}
              </Alert>
            )}

            {/* Title Input */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Name
              </label>
              <input
                type="text"
                autoFocus
                className="form-control"
                id="title"
                name="title"
                value={recipeData.title}
                onChange={handleChange}
                placeholder="Enter recipe name"
              />
            </div>

            {/* Quill Editor for Ingredients */}
            <div className="mb-3">
              <label className="form-label">Ingredients</label>
              <div
                ref={quillIngredientRef}
                className="form-control ql-active"
              ></div>
            </div>

            {/* Quill Editor for Instructions */}
            <div className="mb-3">
              <label className="form-label">Instructions</label>
              <div
                ref={quillInstructionRef}
                className="form-control ql-active"
              ></div>
            </div>

            {/* File Upload */}
            <div className="mb-3">
              <label htmlFor="file-input" className="form-label">
                Upload Image
              </label>
              <input
                type="file"
                className="form-control"
                id="file-input"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Video Upload */}
            <div className="mb-3">
              <label htmlFor="video-input" className="form-label">
                Upload Video (Optional)
              </label>
              <input
                type="file"
                className="form-control"
                id="video-input"
                accept="video/*"
                onChange={handleVideoChange}
              />
            </div>

            {/* Category Select */}
            <div className="mb-4">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                className="form-select"
                id="category"
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="">Select category</option>
                <option value="dessert">Dessert</option>
                <option value="diatery">Diatery</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="text-end">
              <button type="submit" className="btn btn-primary px-4">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
