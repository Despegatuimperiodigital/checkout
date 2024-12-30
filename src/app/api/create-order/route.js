import { createWooCommerceOrder } from '../../../utils/createWooCommerceOrderData';
export async function POST(req) {
    try {
      // Parsear los datos enviados en el cuerpo de la solicitud
      const body = await req.json();
  
      // Validar los datos de entrada
      const { orderData, selectedMethod } = body;
      if (!orderData || !selectedMethod) {
        return new Response(JSON.stringify({ error: 'Datos incompletos' }), { status: 400 });
      }
  
      // Crear la orden usando la función utilitaria
      const createdOrder = await createWooCommerceOrder(orderData, selectedMethod);
  
      // Retornar la respuesta con el resultado
      return new Response(JSON.stringify(createdOrder), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error('Error al crear la orden:', error.message);
      return new Response(
        JSON.stringify({ error: error.message || 'Error al procesar la solicitud' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }