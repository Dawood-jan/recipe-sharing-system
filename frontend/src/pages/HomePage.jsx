import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Tabs, Tab, Container, Row, Col, Card } from "react-bootstrap";

const HomePage = () => {
  const { category } = useParams(); // Get the category directly from the URL
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  const categories = ["dessert", "diatery", "vegan"]; // Define your categories

  // Redirect to default category if an invalid category is provided
  useEffect(() => {
    if (!categories.includes(category)) {
      navigate("/dessert", { replace: true });
    }
  }, [category, navigate]);

  // Fetch recipes based on the current category
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/recipes/all-approved-recipes`,
          { params: { recipeType: category, status: "Approved" } }
        );
        console.log(response);
        setRecipes(response.data.approvedRecipes);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching recipes");
      }
    };

    fetchRecipes();
  }, [category]);

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">All Recipes</h2>
      <Tabs
        activeKey={category}
        onSelect={(tab) => navigate(`/${tab}`)} // Update URL when tab is changed
        className="mb-3"
      >
        {categories.map((cat) => (
          <Tab eventKey={cat} title={cat.toUpperCase()} key={cat}>
            <Row>
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <Col md={4} key={recipe._id} className="mb-4">
                    <Card>
                      <Card.Img
                        variant="top"
                        src={`${import.meta.env.VITE_BASE_URL}${recipe.image}`}
                        alt={recipe.name}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <Card.Body>
                        <Card.Title>{recipe.name}</Card.Title>
                        <Card.Text>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: recipe.instructions.substring(0, 50),
                            }}
                          ></span>
                        </Card.Text>
                        <button
                          className="bg-success px-3 py-1 me-1"
                          onClick={() => navigate(`/recipes/users-recipe/${recipe._id}`)}
                        >
                          View Recipe
                        </button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p className="text-center mt-3">No recipes found.</p>
              )}
            </Row>
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
};

export default HomePage;
