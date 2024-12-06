// 'use client';
//
// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';
//
// const relatedProducts = [
//   {
//     id: 1,
//     name: "Auriculares inalámbricos premium",
//     price: 129990,
//     image: "/placeholder.svg?height=100&width=100",
//     rating: 4.5,
//     reviews: 128
//   },
//   {
//     id: 2,
//     name: "Smartwatch deportivo",
//     price: 89990,
//     image: "/placeholder.svg?height=100&width=100",
//     rating: 4.2,
//     reviews: 95
//   },
//   {
//     id: 3,
//     name: "Cargador inalámbrico rápido",
//     price: 34990,
//     image: "/placeholder.svg?height=100&width=100",
//     rating: 4.7,
//     reviews: 203
//   },
//   {
//     id: 4,
//     name: "Funda protectora resistente",
//     price: 19990,
//     image: "/placeholder.svg?height=100&width=100",
//     rating: 4.0,
//     reviews: 76
//   }
// ];
//
// export default function RelatedProducts() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//
//   const nextProduct = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % relatedProducts.length);
//   };
//
//   const prevProduct = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + relatedProducts.length) % relatedProducts.length);
//   };
//
//   useEffect(() => {
//     const interval = setInterval(() => {
//       nextProduct();
//     }, 3000); // Rotate every 3 seconds
//
//     return () => clearInterval(interval);
//   }, []);
//
//   return (
//     <div className="bg-[#9d9d9d] backdrop-blur-lg rounded-lg shadow-md p-4 text-[#ffffff]">
//       <h3 className="text-xl font-bold mb-4 text-[#c69393] text-center flex items-center justify-center">
//         <span className="mr-2">
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
//             <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
//           </svg>
//         </span>
//         Potencia tu Rendimiento
//       </h3>
//       <div className="relative">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentIndex}
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.3 }}
//             className="flex flex-col items-center"
//           >
//             <img
//               src={relatedProducts[currentIndex].image}
//               alt={relatedProducts[currentIndex].name}
//               className="w-32 h-32 object-cover rounded-lg mb-2"
//             />
//             <h4 className="text-md font-medium text-[#c69393] mb-1 text-center">
//               {relatedProducts[currentIndex].name}
//             </h4>
//             <p className="text-lg font-bold mb-1">
//               ${relatedProducts[currentIndex].price.toLocaleString()}
//             </p>
//             <div className="flex items-center mb-2">
//               <span className="text-[#f0c14b] mr-1">★★★★★</span>
//               <span className="text-xs text-gray-300">
//                 ({relatedProducts[currentIndex].reviews} reseñas)
//               </span>
//             </div>
//             <p className="text-xs text-[#f0c14b] mb-2">¡Quedan solo 3 en stock!</p>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="bg-[#c69393] text-[#ffffff] px-4 py-2 rounded-full font-medium text-sm flex items-center"
//             >
//               <ShoppingCart className="mr-2" size={16} />
//               Agregar al carrito
//             </motion.button>
//           </motion.div>
//         </AnimatePresence>
//         <button
//           onClick={prevProduct}
//           className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#c69393] text-[#ffffff] p-1 rounded-full opacity-50 hover:opacity-100 transition-opacity"
//         >
//           <ChevronLeft size={20} />
//         </button>
//         <button
//           onClick={nextProduct}
//           className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#c69393] text-[#ffffff] p-1 rounded-full opacity-50 hover:opacity-100 transition-opacity"
//         >
//           <ChevronRight size={20} />
//         </button>
//       </div>
//       <div className="mt-4 text-center">
//         <p className="text-xs text-gray-300">
//           Los clientes que compraron este producto también adquirieron:
//         </p>
//         <p className="text-sm text-[#c69393] font-medium mt-1">
//           {relatedProducts[(currentIndex + 1) % relatedProducts.length].name}
//         </p>
//       </div>
//     </div>
//   );
// }
//
export default function RelatedProducts() {
  // TODO: Implement RelatedProducts component in the future
  return null;
}

