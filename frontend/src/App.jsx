import { Route, Routes, BrowserRouter, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";
import Signup from "./pages/Forms/Signup";
import Login from "./pages/Forms/Login";
import AdminDashboard from "./components/dashboard/admin/admin_dashboard/AdminDashboard";
import ContributorDashboard from "./components/dashboard/contributor/contributor_dashboard/ContributorDashboard";
import AdminRoutes from "./components/AuthRoute/AdminRoutes";
import PendingRecipes from "./components/shared/recipes/PendingRecipes";
import CreateRecipe from "./components/dashboard/contributor/contributor_components/CreateRecipe";
import Home from "./pages/Home";
import RecipeDetails from "./pages/RecipeDetails";
import UpdateProfile from "./components/shared/user/UpdateProfile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./components/shared/user/Profile";
import AllUsers from "./pages/AllUsers";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import NotAuthorised from "./components/NotAuthorised/NotAuthorised";
import ApprovedRecipes from "./components/shared/recipes/ApprovedRecipes";
import RejectedRecipes from "./components/shared/recipes/RejectedRecipes";
import UpdateRecipe from "./components/dashboard/contributor/contributor_components/UpdateRecipe";

function App() {
  const { userInfo } = useSelector((state) => state?.users?.userAuth);
  const { category } = useParams();
  // console.log(category);
  const isAdmin = userInfo?.isAdmin ? true : false;
  const isContributor = userInfo?.isContributor ? true : false;

  return (
    <>
      <BrowserRouter>
        {!isAdmin && !isContributor && <Navbar />}

        <Routes>
          {/* admin routes */}
          <Route
            path="admin"
            element={
              <AdminRoutes>
                <AdminDashboard />
              </AdminRoutes>
            }
          >
            <Route
              path="pending-recipes"
              element={
                <AdminRoutes>
                  <PendingRecipes />
                </AdminRoutes>
              }
            />

            <Route
              path="approved-recipes"
              element={
                <AdminRoutes>
                  <ApprovedRecipes />
                </AdminRoutes>
              }
            />

            <Route
              path="rejected-recipes"
              element={
                <AdminRoutes>
                  <RejectedRecipes />
                </AdminRoutes>
              }
            />

            {/* <Route
              path="rejected-recipes"
              element={
                <AdminRoutes>
                  <RejectedRecipes />
                </AdminRoutes>
              }
            /> */}

            <Route
              path="update-profile"
              element={
                <AdminRoutes>
                  <UpdateProfile />
                </AdminRoutes>
              }
            />

            <Route
              path="profile"
              element={
                <AdminRoutes>
                  <Profile />
                </AdminRoutes>
              }
            />
          </Route>

          {/* contributor routes */}
          <Route
            path="contributor"
            element={
              <AuthRoute>
                <ContributorDashboard />
              </AuthRoute>
            }
          >
            <Route
              path="create-recipe"
              element={
                <AuthRoute>
                  <CreateRecipe />
                </AuthRoute>
              }
            />

            <Route
              path="pending-recipes"
              element={
                <AuthRoute>
                  <PendingRecipes />
                </AuthRoute>
              }
            />

            <Route
              path="approved-recipes"
              element={
                <AuthRoute>
                  <ApprovedRecipes />
                </AuthRoute>
              }
            />

            <Route
              path="rejected-recipes"
              element={
                <AuthRoute>
                  <RejectedRecipes />
                </AuthRoute>
              }
            />

            <Route
              path="update-profile"
              element={
                <AuthRoute>
                  <UpdateProfile />
                </AuthRoute>
              }
            />

            <Route
              path="update-recipe/:id"
              element={
                <AuthRoute>
                  <UpdateRecipe />
                </AuthRoute>
              }
            />

            <Route
              path="profile"
              element={
                <AuthRoute>
                  <Profile />
                </AuthRoute>
              }
            />
          </Route>

          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/:category" element={<Home />} />
          <Route path="/:category/:id" element={<RecipeDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/all-users"
            element={
              <AdminRoutes>
                <AllUsers />
              </AdminRoutes>
            }
          />

          <Route path="/not-authorized" element={<NotAuthorised />} />
        </Routes>
        {!isAdmin && !isContributor && <Footer />}
      </BrowserRouter>
    </>
  );
}

export default App;
