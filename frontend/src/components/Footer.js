import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-orange-600 text-white py-6">
      <div className="container mx-auto text-center space-y-2">
        <p className="text-lg font-semibold">
          © {new Date().getFullYear()} Jithin S. All rights reserved.
        </p>
        <p className="text-sm">
          Built with React and Redux to create powerful, scalable web applications. Empowering developers to manage complex state in a simple and predictable way.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
