'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ShoppingBag, Truck, CreditCard } from 'lucide-react';

export default function OrderSummary({ orderData, shippingCost, isPaymentStep, cartData }) {
  const [isExpanded, setIsExpanded] = useState(true);

  console.log('OrderSummary - cartData:', cartData);

  const subtotal = cartData.subtotal;
  const shipping = shippingCost ?? cartData.shipping;
  const total = cartData.total;

  if (cartData.isLoading) {
    return <div>Cargando resumen del pedido...</div>;
  }

  if (isPaymentStep) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#ffffff] backdrop-blur-lg rounded-lg shadow-lg overflow-hidden"
    >
      <div className="bg-[#c69393] text-white p-4 flex justify-between items-center cursor-pointer"
           onClick={() => setIsExpanded(!isExpanded)}>
        <h2 className="text-xl font-semibold flex items-center">
          <ShoppingBag className="mr-2" />
          Resumen del Pedido
        </h2>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4"
          >
            {cartData.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between mb-4 p-2 bg-gray-100 rounded"
              >
                <div className="flex items-center">
                  <img 
                    src={item.images.thumbnail || "/placeholder.svg?height=50&width=50"} 
                    alt={item.name} 
                    className="w-12 h-12 object-cover rounded mr-4"
                  />
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Precio unitario: ${item.price.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</p>
                  </div>
                </div>
                <span className="text-[#c69393] font-bold">${(item.price * item.quantity).toLocaleString('es-CL', { maximumFractionDigits: 0 })}</span>
              </motion.div>
            ))}
            
            <div className="border-t border-[#c69393] mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</span>
              </div>
              {shippingCost !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Truck className="mr-2 text-[#c69393]" size={18} />
                    Envío
                  </span>
                  <span>${shipping.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</span>
                </div>
              )}
              <motion.div
                className="flex justify-between font-bold text-lg mt-4 bg-[#c69393] text-white p-2 rounded"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <CreditCard className="mr-2" size={18} />
                  Total
                </span>
                <span>${total.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isExpanded && (
        <div className="p-4 text-center">
          <span className="font-bold text-lg text-[#c69393]">${total.toLocaleString()}</span>
          <span className="text-sm text-gray-500 ml-2">({cartData.items.length} productos)</span>
        </div>
      )}
    </motion.div>
  );
}

