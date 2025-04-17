import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Delivery from "../../assets/Delivery.png";
import Farm from "../../assets/Farm.png";
import Factory from "../../assets/Factory.png";
import { motion } from "framer-motion";

const TrustSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const steps = [
    {
      icon: Farm,
      title: "Milk Collection",
      description: "Milk collection from healthy cattle",
      delay: 0,
    },
    {
      icon: Factory,
      title: "Quality Testing",
      description: "Quality tested for 100+ common adulterants",
      delay: 200,
    },
    {
      icon: Delivery,
      title: "Home Delivery",
      description: "Home delivery by 7 AM",
      delay: 400,
    },
  ];

  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8 text-gray-800 text-center"
        >
          Farm to Home, Everyday!
        </motion.h2>

        <div className="flex flex-col md:grid md:grid-cols-5 gap-6 items-center relative">
          {steps.map((step, index) => (
            <React.Fragment key={step.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: step.delay / 1000 }}
                viewport={{ once: true }}
                className="flex flex-col items-center relative group"
              >
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg relative overflow-visible transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="w-24 h-24 absolute bottom-0 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </motion.div>

              {index < steps.length - 1 && (
                <>
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-12 border-t-2 border-[#00B86C] border-dashed"></div>
                  </div>
                  <div className="block md:hidden flex items-center justify-center">
                    <div className="h-8 border-l-2 border-[#00B86C] border-dashed"></div>
                  </div>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;