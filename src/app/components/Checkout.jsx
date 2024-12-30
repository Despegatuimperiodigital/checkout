'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmailStep from './checkout/EmailStep';
import PersonalInfoStep from './checkout/PersonalInfoStep';
import ShippingStep from './checkout/ShippingStep';
import PaymentStep from './checkout/PaymentStep';
import OrderSummary from './checkout/OrderSummary';
import RelatedProducts from './checkout/RelatedProducts';
import Testimonials from './Testimonials';
import useCartData from '../../hooks/useCartData';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    email: '',
    personalInfo: {},
    shipping: {},
    payment: {},
    cartTotal: 0,
    cartItems: [],
    cartWeight: 0
  });

  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    region: '',
    comuna: '',
    additionalInfo: '',
    type: 'delivery',
    ws_region_name: '',
    ws_region_id: '',
    ws_comuna_name: '',
    ws_comuna_id: '',
    shipping_cost: 0,
    shipping_method: ''
  });

  const [comunas, setComunas] = useState([]);


  const cartData = useCartData();
  console.log('Checkout - cartData:', cartData);

  // Actualizar orderData cuando cartData cambie
  useEffect(() => {
    if (!cartData.isLoading && !cartData.error) {
      setOrderData(prev => ({
        ...prev,
        cartTotal: cartData.total,
        cartItems: cartData.items,
        cartWeight: cartData.weight
      }));
    }
  }, [cartData]);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const updateOrderData = (type, data) => {
    setOrderData({ ...orderData, [type]: data });
  };

  // Mostrar estado de carga si es necesario
  if (cartData.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f7f7f7] to-[#eeeeee] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#397e4c]"></div>
      </div>
    );
  }

  // Mostrar error si es necesario
  if (cartData.error) {
    console.error('Error al cargar el carrito:', cartData.error);
    // Continuar con datos de prueba
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f7f7] to-[#eeeeee] pt-6 pb-12 text-[#222222]">
      <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-center mb-4">
  <img 
    src="https://www.cruzeirogomas.cl/wp-content/uploads/sites/2/2024/11/cropped-logo_cruzeirogomas_mediano_1.png"
    alt="Cruzeiro Gomas"
    className="h-8 w-auto object-contain"
  />
</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-[#ffffff] rounded-lg shadow-2xl p-6 text-[#222222] flex flex-col h-full">
                  {step === 1 && (
                    <div className="flex-grow">
                      <EmailStep 
                        nextStep={nextStep}
                        updateOrderData={updateOrderData}
                        initialEmail={orderData.email}
                      />
                      <div className="hidden md:block mt-8">
                        <Testimonials />
                      </div>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="flex-grow">
                      <PersonalInfoStep
                        nextStep={nextStep}
                        prevStep={prevStep}
                        updateOrderData={updateOrderData}
                        cartTotal={orderData.cartTotal}
                        shippingDetails={shippingDetails}
                        setShippingDetails={setShippingDetails}
                        comunas={comunas}
                        setComunas={setComunas}
                      />
                    </div>
                  )}
                  {step === 3 && (
                    <div className="flex-grow">
                      <ShippingStep
                        nextStep={nextStep}
                        prevStep={prevStep}
                        updateOrderData={updateOrderData}
                        orderData={orderData}
                        shippingDetails={shippingDetails}
                        setShippingDetails={setShippingDetails}
                        comunas={comunas}
                        setComunas={setComunas}
                      />
                    </div>
                  )}
                  {step === 4 && (
                    <div className="flex-grow">
                      <PaymentStep
                        prevStep={prevStep}
                        updateOrderData={updateOrderData}
                        orderData={orderData}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <OrderSummary orderData={orderData} cartData={cartData} shippingCost={orderData.shipping?.shipping_cost} isPaymentStep={step === 4} />
                <RelatedProducts step={step} cartTotal={orderData.cartTotal} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

