import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Recipe Sharing System */}
          <div>
            <h5 className="text-xl font-semibold mb-2 text-white">
              About RecipeShare
            </h5>
            <p className="text-sm leading-relaxed">
              RecipeShare is a platform where food enthusiasts can share,
              explore, and discover recipes from around the world. Our mission
              is to make cooking enjoyable, easy, and accessible for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xl font-semibold mb-2 text-white">
              Quick Links
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-yellow-400">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:text-yellow-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-yellow-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="text-xl font-semibold mb-2 text-white">
              Get in Touch
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                Email:{" "}
                <a
                  href="mailto:support@recipeshare.com"
                  className="hover:text-yellow-400"
                >
                  support@recipeshare.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a href="tel:+923001234567" className="hover:text-yellow-400">
                  +92 300 1234567
                </a>
              </li>
              <li>Location: Islamabad, Pakistan</li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <p className="mt-10 text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} RecipeShare. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
