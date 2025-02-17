import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4 mb-4">
            <h5>About Us</h5>
            <p>
              Welcome to RecipeShare! Discover, share, and explore delicious
              recipes from around the world. Let's make cooking fun and easy.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4 px-5">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/dessert" className="text-white text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-white text-decoration-none">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-white text-decoration-none">
                  Contact
                </Link>
              </li>
              {/* <li>
                <a href="/register" className="text-white text-decoration-none">
                  Signup
                </a>
              </li>
              <li>
                <a href="/login" className="text-white text-decoration-none">
                  Login
                </a>
              </li> */}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-md-4 mb-4">
            <h5>Contact Us</h5>
            <p>Have a question or want to share feedback? Get in touch!</p>
            <p>
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              recipesupport@example.com
            </p>
            <p>
              <FontAwesomeIcon icon={faPhone} className="me-2" />
              +1 234 567 890
            </p>
            <div className="mt-3">
              <a
                href="https://facebook.com"
                className="text-white me-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} className="fs-4" />
              </a>
              <a
                href="https://twitter.com"
                className="text-white me-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faTwitter} className="fs-4" />
              </a>
              <a
                href="https://instagram.com"
                className="text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} className="fs-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-4">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} RecipeShare. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
