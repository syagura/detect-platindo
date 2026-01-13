import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Camera } from 'lucide-react';

/**
 * Main Header Navigation Component
 */

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const navItems = [
        { label: 'About', path: '/about' },
        { label: 'Docs', path: '/docs' },
        { label: 'Contact', path: '/contact' },
    ];

    const handleLogoClick = () => {
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="absolute top-0 left-0 right-0 z-50 px-10 py-4">
            <nav className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Logo */}
                <Link 
                    to="/" 
                    onClick={handleLogoClick}
                    className="flex items-center gap-2 cursor-pointer z-50 hover:opacity-80 transition-opacity"
                >
                    <Camera className="w-8 h-8 text-white" />
                    <span className="text-white text-xl font-bold">DetectPlatIndo</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="text-white/80 hover:text-white transition-colors text-sm font-medium uppercase"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white z-50 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle mobile menu"
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                <div className="absolute top-0 left-0 w-full h-screen bg-dark/95 backdrop-blur-lg flex flex-col items-center justify-center space-y-8 md:hidden transition-all duration-300">
                    {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="text-white text-xl font-medium hover:text-purple4 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {item.label}
                    </Link>
                    ))}
                </div>
                )}
            </nav>
        </header>
    )
}

export default Header
