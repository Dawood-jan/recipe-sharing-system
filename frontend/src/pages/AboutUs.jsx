import React from "react";

const AboutUs = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Left Section: Image */}
        <div className="col-lg-6 col-md-12 mb-4">
          <img
            src="https://plus.unsplash.com/premium_photo-1677619680553-732e8e153db2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZCUyMHJlY2lwZXxlbnwwfHwwfHx8MA%3D%3D"
            alt="About Us"
            className="img-fluid rounded shadow"
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
          />
        </div>
  
        {/* Right Section: Text */}
        <div className="col-lg-6 col-md-12">
          <h2 className="mb-4 text-center text-md-start">About RecipeShare</h2>
          <p className="lead text-muted text-center text-md-start">
            At RecipeShare, we believe that cooking is an art that brings people
            together. Our mission is to create a platform where food lovers can
            share, discover, and explore a diverse collection of recipes from
            around the globe.
          </p>
          <p className="text-center text-md-start">
            Whether you're a professional chef or a home cook, our community is
            here to inspire your next meal. Share your favorite recipes, learn
            new techniques, and connect with fellow food enthusiasts.
          </p>
        </div>
      </div>
    </div>
  );
  
};

export default AboutUs;
