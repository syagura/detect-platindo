import React from 'react';
import HeroSection from '../components/section/Home/Hero';

/**
 * Home Page Component
 * Main landing page with hero section
 */

const Home = () => {
    return (
        <section className='relative min-h-screen bg-dark overflow-hidden'>  
            <HeroSection/>
        </section>
    )
}

export default Home
