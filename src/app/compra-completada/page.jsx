'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PurchaseConfirmation from './PurchaseConfirmation';
import PurchaseDetails from './PurchaseDetails';
import { fetchOrderData  } from '../../hooks/orderApi';

// Función para extraer el ID y la key de la URL
function getOrderParams() {
  if (typeof window === 'undefined') return { orderId: null, orderKey: null };
  fetchOrderData();
  const pathname = window.location.search;
  const searchParams = new URLSearchParams(window.location.search);
  console.log(window.location.search)
  // Extraer orderId del path /order-received/13921/
  const orderIdMatch = pathname.match(/order-received\/(\d+)/);
  console.log(orderIdMatch)
  const orderId = orderIdMatch ? orderIdMatch[1] : null;
  console.log(orderId)
  // Extraer key del query parameter
  const orderKey = searchParams.get('key');
  
  return { orderId, orderKey };
}



export default function CompraCompletada() {
  const [orderData, setOrderData] = useState(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { orderId, orderKey } = getOrderParams();
    
    if (!orderId || !orderKey) {
      setError('Información de orden no válida');
      return;
    }

    const loadOrder = async () => {
      try {
        const data = await fetchOrderData(orderId, orderKey);
        setOrderData(data);
        
        // Cambiar al paso de detalles después de 3 segundos
        setTimeout(() => {
          setStep(2);
        }, 3000);
      } catch (err) {
        setError(err.message);
      }
    };

    loadOrder();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#397e4c] to-[#5da872] py-12 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#397e4c] to-[#5da872] py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#397e4c] to-[#5da872] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <PurchaseConfirmation orderNumber={orderData.orderNumber} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PurchaseDetails orderData={orderData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}