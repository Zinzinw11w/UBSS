import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const stats = [
    { number: "150+", label: "Years Combined Experience" },
    { number: "$2.5B+", label: "Assets Under Management" },
    { number: "98%", label: "Client Retention Rate" },
    { number: "24/7", label: "Concierge Support" }
  ];

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary-900 mb-6">
              A Legacy of Trust and Excellence
            </h2>
            <p className="text-lg text-secondary-600 mb-6 leading-relaxed">
              For over three decades, WealthGuard has been the trusted partner of discerning individuals 
              and families who demand nothing less than exceptional wealth management services. Our 
              commitment to excellence, discretion, and personalized attention has made us the preferred 
              choice for high-net-worth clients worldwide.
            </p>
            <p className="text-lg text-secondary-600 mb-8 leading-relaxed">
              We understand that true wealth extends beyond financial assets. It encompasses legacy, 
              values, and the ability to create meaningful impact. Our holistic approach ensures that 
              every aspect of your financial life is carefully orchestrated to align with your 
              deepest aspirations and long-term vision.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl"
                >
                  <div className="text-3xl font-serif font-bold text-primary-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-secondary-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center text-primary-800">
                <div className="text-6xl mb-4">🏛️</div>
                <p className="text-lg font-medium">Premium Wealth Management</p>
                <p className="text-sm opacity-75">Est. 1987</p>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg"
            >
              <div className="text-2xl">💎</div>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-full p-4 shadow-lg"
            >
              <div className="text-2xl">📊</div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-serif font-semibold mb-4">
              Our Commitment to You
            </h3>
            <p className="text-lg opacity-90 max-w-3xl mx-auto leading-relaxed">
              We pledge to maintain the highest standards of integrity, confidentiality, and performance 
              in all our interactions. Your success is our legacy, and we are honored to be your 
              trusted financial partner.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

