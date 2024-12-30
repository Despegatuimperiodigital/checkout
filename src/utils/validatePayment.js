"use client"
import axios from 'axios';


export const validatePayment = async (setValidatePayment) => {
    try {

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token_ws');
      const orderId = urlParams.get('order_id');

      const {data} = await axios.post('/api/validate-payment', {
          token,
          orderId
      } )


      if (data.response_code === 0) {
       await axios.patch('/api/update-payment-status', {
          orderId
        })
      }

      setValidatePayment(data)
    
      
    } catch (error) {
      throw new Error("No se encontró ninguna orden")
    }

  }