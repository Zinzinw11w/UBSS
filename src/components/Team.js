import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Team = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const teamMembers = [
    {
      name: "Victoria Sterling",
      title: "Chief Executive Officer",
      bio: "With over 25 years in private wealth management, Victoria leads our firm with unparalleled expertise in family office services and legacy planning.",
      image: "👩‍💼",
      specialties: ["Strategic Planning", "Family Governance", "Legacy Preservation"]
    },
    {
      name: "Marcus Chen",
      title: "Chief Investment Officer",
      bio: "Marcus brings deep expertise in alternative investments and portfolio optimization, having managed over $1.5B in client assets.",
      image: "👨‍💼",
      specialties: ["Portfolio Management", "Alternative Investments", "Risk Management"]
    },
    {
      name: "Eleanor Whitmore",
      title: "Head of Client Relations",
      bio: "Eleanor ensures every client receives exceptional service, coordinating our concierge banking and relationship management services.",
      image: "👩‍💼",
      specialties: ["Client Experience", "Concierge Services", "Relationship Management"]
    },
    {
      name: "Alexander Rothschild",
      title: "Senior Wealth Advisor",
      bio: "Alexander specializes in complex estate planning and tax optimization strategies for ultra-high-net-worth individuals and families.",
      image: "👨‍💼",
      specialties: ["Estate Planning", "Tax Strategy", "Wealth Transfer"]
    }
  ];

  return (
    <section id="team" className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-max">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary-900 mb-6">
            Meet Our Distinguished Team
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            Our team of seasoned professionals combines decades of experience with innovative thinking 
            to deliver exceptional results for our clients. Each member brings unique expertise and 
            unwavering commitment to excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 card-hover text-center"
            >
              <div className="text-6xl mb-4">{member.image}</div>
              <h3 className="text-xl font-serif font-semibold text-secondary-900 mb-2">
                {member.name}
              </h3>
              <p className="text-primary-600 font-medium mb-4">
                {member.title}
              </p>
              <p className="text-secondary-600 text-sm mb-6 leading-relaxed">
                {member.bio}
              </p>
              <div className="space-y-2">
                {member.specialties.map((specialty, specialtyIndex) => (
                  <div key={specialtyIndex} className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
                    {specialty}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-serif font-semibold text-secondary-900 mb-4">
              Why Our Team Makes the Difference
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="text-primary-600 text-xl">🎯</div>
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-2">Personalized Approach</h4>
                  <p className="text-sm text-secondary-600">Every strategy is tailored to your unique goals and circumstances.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-primary-600 text-xl">🔒</div>
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-2">Absolute Discretion</h4>
                  <p className="text-sm text-secondary-600">Your privacy and confidentiality are our highest priorities.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-primary-600 text-xl">📈</div>
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-2">Proven Results</h4>
                  <p className="text-sm text-secondary-600">Consistent performance across market cycles and economic conditions.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;


