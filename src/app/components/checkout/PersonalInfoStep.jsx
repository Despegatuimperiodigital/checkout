'use client';

import { useState, useEffect } from 'react';
import { shippingCosts } from '../../data/shipping-costs';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, ArrowRight, Package } from 'lucide-react';

export default function PersonalInfoStep({ nextStep, prevStep, updateOrderData, cartTotal }) {
  const [personalInfo, setPersonalInfo] = useState({
    type: 'personal',
    name: '',
    rut: '',
    phone: '',
    // Campos para empresa
    businessName: '',
    businessRut: '',
    businessGiro: '', // Nuevo campo para el giro
    businessContact: '', // Nuevo campo para el nombre del contacto
    businessPhone: '', // Nuevo campo para el teléfono de la empresa
  });
  const amountForFreeShipping = shippingCosts.freeShippingThreshold - cartTotal;
  const [showFreeShippingAlert, setShowFreeShippingAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFreeShippingAlert(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateOrderData('personalInfo', personalInfo);
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#222222]">Tus Datos Personales</h2>
        <p className="text-[#222222] mt-2" Style="margin-top:16px;">
          Queremos conocerte mejor para brindarte la mejor experiencia posible
        </p>
        <div className="grid grid-cols-2 gap-4 w-full" Style="margin-top:24px;">
          {['personal', 'business'].map((type) => (
            <motion.label
              key={type}
              className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all ${personalInfo.type === type ? 'bg-[#c69393] text-white' : 'bg-white text-[#c69393] border-2 border-[#c69393]'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="radio"
                className="sr-only"
                name="clientType"
                value={type}
                checked={personalInfo.type === type}
                onChange={(e) => setPersonalInfo({ ...personalInfo, type: e.target.value })}
              />
              <motion.div
                className={`w-16 h-16 mb-2 flex items-center justify-center rounded-full ${personalInfo.type === type ? 'bg-white text-[#c69393]' : 'bg-[#c69393] text-white'
                  }`}

                transition={{ duration: 0.5 }}
              >
                {type === 'personal' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                )}
              </motion.div>
              <span className="font-medium">{type === 'personal' ? 'Persona Natural' : 'Empresa'}</span>
            </motion.label>
          ))}
        </div>
        <AnimatePresence>
          {showFreeShippingAlert && amountForFreeShipping > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-[#c69393] to-[#c69393] text-white p-6 rounded-lg mt-6 shadow-lg relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-white opacity-10"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl mb-2"
                >
                  🚚✨
                </motion.div>
                <h3 className="text-xl font-bold mb-2">¡Estás cerca del envío gratis!</h3>
                <p className="text-lg mb-4">
                  Agrega solo ${amountForFreeShipping.toLocaleString()} más a tu compra
                </p>
                <motion.div
                  className="w-full bg-white rounded-full h-2 mb-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: cartTotal / shippingCosts.freeShippingThreshold }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                {/* Button hidden for now
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#c69393] px-4 py-2 rounded-full font-semibold flex items-center justify-center mx-auto"
                >
                  <span>Ver productos recomendados</span>
                  <ArrowRight className="ml-2" size={16} />
                </motion.button>
                */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {personalInfo.type === 'personal' ? (
          <>
        
            <div>
              <label htmlFor="rut" className="block text-sm font-medium mb-2 text-[#c69393]">
                RUT (para tu boleta)
              </label>
              <input
                type="text"
                id="rut"
                className="w-full p-3 border border-[#9d9d9d] rounded-lg bg-[#9d9d9d] text-[#ffffff] placeholder-[#9d9d9d] focus:ring-2 focus:ring-[#c69393]"
                value={personalInfo.rut}
                onChange={(e) => setPersonalInfo({ ...personalInfo, rut: e.target.value })}
                required
                placeholder="12.345.678-9"
              />
              <p className="text-sm text-gray-400 mt-1">
                Necesitamos tu RUT para generar la boleta de tu compra
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium mb-2 text-[#c69393]">
                Razón Social
              </label>
              <input
                type="text"
                id="businessName"
                className="w-full p-3 border border-[#9d9d9d] rounded-lg bg-[#9d9d9d] text-[#ffffff] placeholder-[#9d9d9d] focus:ring-2 focus:ring-[#c69393]"
                value={personalInfo.businessName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, businessName: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="businessRut" className="block text-sm font-medium mb-2 text-[#c69393]">
                RUT Empresa
              </label>
              <input
                type="text"
                id="businessRut"
                className="w-full p-3 border border-[#9d9d9d] rounded-lg bg-[#9d9d9d] text-[#ffffff] placeholder-[#9d9d9d] focus:ring-2 focus:ring-[#c69393]"
                value={personalInfo.businessRut}
                onChange={(e) => setPersonalInfo({ ...personalInfo, businessRut: e.target.value })}
                required
                placeholder="XX.XXX.XXX-X"
              />
            </div>
            <div>
              <label htmlFor="businessGiro" className="block text-sm font-medium mb-2 text-[#c69393]">
                Giro de la Empresa
              </label>
              <input
                type="text"
                id="businessGiro"
                className="w-full p-3 border border-[#9d9d9d] rounded-lg bg-[#9d9d9d] text-[#ffffff] placeholder-[#9d9d9d] focus:ring-2 focus:ring-[#c69393]"
                value={personalInfo.businessGiro}
                onChange={(e) => setPersonalInfo({ ...personalInfo, businessGiro: e.target.value })}
                required
                placeholder="Ej: Comercio al por menor"
              />
            </div>
           
            <div>
          <div>
          <label htmlFor="rut" className="block text-sm font-medium mb-2 text-[#c69393]">
                RUT Personal
              </label>
              <input
                type="text"
                id="rut"
                className="w-full p-3 border border-[#9d9d9d] rounded-lg bg-[#9d9d9d] text-[#ffffff] placeholder-[#9d9d9d] focus:ring-2 focus:ring-[#c69393]"
                value={personalInfo.rut}
                onChange={(e) => setPersonalInfo({ ...personalInfo, rut: e.target.value })}
                required
                placeholder="12.345.678-9"
              />
             
            </div>
            </div>
          </>
        )}
        <div>
          <div>    <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#c69393]">
            Nombre De quien Recibe
          </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 border border-[#9d9d9d] rounded-lg bg-[#9d9d9d] text-[#ffffff] placeholder-[#9d9d9d] focus:ring-2 focus:ring-[#c69393]"
              value={personalInfo.name}
              onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
              required
            />
          </div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2 mt-4 text-[#c69393]">
            Teléfono de contacto de quien recibe
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full p-3 border border-[#9d9d9d] rounded-lg bg-[#9d9d9d] text-[#ffffff] placeholder-[#9d9d9d] focus:ring-2 focus:ring-[#c69393]"
            value={personalInfo.phone}
            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
            required
            placeholder="+569XXXXXXXX"
          />
          <p className="text-sm text-gray-400 mt-1">
            Te llamaremos a este número cuando realicemos el envío de tu pedido
          </p>
        </div>
        <div className="flex justify-between pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={prevStep}
            className="px-6 py-3  bg-[#c69393] hover:bg-[#c69393]  bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 flex items-center"
          >
            <ArrowRight className="mr-2 rotate-180" size={16} />
            Volver 
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-6 py-3 bg-[#c69393] text-[#ffffff] rounded-lg hover:bg-[#c69393] flex items-center"
          >
            Continuar
            <ArrowRight className="ml-2" size={16} />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

