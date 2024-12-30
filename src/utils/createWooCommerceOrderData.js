import axios from 'axios';

export const createWooCommerceOrder  = async (orderData, selectedMethod) => {
  try {
    // WooCommerce credentials
    const consumerKey = process.env.NEXT_PUBLIC_CUSTOMERKEY;
    const consumerSecret = process.env.NEXT_PUBLIC_CUSTOMERSECRET;
    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    // WooCommerce order data
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
        address_1: orderData.shipping.address,
        city: orderData.shipping.ws_comuna_name,
        state: orderData.shipping.ws_region_name,
        postcode: '',
        country: 'CL',
      },
      line_items: orderData.cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
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


    // Make the API request to WooCommerce
    const response = await axios.post(
      'https://www.cruzeirogomas.cl/wp-json/wc/v3/orders',
      wooCommerceOrderData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    // Return the created order
    return response.data;
  } catch (error) {
    // Handle errors gracefully
    if (error.response) {
      console.error('WooCommerce API Error:', error.response.data);
      throw new Error(error.response.data.message || `Error creating order: ${error.response.status}`);
    } else if (error.request) {
      console.error('No response received from WooCommerce:', error.request);
      throw new Error('No response received from WooCommerce');
    } else {
      console.error('Error in request setup:', error.message);
      throw new Error(error.message);
    }
  }
};

