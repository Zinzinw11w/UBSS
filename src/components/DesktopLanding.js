import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Stats from './Stats';
import Features from './Features';
import Services from './Services';
import Footer from './Footer';

export default function DesktopLanding() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <Hero />
        <Stats />
        <Features />
        <Services />
      </main>
      <Footer />
    </div>
  );
}



