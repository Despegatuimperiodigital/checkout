'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const createWooCommerceOrder = async (orderData,shippingDetails) => {

    console.log(shippingDetails)

  const wooCommerceOrderData = {
    set_paid: false,
    status: 'pending',
    billing: {
      first_name: orderData.personalInfo.name.split(' ')[0],
      last_name: orderData.personalInfo.name.split(' ').slice(1).join(' '),
      address_1: shippingDetails.address,
      city: shippingDetails.ws_comuna_name,
      state: shippingDetails.ws_region_name,
      postcode: '',
      country: 'CL',
      email: orderData.email,
      phone: orderData.personalInfo.phone,
      tipo: orderData.personalInfo.type === 'personal' ? 'Boleta' : 'Factura',
      rut: orderData.personalInfo.rut,
      razon_social: orderData.personalInfo.businessName || '',
      rut_empresa: orderData.personalInfo.businessRut || '',
      giro: orderData.personalInfo.businessGiro || '',
      personal_rut: orderData.personalInfo.rut,
      nombre_contacto: orderData.personalInfo.name || '',
      telefono_contacto: orderData.personalInfo.phone || '',
    },
    shipping: {
      first_name: orderData.personalInfo.name.split(' ')[0],
      last_name: orderData.personalInfo.name.split(' ').slice(1).join(' '),
      address_1: shippingDetails.address,
      city: shippingDetails.ws_comuna_name,
      state: shippingDetails.ws_region_name,
      postcode: '',
      country: 'CL',
    },
    line_items: orderData.cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    })),
    shipping_lines: [
      {
        method_id: 6,
        method_title: 'coordinar por whatsapp',
        total:  '0',
      },
    ],
  };

  const consumerKey = process.env.NEXT_PUBLIC_CUSTOMERKEY;
  const consumerSecret = process.env.NEXT_PUBLIC_CUSTOMERSECRET;
  const credentials = btoa(`${consumerKey}:${consumerSecret}`);

  try {
    const response = await fetch('https://www.cruzeirogomas.cl/wp-json/wc/v3/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(wooCommerceOrderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error creating order: ${response.status}`);
    }

    const createdOrder = await response.json();
    console.log('Orden creada con éxito:', createdOrder);
    return createdOrder;
  } catch (error) {
    console.error('Error al crear la orden:', error);
    throw error;
  }
};

const WeightPopup = ({ orderData, cartWeight, shippingDetails, setShowWeightPopup }) => {
  useEffect(() => {
    const createOrder = async () => {
      try {
        console.log('Datos de la orden:', orderData,shippingDetails);
        await createWooCommerceOrder(orderData,shippingDetails);
        console.log('Orden enviada a WooCommerce con estado Pendiente.');
      } catch (error) {
        console.error('No se pudo crear la orden:', error);
        alert('Hubo un problema al crear la orden. Por favor, inténtalo más tarde.');
      }
    };

    createOrder();
  }, [orderData]);

  const handleWhatsAppClick = () => {
    if (!orderData || !orderData.cartItems) {
      alert('No hay datos del pedido disponibles.');
      return;
    }

    const productDetails = orderData.cartItems
      .map(
        (item, index) =>
          `- Producto ${index + 1}: ${item.name} (Cantidad: ${item.quantity}, Precio unitario: $${item.price.toLocaleString()})`
      )
      .join('\n') || 'No hay productos en el carrito';

    const whatsappMessage = `
Hola, estoy interesado en completar mi pedido pero el peso supera los 100 kg. Aquí están los detalles de mi orden:
- Peso del carrito: ${cartWeight} kg
- Dirección: ${shippingDetails.address || 'No especificada'}
- Región: ${shippingDetails.ws_region_name || 'No especificada'}
- Comuna: ${shippingDetails.ws_comuna_name || 'No especificada'}
- Información adicional: ${shippingDetails.additionalInfo || 'Ninguna'}
- Productos en el carrito:
${productDetails}

Por favor, ayúdenme a gestionar el envío. ¡Gracias!
`.trim();

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/56998749231?text=${encodedMessage}`;

    // Evento de seguimiento
    if (typeof gtag === 'function') {
      gtag('event', 'whatsapp_contact', {
        event_category: 'engagement',
        event_label: `Cart Weight: ${cartWeight} kg`,
        value: cartWeight,
        products: orderData.cartItems || [],
      });
    }

    if (typeof fbq === 'function') {
      fbq('trackCustom', 'WhatsAppContact', {
        cartWeight: cartWeight,
        region: shippingDetails.ws_region_name || 'No especificada',
        comuna: shippingDetails.ws_comuna_name || 'No especificada',
        products: orderData.cartItems?.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })) || [],
      });
    }

    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center relative">
        <button
          onClick={() => setShowWeightPopup(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <AlertCircle className="mx-auto mb-4 text-yellow-500" size={48} />
        <h3 className="text-xl font-bold mb-4">Estamos trabajando en tu cotización</h3>
        <p className="mb-4">
          {cartWeight > 100
            ? "Debido al peso de tu pedido, estamos trabajando para otorgarte precios de envío rápidos y económicos de manera personalizada."
            : "En este momento no tenemos métodos de envío estándar disponibles para tu ubicación."}
        </p>
        <p className="mb-4">
          Una ejecutiva de Cruzeiro Gomas te contactará en breve. Ya hemos recolectado tus datos y en unos minutos te escribirán.
        </p>
        <button onClick={handleWhatsAppClick} className="bg-[#397e4c] text-white px-4 py-2 rounded hover:bg-[#397e4c] transition-colors mb-2 w-full">
          Contactar con una ejecutiva ahora
        </button>
        <button
          onClick={() => {
            setShowWeightPopup(false);
            console.log('Guardando orden y cerrando popup...');
          }}
          className="bg-[#397e4c] text-white px-4 py-2 rounded hover:bg-[#397e4c] transition-colors w-full"
        >
          Guardar orden
        </button>
      </div>
    </motion.div>
  );
};

export default WeightPopup;

