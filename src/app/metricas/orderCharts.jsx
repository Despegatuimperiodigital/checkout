'use client';

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { format, parseISO, startOfWeek, endOfWeek } from 'date-fns';

const OrdersChart = ({ orders }) => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 50;

  const aggregateDataByWeek = (data) => {
    const aggregatedData = data.reduce((acc, order) => {
      const orderDate = parseISO(order.Order.CreatedAt);
      const weekStart = startOfWeek(orderDate);
      const weekKey = format(weekStart, 'yyyy-MM-dd');

      if (!acc[weekKey]) {
        acc[weekKey] = {
          weekStart: weekKey,
          precioVenta: 0,
          costoEnvio: 0,
          totalGeneral: 0,
          totalProducto: 0,
          count: 0,
        };
      }

      acc[weekKey].precioVenta += parseFloat(order.Order.Price);
      acc[weekKey].costoEnvio += parseFloat(order.Order.ShippingFeeTotal.replace(',', ''));
      acc[weekKey].totalGeneral += parseFloat(order.Order.GrandTotal.replace(',', ''));
      acc[weekKey].totalProducto += parseFloat(order.Order.ProductTotal.replace(',', ''));
      acc[weekKey].count += 1;

      return acc;
    }, {});

    return Object.values(aggregatedData).map(week => ({
      ...week,
      precioVenta: week.precioVenta / week.count,
      costoEnvio: week.costoEnvio / week.count,
      totalGeneral: week.totalGeneral / week.count,
      totalProducto: week.totalProducto / week.count,
    }));
  };

  const filteredAndAggregatedData = useMemo(() => {
    const filtered = orders.filter(order => {
      const orderDate = parseISO(order.Order.CreatedAt);
      const orderPrice = parseFloat(order.Order.Price);

      const dateInRange = (dateRange.start && dateRange.end) 
        ? orderDate >= parseISO(dateRange.start) && orderDate <= parseISO(dateRange.end)
        : true;

      const priceInRange = (priceRange.min && priceRange.max)
        ? orderPrice >= parseFloat(priceRange.min) && orderPrice <= parseFloat(priceRange.max)
        : true;

      return dateInRange && priceInRange;
    });

    return aggregateDataByWeek(filtered);
  }, [orders, dateRange, priceRange]);

  const paginatedData = filteredAndAggregatedData.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const totalPages = Math.ceil(filteredAndAggregatedData.length / ordersPerPage);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-bold">Semana del {label}</p>
          {payload.map((pld, index) => (
            <p key={index} style={{color: pld.color}}>
              {pld.name}: {pld.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Resumen Detallado de Órdenes (Promedio Semanal)</h2>
      
      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
          <input
            type="date"
            id="startDate"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fecha Fin</label>
          <input
            type="date"
            id="endDate"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Precio Mínimo</label>
          <input
            type="number"
            id="minPrice"
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Precio Máximo</label>
          <input
            type="number"
            id="maxPrice"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={paginatedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="weekStart" label={{ value: 'Semana', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Monto Promedio (CLP)', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="precioVenta" stroke="#8884d8" name="Precio de Venta" />
          <Line type="monotone" dataKey="costoEnvio" stroke="#82ca9d" name="Costo de Envío" />
          <Line type="monotone" dataKey="totalGeneral" stroke="#ff7300" name="Total General" />
          <Line type="monotone" dataKey="totalProducto" stroke="#0088fe" name="Total Producto" />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Siguiente
        </button>
      </div>
    </motion.div>
  );
};

export default OrdersChart;

