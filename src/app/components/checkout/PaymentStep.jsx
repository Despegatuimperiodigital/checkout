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


      // Prepare order data for WooCommerce
        const wooCommerceOrderData = {
          payment_method: selectedMethod.gateway,
          payment_method_title: selectedMethod.name,
          set_paid: false,
          billing: {
            first_name: orderData.personalInfo.name.split(' ')[0],
            last_name: orderData.personalInfo.name.split(' ').slice(1).join(' '),
            address_1: orderData.shipping.address,
            city: orderData.shipping.ws_comuna_name,
            state: orderData.shipping.ws_region_name,
            postcode: '',
            country: 'CL',
            email: orderData.email,
            phone: orderData.personalInfo.phone,
            tipo: orderData.personalInfo.type === 'personal' ? 'Boleta' : 'Factura',
            rut: orderData.personalInfo.rut,
            // Nuevos campos
            razon_social: orderData.personalInfo.businessName || '',
            rut_empresa: orderData.personalInfo.businessRut || '',
            giro: orderData.personalInfo.businessGiro || '',
            personal_rut: orderData.personalInfo.rut,
            nombre_contacto: orderData.personalInfo.name || '', // Nombre de quien recibe
            telefono_contacto: orderData.personalInfo.phone || '', // Teléfono de quien recibe
          },
          shipping: {
            first_name: orderData.personalInfo.name.split(' ')[0],
            last_name: orderData.personalInfo.name.split(' ').slice(1).join(' '),
            address_1: orderData.shipping.address,
            city: orderData.shipping.ws_comuna_name,
            state: orderData.shipping.ws_region_name,
            postcode: '',
            country: 'CL'
          },
          line_items: orderData.cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          })),
          shipping_lines: [
            {
              method_id: parseInt(orderData.shipping.id, 10),
              method_title: parseInt(orderData.shipping.id, 10) === 8 
              ? 'Envío Directo' 
              : parseInt(orderData.shipping.id, 10) === 7 
                ? 'Envío Starken' 
                : 'Retiro en tienda',
              total: orderData.shipping.shipping_cost.toString()
            }
          ]
        };


        console.log(wooCommerceOrderData)
        // Create order in WooCommerce
        
        const consumerKey = 'ck_c925fb15f8eb67a8b1cfcfa566e0ad96ef999175';
        const consumerSecret = 'cs_6475b97f3cbe32fe52973680b2dcdac9eb193b39';
        const credentials = btoa(`${consumerKey}:${consumerSecret}`);

        const response = await fetch('https://www.decohaus.cl/wp-json/wc/v3/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`
          },
          body: JSON.stringify(wooCommerceOrderData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error creating order: ${response.status}`);
        }

        const createdOrder = await response.json();

        // Get the payment URL from the WooCommerce response
        const paymentUrl = createdOrder.payment_url;
  
        if (!paymentUrl) {
          throw new Error('No se pudo obtener la URL de pago');
        }
  
        // Reemplazar checkout por finalizar-compra manteniendo los parámetros
        const finalUrl = paymentUrl.replace('/checkout', '/finalizar-compra');
        window.parent.location.href = finalUrl;
  
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
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === method.id ? 'border-[#c69393] bg-[#f0f9f2]' : 'border-gray-200'
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
                className="text-[#c69393] focus:ring-[#c69393]"
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
        <h3 className="text-[#c69393] font-semibold text-lg mb-4">Confirma tus datos antes de proceder al pago:</h3>
        <div className="space-y-2 text-[#ffffff]">
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
          className="w-full bg-[#c69393] text-white px-4 py-2 rounded-lg hover:bg-[#4c9660] transition-colors mt-4 disabled:opacity-50"
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
          className="px-6 py-3 bg-[#397e4c] text-[#ffffff] rounded-lg hover:bg-[#c69393] disabled:opacity-50"
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
        <div className="flex items-center space-x-2 text-[#c69393]">
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