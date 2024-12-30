
import axios from 'axios';


export const getOrder = async (setOrderData) => {
    try {

      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('order_id');

      const {data} = await axios.get('/api/get-order', {
        params: {
          orderId
        }
      } )

      setOrderData(data)
    
      
    } catch (error) {
      throw new Error("No se encontró ninguna orden")
    }

  }