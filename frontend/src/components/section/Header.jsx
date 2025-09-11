import React from 'react';

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-10 py-4">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500"></div> */}
          <span className="text-white text-xl font-semibold">LOGO</span>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
            ABOUT
          </a>
          <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
            DOCS
          </a>
          <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
            CONTACT
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  );
};

export default Header;