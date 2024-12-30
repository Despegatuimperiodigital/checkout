'use client';

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// const testimonials = [
//   {
//     id: 1,
//     text: "Los auriculares que compré son increíbles. La calidad de sonido es excepcional y el servicio al cliente fue excelente.",
//     author: "María G.",
//     product: "Auriculares inalámbricos premium"
//   },
//   {
//     id: 2,
//     text: "Mi nuevo smartwatch es perfecto para mis entrenamientos. La batería dura muchísimo y las funciones son muy útiles.",
//     author: "Carlos R.",
//     product: "Smartwatch deportivo"
//   },
//   {
//     id: 3,
//     text: "El cargador inalámbrico es muy conveniente y rápido. Ya no tengo que preocuparme por los cables enredados.",
//     author: "Ana L.",
//     product: "Cargador inalámbrico rápido"
//   }
// ];

export default function Testimonials() {
  // TODO: Implement Testimonials component in the future
  return null;

  // const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  // return (
  //   <div className="bg-[#353535] rounded-lg p-6 pb-4 shadow-lg border-2 border-[#5da872]">
  //     <h3 className="text-xl font-semibold mb-2 text-[#5da872]">Lo que dicen nuestros clientes</h3>
  //     <p className="text-sm text-[#ffffff] mb-4">Últimas 24 horas de ofertas exclusivas</p>
  //     <AnimatePresence mode="wait">
  //       <motion.div
  //         key={currentTestimonial}
  //         initial={{ opacity: 0, y: 20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         exit={{ opacity: 0, y: -20 }}
  //         transition={{ duration: 0.5 }}
  //         className="space-y-2"
  //       >
  //         <div className="flex items-center mb-2">
  //           <span className="text-[#f0c14b] text-2xl mr-2">★★★★★</span>
  //           <span className="text-[#ffffff] text-sm">Calificación verificada</span>
  //         </div>
  //         <p className="text-[#ffffff] italic">"{testimonials[currentTestimonial].text}"</p>
  //         <p className="text-[#5da872] font-semibold">{testimonials[currentTestimonial].author}</p>
  //         <p className="text-[#ffffff] text-sm">Producto: {testimonials[currentTestimonial].product}</p>
  //         <p className="text-[#f0c14b] text-sm mt-2">Compra verificada | Reseña reciente</p>
  //       </motion.div>
  //     </AnimatePresence>
  //   </div>
  // );
}

