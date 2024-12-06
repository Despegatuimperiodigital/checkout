'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const OrdersTimeline = ({ orders }) => {
  const sortedOrders = [...orders].sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Línea de Tiempo de Órdenes</h2>
      <div className="space-y-4">
        {sortedOrders.map((order, index) => (
          <motion.div
            key={order.OrderId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center"
          >
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mr-4"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Orden #{order.Order.OrderId}</p>
              <p className="text-sm text-gray-500">{format(new Date(order.Order.CreatedAt), 'dd/MM/yyyy HH:mm')}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OrdersTimeline;

