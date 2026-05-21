import React from 'react';
import { motion } from 'framer-motion';

const defaultDoctorImage = process.env.PUBLIC_URL + '/images/default-doctor.svg';

const Doctors = () => {
  const doctors = [
    {
      name: 'Dr. M.M. Sheik Sameerudeen',
      qualifications: 'BDS., MDS (OMFS), F. Implantology',
      specialization: 'Consultant Oral Maxillofacial Surgeon & Implantologist',
      regNo: 'Reg. No: 19469',
      image: process.env.PUBLIC_URL + '/images/sammer.jpeg',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Dr. A. Fahmitha Sameerudeen',
      qualifications: 'BDS., MBA (H.M), FMAC',
      specialization: 'Dental Surgeon & Cosmetologist',
      regNo: 'Reg. No: 27733',
      image: '',
      color: 'from-purple-500 to-pink-500'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = defaultDoctorImage;
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 bg-white dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-600 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            Our Doctors
          </h2>
          <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto"
        >
          {doctors.map((doctor, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="doctor-card bg-white dark:bg-slate-800 rounded-[28px] shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-center group p-6"
            >
              <div className="doctor-image-container mb-4 md:mb-6">
                <img
                  src={doctor.image || defaultDoctorImage}
                  alt={doctor.name}
                  onError={handleImageError}
                  className="doctor-image"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                {doctor.name}
              </h3>
              <p className="text-sm md:text-base text-primary-500 dark:text-blue-400 font-semibold mb-2 md:mb-3">
                {doctor.qualifications}
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-2">
                {doctor.specialization}
              </p>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                {doctor.regNo}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Doctors;