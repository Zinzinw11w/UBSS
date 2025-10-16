import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-16 sm:pt-20 overflow-hidden">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 lg:space-y-8 text-center lg:text-left"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-4 lg:mb-6">
              Buy, trade, and hold<br />
              <span className="text-gradient">350+ cryptocurrencies</span><br />
              on the best platform.
            </h1>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center lg:justify-start space-x-3 hover:bg-gray-800 transition-colors duration-300 mx-auto lg:mx-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="hidden sm:inline">Available on the App Store</span>
              <span className="sm:hidden">App Store</span>
            </motion.button>
          </motion.div>

          {/* Right Content - Mobile Images */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center items-center mt-8 lg:mt-0"
          >
            {/* Mobile Layout - Single Phone */}
            <div className="lg:hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative z-10"
              >
                <img 
                  src="https://hnw-ubs.com/static/img/home_iphone11.80c4d197.png" 
                  alt="UBS Trading App - iPhone 11" 
                  className="w-64 sm:w-80 h-auto drop-shadow-2xl floating"
                />
              </motion.div>
            </div>

            {/* Desktop Layout - Two Phones */}
            <div className="hidden lg:flex relative justify-center items-center">
              {/* Left Phone Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative z-10"
              >
                <img 
                  src="https://hnw-ubs.com/static/img/home_iphone11.80c4d197.png" 
                  alt="UBS Trading App - iPhone 11" 
                  className="w-72 xl:w-80 h-auto drop-shadow-2xl floating"
                />
              </motion.div>

              {/* Right Phone Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative -ml-16 xl:-ml-24"
              >
                <img 
                  src="https://hnw-ubs.com/static/img/home_iphone22.d98a82af.png" 
                  alt="UBS Trading App - iPhone 22" 
                  className="w-72 xl:w-80 h-auto drop-shadow-2xl floating-delayed"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
