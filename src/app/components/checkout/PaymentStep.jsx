'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';


export default function PaymentStep({ prevStep, updateOrderData, orderData }) {
  const [paymentMethod, setPaymentMethod] = useState('woo_webpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    {
      id: 'woo_webpay',
      name: 'WebPay',
      description: 'Paga con tarjeta de crédito o débito',
      gateway: 'webpay_plus_rest'
    },
    {
      id: 'woo_mercadopago',
      name: 'Mercado Pago',
      description: 'Paga con Mercado Pago',
      gateway: 'woomercadopago_custom'
    }
  ];


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrors({});


    try {
      // Validate necessary data
      if (!orderData.personalInfo || !orderData.email || !orderData.shipping) {
        throw new Error('Faltan datos necesarios para continuar');
      }

      const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);


      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderData, selectedMethod }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la orden');
      }
  
      const createdOrder = await response.json();
     
      if (createdOrder.id) {

        try {
          const response = await fetch('/api/webpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: 10000,
              returnUrl: `${window.location.origin}/compra-completada?order_id=${createdOrder.id}`,
            }),
          });
    
          
    
          const data = await response.json();
          console.log(data)
          if (data.url) {
            window.location.href = `${data.url}?token_ws=${data.token}`;
          } else {
            alert('Error al iniciar el pago.');
          }
        } catch (error) {
          console.error(error);
          alert('Error en la transacción.');
        } finally {
          setIsProcessing(false);
        }
        
      }

    } catch (error) {
      console.error('Error creating order:', error);
      setErrors({
        submit: error.message || 'Error al procesar la orden'
      });
      setIsProcessing(false);
    }



 
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#222222]">Método de Pago</h2>
        <p className="text-[#222222] mt-2">
          Selecciona tu método de pago preferido para completar la compra.
        </p>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-[#5da872] bg-[#f0f9f2]' : 'border-gray-200'
              }`}
            onClick={() => setPaymentMethod(method.id)}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={() => setPaymentMethod(method.id)}
                className="text-[#5da872] focus:ring-[#5da872]"
              />
              <div>
                <h3 className="font-medium text-[#222222]">{method.name}</h3>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#353535] p-6 rounded-lg space-y-4"
      >
        <h3 className="text-[#5da872] font-semibold text-lg mb-4">Confirma tus datos antes de proceder al pago:</h3>
        <div className="space-y-2 text-[#ffffff]">
          {
            orderData.personalInfo.type === 'business' && (
              <>
              <p><strong>Nombre de la empresa:</strong> {orderData.personalInfo.businessName}</p>
              <p><strong>Rut Empresa:</strong> {orderData.personalInfo.businessRut}</p>
              <p><strong>Giro Empresa:</strong> {orderData.personalInfo.businessGiro}</p>
              <p><strong>Dirección de facturación:</strong> {orderData.personalInfo.businessBilling}, {orderData.personalInfo.businessComune}, {orderData.personalInfo.businessRegion} </p>
              </>
            )
          }
          <p><strong>Nombre:</strong> {orderData.personalInfo.name}</p>
          <p><strong>Email:</strong> {orderData.email}</p>
          <p><strong>Teléfono:</strong> {orderData.personalInfo.phone}</p>
          <p><strong>Dirección de envío:</strong> {orderData.shipping.address}, {orderData.shipping.ws_comuna_name}, {orderData.shipping.ws_region_name}</p>
          <p><strong>Método de envío:</strong> {orderData.shipping.type === 'delivery' ? 'Envío a domicilio' : 'Retiro en tienda'}</p>
          <p><strong>Costo de envío:</strong> ${orderData.shipping.shipping_cost.toLocaleString()}</p>
          <p><strong>Total del pedido:</strong> ${((orderData.cartTotal || 0) + (orderData.shipping.shipping_cost || 0)).toLocaleString()}</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isProcessing}
          className="w-full bg-[#5da872] text-white px-4 py-2 rounded-lg hover:bg-[#4c9660] transition-colors mt-4 disabled:opacity-50"
        >
          {isProcessing ? 'Procesando...' : 'Confirmar y proceder al pago'}
        </button>
      </motion.div>

      {errors.submit && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errors.submit}</span>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={prevStep}
          className="px-6 py-3 bg-[#397e4c] text-[#ffffff] rounded-lg hover:bg-[#5da872] disabled:opacity-50"
          disabled={isProcessing}
        >
          Revisar envío
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-[#353535] p-4 rounded-lg mt-6"
      >
        <div className="flex items-center space-x-2 text-[#5da872]">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-semibold">Pago Seguro</h3>
        </div>
        <p className="text-[#ffffff] mt-2">
          Tus pagos están protegidos por {paymentMethod === 'woo_webpay' ? 'WebPay' : 'Mercado Pago'}.
        </p>
      </motion.div>
    </motion.div>
  );
}