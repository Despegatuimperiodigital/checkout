import { useState, useMemo } from 'react'; 
import { mockCart } from './mockCart';  

const useCartData = () => {
   const [cartData, setCartData] = useState({
     items: [],
     total: 0,
     subtotal: 0,
     shipping: 0,
     weight: 0,
     isLoading: true,
     error: null,
   });

   // Función para cargar los datos del carrito
   const loadCartData = () => {
     try {
       // En desarrollo, usar datos de prueba
       if (process.env.NODE_ENV === 'development' && !window.location.search.includes('cart=')) {
         console.log('Using mock data');
         return {
           items: mockCart.items.map(item => ({
             id: item.product_id,
             product_id: item.product_id,
             name: item.data.name,
             price: parseFloat(item.data.price),
             weight: parseFloat(item.data.weight || 0),
             subtotal: parseFloat(item.line_total),
             images: item.data.images.thumbnail,
             variation: item.variation,
             variation_id: item.variation_id
           })),
           total: parseFloat(mockCart.totals.total_price),
           subtotal: parseFloat(mockCart.totals.total_items),
           shipping: parseFloat(mockCart.totals.total_shipping),
           weight: mockCart.items.reduce((total, item) =>
              total + (parseFloat(item.data.weight || 0) * item.quantity), 0),
           isLoading: false,
           error: null,
         };
       }
       
       // Verificar si window está disponible
       if (typeof window === 'undefined') return null;
       
       const params = new URLSearchParams(window.location.search);
       const encodedCart = params.get('cart');
       
       if (!encodedCart) {
         return {
           ...cartData,
           isLoading: false,
           error: 'No cart data found in URL'
         };
       }
       
       console.log('Encoded cart:', encodedCart);
       const decodedCart = JSON.parse(atob(decodeURIComponent(encodedCart)));
       console.log('Decoded cart:', decodedCart);
       
       return {
         items: decodedCart.items.map(item => ({
           id: item.product_id,
           name: item.data.name,
           price: parseFloat(item.data.price),
           quantity: item.quantity,
           weight: parseFloat(item.data.weight || 0),
           subtotal: parseFloat(item.line_total),
           images: item.data.images,
           variation: item.variation,
           variation_id: item.variation_id
         })),
         total: parseFloat(decodedCart.totals.total_price),
         subtotal: parseFloat(decodedCart.totals.total_items),
         shipping: parseFloat(decodedCart.totals.total_shipping),
         weight: decodedCart.items.reduce((total, item) =>
            total + (parseFloat(item.data.weight || 0) * item.quantity), 0),
         isLoading: false,
         error: null,
       };
     } catch (error) {
       console.error('Error loading cart:', error);
       return {
         ...cartData,
         isLoading: false,
         error: error.message || 'Error loading cart data'
       };
     }
   };

   // Cargar datos del carrito solo una vez usando useMemo
   const memoizedCartData = useMemo(() => {
     const cartDetails = loadCartData();
     if (cartDetails) {
       setCartData(cartDetails);
     }
     return cartDetails;
   }, []); // Array de dependencias vacío para que solo se ejecute una vez

   return cartData;
};

export default useCartData;
