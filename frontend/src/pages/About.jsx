import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-16 mt-5">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About Our Recipe Sharing Platform
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Discover, share, and enjoy delicious recipes from chefs and home cooks alike.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto space-y-12 text-lg leading-relaxed">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">🎯 Our Mission</h2>
          <p>
            Our mission is to connect food enthusiasts worldwide by providing a platform to share and explore diverse recipes. 
            From everyday meals to gourmet creations, we empower users to discover culinary inspiration and showcase their cooking skills.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">🍳 What We Offer</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>A wide collection of recipes including vegan, desserts, and traditional cuisines.</li>
            <li>Step-by-step instructions with images and videos to guide cooking.</li>
            <li>Ability for contributors to post and manage their own recipes.</li>
            <li>Community-driven content to inspire and learn from fellow cooks.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">💡 Why Choose Us</h2>
          <p>
            Whether you’re a beginner or a seasoned chef, our platform offers an engaging space to explore new flavors and cooking techniques. 
            Share your culinary creations, and become part of a vibrant recipe-sharing community.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">🤝 Our Promise</h2>
          <p>
            We prioritize ease of use and community engagement. With intuitive recipe submission, secure user accounts, and responsive support, 
            we ensure that your journey of sharing and discovering recipes is enjoyable and rewarding.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
