import { NextResponse } from 'next/server';
import axios from 'axios';

  const consumerKey = process.env.NEXT_PUBLIC_CUSTOMERKEY;
  const consumerSecret = process.env.NEXT_PUBLIC_CUSTOMERSECRET;
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');



export async function PATCH(req) {  

    try {
      const {orderId} = await req.json()

      if (!orderId) {
        return NextResponse.json({ error: 'El parámetro orderId es necesario.' }, { status: 400 });
      }

        const {data} = await axios.patch(
            `https://www.cruzeirogomas.cl/wp-json/wc/v3/orders/${orderId}`, {
                status: 'processing'
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${credentials}`,
              },
            }
          );

          return NextResponse.json(data);

          
    } catch (error) {
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


}