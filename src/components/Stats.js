import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../contexts/LanguageContext';

const Stats = () => {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
      </div>
      <div className="container-max">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {/* $3.8 billion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center relative z-10 sm:col-span-2 lg:col-span-1"
          >
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              $3.8 billion
            </div>
            <div className="text-gray-300 text-base sm:text-lg lg:text-xl font-medium">
              {t('totalVolume')}
            </div>
          </motion.div>

          {/* 350+ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center relative z-10"
          >
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              350+
            </div>
            <div className="text-gray-300 text-base sm:text-lg lg:text-xl font-medium">
              {t('activeUsers')}
            </div>
          </motion.div>

          {/* 1.2 million */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center relative z-10"
          >
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              1.2 million
            </div>
            <div className="text-gray-300 text-base sm:text-lg lg:text-xl font-medium">
              {t('satisfaction')}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;