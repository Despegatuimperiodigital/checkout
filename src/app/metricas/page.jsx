'use client';


import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Package, DollarSign, Calendar, Truck } from 'lucide-react';
import OrdersChart from './orderCharts';
import OrdersTimeline from './orderTimeline';

import React, { useState, useEffect } from 'react';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('');
  // Función para obtener las órdenes desde el proxy
  

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        'api/proxy?Action=GetOrders&CreatedAfter=2024-06-05T00%3A00%3A00&Format=JSON&Timestamp=2024-12-05T23%3A28%3A29-03%3A00&UserID=ventasdigital2%40cruzeirogomas.cl&Version=1.0&Signature=71f0d205deef0f875d24455bad56460b84dfcdb055b2e5e305d3c6044ec93bf3'
      );
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      const ordersData = data?.SuccessResponse?.Body?.Orders || [];
      
      console.log('Fetched Orders:', ordersData); // Verifica los datos antes de actualizar
      setOrders(ordersData); // Ahora actualiza el estado
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener las órdenes:', err);
      setError('No se pudieron cargar las órdenes.');
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const loadOrders = async () => {
      await fetchOrders(); // Asegura que la llamada completa antes de continuar
    };
  
    loadOrders(); // Ejecuta la función
  }, []);

  if (loading) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center h-screen"
    >
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </motion.div>
  );
  if (error) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-4 text-red-500"
    >
      {error}
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold mb-6"
      >
        Dashboard de Órdenes
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <OrdersChart orders={orders} />
        <OrdersTimeline orders={orders} />
      </div>

      {orders.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          No hay órdenes disponibles.
        </motion.p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto bg-white rounded-lg shadow"
        >
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {/* Update 3 */}
                  Fecha de Creación
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="ml-2 p-1 text-xs border rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método de Pago</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Envío</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.filter(order => { // Update 4
                if (!dateFilter) return true;
                const orderDate = new Date(order.Order.CreatedAt).toISOString().split('T')[0];
                return orderDate === dateFilter;
              }).map((order, index) => (
                <motion.tr
                  key={order.Order.OrderId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.Order.OrderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.Order.CustomerFirstName} {order.Order.CustomerLastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <DollarSign className="inline-block w-4 h-4 mr-1" />
                    ${order.Order.Price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.Order.Statuses.Status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.Order.Statuses.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.Order.PaymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Package className="inline-block w-4 h-4 mr-1" />
                    {order.Order.ItemsCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Truck className="inline-block w-4 h-4 mr-1" />
                    ${order.Order.ShippingFeeTotal}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};


export default OrdersList;
