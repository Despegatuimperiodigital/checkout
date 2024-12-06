'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function EmailStep({ nextStep, updateOrderData, initialEmail }) {
  const greetings = [
    { text: " ¡Hola! ", phrase: " Tu envío en la región metropolitana en 48 "  },
    { text: " Hello! ", phrase: " Más de 70 años en la industria " },
    { text: " Bonjour! ", phrase: " Garantía de satisfacción del 100% " },
    { text: " Ciao! ", phrase: " Envío gratis en compras sobre $100.000 " },
    { text: " Olá! ", phrase: " Atención al cliente resolutiva" }
  ];

  const [currentGreeting, setCurrentGreeting] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [email, setEmail] = useState(initialEmail || '');


  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      const currentText = isTyping ? greetings[currentGreeting].text : greetings[currentGreeting].phrase;
      if (i < currentText.length) {
        setDisplayText((prev) => prev + currentText.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setDisplayText('');
          i = 0;
          if (!isTyping) {
            setCurrentGreeting((prev) => (prev + 1) % greetings.length);
          }
          setIsTyping(!isTyping);
        }, 2000); // Increased wait time to 2 seconds for better readability
      }
    }, 50); // Adjust typing speed here

    return () => clearInterval(typingInterval);
  }, [currentGreeting, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateOrderData('email', email);
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
        <h1 className="text-3xl font-bold text-[#222222] h-20 flex items-center justify-center"> 
          {displayText}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 0.7, repeatType: "reverse" }}
          >
            |
          </motion.span>
        </h1>
        <p className="text-[#222222] mt-2">
          Estoy emocionado de ayudarte a completar tu pedido. Comencemos con tu correo electrónico para mantenerte informado sobre tu compra.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#c69393]">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-3 border border-[#9d9d9d] rounded-lg bg-[#9d9d9d] text-[#ffffff] placeholder-[#9d9d9d] focus:ring-2 focus:ring-[#c69393]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />
        </div>
        <div className="space-y-4">
          <p className="text-[#c69393] font-semibold text-sm">
            ¡Obtén acceso exclusivo a ofertas y novedades!
          </p>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#c69393' }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-[#c69393] text-[#ffffff] py-3 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <span className="font-bold text-lg">Pasar a caja</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
          <p className="text-xs text-center text-gray-500">
            Tu privacidad es importante. Nunca compartiremos tu correo.
          </p>
        </div>
      </form>
    </motion.div>
  );
}

