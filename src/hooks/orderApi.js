export async function fetchOrderData(orderId, orderKey) {
    try {
console.log('estam,os')

        const consumerKey = 'ck_688c1f71bf9e218c6ecb582fde9725b3e08da3d9';
      const consumerSecret = 'cs_f81a648e232d4467208162e18b89d8fdefbb0592';
      const credentials = btoa(`${consumerKey}:${consumerSecret}`);

      const response = await fetch(`https://www.cruzeirogomas.cl/wp-json/wc/v3/orders/${'13925/?key=wc_order_kUJoWOSNfmTET'}`, {
        headers: {
             'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener la orden');
      }
     
      const data = await response.json();
     console.log(data)
     
      return formatOrderData(data);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  
  function formatOrderData(orderData) {
    return {
      orderNumber: orderData.number,
      personalInfo: {
        name: orderData.billing.first_name + ' ' + orderData.billing.last_name,
        email: orderData.billing.email,
        phone: orderData.billing.phone
      },
      shipping: {
        address: orderData.shipping.address_1,
        commune: orderData.shipping.city,
        region: orderData.shipping.state,
        cost: parseFloat(orderData.shipping_total)
      },
      payment: {
        method: orderData.payment_method_title,
        number: orderData.payment_method === 'credit_card' ? '****' + orderData.meta_data.find(m => m.key === '_card_number')?.value?.slice(-4) : ''
      },
      cartTotal: parseFloat(orderData.total),
      items: orderData.line_items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price)
      }))
    };
  }